import {
  useLogin,
  useLogout,
  useRegister,
  useSendMagicLink,
  useVerifyMagicLink,
  useForgotPassword,
  useResetPassword,
  useSwitchWorkspace,
} from "./state/mutate";
import { useWorkspaces } from "./state/query";

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
      switchWorkspace: useSwitchWorkspace,
    },
    query: {
      workspaces: useWorkspaces,
    },
  };
};
