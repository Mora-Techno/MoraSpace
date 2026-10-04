# Graph Report - .  (2026-07-22)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 3067 nodes · 7715 edges · 270 communities (146 shown, 124 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 191 edges (avg confidence: 0.79)
- Token cost: 14,484 input · 7,397 output

## Graph Freshness
- Built from commit: `da5c0521`
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
- Environment Types
- Burnt Toast Library
- Class Variance Authority
- Class Name Utility
- Expo Constants
- Expo Dev Client
- Expo Fonts
- Expo Haptics
- Expo Image
- Expo Router
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
- React DOM
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
- Tailwind Merge
- React Query
- Zod Validation
- Form Login Types
- Grafana Volume
- Loki Volume
- Observability Network
- Tempo Volume
- Delete Response Type
- Radix Tooltip

## God Nodes (most connected - your core abstractions)
1. `AppContext` - 153 edges
2. `TResponse` - 153 edges
3. `cn()` - 149 edges
4. `HttpResponse()` - 142 edges
5. `toServiceResponse()` - 124 edges
6. `getUser()` - 103 edges
7. `memberContextValidate()` - 93 edges
8. `queryKey` - 89 edges
9. `useAppNameSpace()` - 85 edges
10. `paramsValidate()` - 57 edges

## Surprising Connections (you probably didn't know these)
- `ForgotPasswordSectionProps` --references--> `PickSendMagicLink`  [EXTRACTED]
  apps/fe/src/components/page/auth/ForgotPassword/ForgotPasswordSection.tsx → packages/shared/types/auth.types.ts
- `SubscriptionPlan` --references--> `SubscriptionTier`  [EXTRACTED]
  apps/be/src/config/subscriptionPlans.ts → packages/shared/types/company.types.ts
- `AppContext` --references--> `JwtPayload`  [EXTRACTED]
  apps/be/src/contex/index.ts → packages/shared/types/auth.types.ts
- `roleType` --references--> `CompanyRole`  [EXTRACTED]
  apps/be/src/utils/roleHelper.ts → packages/shared/types/company.types.ts
- `ResetPasswordSectionProps` --references--> `PickResetPassword`  [EXTRACTED]
  apps/fe/src/components/page/auth/ResetPassword/ResetPasswordSection.tsx → packages/shared/types/auth.types.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Observability Stack** — docker_compose_alloy, docker_compose_tempo, docker_compose_loki, docker_compose_grafana [EXTRACTED 1.00]
- **Application Stack** — apps_be, apps_fe, apps_mobile [INFERRED 0.80]

## Communities (270 total, 124 thin omitted)

### Community 0 - "Calendar and Notes"
Cohesion: 0.05
Nodes (48): CalendarService, mapEvent(), NoteService, NotificationService, mapTodo(), TodoService, useCreateEvent(), useDeleteEvent() (+40 more)

### Community 1 - "Auth and Endpoints"
Cohesion: 0.07
Nodes (22): MEMBER_ENDPOINTS, NOTIFICATION_ENDPOINTS, TASK_ENDPOINTS, TEAM_ENDPOINTS, TODO_ENDPOINTS, AuthService, CompanyService, MemberService (+14 more)

### Community 2 - "App and Auth DTOs"
Cohesion: 0.05
Nodes (47): app, connectWithRetry(), disconnectDatabase(), ForgotPasswordDto, LoginDto, RefreshTokenDto, RegisterDto, ResetPasswordDto (+39 more)

### Community 3 - "Department and Member"
Cohesion: 0.12
Nodes (14): AppContext, DepartmentController, MemberController, RoleController, TaskController, TeamController, MemberRouter, PermissionRouter (+6 more)

### Community 4 - "UI Components"
Cohesion: 0.06
Nodes (56): AccordionContent(), AccordionItem(), AccordionTrigger(), Avatar(), AvatarFallback(), AvatarImage(), Card(), CardAction() (+48 more)

### Community 5 - "Config and Calendar DTOs"
Cohesion: 0.06
Nodes (36): _env, envSchema, ElysiaHandler, ElysiaMiddleware, CreateEventDto, EventParamsDto, EventQueryDto, UpdateEventDto (+28 more)

