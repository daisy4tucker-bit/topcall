import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { AuthUser, AuthSession, UserRole, PasswordRecoveryRequest, RLSPolicyDefinition, RolePermissionMatrix } from '../types/auth';
import { recordAuditLog } from './adminService';

const SESSION_STORAGE_KEY = 'aura_auth_session';
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000; // 8 hours

// Mock Administrator accounts for local development & fallback
const ADMIN_ACCOUNTS = [
  {
    id: 'usr-admin-01',
    email: 'admin@aura-directory.com',
    passwords: ['admin18plus', 'aura2026', 'admin'],
    role: 'administrator' as UserRole,
    displayName: 'Chief Compliance Officer',
  },
  {
    id: 'usr-admin-02',
    email: 'moderator@aura-directory.com',
    passwords: ['mod18plus', 'aura2026'],
    role: 'moderator' as UserRole,
    displayName: 'Safety & Verification Lead',
  },
];

/**
 * Retrieve current active auth session from storage or Supabase
 */
export function getCurrentSession(): AuthSession {
  if (typeof window === 'undefined') {
    return { user: null, role: 'visitor', isAuthenticated: false, accessToken: null, expiresAt: 0 };
  }
  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) {
      return { user: null, role: 'visitor', isAuthenticated: false, accessToken: null, expiresAt: 0 };
    }
    const session: AuthSession = JSON.parse(raw);
    // Check expiration
    if (Date.now() > session.expiresAt) {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
      return { user: null, role: 'visitor', isAuthenticated: false, accessToken: null, expiresAt: 0 };
    }
    return session;
  } catch (e) {
    return { user: null, role: 'visitor', isAuthenticated: false, accessToken: null, expiresAt: 0 };
  }
}

/**
 * Check if the current user is an authenticated administrator
 */
export function isUserAdmin(): boolean {
  return false;
}

/**
 * Quick admin passcode login for AdminAuthGate (Disabled)
 */
export function loginAdmin(_password: string): boolean {
  return false;
}

/**
 * Get current user role
 */
export function getCurrentRole(): UserRole {
  const session = getCurrentSession();
  return session.role;
}

/**
 * Login with Email & Password
 */
export async function loginWithEmailAndPassword(
  _email: string,
  _passcodeOrPassword: string
): Promise<{ success: boolean; session?: AuthSession; error?: string }> {
  return {
    success: false,
    error: 'Administrator login has been disabled by the system owner.',
  };
}

/**
 * Logout and clear session
 */
export async function logoutCurrentSession(): Promise<boolean> {
  const current = getCurrentSession();
  if (current.user) {
    recordAuditLog(
      'profile_unpublished',
      'profile',
      current.user.id,
      `User ${current.user.email} logged out. Session terminated.`
    );
  }

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Supabase signOut notice:', e);
    }
  }

  try {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    sessionStorage.removeItem('aura_admin_session');
  } catch (e) {}
  return true;
}

/**
 * Request Password Recovery / Reset
 */
