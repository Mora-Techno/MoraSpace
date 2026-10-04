# Graph Report - Space  (2026-10-04)

## Corpus Check
- 790 files · ~138,348 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 3753 nodes · 10220 edges · 313 communities (176 shown, 137 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 331 edges (avg confidence: 0.79)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `15c356ca`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Calendar and Notes
- Auth and Endpoints
- App and Auth DTOs
- Department and Member
- UI Components
- Config and Calendar DTOs
- Controllers Mix
- Auth Pages and Dashboard
- Mobile Dev Dependencies
- API Endpoints Config
- Frontend Dev Dependencies
- Role and Company State
- Biome Config
- Settings and Dropdown UI
- API Response Types
- Notes UI
- Alert and Button UI
- Subscription and Stripe
- Calendar UI
- Company and Team Services
- Command and Dialog UI
- Frontend TypeScript Config
- Project Dependencies
- Auth Service
- Todo State Management
- Server Fetch and Auth
- Music and Home
- Expo App Config
- App Layout and Theme
- Auth Forms
- Backend TypeScript Config
- Backend Dependencies
- Backend Dev Dependencies
- Session Management
- Auth Containers
- Auth Token and Session
- Calendar, Note, Todo Controllers
- Query Keys and Configs
- App Layout and Providers
- Alert and Notification State
- Mobile Pages
- API Client Setup
- Role Service
- Sitemap and App Config
- Alert Dialog Atoms
- Shared TypeScript Config
- Music Controller
- Invitation Service
- UI Input and Navigation
- Subscription State
- Music and Settings State
- Turbo Tasks
- UI Toast and Alert
- Mobile UI Components
- Redux Auth Store
- Frontend Components Config
- Public Pages
- Task State Management
- Task State Management
- Member Service
- Position Service
- App Layout and Providers
- Mobile Components Config
- Pomodoro Controller
- Role State
- Member State
- Team State
- Mobile TypeScript Config
- Shared Package Exports
- Backend Package Scripts
- Auth Controller Routes
- Invitation Controller
- Position Controller
- Subscription Controller
- Carousel UI
- Role State
- Mobile Dependencies
- Shared React Query
- UI Dependencies
- Private Layout and Auth
- Member State
- Pomodoro State
- Note State
- Pomodoro State
- Task Service
- Auth State
- Calendar State
- Department State
- Invitation State
- Note State
- Team State
- Department State
- Invitation State
- Task Controller and Types
- Department Service
- Auth Layout and NotFound
- Position State
- Notification State
- Position State
- Session Management
- Subscription Flow
- Theme CSS Builder
- Package Config
- Dev Dependencies
- Pomodoro Service
- Session State
- Peer Dependencies
- Music Playlist
- Observability Stack
- Pomodoro Methods
- Query Params Desktop
- Query Params Mobile
- Calendar Events
- Department Management
- Note Management
- Todo DTOs Routes
- Company Queries
- Mutation Wrapper
- Session Endpoints
- Home Page UI
- Badge Component
- Auth Hooks
- Metro Config
- Music Playlist Service
- API Error Classes
- HTTP Response
- ESLint Config
- Code Scripts
- Backend Elysia
- Frontend Next.js
- Login UI
- ESLint Expo
- Query Boundary
- Toaster Component
- Form Types
- Logger Utility
- Mobile Expo
- Axios
- Settings and Select UI
- Cloudinary
- Elysia Helmet
- Elysia Cron
- Google Auth
- JWT
- Nodemailer
- Prisma
- Repo Package
- Sharp
- Swagger
- Types JWT
- Types Nodemailer
- Types Web Push
- UUID
- Prisma Client
- Next Config
- OpenTelemetry
- Classnames
- Clsx
- CMDK
- Cookies Next
- Date Fns
- Embla Carousel
- Import Sort Plugin
- Goey Toast
- GSAP
- Hookform Resolvers
- i18next
- Jose
- Lenis
- Lucide Icons
- Next
- Next i18next
- Next Themes
- Next Toploader
- Radix UI
- Radix Accordion
- Radix Avatar
- Radix Dialog
- Radix Dropdown
- Radix Popover
- Radix Select
- Radix Separator
- Radix Slot
- React
- React DOM
- React Hook Form
- React Hot Toast
- React i18next
- React OAuth Google
- Repo Package
- Sonner
- T3 Env
- TanStack Query
- Query Devtools
- Tailwind Animate
- PostCSS Config
- Toast Notifications
- Environment Types
- Burnt Toast Library
- Class Variance Authority
- Class Name Utility
- Expo Constants
- Expo Dev Client
- expo-notifications
- Expo Haptics
- authSlice.ts
- expo-router
- Expo Secure Store
- Expo Splash Screen
- Expo Status Bar
- Expo Symbols
- Expo System UI
- Expo Vector Icons
- Expo Web Browser
- Lottie Animations
- Lucide Icons
- NativeWind Styling
- React Core
- React Native
- Async Storage
- CSS Interop
- React Native Dotenv
- Gesture Handler
- Keyboard Aware Scroll
- React Native Paper
- Reanimated Animations
- Native Screens
- React Native SVG
- React Native Web
- Bottom Tab Navigation
- Drawer Navigation
- React Redux
- Redux Persist
- Monorepo Package
- Alert Dialog Primitive
- Aspect Ratio Primitive
- Checkbox Primitive
- Dialog Primitive
- Progress Primitive
- Slot Primitive
- Sonner Native Toast
- InvitationService
- Zod Validation
- Form Login Types
- auth.provider.tsx
- Grafana Volume
- Loki Volume
- Observability Network
- Tempo Volume
- Delete Response Type
- burnt
- SessionService
- Notification/state/mutate.ts
- @aejkatappaja/phantom-ui
- plan2.md
- cloudinary
- owner/todos/_containers/todos.tsx
- shared/utils/log.ts
- @gsap/react
- @radix-ui/react-navigation-menu
- tailwind-merge
- zod
- expo-linking
- install
- elysia-helmet
- @react-navigation/elements
- @react-navigation/native
- @reduxjs/toolkit
- sharp
- react-hot-toast
- recharts
- sonner
- socket.io
- @types/jsonwebtoken
- expo-asset
- @expo/metro-runtime
- expo-modules-core
- invariant
- lucide-react-native
- react-native-safe-area-context
- @react-navigation/bottom-tabs
- @react-navigation/core
- @react-navigation/native-stack
- @react-navigation/routers
- sonner-native
- @tanstack/react-query
- .deleteSessionById
- uuid
- expo-image
- SessionService
- class-variance-authority

## God Nodes (most connected - your core abstractions)
1. `AppContext` - 183 edges
2. `cn()` - 182 edges
3. `HttpResponse()` - 170 edges
4. `TResponse` - 150 edges
5. `toServiceResponse()` - 146 edges
6. `getUser()` - 129 edges
7. `error()` - 124 edges
8. `useAppMutation` - 94 edges
9. `useAppMutation` - 79 edges
10. `useApi()` - 74 edges

## Surprising Connections (you probably didn't know these)
- `createAppMutationHook()` --indirect_call--> `error()`  [INFERRED]
  packages/shared/react-query/useAppMutation.ts → apps/be/src/contracts/api-regression.test.ts
- `roleType` --references--> `CompanyRole`  [EXTRACTED]
  apps/be/src/utils/roleHelper.ts → packages/shared/types/company.types.ts
- `SubscriptionPlan` --references--> `SubscriptionTier`  [EXTRACTED]
  apps/be/src/config/subscriptionPlans.ts → packages/shared/types/company.types.ts
- `registerForPushNotificationsAsync()` --indirect_call--> `error()`  [INFERRED]
  apps/mobile/service/notification.service.ts → apps/be/src/contracts/api-regression.test.ts
- `AgendaTimelineItemProps` --references--> `CalendarEvent`  [EXTRACTED]
  apps/fe/src/components/molecules/AgendaTimelineItem.tsx → packages/shared/types/calendar.types.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Observability Stack** — docker_compose_alloy, docker_compose_tempo, docker_compose_loki, docker_compose_grafana [EXTRACTED 1.00]
- **Application Stack** — apps_be, apps_fe, apps_mobile [INFERRED 0.80]

## Communities (313 total, 137 thin omitted)

### Community 0 - "Calendar and Notes"
Cohesion: 0.24
Nodes (16): TasksContainer(), TaskSection(), useAddTaskAttachment(), useAddTaskComment(), useAssignTask(), useCreateTask(), useCreateTaskChecklist(), useDeleteTask() (+8 more)

### Community 1 - "Auth and Endpoints"
Cohesion: 0.06
Nodes (24): NotificationDetailSectionProps, NOTE_ENDPOINTS, NOTIFICATION_ENDPOINTS, TODO_ENDPOINTS, useMutationWrapper(), AppMutationConfig, BaseAppNameSpace, createAppMutationHook() (+16 more)

### Community 2 - "App and Auth DTOs"
Cohesion: 0.16
Nodes (14): mapTrack(), TrackCatalogService, createMailTransport(), formatMailError(), getMailFromAddress(), getTransport(), isGmailHost(), normalizeSmtpPassword() (+6 more)

### Community 3 - "Department and Member"
Cohesion: 0.10
Nodes (13): DepartmentController, MemberController, PositionController, TaskController, TeamController, DepartmentRouter, MemberRouter, PositionRouter (+5 more)

### Community 4 - "UI Components"
Cohesion: 0.04
Nodes (71): CalendarContainer(), AccordionContent(), AccordionItem(), AccordionTrigger(), CardFooter(), DialogOverlay(), NavigationMenu(), NavigationMenuContent() (+63 more)

### Community 5 - "Config and Calendar DTOs"
Cohesion: 0.12
Nodes (18): QuickAddFormProps, NoteModal(), NoteModalProps, QuickNoteModalProps, modeQuick, QuickAddFab(), QuickAddFabProps, QuickNoteCardProps (+10 more)

### Community 6 - "Controllers Mix"
Cohesion: 0.13
Nodes (7): PomodoroController, TodoController, TrackCatalogController, PomodoroRouter, TodoRouter, TrackCatalogRouter, personalContextValidate()

### Community 7 - "Auth Pages and Dashboard"
Cohesion: 0.21
Nodes (17): AuthTokens, clearTokens(), COOKIE_KEYS, getCookieStore(), getRoleFromCookie(), saveTokens(), TokenPair, COOKIE_KEYS (+9 more)

### Community 8 - "Mobile Dev Dependencies"
Cohesion: 0.04
Nodes (48): devDependencies, autoprefixer, babel-plugin-module-resolver, @babel/plugin-transform-react-jsx, babel-preset-expo, eslint, eslint-config-expo, eslint-plugin-simple-import-sort (+40 more)

### Community 9 - "API Endpoints Config"
Cohesion: 0.09
Nodes (33): buildEndpoint(), listEndpoints(), AUTH_ENDPOINTS, listAuthEndpoints(), listCalendarEndpoints(), COMPANY_ENDPOINTS, listCompanyEndpoints(), listDepartmentEndpoints() (+25 more)

### Community 10 - "Frontend Dev Dependencies"
Cohesion: 0.06
Nodes (35): devDependencies, bun-types, eslint, eslint-config-next, eslint-config-prettier, @eslint/eslintrc, eslint-import-resolver-typescript, eslint-plugin-import (+27 more)

### Community 11 - "Role and Company State"
Cohesion: 0.31
Nodes (5): SESSION_ENDPOINT, SessionService, ISession, Session, SessionQuery

### Community 12 - "Biome Config"
Cohesion: 0.04
Nodes (46): source, assist, actions, noUnusedVariables, files, includes, formatter, enabled (+38 more)

### Community 13 - "Settings and Dropdown UI"
Cohesion: 0.10
Nodes (21): DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator(), DropdownMenuShortcut() (+13 more)

### Community 14 - "API Response Types"
Cohesion: 0.18
Nodes (20): DelResponse, GetResponse, PatchResponse, PostResponse, PublicGetResponse, PublicPostResponse, PutResponse, QueryValue (+12 more)

### Community 15 - "Notes UI"
Cohesion: 0.06
Nodes (34): Avatar(), AvatarFallback(), AvatarImage(), FocusToggle(), FocusToggleProps, TimerDisplay(), TimerDisplayProps, AiInsightsBanner() (+26 more)

### Community 16 - "Alert and Button UI"
Cohesion: 0.10
Nodes (29): AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription(), AlertDialogFooter(), AlertDialogHeader(), AlertDialogOverlay(), AlertDialogTitle() (+21 more)

### Community 17 - "Subscription and Stripe"
Cohesion: 0.09
Nodes (31): getPeriodEnd(), getPlan(), getPlanPrice(), PaymentProvider, PlanPrice, SUBSCRIPTION_PLANS, SubscriptionPlan, StripeService (+23 more)

### Community 18 - "Calendar UI"
Cohesion: 0.18
Nodes (15): FloatingMusicPlayer(), QueuePanel(), sendPlayerCommand(), toEmbedUrl(), useYouTubeOnEnded(), buildShuffledQueue(), fisherYatesShuffle(), initialState (+7 more)

### Community 20 - "Command and Dialog UI"
Cohesion: 0.07
Nodes (25): SessionWithProfile, Skeleton(), WidgetHeader(), WidgetHeaderProps, AgendaTimelineItem(), CatalogModal(), CatalogModalProps, PlayListModalProps (+17 more)

### Community 21 - "Frontend TypeScript Config"
Cohesion: 0.06
Nodes (33): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+25 more)

