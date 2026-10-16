import { useLogin, useLogout, useRegister, useSwitchWorkspace } from './state/mutate';
import { useWorkspaces } from './state/query';

export const useAuth = () => {
  return {
    mutate: {
      login: useLogin,
      register: useRegister,
      logout: useLogout,
      switchWorkspace: useSwitchWorkspace,
    },
    query: {
      workspaces: useWorkspaces,
    },
  };
};
