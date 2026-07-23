import { useCreateDepartment, useDeleteDepartment, useUpdateDepartment } from './state/mutate';
import { useGetDepartment, useListDepartments } from './state/query';

export const useDepartment = () => {
  return {
    mutate: {
      create: useCreateDepartment,
      update: useUpdateDepartment,
      delete: useDeleteDepartment,
    },
    query: {
      list: useListDepartments,
      detail: useGetDepartment,
    },
  };
};