### Community 6 - "Controllers Mix"
Cohesion: 0.10
Nodes (17): CompanyController, NotificationController, SystemController, buildGetResponseMeta(), formatProcessTime(), HttpResponse(), isGetRequest(), RequestTimingStore (+9 more)

### Community 7 - "Auth Pages and Dashboard"
Cohesion: 0.06
Nodes (23): RegisterCompanyContainer(), DashboardContainer(), QuickAddFab(), TodayTodosWidget(), UpcomingEventsWidget(), TodoFormSection(), TabValue, TodoListSection() (+15 more)

### Community 8 - "Mobile Dev Dependencies"
Cohesion: 0.04
Nodes (48): devDependencies, autoprefixer, babel-plugin-module-resolver, @babel/plugin-transform-react-jsx, babel-preset-expo, eslint, eslint-config-expo, eslint-plugin-simple-import-sort (+40 more)

### Community 9 - "API Endpoints Config"
Cohesion: 0.10
Nodes (28): buildEndpoint(), AUTH_ENDPOINTS, listAuthEndpoints(), CALENDAR_ENDPOINTS, listCalendarEndpoints(), COMPANY_ENDPOINTS, listCompanyEndpoints(), listDepartmentEndpoints() (+20 more)

### Community 10 - "Frontend Dev Dependencies"
Cohesion: 0.04
Nodes (46): devDependencies, bun-types, eslint, eslint-config-next, eslint-config-prettier, @eslint/eslintrc, eslint-import-resolver-typescript, eslint-plugin-import (+38 more)

### Community 11 - "Role and Company State"
Cohesion: 0.09
Nodes (35): roleType, CompanyCacheContext, HttpStatusCode, IApi, TPagedList, TPagedListResponse, IAuth, PickCreateAdmin (+27 more)

### Community 12 - "Biome Config"
Cohesion: 0.05
Nodes (43): noUnusedVariables, files, ignore, formatter, enabled, indentStyle, indentWidth, lineWidth (+35 more)

### Community 13 - "Settings and Dropdown UI"
Cohesion: 0.08
Nodes (29): SettingsContainer(), DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator() (+21 more)

### Community 14 - "API Response Types"
Cohesion: 0.17
Nodes (19): DelResponse, GetResponse, PatchResponse, PostResponse, PublicGetResponse, PublicPostResponse, PutResponse, QueryValue (+11 more)

### Community 15 - "Notes UI"
Cohesion: 0.11
Nodes (16): NoteDetailContainer(), NotesContainer(), NoteEditorSection(), NoteListSection(), TodosContainer(), Sheet(), SheetContent(), SheetFooter() (+8 more)

### Community 16 - "Alert and Button UI"
Cohesion: 0.11
Nodes (29): AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription(), AlertDialogFooter(), AlertDialogHeader(), AlertDialogOverlay(), AlertDialogTitle() (+21 more)

### Community 17 - "Subscription and Stripe"
Cohesion: 0.13
Nodes (16): getPeriodEnd(), getPlan(), getPlanPrice(), PaymentProvider, PlanPrice, SUBSCRIPTION_PLANS, SubscriptionPlan, StripeService (+8 more)

### Community 18 - "Calendar UI"
Cohesion: 0.11
Nodes (14): CalendarContainer(), EventFormSection(), EventListSection(), Badge(), badgeVariants, Button(), buttonVariants, Calendar() (+6 more)

### Community 19 - "Company and Team Services"
Cohesion: 0.11
Nodes (16): CompanyService, TeamService, resolveCompanyRole(), slugify(), toSafeAuthUser(), uniqueCompanySlug(), getCompanyTier(), inferBillingCycle() (+8 more)

### Community 20 - "Command and Dialog UI"
Cohesion: 0.11
Nodes (21): Command(), CommandEmpty(), CommandGroup(), CommandInput(), CommandItem(), CommandList(), CommandSeparator(), CommandShortcut() (+13 more)

### Community 21 - "Frontend TypeScript Config"
Cohesion: 0.06
Nodes (33): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+25 more)

