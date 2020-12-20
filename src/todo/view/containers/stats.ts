import { selector } from '@performance-artist/fp-ts-adt';
import { pipe } from 'fp-ts/lib/pipeable';
import { useBehaviorSelector, withHook } from '@performance-artist/react-utils';
import { Stats } from '../components/stats';
import { todoSelectors, TodoSource } from '../todo.source';

type Deps = {
  todoSource: TodoSource;
};
export const StatsContainer = pipe(
  selector.keys<Deps>()('todoSource'),
  selector.map(deps =>
    withHook(Stats)(() => {
      const { todoSource } = deps;

      const stats = useBehaviorSelector(
        todoSource.state,
        todoSelectors.getStats,
      );

      return { stats };
    }),
  ),
);
