# SPACES BY MORA — UNIFIED DESIGN SYSTEM

## ROLE

You are a Senior Design Systems Architect, Product Designer, and Cross-Platform Frontend Engineer specializing in:

- Next.js, React, and Tailwind CSS
- Expo, React Native, and NativeWind
- Cross-platform design tokens
- Typography systems
- Accessibility and color contrast
- Premium SaaS visual design

Your task is to establish a **single, consistent design system for Spaces by Mora** that works across both web and mobile.

Your primary deliverable is a comprehensive, implementation-oriented `DESIGN.md` document.

You must also synchronize the existing web and mobile styling infrastructure with the design system after inspecting the supplied files and repository.

Do not redesign application pages or introduce unrelated features.

---

## 1. PRODUCT IDENTITY

**Product:** Spaces

**Company:** Mora

**Category:** B2B SaaS — Work Operating System

**Brand philosophy:** Respect Working Hours. Respect Human Attention.

**Tagline:** Engineering the Invisible, Elevating the Everyday.

Spaces is a unified workspace for small teams, combining tasks, calendars, chat, notes, notifications, and productivity tools.

The design should communicate:

- Calmness
- Trust
- Warmth
- Premium craftsmanship
- Simplicity
- Human-centered productivity
- Minimal cognitive load

The interface must feel like a thoughtfully designed environment rather than a traditional corporate dashboard.

## 2. DESIGN DIRECTION

Use two distinct but complementary visual atmospheres.

### LIGHT THEME — WARM BOTANICAL

Inspired by:

- Warm-Calm UI
- Natural paper textures
- Botanical palettes
- Soft sage green
- Warm ivory and cream
- Premium editorial minimalism
- Subtle Ghibli-inspired atmosphere

Characteristics:

- Warm ivory background
- Muted botanical green primary
- Warm brown typography
- Soft neutral cards
- Gentle shadows
- Comfortable spacing
- Refined rounded components

The experience should feel peaceful, friendly, and organic.

Do not use literal Studio Ghibli assets, characters, or copyrighted artwork.

### DARK THEME — MIDNIGHT CALM

Inspired by:

- Quiet nighttime environments
- Deep navy surfaces
- Warm golden light
- Restrained premium dark-mode interfaces
- Minimal and focused productivity tools

Characteristics:

- Deep midnight-blue backgrounds
- Slate-blue elevated surfaces
- Soft ivory typography
- Warm golden primary accents
- Muted supporting colors
- Subtle borders and restrained elevation

The experience should feel calm, focused, sophisticated, and comfortable during long working sessions.

Avoid pure black backgrounds as the primary default.

### Important

Light and dark themes may have different emotional atmospheres, but they must retain the same:

- Product identity
- Typography families
- Spacing scale
- Component geometry
- Interaction patterns
- Design token architecture
- Accessibility standards

Do not implement two independent design systems.

---

## 3. EXISTING COLOR CONFIGURATION

The following semantic token contract is the starting reference.

Preserve its structure and semantic naming unless a compatibility adjustment is necessary.

```typescript
interface ColorConfig {
  background: string;
  foreground: string;
}

interface ThemeConfig {
  light: {
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
  };
  dark: {
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
  };
}

export const themeConfig: ThemeConfig = {
  light: {
    background: '#FDFBF7',
    foreground: '#4A4238',
    card: { background: 'rgba(255,255,255,0.7)', foreground: '#4A4238' },
    popover: { background: '#FFFFFF', foreground: '#4A4238' },
    primary: { background: '#7DAF74', foreground: '#FDFBF7' },
    secondary: { background: '#AEC6CF', foreground: '#4A4238' },
    muted: { background: '#F3EFE8', foreground: 'rgba(74,66,56,0.65)' },
    accent: { background: '#E8F4E6', foreground: '#5E8B56' },
    destructive: { background: '#D97757', foreground: '#FFFFFF' },
    warning: { background: '#F2C94C', foreground: '#4A4238' },
    success: { background: '#7DAF74', foreground: '#FDFBF7' },
    info: { background: '#AEC6CF', foreground: '#4A4238' },
    border: 'rgba(94,139,86,0.2)',
    input: 'rgba(94,139,86,0.15)',
    ring: 'rgba(125,175,116,0.4)',
  },
  dark: {
    background: '#1A2530',
    foreground: '#E8E6E1',
    card: { background: 'rgba(0,0,0,0.4)', foreground: '#E8E6E1' },
    popover: { background: '#243040', foreground: '#E8E6E1' },
    primary: { background: '#F2C94C', foreground: '#1A2530' },
    secondary: { background: '#4A4E69', foreground: '#E8E6E1' },
    muted: { background: '#243040', foreground: 'rgba(232,230,225,0.6)' },
    accent: { background: '#2D3A4A', foreground: '#F2C94C' },
    destructive: { background: '#D97757', foreground: '#E8E6E1' },
    warning: { background: '#E5A93D', foreground: '#1A2530' },
    success: { background: '#7DAF74', foreground: '#1A2530' },
    info: { background: '#4A4E69', foreground: '#E8E6E1' },
    border: 'rgba(255,255,255,0.1)',
    input: 'rgba(255,255,255,0.12)',
    ring: 'rgba(242,201,76,0.35)',
  },
};
```