### Community 22 - "Project Dependencies"
Cohesion: 0.06
Nodes (34): @biomejs/biome, dependencies, axios, @sinclair/typebox, @tanstack/react-query, @tanstack/react-query-devtools, devDependencies, @biomejs/biome (+26 more)

### Community 23 - "Auth Service"
Cohesion: 0.10
Nodes (26): AuthService, AUTH_EXPIRY, generateOtp(), generateSecureToken(), getMagicLinkExpiry(), getOtpExpiry(), resolveAuthUser(), ForgotPasswordSectionProps (+18 more)

### Community 24 - "Todo State Management"
Cohesion: 0.19
Nodes (14): TListResponse, TPagedList, TPagedListResponse, apiDelete(), apiGet(), apiPatch(), apiPost(), apiPut() (+6 more)

### Community 25 - "Server Fetch and Auth"
Cohesion: 0.29
Nodes (9): CatalogReviewContainer(), CatalogReviewSection(), useApproveTrack(), useDeleteTrack(), useRejectTrack(), useSubmitTrack(), usePendingTracks(), useTrackCatalogList() (+1 more)

### Community 26 - "Music and Home"
Cohesion: 0.10
Nodes (17): MusicContainer(), NotesContainer(), ContainerHome(), Badge(), badgeVariants, CtaSection(), FEATURES, FeaturesSection() (+9 more)

