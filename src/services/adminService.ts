import { ExtendedProfile, ProfileStatus, SafetyReport, ContentRemovalRequest, AuditLogEntry, AdminStats } from '../types/admin';
import { SAMPLE_PROFILES } from '../data/mockProfiles';
import { LOCATION_DATA } from '../data/locationHierarchy';
import { Profile } from '../types';
import { enforceAdminAuthorization, isUserAdmin } from './authService';
import { sanitizeInput } from '../utils/securityUtils';

// Initial admin data seeding with the 4 published profiles
export const INITIAL_ADMIN_PROFILES: ExtendedProfile[] = SAMPLE_PROFILES.map((p) => ({
  ...p,
  status: 'published' as ProfileStatus,
  seoTitle: `${p.displayName} — Verified Companion in ${p.city}, ${p.state}`,
  seoDescription: `${p.tagline}. Discover rates, photos, and availability for ${p.displayName} in ${p.city}.`,
  internalNotes: 'Identity and high-resolution photos verified.',
}));

export const INITIAL_REPORTS: SafetyReport[] = [
  {
    id: 'rep-1',
    targetType: 'photograph',
    profileId: '2',
    profileSlug: 'chloe-monroe',
    profileName: 'Chloe Monroe',
    reporterEmail: 'client.inquiry@example.com',
    reason: 'fake_photos',
    details: 'Requested re-verification of latest portfolio upload.',
    status: 'pending',
    createdAt: '2026-10-14T14:30:00Z',
  },
  {
    id: 'rep-2',
    targetType: 'profile',
    profileId: '3',
    profileSlug: 'aria-sterling',
    profileName: 'Aria Sterling',
    reporterEmail: 'hotel.concierge@nyc.com',
    reason: 'other',
    details: 'Praise for exceptional professionalism during private dining appointment.',
    status: 'dismissed',
    resolutionNotes: 'Not a safety violation. Inquiry cleared.',
    createdAt: '2026-10-13T09:15:00Z',
  },
];

export const INITIAL_REMOVAL_REQUESTS: ContentRemovalRequest[] = [
  {
    id: 'rem-1',
    requesterName: 'Studio Rights Legal',
    requesterEmail: 'legal@studiomuse.com',
    relationship: 'copyright_holder',
    targetProfileUrl: '/profiles/chloe-monroe',
    targetProfileSlug: 'chloe-monroe',
    reason: 'Routine portfolio copyright check.',
    status: 'pending',
    createdAt: '2026-10-14T11:00:00Z',
  },
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'aud-1',
    actor: 'admin@aura-directory.com',
    action: 'profile_published',
    entityType: 'profile',
    entityId: '1',
    details: 'Published verified profile for Maya Valentina (Los Angeles, CA)',
    timestamp: '2026-10-15T10:00:00Z',
  },
  {
    id: 'aud-2',
    actor: 'admin@aura-directory.com',
    action: 'profile_published',
    entityType: 'profile',
    entityId: '2',
    details: 'Published verified profile for Chloe Monroe (Miami, FL)',
    timestamp: '2026-10-15T10:15:00Z',
  },
  {
    id: 'aud-3',
    actor: 'admin@aura-directory.com',
    action: 'profile_published',
    entityType: 'profile',
    entityId: '3',
    details: 'Published verified profile for Aria Sterling (New York City, NY)',
    timestamp: '2026-10-15T10:30:00Z',
  },
];

// Local state holders
let adminProfiles: ExtendedProfile[] = (() => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('aura_admin_profiles');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const hasOldImages = Array.isArray(parsed) && parsed.some((p: any) => 
          p.avatarUrl?.includes('unsplash.com') || p.coverUrl?.includes('unsplash.com')
        );
        const ariaProfile = Array.isArray(parsed) && parsed.find((p: any) => p.slug === 'aria-sterling');
        const hasNewDescription = ariaProfile && ariaProfile.fullDescription?.includes('Wellness4All');
        if (!hasOldImages && hasNewDescription && Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        // ignore
      }
    }
    // Save the new 4 profiles to localStorage
    try {
      localStorage.setItem('aura_admin_profiles', JSON.stringify(INITIAL_ADMIN_PROFILES));
    } catch (e) {
      // ignore
    }
  }
  return [...INITIAL_ADMIN_PROFILES];
})();

