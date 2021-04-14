import { createElement, memo, useEffect, useMemo } from 'react';
import { pipe } from 'fp-ts/lib/pipeable';
import { selector } from '@performance-artist/fp-ts-adt';
import { makeTodoSource } from '../todo.source';
import { TodoLayout } from '../components/layout';
import { todoMedium } from 'todo/todo.medium';
import { useSubscription, useBehavior } from '@performance-artist/react-utils';
import { medium, source } from '@performance-artist/medium';
import { fromSource } from 'logger/logger.medium';

export const TodoLayoutContainer = pipe(
  selector.combine(
    selector.defer(TodoLayout, 'todoSource'),
    selector.defer(todoMedium, 'todoSource'),
    fromSource,
  ),
  selector.map(([TodoLayout, todoMedium, fromSource]) =>
    memo(() => {
      const todoSource = useMemo(makeTodoSource, []);
      useSubscription(() => source.subscribe(todoSource), [todoSource]);
      const todoLogger = fromSource(todoSource);
      useSubscription(
        () => pipe(todoLogger, medium.applyEffects, e => e.subscribe()),
        [],
      );
      useSubscription(() => pipe(todoMedium, medium.run({ todoSource })), [
        todoSource,
      ]);

      const Component = useMemo(() => TodoLayout.run({ todoSource }), [
        todoSource,
      ]);
      const state = useBehavior(todoSource.state);

      useEffect(() => {
        todoSource.on.getTodos.next();
      }, []);

      return createElement(Component, {
        todos: state.todos,
        onToggleChecked: todoSource.on.toggleDone.next,
      });
    }),
  ),
);