### Community 27 - "Expo App Config"
Cohesion: 0.07
Nodes (28): backgroundColor, backgroundImage, foregroundImage, monochromeImage, adaptiveIcon, edgeToEdgeEnabled, predictiveBackGestureEnabled, usesCleartextTraffic (+20 more)

### Community 28 - "App Layout and Theme"
Cohesion: 0.08
Nodes (21): MobileCalendarContainer(), HomePageContainer(), TabsLayout(), MobileNotesContainer(), LoginPage(), HomePageSection(), ThemeToggle(), ColorConfig (+13 more)

### Community 29 - "Auth Forms"
Cohesion: 0.07
Nodes (32): GhibliCard(), GhibliCardProps, GhibliTab, GhibliTabs(), GhibliTabsProps, GoogleSignInButton(), GoogleSignInButtonProps, TodoCreateModalProps (+24 more)

### Community 30 - "Backend TypeScript Config"
Cohesion: 0.07
Nodes (28): compilerOptions, allowSyntheticDefaultImports, baseUrl, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, lib, module (+20 more)

### Community 31 - "Backend Dependencies"
Cohesion: 0.07
Nodes (27): dependencies, axios, @elysia/opentelemetry, @elysiajs/cors, form-data, google-auth-library, pino-pretty, prisma (+19 more)

### Community 32 - "Backend Dev Dependencies"
Cohesion: 0.07
Nodes (27): devDependencies, bun-types, eslint, eslint-config-prettier, eslint-plugin-prettier, prettier, ts-node, @types/bcryptjs (+19 more)

### Community 33 - "Session Management"
Cohesion: 0.06
Nodes (16): EventDetailContainer(), toLocalInput(), TodoDetailContainer(), toLocalInput(), Button(), ButtonProps, buttonVariants, Calendar() (+8 more)

### Community 34 - "Auth Containers"
Cohesion: 0.35
Nodes (11): useCreateAdmin(), useDeleteAdmin(), useRegisterCompany(), useUpdateCompanyProfile(), useUpdateCompanySubscription(), useGetMyCompany(), useListAdmins(), CompanyCacheContext (+3 more)

### Community 35 - "Auth Token and Session"
Cohesion: 0.13
Nodes (27): buildBaseHeaders(), clearTokens(), COOKIE_KEYS, coreFetch(), coreFetchResponse(), Del(), _doRefreshOnce(), doRefreshToken() (+19 more)

### Community 37 - "Query Keys and Configs"
Cohesion: 0.40
Nodes (9): useCreateNote(), useDeleteNote(), useUpdateNote(), useNote(), useNotes(), NoteCacheContext, readNoteDetailSnapshot(), readNoteListSnapshot() (+1 more)

