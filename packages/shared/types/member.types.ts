export type CompanyMemberStatus = 'active' | 'inactive' | 'pending' | 'resigned';

export interface ICompanyMember {
  id: string;
  companyId: string;
  userId: string;
  employeeCode: string | null;
  positionId: string | null;
  employmentTypeId: string | null;
  joinedAt: string | null;
  resignedAt: string | null;
  status: CompanyMemberStatus;
}

export type PickUpdateCompanyMember = {
  employeeCode?: string;
  positionId?: string;
  employmentTypeId?: string;
  status?: CompanyMemberStatus;
  joinedAt?: string;
  resignedAt?: string;
};

export type PickUpdateMemberProfile = {
  gender?: string;
  birthday?: string;
  address?: string;
  emergencyContact?: string;
  bio?: string;
};

export type MemberContactItem = {
  type: string;
  value: string;
};

export type PickUpdateMemberContacts = {
  contacts: MemberContactItem[];
};
