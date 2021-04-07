import { carrier, effect, medium, Source } from '@performance-artist/medium';
import { record } from 'fp-ts';
import { pipe } from 'fp-ts/lib/pipeable';
import { LoggerSource } from './view/logger.source';

type LoggerDeps = {
  loggerSource: LoggerSource;
};

export const fromSource = <S extends Source<any, any>>(s: S) =>
  medium.map(medium.id<LoggerDeps>()('loggerSource'), deps => {
    const { loggerSource } = deps;

    const action$ = pipe(
      s.on,
      record.map(({ value }) => value),
      carrier.mergeInputs,
    );

    const addLogEntry = pipe(
      action$,
      effect.partial(({ type, payload }) =>
        loggerSource.state.modify(state => ({
          ...state,
          sourceEntries: state.sourceEntries.concat({ tag: type, payload }),
        })),
      ),
    );

    const consoleLog = pipe(
      action$,
      effect.partial(action =>
        console.log('[in]', action.type, action.payload),
      ),
    );

    return effect.tagObject({ addLogEntry, consoleLog });
  });

export const fromMedium = medium.decorateAny(
  medium.id<LoggerDeps>()('loggerSource'),
)((deps, [_, effects]) => {
  const { loggerSource } = deps;
  const action$ = carrier.mergeInputs(effects);

  const addLogEntry = pipe(
    action$,
    effect.partial(({ type, payload }) =>
      loggerSource.state.modify(state => ({
        ...state,
        mediumEntries: state.mediumEntries.concat({
          tag: String(type),
          payload,
        }),
      })),
    ),
  );

  const consoleLog = pipe(
    action$,
    effect.partial(action => console.log('[out]', action.type, action.payload)),
  );

  return effect.tagObject({ addLogEntry, consoleLog });
});
