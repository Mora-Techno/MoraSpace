import type { CompanyRole } from "./company.types";
import type { IAuth } from "./auth.types";

export interface IWorkstation {
  id: string;
  name: string;
  desc: string;
  companyId: string;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IWorkstationMember {
  id: string;
  workstationId: string;
  userId: string;
  role: CompanyRole;
  joinedAt: Date;
}

export type PickCreateWorkstation = Pick<IWorkstation, "name">;
export type PickUpdateWorkstation = Partial<Pick<IWorkstation, "name">>;
export type WorkstationParams = Pick<IWorkstation, "id">;

export type PickInviteMember = Pick<IAuth, "email" | "fullName"> &
  Partial<Pick<IWorkstationMember, "role">>;

export interface WorkstationMember extends Pick<
  IWorkstationMember,
  "id" | "workstationId" | "userId" | "role"
> {
  joinedAt: string;
  user: Pick<IAuth, "id" | "email" | "fullName"> & {
    companyRole: CompanyRole | string;
  };
}

export interface Workstation extends Pick<
  IWorkstation,
  "id" | "name" | "companyId" | "createdById"
> {
  memberCount: number;
  maxMembers: number;
  createdAt: string;
  updatedAt: string;
  members?: WorkstationMember[];
}