### Color audit requirement

Treat the configuration as the initial palette, not as proof of accessibility.

Verify every meaningful foreground/background pair.

Pay particular attention to:

- Light primary button foreground
- Light success foreground
- Light accent foreground
- Dark destructive foreground
- Muted text
- Disabled controls
- Placeholder text
- Focus indicators
- Borders that communicate component boundaries

Target WCAG AA:

- At least 4.5:1 for normal text
- At least 3:1 for large text
- At least 3:1 for relevant non-text UI indicators

When the provided colors fail contrast requirements:

1. Preserve the intended visual atmosphere.
2. Propose the smallest reasonable adjustment.
3. Prefer changing foreground colors when it retains the original background palette.
4. Record the original color, adjusted color, contrast ratio, and reason in DESIGN.md.
5. Do not silently change the brand colors.
6. Distinguish required accessibility corrections from optional aesthetic changes.

For translucent colors, test the actual composited result against the relevant underlying surface.

Do not rely solely on theoretical foreground/background pairs when opacity changes their appearance.

---

## 4. SINGLE SOURCE OF TRUTH ARCHITECTURE

The web and mobile applications must not maintain two unrelated color systems.

Establish one canonical semantic token definition.

Recommended architectural concept:

```text
Shared semantic design tokens
            |
            v
     Theme configuration
            |
       +----+----+
       |         |
       v         v
    Web         Mobile
  Tailwind     NativeWind
  CSS vars     RN tokens
       |         |
       v         v
   globals.css  global.css
```

Adapt the actual file locations to the repository structure.

If a monorepo shared package already exists, prefer using it.

If the applications are separate repositories, document a maintainable synchronization strategy without inventing infrastructure or adding a publishing pipeline.

### Requirements

- Define semantic tokens once wherever technically practical.
- Avoid manually duplicating palette values throughout components.
- Keep the same token names on web and mobile.
- Support light and dark themes.
- Support alpha/transparency values.
- Preserve existing Tailwind and NativeWind compatibility.
- Avoid unnecessary dependencies.
- Avoid circular configuration imports.
- Avoid making React Native depend directly on browser-only CSS functionality.

Important: CSS variables and JavaScript color values do not behave identically across platforms.

Build an appropriate mapping or generation layer.

Do not assume that React Native can consume every browser CSS expression exactly as the web does.

If separate CSS outputs are necessary, they should derive from the same canonical definitions.

The desired outcome is:

**One semantic design system, two platform-specific integrations.**

---

## 5. WEB THEME INTEGRATION

Inspect the existing web stylesheet supplied by the user.

The file may be named:

- `globals.css`
- `global.css`
- Or another path used by the Next.js application

Do not assume its location.

### Audit

Identify:

- Tailwind version
- Existing CSS custom properties
- Existing color mapping
- Existing theme selectors
- Existing dark-mode implementation
- Existing global font rules
- Existing shadcn/ui conventions
- Existing animation and transition rules

### Implementation

Map the canonical semantic tokens to the web CSS variable system.

Support standard semantic classes such as:

- `bg-background`
- `text-foreground`
- `bg-card`
- `text-card-foreground`
- `bg-primary`
- `text-primary-foreground`
- `bg-secondary`
- `text-secondary-foreground`
- `bg-muted`
- `text-muted-foreground`
- `bg-accent`
- `text-accent-foreground`
- `border-border`
- `border-input`
- `ring-ring`

Also support destructive, warning, success, and info roles through consistent semantic naming.

Handle Tailwind v3 or v4 according to the actual installed version.

Do not assume `@theme inline` is available without checking the repository.

### Theme behavior

- Define light defaults.
- Define dark-theme overrides.
- Respect the current theme provider.
- Support system theme if the application already supports it.
- Avoid flash of incorrect theme where practical.
- Preserve existing app functionality.

Never replace the entire global stylesheet without inspecting existing rules first.

---

## 6. MOBILE THEME INTEGRATION

Inspect the mobile application's styling infrastructure.

Expected stack:

- Expo
- React Native
- NativeWind

Confirm actual versions and configuration.

### Audit

Identify:

- NativeWind version
- Existing global stylesheet
- Tailwind configuration
- Metro configuration
- Babel configuration
- Theme provider
- Existing color hooks
- React Navigation theme integration, if present
- Existing fonts and splash-screen behavior

