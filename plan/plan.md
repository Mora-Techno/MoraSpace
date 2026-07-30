Markdown

# TASK: Implement Dual-Layer Authorization (Platform Role & Company Role)

## 1. CONTEXT & ARCHITECTURAL PHILOSOPHY

We are refactoring our SaaS backend authorization into a **Dual-Layer Authorization System**:

- **Layer 1: Platform Role (Global/SaaS Level)** -> Governs platform-wide internal access (e.g., Developer Console, global monitoring, approving `TrackCatalog` submissions). This is attached directly to the `User` model.
- **Layer 2: Company Role (Tenant/Workspace Level)** -> Governs access within a specific company (`Company -> Role -> MemberRole -> CompanyMember`).

**CRITICAL RULE:** A Platform Developer/Super Admin must be able to access global internal endpoints WITHOUT needing a `companyId` or becoming a `CompanyMember`. Do NOT mix Platform Roles into the `Role` or `CompanyMember` tables!

---

## 2. PRISMA SCHEMA REQUIREMENTS

Modify `prisma/schema.prisma` to introduce the global platform role on the `User` model.

1. Create the new enum:

```prisma
enum PlatformRole {
  MEMBER
  DEVELOPER
  SUPER_ADMIN
}

    Add the platformRole field to the existing User model with a default value of USER:

Cuplikan kode

model User {
  id           String       @id @default(uuid())
  email        String       @unique
  passwordHash String       @map("password_hash")
  platformRole PlatformRole @default(USER) // <-- ADD THIS FIELD
  // ... keep all existing fields and relations intact
}

Do NOT alter existing Company, Role, MemberRole, or CompanyMember models.
3. MIGRATION & DEFAULT VALUES

    Generate and apply the Prisma migration.

    Ensure that all existing user records in the database automatically receive platformRole = USER as their default value.

4. AUTHENTICATION & JWT PAYLOAD UPDATE

Update the authentication/login service:

    When generating the JWT Access Token (and UserSession data), include platformRole in the token payload.

    Example JWT Payload structure:

JSON

{
  "sub": "user-uuid-here",
  "email": "user@example.com",
  "platformRole": "DEVELOPER"
}

    Ensure the login flow works seamlessly for regular users (USER) without requiring any company selection at the authentication stage.

5. MIDDLEWARE / GUARD IMPLEMENTATION

Create a new middleware/guard named requirePlatformRole specifically for Global Authorization.

Requirements for requirePlatformRole(allowedRoles: PlatformRole[]):

    Extract and verify the JWT from the authorization header.

    Read the platformRole from the decoded token.

    Check if the user's platformRole is included in the allowedRoles array.

    If valid, proceed to the handler (next()).

    If invalid (e.g., a USER trying to access a DEVELOPER endpoint), immediately return an HTTP 403 Forbidden error with a clear message: "Access denied. Global platform authorization required."

    Important: This middleware must NEVER query or check CompanyMember, companyId, or Role.

Note: Do NOT delete or modify any existing company-level middleware (e.g., verifyToken, requireRole, requirePermission). Keep them completely separate.
6. REAL-WORLD IMPLEMENTATION: TRACK CATALOG APPROVAL

To prove and test this architecture, implement/update the endpoint for reviewing and approving music tracks (TrackCatalog). According to our schema, TrackCatalog has status: TrackStatus (PENDING, APPROVED, REJECTED), rejectionReason, and reviewedAt.

Create an internal developer endpoint protected by our new global layer:

    Route: PATCH /api/internal/track-catalogs/:id/review (or adjust route prefix to match current project standards)

    Middleware: requirePlatformRole(['DEVELOPER', 'SUPER_ADMIN'])

    Request Body:

JSON
```
