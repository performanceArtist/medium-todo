import { createElement, memo, useEffect, useMemo } from 'react';
import { pipe } from 'fp-ts/lib/pipeable';
import { selector } from '@performance-artist/fp-ts-adt';
import { makeTodoSource } from '../todo.source';
import { TodoLayout } from '../components/layout';
import { todoMedium } from 'todo/todo.medium';
import { useSubscription, useBehavior } from '@performance-artist/react-utils';
import { medium } from '@performance-artist/medium';

export const TodoLayoutContainer = pipe(
  selector.combine(
    selector.defer(TodoLayout, 'todoSource'),
    selector.defer(todoMedium, 'todoSource'),
  ),
  selector.map(([TodoLayout, todoMedium]) =>
    memo(() => {
      const todoSource = useMemo(makeTodoSource, []);
      useSubscription(() => pipe(todoMedium, medium.run({ todoSource })), [
        todoSource,
      ]);

      const Component = useMemo(() => TodoLayout.run({ todoSource }), [
        todoSource,
      ]);
      const state = useBehavior(todoSource.state);

      useEffect(() => {
        todoSource.dispatch('getTodos')();
      }, []);

      return createElement(Component, {
        todos: state.todos,
        onToggleChecked: todoSource.dispatch('toggleDone'),
      });
    }),
  ),
);
