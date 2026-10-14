import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import {
  defaultLanguage,
  fallbackLng,
  i18nConfig,
  LANGUAGE_STORAGE_KEY,
} from '@/configs/i18n.config';

import enAuth from './locales/en/auth.json';
import enCommon from './locales/en/common.json';
import enNetral from './locales/en/netral.json';
import enPublic from './locales/en/public.json';
import idAuth from './locales/id/auth.json';
import idCommon from './locales/id/common.json';
import idNetral from './locales/id/netral.json';
import idPublic from './locales/id/public.json';

export const resources = {
  en: {
    common: enCommon,
    auth: enAuth,
    public: enPublic,
    netral: enNetral,
  },
  id: {
    common: idCommon,
    auth: idAuth,
    public: idPublic,
    netral: idNetral,
  },
} as const;

const getInitialLanguage = (): string => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (saved && (saved === 'en' || saved === 'id')) {
      return saved;
    }
  }
  return defaultLanguage;
};

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    ...i18nConfig,
    lng: getInitialLanguage(),
    fallbackLng,
    defaultNS: 'common',
    ns: ['common', 'auth', 'public', 'netral'],
    resources,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });
}

export default i18n;
