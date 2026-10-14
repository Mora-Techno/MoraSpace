'use client';

import { useState } from 'react';

import { defaultLanguage, Language, LANGUAGE_STORAGE_KEY, languages } from '@/configs/i18n.config';
import i18n from '@/pkg/i18n/i18n';

export const useLanguage = () => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => {
    // Initialize with localStorage value if available, otherwise use default
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language;
      return saved && languages.includes(saved) ? saved : defaultLanguage;
    }
    return defaultLanguage;
  });

  const changeLanguage = (newLanguage: Language) => {
    if (!languages.includes(newLanguage)) return;

    // Save to localStorage and sync i18n
    localStorage.setItem(LANGUAGE_STORAGE_KEY, newLanguage);
    if (typeof document !== 'undefined') {
      document.cookie = `NEXT_LOCALE=${newLanguage}; path=/; max-age=31536000; SameSite=Lax`;
    }
    i18n.changeLanguage(newLanguage);
    setCurrentLanguage(newLanguage);
  };

  return {
    currentLanguage,
    changeLanguage,
    languages,
  };
};