### Community 38 - "App Layout and Providers"
Cohesion: 0.24
Nodes (5): AuthController, HttpResponse(), isGetRequest(), AuthRouter, CreateWorkStationValidate()

### Community 39 - "Alert and Notification State"
Cohesion: 0.28
Nodes (15): useMarkAllRead(), useMarkRead(), useSendNotification(), useNotification(), useNotificationLogs(), useNotifications(), NotificationCacheContext, notificationDetailKey() (+7 more)

### Community 40 - "Mobile Pages"
Cohesion: 0.13
Nodes (19): HomeContainer(), SectionHomePage(), Badge(), BadgeProps, badgeTextVariants, badgeVariants, Card(), CardContent() (+11 more)

### Community 41 - "API Client Setup"
Cohesion: 0.12
Nodes (23): BASE_URL, AuthErrorHandler, BaseURLProvider, buildApiUrl(), buildBaseHeaders(), clientCoreFetch(), clientCoreFetchResponse(), ClientDel() (+15 more)

### Community 42 - "Role Service"
Cohesion: 0.15
Nodes (10): RoleService, ROLE_ENDPOINTS, RoleService, IPermission, IRole, PermissionQuery, PickCreateRole, PickUpdateRole (+2 more)

### Community 43 - "Sitemap and App Config"
Cohesion: 0.17
Nodes (9): generateSitemap(), GET(), AppConfig, PropsParams, PUBLIC_ROUTES, RegisterConfigRoutes, SIDEBAR_MENU, env (+1 more)

### Community 44 - "Alert Dialog Atoms"
Cohesion: 0.16
Nodes (18): AlertDialog(), AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription(), AlertDialogFooter(), AlertDialogHeader(), AlertDialogMedia() (+10 more)

### Community 45 - "Shared TypeScript Config"
Cohesion: 0.08
Nodes (23): compilerOptions, esModuleInterop, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+15 more)

### Community 46 - "Music Controller"
Cohesion: 0.33
Nodes (9): useCreateNote(), useDeleteNote(), useUpdateNote(), useNote(), useNotes(), useNotess(), NoteCacheContext, readNoteDetailSnapshot() (+1 more)

### Community 47 - "Invitation Service"
Cohesion: 0.17
Nodes (7): InvitationService, InvitationService, IInvitation, InvitationQuery, PickAcceptInvitation, PickCreateInvitation, PickRejectInvitation

### Community 48 - "UI Input and Navigation"
Cohesion: 0.22
Nodes (20): useCreateAdmin(), useDeleteAdmin(), useRegisterCompany(), useUpdateCompanyProfile(), useUpdateCompanySubscription(), useAddTaskAttachment(), useAddTaskComment(), useAssignTask() (+12 more)

### Community 49 - "Subscription State"
Cohesion: 0.11
Nodes (20): BillingContainer(), BillingSection(), BillingSectionProps, useCancelSubscription(), useCreateCheckout(), useSubscription(), useSubscriptionPlans(), useSubscription() (+12 more)

### Community 50 - "Music and Settings State"
Cohesion: 0.25
Nodes (8): _env, envSchema, CreateRoleDto, PermissionQueryDto, RoleParamsDto, RoleQueryDto, UpdateRoleDto, UpdateRolePermissionsDto

### Community 51 - "Turbo Tasks"
Cohesion: 0.10
Nodes (19): ^lint, !.next/cache/**, dependsOn, outputs, cache, persistent, cache, ^build (+11 more)

### Community 52 - "UI Toast and Alert"
Cohesion: 0.06
Nodes (49): Card(), CardAction(), CardContent(), CardDescription(), CardHeader(), CardTitle(), Dialog(), DialogContent() (+41 more)

### Community 53 - "Mobile UI Components"
Cohesion: 0.14
Nodes (16): LoginPageProps, AlertModal(), AlertModalInternalProps, iconMap, styles, { width }, PopUp(), styles (+8 more)

### Community 54 - "Redux Auth Store"
Cohesion: 0.31
Nodes (4): CatalogReviewSectionProps, TrackCatalogService, TrackCatalog, TrackCatalogQuery

### Community 55 - "Frontend Components Config"
Cohesion: 0.11
Nodes (17): aliases, components, hooks, lib, ui, utils, iconLibrary, rsc (+9 more)

### Community 56 - "Public Pages"
Cohesion: 0.20
Nodes (15): ALL_NAV_ITEMS, getMobileNavGroups(), getMobileNavItems(), getNavItems(), isMobileNavItem(), MEMBER_WORKSPACE_ITEMS, MOBILE_NAV_ITEMS, MobileNavItem (+7 more)

### Community 58 - "Task State Management"
Cohesion: 0.32
Nodes (10): ForgotPasswordDto, LoginDto, RefreshTokenDto, RegisterDto, ResetPasswordDto, SendMagicLinkDto, SendOtpDto, UserQueryDto (+2 more)

### Community 59 - "Member Service"
Cohesion: 0.08
Nodes (18): MemberService, MEMBER_ENDPOINTS, TEAM_ENDPOINTS, CompanyService, MemberService, toServiceResponse(), TeamService, CompanyProfile (+10 more)

### Community 60 - "Position Service"
Cohesion: 0.20
Nodes (7): PositionService, POSITION_ENDPOINTS, PositionService, IPosition, PickCreatePosition, PickUpdatePosition, PositionQuery

### Community 61 - "App Layout and Providers"
Cohesion: 0.13
Nodes (15): composeProviders(), ProviderComponent, ProviderProps, Providers, ThemeProvider(), AlertProvinder(), ReactQueryClientProvider(), AppDispatch (+7 more)

### Community 62 - "Mobile Components Config"
Cohesion: 0.12
Nodes (15): aliases, components, hooks, lib, ui, utils, rsc, $schema (+7 more)

### Community 63 - "Pomodoro Controller"
Cohesion: 0.14
Nodes (15): DEFAULT_EMPLOYMENT_TYPES, DEFAULT_TASK_PRIORITIES, DEFAULT_TASK_STATUSES, CompanyService, sanitizeUser(), resolveCompanyRole(), slugify(), toSafeAuthUser() (+7 more)

### Community 64 - "Role State"
Cohesion: 0.33
Nodes (11): useCreateRole(), useDeleteRole(), useUpdateRole(), useUpdateRolePermissions(), useGetRolePermissions(), useListMasterPermissions(), useListRoles(), readRoleSnapshot() (+3 more)

### Community 65 - "Member State"
Cohesion: 0.29
Nodes (12): useDeleteMember(), useUpdateContacts(), useUpdateMember(), useUpdateProfile(), useGetContacts(), useGetMember(), useGetProfile(), useListMembers() (+4 more)

### Community 66 - "Team State"
Cohesion: 0.31
Nodes (11): useAddTeamMember(), useCreateTeam(), useDeleteTeam(), useRemoveTeamMember(), useUpdateTeam(), useListTeamMembers(), useListTeams(), useTeam() (+3 more)

### Community 67 - "Mobile TypeScript Config"
Cohesion: 0.13
Nodes (14): compilerOptions, paths, strict, extends, include, ../../packages/shared/*, ../../packages/shared/index.ts, **/*.ts (+6 more)

