import { useRegisterCompany } from "./state/mutate";
import { useGetMyCompany, useListAdmins } from "./state/query";

export const useCompany = () => {
  return {
    mutate: {
      registerCompany: useRegisterCompany,
    },
    query: {
      getMe: useGetMyCompany,
      listAdmins: useListAdmins,
    },
  };
};
