export interface IRole {
  id: string;
  companyId: string;
  name: string;
  description: string | null;
  isSystem: boolean;
}

export interface IPermission {
  id: string;
  module: string;
  action: string;
  permissionKey: string;
  description: string | null;
}

export type PickCreateRole = {
  name: string;
  description?: string;
};

export type PickUpdateRole = Partial<PickCreateRole>;

export type PickUpdateRolePermissions = {
  permissionIds: string[];
};
