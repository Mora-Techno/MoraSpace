import { useGetMyCompany, useListAdmins } from './state/query';

export const useCompany = () => {
  return {
    mutate: {},
    query: {
      getMe: useGetMyCompany,
      listAdmins: useListAdmins,
    },
  };
};
