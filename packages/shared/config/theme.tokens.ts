/**
 * SPACES BY MORA — CANONICAL DESIGN TOKENS (single source of truth)
 *
 * Machine-readable counterpart of /DESIGN.md. Both platforms derive from this file:
 *   - Web    : apps/fe/src/styles/theme.generated.css   (CSS variables, Tailwind v4)
 *   - Mobile : apps/mobile/styles/global.css            (RGB channel variables, NativeWind v4)
 *              apps/mobile/config/theme.generated.js    (Tailwind v3 color/font mapping)
 *
 * Regenerate with `bun run theme:generate` (repo root). Verify with `bun run theme:check`.
 * Never hand-edit the generated files and never copy palette values into components.
 *
 * Accessibility corrections vs. the original palette are listed in DESIGN.md §6.
 */

export interface ColorConfig {
  background: string;
  foreground: string;
}

export interface ThemeColors {
  background: string;
  foreground: string;
  card: ColorConfig;
  popover: ColorConfig;
  primary: ColorConfig;
  secondary: ColorConfig;
  muted: ColorConfig;
  accent: ColorConfig;
  destructive: ColorConfig;
  warning: ColorConfig;
  success: ColorConfig;
  info: ColorConfig;
  border: string;
  input: string;
  ring: string;
  /** Web sidebar surface. Mobile does not consume it (Drawer uses card/background). */
  sidebar: {
    background: string;
    foreground: string;
    primary: ColorConfig;
    accent: ColorConfig;
    border: string;
    ring: string;
  };
  /** Data-visualisation palette, 5 steps. */
  chart: [string, string, string, string, string];
}

export interface ThemeConfig {
  light: ThemeColors;
  dark: ThemeColors;
}

export const themeConfig: ThemeConfig = {
  /* ───────── LIGHT — Warm Botanical ───────── */
  light: {
    background: '#FDFBF7',
    foreground: '#4A4238',
    card: { background: 'rgba(255,255,255,0.7)', foreground: '#4A4238' },
    popover: { background: '#FFFFFF', foreground: '#4A4238' },
    // A11Y: fg #FDFBF7 → #243020 (2.46:1 → 5.44:1). Brand sage background kept.
    primary: { background: '#7DAF74', foreground: '#243020' },
    secondary: { background: '#AEC6CF', foreground: '#4A4238' },
    // A11Y: alpha 0.65 → 0.78 (3.48:1 → 4.79:1 on muted surface).
    muted: { background: '#F3EFE8', foreground: 'rgba(74,66,56,0.78)' },
    // A11Y: fg #5E8B56 → #3F6637 (3.49:1 → 5.85:1).
    accent: { background: '#E8F4E6', foreground: '#3F6637' },
    // A11Y: fg #FFFFFF → #2B1710 (3.12:1 → 5.46:1). Terracotta background kept.
    destructive: { background: '#D97757', foreground: '#2B1710' },
    warning: { background: '#F2C94C', foreground: '#4A4238' },
    // A11Y: fg #FDFBF7 → #243020 (2.46:1 → 5.44:1).
    success: { background: '#7DAF74', foreground: '#243020' },
    info: { background: '#AEC6CF', foreground: '#4A4238' },
    // Decorative divider: intentionally kept soft (see DESIGN.md §6 exception).
    border: 'rgba(94,139,86,0.2)',
    // A11Y: control boundary + focus indicator need ≥3:1 (1.18/1.39 → 3.63).
    input: 'rgba(74,112,66,0.8)',
    ring: 'rgba(74,112,66,0.8)',
    sidebar: {
      background: 'rgba(255,255,255,0.82)',
      foreground: '#4A4238',
      primary: { background: '#7DAF74', foreground: '#243020' },
      accent: { background: '#E8F4E6', foreground: '#3F6637' },
      border: 'rgba(94,139,86,0.18)',
      ring: 'rgba(74,112,66,0.8)',
    },
    chart: ['#7DAF74', '#AEC6CF', '#F2C94C', '#5E8B56', '#D97757'],
  },
  /* ───────── DARK — Midnight Calm ───────── */
  dark: {
    background: '#1A2530',
    foreground: '#E8E6E1',
    card: { background: 'rgba(0,0,0,0.4)', foreground: '#E8E6E1' },
    popover: { background: '#243040', foreground: '#E8E6E1' },
    primary: { background: '#F2C94C', foreground: '#1A2530' },
    secondary: { background: '#4A4E69', foreground: '#E8E6E1' },
    muted: { background: '#243040', foreground: 'rgba(232,230,225,0.6)' },
    accent: { background: '#2D3A4A', foreground: '#F2C94C' },
    // A11Y: fg #E8E6E1 → #1A2530 (2.50:1 → 4.98:1).
    destructive: { background: '#D97757', foreground: '#1A2530' },
    warning: { background: '#E5A93D', foreground: '#1A2530' },
    success: { background: '#7DAF74', foreground: '#1A2530' },
    info: { background: '#4A4E69', foreground: '#E8E6E1' },
    border: 'rgba(255,255,255,0.1)',
    // A11Y: input 1.45 → ≥3:1 ; ring 2.40 → 3.94.
    input: 'rgba(255,255,255,0.4)',
    ring: 'rgba(242,201,76,0.55)',
    sidebar: {
      background: 'rgba(26,37,48,0.92)',
      foreground: '#E8E6E1',
      primary: { background: '#F2C94C', foreground: '#1A2530' },
      accent: { background: '#2D3A4A', foreground: '#F2C94C' },
      border: 'rgba(255,255,255,0.08)',
      ring: 'rgba(242,201,76,0.55)',
    },
    chart: ['#F2C94C', '#7DAF74', '#4A4E69', '#E5A93D', '#D97757'],
  },
};

