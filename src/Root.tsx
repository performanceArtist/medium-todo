import { selector } from '@performance-artist/fp-ts-adt';
import { source } from '@performance-artist/medium';
import { useSubscription } from '@performance-artist/react-utils';
import { pipe } from 'fp-ts/lib/pipeable';
import { LoggerContainer } from 'logger/view/logger.container';
import { makeLoggerSource } from 'logger/view/logger.source';
import React, { createElement, memo, useMemo } from 'react';
import { TodoLayoutContainer } from 'todo/view/containers/layout';

const RootComponent = pipe(
  selector.combine(TodoLayoutContainer, LoggerContainer),
  selector.map(([TodoLayoutContainer, LoggerContainer]) => () => (
    <div>
      <TodoLayoutContainer />
      <LoggerContainer />
    </div>
  )),
);

export const Root = pipe(
  selector.defer(RootComponent, 'loggerSource'),
  selector.map(Component =>
    memo(() => {
      const loggerSource = useMemo(makeLoggerSource, []);
      useSubscription(() => source.subscribe(loggerSource), [loggerSource]);
      const Root = useMemo(() => Component.run({ loggerSource }), [
        loggerSource,
      ]);

      return createElement(Root);
    }),
  ),
);
