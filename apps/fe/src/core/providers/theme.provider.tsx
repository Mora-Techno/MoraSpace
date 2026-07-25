"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { themeConfig } from "@/configs";

export type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function applyThemeVariables(theme: Theme) {
  const themeValues = themeConfig[theme];
  Object.entries(themeValues).forEach(([key, value]) => {
    if (typeof value === "string") {
      document.documentElement.style.setProperty(`--${key}`, value);
    } else if (typeof value === "object") {
      document.documentElement.style.setProperty(`--${key}`, value.background);
      document.documentElement.style.setProperty(
        `--${key}-foreground`,
        value.foreground,
      );
    }
  });
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") as Theme | null;
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const initialTheme = storedTheme ?? (prefersDark ? "dark" : "light");

    setTheme(initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
    applyThemeVariables(initialTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme: Theme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
    applyThemeVariables(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
