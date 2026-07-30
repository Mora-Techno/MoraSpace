import {
  useLogin,
  useLogout,
  useRegister,
  useSendMagicLink,
  useVerifyMagicLink,
  useForgotPassword,
  useResetPassword,
} from "./state/mutate";

export const useAuth = () => {
  return {
    mutate: {
      login: useLogin,
      register: useRegister,
      logout: useLogout,
      verifyMagicLink: useVerifyMagicLink,
      sendMagicLink: useSendMagicLink,
      forgotPassword: useForgotPassword,
      resetPassword: useResetPassword,
    },
    query: {
      //
    },
  };
};
