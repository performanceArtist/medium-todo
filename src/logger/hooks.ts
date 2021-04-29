import { selector } from '@performance-artist/fp-ts-adt';
import { EffectTree, medium, Source } from '@performance-artist/medium';
import { AnyAction } from '@performance-artist/medium';
import { record } from 'fp-ts';
import { pipe } from 'fp-ts/lib/pipeable';
import { LoggerSource } from './view/logger.source';
import * as rxo from 'rxjs/operators';
import * as rx from 'rxjs';
import { useMemo } from 'react';
import { useSubscription } from '@performance-artist/react-utils';

type LoggerDeps = {
  loggerSource: LoggerSource;
  logSource: (action: AnyAction) => void;
  logMedium: (action: AnyAction) => void;
};

const deps = selector.keys<LoggerDeps>()(
  'loggerSource',
  'logMedium',
  'logSource',
);

export const useSourceLogger = pipe(
  deps,
  selector.map(deps => (s: Source<any, any>) => {
    const { loggerSource, logSource } = deps;

    const log$ = useMemo(() => {
      const action$ = pipe(
        s.on,
        record.map(({ value }) => value),
        medium.mergeInputs,
      );

      const addLogEntry$ = pipe(
        action$,
        rxo.tap(({ type, payload }) =>
          loggerSource.state.modify(state => ({
            ...state,
            sourceEntries: state.sourceEntries.concat({ tag: type, payload }),
          })),
        ),
      );

      const consoleLog$ = pipe(action$, rxo.tap(logSource));

      return rx.merge(addLogEntry$, consoleLog$);
    }, [s]);

    useSubscription(() => log$.subscribe(), [log$]);
  }),
);

export const useEffectsLogger = pipe(
  deps,
  selector.map(deps => (e: EffectTree) => {
    const { loggerSource, logMedium } = deps;

    const log$ = useMemo(() => {
      const action$ = medium.mergeInputs(e);

      const addLogEntry$ = pipe(
        action$,
        rxo.tap(({ type, payload }) =>
          loggerSource.state.modify(state => ({
            ...state,
            mediumEntries: state.mediumEntries.concat({
              tag: String(type),
              payload,
            }),
          })),
        ),
      );

      const consoleLog$ = pipe(action$, rxo.tap(logMedium));

      return rx.merge(addLogEntry$, consoleLog$);
    }, [e]);

    useSubscription(() => log$.subscribe(), [log$]);
  }),
);
