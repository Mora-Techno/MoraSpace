# Filter/Search Endpoints Implementation Plan

## Architecture Overview

### Current Patterns Identified via Graphify

**Backend Layer (`apps/be/src`):**

| Layer         | Pattern                                                                 | Location                          |
| ------------- | ----------------------------------------------------------------------- | --------------------------------- |
| Route         | Class-based with Elysia router, `prefix`, `tags`                        | `apps/be/src/routes/*.ts`         |
| Controller    | Singleton class with `public async method(c: AppContext)`               | `apps/be/src/controllers/*.ts`    |
| Service       | Singleton class with Prisma queries, returns `{ data, meta }`           | `apps/be/src/service/*.ts`        |
| DTO           | Elysia `t.Object()` validation schemas                                  | `apps/be/src/dto/*.ts`            |
| Validation    | Custom validation functions (`paramsValidate`, `memberContextValidate`) | `apps/be/src/validation/*.ts`     |
| HTTP Response | `HttpResponse(c).ok(data, meta, message)`                               | `apps/be/src/http/index.ts`       |
| Middleware    | `verifyToken()`, `memberContextValidate()`, `paramsValidate()`          | `apps/be/src/middlewares/auth.ts` |

**Shared Layer (`packages/shared`):**

| Layer       | Pattern                                                           | Location                           |
| ----------- | ----------------------------------------------------------------- | ---------------------------------- |
| Endpoints   | Constants using `buildEndpoint(mount, path)`                      | `packages/shared/endpoints/*.ts`   |
| Services    | Singleton with HTTP helpers (`GetResponse`, `PostResponse`, etc.) | `packages/shared/services/*.ts`    |
| Types       | TypeScript interfaces and Pick types                              | `packages/shared/types/*.ts`       |
| HTTP Client | `withQuery(path, params)` for query params                        | `packages/shared/services/http.ts` |

### Paginated Response Format (existing pattern)

```ts
{
  data: T[],
  meta: {
    currentPage: number,
    limit: number,
    totalData: number,
    totalPage: number,
    process_time?: string  // auto-added for GET requests
  }
}
```

---

## Module-by-Module Analysis

### Module Dependency Graph

```
                  ┌─────────────┐
                  │   Company    │
                  └──────┬──────┘
                         │
          ┌──────────────┼──────────────┐
          │              │              │
   ┌──────▼──────┐ ┌────▼─────┐ ┌──────▼──────┐
   │  Department  │ │ Position │ │  Member     │
   └──────┬──────┘ └──────────┘ └──────┬──────┘
          │                            │
   ┌──────▼──────┐            ┌────────┴────────┐
   │    Team     │            │  Role/Permission │
   └─────────────┘            └─────────────────┘
          │                            │
          └──────────┬────────────────┘
                     │
          ┌──────────▼──────────┐
          │    Invitation        │
          └─────────────────────┘

 ┌───────┐  ┌──────┐  ┌──────────┐  ┌─────────┐
 │ Task  │  │ Todo │  │   Note   │  │ Calendar │
 └───────┘  └──────┘  └──────────┘  └─────────┘

 ┌──────────┐  ┌──────────┐  ┌──────────┐
 │ Pomodoro │  │  Music   │  │ Notific. │
 └──────────┘  └──────────┘  └──────────┘

 ┌──────────┐  ┌────────────┐  ┌────────┐
 │ Session  │  │ Subscription│  │ System │
 └──────────┘  └────────────┘  └────────┘
```

### Prisma Model Mapping

| Module       | Prisma Model    | Filterable Fields                                            |
| ------------ | --------------- | ------------------------------------------------------------ |
| auth         | User            | email, fullName, status, createdAt                           |
| calendar     | CalendarEvent   | title, startTime, endTime, companyId, createdBy              |
| company      | Company         | name, slug, createdAt, ownerId                               |
| department   | Department      | name, companyId, managerId                                   |
| invitation   | Invitation      | email, companyId, status (acceptedAt), expiredAt             |
| member       | CompanyMember   | status, positionId, employeeCode, companyId, userId          |
| music        | Playlist        | name, companyMemberId                                        |
| note         | Note            | title, content, companyMemberId, folderId, createdAt         |
| notification | Notification    | title, type, readAt, companyMemberId, createdAt              |
| permission   | Permission      | module, action, permissionKey                                |
| pomodoro     | PomodoroSession | companyMemberId, startedAt, endedAt                          |
| position     | Position        | name, level, companyId                                       |
| role         | Role            | name, companyId, isSystem                                    |
| session      | UserSession     | userId, deviceName, browser, createdAt                       |
| subscription | Subscription    | companyId, status, planId                                    |
| task         | Task            | title, statusId, priorityId, assigneeIds, dueDate, companyId |
| team         | Team            | name, departmentId, leaderId                                 |
| todo         | Todo            | title, completed, dueDate, companyMemberId                   |

