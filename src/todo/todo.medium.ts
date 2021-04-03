import { effect, medium } from '@performance-artist/medium';
import { pipe } from 'fp-ts/lib/pipeable';
import * as rxo from 'rxjs/operators';
import { array, option } from 'fp-ts';
import { TodoSource } from './view/todo.source';
import { TodoApi } from './todo.api';
import { fromMedium } from 'logger/logger.medium';

type Deps = {
  todoApi: TodoApi;
  todoSource: TodoSource;
};

export const rawTodoMedium = medium.map(
  medium.id<Deps>()('todoApi', 'todoSource'),
  (deps, on) => {
    const { todoApi, todoSource } = deps;

    const setTodos = pipe(
      on(todoSource.create('getTodos')),
      rxo.switchMap(todoApi.getTodos),
      effect.tag('setTodos', todos =>
        todoSource.state.modify(state => ({ ...state, todos })),
      ),
    );

    const updateTodo = pipe(
      on(todoSource.create('toggleDone')),
      rxo.withLatestFrom(todoSource.state.value$),
      rxo.map(([id, state]) =>
        pipe(
          state.todos,
          option.fromEither,
          option.chain(array.findFirst(todo => todo.id === id)),
        ),
      ),
      effect.tag('updateTodo', todo => {
        if (option.isSome(todo)) {
          todoApi.updateTodo(todo.value);
        }
      }),
    );

    return {
      setTodos,
      updateTodo,
    };
  },
);

export const todoMedium = fromMedium(rawTodoMedium);
