import { useUpdateCompanyProfile, useUpdateCompanySettings } from './state/mutate';
import { useGetCompanySettings, useGetMyCompany, useListAdmins } from './state/query';

export const useCompany = () => {
  return {
    mutate: {
      updateProfile: useUpdateCompanyProfile,
      updateSettings: useUpdateCompanySettings,
    },
    query: {
      getMe: useGetMyCompany,
      getSettings: useGetCompanySettings,
      listAdmins: useListAdmins,
    },
  };
};
