import { useLogin, useLogout, useRegister, useVerifyMagicLink } from './state/mutate';

export const useAuth = () => {
  return {
    mutate: {
      login: useLogin,
      register: useRegister,
      logout: useLogout,
      verifyMagicLink: useVerifyMagicLink,
    },
    query: {
      //
    },
  };
};
