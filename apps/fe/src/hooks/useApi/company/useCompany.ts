import {
  useCreateAdmin,
  useDeleteAdmin,
  useRegisterCompany,
  useUpdateCompanyProfile,
  useUpdateCompanySubscription,
} from "./state/mutate";
import { useGetMyCompany, useListAdmins } from "./state/query";

export const useCompany = () => {
  return {
    mutate: {
      registerCompany: useRegisterCompany,
      createAdmin: useCreateAdmin,
      deleteAdmin: useDeleteAdmin,
      updateSubrationCompany: useUpdateCompanySubscription,
      updateProfile: useUpdateCompanyProfile,
    },
    query: {
      getMe: useGetMyCompany,
      listAdmins: useListAdmins,
    },
  };
};
