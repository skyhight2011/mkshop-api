# Authentication System Documentation

## Overview

This is a scalable authentication system built with NestJS and MongoDB that supports:
- **Role-based access control (RBAC)**
- **Multi-provider authentication** (Local, Google, Facebook, GitHub)
- **Session management**
- **Permission-based authorization**
- **Scalable architecture** for future growth

## Database Schemas

### 1. User Schema (`src/schemas/user.schema.ts`)
Basic user information that can be extended for future features:
```typescript
{
  email: string;           // Required, unique
  name: string;           // Required
  age?: number;           // Optional
  isActive: boolean;      // Default: true
  authId?: ObjectId;      // Reference to Auth
  avatar?: string;        // Profile picture
  phone?: string;         // Phone number
  emailVerifiedAt?: Date; // Email verification
  lastSeenAt?: Date;      // Last activity
}
```

### 2. Role Schema (`src/schemas/role.schema.ts`)
Defines permission levels and roles:
```typescript
{
  name: string;                    // Required, unique
  level: RoleLevel;               // USER, MODERATOR, ADMIN, SUPER_ADMIN
  permissions: string[];          // Array of permission strings
  isActive: boolean;              // Default: true
  description?: string;           // Optional description
}
```

### 3. Auth Schema (`src/schemas/auth.schema.ts`)
Authentication and authorization data:
```typescript
{
  userId: ObjectId;               // Reference to User
  email: string;                  // Required, unique
  passwordHash: string;           // Hashed password
  refreshTokens: string[];        // Multiple refresh tokens
  roleId: ObjectId;              // Reference to Role
  provider: AuthProvider;         // LOCAL, GOOGLE, FACEBOOK, GITHUB
  status: AuthStatus;            // ACTIVE, SUSPENDED, PENDING, BANNED
  lastLoginAt?: Date;            // Last login timestamp
  passwordChangedAt?: Date;      // Password change tracking
  emailVerifiedAt?: Date;        // Email verification
  loginAttempts: number;         // Failed login attempts
  lockedUntil?: Date;            // Account lockout
  permissions: string[];         // Individual permissions
  isActive: boolean;             // Default: true
}
```

### 4. Session Schema (`src/schemas/session.schema.ts`)
Session management and tracking:
```typescript
{
  authId: ObjectId;              // Reference to Auth
  sessionToken: string;          // Unique session token
  refreshToken: string;          // Refresh token
  expiresAt: Date;               // Session expiration
  status: SessionStatus;         // ACTIVE, EXPIRED, REVOKED
  userAgent?: string;            // Browser/device info
  ipAddress?: string;            // Client IP
  lastActivityAt?: Date;         // Last activity
  isActive: boolean;             // Default: true
}
```

## API Endpoints

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe",
  "provider": "local"  // Optional: local, google, facebook, github
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}

Response:
{
  "auth": { /* auth object */ },
  "session": { /* session object */ },
  "accessToken": "access_token_here",
  "refreshToken": "refresh_token_here"
}
```

#### Logout
```http
POST /auth/logout
Content-Type: application/json

{
  "sessionToken": "session_token_here"
}
```

#### Get Profile
```http
GET /auth/profile
Authorization: Bearer <access_token>
```

### Role Management

#### Get All Roles
```http
GET /auth/roles
```

#### Check Permission
```http
POST /auth/permissions/check
Content-Type: application/json

{
  "authId": "auth_id_here",
  "permission": "user:read"
}
```

## Role Levels

The system supports 4 role levels with increasing permissions:

1. **USER** - Basic user permissions
2. **MODERATOR** - Can moderate content and users
3. **ADMIN** - Full administrative access
4. **SUPER_ADMIN** - System-level access

## Permission System

### Granular Permissions
Permissions are stored as strings and can be:
- **Role-based**: Applied to all users with that role
- **Individual**: Applied to specific users

### Example Permissions
```typescript
const permissions = [
  'user:read',
  'user:write',
  'user:delete',
  'admin:manage_users',
  'admin:manage_roles',
  'content:moderate',
  'system:configure'
];
```

## Scalability Features

### 1. Multi-Provider Authentication
- **Local**: Email/password authentication
- **OAuth**: Google, Facebook, GitHub integration ready
- **Extensible**: Easy to add new providers

### 2. Session Management
- **Multiple sessions**: Users can be logged in on multiple devices
- **Session tracking**: Monitor user activity and security
- **Automatic cleanup**: Expired sessions are handled

### 3. Security Features
- **Account lockout**: After failed login attempts
- **Password change tracking**: Monitor password security
- **Email verification**: Optional email verification
- **Status management**: Active, suspended, pending, banned

### 4. Permission Inheritance
- **Role permissions**: Inherited by all users with that role
- **Individual permissions**: Override or extend role permissions
- **Hierarchical roles**: Higher levels inherit lower level permissions

## Future Extensions

### Easy to Add:
1. **JWT Integration**: Replace simple tokens with JWT
2. **Two-Factor Authentication**: Add 2FA support
3. **OAuth Providers**: Integrate more social logins
4. **API Rate Limiting**: Add rate limiting per user/role
5. **Audit Logging**: Track all authentication events
6. **Password Policies**: Enforce password complexity
7. **Email Templates**: Customizable email notifications
8. **Webhook Support**: Notify external systems of auth events

### Database Indexes
```javascript
// Recommended indexes for performance
db.auths.createIndex({ "email": 1 });
db.auths.createIndex({ "userId": 1 });
db.auths.createIndex({ "status": 1 });
db.sessions.createIndex({ "sessionToken": 1 });
db.sessions.createIndex({ "authId": 1 });
db.sessions.createIndex({ "expiresAt": 1 });
db.roles.createIndex({ "name": 1 });
db.roles.createIndex({ "level": 1 });
```

## Usage Examples

### Creating a New Role
```typescript
const moderatorRole = await roleService.create({
  name: 'moderator',
  level: RoleLevel.MODERATOR,
  permissions: ['content:moderate', 'user:read', 'user:update'],
  description: 'Can moderate content and manage users'
});
```

### Checking Permissions
```typescript
const hasPermission = await authService.hasPermission(
  authId,
  'user:delete'
);
```

### Managing User Sessions
```typescript
// Create new session
const session = await authService.createSession(authId);

// Validate session
const validSession = await authService.validateSession(sessionToken);

// Logout
await authService.logout(sessionToken);
```

This authentication system is designed to scale with your application's needs while maintaining security and flexibility. 