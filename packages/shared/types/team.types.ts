export interface ITeam {
  id: string;
  departmentId: string;
  leaderId: string | null;
  name: string;
  description: string | null;
}

export type PickCreateTeam = {
  departmentId: string;
  name: string;
  description?: string;
  leaderId?: string;
};

export type PickUpdateTeam = Partial<Omit<PickCreateTeam, "departmentId">>;

export type TeamQuery = {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  departmentId?: string;
  leaderId?: string;
  startDate?: string;
  endDate?: string;
};

export type PickAddTeamMember = {
  companyMemberId: string;
  isLeader?: boolean;
};
