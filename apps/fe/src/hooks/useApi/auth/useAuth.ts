import {
  useForgotPassword,
  useLogin,
  useLogout,
  useRegister,
  useResetPassword,
  useSendMagicLink,
  useSwitchWorkspace,
  useVerifyMagicLink,
} from './state/mutate';
import { useWorkspaces } from './state/query';

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
