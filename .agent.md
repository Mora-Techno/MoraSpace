# SPACES AGENT CONFIGURATION & PLAYBOOK

## 1. Project Overview & Architecture
- **Backend (`apps/be`)**: Bun + Elysia.js + Prisma ORM + PostgreSQL.
- **Frontend Web (`apps/fe`)**: Next.js 16 + React 19 + Tailwind CSS + Radix UI.
- **Mobile (`apps/mobile`)**: Expo + React Native + NativeWind.
- **Shared (`packages/shared`)**: Contract-first shared types, endpoints, and react-query services.
- **Monorepo Manager**: Turborepo + Bun Workspaces.

## 2. Skills Required for Development
Agents working in this codebase should activate and reference these capabilities:
- **`graphify`**: Codebase knowledge graph navigation, query, dependency mapping, and architectural tracing.
- **`ponytail`**: Minimalist engineering: favor standard libraries, native platform features, zero unnecessary abstractions, and minimal diffs.
- **`ui-styling` / `ui-ux-pro-max`**: Design system compliance, Tailwind/Radix UI patterns, accessible, responsive workspace layouts.
- **`design-system`**: Design tokens, component specs, and consistent styling across web and mobile.

## 3. Non-Negotiable Core Rules
1. **Multi-Tenant Isolation (Layer 2)**:
   - Every tenant query/mutation MUST verify `companyId` and `companyMemberId`.
   - Never allow cross-tenant data leakage.
2. **Platform Role Isolation (Layer 1)**:
   - Global developer/super-admin access attaches to `User.platformRole` (`MEMBER`, `DEVELOPER`, `SUPER_ADMIN`).
   - Never query or link `CompanyMember` or `Role` tables for Layer 1 platform access.
3. **Respect Working Hours Policy**:
   - Any notification or email trigger must explicitly classify as `Critical` (immediate dispatch) or `Normal` (working-hours queue).
4. **Shared Contract First**:
   - Any schema or endpoint modification must update atomically:
     - `apps/be/prisma/schema.prisma`
     - Elysia controllers/DTOs in `apps/be/src`
     - Shared types and SDK in `packages/shared`
5. **Quality & Validation**:
   - Run typecheck, lint, and formatting before completing tasks (`bun run lint`, `bun run format:check`).

## 4. Knowledge Graph (Graphify) Auto-Update Rule
Knowledge graph artifacts are stored in `graphify-out/`.

### Knowledge Graph Maintenance Protocol:
- **Query First**: For codebase questions, check `graphify-out/graph.json` via `/graphify query "<question>"` or `graphify query "<question>"`.
- **Auto-Sync Trigger**: After introducing new features, new endpoints, refactoring directory structures, or editing data models, run:
  ```bash
  graphify update .
  ```
  *(or `bun run graphify:update` if scripted)*
- **Git Hook Setup (Automated on Commit)**:
  A pre-commit hook runs `graphify update .` whenever staged files include changes outside `graphify-out/` to prevent knowledge drift.
