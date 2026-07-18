import type { Team } from '@repo/types';
import type { QueryClient } from '@tanstack/react-query';

import { queryKey } from '@/config/query-key';

export type TeamCacheContext = {
  previousData?: Team[];
};

export function readTeamSnapshot(queryClient: QueryClient): Team[] | undefined {
  return queryClient.getQueryData<Team[]>(queryKey.teams.list());
}
