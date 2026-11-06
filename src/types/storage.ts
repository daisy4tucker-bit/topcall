export interface ProfilePhoto {
  id: string;
  profileId: string;
  profileSlug: string;
  profileName: string;
  url: string;
  thumbnailUrl: string;
  storagePath: string;
  bucket: string;
  isPrimary: boolean;
  isCover: boolean;
  isPublished: boolean;
  displayOrder: number;
  fileSizeBytes: number;
  fileSizeFormatted: string;
  width: number;
  height: number;
  format: 'image/jpeg' | 'image/png' | 'image/webp';
  caption?: string;
  isProviderAuthorized: boolean;
  authorizedAt: string;
  uploadedAt: string;
}

export interface ImageValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  fileInfo?: {
    name: string;
    sizeBytes: number;
    sizeFormatted: string;
    type: string;
    width: number;
    height: number;
    aspectRatio: number;
  };
}

export interface ImageOptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  targetFormat?: 'image/webp' | 'image/jpeg';
}

export interface StorageBucketPolicy {
  bucketName: string;
  publicRead: boolean;
  maxFileSizeMB: number;
  allowedMimeTypes: string[];
  rlsPolicies: {
    name: string;
    description: string;
    definition: string;
  }[];
}
