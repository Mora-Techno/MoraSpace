# Graph Report - Space  (2026-09-26)

## Corpus Check
- 785 files · ~134,680 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 3714 nodes · 10012 edges · 299 communities (167 shown, 132 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 210 edges (avg confidence: 0.78)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d7d54706`
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
- Expo Image
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
- Zod Validation
- Form Login Types
- Grafana Volume
- Loki Volume
- Observability Network
- Tempo Volume
- Delete Response Type
- plan2.md
- PageSkeleton.tsx
- owner/todos/_containers/todos.tsx
- shared/utils/log.ts
- @gsap/react
- @radix-ui/react-navigation-menu
- tailwind-merge
- zod
- expo-linking
- install
- @react-navigation/elements
- @react-navigation/native
- @reduxjs/toolkit
- react-hot-toast
- recharts
- sonner
- @babel/runtime
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

## God Nodes (most connected - your core abstractions)
1. `cn()` - 182 edges
2. `AppContext` - 180 edges
3. `HttpResponse()` - 167 edges
4. `TResponse` - 147 edges
5. `toServiceResponse()` - 143 edges
6. `getUser()` - 126 edges
7. `useAppMutation` - 94 edges
8. `useAppMutation` - 79 edges
9. `useApi()` - 74 edges
10. `paramsValidate()` - 69 edges

## Surprising Connections (you probably didn't know these)
- `SubscriptionPlan` --references--> `SubscriptionTier`  [EXTRACTED]
  apps/be/src/config/subscriptionPlans.ts → packages/shared/types/company.types.ts
- `AppContext` --references--> `JwtPayload`  [EXTRACTED]
  apps/be/src/contex/index.ts → packages/shared/types/auth.types.ts
- `roleType` --references--> `CompanyRole`  [EXTRACTED]
  apps/be/src/utils/roleHelper.ts → packages/shared/types/company.types.ts
- `AgendaTimelineItemProps` --references--> `CalendarEvent`  [EXTRACTED]
  apps/fe/src/components/molecules/AgendaTimelineItem.tsx → packages/shared/types/calendar.types.ts
- `PlaylistItemCardProps` --references--> `MusicPlaylist`  [EXTRACTED]
  apps/fe/src/components/molecules/PlaylistItemCard.tsx → packages/shared/types/music.types.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Observability Stack** — docker_compose_alloy, docker_compose_tempo, docker_compose_loki, docker_compose_grafana [EXTRACTED 1.00]
- **Application Stack** — apps_be, apps_fe, apps_mobile [INFERRED 0.80]

## Communities (299 total, 132 thin omitted)

### Community 0 - "Calendar and Notes"
Cohesion: 0.20
Nodes (16): TasksContainer(), TaskSection(), useAddTaskAttachment(), useAddTaskComment(), useAssignTask(), useCreateTask(), useCreateTaskChecklist(), useDeleteTask() (+8 more)

### Community 1 - "Auth and Endpoints"
Cohesion: 0.06
Nodes (27): TaskSectionProps, MUSIC_ENDPOINTS, SESSION_ENDPOINT, TASK_ENDPOINTS, TEAM_ENDPOINTS, TODO_ENDPOINTS, AppMutationConfig, BaseAppNameSpace (+19 more)

### Community 2 - "App and Auth DTOs"
Cohesion: 0.10
Nodes (22): app, connectWithRetry(), disconnectDatabase(), shutdown(), processNotificationQueue(), startNotificationQueueRunner(), stopNotificationQueueRunner(), mapTrack() (+14 more)

### Community 3 - "Department and Member"
Cohesion: 0.10
Nodes (13): DepartmentController, MemberController, PositionController, TaskController, TeamController, DepartmentRouter, MemberRouter, PositionRouter (+5 more)

### Community 4 - "UI Components"
Cohesion: 0.05
Nodes (68): CalendarContainer(), AccordionContent(), AccordionItem(), AccordionTrigger(), CardFooter(), NavigationMenu(), NavigationMenuContent(), NavigationMenuIndicator() (+60 more)

### Community 5 - "Config and Calendar DTOs"
Cohesion: 0.15
Nodes (11): composeProviders(), ProviderComponent, ProviderProps, Providers, LenisProvider(), LenisProviderProps, applyThemeVariables(), ThemeContext (+3 more)

### Community 6 - "Controllers Mix"
Cohesion: 0.09
Nodes (24): ElysiaHandler, ElysiaMiddleware, AddItemBody, ReviewBody, buildGetResponseMeta(), formatProcessTime(), isGetRequest(), RequestTimingStore (+16 more)

### Community 7 - "Auth Pages and Dashboard"
Cohesion: 0.39
Nodes (3): mapTodo(), TodoService, TodoQuery

### Community 8 - "Mobile Dev Dependencies"
Cohesion: 0.04
Nodes (48): devDependencies, autoprefixer, babel-plugin-module-resolver, @babel/plugin-transform-react-jsx, babel-preset-expo, eslint, eslint-config-expo, eslint-plugin-simple-import-sort (+40 more)

### Community 9 - "API Endpoints Config"
Cohesion: 0.09
Nodes (32): buildEndpoint(), listEndpoints(), AUTH_ENDPOINTS, listAuthEndpoints(), listCalendarEndpoints(), COMPANY_ENDPOINTS, listCompanyEndpoints(), listDepartmentEndpoints() (+24 more)

### Community 10 - "Frontend Dev Dependencies"
Cohesion: 0.06
Nodes (35): devDependencies, bun-types, eslint, eslint-config-next, eslint-config-prettier, @eslint/eslintrc, eslint-import-resolver-typescript, eslint-plugin-import (+27 more)

### Community 11 - "Role and Company State"
Cohesion: 0.16
Nodes (14): roleType, COMPANY_ROLE_REGISTRY, CompanyRoleOption, getCompanyRoleBySlug(), MANAGED_COMPANY_ROLES, IAuth, CompanyRole, IWorkstation (+6 more)

### Community 12 - "Biome Config"
Cohesion: 0.05
Nodes (43): noUnusedVariables, files, ignore, formatter, enabled, indentStyle, indentWidth, lineWidth (+35 more)

### Community 13 - "Settings and Dropdown UI"
Cohesion: 0.11
Nodes (21): DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator(), DropdownMenuShortcut() (+13 more)

### Community 14 - "API Response Types"
Cohesion: 0.17
Nodes (21): DelResponse, GetResponse, PatchResponse, PostResponse, PublicGetResponse, PublicPostResponse, PutResponse, useMutationWrapper() (+13 more)

### Community 15 - "Notes UI"
Cohesion: 0.06
Nodes (31): FocusToggle(), FocusToggleProps, Progress(), ProgressProps, Skeleton(), StatusCheckbox(), StatusCheckboxProps, TimerDisplay() (+23 more)

### Community 16 - "Alert and Button UI"
Cohesion: 0.09
Nodes (34): AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription(), AlertDialogFooter(), AlertDialogHeader(), AlertDialogOverlay(), AlertDialogTitle() (+26 more)

### Community 17 - "Subscription and Stripe"
Cohesion: 0.10
Nodes (26): getPeriodEnd(), getPlan(), getPlanPrice(), PaymentProvider, PlanPrice, SUBSCRIPTION_PLANS, SubscriptionPlan, StripeService (+18 more)

### Community 18 - "Calendar UI"
Cohesion: 0.31
Nodes (6): NoteEditorSectionProps, NoteListSectionProps, NOTE_ENDPOINTS, NoteService, Note, NoteQuery

### Community 19 - "Company and Team Services"
Cohesion: 0.09
Nodes (22): CompanyService, TeamService, sanitizeUser(), resolveCompanyRole(), slugify(), toSafeAuthUser(), uniqueCompanySlug(), getCompanyTier() (+14 more)

### Community 20 - "Command and Dialog UI"
Cohesion: 0.11
Nodes (21): buttonVariants, Calendar(), Dialog(), DialogContent(), DialogHeader(), DialogOverlay(), DialogTitle(), Input() (+13 more)

### Community 21 - "Frontend TypeScript Config"
Cohesion: 0.06
Nodes (33): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+25 more)

### Community 22 - "Project Dependencies"
Cohesion: 0.06
Nodes (34): @biomejs/biome, dependencies, axios, @sinclair/typebox, @tanstack/react-query, @tanstack/react-query-devtools, devDependencies, @biomejs/biome (+26 more)

### Community 23 - "Auth Service"
Cohesion: 0.13
Nodes (25): AuthService, AUTH_EXPIRY, generateOtp(), generateSecureToken(), getMagicLinkExpiry(), getOtpExpiry(), resolveAuthUser(), ForgotPasswordSectionProps (+17 more)

### Community 24 - "Todo State Management"
Cohesion: 0.19
Nodes (14): TListResponse, TPagedList, TPagedListResponse, apiDelete(), apiGet(), apiPatch(), apiPost(), apiPut() (+6 more)

### Community 25 - "Server Fetch and Auth"
Cohesion: 0.28
Nodes (9): CatalogReviewContainer(), CatalogReviewSection(), useApproveTrack(), useDeleteTrack(), useRejectTrack(), useSubmitTrack(), usePendingTracks(), useTrackCatalogList() (+1 more)

### Community 26 - "Music and Home"
Cohesion: 0.05
Nodes (21): NotesContainer(), BlogsContainer(), ContainerHome(), PricingContainer(), ResourceContainer(), ARTICLES, BlogSectionProps, CtaSection() (+13 more)

### Community 27 - "Expo App Config"
Cohesion: 0.07
Nodes (28): backgroundColor, backgroundImage, foregroundImage, monochromeImage, adaptiveIcon, edgeToEdgeEnabled, predictiveBackGestureEnabled, usesCleartextTraffic (+20 more)

### Community 28 - "App Layout and Theme"
Cohesion: 0.10
Nodes (18): CustomDrawerContent(), PrivateLayout(), MobileCalendarContainer(), TabsLayout(), MobileNotesContainer(), LoginPage(), ThemeToggle(), ColorConfig (+10 more)

### Community 29 - "Auth Forms"
Cohesion: 0.04
Nodes (46): TodoDetailContainer(), toLocalInput(), ButtonProps, GhibliCard(), GhibliCardProps, GhibliTab, GhibliTabs(), GhibliTabsProps (+38 more)

### Community 30 - "Backend TypeScript Config"
Cohesion: 0.07
Nodes (28): compilerOptions, allowSyntheticDefaultImports, baseUrl, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, lib, module (+20 more)

### Community 31 - "Backend Dependencies"
Cohesion: 0.07
Nodes (27): dependencies, axios, bcryptjs, elysia-helmet, @elysiajs/cors, form-data, google-auth-library, pino-pretty (+19 more)

### Community 32 - "Backend Dev Dependencies"
Cohesion: 0.07
Nodes (27): devDependencies, bun-types, eslint, eslint-config-prettier, eslint-plugin-prettier, prettier, ts-node, @types/bcryptjs (+19 more)

### Community 33 - "Session Management"
Cohesion: 0.18
Nodes (12): CreateEventDto, EventParamsDto, EventQueryDto, UpdateEventDto, DateRangeDto, FilterQueryDto, SearchDto, SortDto (+4 more)

### Community 34 - "Auth Containers"
Cohesion: 0.17
Nodes (25): useForgotPassword(), useLogin(), useLogout(), useRegister(), useResetPassword(), useSendMagicLink(), useVerifyMagicLink(), AuthCacheContext (+17 more)

### Community 35 - "Auth Token and Session"
Cohesion: 0.06
Nodes (63): buildShuffledQueue(), fisherYatesShuffle(), initialState, MusicPlayerContext, MusicPlayerContextValue, MusicPlayerProvider(), MusicPlayerState, checkRoleAccess() (+55 more)

### Community 37 - "Query Keys and Configs"
Cohesion: 0.14
Nodes (20): QuickNotesSectionProps, ColorConfig, ThemeConfig, useCreateNote(), useDeleteNote(), useUpdateNote(), useNote(), useNotes() (+12 more)

### Community 38 - "App Layout and Providers"
Cohesion: 0.15
Nodes (7): NotificationController, SubscriptionController, HttpResponse(), NotificationRouter, SubscriptionRouter, SendNotifValidation(), CreateWorkStationValidate()

### Community 39 - "Alert and Notification State"
Cohesion: 0.28
Nodes (15): useMarkAllRead(), useMarkRead(), useSendNotification(), useNotification(), useNotificationLogs(), useNotifications(), NotificationCacheContext, notificationDetailKey() (+7 more)

### Community 40 - "Mobile Pages"
Cohesion: 0.14
Nodes (15): HomeContainer(), SectionHomePage(), Card(), CardContent(), CardDescription(), CardFooter(), CardHeader(), CardTitle() (+7 more)

### Community 41 - "API Client Setup"
Cohesion: 0.09
Nodes (24): BASE_URL, AuthErrorHandler, BaseURLProvider, buildApiUrl(), buildBaseHeaders(), clientCoreFetch(), clientCoreFetchResponse(), ClientDel() (+16 more)

### Community 42 - "Role Service"
Cohesion: 0.15
Nodes (10): RoleService, ROLE_ENDPOINTS, RoleService, IPermission, IRole, PermissionQuery, PickCreateRole, PickUpdateRole (+2 more)

### Community 43 - "Sitemap and App Config"
Cohesion: 0.14
Nodes (14): generateSitemap(), GET(), AppConfig, AUTH_ROUTES, NavigationMenuConfig, PropsParams, PUBLIC_ROUTES, RegisterConfigRoutes (+6 more)

### Community 44 - "Alert Dialog Atoms"
Cohesion: 0.16
Nodes (18): AlertDialog(), AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription(), AlertDialogFooter(), AlertDialogHeader(), AlertDialogMedia() (+10 more)

### Community 45 - "Shared TypeScript Config"
Cohesion: 0.08
Nodes (23): compilerOptions, esModuleInterop, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+15 more)

### Community 46 - "Music Controller"
Cohesion: 0.10
Nodes (9): CalendarController, PomodoroController, SessionController, TodoController, CalendarRouter, PomodoroRouter, SessionRouter, TodoRouter (+1 more)

### Community 47 - "Invitation Service"
Cohesion: 0.18
Nodes (8): InvitationService, INVITATION_ENDPOINTS, InvitationService, IInvitation, InvitationQuery, PickAcceptInvitation, PickCreateInvitation, PickRejectInvitation

### Community 48 - "UI Input and Navigation"
Cohesion: 0.22
Nodes (20): useCreateAdmin(), useDeleteAdmin(), useRegisterCompany(), useUpdateCompanyProfile(), useUpdateCompanySubscription(), useAddTaskAttachment(), useAddTaskComment(), useAssignTask() (+12 more)

### Community 49 - "Subscription State"
Cohesion: 0.12
Nodes (15): BillingContainer(), BillingSection(), BillingSectionProps, BillingCycle, CheckoutData, CreateCheckoutInput, PaymentInfo, PaymentProvider (+7 more)

### Community 50 - "Music and Settings State"
Cohesion: 0.25
Nodes (8): _env, envSchema, CreateRoleDto, PermissionQueryDto, RoleParamsDto, RoleQueryDto, UpdateRoleDto, UpdateRolePermissionsDto

### Community 51 - "Turbo Tasks"
Cohesion: 0.10
Nodes (19): ^lint, !.next/cache/**, dependsOn, outputs, cache, persistent, cache, ^build (+11 more)

### Community 52 - "UI Toast and Alert"
Cohesion: 0.08
Nodes (35): CompanyContainer(), formatDate(), TIER_STYLES, Button(), Card(), CardAction(), CardContent(), CardDescription() (+27 more)

### Community 53 - "Mobile UI Components"
Cohesion: 0.10
Nodes (22): LoginPageProps, AlertModal(), AlertModalInternalProps, iconMap, styles, { width }, PopUp(), styles (+14 more)

### Community 54 - "Redux Auth Store"
Cohesion: 0.25
Nodes (6): CatalogReviewSectionProps, TrackCatalogService, PickReviewTrack, PickSubmitTrack, TrackCatalog, TrackCatalogQuery

### Community 55 - "Frontend Components Config"
Cohesion: 0.11
Nodes (17): aliases, components, hooks, lib, ui, utils, iconLibrary, rsc (+9 more)

### Community 56 - "Public Pages"
Cohesion: 0.20
Nodes (14): ALL_NAV_ITEMS, getMobileNavGroups(), getMobileNavItems(), isMobileNavItem(), MEMBER_WORKSPACE_ITEMS, MOBILE_NAV_ITEMS, MobileNavItem, NavItem (+6 more)

### Community 57 - "Task State Management"
Cohesion: 0.21
Nodes (8): TaskService, PickAddTaskAttachment, PickAddTaskComment, PickAssignTask, PickCreateTask, PickCreateTaskChecklist, PickUpdateTask, PickUpdateTaskStatus

### Community 58 - "Task State Management"
Cohesion: 0.32
Nodes (10): ForgotPasswordDto, LoginDto, RefreshTokenDto, RegisterDto, ResetPasswordDto, SendMagicLinkDto, SendOtpDto, UserQueryDto (+2 more)

### Community 59 - "Member Service"
Cohesion: 0.15
Nodes (8): MemberService, MEMBER_ENDPOINTS, MemberService, ICompanyMember, MemberQuery, PickUpdateCompanyMember, PickUpdateMemberContacts, PickUpdateMemberProfile

### Community 60 - "Position Service"
Cohesion: 0.20
Nodes (7): PositionService, POSITION_ENDPOINTS, PositionService, IPosition, PickCreatePosition, PickUpdatePosition, PositionQuery

### Community 61 - "App Layout and Providers"
Cohesion: 0.10
Nodes (19): composeProviders(), ProviderComponent, ProviderProps, Providers, ThemeProvider(), ReactQueryClientProvider(), authSlice, AuthState (+11 more)

### Community 62 - "Mobile Components Config"
Cohesion: 0.12
Nodes (15): aliases, components, hooks, lib, ui, utils, rsc, $schema (+7 more)

### Community 63 - "Pomodoro Controller"
Cohesion: 0.24
Nodes (4): RoleController, verifyToken(), PermissionRouter, RoleRouter

### Community 64 - "Role State"
Cohesion: 0.33
Nodes (11): useCreateRole(), useDeleteRole(), useUpdateRole(), useUpdateRolePermissions(), useGetRolePermissions(), useListMasterPermissions(), useListRoles(), readRoleSnapshot() (+3 more)

### Community 65 - "Member State"
Cohesion: 0.29
Nodes (12): useDeleteMember(), useUpdateContacts(), useUpdateMember(), useUpdateProfile(), useGetContacts(), useGetMember(), useGetProfile(), useListMembers() (+4 more)

### Community 66 - "Team State"
Cohesion: 0.40
Nodes (9): useAddTeamMember(), useCreateTeam(), useDeleteTeam(), useRemoveTeamMember(), useUpdateTeam(), useListTeamMembers(), useListTeams(), useTeam() (+1 more)

### Community 67 - "Mobile TypeScript Config"
Cohesion: 0.13
Nodes (14): compilerOptions, paths, strict, extends, include, ../../packages/shared/*, ../../packages/shared/index.ts, **/*.ts (+6 more)

### Community 68 - "Shared Package Exports"
Cohesion: 0.13
Nodes (15): exports, ./api/client, ./api/server, ./config/api, ./endpoints, ./react-query/mutation-wrapper, ./react-query/mutation-wrapper.type, ./react-query/query-client (+7 more)

### Community 69 - "Backend Package Scripts"
Cohesion: 0.14
Nodes (13): name, scripts, build, dev, format, format:check, lint, lint:fix (+5 more)

### Community 70 - "Auth Controller Routes"
Cohesion: 0.13
Nodes (8): AppContext, AuthController, SystemController, TrackCatalogController, PlatformRole, requirePlatformRole(), AuthRouter, TrackCatalogRouter

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
Cohesion: 0.38
Nodes (9): useCreateRole(), useDeleteRole(), useUpdateRole(), useUpdateRolePermissions(), useGetRolePermissions(), useListMasterPermissions(), useListRoles(), useRole() (+1 more)

### Community 76 - "Mobile Dependencies"
Cohesion: 0.12
Nodes (17): dependencies, burnt, expo-font, expo-system-ui, @expo/vector-icons, react-native-keyboard-aware-scroll-view, react-native-reanimated, react-native-worklets (+9 more)

### Community 77 - "Shared React Query"
Cohesion: 0.33
Nodes (8): useCreatePosition(), useDeletePosition(), useUpdatePosition(), useListPositions(), usePosition(), PositionCacheContext, positionsRoot, readPositionSnapshot()

### Community 78 - "UI Dependencies"
Cohesion: 0.06
Nodes (33): @aejkatappaja/phantom-ui, dependencies, @aejkatappaja/phantom-ui, classnames, date-fns, embla-carousel-react, lenis, next-themes (+25 more)

### Community 79 - "Private Layout and Auth"
Cohesion: 0.36
Nodes (7): useDeleteSessionAll(), useDeleteSessionById(), useGetSession(), useListSessions(), useSession(), readSessionSnapshot(), SessionCacheContext

### Community 80 - "Member State"
Cohesion: 0.30
Nodes (12): useDeleteMember(), useUpdateContacts(), useUpdateMember(), useUpdateProfile(), useGetContacts(), useGetMember(), useGetProfile(), useListMembers() (+4 more)

### Community 81 - "Pomodoro State"
Cohesion: 0.20
Nodes (12): PomodoroContainer(), PomodoroSection(), usePausePomodoroSession(), useResumePomodoroSession(), useStartPomodoroSession(), useStopPomodoroSession(), useGetPomodoroStatistics(), useGetTodayFocus() (+4 more)

### Community 82 - "Note State"
Cohesion: 0.33
Nodes (9): useCreateNote(), useDeleteNote(), useUpdateNote(), useNote(), useNotes(), useNotess(), NoteCacheContext, readNoteDetailSnapshot() (+1 more)

### Community 83 - "Pomodoro State"
Cohesion: 0.32
Nodes (10): usePausePomodoroSession(), useResumePomodoroSession(), useStartPomodoroSession(), useStopPomodoroSession(), useGetPomodoroStatistics(), useGetTodayFocus(), usePomodoro(), podomoroRoot (+2 more)

### Community 84 - "Task Service"
Cohesion: 0.07
Nodes (46): CalendarService, mapEvent(), CatalogModalProps, PlayListModalProps, PlaylistItemCard(), PlaylistItemCardProps, MusicSectionProps, NotificationListSectionProps (+38 more)

### Community 85 - "Auth State"
Cohesion: 0.04
Nodes (33): ForgotPasswordContainer(), LoginContainer(), MagicLinkContainer(), RegisterCompanyContainer(), RegisterEmployContainer(), ResetPasswordContainer(), AddDocContainer(), DashboardContainer() (+25 more)

### Community 86 - "Calendar State"
Cohesion: 0.32
Nodes (10): useCreateEvent(), useDeleteEvent(), useUpdateEvent(), useEvent(), useEvents(), CalendarCacheContext, calenderRootKey, eventsListKey() (+2 more)

### Community 87 - "Department State"
Cohesion: 0.36
Nodes (9): useCreateDepartment(), useDeleteDepartment(), useUpdateDepartment(), useGetDepartment(), useListDepartments(), DepartmentCacheContext, departmentRootKey, readDepartmentSnapshot() (+1 more)

### Community 88 - "Invitation State"
Cohesion: 0.37
Nodes (9): useAcceptInvitation(), useCreateInvitation(), useDeleteInvitation(), useRejectInvitation(), useListInvitations(), InvitationCacheContext, invitationsRootKey, readInvitationSnapshot() (+1 more)

### Community 90 - "Team State"
Cohesion: 0.33
Nodes (12): useAddTeamMember(), useCreateTeam(), useDeleteTeam(), useInviteTeamMember(), useRemoveTeamMember(), useUpdateTeam(), useListTeamMembers(), useListTeams() (+4 more)

### Community 91 - "Department State"
Cohesion: 0.32
Nodes (9): useCreateDepartment(), useDeleteDepartment(), useUpdateDepartment(), useGetDepartment(), useListDepartments(), useDepartment(), DepartmentCacheContext, departmentRootKey (+1 more)

### Community 92 - "Invitation State"
Cohesion: 0.33
Nodes (9): useAcceptInvitation(), useCreateInvitation(), useDeleteInvitation(), useRejectInvitation(), useListInvitations(), useInvitation(), InvitationCacheContext, invitationsRootKey (+1 more)

### Community 93 - "Task Controller and Types"
Cohesion: 0.36
Nodes (3): mapPlaylist(), mapPlaylistItem(), MusicService

### Community 94 - "Department Service"
Cohesion: 0.17
Nodes (8): DepartmentService, DEPARTMENT_ENDPOINTS, DepartmentService, DepartmentQuery, DepartmentRespone, IDepartment, PickCreateDepartment, PickUpdateDepartment

### Community 95 - "Auth Layout and NotFound"
Cohesion: 0.25
Nodes (4): NotFound(), BlankLayout(), Props, blankLayoutClasses

### Community 96 - "Position State"
Cohesion: 0.38
Nodes (8): useCreatePosition(), useDeletePosition(), useUpdatePosition(), useListPositions(), PositionCacheContext, positionsRoot, readPositionSnapshot(), usePosition()

### Community 97 - "Notification State"
Cohesion: 0.17
Nodes (13): GooeyToaster(), RegisterCard(), AlertModal(), AlertModalInternalProps, showAlertToast(), AlertContex, AlertProvinder(), IconPropsType (+5 more)

### Community 98 - "Position State"
Cohesion: 0.08
Nodes (31): useSendNotification(), useNotificationLogs(), useNotification(), useUpdateSettings(), AppNameSpaceLike, extractQueryClient(), QueryClientLike, AuthCacheContext (+23 more)

### Community 99 - "Session Management"
Cohesion: 0.32
Nodes (5): nunito, playfair, metadata, siteConfig, AppProviders()

### Community 100 - "Subscription Flow"
Cohesion: 0.18
Nodes (13): useCreatePlaylist(), useDeletePlaylist(), usePlaylists(), useMusic(), useCancelSubscription(), useCreateCheckout(), useSubscription(), useSubscriptionPlans() (+5 more)

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
Cohesion: 0.27
Nodes (5): PomodoroService, IPomodoroSession, PickStartPomodoro, PickStopPomodoro, PomodoroQuery

### Community 105 - "Session State"
Cohesion: 0.25
Nodes (3): NoteService, EditNoteDialogProps, PickUpdateNote

### Community 106 - "Peer Dependencies"
Cohesion: 0.20
Nodes (10): next, react, zod, next, react, zod, peerDependencies, next (+2 more)

### Community 107 - "Music Playlist"
Cohesion: 0.31
Nodes (9): useAddPlaylistItem(), useCreatePlaylist(), useDeletePlaylist(), useDeletePlaylistItem(), usePlaylists(), MusicCacheContext, readPlaylistSnapshot(), useMusic() (+1 more)

### Community 108 - "Observability Stack"
Cohesion: 0.33
Nodes (9): Alloy (OpenTelemetry Collector), Grafana (Observability Dashboard), Loki (Log Aggregation Backend), Tempo (Distributed Tracing Backend), Grafana Loki Datasource, Grafana Tempo Datasource, Grafana Datasource Provisioning (datasources.yaml), Loki Configuration (config.yaml) (+1 more)

### Community 110 - "Query Params Desktop"
Cohesion: 0.29
Nodes (5): pageFilterTypeSchema, QueryParams, queryParamsSchema, requiredString, rowsFilterTypeSchema

### Community 111 - "Query Params Mobile"
Cohesion: 0.29
Nodes (5): pageFilterTypeSchema, QueryParams, queryParamsSchema, requiredString, rowsFilterTypeSchema

### Community 112 - "Calendar Events"
Cohesion: 0.29
Nodes (7): AgendaTimelineItemProps, EventDetailSectionProps, EventListSectionProps, CALENDAR_ENDPOINTS, CalendarService, PickApiID, CalendarEvent

### Community 113 - "Department Management"
Cohesion: 0.04
Nodes (34): Avatar(), AvatarFallback(), AvatarImage(), Badge(), badgeVariants, AiInsightsBanner(), ActivityFeedWidget(), ActivityLog (+26 more)

### Community 114 - "Note Management"
Cohesion: 0.28
Nodes (5): plugins, AppProviders(), RootLayoutContent(), expo-asset, expo-font

### Community 115 - "Todo DTOs Routes"
Cohesion: 0.46
Nodes (6): CompanyParamsDto, CompanyQueryDto, CreateAdminDto, RegisterCompanyDto, UpdateCompanyProfileDto, UpdateSubscriptionDto

### Community 116 - "Company Queries"
Cohesion: 0.16
Nodes (14): LoginContainer(), useLogin(), useLogout(), useRegister(), useAuth(), useGetMyCompany(), useListAdmins(), useCompany() (+6 more)

### Community 117 - "Mutation Wrapper"
Cohesion: 0.33
Nodes (4): TListResponse, TPagedList, TPagedListResponse, TResponse

### Community 118 - "Session Endpoints"
Cohesion: 0.21
Nodes (7): InternalApiKey(), errorPlugin, metricsPlugin, loggerPlugin, ApiRouter, systemRoutes, logger

### Community 120 - "Badge Component"
Cohesion: 0.48
Nodes (5): CreateTodoDto, TodoParamsDto, TodoQueryDto, TodoStatusEnum, UpdateTodoDto

### Community 121 - "Auth Hooks"
Cohesion: 0.20
Nodes (16): useCreateTodo(), useDeleteTodo(), useUpdateTodo(), useTodo(), useTodos(), useTodo(), MobileTodoContainer(), useCreateTodo() (+8 more)

### Community 122 - "Metro Config"
Cohesion: 0.33
Nodes (5): config, { getDefaultConfig }, monorepoRoot, path, { withNativeWind }

### Community 123 - "Music Playlist Service"
Cohesion: 0.33
Nodes (3): EventDetailContainer(), toLocalInput(), EventDetailSection()

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
Cohesion: 0.24
Nodes (6): mapSettings(), SettingsService, SettingsService, PickUpdateSettings, Settings, TestEmail

### Community 139 - "Settings and Select UI"
Cohesion: 0.08
Nodes (28): Command(), CommandEmpty(), CommandGroup(), CommandInput(), CommandItem(), CommandList(), CommandSeparator(), CommandShortcut() (+20 more)

### Community 141 - "Elysia Helmet"
Cohesion: 0.18
Nodes (12): useTestingEmail(), useUpdateSettings(), useGetSettings(), SettingsCacheContext, SettingsRoot, useSettings(), useCancelSubscription(), useCreateCheckout() (+4 more)

### Community 143 - "Google Auth"
Cohesion: 0.53
Nodes (4): PaginationDto, PomodoroQueryDto, StartPomodoroDto, StopPomodoroDto

### Community 147 - "Repo Package"
Cohesion: 0.60
Nodes (4): AddItemToPlaylistDto, CreatePlaylistDto, MusicQueryDto, PlaylistParamsDto

### Community 148 - "Sharp"
Cohesion: 0.60
Nodes (4): CreateNoteDto, NoteParamsDto, NoteQueryDto, UpdateNoteDto

### Community 150 - "Types JWT"
Cohesion: 0.60
Nodes (4): CreatePositionDto, PositionParamsDto, PositionQueryDto, UpdatePositionDto

### Community 157 - "Classnames"
Cohesion: 0.18
Nodes (8): MusicContainer(), FloatingMusicPlayer(), QueuePanel(), sendPlayerCommand(), toEmbedUrl(), useYouTubeOnEnded(), useMusicPlayer(), AppShell()

### Community 159 - "CMDK"
Cohesion: 0.29
Nodes (6): 1. Project Overview & Architecture, 2. Skills Required for Development, 3. Non-Negotiable Core Rules, 4. Knowledge Graph (Graphify) Auto-Update Rule, Knowledge Graph Maintenance Protocol:, SPACES AGENT CONFIGURATION & PLAYBOOK

### Community 160 - "Cookies Next"
Cohesion: 0.22
Nodes (6): NotificationDetailSectionProps, NOTIFICATION_ENDPOINTS, NotificationService, NotificationInApp, NotificationLog, NotificationQueueQuery

### Community 162 - "Embla Carousel"
Cohesion: 0.60
Nodes (4): ReviewTrackDto, SubmitTrackDto, TrackCatalogParamsDto, TrackCatalogQueryDto

### Community 165 - "GSAP"
Cohesion: 0.32
Nodes (9): useCreateEvent(), useDeleteEvent(), useUpdateEvent(), useEvents(), useCalender(), CalendarCacheContext, calenderRootKey, eventsListKey() (+1 more)

### Community 174 - "Next Toploader"
Cohesion: 0.17
Nodes (11): name, private, scripts, build, dev, format, format:check, lint (+3 more)

### Community 179 - "Radix Dropdown"
Cohesion: 0.18
Nodes (5): CompanyController, InvitationController, CompanyRouter, InvitationRouter, unauthorizedValidate()

### Community 180 - "Radix Popover"
Cohesion: 0.50
Nodes (3): IntrinsicElements, JSX, react/jsx-runtime

### Community 184 - "React"
Cohesion: 0.35
Nodes (9): AddTaskAttachmentDto, AddTaskCommentDto, AssignTaskDto, CreateTaskChecklistDto, CreateTaskDto, TaskParamsDto, TaskQueryDto, UpdateTaskDto (+1 more)

### Community 200 - "Toast Notifications"
Cohesion: 0.36
Nodes (7): CompanyMemberStatusEnum, MemberContactItemDto, MemberParamsDto, MemberQueryDto, UpdateMemberContactsDto, UpdateMemberDto, UpdateMemberProfileDto

### Community 205 - "Burnt Toast Library"
Cohesion: 0.42
Nodes (7): AddTeamMemberDto, CreateTeamDto, InviteMemberDto, TeamMemberParamsDto, TeamParamsDto, TeamQueryDto, UpdateTeamDto

### Community 237 - "Bottom Tab Navigation"
Cohesion: 0.52
Nodes (5): NotificationInAppQueryDto, NotificationLogQueryDto, NotificationParamsDto, NotificationQueueQueryDto, SendNotificationDto

## Knowledge Gaps
- **719 isolated node(s):** `name`, `version`, `type`, `prisma:generate`, `dev` (+714 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **132 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AppContext` connect `Auth Controller Routes` to `Login UI`, `Department and Member`, `Controllers Mix`, `Google Auth`, `Repo Package`, `Sharp`, `Types JWT`, `Auth Service`, `Session Management`, `Embla Carousel`, `Calendar, Note, Todo Controllers`, `App Layout and Providers`, `Music Controller`, `Music and Settings State`, `Radix Dropdown`, `React`, `Task State Management`, `Task State Management`, `Pomodoro Controller`, `Invitation Controller`, `Position Controller`, `Toast Notifications`, `Burnt Toast Library`, `Note State`, `Bottom Tab Navigation`, `Todo DTOs Routes`, `Badge Component`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **Why does `cn()` connect `UI Components` to `Carousel UI`, `Settings and Select UI`, `Alert Dialog Atoms`, `Settings and Dropdown UI`, `Notes UI`, `Department Management`, `Auth Forms`, `Command and Dialog UI`, `UI Toast and Alert`, `Task Service`, `Public Pages`, `Classnames`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **Why does `JwtPayload` connect `Controllers Mix` to `Music and Settings State`, `Task Service`, `Auth Controller Routes`, `Auth Service`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **What connects `name`, `version`, `type` to the rest of the system?**
  _719 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Auth and Endpoints` be split into smaller, more focused modules?**
  _Cohesion score 0.06190476190476191 - nodes in this community are weakly interconnected._
- **Should `App and Auth DTOs` be split into smaller, more focused modules?**
  _Cohesion score 0.09815078236130868 - nodes in this community are weakly interconnected._
- **Should `Department and Member` be split into smaller, more focused modules?**
  _Cohesion score 0.09821428571428571 - nodes in this community are weakly interconnected._