### Community 68 - "Shared Package Exports"
Cohesion: 0.13
Nodes (15): exports, ./api/client, ./api/server, ./config/api, ./endpoints, ./react-query/mutation-wrapper, ./react-query/mutation-wrapper.type, ./react-query/query-client (+7 more)

### Community 69 - "Backend Package Scripts"
Cohesion: 0.13
Nodes (14): name, scripts, build, dev, format, format:check, lint, lint:fix (+6 more)

### Community 70 - "Auth Controller Routes"
Cohesion: 0.17
Nodes (14): TaskSectionProps, TASK_ENDPOINTS, TaskService, ITask, PickAddTaskAttachment, PickAddTaskComment, PickAssignTask, PickCreateTask (+6 more)

### Community 71 - "Invitation Controller"
Cohesion: 0.52
Nodes (5): AcceptInvitationDto, CreateInvitationDto, InvitationParamsDto, InvitationQueryDto, RejectInvitationDto

### Community 72 - "Position Controller"
Cohesion: 0.27
Nodes (4): SettingsController, TestEmailDto, UpdateSettingsDto, SettingsRouter

### Community 74 - "Carousel UI"
Cohesion: 0.20
Nodes (13): Carousel(), CarouselApi, CarouselContent(), CarouselContext, CarouselContextProps, CarouselItem(), CarouselNext(), CarouselOptions (+5 more)

### Community 75 - "Role State"
Cohesion: 0.30
Nodes (11): useCreateRole(), useDeleteRole(), useUpdateRole(), useUpdateRolePermissions(), useGetRolePermissions(), useListMasterPermissions(), useListRoles(), useRole() (+3 more)

### Community 76 - "Mobile Dependencies"
Cohesion: 0.12
Nodes (17): dependencies, burnt, expo-font, expo-system-ui, @expo/vector-icons, react-native-keyboard-aware-scroll-view, react-native-reanimated, react-native-worklets (+9 more)

### Community 77 - "Shared React Query"
Cohesion: 0.33
Nodes (8): useCreatePosition(), useDeletePosition(), useUpdatePosition(), useListPositions(), usePosition(), PositionCacheContext, positionsRoot, readPositionSnapshot()

### Community 78 - "UI Dependencies"
Cohesion: 0.06
Nodes (33): dependencies, classnames, cmdk, date-fns, embla-carousel-react, lenis, next-themes, nextjs-toploader (+25 more)

### Community 79 - "Private Layout and Auth"
Cohesion: 0.16
Nodes (15): useGetMyCompany(), useListAdmins(), useCompany(), useCreatePlaylist(), useDeletePlaylist(), usePlaylists(), useMusic(), useCancelSubscription() (+7 more)

### Community 80 - "Member State"
Cohesion: 0.30
Nodes (12): useDeleteMember(), useUpdateContacts(), useUpdateMember(), useUpdateProfile(), useGetContacts(), useGetMember(), useGetProfile(), useListMembers() (+4 more)

### Community 81 - "Pomodoro State"
Cohesion: 0.21
Nodes (12): PomodoroContainer(), PomodoroSection(), usePausePomodoroSession(), useResumePomodoroSession(), useStartPomodoroSession(), useStopPomodoroSession(), useGetPomodoroStatistics(), useGetTodayFocus() (+4 more)

### Community 82 - "Note State"
Cohesion: 0.20
Nodes (5): NoteService, EditNoteDialogProps, INote, NoteParams, PickUpdateNote

### Community 83 - "Pomodoro State"
Cohesion: 0.32
Nodes (10): usePausePomodoroSession(), useResumePomodoroSession(), useStartPomodoroSession(), useStopPomodoroSession(), useGetPomodoroStatistics(), useGetTodayFocus(), usePomodoro(), podomoroRoot (+2 more)

### Community 84 - "Task Service"
Cohesion: 0.08
Nodes (42): CalendarService, mapEvent(), NotificationListSectionProps, AccessTokenPayload, IAuth, PlatformRole, EventParams, EventQuery (+34 more)

### Community 85 - "Auth State"
Cohesion: 0.04
Nodes (33): ForgotPasswordContainer(), LoginContainer(), MagicLinkContainer(), RegisterCompanyContainer(), RegisterEmployContainer(), ResetPasswordContainer(), AddDocContainer(), DashboardContainer() (+25 more)

