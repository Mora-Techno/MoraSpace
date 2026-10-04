import * as SecureStore from 'expo-secure-store';
import { setAuthErrorHandler, setTokenProvider } from '@repo/services';
import { router } from 'expo-router';

const ACCESS_TOKEN_KEY = 'spaces_mobile_access_token';
const REFRESH_TOKEN_KEY = 'spaces_mobile_refresh_token';

// Inisialisasi token provider untuk ApiServicePackage
let inMemoryToken: string | null = null;

export async function saveAuthTokens(accessToken: string, refreshToken?: string) {
  try {
    inMemoryToken = accessToken;
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
    if (refreshToken) {
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
    }
  } catch (error) {
    if (__DEV__) console.error('Gagal menyimpan auth token di mobile secure store', error);
  }
}

export async function getAccessToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  } catch {
    return null;
  }
}

export async function getRefreshToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  } catch {
    return null;
  }
}

export async function clearAuthTokens() {
  try {
    inMemoryToken = null;
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  } catch (error) {
    if (__DEV__) console.error('Gagal menghapus auth tokens', error);
  }
}

// Token provider sudah diinisialisasi di atas

getAccessToken().then((tok) => {
  inMemoryToken = tok;
});

setTokenProvider(() => inMemoryToken ?? undefined);

setAuthErrorHandler(() => {
  inMemoryToken = null;
  void clearAuthTokens();
  router.replace('/(auth)/login/page');
});
