import { selector } from '@performance-artist/fp-ts-adt';
import { pipe } from 'fp-ts/lib/pipeable';
import React from 'react';
import { TodoLayoutContainer } from 'todo/view/containers/layout';

export const Root = pipe(
  TodoLayoutContainer,
  selector.map(TodoLayoutContainer => () => (
    <div>
      <TodoLayoutContainer />
    </div>
  )),
);