### Community 86 - "Calendar State"
Cohesion: 0.36
Nodes (10): useCreateEvent(), useDeleteEvent(), useUpdateEvent(), useEvent(), useEvents(), CalendarCacheContext, calenderRootKey, eventsListKey() (+2 more)

### Community 87 - "Department State"
Cohesion: 0.17
Nodes (13): DepartmentService, useCreateDepartment(), useDeleteDepartment(), useUpdateDepartment(), useGetDepartment(), useListDepartments(), DepartmentCacheContext, departmentRootKey (+5 more)

### Community 88 - "Invitation State"
Cohesion: 0.41
Nodes (9): useAcceptInvitation(), useCreateInvitation(), useDeleteInvitation(), useRejectInvitation(), useListInvitations(), InvitationCacheContext, invitationsRootKey, readInvitationSnapshot() (+1 more)

### Community 90 - "Team State"
Cohesion: 0.21
Nodes (18): CompanyTeamSectionProps, useAddTeamMember(), useCreateTeam(), useDeleteTeam(), useInviteTeamMember(), useRemoveTeamMember(), useUpdateTeam(), useListTeamMembers() (+10 more)

### Community 91 - "Department State"
Cohesion: 0.32
Nodes (9): useCreateDepartment(), useDeleteDepartment(), useUpdateDepartment(), useGetDepartment(), useListDepartments(), useDepartment(), DepartmentCacheContext, departmentRootKey (+1 more)

### Community 92 - "Invitation State"
Cohesion: 0.36
Nodes (9): useAcceptInvitation(), useCreateInvitation(), useDeleteInvitation(), useRejectInvitation(), useListInvitations(), useInvitation(), InvitationCacheContext, invitationsRootKey (+1 more)

### Community 93 - "Task Controller and Types"
Cohesion: 0.36
Nodes (3): mapPlaylist(), mapPlaylistItem(), MusicService

### Community 94 - "Department Service"
Cohesion: 0.39
Nodes (4): DEPARTMENT_ENDPOINTS, DepartmentService, DepartmentQuery, IDepartment

### Community 95 - "Auth Layout and NotFound"
Cohesion: 0.25
Nodes (4): NotFound(), BlankLayout(), Props, blankLayoutClasses

### Community 96 - "Position State"
Cohesion: 0.42
Nodes (8): useCreatePosition(), useDeletePosition(), useUpdatePosition(), useListPositions(), PositionCacheContext, positionsRoot, readPositionSnapshot(), usePosition()

### Community 97 - "Notification State"
Cohesion: 0.15
Nodes (11): composeProviders(), ProviderComponent, ProviderProps, Providers, LenisProvider(), LenisProviderProps, applyThemeVariables(), ThemeContext (+3 more)

### Community 98 - "Position State"
Cohesion: 0.11
Nodes (26): useCreateEvent(), useDeleteEvent(), useUpdateEvent(), useEvents(), useCalender(), AppNameSpaceLike, extractQueryClient(), QueryClientLike (+18 more)

### Community 99 - "Session Management"
Cohesion: 0.23
Nodes (8): useTestingEmail(), useUpdateSettings(), useGetSettings(), SettingsCacheContext, SettingsRoot, useSettings(), TaskCacheContext, AppNameSpace

### Community 100 - "Subscription Flow"
Cohesion: 0.14
Nodes (15): useSendNotification(), useNotificationLogs(), useNotification(), useUpdateSettings(), useGetSettings(), useSettings(), registerForPushNotificationsAsync(), Api (+7 more)

### Community 101 - "Theme CSS Builder"
Cohesion: 0.27
Nodes (10): buildCss(), fs, GLOBAL_CSS_PATH, main(), parseHexToRgb(), parseRgbToRgb(), parseThemeConfig(), path (+2 more)

### Community 102 - "Package Config"
Cohesion: 0.18
Nodes (10): main, name, optional, peerDependenciesMeta, next, server-only, private, optional (+2 more)

### Community 103 - "Dev Dependencies"
Cohesion: 0.18
Nodes (11): devDependencies, server-only, @tanstack/react-query, @types/node, @types/react, @tanstack/react-query, @types/node, @types/react (+3 more)

### Community 104 - "Pomodoro Service"
Cohesion: 0.23
Nodes (9): app, connectWithRetry(), disconnectDatabase(), shutdown(), processNotificationQueue(), startNotificationQueueRunner(), stopNotificationQueueRunner(), swaggerPlugin (+1 more)

### Community 105 - "Session State"
Cohesion: 0.24
Nodes (4): RoleController, verifyToken(), PermissionRouter, RoleRouter

### Community 106 - "Peer Dependencies"
Cohesion: 0.20
Nodes (10): next, react, zod, next, react, zod, peerDependencies, next (+2 more)

### Community 108 - "Observability Stack"
Cohesion: 0.67
Nodes (4): Alloy (OpenTelemetry Collector), Grafana (Observability Dashboard), Loki (Log Aggregation Backend), Tempo (Distributed Tracing Backend)

### Community 110 - "Query Params Desktop"
Cohesion: 0.29
Nodes (5): pageFilterTypeSchema, QueryParams, queryParamsSchema, requiredString, rowsFilterTypeSchema

### Community 111 - "Query Params Mobile"
Cohesion: 0.29
Nodes (5): pageFilterTypeSchema, QueryParams, queryParamsSchema, requiredString, rowsFilterTypeSchema

### Community 112 - "Calendar Events"
Cohesion: 0.18
Nodes (4): BlogsContainer(), PricingContainer(), ARTICLES, BlogSectionProps

### Community 113 - "Department Management"
Cohesion: 0.09
Nodes (12): Progress(), ProgressProps, ActivityLog, activityLogs, departmentData, DepartmentProductivity, GlassCard(), OwnerDashboardSectionProps (+4 more)

### Community 114 - "Note Management"
Cohesion: 0.13
Nodes (13): plugins, CustomDrawerContent(), PrivateLayout(), PrivateProviders(), AppProviders(), RootLayoutContent(), useAppDispatch(), useAppSelector (+5 more)

