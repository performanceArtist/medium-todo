import { RequestResult } from '@performance-artist/fp-ts-adt';
import { either } from 'fp-ts';
import { pipe } from 'fp-ts/lib/pipeable';
import React, { memo } from 'react';

type StatsProps = {
  stats: RequestResult<{ total: number; done: number }>;
};

export const Stats = memo<StatsProps>(props => {
  const { stats } = props;

  return pipe(
    stats,
    either.fold(
      () => <div>Loading...</div>,
      ({ total, done }) => (
        <div>
          Total todos: {total}, {done} done.
        </div>
      ),
    ),
  );
});