---

## Implementation Plan

### Phase 1: Create Shared Filter DTO and Helper (Foundation)

**Files to create/modify:**

1. **CREATE** [`apps/be/src/dto/filter.dto.ts`](apps/be/src/dto/filter.dto.ts)
   - Reusable `PaginationDto` (page, limit)
   - Reusable `SortDto` (sortBy, sortOrder)
   - Reusable `DateRangeDto` (startDate, endDate)
   - Reusable `FilterQueryDto` combining all above + search keyword

2. **CREATE** `apps/be/src/utils/filterQueryBuilder.ts` (optional helper for building Prisma where clauses)

### Phase 2: Enhance Backend DTOs

For each module, add or enhance the query DTO to support filtering:

| Module       | DTO File                                                                     | Action                                                                 |
| ------------ | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| calendar     | [`apps/be/src/dto/calendar.dto.ts`](apps/be/src/dto/calendar.dto.ts)         | Extend `EventQueryDto` with search, pagination, sorting                |
| company      | [`apps/be/src/dto/company.dto.ts`](apps/be/src/dto/company.dto.ts)           | Add `CompanyQueryDto` for admin listing                                |
| department   | [`apps/be/src/dto/department.dto.ts`](apps/be/src/dto/department.dto.ts)     | Add `DepartmentQueryDto` with search, pagination                       |
| invitation   | [`apps/be/src/dto/invitation.dto.ts`](apps/be/src/dto/invitation.dto.ts)     | Add `InvitationQueryDto` with search, status, date range               |
| member       | [`apps/be/src/dto/member.dto.ts`](apps/be/src/dto/member.dto.ts)             | Add `MemberQueryDto` with search, status, positionId                   |
| music        | [`apps/be/src/dto/music.dto.ts`](apps/be/src/dto/music.dto.ts)               | Add `MusicQueryDto` with search, pagination                            |
| note         | [`apps/be/src/dto/note.dto.ts`](apps/be/src/dto/note.dto.ts)                 | Add `NoteQueryDto` with search, date range, folderId                   |
| notification | [`apps/be/src/dto/notification.dto.ts`](apps/be/src/dto/notification.dto.ts) | Enhance `NotificationLogQueryDto` with all filters                     |
| permission   | [`apps/be/src/dto/role.dto.ts`](apps/be/src/dto/role.dto.ts)                 | Add `PermissionQueryDto` with search, module filter                    |
| pomodoro     | [`apps/be/src/dto/pomodoro.dto.ts`](apps/be/src/dto/pomodoro.dto.ts)         | Add `PomodoroQueryDto` with date range, pagination                     |
| position     | [`apps/be/src/dto/position.dto.ts`](apps/be/src/dto/position.dto.ts)         | Add `PositionQueryDto` with search, level filter                       |
| role         | [`apps/be/src/dto/role.dto.ts`](apps/be/src/dto/role.dto.ts)                 | Add `RoleQueryDto` with search, system filter                          |
| session      | [`apps/be/src/dto/session.dto.ts`](apps/be/src/dto/session.dto.ts)           | Add `SessionQueryDto` with search, date range, device filter           |
| subscription | [`apps/be/src/dto/subscription.dto.ts`](apps/be/src/dto/subscription.dto.ts) | Add `SubscriptionQueryDto` with status, plan filter                    |
| task         | [`apps/be/src/dto/task.dto.ts`](apps/be/src/dto/task.dto.ts)                 | Add `TaskQueryDto` with search, status, priority, assignee, date range |
| team         | [`apps/be/src/dto/team.dto.ts`](apps/be/src/dto/team.dto.ts)                 | Enhance `TeamQueryDto` with search, pagination                         |
| todo         | [`apps/be/src/dto/todo.dto.ts`](apps/be/src/dto/todo.dto.ts)                 | Enhance `TodoQueryDto` with search keyword, pagination                 |