### Community 115 - "Todo DTOs Routes"
Cohesion: 0.46
Nodes (6): CompanyParamsDto, CompanyQueryDto, CreateAdminDto, RegisterCompanyDto, UpdateCompanyProfileDto, UpdateSubscriptionDto

### Community 116 - "Company Queries"
Cohesion: 0.20
Nodes (11): LoginContainer(), TODO: petakan SafeAuthUser -> userSchema saat kontrak backend stabil., useLogin(), useLogout(), useRegister(), useAuth(), useApi(), useAlert() (+3 more)

### Community 117 - "Mutation Wrapper"
Cohesion: 0.33
Nodes (4): TListResponse, TPagedList, TPagedListResponse, TResponse

### Community 118 - "Session Endpoints"
Cohesion: 0.21
Nodes (7): InternalApiKey(), errorPlugin, metricsPlugin, loggerPlugin, ApiRouter, systemRoutes, logger

### Community 119 - "Home Page UI"
Cohesion: 0.39
Nodes (9): useForgotPassword(), useLogin(), useLogout(), useRegister(), useResetPassword(), useSendMagicLink(), useVerifyMagicLink(), AuthCacheContext (+1 more)

### Community 120 - "Badge Component"
Cohesion: 0.48
Nodes (5): CreateTodoDto, TodoParamsDto, TodoQueryDto, TodoStatusEnum, UpdateTodoDto

### Community 121 - "Auth Hooks"
Cohesion: 0.14
Nodes (19): mapTodo(), TodoService, useCreateTodo(), useDeleteTodo(), useUpdateTodo(), useTodo(), useTodos(), useTodo() (+11 more)

### Community 122 - "Metro Config"
Cohesion: 0.33
Nodes (5): config, { getDefaultConfig }, monorepoRoot, path, { withNativeWind }

### Community 123 - "Music Playlist Service"
Cohesion: 0.50
Nodes (4): COMPANY_ROLE_REGISTRY, CompanyRoleOption, getCompanyRoleBySlug(), MANAGED_COMPANY_ROLES

### Community 124 - "API Error Classes"
Cohesion: 0.42
Nodes (8): useAddPlaylistItem(), useCreatePlaylist(), useDeletePlaylist(), useDeletePlaylistItem(), usePlaylists(), MusicCacheContext, readPlaylistSnapshot(), useMusic()

### Community 126 - "ESLint Config"
Cohesion: 0.40
Nodes (4): compat, __dirname, eslintConfig, __filename

### Community 127 - "Code Scripts"
Cohesion: 0.40
Nodes (5): scripts, format, format:check, lint, lint:fix

### Community 128 - "Backend Elysia"
Cohesion: 0.50
Nodes (4): Backend (Elysia/Bun), elysia, Bun, elysia

### Community 129 - "Frontend Next.js"
Cohesion: 0.50
Nodes (4): Frontend (Next.js), Geist Font, Next.js, Vercel

### Community 130 - "Login UI"
Cohesion: 0.60
Nodes (4): CreateDepartmentDto, DepartmentParamsDto, DepartmentQueryDto, UpdateDepartmentDto

### Community 131 - "ESLint Expo"
Cohesion: 0.50
Nodes (3): { defineConfig }, expoConfig, simpleImportSort

### Community 137 - "Mobile Expo"
Cohesion: 0.67
Nodes (3): Mobile (Expo), expo, expo

### Community 138 - "Axios"
Cohesion: 0.29
Nodes (6): mapSettings(), SettingsService, ISettings, PickUpdateSettings, TestEmail, ThemePreference

### Community 139 - "Settings and Select UI"
Cohesion: 0.07
Nodes (31): CompanyContainer(), formatDate(), TIER_STYLES, Command(), CommandEmpty(), CommandGroup(), CommandInput(), CommandItem() (+23 more)

### Community 140 - "Cloudinary"
Cohesion: 0.36
Nodes (7): useDeleteSessionAll(), useDeleteSessionById(), useGetSession(), useListSessions(), useSession(), readSessionSnapshot(), SessionCacheContext

### Community 141 - "Elysia Helmet"
Cohesion: 0.17
Nodes (10): ColorConfig, ThemeConfig, useDeleteSessionAll(), useDeleteSessionById(), useGetSession(), useListSessions(), readSessionSnapshot(), SessionCacheContext (+2 more)

### Community 143 - "Google Auth"
Cohesion: 0.15
Nodes (16): DateRangeDto, FilterQueryDto, PaginationDto, SearchDto, SortDto, PomodoroQueryDto, StartPomodoroDto, StopPomodoroDto (+8 more)

### Community 146 - "Prisma"
Cohesion: 0.20
Nodes (9): FE — hide > build, Kontrak BE (baru), Kontrak BE (guard + 1 endpoint baru), Layer 1: Platform Role — Super Admin only, Layer 2: Company Role — Owner & Member only, Prinsip Dasar, Spaces v0.0.1 — Role & Scope Lock, Verifikasi (+1 more)

### Community 147 - "Repo Package"
Cohesion: 0.60
Nodes (4): AddItemToPlaylistDto, CreatePlaylistDto, MusicQueryDto, PlaylistParamsDto

### Community 148 - "Sharp"
Cohesion: 0.60
Nodes (4): CreateNoteDto, NoteParamsDto, NoteQueryDto, UpdateNoteDto

### Community 153 - "UUID"
Cohesion: 0.32
Nodes (5): nunito, playfair, metadata, siteConfig, AppProviders()

### Community 157 - "Classnames"
Cohesion: 0.38
Nodes (8): checkRoleAccess(), PrivateProviders(), restoreAuthSession(), AuthSession, clearAuthSession(), persistAuthSession(), persistAuthSessionFromResponse(), syncAuthFromRefreshResponse()

