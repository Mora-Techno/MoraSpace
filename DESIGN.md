# DESIGN.md — Spaces by Mora

Single source of truth: [`packages/shared/config/theme.tokens.ts`](packages/shared/config/theme.tokens.ts).
Nothing else may define palette values. Everything below is derived from it.

## 1. Overview

One semantic token set, two generated platform outputs (web CSS variables, mobile NativeWind).
Light = **Warm Botanical**, Dark = **Midnight Calm**. Typography is DM Sans + Fraunces on both platforms.

## 2. Brand personality & visual philosophy

Calm, organic, focused. Sage and terracotta on warm paper (light); midnight blue with a
golden accent (dark). Fraunces is sparing, display-only. Whitespace over decoration.

## 3. Light theme — Warm Botanical

| Token | Background | Foreground |
|---|---|---|
| page | `#FDFBF7` | `#4A4238` |
| card | `rgba(255,255,255,0.7)` | `#4A4238` |
| popover | `#FFFFFF` | `#4A4238` |
| primary | `#7DAF74` | `#243020` |
| secondary | `#AEC6CF` | `#4A4238` |
| muted | `#F3EFE8` | `rgba(74,66,56,0.78)` |
| accent | `#E8F4E6` | `#3F6637` |
| destructive | `#D97757` | `#2B1710` |
| warning | `#F2C94C` | `#4A4238` |
| success | `#7DAF74` | `#243020` |
| info | `#AEC6CF` | `#4A4238` |
| border / input / ring | `rgba(94,139,86,0.2)` / `rgba(74,112,66,0.8)` / `rgba(74,112,66,0.8)` | — |

## 4. Dark theme — Midnight Calm

| Token | Background | Foreground |
|---|---|---|
| page | `#1A2530` | `#E8E6E1` |
| card | `rgba(0,0,0,0.4)` | `#E8E6E1` |
| popover | `#243040` | `#E8E6E1` |
| primary | `#F2C94C` | `#1A2530` |
| secondary | `#4A4E69` | `#E8E6E1` |
| muted | `#243040` | `rgba(232,230,225,0.6)` |
| accent | `#2D3A4A` | `#F2C94C` |
| destructive | `#D97757` | `#1A2530` |
| warning | `#E5A93D` | `#1A2530` |
| success | `#7DAF74` | `#1A2530` |
| info | `#4A4E69` | `#E8E6E1` |
| border / input / ring | `rgba(255,255,255,0.1)` / `rgba(255,255,255,0.4)` / `rgba(242,201,76,0.55)` | — |

## 5. Canonical tokens

Semantic names are unchanged from the original `ThemeConfig` (`background, foreground, card, popover,
primary, secondary, muted, accent, destructive, warning, success, info, border, input, ring`).
Additive: `sidebar.*` and `chart[5]` (web-only consumers), `typeScale`, `spacing`, `radius`, `motion`,
`fontFamilies`, `nativeFontFaces`. Alpha is preserved end-to-end (not flattened) on both platforms.

## 6. Accessibility audit & adjustments

WCAG AA: 4.5:1 text, 3:1 UI boundaries/focus. Alpha composited over the real surface. Smallest
change; foreground changed in preference to brand backgrounds.

| Theme | Pair | Original | New | Ratio |
|---|---|---|---|---|
| Light | primary fg | `#FDFBF7` | `#243020` | 2.46 → 5.44 |
| Light | success fg | `#FDFBF7` | `#243020` | 2.46 → 5.44 |
| Light | accent fg | `#5E8B56` | `#3F6637` | 3.49 → 5.85 |
| Light | destructive fg | `#FFFFFF` | `#2B1710` | 3.12 → 5.46 |
| Light | muted fg alpha | 0.65 | 0.78 | ~3.5 → 4.79 |
| Light | input boundary | `rgba(94,139,86,.15)` | `rgba(74,112,66,.8)` | 1.18 → 3.63 |
| Light | focus ring | `rgba(125,175,116,.4)` | `rgba(74,112,66,.8)` | 1.39 → 3.63 |
| Dark | destructive fg | `#E8E6E1` | `#1A2530` | 2.50 → 4.98 |
| Dark | focus ring | `rgba(242,201,76,.35)` | `rgba(242,201,76,.55)` | 2.40 → 3.94 |
| Dark | input boundary | `rgba(255,255,255,.12)` | `rgba(255,255,255,.4)` | 1.45 → 3.69 |

**Documented exceptions (not changed):**
- `border` (1.25 light / 1.36 dark) is a decorative divider; the control boundary is `input`. The checker reports it as WARN.
- `primary` background vs page is not required to hit 3:1 because the button label carries the contrast.
- Also corrected: `card` alpha unified to 0.7 / 0.4 (web CSS previously 0.72 / 0.42). Web `outline-ring/50` removed because it halved the ring alpha and defeated the 3:1 target.

Reproduce: `bun run theme:check`.

## 7. Cross-platform architecture

```
packages/shared/config/theme.tokens.ts   ← only place palette lives
        │  packages/shared/scripts/generate-theme-css.mjs
        ├─► apps/fe/src/styles/theme.generated.css    (:root / .dark vars, @theme text sizes)
        ├─► apps/mobile/styles/global.css             (RGB channel vars + *-alpha vars)
        └─► apps/mobile/config/theme.generated.js     (Tailwind v3: colors, fontFamily, fontSize)
```
`apps/*/…/theme.config.ts` are thin re-exports of the canonical `themeConfig`. Generated files must not be hand-edited.

## 8. Typography

| Role | Family | Use |
|---|---|---|
| sans | DM Sans 400/500/600/700 | all UI text |
| display | Fraunces 600/700 | display/marketing headings only, opt-in |

