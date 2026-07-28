# ROLE & OBJECTIVE

You are a Principal Frontend Engineer and Full-Stack Integration Architect specializing in Next.js (App Router), TypeScript, Clean Architecture, and B2B SaaS execution workspaces.
Your task is to build a highly functional, visually polished "Member Dashboard" (Personal Execution Workspace) for "Spaces" and integrate it directly with our existing ElysiaJS backend APIs.

# TECH STACK & ARCHITECTURAL STANDARDS

1. Framework: Next.js (App Router) with TypeScript.
2. UI Library & Styling: shadcn/ui + Tailwind CSS + Lucide React icons.
3. Smooth Scrolling & Animation: Studio Freight Lenis + GSAP (`useGSAP` hook from `@gsap/react`).
4. Design Pattern: Strict **Atomic Design** (`atoms`, `molecules`, `organisms`, `templates`, `pages`).
5. Naming Convention: **PascalCase** for all component filenames (NO kebab-case). Every directory must have an `index.ts` barrel file using wildcard named re-exports (`export * from "./ComponentName";`).
6. API Client: Clean Axios/Fetch service layer or custom hooks (e.g., SWR/React Query) with JWT Bearer Token authentication (`verifyToken` middleware is used in backend).

# MEMBER DASHBOARD VIBE & PURPOSE

Unlike the Owner Dashboard (which is macro/strategic), the Member Dashboard is **micro/execution-focused**. It answers: _"What do I need to execute today, what is my schedule, and how do I stay focused?"_
Language: Indonesian (for all UI text, labels, and empty states).

# REQUIRED MODULES & ELYSIA API INTEGRATION

Build the dashboard by dividing it into these 6 core execution widgets, connecting each to its corresponding ElysiaJS backend endpoint:

1. Personal Morning Greeting & Daily Stats (Top Banner)
   - UI: "Selamat Pagi/Siang, [Full Name]" with quick daily metrics (Completed Tasks Today, Pomodoro Minutes, Total Meetings Today).
   - Backend Integration: Fetch user profile from `/companies/me` or auth session, and daily productivity stats from `GET /session` or `/todos?date=today`.

2. Active Focus Workspace (Pomodoro Timer & Focus Mode)
   - UI: An interactive Pomodoro Timer widget (25:00 default) with Start, Pause, Resume, and Stop controls. Include a "Focus Mode" toggle switch that visually mutes non-essential dashboard widgets.
   - Backend Integration: Log completed sessions to the backend (e.g., Pomodoro statistics endpoint or daily stats update).

3. My Priority Todos & Task Execution
   - UI: Interactive task list with checkboxes, due date badges, and priority indicators. Allow inline quick-create for new todos and quick toggle for completion.
   - Backend Integration:
     - Fetch list: `GET /todos?status=pending` (from `TodoRouter`).
     - Create: `POST /todos` (body: `CreateTodoDto`).
     - Toggle status: `PATCH /todos/:id` (body: `UpdateTodoDto` toggling `completed: true/false`).

4. Today's Agenda (Calendar & Meetings)
   - UI: Timeline view of today's upcoming meetings and events. Show time blocks, event titles, and a quick "Join Meeting" or detail modal button.
   - Backend Integration: Fetch today's schedule via `GET /calendar/events?month=[MM]&year=[YYYY]` (from `CalendarRouter`).

5. Music Companion (Playlist Widget)
   - UI: Compact music player / playlist selector to aid deep work. Displays YouTube URL references or embedded lofi/focus audio streams.
   - Backend Integration: Fetch saved playlists via `GET /music/playlists` and allow adding new favorite URLs via `POST /music/playlists` (from `MusicRouter`).

6. Quick Scratchpad / Personal Notes
   - UI: A minimalist, sticky-note-style widget for rapid ideas or meeting bullet points.
   - Backend Integration: Fetch recent notes via `GET /notes` and create quick notes via `POST /notes` (from `NoteRouter`).

# ATOMIC DESIGN BREAKDOWN REQUIREMENTS

Deconstruct the UI strictly into PascalCase files:

- `src/components/atoms/`: `TimerDisplay.tsx`, `StatusCheckbox.tsx`, `WidgetHeader.tsx`, `FocusToggle.tsx`, `index.ts`.
- `src/components/molecules/`: `TodoItemCard.tsx`, `AgendaTimelineItem.tsx`, `PlaylistItemCard.tsx`, `QuickNoteCard.tsx`, `StatMiniCard.tsx`, `index.ts`.
- `src/components/organisms/`: `PomodoroSection.tsx`, `TodoListSection.tsx`, `AgendaSection.tsx`, `MusicSection.tsx`, `QuickNotesSection.tsx`, `index.ts`.
- `src/components/templates/`: `MemberDashboardTemplate.tsx` (Handles Lenis scroll wrapping and GSAP stagger entrance animations), `index.ts`.
- `src/services/api/`: `todo.service.ts`, `calendar.service.ts`, `music.service.ts`, `note.service.ts` (Clean API callers with error handling).

# GSAP ANIMATION & UX REQUIREMENTS

1. Use `useGSAP` in `MemberDashboardTemplate.tsx` to animate the entrance of widgets with a staggered fade-up effect (`from({ opacity: 0, y: 25 })` to `to({ opacity: 1, y: 0, stagger: 0.08, ease: "power2.out" })`).
2. Include Skeleton Loaders (using shadcn `<Skeleton />`) for all widgets while data is fetching from the Elysia APIs.
3. Ensure optimistic UI updates for Todo checkbox toggles so the UI feels instant before the API response confirms.

# MANDATORY VERIFICATION & BUILD STEP

After writing all components, services, and integrating the APIs:

1. Review all created files to guarantee 100% PascalCase naming and correct barrel exports (`index.ts`).
2. Run the terminal build command (`bun run build` or `npm run build` or `npx tsc --noEmit`).
3. If any TypeScript errors, missing imports, or type mismatches occur (especially regarding API DTO response types), debug and fix them autonomously until the build succeeds with 0 errors.
