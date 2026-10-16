import {
  useAdminActivateCompany,
  useAdminCreateCompany,
  useAdminSetCompanyPlan,
  useAdminSuspendCompany,
  useCreateAdmin,
  useDeleteAdmin,
  usePresignCompanyLogo,
  useRegisterCompany,
  useUpdateCompanyProfile,
  useUpdateCompanySettings,
  useUpdateCompanySubscription,
} from './state/mutate';
import {
  useAdminListCompanies,
  useGetCompanySettings,
  useGetMyCompany,
  useListAdmins,
} from './state/query';

export const useCompany = () => {
  return {
    mutate: {
      registerCompany: useRegisterCompany,
      createAdmin: useCreateAdmin,
      deleteAdmin: useDeleteAdmin,
      updateSubrationCompany: useUpdateCompanySubscription,
      updateProfile: useUpdateCompanyProfile,
      presignLogo: usePresignCompanyLogo,
      updateSettings: useUpdateCompanySettings,
      adminCreateCompany: useAdminCreateCompany,
      adminSuspendCompany: useAdminSuspendCompany,
      adminActivateCompany: useAdminActivateCompany,
      adminSetCompanyPlan: useAdminSetCompanyPlan,
    },
    query: {
      getMe: useGetMyCompany,
      listAdmins: useListAdmins,
      getSettings: useGetCompanySettings,
      adminListCompanies: useAdminListCompanies,
    },
  };
};
