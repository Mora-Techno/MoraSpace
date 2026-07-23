export interface IDepartment {
  id: string;
  companyId: string;
  managerId: string | null;
  name: string;
  description: string | null;
}

export type PickCreateDepartment = {
  name: string;
  description?: string;
  managerId?: string;
};

export type PickUpdateDepartment = Partial<PickCreateDepartment>;

export type DepartmentQuery = {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  managerId?: string;
  startDate?: string;
  endDate?: string;
};

export type DepartmentRespone = Omit<IDepartment, "">;
