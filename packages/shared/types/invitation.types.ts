export interface IInvitation {
  id: string;
  companyId: string;
  email: string;
  invitedBy: string;
  positionId: string | null;
  roleId: string | null;
  token: string;
  expiredAt: string;
  acceptedAt: string | null;
}

export type PickCreateInvitation = {
  email: string;
  positionId?: string;
  roleId?: string;
};

export type PickAcceptInvitation = {
  token: string;
};

export type InvitationQuery = {
  search?: string;
  page?: number;
  limit?: number;
  status?: string;
  positionId?: string;
  startDate?: string;
  endDate?: string;
};

export type PickRejectInvitation = {
  token: string;
};
