import AsyncStorage from '@react-native-async-storage/async-storage';
import { colorScheme } from 'nativewind';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';

import { themeConfig } from '@/config/theme.config';

type Theme = 'light' | 'dark';

export interface FlatColors {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  warning: string;
  warningForeground: string;
  success: string;
  successForeground: string;
  border: string;
  input: string;
  ring: string;
  text: string;
  info: string;
  infoForeground: string;
  textSecondary: string;
}

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  colors: FlatColors;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  const themeColors = themeConfig[theme];
  const colors: FlatColors = {
    background: themeColors.background,
    foreground: themeColors.foreground,
    card: themeColors.card.background,
    cardForeground: themeColors.card.foreground,
    popover: themeColors.popover.background,
    popoverForeground: themeColors.popover.foreground,
    primary: themeColors.primary.background,
    primaryForeground: themeColors.primary.foreground,
    secondary: themeColors.secondary.background,
    secondaryForeground: themeColors.secondary.foreground,
    muted: themeColors.muted.background,
    mutedForeground: themeColors.muted.foreground,
    accent: themeColors.accent.background,
    accentForeground: themeColors.accent.foreground,
    destructive: themeColors.destructive.background,
    destructiveForeground: themeColors.destructive.foreground,
    warning: themeColors.warning.background,
    warningForeground: themeColors.warning.foreground,
    success: themeColors.success.background,
    successForeground: themeColors.success.foreground,
    border: themeColors.border,
    input: themeColors.input,
    ring: themeColors.ring,
    text: themeColors.foreground,
    info: themeColors.info.background,
    infoForeground: themeColors.info.foreground,
    textSecondary: themeColors.muted.foreground,
  };

  useEffect(() => {
    const initTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem('theme');
        if (storedTheme) {
          setTheme(storedTheme as Theme);
        } else {
          setTheme(systemColorScheme === 'dark' ? 'dark' : 'light');
        }
      } catch (error) {
        if (__DEV__) console.error('Error loading theme:', error);
        setTheme(systemColorScheme === 'dark' ? 'dark' : 'light');
      } finally {
        setMounted(true);
      }
    };

    initTheme();
  }, [systemColorScheme]);

  useEffect(() => {
    colorScheme.set(theme);
  }, [theme]);

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    try {
      await AsyncStorage.setItem('theme', newTheme);
    } catch (error) {
      if (__DEV__) console.error('Error saving theme:', error);
    }
  };

  if (!mounted) {
    return null;
  }

  const contextValue: ThemeContextType = {
    theme,
    toggleTheme,
    colors,
    isDark: theme === 'dark',
  };

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
