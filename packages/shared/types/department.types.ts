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

export type DepartmentRespone = Omit<IDepartment, ''>;