### Implementation

Ensure that the same semantic colors can be used on mobile.

Where appropriate, expose a typed theme object such as:

```typescript
const colors = themeConfig[resolvedTheme];

colors.background;
colors.foreground;
colors.primary.background;
colors.primary.foreground;
colors.card.background;
colors.card.foreground;
```

Ensure NativeWind utility classes resolve consistently with the selected theme.

For values that cannot be represented cleanly using NativeWind utilities, use the shared typed tokens directly in React Native styles.

Account for platform differences in:

- Color alpha handling
- Shadow/elevation
- Text rendering
- Focus states
- System appearance
- Status bar
- Safe areas
- Native controls

Do not introduce a competing color configuration.

The mobile app should visually match the web's semantic roles without requiring pixel-perfect platform imitation.

---

## 7. TYPOGRAPHY SYSTEM — REQUIRED

Typography is a core part of the Spaces identity.

Define one shared font system for web and mobile.

### Recommended primary font

**DM Sans**

Use for:

- Body text
- Navigation
- Buttons
- Inputs
- Task descriptions
- Cards
- Settings
- Form labels
- General application UI

Why:

- Highly readable
- Soft but professional
- Contemporary
- Appropriate for long-session productivity applications
- Works for both compact UI and larger headings

### Recommended secondary font

**Fraunces**

Use sparingly for:

- Selected editorial display headings
- Authentication welcome headings
- Brand storytelling
- Calm empty-state headlines, where appropriate

Do not apply Fraunces to:

- Data tables
- Form labels
- Navigation
- Dense dashboards
- Technical content
- Numerical statistics

The secondary font should add warmth without reducing productivity usability.

If the existing project has an established licensed font system, inspect it before deciding to replace it.

### Required typography tokens

Define a shared type scale with at least:

| Token | Suggested size |
|---|---|
| display | 40px |
| heading-xl | 32px |
| heading-lg | 24px |
| heading-md | 20px |
| heading-sm | 18px |
| body-lg | 16px |
| body-md | 14px |
| body-sm | 13px |
| caption | 12px |

These are starting sizes, not mandatory identical values on every device.

Define:

- Font family
- Font size
- Font weight
- Line height
- Letter spacing
- Usage guidance

Avoid excessively small body text.

Typography must remain readable on compact mobile screens.

### Web font setup

Use Next.js-compatible font loading.

Prefer `next/font/google` when appropriate for the installed Next.js version.

Create stable font variables such as:

- `--font-sans`
- `--font-display`

Integrate these with the existing Tailwind configuration.

Avoid redundant external CSS font imports if fonts are already handled through Next.js.

### Mobile font setup

Use the Expo-compatible font loading method supported by the repository.

Inspect whether `expo-font` or relevant font packages already exist.

If fonts must be added:

- Use properly licensed sources.
- Load required weights.
- Avoid downloading unnecessary font variants.
- Define stable font-family names.
- Match the same typography hierarchy as web.
- Account for React Native font-weight handling.
- Prevent unintended synthetic font weights.

Follow the existing splash-screen and font-loading conventions.

Do not show the main app prematurely if doing so would cause severe font layout shifts.

### Critical typography rule

Do not switch the entire typography system between light and dark mode.

Font families and hierarchy must stay consistent.

Color, surface, and contrast change with the theme, not the product's typographic identity.

---

## 8. ADDITIONAL DESIGN TOKENS

The DESIGN.md document must define more than colors.

### Spacing

Use a consistent 4px-based spacing scale.

Suggested values:

- 4
- 8
- 12
- 16
- 20
- 24
- 32
- 40
- 48
- 64

Define which values are appropriate for cards, forms, navigation, and page sections.

### Radius

Define a restrained radius scale.

Suggested values:

- Small: 6px
- Medium: 10px
- Large: 14px
- Extra large: 20px
- Full: 9999px

The system should feel soft but not excessively rounded.

### Elevation

Define platform-aware elevation principles:

- Base surfaces
- Raised cards
- Popovers
- Dialogs

Prefer subtle borders and surface contrast over strong shadows.

Provide a web and React Native mapping where implementation differs.

### Motion

Define:

- Short interaction transitions
- Subtle hover/press feedback
- Reduced-motion support
- Loading behavior

Avoid decorative animations that compete with user attention.

---

## 9. COMPONENT GUIDELINES

Document how the tokens should be applied to:

- Buttons
- Inputs
- Cards
- Popovers
- Dialogs
- Tabs
- Navigation
- Badges
- Alerts
- Empty states
- Loading indicators
- Toasts
- Forms

Define semantic usage rather than introducing unique colors for each component.

For example:

Primary actions should use primary background and primary foreground tokens.

Success states should use success tokens.

Warnings should use warning tokens.