### Community 22 - "Project Dependencies"
Cohesion: 0.06
Nodes (33): @biomejs/biome, dependencies, axios, @sinclair/typebox, @tanstack/react-query, @tanstack/react-query-devtools, devDependencies, @biomejs/biome (+25 more)

### Community 23 - "Auth Service"
Cohesion: 0.17
Nodes (19): AuthService, AUTH_EXPIRY, generateOtp(), generateSecureToken(), getMagicLinkExpiry(), getOtpExpiry(), sanitizeUser(), resolveAuthUser() (+11 more)

### Community 24 - "Todo State Management"
Cohesion: 0.13
Nodes (23): useCreateTodo(), useDeleteTodo(), useUpdateTodo(), useTodos(), readTodoSnapshot(), TodoCacheContext, todoRootKey, todosListKey() (+15 more)

### Community 25 - "Server Fetch and Auth"
Cohesion: 0.14
Nodes (28): buildBaseHeaders(), clearTokens(), COOKIE_KEYS, coreFetch(), coreFetchResponse(), DelResponse(), _doRefreshOnce(), doRefreshToken() (+20 more)

### Community 26 - "Music and Home"
Cohesion: 0.12
Nodes (14): DEFAULT_PLAYLISTS, MusicContainer(), toEmbedUrl(), ContainerHome(), CtaSection(), FEATURES, FeaturesSection(), HeroSection() (+6 more)

### Community 27 - "Expo App Config"
Cohesion: 0.07
Nodes (29): backgroundColor, backgroundImage, foregroundImage, monochromeImage, adaptiveIcon, edgeToEdgeEnabled, predictiveBackGestureEnabled, usesCleartextTraffic (+21 more)

### Community 28 - "App Layout and Theme"
Cohesion: 0.11
Nodes (20): CustomDrawerContent(), PrivateLayout(), TabsLayout(), ThemeToggle(), ColorConfig, ThemeConfig, iconMap, styles (+12 more)

### Community 29 - "Auth Forms"
Cohesion: 0.10
Nodes (13): ForgotPasswordContainer(), ButtonProps, ForgotPasswordSection(), ForgotPasswordSectionProps, LoginFormSectionProps, RegisterFormSectionProps, ResetPasswordSectionProps, ActionButton (+5 more)

### Community 30 - "Backend TypeScript Config"
Cohesion: 0.07
Nodes (28): compilerOptions, allowSyntheticDefaultImports, baseUrl, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, lib, module (+20 more)

### Community 31 - "Backend Dependencies"
Cohesion: 0.07
Nodes (27): dependencies, bcryptjs, @elysia/opentelemetry, @elysiajs/cors, @elysiajs/swagger, form-data, @opentelemetry/exporter-trace-otlp-proto, pino (+19 more)

### Community 32 - "Backend Dev Dependencies"
Cohesion: 0.07
Nodes (27): devDependencies, bun-types, eslint, eslint-config-prettier, eslint-plugin-prettier, prettier, ts-node, @types/bcryptjs (+19 more)

### Community 33 - "Session Management"
Cohesion: 0.11
Nodes (11): SessionController, SessionParamsDto, SessionRouter, SessionService, buildPayload(), createTokenPair(), getAccessTokenExpiry(), getRefreshTokenExpiry() (+3 more)

### Community 34 - "Auth Containers"
Cohesion: 0.13
Nodes (16): LoginContainer(), MagicLinkContainer(), ResetPasswordContainer(), MagicLinkSectionProps, LogoutButton(), useCreateAdmin(), useRegisterCompany(), useUpdateCompanySubscription() (+8 more)

### Community 35 - "Auth Token and Session"
Cohesion: 0.15
Nodes (22): AuthTokens, COOKIE_KEYS, getCookieStore(), getRoleFromCookie(), saveTokens(), TokenPair, COOKIE_KEYS, ensureAuthenticatedSession() (+14 more)

### Community 36 - "Calendar, Note, Todo Controllers"
Cohesion: 0.14
Nodes (7): CalendarController, NoteController, TodoController, CalendarRouter, NoteRouter, TodoRouter, isTransportResponse()

