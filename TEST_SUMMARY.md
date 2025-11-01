# Unit Tests Summary

This document summarizes the unit tests created for the CustomRoleGuard and ProgramsController.

## Test Files Created

1. **`src/modules/auth/keycloak/guard/auth.guard.spec.ts`** - 12 tests
2. **`src/modules/academics/programs/programs.controller.spec.ts`** - 8 tests

**Total: 20 tests, all passing ✓**

---

## CustomRoleGuard Tests (auth.guard.spec.ts)

### Test Case 1: No User Found in Request
**Test:** `should throw UnauthorizedException when no user is found in the request`

- **Purpose:** Verifies that the guard denies access when no user object exists in the request
- **Expected Behavior:** Throws `UnauthorizedException` with message "No valid user found in request."
- **Status:** ✓ Passing

---

### Test Case 2: Extract and Combine Realm and Client Roles
**Tests:**
1. `should correctly extract and combine both realm and client roles for authorization`
2. `should handle missing realm_access and resource_access gracefully`

- **Purpose:** Verifies that the guard correctly extracts roles from both `realm_access.roles` and `resource_access[client].roles`
- **Expected Behavior:**
  - Realm roles are extracted directly (e.g., `['admin', 'user']`)
  - Client roles are prefixed with client name (e.g., `['materiap-backend:view-profile']`)
  - All roles are combined and deduplicated
  - Missing role properties are handled gracefully (defaults to empty arrays)
- **Status:** ✓ Passing (2 tests)

---

### Test Case 3: Grant Access with Required Roles
**Tests:**
1. `should grant access when the user has a required realm role for a module`
2. `should grant access when the user has a required client role for a module`
3. `should grant access when user has one of multiple required roles`

- **Purpose:** Verifies that users with appropriate roles can access protected modules
- **Expected Behavior:**
  - Users with matching realm roles are granted access
  - Users with matching client roles are granted access
  - Users need only ONE of the required roles (OR logic)
- **Example:**
  - Module: `programs` requires `['admin']`
  - User with role `admin` → Access Granted ✓
  - Module: `users` requires `['admin', 'manager']`
  - User with role `manager` → Access Granted ✓
- **Status:** ✓ Passing (3 tests)

---

### Test Case 4: Deny Access Without Required Roles
**Tests:**
1. `should throw ForbiddenException when the user does not have any required realm roles`
2. `should throw ForbiddenException when the user does not have any required client roles`
3. `should deny access when user has no roles at all`

- **Purpose:** Verifies that users without appropriate roles are denied access
- **Expected Behavior:**
  - Throws `ForbiddenException` with message "Access denied. Required roles: [role list]"
  - Works for both realm and client role scenarios
  - Handles users with no roles
- **Example:**
  - Module: `programs` requires `['realm:admin']`
  - User with role `user` → Access Denied (403) ✗
- **Status:** ✓ Passing (3 tests)

---

### Test Case 5: Module Without Role Policy
**Test:** `should grant access to modules without defined role policies`

- **Purpose:** Verifies that modules without defined policies in `RolePolicies` are accessible to all authenticated users
- **Expected Behavior:**
  - Returns `true` (access granted)
  - Logs: `[Access Allowed] No policy for module: {module-name}`
- **Example:**
  - Module: `undefined-module` (not in RolePolicies)
  - Any authenticated user → Access Granted ✓
- **Status:** ✓ Passing

---

### Edge Cases
**Tests:**
1. `should handle paths without /api prefix correctly`
2. `should deduplicate roles from realm and client access`

- **Purpose:** Tests edge cases and proper role handling
- **Expected Behavior:**
  - Paths like `/programs/list` and `/api/programs/list` both extract module name correctly
  - Roles are properly deduplicated using `Set`
  - Realm role `admin` and client role `client:admin` are treated as separate roles
- **Status:** ✓ Passing (2 tests)

---

## ProgramsController Tests (programs.controller.spec.ts)

### Test Case 5: /programs/:id Endpoint Accessibility
**Tests:**
1. `should be accessible without specific role requirements after @Roles decorator was commented out`
2. `should verify @Roles decorator is not present on findOne method`
3. `should allow any authenticated user to access /programs/:id endpoint`

- **Purpose:** Verifies that the `/programs/:id` endpoint is now accessible without the `@Roles` decorator
- **Context:** The decorator `@Roles({ roles: ['realm:admin'] })` was commented out on line 31 of `programs.controller.ts`
- **Expected Behavior:**
  - The controller method can be called directly without role restrictions
  - Metadata check confirms no roles decorator is present
  - Users with different role sets (admin, user, student, or no roles) can all access the endpoint
  - **Note:** In runtime, the global `CustomRoleGuard` still applies, which checks `RolePolicies['programs']`
- **Status:** ✓ Passing (3 tests)

---

### Additional ProgramsController Tests
**Tests:**
1. `should retrieve all programs`
2. `should create a new program`
3. `should update a program`
4. `should delete a program`
5. `should rely on CustomRoleGuard for programs module authorization`

- **Purpose:** Ensures all controller methods work correctly
- **Status:** ✓ Passing (5 tests)

---

## How to Run Tests

### Run all tests:
```bash
npm test
```

### Run specific test file:
```bash
npm test -- auth.guard.spec.ts
npm test -- programs.controller.spec.ts
```

### Run both test files:
```bash
npm test -- auth.guard.spec.ts programs.controller.spec.ts
```

### Run with coverage:
```bash
npm run test:cov
```

---

## Key Insights

### Role Policy Format
The `RolePolicies` object in `role-policy.ts` uses the format `realm:role` or `client:role`:
```typescript
export const RolePolicies = {
  programs: ['realm:admin'],
  users: ['realm:admin', 'realm:manager'],
  schools: ['realm:admin'],
  // ...
};
```

### Role Extraction Logic
The `CustomRoleGuard` extracts roles as follows:
- **Realm roles:** Direct from `user.realm_access.roles` (e.g., `['admin', 'user']`)
- **Client roles:** From `user.resource_access[client].roles` with prefix (e.g., `['materiap-backend:view-profile']`)

### Authorization Flow
1. **AuthGuard** (from nest-keycloak-connect) validates the JWT token
2. **ResourceGuard** (from nest-keycloak-connect) checks resource permissions
3. **CustomRoleGuard** checks module-level role requirements from `RolePolicies`
4. **@Roles decorator** (if present) adds method-level role requirements

When `@Roles` decorator is commented out, the guard chain still applies, but method-level requirements are removed.

---

## Test Coverage Summary

✓ **User authentication validation** (UnauthorizedException)
✓ **Role extraction and combination** (realm + client roles)
✓ **Role-based access control** (grant/deny based on RolePolicies)
✓ **Module without policy** (default allow)
✓ **Decorator removal verification** (programs/:id endpoint)
✓ **Edge cases** (path parsing, role deduplication)

All 20 tests passing! 🎉