Scale (px / line-height): display 40/48, heading-xl 32/40, heading-lg 24/32, heading-md 20/28,
heading-sm 18/26, body-lg 16/24, body-md 14/20, body-sm 13/18, caption 12/16.
Identical in light and dark. Web: `text-body-md`, `font-display`. Mobile: same class names.

## 9. Font loading — Next.js

[`layout.tsx`](apps/fe/src/app/layout.tsx) uses `next/font/google` `DM_Sans` (`--font-dm-sans`) and
`Fraunces` (`--font-fraunces`), `display: swap`. `globals.css` maps `--font-sans`, `--font-display`,
`--font-serif` (existing `font-serif` usages now render Fraunces).

## 10. Font loading — Expo

`@expo-google-fonts/dm-sans` + `@expo-google-fonts/fraunces`, loaded in
[`_layout.tsx`](apps/mobile/app/_layout.tsx) via `useFonts` (splash gated). React Native cannot
synthesise weights, so use family classes: `font-sans`, `font-sans-medium`, `font-sans-semibold`,
`font-sans-bold`, `font-display`, `font-display-bold` — do not rely on `font-bold` with a custom family.

## 11. Spacing

4px base: `4, 8, 12, 16, 20, 24, 32, 40, 48, 64`.

## 12. Radius

Canonical: sm 6, md 10, lg 14, xl 20, full 9999. Applied on both platforms via the generator (web `--radius-*` in `@theme`, mobile `borderRadius`). Web `--radius: 1rem` remains only for legacy usages.

## 13. Borders & elevation

1px borders use `border`; controls use `input`; focus uses `ring`. Elevation is soft and low: cards
use translucent `card` + blur on web; avoid heavy shadows in dark mode.

## 14. Motion

Durations: instant 100, fast 150, base 200, slow 300 ms. Easing: standard `cubic-bezier(0.2,0,0,1)`,
decelerate `cubic-bezier(0,0,0,1)`, accelerate `cubic-bezier(0.3,0,1,1)`. Respect reduced-motion.

## 15. Component guidelines

- Filled primary controls use `primary-foreground`, never white. Mobile: `text-primary-foreground` or `colors.primaryForeground`.
- Destructive controls use `destructive-foreground`.
- Inputs use the `input` border; focus uses `ring` (do not reduce its alpha).
- No hardcoded hex in components; consume tokens.

## 16. Web integration

`globals.css` imports `theme.generated.css`; `@theme inline` maps colors/fonts; `--radius: 1rem` retained.
Indigo gradients/glow and glass cards now derive from `var(--primary|--card|--border)`.

## 17. Mobile integration

`tailwind.config.js` (CJS) spreads `colors`, `fontFamily`, `fontSize` from `theme.generated.js`.
Colors use `rgb(var(--x) / <alpha-value>)`; alpha tokens use `rgb(var(--x) / var(--x-alpha))`.
`ThemeProvider` still exposes `colors.*` (from the re-exported config) for inline styles.
`bun run generate:theme-css` in mobile delegates to the shared generator.

## 18. Responsive & platform considerations

Web: breakpoints via Tailwind. Mobile: one-column, 44pt min touch targets. Same tokens, different layout.

## 19. Light / dark behavior

Web: `.dark` class (next-themes). Mobile: `.dark:root` via NativeWind `colorScheme`. Typography never changes with theme.

## 20. Accessibility

AA contrast enforced by `check-contrast.mjs` (exits non-zero on failure). Visible focus ring ≥3:1.
Do not convey state by color alone.

## 21. Do's and don'ts

- DO edit `theme.tokens.ts`, then `bun run theme:generate`.
- DON'T edit generated files or add hex values in components.
- DON'T use white text on `primary` / `success`.
- DON'T use Fraunces for body or dense UI.

## 22. Maintenance & sync

```
bun run theme:generate   # regenerate all three outputs
bun run theme:check      # contrast gate + generated files up to date
```
Run `theme:check` in CI. Generated files are excluded from Biome.

## 23. Verification checklist

- [x] `bun run theme:check` passes (all required contrast checks, outputs in sync)
- [x] `apps/fe` `tsc --noEmit` clean
- [x] `apps/mobile` `tsc --noEmit`: only the 14 pre-existing `components/ui/*` ref-typing errors
- [x] `apps/mobile` biome lint (0 errors) + `format:check`
- [x] Web `/login` returns 200 on dev server after changes
- [ ] Visual check of web light/dark (not performed)
- [ ] Mobile bundle on device/emulator: NativeWind `rgb(var(--x) / var(--x-alpha))` and font loading **unverified**

## 24. Decisions taken & remaining notes

Decided (implemented):
1. **Radius migrated** to the canonical scale on web and mobile (web components using `rounded-sm/md/lg/xl` become slightly tighter: 12/14/16/20 → 6/10/14/20).
2. **Headings** are DM Sans; Fraunces is opt-in via `font-serif` / `font-display`.
3. **`border`** stays a decorative divider (documented WARN); controls use `input`.
4. **Raw RN `<Text>`** defaults to DM Sans 400 via `Text.defaultProps` in `_layout.tsx`; `ui/Text` sets weighted family per variant. Weight classes like `font-bold` do not switch faces for custom families; use `font-sans-bold`.
5. **Hardcoded red/amber** action buttons now use `destructive` / `warning` tokens with their foregrounds. `ghibli-bg` / `ghibli-glass` derive from tokens.

Remaining:
- NativeWind `rgb(var(--x) / var(--x-alpha))` and font loading are unverified on device.
- Dark `chart-3` (`#4A4E69`) is low-contrast on the dark page (chart-only).
- Pre-existing: `apps/fe` ESLint fails on missing `eslint-plugin-react-hooks`; 14 `components/ui` ref-typing errors on mobile.