### Community 37 - "Query Keys and Configs"
Cohesion: 0.24
Nodes (4): ColorConfig, ThemeConfig, Api, queryKey

### Community 38 - "App Layout and Providers"
Cohesion: 0.10
Nodes (17): composeProviders(), ProviderComponent, ProviderProps, nunito, playfair, metadata, siteConfig, AppProviders() (+9 more)

### Community 39 - "Alert and Notification State"
Cohesion: 0.15
Nodes (13): useAlert(), CompanyCacheContext, companyRooyKey, useSendNotification(), useNotificationLogs(), NotificationCacheContext, notificationLogsKey(), notificationsRootKey (+5 more)

### Community 40 - "Mobile Pages"
Cohesion: 0.13
Nodes (17): HomeContainer(), LoginPage(), SectionHomePage(), Card(), CardContent(), CardDescription(), CardFooter(), CardHeader() (+9 more)

### Community 41 - "API Client Setup"
Cohesion: 0.13
Nodes (22): BASE_URL, BaseURLProvider, buildApiUrl(), buildBaseHeaders(), clientCoreFetch(), clientCoreFetchResponse(), ClientDel(), ClientDelResponse() (+14 more)

### Community 42 - "Role Service"
Cohesion: 0.14
Nodes (8): RoleService, ROLE_ENDPOINTS, RoleService, IPermission, IRole, PickCreateRole, PickUpdateRole, PickUpdateRolePermissions

### Community 43 - "Sitemap and App Config"
Cohesion: 0.13
Nodes (15): generateSitemap(), GET(), AppConfig, AUTH_ROUTES, NavigationMenuConfig, PropsParams, PUBLIC_ROUTES, RegisterConfigRoutes (+7 more)

### Community 44 - "Alert Dialog Atoms"
Cohesion: 0.16
Nodes (18): AlertDialog(), AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription(), AlertDialogFooter(), AlertDialogHeader(), AlertDialogMedia() (+10 more)

### Community 45 - "Shared TypeScript Config"
Cohesion: 0.08
Nodes (23): compilerOptions, esModuleInterop, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+15 more)

### Community 46 - "Music Controller"
Cohesion: 0.15
Nodes (9): MusicController, CreatePlaylistDto, PlaylistParamsDto, MusicRouter, mapPlaylist(), MusicService, CreateMusicValidate(), IMusicPlayListItem (+1 more)

### Community 47 - "Invitation Service"
Cohesion: 0.18
Nodes (7): InvitationService, INVITATION_ENDPOINTS, InvitationService, IInvitation, PickAcceptInvitation, PickCreateInvitation, PickRejectInvitation

### Community 48 - "UI Input and Navigation"
Cohesion: 0.11
Nodes (11): DecoratedInputProps, MOBILE_NAV_ITEMS, NAV_ITEMS, NavItem, BottomNav(), InputBaseProps, TextField, ClassArray (+3 more)

### Community 49 - "Subscription State"
Cohesion: 0.13
Nodes (17): useCancelSubscription(), useCreateCheckout(), useSubscription(), useSubscriptionPlans(), useSubscription(), BillingCycle, CheckoutData, CreateCheckoutInput (+9 more)

### Community 50 - "Music and Settings State"
Cohesion: 0.21
Nodes (11): useCreatePlaylist(), useDeletePlaylist(), usePlaylists(), MusicCacheContext, readPlaylistSnapshot(), useMusic(), useUpdateSettings(), useGetSettings() (+3 more)

