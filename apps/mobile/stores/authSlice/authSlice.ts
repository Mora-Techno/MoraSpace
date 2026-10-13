import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { SafeAuthUser } from '@repo/types/auth.types';

export type AuthUserState = Partial<SafeAuthUser> & {
  token: string;
  id?: string;
  email: string;
  fullName: string;
  companyRole?: string;
  companyId?: string | null;
  companyMemberId?: string | null;
  platformRole?: string;
};

export interface CurrentUserContainer {
  user: AuthUserState;
}

interface AuthState {
  currentUser: CurrentUserContainer | null;
}

const initialState: AuthState = {
  currentUser: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCurrentUser(state, action: PayloadAction<CurrentUserContainer | null>) {
      state.currentUser = action.payload;
    },
    logout(state) {
      state.currentUser = null;
    },
  },
});

export const { setCurrentUser, logout } = authSlice.actions;
export default authSlice.reducer;