### Community 159 - "CMDK"
Cohesion: 0.32
Nodes (4): ResourceContainer(), CATEGORIES, ResourceHeroSection(), ResourceHeroSectionProps

### Community 160 - "Cookies Next"
Cohesion: 0.39
Nodes (7): DelResponse(), GetResponse(), PatchResponse(), PostResponse(), PublicPostResponse(), PutResponse(), RequestResponse()

### Community 161 - "Date Fns"
Cohesion: 0.32
Nodes (3): MUSIC_ENDPOINTS, MusicService, MusicQuery

### Community 162 - "Embla Carousel"
Cohesion: 0.60
Nodes (4): ReviewTrackDto, SubmitTrackDto, TrackCatalogParamsDto, TrackCatalogQueryDto

### Community 165 - "GSAP"
Cohesion: 0.29
Nodes (6): 1. Project Overview & Architecture, 2. Skills Required for Development, 3. Non-Negotiable Core Rules, 4. Knowledge Graph (Graphify) Auto-Update Rule, Knowledge Graph Maintenance Protocol:, SPACES AGENT CONFIGURATION & PLAYBOOK

### Community 174 - "Next Toploader"
Cohesion: 0.17
Nodes (11): name, private, scripts, build, dev, format, format:check, lint (+3 more)

### Community 179 - "Radix Dropdown"
Cohesion: 0.13
Nodes (8): error(), CompanyController, NotificationController, SubscriptionController, CompanyRouter, NotificationRouter, SubscriptionRouter, unauthorizedValidate()

### Community 180 - "Radix Popover"
Cohesion: 0.50
Nodes (3): IntrinsicElements, JSX, react/jsx-runtime

### Community 184 - "React"
Cohesion: 0.35
Nodes (9): AddTaskAttachmentDto, AddTaskCommentDto, AssignTaskDto, CreateTaskChecklistDto, CreateTaskDto, TaskParamsDto, TaskQueryDto, UpdateTaskDto (+1 more)

### Community 185 - "React DOM"
Cohesion: 0.29
Nodes (3): db, sessions, user

### Community 200 - "Toast Notifications"
Cohesion: 0.36
Nodes (7): CompanyMemberStatusEnum, MemberContactItemDto, MemberParamsDto, MemberQueryDto, UpdateMemberContactsDto, UpdateMemberDto, UpdateMemberProfileDto

### Community 205 - "Burnt Toast Library"
Cohesion: 0.42
Nodes (7): AddTeamMemberDto, CreateTeamDto, InviteMemberDto, TeamMemberParamsDto, TeamParamsDto, TeamQueryDto, UpdateTeamDto

### Community 212 - "authSlice.ts"
Cohesion: 0.38
Nodes (5): authSlice, AuthState, initialState, userSchema, userType

### Community 222 - "Lucide Icons"
Cohesion: 0.60
Nodes (4): CreateEventDto, EventParamsDto, EventQueryDto, UpdateEventDto

### Community 237 - "Bottom Tab Navigation"
Cohesion: 0.52
Nodes (5): NotificationInAppQueryDto, NotificationLogQueryDto, NotificationParamsDto, NotificationQueueQueryDto, SendNotificationDto

### Community 250 - "InvitationService"
Cohesion: 0.29
Nodes (7): AgendaTimelineItemProps, EventDetailSectionProps, EventListSectionProps, CALENDAR_ENDPOINTS, CalendarService, PickApiID, CalendarEvent

### Community 261 - "auth.provider.tsx"
Cohesion: 0.67
Nodes (4): AUTH_ROUTES, isAuthRoute(), isPublicRoute(), AuthProvider()

### Community 271 - "Notification/state/mutate.ts"
Cohesion: 0.50
Nodes (3): API contract alignment, Migrasi, Perilaku yang diselaraskan

### Community 313 - "SessionService"
Cohesion: 0.10
Nodes (26): AppContext, ElysiaHandler, ElysiaMiddleware, AddItemBody, SystemController, ReviewBody, buildGetResponseMeta(), formatProcessTime() (+18 more)

## Knowledge Gaps
- **728 isolated node(s):** `name`, `version`, `type`, `prisma:generate`, `dev` (+723 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **137 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AppContext` connect `SessionService` to `Login UI`, `Department and Member`, `Controllers Mix`, `Google Auth`, `Repo Package`, `Sharp`, `Types JWT`, `Auth Service`, `Types Web Push`, `Embla Carousel`, `Calendar, Note, Todo Controllers`, `App Layout and Providers`, `Music and Settings State`, `Radix Dropdown`, `.deleteSessionById`, `React`, `Task State Management`, `Auth Controller Routes`, `Invitation Controller`, `Position Controller`, `Toast Notifications`, `Burnt Toast Library`, `Note State`, `Lucide Icons`, `Session State`, `Bottom Tab Navigation`, `Todo DTOs Routes`, `Badge Component`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **Why does `cn()` connect `UI Components` to `Session Management`, `Config and Calendar DTOs`, `Carousel UI`, `Settings and Select UI`, `Alert Dialog Atoms`, `Settings and Dropdown UI`, `Notes UI`, `Department Management`, `Calendar UI`, `UI Toast and Alert`, `Command and Dialog UI`, `Public Pages`, `Music and Home`, `Auth Forms`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **Why does `JwtPayload` connect `SessionService` to `Music and Settings State`, `Task Service`, `SessionService`, `Auth Service`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **What connects `name`, `version`, `type` to the rest of the system?**
  _728 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Auth and Endpoints` be split into smaller, more focused modules?**
  _Cohesion score 0.058699101004759384 - nodes in this community are weakly interconnected._
- **Should `Department and Member` be split into smaller, more focused modules?**
  _Cohesion score 0.09984639016897082 - nodes in this community are weakly interconnected._
- **Should `UI Components` be split into smaller, more focused modules?**
  _Cohesion score 0.04308390022675737 - nodes in this community are weakly interconnected._