### Community 51 - "Turbo Tasks"
Cohesion: 0.10
Nodes (19): ^lint, !.next/cache/**, dependsOn, outputs, cache, persistent, cache, ^build (+11 more)

### Community 52 - "UI Toast and Alert"
Cohesion: 0.16
Nodes (14): GooeyToaster(), RegisterCard(), AlertModal(), AlertModalInternalProps, showAlertToast(), AlertContex, AlertProvinder(), AlertContexType (+6 more)

### Community 53 - "Mobile UI Components"
Cohesion: 0.15
Nodes (15): AlertModal(), AlertModalInternalProps, iconMap, styles, { width }, PopUp(), styles, { width, height } (+7 more)

### Community 54 - "Redux Auth Store"
Cohesion: 0.13
Nodes (13): authSlice, AuthState, initialState, AppDispatch, persistConfig, persistedReducer, persistor, rootReduser (+5 more)

### Community 55 - "Frontend Components Config"
Cohesion: 0.11
Nodes (17): aliases, components, hooks, lib, ui, utils, iconLibrary, rsc (+9 more)

### Community 56 - "Public Pages"
Cohesion: 0.14
Nodes (6): BlogsContainer(), PricingContainer(), ResourceContainer(), CATEGORIES, ResourceHeroSection(), ResourceHeroSectionProps

### Community 57 - "Task State Management"
Cohesion: 0.32
Nodes (14): useAddTaskAttachment(), useAddTaskComment(), useAssignTask(), useCreateTask(), useCreateTaskChecklist(), useDeleteTask(), useUpdateTask(), useUpdateTaskStatus() (+6 more)

### Community 58 - "Task State Management"
Cohesion: 0.33
Nodes (14): useAddTaskAttachment(), useAddTaskComment(), useAssignTask(), useCreateTask(), useCreateTaskChecklist(), useDeleteTask(), useUpdateTask(), useUpdateTaskStatus() (+6 more)

### Community 59 - "Member Service"
Cohesion: 0.17
Nodes (6): MemberService, CompanyMemberStatus, MemberContactItem, PickUpdateCompanyMember, PickUpdateMemberContacts, PickUpdateMemberProfile

### Community 60 - "Position Service"
Cohesion: 0.21
Nodes (6): PositionService, POSITION_ENDPOINTS, PositionService, IPosition, PickCreatePosition, PickUpdatePosition

### Community 61 - "App Layout and Providers"
Cohesion: 0.17
Nodes (9): composeProviders(), ProviderComponent, ProviderProps, AppProviders(), Providers, RootLayoutContent(), ThemeProvider(), AlertProvinder() (+1 more)

### Community 62 - "Mobile Components Config"
Cohesion: 0.12
Nodes (15): aliases, components, hooks, lib, ui, utils, rsc, $schema (+7 more)

### Community 63 - "Pomodoro Controller"
Cohesion: 0.22
Nodes (4): PomodoroController, StartPomodoroDto, StopPomodoroDto, PomodoroRouter

### Community 64 - "Role State"
Cohesion: 0.33
Nodes (11): useCreateRole(), useDeleteRole(), useUpdateRole(), useUpdateRolePermissions(), useGetRolePermissions(), useListMasterPermissions(), useListRoles(), readRoleSnapshot() (+3 more)

### Community 65 - "Member State"
Cohesion: 0.34
Nodes (11): useDeleteMember(), useUpdateContacts(), useUpdateMember(), useUpdateProfile(), useGetContacts(), useGetMember(), useGetProfile(), useListMembers() (+3 more)

### Community 66 - "Team State"
Cohesion: 0.36
Nodes (11): useAddTeamMember(), useCreateTeam(), useDeleteTeam(), useInviteTeamMember(), useRemoveTeamMember(), useUpdateTeam(), useListTeamMembers(), useListTeams() (+3 more)

### Community 67 - "Mobile TypeScript Config"
Cohesion: 0.13
Nodes (14): compilerOptions, paths, strict, extends, include, ../../packages/shared/*, ../../packages/shared/index.ts, **/*.ts (+6 more)

### Community 68 - "Shared Package Exports"
Cohesion: 0.13
Nodes (15): exports, ./api/client, ./api/server, ./config/api, ./endpoints, ./react-query/mutation-wrapper, ./react-query/mutation-wrapper.type, ./react-query/query-client (+7 more)

### Community 69 - "Backend Package Scripts"
Cohesion: 0.14
Nodes (13): name, scripts, build, dev, format, format:check, lint, lint:fix (+5 more)

### Community 71 - "Invitation Controller"
Cohesion: 0.22
Nodes (6): InvitationController, AcceptInvitationDto, CreateInvitationDto, InvitationParamsDto, RejectInvitationDto, InvitationRouter

### Community 72 - "Position Controller"
Cohesion: 0.22
Nodes (5): PositionController, CreatePositionDto, PositionParamsDto, UpdatePositionDto, PositionRouter

