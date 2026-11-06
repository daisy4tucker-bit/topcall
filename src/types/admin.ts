import { Profile } from './index';

export type ProfileStatus =
  | 'draft'
  | 'pending'
  | 'approved'
  | 'published'
  | 'rejected'
  | 'suspended'
  | 'removed';

export interface ExtendedProfile extends Profile {
  status: ProfileStatus;
  isPublished?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  internalNotes?: string;
  moderationNotes?: string;
  moderatedAt?: string;
  moderatedBy?: string;
  rejectionReason?: string;
  changesRequestedNotes?: string;
}

export interface AdminStats {
  publishedCount: number;
  draftCount: number;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
  suspendedCount: number;
  removedCount: number;
  totalProfiles: number;
  pendingReportsCount: number;
  removalRequestsCount: number;
  totalLocationsCount: number;
}

export type ReportTargetType = 'profile' | 'photograph' | 'review' | 'other_content';

export interface SafetyReport {
  id: string;
  targetType: ReportTargetType;
  profileId?: string;
  profileSlug?: string;
  profileName?: string;
  photoId?: string;
  photoUrl?: string;
  reviewId?: string;
  contentUrl?: string;
  reporterEmail?: string;
  reason:
    | 'underage_suspicion'
    | 'fake_photos'
    | 'impersonation'
    | 'harassment'
    | 'commercial_spam'
    | 'prohibited_services'
    | 'copyright_infringement'
    | 'other';
  details: string;
  status: 'pending' | 'investigating' | 'action_taken' | 'changes_requested' | 'dismissed';
  moderatorAction?: 'approved' | 'rejected' | 'suspended' | 'removed' | 'changes_requested' | 'dismissed';
  resolutionNotes?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  createdAt: string;
}

export interface ContentRemovalRequest {
  id: string;
  requesterName: string;
  requesterEmail: string;
  relationship: 'subject_in_photo' | 'copyright_holder' | 'legal_representative';
  targetProfileUrl: string;
  targetProfileSlug: string;
  reason: string;
  status: 'pending' | 'verified' | 'removed' | 'rejected';
  resolutionNotes?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  createdAt: string;
}

export interface AuditLogEntry {
  id: string;
  actor: string; // e.g. "admin@aura-directory.com"
  action:
    | 'profile_created'
    | 'profile_updated'
    | 'profile_published'
    | 'profile_unpublished'
    | 'profile_approved'
    | 'profile_rejected'
    | 'profile_suspended'
    | 'profile_removed'
    | 'profile_changes_requested'
    | 'profile_deleted'
    | 'photo_approved'
    | 'photo_removed'
    | 'report_resolved'
    | 'report_created'
    | 'content_removed'
    | 'content_removal_rejected'
    | 'city_created';
  entityType: 'profile' | 'photo' | 'location' | 'report' | 'removal_request' | 'review';
  entityId: string;
  details: string;
  timestamp: string;
}

export type RemovalRequest = ContentRemovalRequest;
export type AuditLog = AuditLogEntry;