let safetyReports: SafetyReport[] = [...INITIAL_REPORTS];
let removalRequests: ContentRemovalRequest[] = [...INITIAL_REMOVAL_REQUESTS];
let auditLogs: AuditLogEntry[] = [...INITIAL_AUDIT_LOGS];

// Admin Auth Helper (Disabled)
export function checkIsAdminAuthenticated(): boolean {
  return false;
}

export function loginAdmin(_passcode: string): boolean {
  return false;
}

export function logoutAdmin(): void {
  sessionStorage.removeItem('aura_admin_session');
}

// Audit Log Helper
export function recordAuditLog(
  action: AuditLogEntry['action'],
  entityType: AuditLogEntry['entityType'],
  entityId: string,
  details: string
) {
  const newLog: AuditLogEntry = {
    id: `aud-${Date.now()}`,
    actor: 'admin@aura-directory.com',
    action,
    entityType,
    entityId,
    details,
    timestamp: new Date().toISOString(),
  };
  auditLogs = [newLog, ...auditLogs];
}

// Admin Stats
export function getAdminStats(): AdminStats {
  if (!isUserAdmin()) {
    return {
      publishedCount: 0,
      draftCount: 0,
      pendingCount: 0,
      approvedCount: 0,
      rejectedCount: 0,
      suspendedCount: 0,
      removedCount: 0,
      totalProfiles: 0,
      pendingReportsCount: 0,
      removalRequestsCount: 0,
      totalLocationsCount: 0,
    };
  }

  const publishedCount = adminProfiles.filter((p) => p.status === 'published').length;
  const draftCount = adminProfiles.filter((p) => p.status === 'draft').length;
  const pendingCount = adminProfiles.filter((p) => p.status === 'pending').length;
  const approvedCount = adminProfiles.filter((p) => p.status === 'approved').length;
  const rejectedCount = adminProfiles.filter((p) => p.status === 'rejected').length;
  const suspendedCount = adminProfiles.filter((p) => p.status === 'suspended').length;
  const removedCount = adminProfiles.filter((p) => p.status === 'removed').length;
  const pendingReportsCount = safetyReports.filter((r) => r.status === 'pending').length;
  const removalRequestsCount = removalRequests.filter((r) => r.status === 'pending').length;

  let totalLocationsCount = 0;
  LOCATION_DATA.forEach((c) => {
    c.states.forEach((s) => {
      totalLocationsCount += s.cities.length;
    });
  });

  return {
    publishedCount,
    draftCount,
    pendingCount,
    approvedCount,
    rejectedCount,
    suspendedCount,
    removedCount,
    totalProfiles: adminProfiles.length,
    pendingReportsCount,
    removalRequestsCount,
    totalLocationsCount,
  };
}

// Profile CRUD
export function getAdminProfiles(): ExtendedProfile[] {
  if (!isUserAdmin()) return [];
  return adminProfiles;
}

export function getAdminProfileById(id: string): ExtendedProfile | undefined {
  if (!isUserAdmin()) return undefined;
  return adminProfiles.find((p) => p.id === id || p.slug === id);
}

export function saveAdminProfile(profile: ExtendedProfile): ExtendedProfile {
  enforceAdminAuthorization('saveAdminProfile');
  const sanitizedProfile: ExtendedProfile = {
    ...profile,
    displayName: sanitizeInput(profile.displayName),
    tagline: sanitizeInput(profile.tagline),
    bioSnippet: sanitizeInput(profile.bioSnippet),
    fullDescription: sanitizeInput(profile.fullDescription),
  };

  const existingIdx = adminProfiles.findIndex((p) => p.id === sanitizedProfile.id);
  let result: ExtendedProfile;
  if (existingIdx >= 0) {
    adminProfiles[existingIdx] = sanitizedProfile;
    recordAuditLog('profile_updated', 'profile', sanitizedProfile.id, `Updated profile for ${sanitizedProfile.displayName} (${sanitizedProfile.status})`);
    result = sanitizedProfile;
  } else {
    const created = {
      ...sanitizedProfile,
      id: sanitizedProfile.id || `prof-${Date.now()}`,
    };
    adminProfiles = [created, ...adminProfiles];
    recordAuditLog('profile_created', 'profile', created.id, `Created new profile for ${created.displayName} (${created.status})`);
    result = created;
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem('aura_admin_profiles', JSON.stringify(adminProfiles));
  }
  return result;
}