### Community 73 - "Subscription Controller"
Cohesion: 0.23
Nodes (3): SubscriptionController, CreateCheckoutDto, SubscriptionRouter

### Community 74 - "Carousel UI"
Cohesion: 0.20
Nodes (13): Carousel(), CarouselApi, CarouselContent(), CarouselContext, CarouselContextProps, CarouselItem(), CarouselNext(), CarouselOptions (+5 more)

### Community 75 - "Role State"
Cohesion: 0.36
Nodes (10): useCreateRole(), useDeleteRole(), useUpdateRole(), useUpdateRolePermissions(), useGetRolePermissions(), useListMasterPermissions(), useListRoles(), readRoleSnapshot() (+2 more)

### Community 76 - "Mobile Dependencies"
Cohesion: 0.15
Nodes (14): dependencies, expo-linking, install, react-native-safe-area-context, react-native-worklets, @react-navigation/elements, @react-navigation/native, @reduxjs/toolkit (+6 more)

### Community 77 - "Shared React Query"
Cohesion: 0.21
Nodes (9): listEndpoints(), useMutationWrapper(), ReactQueryClientProvider(), transformParams(), pageFilterTypeSchema, QueryParams, queryParamsSchema, requiredString (+1 more)

### Community 78 - "UI Dependencies"
Cohesion: 0.15
Nodes (13): dependencies, axios, class-variance-authority, @radix-ui/react-navigation-menu, react-day-picker, tailwind-merge, zod, axios (+5 more)

### Community 79 - "Private Layout and Auth"
Cohesion: 0.27
Nodes (9): AppShell(), PrivateProviders(), restoreAuthSession(), clearTokens(), AuthSession, clearAuthSession(), persistAuthSession(), persistAuthSessionFromResponse() (+1 more)

### Community 80 - "Member State"
Cohesion: 0.30
Nodes (12): useDeleteMember(), useUpdateContacts(), useUpdateMember(), useUpdateProfile(), useGetContacts(), useGetMember(), useGetProfile(), useListMembers() (+4 more)

### Community 81 - "Pomodoro State"
Cohesion: 0.37
Nodes (10): usePausePomodoroSession(), useResumePomodoroSession(), useStartPomodoroSession(), useStopPomodoroSession(), useGetPomodoroStatistics(), useGetTodayFocus(), podomoroRoot, PomodoroCacheContext (+2 more)

### Community 82 - "Note State"
Cohesion: 0.37
Nodes (9): useCreateNote(), useDeleteNote(), useUpdateNote(), useNote(), useNotes(), NoteCacheContext, readNoteDetailSnapshot(), readNoteListSnapshot() (+1 more)

### Community 83 - "Pomodoro State"
Cohesion: 0.38
Nodes (9): usePausePomodoroSession(), useResumePomodoroSession(), useStartPomodoroSession(), useStopPomodoroSession(), useGetPomodoroStatistics(), useGetTodayFocus(), PomodoroCacheContext, readPomodoroSnapshot() (+1 more)

### Community 85 - "Auth State"
Cohesion: 0.39
Nodes (9): useForgotPassword(), useLogin(), useLogout(), useRegister(), useResetPassword(), useSendMagicLink(), useVerifyMagicLink(), AuthCacheContext (+1 more)

### Community 86 - "Calendar State"
Cohesion: 0.39
Nodes (9): useCreateEvent(), useDeleteEvent(), useUpdateEvent(), useEvents(), CalendarCacheContext, calenderRootKey, eventsListKey(), readEventSnapshot() (+1 more)

### Community 87 - "Department State"
Cohesion: 0.38
Nodes (9): useCreateDepartment(), useDeleteDepartment(), useUpdateDepartment(), useGetDepartment(), useListDepartments(), DepartmentCacheContext, departmentRootKey, readDepartmentSnapshot() (+1 more)

### Community 88 - "Invitation State"
Cohesion: 0.41
Nodes (9): useAcceptInvitation(), useCreateInvitation(), useDeleteInvitation(), useRejectInvitation(), useListInvitations(), InvitationCacheContext, invitationsRootKey, readInvitationSnapshot() (+1 more)

