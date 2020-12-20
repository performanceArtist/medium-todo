import { requestResult, RequestResult } from '@performance-artist/fp-ts-adt';
import * as rx from 'rxjs';

export type Todo = {
  id: number;
  text: string;
  done: boolean;
};

export type TodoApi = {
  getTodos: () => rx.Observable<RequestResult<Todo[]>>;
  updateTodo: (todo: Todo) => void;
};

export const makeTodoApi = (): TodoApi => ({
  getTodos: () =>
    rx.of(
      requestResult.success([
        { id: 0, text: 'Todo1', done: false },
        { id: 1, text: 'Todo2', done: false },
      ]),
    ),
  updateTodo: todo => console.log('Update todo:', todo),
});
