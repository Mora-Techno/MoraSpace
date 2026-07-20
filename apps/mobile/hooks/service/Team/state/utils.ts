import type { ITeam } from '@repo/types';
import type { QueryClient } from '@tanstack/react-query';

import { queryKey } from '@/config/query-key';

export type TeamCacheContext = {
  previousData?: ITeam[];
};

export function readTeamSnapshot(queryClient: QueryClient): ITeam[] | undefined {
  return queryClient.getQueryData<ITeam[]>(queryKey.teams.list());
}