### Community 89 - "Note State"
Cohesion: 0.39
Nodes (9): useCreateNote(), useDeleteNote(), useUpdateNote(), useNote(), useNotes(), NoteCacheContext, readNoteDetailSnapshot(), readNoteListSnapshot() (+1 more)

### Community 90 - "Team State"
Cohesion: 0.47
Nodes (10): useAddTeamMember(), useCreateTeam(), useDeleteTeam(), useInviteTeamMember(), useRemoveTeamMember(), useUpdateTeam(), useListTeamMembers(), useListTeams() (+2 more)

### Community 91 - "Department State"
Cohesion: 0.39
Nodes (8): useCreateDepartment(), useDeleteDepartment(), useUpdateDepartment(), useGetDepartment(), useListDepartments(), DepartmentCacheContext, readDepartmentSnapshot(), useDepartment()

### Community 92 - "Invitation State"
Cohesion: 0.41
Nodes (8): useAcceptInvitation(), useCreateInvitation(), useDeleteInvitation(), useRejectInvitation(), useListInvitations(), InvitationCacheContext, readInvitationSnapshot(), useInvitation()

### Community 93 - "Task Controller and Types"
Cohesion: 0.53
Nodes (7): PickAddTaskAttachment, PickAddTaskComment, PickAssignTask, PickCreateTask, PickCreateTaskChecklist, PickUpdateTask, PickUpdateTaskStatus

### Community 94 - "Department Service"
Cohesion: 0.25
Nodes (4): DepartmentService, DepartmentRespone, PickCreateDepartment, PickUpdateDepartment

### Community 95 - "Auth Layout and NotFound"
Cohesion: 0.25
Nodes (4): NotFound(), BlankLayout(), Props, blankLayoutClasses

### Community 96 - "Position State"
Cohesion: 0.42
Nodes (8): useCreatePosition(), useDeletePosition(), useUpdatePosition(), useListPositions(), PositionCacheContext, positionsRoot, readPositionSnapshot(), usePosition()

### Community 97 - "Notification State"
Cohesion: 0.40
Nodes (7): useSendNotification(), useNotificationLogs(), NotificationCacheContext, notificationLogsKey(), notificationsRootKey, readNotificationLogsSnapshot(), useNotification()

### Community 98 - "Position State"
Cohesion: 0.42
Nodes (7): useCreatePosition(), useDeletePosition(), useUpdatePosition(), useListPositions(), PositionCacheContext, readPositionSnapshot(), usePosition()

### Community 99 - "Session Management"
Cohesion: 0.40
Nodes (7): useDeleteSessionAll(), useDeleteSessionById(), useGetSession(), useListSessions(), readSessionSnapshot(), SessionCacheContext, useSession()

### Community 100 - "Subscription Flow"
Cohesion: 0.38
Nodes (7): useCancelSubscription(), useCreateCheckout(), useSubscription(), useSubscriptionPlans(), useSubscriptions(), Api, ApiServicePackage

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
Nodes (4): PomodoroService, IPomodoroSession, PickStartPomodoro, PickStopPomodoro

### Community 105 - "Session State"
Cohesion: 0.42
Nodes (7): useDeleteSessionAll(), useDeleteSessionById(), useGetSession(), useListSessions(), readSessionSnapshot(), SessionCacheContext, useSession()

### Community 106 - "Peer Dependencies"
Cohesion: 0.20
Nodes (10): next, react, zod, next, react, zod, peerDependencies, next (+2 more)

### Community 107 - "Music Playlist"
Cohesion: 0.47
Nodes (6): useCreatePlaylist(), useDeletePlaylist(), usePlaylists(), MusicCacheContext, readPlaylistSnapshot(), useMusic()

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
Cohesion: 0.43
Nodes (4): calendarEventById(), CalendarService, PickApiID, CalendarEvent

### Community 113 - "Department Management"
Cohesion: 0.46
Nodes (3): DEPARTMENT_ENDPOINTS, DepartmentService, IDepartment

### Community 114 - "Note Management"
Cohesion: 0.46
Nodes (3): NOTE_ENDPOINTS, NoteService, Note

