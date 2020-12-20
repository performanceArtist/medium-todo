import React from 'react';
import { RequestResult, selector } from '@performance-artist/fp-ts-adt';
import { memo } from 'react';
import { Todo } from '../todo.source';
import { either } from 'fp-ts';
import { pipe } from 'fp-ts/lib/pipeable';
import { StatsContainer } from '../containers/stats';

type TodoLayoutProps = {
  todos: RequestResult<Todo[]>;
  onToggleChecked: (id: number) => void;
};

export const TodoLayout = pipe(
  StatsContainer,
  selector.map(StatsContainer =>
    memo<TodoLayoutProps>(props => {
      const { todos, onToggleChecked } = props;

      return (
        <div>
          <h2>Statistics:</h2>
          <StatsContainer />
          <h2>Todos:</h2>
          {pipe(
            todos,
            either.fold(
              () => <div>Loading...</div>,
              todos => (
                <div>
                  {todos.map(todo => (
                    <div key={todo.id}>
                      {todo.text}
                      <input
                        checked={todo.done}
                        onChange={() => onToggleChecked(todo.id)}
                        type="checkbox"
                      ></input>
                    </div>
                  ))}
                </div>
              ),
            ),
          )}
        </div>
      );
    }),
  ),
);