### Phase 3: Enhance Backend Services

For each module, modify the `list` method or add a new `filter` method to accept query parameters:

| Module       | Service File                                 | Changes                                                              |
| ------------ | -------------------------------------------- | -------------------------------------------------------------------- |
| auth         | `apps/be/src/service/AuthService.ts`         | Add `list` method for user search/filter (scoped to company)         |
| calendar     | `apps/be/src/service/CalendarService.ts`     | Enhance `list` with search keyword, pagination, sorting              |
| company      | `apps/be/src/service/CompanyService.ts`      | Enhance `listAdmins` with search, pagination                         |
| department   | `apps/be/src/service/DepartmentService.ts`   | Enhance `list` with search keyword, date range                       |
| invitation   | `apps/be/src/service/InvitationService.ts`   | Enhance `list` with search, status filter (accepted/pending/expired) |
| member       | `apps/be/src/service/MemberService.ts`       | Enhance `list` with search, status, positionId, departmentId         |
| music        | `apps/be/src/service/MusicService.ts`        | Enhance `list` with search keyword                                   |
| note         | `apps/be/src/service/NoteService.ts`         | Enhance `list` with search, date range, folderId                     |
| notification | `apps/be/src/service/NotificationService.ts` | Enhance `listInApp`, `listLogs` with search, date range, type        |
| permission   | `apps/be/src/service/RoleService.ts`         | Enhance `listMasterPermissions` with search, module filter           |
| pomodoro     | `apps/be/src/service/PomodoroService.ts`     | Add `list` with date range, pagination                               |
| position     | `apps/be/src/service/PositionService.ts`     | Enhance `list` with search, level filter                             |
| role         | `apps/be/src/service/RoleService.ts`         | Enhance `listRoles` with search, system filter                       |
| session      | `apps/be/src/service/SessionService.ts`      | Enhance `listService` with search, date range, device                |
| subscription | `apps/be/src/service/SubscriptionService.ts` | Add `list` with status, plan filter, date range                      |
| task         | `apps/be/src/service/TaskService.ts`         | Enhance `list` with search, status, priority, assignee, date range   |
| team         | `apps/be/src/service/TeamService.ts`         | Enhance `list` with search keyword                                   |
| todo         | `apps/be/src/service/TodoService.ts`         | Enhance `list` with search keyword, full pagination                  |

### Phase 4: Enhance Backend Controllers

Each controller's `list` method must extract query params and pass them to service:

| Module      | Controller File                | Changes                                                                |
| ----------- | ------------------------------ | ---------------------------------------------------------------------- |
| All modules | `apps/be/src/controllers/*.ts` | Pass query params to service methods, return proper response with meta |

### Phase 5: Route Updates

Add query DTO to each route's GET / endpoint:

| Module       | Route File                                 | Changes                                              |
| ------------ | ------------------------------------------ | ---------------------------------------------------- |
| calendar     | `apps/be/src/routes/calendarRoutes.ts`     | Update query: EventQueryDto → Enhanced EventQueryDto |
| company      | `apps/be/src/routes/companyRoutes.ts`      | Add query to GET /admins                             |
| department   | `apps/be/src/routes/departmentRoutes.ts`   | Add query: DepartmentQueryDto                        |
| invitation   | `apps/be/src/routes/invitationRoutes.ts`   | Add query to GET /                                   |
| member       | `apps/be/src/routes/memberRoutes.ts`       | Add query to GET /                                   |
| music        | `apps/be/src/routes/musicRoutes.ts`        | Add query to GET /                                   |
| note         | `apps/be/src/routes/noteRoutes.ts`         | Add query to GET /                                   |
| notification | `apps/be/src/routes/notificationRoutes.ts` | Update existing query DTOs                           |
| permission   | `apps/be/src/routes/permissionRoutes.ts`   | Add query to GET /                                   |
| pomodoro     | `apps/be/src/routes/pomodoroRoutes.ts`     | Add GET / (list endpoint) with query                 |
| position     | `apps/be/src/routes/positionRoutes.ts`     | Add query to GET /                                   |
| role         | `apps/be/src/routes/roleRoutes.ts`         | Add query to GET /                                   |
| session      | `apps/be/src/routes/sessionRoutes.ts`      | Add query to GET /                                   |
| subscription | `apps/be/src/routes/subscriptionRoutes.ts` | Add GET / (list endpoint) with query                 |
| task         | `apps/be/src/routes/taskRoutes.ts`         | Add query to GET /                                   |
| team         | `apps/be/src/routes/teamRoutes.ts`         | Update existing TeamQueryDto                         |
| todo         | `apps/be/src/routes/todoRoutes.ts`         | Update existing TodoQueryDto                         |