### Community 115 - "Todo DTOs Routes"
Cohesion: 0.48
Nodes (5): CreateTodoDto, TodoParamsDto, TodoQueryDto, TodoStatusEnum, UpdateTodoDto

### Community 116 - "Company Queries"
Cohesion: 0.57
Nodes (4): useGetMyCompany(), useListAdmins(), useCompany(), useApi()

### Community 117 - "Mutation Wrapper"
Cohesion: 0.33
Nodes (4): TListResponse, TPagedList, TPagedListResponse, TResponse

### Community 118 - "Session Endpoints"
Cohesion: 0.48
Nodes (3): SESSION_ENDPOINT, SessionService, Session

### Community 120 - "Badge Component"
Cohesion: 0.47
Nodes (5): Badge(), BadgeProps, badgeTextVariants, badgeVariants, TextClassContext

### Community 121 - "Auth Hooks"
Cohesion: 0.73
Nodes (4): useLogin(), useLogout(), useRegister(), useAuth()

### Community 122 - "Metro Config"
Cohesion: 0.33
Nodes (5): config, { getDefaultConfig }, monorepoRoot, path, { withNativeWind }

### Community 123 - "Music Playlist Service"
Cohesion: 0.47
Nodes (3): musicPlaylistById(), MusicService, MusicPlaylist

### Community 126 - "ESLint Config"
Cohesion: 0.40
Nodes (4): compat, __dirname, eslintConfig, __filename

### Community 127 - "Code Scripts"
Cohesion: 0.40
Nodes (5): scripts, format, format:check, lint, lint:fix

### Community 128 - "Backend Elysia"
Cohesion: 0.50
Nodes (4): Backend (Elysia/Bun), elysia, Bun, Elysia

### Community 129 - "Frontend Next.js"
Cohesion: 0.50
Nodes (4): Frontend (Next.js), Geist Font, Next.js, Vercel

### Community 131 - "ESLint Expo"
Cohesion: 0.50
Nodes (3): { defineConfig }, expoConfig, simpleImportSort

### Community 137 - "Mobile Expo"
Cohesion: 0.67
Nodes (3): Mobile (Expo), expo, Expo

### Community 139 - "Settings and Select UI"
Cohesion: 0.15
Nodes (11): Select(), SelectContent(), SelectItem(), SelectLabel(), SelectScrollDownButton(), SelectScrollUpButton(), SelectSeparator(), SelectTrigger() (+3 more)

## Knowledge Gaps
- **635 isolated node(s):** `name`, `version`, `type`, `prisma:generate`, `dev` (+630 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **124 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `UI Components` to `Auth Pages and Dashboard`, `Carousel UI`, `Settings and Select UI`, `Alert Dialog Atoms`, `Settings and Dropdown UI`, `Notes UI`, `UI Input and Navigation`, `Calendar UI`, `Command and Dialog UI`?**
  _High betweenness centrality (0.061) - this node is a cross-community bridge._
- **Why does `AppContext` connect `Department and Member` to `Session Management`, `App and Auth DTOs`, `Calendar, Note, Todo Controllers`, `Config and Calendar DTOs`, `Controllers Mix`, `Auth Controller Routes`, `Invitation Controller`, `Position Controller`, `Subscription Controller`, `Music Controller`, `Todo DTOs Routes`, `Auth Service`, `Task Controller and Types`, `Pomodoro Controller`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **Why does `expo-router` connect `Mobile Pages` to `Auth Hooks`, `Expo App Config`, `App Layout and Theme`, `App Layout and Providers`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **What connects `name`, `version`, `type` to the rest of the system?**
  _635 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Calendar and Notes` be split into smaller, more focused modules?**
  _Cohesion score 0.05185779203421545 - nodes in this community are weakly interconnected._
- **Should `Auth and Endpoints` be split into smaller, more focused modules?**
  _Cohesion score 0.0723790976955534 - nodes in this community are weakly interconnected._
- **Should `App and Auth DTOs` be split into smaller, more focused modules?**
  _Cohesion score 0.05200341005967604 - nodes in this community are weakly interconnected._