export function updateProfileStatus(id: string, status: ProfileStatus, notes?: string): boolean {
  enforceAdminAuthorization('updateProfileStatus');
  const profile = adminProfiles.find((p) => p.id === id);
  if (!profile) return false;

  profile.status = status;
  profile.isPublished = status === 'published';
  if (notes) {
    profile.moderationNotes = sanitizeInput(notes);
    profile.moderatedAt = new Date().toISOString();
  }

  const actionMap: Record<ProfileStatus, AuditLogEntry['action']> = {
    published: 'profile_published',
    draft: 'profile_unpublished',
    pending: 'profile_updated',
    suspended: 'profile_suspended',
    approved: 'profile_approved',
    rejected: 'profile_rejected',
    removed: 'profile_removed',
  };

  recordAuditLog(
    actionMap[status] || 'profile_updated',
    'profile',
    id,
    `Changed status of ${profile.displayName} to "${status.toUpperCase()}"${notes ? `: ${notes}` : ''}`
  );

  if (typeof window !== 'undefined') {
    localStorage.setItem('aura_admin_profiles', JSON.stringify(adminProfiles));
  }
  return true;
}

export function executeReportAction(
  reportId: string,
  action: 'approve' | 'reject' | 'suspend' | 'remove' | 'changes_requested' | 'dismiss',
  notes?: string
): boolean {
  enforceAdminAuthorization('executeReportAction');
  const report = safetyReports.find((r) => r.id === reportId);
  if (!report) return false;

  report.status = action === 'dismiss' ? 'dismissed' : 'action_taken';
  if (notes) report.resolutionNotes = sanitizeInput(notes);
  report.resolvedAt = new Date().toISOString();

  recordAuditLog('report_resolved', 'report', reportId, `Report #${reportId} action executed: ${action}`);
  return true;
}

export function deleteAdminProfile(id: string): boolean {
  enforceAdminAuthorization('deleteAdminProfile');
  const profile = adminProfiles.find((p) => p.id === id);
  if (!profile) return false;

  adminProfiles = adminProfiles.filter((p) => p.id !== id);
  recordAuditLog('profile_deleted', 'profile', id, `Permanently removed profile for ${profile.displayName}`);

  if (typeof window !== 'undefined') {
    localStorage.setItem('aura_admin_profiles', JSON.stringify(adminProfiles));
  }
  return true;
}

// Reports CRUD
export function getSafetyReports(): SafetyReport[] {
  if (!isUserAdmin()) return [];
  return safetyReports;
}

export function updateReportStatus(reportId: string, status: SafetyReport['status'], notes?: string): boolean {
  enforceAdminAuthorization('updateReportStatus');
  const report = safetyReports.find((r) => r.id === reportId);
  if (!report) return false;

  report.status = status;
  if (notes) report.resolutionNotes = sanitizeInput(notes);

  recordAuditLog('report_resolved', 'report', reportId, `Updated report #${reportId} status to "${status}"`);
  return true;
}

// Content Removal CRUD
export function getRemovalRequests(): ContentRemovalRequest[] {
  if (!isUserAdmin()) return [];
  return removalRequests;
}

export function updateRemovalRequest(requestId: string, status: ContentRemovalRequest['status']): boolean {
  enforceAdminAuthorization('updateRemovalRequest');
  const req = removalRequests.find((r) => r.id === requestId);
  if (!req) return false;

  req.status = status;
  recordAuditLog('content_removed', 'removal_request', requestId, `Content removal request #${requestId} marked as "${status}"`);
  return true;
}

// Audit Logs
export function getAuditLogs(): AuditLogEntry[] {
  if (!isUserAdmin()) return [];
  return auditLogs;
}