Errors should use destructive tokens.

Do not use hardcoded colors inside individual components when semantic tokens exist.

Do not redesign the components themselves in this task.

Only establish their design-system contract and update shared theme foundations where necessary.

---

## 10. DESIGN.MD DOCUMENT STRUCTURE

Create a comprehensive `DESIGN.md`.

Use the following structure:

1. Design System Overview
2. Brand Personality and Visual Philosophy
3. Light Theme — Warm Botanical
4. Dark Theme — Midnight Calm
5. Canonical Semantic Color Tokens
6. Color Accessibility Audit and Adjustments
7. Cross-Platform Token Architecture
8. Typography System
9. Font Loading — Next.js
10. Font Loading — Expo
11. Spacing System
12. Border Radius
13. Borders and Elevation
14. Motion and Interaction
15. Component Token Guidelines
16. Web Integration
17. Mobile Integration
18. Responsive and Platform Considerations
19. Light/Dark Theme Behavior
20. Accessibility Requirements
21. Design System Do's and Don'ts
22. Maintenance and Synchronization Strategy
23. Implementation Verification Checklist
24. Open Decisions and Compatibility Notes

The document must contain concrete token definitions, naming rules, and implementation guidance.

Do not produce a generic design philosophy document without usable technical details.

---

## 11. IMPLEMENTATION WORKFLOW

Follow these phases in order.

### Phase 1 — Inspect

Read the supplied:

- Web global stylesheet
- Mobile global stylesheet
- Theme configuration
- Tailwind configuration
- NativeWind configuration
- Existing font setup
- Relevant layout and provider files

Determine the exact project structure.

### Phase 2 — Audit

Identify:

- Duplicate tokens
- Hardcoded colors
- Conflicting semantic names
- Inconsistent dark-mode behavior
- Unsupported token formats
- Font inconsistencies
- Accessibility problems
- Web/mobile compatibility concerns

### Phase 3 — Establish design tokens

Create or refine a canonical theme definition.

Preserve existing semantic names whenever possible.

Correct accessibility problems thoughtfully and document changes.

### Phase 4 — Define typography

Set up the shared font families, typography scales, and font-loading strategy.

Use DM Sans and Fraunces as the preferred direction unless existing project constraints justify another choice.

### Phase 5 — Generate DESIGN.md

Document the final agreed token architecture and visual principles.

Include exact colors and font definitions.

Ensure all documented values correspond to the actual configuration.

### Phase 6 — Integrate web and mobile

Update the appropriate existing configuration and global stylesheets.

Make changes only where repository access and supplied files permit.

Avoid replacing existing configurations wholesale.

### Phase 7 — Verify

Run applicable TypeScript, lint, styling, or build checks.

Check that:

- Light theme is consistent
- Dark theme is consistent
- Semantic colors resolve correctly
- Typography loads correctly
- Web and mobile share the intended identity
- Existing components do not unexpectedly break

Perform visual checks if rendering tools are available.

If web or mobile checks cannot be run, document them as unverified.

---

## 12. NON-NEGOTIABLE RULES

1. One canonical semantic design system.
2. No independently maintained duplicate palettes.
3. Preserve the Warm Botanical and Midnight Calm identities.
4. Typography must be consistent between platforms.
5. Accessibility takes priority over exact adherence to initial color values.
6. No arbitrary hex colors scattered across components.
7. No unnecessary dependencies.
8. No unrelated UI redesign.
9. No authentication or business-logic modifications.
10. No unsupported platform assumptions.
11. Do not claim that integration works without verification.
12. Document every meaningful compatibility adjustment.

If a required file has not been provided, do not invent its contents or location.

Continue with the available audit and documentation, and clearly list any blocked integration steps.

---

## 13. FINAL OUTPUT

Return:

**A. DESIGN.md**
- Complete design-system documentation

**B. Design Tokens**
- Canonical theme configuration
- Light and dark semantic mappings
- Typography definitions

**C. Integration Summary**
- Web configuration changes
- Mobile configuration changes
- Font setup
- Files modified

**D. Accessibility Results**
- Contrast issues found
- Adjustments made
- Remaining issues

**E. Verification**
- Checks executed
- Results
- Unverified functionality

**F. Follow-Up Decisions**
- Only items requiring explicit product approval

## EXECUTION INSTRUCTION

Begin by reading both global stylesheets and the existing project configuration.

Treat the provided ThemeConfig as the initial source of color intent.

Establish `DESIGN.md` as the authoritative human-readable specification and a shared typed token definition as the authoritative machine-readable source.

Then synchronize the web and mobile implementations.

The end result must be a coherent design system that feels like the same product on every platform, while allowing light and dark themes to express their own atmosphere.

**Spaces should feel warm during the day, peaceful at night, and unmistakably Mora everywhere.**