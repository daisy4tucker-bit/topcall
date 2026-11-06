export type UserRole = 'administrator' | 'visitor' | 'moderator';

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  displayName: string;
  lastLogin: string;
  sessionToken: string;
  sessionExpiresAt: string;
}

export interface AuthSession {
  user: AuthUser | null;
  role: UserRole;
  isAuthenticated: boolean;
  accessToken: string | null;
  expiresAt: number;
}

export interface PasswordRecoveryRequest {
  email: string;
  status: 'idle' | 'sending' | 'sent' | 'error';
  message?: string;
  timestamp?: string;
}

export interface RLSPolicyDefinition {
  tableName: string;
  policyName: string;
  action: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE' | 'ALL';
  roles: string[];
  usingExpression: string;
  withCheckExpression?: string;
  purpose: string;
}

export interface RolePermissionMatrix {
  role: UserRole;
  description: string;
  permissions: {
    resource: string;
    canRead: boolean;
    canCreate: boolean;
    canUpdate: boolean;
    canDelete: boolean;
    notes: string;
  }[];
}
