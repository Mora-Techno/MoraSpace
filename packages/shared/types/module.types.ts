export type ModuleType = 'TASK' | 'TODO' | 'NOTE';

export interface IModule {
  id: string;
  companyId: string | null;
  userId: string | null;
  creatorMemberId: string | null;
  name: string;
  description: string | null;
  color: string | null;
  icon: string | null;
  type: ModuleType;
  createdAt: string;
  updatedAt: string;
  creatorMember?: {
    id: string;
    user?: {
      id: string;
      fullName: string;
      avatarUrl: string | null;
    } | null;
  } | null;
  _count?: {
    tasks?: number;
    todos?: number;
    notes?: number;
  };
}

export type PickCreateModule = {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  type: ModuleType;
};

export type PickUpdateModule = Partial<PickCreateModule>;

export type ModuleQuery = {
  search?: string;
  type?: ModuleType;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
};
