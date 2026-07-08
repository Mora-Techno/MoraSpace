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

export type PickUpdateTeam = Partial<Omit<PickCreateTeam, 'departmentId'>>;

export type PickAddTeamMember = {
  companyMemberId: string;
  isLeader?: boolean;
};