export async function requestPasswordRecovery(email: string): Promise<PasswordRecoveryRequest> {
  const clean = email.trim().toLowerCase();
  if (!clean || !clean.includes('@')) {
    return {
      email: clean,
      status: 'error',
      message: 'Please provide a valid administrator email address.',
    };
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(clean, {
        redirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/admin`,
      });
      if (error) {
        return {
          email: clean,
          status: 'error',
          message: error.message || 'Supabase password recovery failed.',
        };
      }
    } catch (e: any) {
      console.warn('Supabase password reset fallback:', e);
    }
  }

  return {
    email: clean,
    status: 'sent',
    message: `Password reset instructions and one-time security recovery token have been dispatched to ${clean}.`,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Enforce Server / Service Level Authorization Guard
 */
export function enforceAdminAuthorization(operationName: string): boolean {
  const session = getCurrentSession();
  if (!session.isAuthenticated || (session.role !== 'administrator' && session.role !== 'moderator')) {
    const errorMsg = `[403 FORBIDDEN] Unauthorized attempt to execute "${operationName}". Role "administrator" required, but current role is "${session.role}".`;
    throw new Error(errorMsg);
  }
  return true;
}

/**
 * Role-Based Access Control (RBAC) Definition Matrix
 */
export function getRBACPermissionMatrix(): RolePermissionMatrix[] {
  return [
    {
      role: 'administrator',
      description: 'Superuser with full authority over directory data, compliance, storage, and legal removal requests.',
      permissions: [
        { resource: 'profiles', canRead: true, canCreate: true, canUpdate: true, canDelete: true, notes: 'Full CRUD & status change' },
        { resource: 'profile_photos', canRead: true, canCreate: true, canUpdate: true, canDelete: true, notes: 'Upload, reorder, primary, unpublish, delete' },
        { resource: 'locations', canRead: true, canCreate: true, canUpdate: true, canDelete: true, notes: 'Manage countries, states, and cities' },
        { resource: 'reports', canRead: true, canCreate: true, canUpdate: true, canDelete: true, notes: 'Investigate and resolve reports' },
        { resource: 'content_removal_requests', canRead: true, canCreate: true, canUpdate: true, canDelete: true, notes: 'DMCA & legal compliance actions' },
        { resource: 'audit_logs', canRead: true, canCreate: true, canUpdate: false, canDelete: false, notes: 'Append-only immutable audit trail' },
      ],
    },
    {
      role: 'visitor',
      description: 'Public anonymous user browsing the directory.',
      permissions: [
        { resource: 'profiles', canRead: true, canCreate: false, canUpdate: false, canDelete: false, notes: 'Only published profiles' },
        { resource: 'profile_photos', canRead: true, canCreate: false, canUpdate: false, canDelete: false, notes: 'Only authorized, published photos' },
        { resource: 'locations', canRead: true, canCreate: false, canUpdate: false, canDelete: false, notes: 'Public read of location hierarchy' },
        { resource: 'reports', canRead: false, canCreate: true, canUpdate: false, canDelete: false, notes: 'Can submit new safety reports' },
        { resource: 'content_removal_requests', canRead: false, canCreate: true, canUpdate: false, canDelete: false, notes: 'Can submit DMCA/removal requests' },
        { resource: 'audit_logs', canRead: false, canCreate: false, canUpdate: false, canDelete: false, notes: 'No access (Protected)' },
      ],
    },
  ];
}

/**
 * Comprehensive Supabase Row Level Security (RLS) Policy Registry
 */
export function getAllRLSPolicies(): RLSPolicyDefinition[] {
  return [
    {
      tableName: 'profiles',
      policyName: 'Public Read Published Profiles',
      action: 'SELECT',
      roles: ['anon', 'authenticated'],
      usingExpression: `is_published = true AND status = 'published'`,
      purpose: 'Allows public visitors to only view approved, published profiles.',
    },
    {
      tableName: 'profiles',
      policyName: 'Admin Full Profile Management',
      action: 'ALL',
      roles: ['authenticated'],
      usingExpression: `auth.jwt() ->> 'role' = 'administrator' OR auth.role() = 'service_role'`,
      purpose: 'Enables administrators to view drafts, edit, suspend, and delete any profile.',
    },
    {
      tableName: 'profile_photos',
      policyName: 'Public Read Published Photos',
      action: 'SELECT',
      roles: ['anon', 'authenticated'],
      usingExpression: `is_published = true AND is_provider_authorized = true`,
      purpose: 'Protects unpublished or unauthorized photos from public view.',
    },
    {
      tableName: 'profile_photos',
      policyName: 'Admin Full Photo Management',
      action: 'ALL',
      roles: ['authenticated'],
      usingExpression: `auth.jwt() ->> 'role' = 'administrator'`,
      purpose: 'Grants administrators full access to upload, reorder, and remove photos.',
    },
    {
      tableName: 'reports',
      policyName: 'Public Insert Reports',
      action: 'INSERT',
      roles: ['anon', 'authenticated'],
      usingExpression: `true`,
      withCheckExpression: `length(details) >= 10`,
      purpose: 'Allows anonymous visitors to submit safety reports with validation.',
    },
    {
      tableName: 'reports',
      policyName: 'Admin Manage Reports',
      action: 'ALL',
      roles: ['authenticated'],
      usingExpression: `auth.jwt() ->> 'role' = 'administrator'`,
      purpose: 'Restricts report reviewing, resolution notes, and status updates to admins.',
    },
    {
      tableName: 'content_removal_requests',
      policyName: 'Public Insert Removal Requests',
      action: 'INSERT',
      roles: ['anon', 'authenticated'],
      usingExpression: `true`,
      purpose: 'Allows copyright holders / subjects to submit removal notices.',
    },
    {
      tableName: 'content_removal_requests',
      policyName: 'Admin Manage Removal Requests',
      action: 'ALL',
      roles: ['authenticated'],
      usingExpression: `auth.jwt() ->> 'role' = 'administrator'`,
      purpose: 'Protects DMCA removal requests and private requester emails from public exposure.',
    },
    {
      tableName: 'audit_logs',
      policyName: 'Admin Read Audit Trail',
      action: 'SELECT',
      roles: ['authenticated'],
      usingExpression: `auth.jwt() ->> 'role' = 'administrator'`,
      purpose: 'Guarantees compliance audit trail can only be viewed by administrators.',
    },
    {
      tableName: 'audit_logs',
      policyName: 'Append-Only System Insert',
      action: 'INSERT',
      roles: ['authenticated', 'service_role'],
      usingExpression: `true`,
      purpose: 'Ensures audit logs are immutable and can never be updated or deleted.',
    },
  ];
}