### Phase 6: Shared Endpoint Constants

Add new endpoint constants for filtered lists where needed:

| Module       | Endpoints File                                        | Changes                                |
| ------------ | ----------------------------------------------------- | -------------------------------------- |
| auth         | `packages/shared/endpoints/auth.endpoints.ts`         | Add user list/search endpoint          |
| member       | `packages/shared/endpoints/member.endpoints.ts`       | No change needed (LIST already exists) |
| notification | `packages/shared/endpoints/notification.endpoints.ts` | No change needed                       |
| permission   | `packages/shared/endpoints/role.endpoints.ts`         | No change needed                       |
| pomodoro     | `packages/shared/endpoints/pomodoro.endpoints.ts`     | Add LIST endpoint                      |
| subscription | `packages/shared/endpoints/subscription.endpoints.ts` | Add LIST endpoint                      |
| ...          | Most already have LIST endpoints                      | Only add where missing                 |

### Phase 7: Shared Services

Update shared service methods to pass query parameters:

| Module       | Service File                                       | Changes                                      |
| ------------ | -------------------------------------------------- | -------------------------------------------- |
| auth         | `packages/shared/services/auth.service.ts`         | Add `ListUsers` method with query            |
| calendar     | `packages/shared/services/calendar.service.ts`     | Update `ListEvents` to pass all query params |
| company      | `packages/shared/services/company.service.ts`      | Add `ListCompanies` or update admins         |
| department   | `packages/shared/services/department.service.ts`   | Update `ListDepartments` with query          |
| invitation   | `packages/shared/services/invitation.service.ts`   | Update `ListInvitations` with query          |
| member       | `packages/shared/services/member.service.ts`       | Update `ListMembers` with query              |
| music        | `packages/shared/services/music.service.ts`        | Update `ListPlaylists` with query            |
| note         | `packages/shared/services/note.service.ts`         | Update `ListNotes` with query                |
| notification | `packages/shared/services/notification.service.ts` | Update methods with query                    |
| pomodoro     | `packages/shared/services/pomodoro.service.ts`     | Add `ListSessions` method                    |
| position     | `packages/shared/services/position.service.ts`     | Update `ListPositions` with query            |
| role         | `packages/shared/services/role.service.ts`         | Update `ListRoles` with query                |
| session      | `packages/shared/services/session.service.ts`      | Update `ListSession` with query              |
| subscription | `packages/shared/services/subscription.service.ts` | Add `ListSubscriptions` method               |
| task         | `packages/shared/services/task.service.ts`         | Update `ListTasks` with query                |
| team         | `packages/shared/services/team.service.ts`         | Update `ListTeams` with query                |
| todo         | `packages/shared/services/todo.service.ts`         | Update `ListTodos` with query                |

### Phase 8: Shared Types

Update type definitions where new query types are needed:

| Module | Types File                           | Changes                                         |
| ------ | ------------------------------------ | ----------------------------------------------- |
| All    | `packages/shared/types/*.ts`         | Add or update `*Query` types with filter fields |
| Shared | `packages/shared/types/api.types.ts` | May need pagination meta type updates           |

### Phase 9: Route Registration

[`apps/be/src/routes/apiRoutes.ts`](apps/be/src/routes/apiRoutes.ts) - No changes needed as existing routes already registered.

---

## Detailed Filter Support Per Module

### 1. Calendar

- **Prisma Model:** CalendarEvent
- **Current State:** Has `EventQueryDto` with month/year only
- **New Filters:** `search` (title), `status`, `startDate`/`endDate`, pagination (`page`, `limit`), `sortBy`, `sortOrder`, `createdBy`
- **Files:** dto/calendar.dto.ts, service/CalendarService.ts, controllers/CalendarController.ts, routes/calendarRoutes.ts

