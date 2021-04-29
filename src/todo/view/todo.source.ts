import { source, SourceOf } from '@performance-artist/medium';
import {
  requestResult,
  RequestResult,
  selector,
} from '@performance-artist/fp-ts-adt';
import { pipe } from 'fp-ts/lib/pipeable';
import { array, either } from 'fp-ts';

export type Todo = {
  id: number;
  text: string;
  done: boolean;
};

export type TodoState = {
  todos: RequestResult<Todo[]>;
};

const initialState: TodoState = {
  todos: requestResult.initial,
};

export type TodoSource = SourceOf<
  TodoState,
  {
    mount: void;
    toggleDone: number;
  }
>;

export const makeTodoSource = (): TodoSource =>
  source.create(initialState, {
    mount: source.input(),
    toggleDone: state => id => ({
      ...state,
      todos: pipe(
        state.todos,
        either.map(
          array.map(todo =>
            todo.id === id ? { ...todo, done: !todo.done } : todo,
          ),
        ),
      ),
    }),
  });

const getStats = pipe(
  selector.focus<TodoState>()('todos'),
  selector.map(
    either.map(todos => ({
      total: todos.length,
      done: pipe(
        todos,
        array.reduce(0, (acc, todo) => (todo.done ? acc + 1 : acc)),
      ),
    })),
  ),
);

export const todoSelectors = { getStats };
