import type { ITeam } from "@repo/types";

import { queryKey } from "@/configs";
import type { AppNameSpace } from "@/hooks/useAppNameSpace";

export type TeamCacheContext = {
  previousData?: ITeam[];
};

export function readTeamSnapshot(ns: AppNameSpace): ITeam[] | undefined {
  return ns.queryClient.getQueryData<ITeam[]>(queryKey.teams.list());
}

export const teamsRoot = queryKey.teamsRoot();
