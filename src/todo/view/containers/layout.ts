import { createElement, memo, useEffect, useMemo } from 'react';
import { pipe } from 'fp-ts/lib/pipeable';
import { selector } from '@performance-artist/fp-ts-adt';
import { makeTodoSource } from '../todo.source';
import { TodoLayout } from '../components/layout';
import { todoMedium } from 'todo/todo.medium';
import { useSubscription, useBehavior } from '@performance-artist/react-utils';
import { medium, source } from '@performance-artist/medium';
import { useEffectsLogger, useSourceLogger } from 'logger/hooks';

export const TodoLayoutContainer = pipe(
  selector.combine(
    selector.defer(TodoLayout, 'todoSource'),
    selector.defer(todoMedium, 'todoSource'),
    useSourceLogger,
    useEffectsLogger,
  ),
  selector.map(([TodoLayout, todoMedium, useSourceLogger, useEffectsLogger]) =>
    memo(() => {
      const todoSource = useMemo(makeTodoSource, []);
      useSubscription(() => source.subscribe(todoSource), [todoSource]);
      useSourceLogger(todoSource);

      const todoEffects = todoMedium.run({ todoSource });
      useSubscription(() => medium.subscribe(todoEffects), [todoEffects]);
      useEffectsLogger(todoEffects);

      const Component = useMemo(() => TodoLayout.run({ todoSource }), [
        todoSource,
      ]);

      const state = useBehavior(todoSource.state);

      useEffect(() => {
        todoSource.on.mount.next();
      }, []);

      return createElement(Component, {
        todos: state.todos,
        onToggleChecked: todoSource.on.toggleDone.next,
      });
    }),
  ),
);