### 2. Company

- **Prisma Model:** Company
- **Current State:** `GET /me` returns single company, `GET /admins` for admin list
- **New Filters:** Add `search`, `status`, pagination to `listAdmins`
- **Files:** dto/company.dto.ts, service/CompanyService.ts, controllers/CompanyController.ts

### 3. Department

- **Prisma Model:** Department
- **Current State:** Already has pagination via page/limit
- **New Filters:** `search` (name), `status`, `managerId`, `startDate`/`endDate`, `sortBy`, `sortOrder`
- **Files:** dto/department.dto.ts, service/DepartmentService.ts

### 4. Invitation

- **Prisma Model:** Invitation
- **Current State:** Already has pagination
- **New Filters:** `search` (email), `status` (pending/accepted/expired), `positionId`, `startDate`/`endDate`
- **Files:** dto/invitation.dto.ts, service/InvitationService.ts

### 5. Member

- **Prisma Model:** CompanyMember
- **Current State:** Already has pagination
- **New Filters:** `search` (name/email), `status`, `positionId`, `departmentId`, `employmentTypeId`, `startDate`/`endDate`
- **Files:** dto/member.dto.ts, service/MemberService.ts, controllers/MemberController.ts

### 6. Music

- **Prisma Model:** Playlist
- **Current State:** Already has pagination
- **New Filters:** `search` (name)
- **Files:** dto/music.dto.ts, service/MusicService.ts

### 7. Note

- **Prisma Model:** Note
- **Current State:** Already has pagination
- **New Filters:** `search` (title/content), `folderId`, `startDate`/`endDate`, `sortBy`, `sortOrder`
- **Files:** dto/note.dto.ts, service/NoteService.ts

### 8. Notification

- **Prisma Model:** Notification, NotificationLog, NotificationQueue
- **Current State:** Has `NotificationLogQueryDto`, listInApp with pagination
- **New Filters:** `search`, `type`, `read` status, `startDate`/`endDate` for in-app + logs + queue
- **Files:** dto/notification.dto.ts, service/NotificationService.ts

### 9. Permission

- **Prisma Model:** Permission
- **Current State:** `GET /` returns all master permissions
- **New Filters:** `search` (module/action), `module` filter
- **Files:** dto/role.dto.ts (permission query), service/RoleService.ts

### 10. Pomodoro

- **Prisma Model:** PomodoroSession
- **Current State:** `GET /today` and `GET /statistics`, no generic list
- **New Filters:** Add `GET /` with `search`, `startDate`/`endDate`, pagination, `status` (active/completed)
- **Files:** dto/pomodoro.dto.ts, service/PomodoroService.ts, controllers/PomodoroController.ts, routes/pomodoroRoutes.ts

### 11. Position

- **Prisma Model:** Position
- **Current State:** Already has pagination
- **New Filters:** `search` (name), `level` min/max, `sortBy`, `sortOrder`
- **Files:** dto/position.dto.ts, service/PositionService.ts

### 12. Role

- **Prisma Model:** Role
- **Current State:** Already has pagination
- **New Filters:** `search` (name), `isSystem`, `sortBy`, `sortOrder`
- **Files:** dto/role.dto.ts, service/RoleService.ts

### 13. Session

- **Prisma Model:** UserSession
- **Current State:** Already has pagination
- **New Filters:** `search` (device/browser), `startDate`/`endDate`, `sortBy`, `sortOrder`
- **Files:** dto/session.dto.ts, service/SessionService.ts

### 14. Subscription

- **Prisma Model:** Subscription
- **Current State:** `GET /plans`, `GET /me`, no generic list
- **New Filters:** Add `GET /` with `search`, `status`, `planId`, `startDate`/`endDate`, pagination
- **Files:** dto/subscription.dto.ts, service/SubscriptionService.ts, controllers/SubscriptionController.ts, routes/subscriptionRoutes.ts

### 15. Task

- **Prisma Model:** Task
- **Current State:** Already has pagination
- **New Filters:** `search` (title), `statusId`, `priorityId`, `assigneeId`, `startDate`/`endDate` (due date), `reporterMemberId`, `sortBy`, `sortOrder`
- **Files:** dto/task.dto.ts, service/TaskService.ts

