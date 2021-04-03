import { selector } from '@performance-artist/fp-ts-adt';
import { pipe } from 'fp-ts/lib/pipeable';
import { LoggerContainer } from 'logger/view/logger.container';
import React from 'react';
import { TodoLayoutContainer } from 'todo/view/containers/layout';

export const Root = pipe(
  selector.combine(TodoLayoutContainer, LoggerContainer),
  selector.map(([TodoLayoutContainer, LoggerContainer]) => () => (
    <div>
      <TodoLayoutContainer />
      <LoggerContainer />
    </div>
  )),
);
