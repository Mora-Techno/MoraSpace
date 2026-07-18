import {
  useCreateRole,
  useDeleteRole,
  useUpdateRole,
  useUpdateRolePermissions,
} from './state/mutate';
import { useGetRolePermissions, useListMasterPermissions, useListRoles } from './state/query';

export const useRole = () => {
  return {
    mutate: {
      create: useCreateRole,
      update: useUpdateRole,
      delete: useDeleteRole,
      updatePermissions: useUpdateRolePermissions,
    },
    query: {
      list: useListRoles,
      permissions: useGetRolePermissions,
      masterPermissions: useListMasterPermissions,
    },
  };
};
