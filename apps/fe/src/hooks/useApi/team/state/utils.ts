import type { Team } from '@repo/types';

import { queryKey } from '@/configs';
import type { AppNameSpace } from '@/hooks/useAppNameSpace';

export type TeamCacheContext = {
  previousData?: Team[];
};

export function readTeamSnapshot(ns: AppNameSpace): Team[] | undefined {
  return ns.queryClient.getQueryData<Team[]>(queryKey.teams.list());
}
