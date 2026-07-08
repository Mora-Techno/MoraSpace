import { useLogin, useLogout, useRegister } from './state/mutate';

export const useAuth = () => {
  return {
    mutate: {
      login: useLogin,
      register: useRegister,
      logout: useLogout,
    },
    query: {
      //
    },
  };
};
