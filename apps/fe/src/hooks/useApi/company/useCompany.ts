import {
  useAdminActivateCompany,
  useAdminCreateCompany,
  useAdminSetCompanyPlan,
  useAdminSuspendCompany,
  useCreateAdmin,
  useDeleteAdmin,
  useJoinCompany,
  usePresignCompanyLogo,
  useRegenerateJoinCode,
  useRegisterCompany,
  useUpdateCompanyProfile,
  useUpdateCompanySettings,
  useUpdateCompanySubscription,
} from './state/mutate';
import {
  useAdminListCompanies,
  useGetCompanyJoinCode,
  useGetCompanySettings,
  useGetMyCompany,
  useListAdmins,
  usePreviewJoinCompany,
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
      regenerateJoinCode: useRegenerateJoinCode,
      joinCompany: useJoinCompany,
    },
    query: {
      getMe: useGetMyCompany,
      listAdmins: useListAdmins,
      getSettings: useGetCompanySettings,
      adminListCompanies: useAdminListCompanies,
      getJoinCode: useGetCompanyJoinCode,
      previewJoinCompany: usePreviewJoinCompany,
    },
  };
};
