import { setBaseURLProvider, setTokenProvider } from '@repo/utils/api';
import Constants from 'expo-constants';

import { store } from '@/stores/store';

const BASE_URL = Constants.expoConfig?.extra?.BACKEND_URL as string | undefined;

setBaseURLProvider(() => BASE_URL);
setTokenProvider(() => store.getState().auth.currentUser?.user.token);