### 16. Team

- **Prisma Model:** Team
- **Current State:** Has `TeamQueryDto` with `departmentId`, pagination via page/limit
- **New Filters:** `search` (name), `leaderId`, `startDate`/`endDate`, `sortBy`, `sortOrder`
- **Files:** dto/team.dto.ts, service/TeamService.ts

### 17. Todo

- **Prisma Model:** Todo
- **Current State:** Has `TodoQueryDto` with `status` and `date` (today)
- **New Filters:** `search` (title), full `startDate`/`endDate` range, pagination, `sortBy`, `sortOrder`
- **Files:** dto/todo.dto.ts, service/TodoService.ts

### 18. Auth (User listing)

- **Prisma Model:** User
- **Current State:** No list endpoint
- **New Endpoint:** `GET /auth/users` with `search`, `status`, `startDate`/`endDate`, pagination, `companyId`
- **Files:** dto/auth.dto.ts (add UserQueryDto), service/AuthService.ts (add list), controllers/AuthController.ts (add list), routes/authRoutes.ts (add route)

---

## API Response Consistency

All list endpoints will follow the existing pattern:

```ts
HttpResponse(c).ok(data, meta, "Berhasil mengambil daftar ...");
```

Where `meta` is:

```ts
{
  currentPage: number,
  limit: number,
  totalData: number,
  totalPage: number
}
```

And for GET requests, `process_time` is automatically appended.

---

## Implementation Order

The implementation should proceed in this order to maintain consistency:

1. **Foundation:** Create shared filter DTO and helper utilities
2. **Core Resources:** department → position → member → role → permission → team → invitation
3. **Task Resources:** task → todo → calendar → note
4. **User Resources:** session → auth
5. **Media/Other:** music → pomodoro → notification → subscription
6. **Company:** company
7. **Shared Services:** Update all shared services and types
8. **Cleanup:** Verify all routes registered, no breaking changes

---

## Files That Will Be Modified (Complete List)

### Backend DTOs (Create/Modify)

- `apps/be/src/dto/filter.dto.ts` (CREATE - shared filter schema)
- `apps/be/src/dto/auth.dto.ts` (MODIFY - add UserQueryDto)
- `apps/be/src/dto/calendar.dto.ts` (MODIFY - extend EventQueryDto)
- `apps/be/src/dto/company.dto.ts` (MODIFY - add CompanyQueryDto)
- `apps/be/src/dto/department.dto.ts` (MODIFY - add DepartmentQueryDto)
- `apps/be/src/dto/invitation.dto.ts` (MODIFY - add InvitationQueryDto)
- `apps/be/src/dto/member.dto.ts` (MODIFY - add MemberQueryDto)
- `apps/be/src/dto/music.dto.ts` (MODIFY - add MusicQueryDto)
- `apps/be/src/dto/note.dto.ts` (MODIFY - add NoteQueryDto)
- `apps/be/src/dto/notification.dto.ts` (MODIFY - enhance NotificationLogQueryDto)
- `apps/be/src/dto/pomodoro.dto.ts` (MODIFY - add PomodoroQueryDto)
- `apps/be/src/dto/position.dto.ts` (MODIFY - add PositionQueryDto)
- `apps/be/src/dto/role.dto.ts` (MODIFY - add RoleQueryDto, PermissionQueryDto)
- `apps/be/src/dto/session.dto.ts` (MODIFY - add SessionQueryDto)
- `apps/be/src/dto/subscription.dto.ts` (MODIFY - add SubscriptionQueryDto)
- `apps/be/src/dto/task.dto.ts` (MODIFY - add TaskQueryDto)
- `apps/be/src/dto/team.dto.ts` (MODIFY - enhance TeamQueryDto)
- `apps/be/src/dto/todo.dto.ts` (MODIFY - enhance TodoQueryDto)

### Backend Services (Modify)

