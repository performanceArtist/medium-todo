import { source } from '@performance-artist/medium';
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

export const makeTodoSource = () =>
  source.create(
    'todo',
    initialState,
  )({
    getTodos: source.input<void>(),
    toggleDone: state => (id: number) => ({
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

export type TodoSource = ReturnType<typeof makeTodoSource>;

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