/* ───────── TYPOGRAPHY ───────── */

export type FontRole = 'sans' | 'display' | 'mono';

/** Same families on both platforms, in light and dark. Never theme-dependent. */
export const fontFamilies = {
  sans: { name: 'DM Sans', fallback: 'ui-sans-serif, system-ui, -apple-system, sans-serif' },
  display: { name: 'Fraunces', fallback: 'ui-serif, Georgia, "Times New Roman", serif' },
  mono: { name: 'ui-monospace', fallback: 'SFMono-Regular, Menlo, Consolas, monospace' },
} as const;

/**
 * React Native cannot synthesise weights from one family name, so every weight is a
 * distinct registered font. Names match the `@expo-google-fonts/*` export names.
 */
export const nativeFontFaces = {
  sans: {
    400: 'DMSans_400Regular',
    500: 'DMSans_500Medium',
    600: 'DMSans_600SemiBold',
    700: 'DMSans_700Bold',
  },
  display: {
    600: 'Fraunces_600SemiBold',
    700: 'Fraunces_700Bold',
  },
} as const;

export interface TypeToken {
  family: Exclude<FontRole, 'mono'>;
  /** px */
  size: number;
  /** px */
  lineHeight: number;
  weight: 400 | 500 | 600 | 700;
  /** em */
  letterSpacing: number;
}

export const typeScale = {
  display: { family: 'display', size: 40, lineHeight: 48, weight: 600, letterSpacing: -0.02 },
  'heading-xl': { family: 'sans', size: 32, lineHeight: 40, weight: 600, letterSpacing: -0.015 },
  'heading-lg': { family: 'sans', size: 24, lineHeight: 32, weight: 600, letterSpacing: -0.01 },
  'heading-md': { family: 'sans', size: 20, lineHeight: 28, weight: 600, letterSpacing: -0.005 },
  'heading-sm': { family: 'sans', size: 18, lineHeight: 26, weight: 600, letterSpacing: 0 },
  'body-lg': { family: 'sans', size: 16, lineHeight: 24, weight: 400, letterSpacing: 0 },
  'body-md': { family: 'sans', size: 14, lineHeight: 20, weight: 400, letterSpacing: 0 },
  'body-sm': { family: 'sans', size: 13, lineHeight: 18, weight: 400, letterSpacing: 0 },
  caption: { family: 'sans', size: 12, lineHeight: 16, weight: 500, letterSpacing: 0.01 },
} as const satisfies Record<string, TypeToken>;

export type TypeScaleKey = keyof typeof typeScale;

/* ───────── SPACING / RADIUS / MOTION ───────── */

/** 4px base. */
export const spacing = [4, 8, 12, 16, 20, 24, 32, 40, 48, 64] as const;

/**
 * Canonical radius scale (px). NOTE: web currently derives its radii from
 * `--radius: 1rem` and has NOT been migrated to this scale — see DESIGN.md §24.
 */
export const radius = { sm: 6, md: 10, lg: 14, xl: 20, full: 9999 } as const;

export const motion = {
  /** ms */
  duration: { instant: 100, fast: 150, base: 200, slow: 300 },
  easing: {
    standard: 'cubic-bezier(0.2, 0, 0, 1)',
    decelerate: 'cubic-bezier(0, 0, 0, 1)',
    accelerate: 'cubic-bezier(0.3, 0, 1, 1)',
  },
} as const;