- `apps/be/src/service/AuthService.ts`
- `apps/be/src/service/CalendarService.ts`
- `apps/be/src/service/CompanyService.ts`
- `apps/be/src/service/DepartmentService.ts`
- `apps/be/src/service/InvitationService.ts`
- `apps/be/src/service/MemberService.ts`
- `apps/be/src/service/MusicService.ts`
- `apps/be/src/service/NoteService.ts`
- `apps/be/src/service/NotificationService.ts`
- `apps/be/src/service/PomodoroService.ts`
- `apps/be/src/service/PositionService.ts`
- `apps/be/src/service/RoleService.ts`
- `apps/be/src/service/SessionService.ts`
- `apps/be/src/service/SubscriptionService.ts`
- `apps/be/src/service/TaskService.ts`
- `apps/be/src/service/TeamService.ts`
- `apps/be/src/service/TodoService.ts`

### Backend Controllers (Modify)

- `apps/be/src/controllers/AuthController.ts` (new list method)
- `apps/be/src/controllers/CompanyController.ts` (enhance listAdmins)
- `apps/be/src/controllers/PomodoroController.ts` (new list method)
- `apps/be/src/controllers/SubscriptionController.ts` (new list method)
- All other controllers - minimal changes to pass query params

### Backend Routes (Modify)

- `apps/be/src/routes/authRoutes.ts` (new GET /users)
- `apps/be/src/routes/calendarRoutes.ts` (update query DTO)
- `apps/be/src/routes/companyRoutes.ts` (add query to admins)
- `apps/be/src/routes/departmentRoutes.ts` (add query DTO)
- `apps/be/src/routes/invitationRoutes.ts` (add query DTO)
- `apps/be/src/routes/memberRoutes.ts` (add query DTO)
- `apps/be/src/routes/musicRoutes.ts` (add query DTO)
- `apps/be/src/routes/noteRoutes.ts` (add query DTO)
- `apps/be/src/routes/notificationRoutes.ts` (update query DTOs)
- `apps/be/src/routes/permissionRoutes.ts` (add query DTO)
- `apps/be/src/routes/pomodoroRoutes.ts` (new GET /)
- `apps/be/src/routes/positionRoutes.ts` (add query DTO)
- `apps/be/src/routes/roleRoutes.ts` (add query DTO)
- `apps/be/src/routes/sessionRoutes.ts` (add query DTO)
- `apps/be/src/routes/subscriptionRoutes.ts` (new GET /)
- `apps/be/src/routes/taskRoutes.ts` (add query DTO)
- `apps/be/src/routes/teamRoutes.ts` (update query DTO)
- `apps/be/src/routes/todoRoutes.ts` (update query DTO)

### Shared Endpoints (Modify)

- `packages/shared/endpoints/auth.endpoints.ts`
- `packages/shared/endpoints/pomodoro.endpoints.ts`
- `packages/shared/endpoints/subscription.endpoints.ts`

### Shared Services (Modify)

- `packages/shared/services/auth.service.ts`
- `packages/shared/services/calendar.service.ts`
- `packages/shared/services/company.service.ts`
- `packages/shared/services/department.service.ts`
- `packages/shared/services/invitation.service.ts`
- `packages/shared/services/member.service.ts`
- `packages/shared/services/music.service.ts`
- `packages/shared/services/note.service.ts`
- `packages/shared/services/notification.service.ts`
- `packages/shared/services/pomodoro.service.ts`
- `packages/shared/services/position.service.ts`
- `packages/shared/services/role.service.ts`
- `packages/shared/services/session.service.ts`
- `packages/shared/services/subscription.service.ts`
- `packages/shared/services/task.service.ts`
- `packages/shared/services/team.service.ts`
- `packages/shared/services/todo.service.ts`

### Shared Types (Modify)

- `packages/shared/types/auth.types.ts`
- `packages/shared/types/calendar.types.ts`
- `packages/shared/types/company.types.ts`
- `packages/shared/types/department.types.ts`
- `packages/shared/types/invitation.types.ts`
- `packages/shared/types/member.types.ts`
- `packages/shared/types/music.types.ts`
- `packages/shared/types/note.types.ts`
- `packages/shared/types/notification.types.ts`
- `packages/shared/types/pomodoro.types.ts`
- `packages/shared/types/position.types.ts`
- `packages/shared/types/role.types.ts`
- `packages/shared/types/session.type.ts`
- `packages/shared/types/subscription.types.ts`
- `packages/shared/types/task.types.ts`
- `packages/shared/types/team.types.ts`
- `packages/shared/types/todo.types.ts`
