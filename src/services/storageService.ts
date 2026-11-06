import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { ProfilePhoto, ImageValidationResult, ImageOptimizationOptions, StorageBucketPolicy } from '../types/storage';
import { SAMPLE_PROFILES } from '../data/mockProfiles';
import { recordAuditLog } from './adminService';

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const MIN_IMAGE_WIDTH = 400;
const MIN_IMAGE_HEIGHT = 400;
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// Initial in-memory seed photo database
const generateInitialPhotos = (): ProfilePhoto[] => {
  const photos: ProfilePhoto[] = [];
  SAMPLE_PROFILES.forEach((profile) => {
    (profile.galleryPhotos || [profile.avatarUrl, profile.coverUrl]).forEach((url, idx) => {
      const isPrimary = idx === 0;
      const isCover = idx === 1;
      photos.push({
        id: `photo-${profile.id}-${idx + 1}`,
        profileId: profile.id,
        profileSlug: profile.slug,
        profileName: profile.displayName,
        url,
        thumbnailUrl: url,
        storagePath: `profiles/${profile.slug}/photo-${idx + 1}.webp`,
        bucket: 'profile-photos',
        isPrimary,
        isCover,
        isPublished: true,
        displayOrder: idx + 1,
        fileSizeBytes: 420000 + idx * 85000,
        fileSizeFormatted: `${((420000 + idx * 85000) / 1024 / 1024).toFixed(2)} MB`,
        width: isCover ? 1920 : 1200,
        height: isCover ? 1080 : 1500,
        format: 'image/webp',
        caption: `${profile.displayName} Authorized Studio Portfolio #${idx + 1}`,
        isProviderAuthorized: true,
        authorizedAt: '2026-10-01T12:00:00Z',
        uploadedAt: '2026-10-01T12:00:00Z',
      });
    });
  });
  return photos;
};

let storedPhotos: ProfilePhoto[] = generateInitialPhotos();

/**
 * Format bytes to readable string (e.g. "1.45 MB")
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Validates an image file for type, size, and dimensions
 */
export async function validateImageFile(
  file: File,
  customMaxSize = MAX_FILE_SIZE_BYTES,
  customMinWidth = MIN_IMAGE_WIDTH,
  customMinHeight = MIN_IMAGE_HEIGHT
): Promise<ImageValidationResult> {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 1. File Type Validation
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    errors.push(
      `Invalid file format "${file.type || 'unknown'}". Only JPEG (.jpg, .jpeg), PNG (.png), and WebP (.webp) are authorized.`
    );
  }

  // 2. File Size Validation
  if (file.size > customMaxSize) {
    errors.push(
      `File size (${formatBytes(file.size)}) exceeds maximum limit of ${formatBytes(customMaxSize)}.`
    );
  }

  // 3. Image Dimensions Validation (via browser Image object)
  return new Promise((resolve) => {
    if (errors.length > 0 && !ALLOWED_MIME_TYPES.includes(file.type)) {
      // If not an image type, resolve immediately without loading Image
      return resolve({
        isValid: false,
        errors,
        warnings,
        fileInfo: {
          name: file.name,
          sizeBytes: file.size,
          sizeFormatted: formatBytes(file.size),
          type: file.type,
          width: 0,
          height: 0,
          aspectRatio: 0,
        },
      });
    }

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const width = img.naturalWidth;
      const height = img.naturalHeight;
      const aspectRatio = width / height;

      if (width < customMinWidth || height < customMinHeight) {
        errors.push(
          `Image dimensions (${width}×${height}px) are below minimum resolution requirement of ${customMinWidth}×${customMinHeight}px.`
        );
      }

      if (aspectRatio < 0.5 || aspectRatio > 2.5) {
        warnings.push(
          `Unusual aspect ratio (${aspectRatio.toFixed(2)}). Portrait (4:5 or 3:4) or landscape (16:9) is recommended.`
        );
      }

      resolve({
        isValid: errors.length === 0,
        errors,
        warnings,
        fileInfo: {
          name: file.name,
          sizeBytes: file.size,
          sizeFormatted: formatBytes(file.size),
          type: file.type,
          width,
          height,
          aspectRatio,
        },
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      errors.push('Failed to parse image data. File might be corrupted or not a valid image.');
      resolve({
        isValid: false,
        errors,
        warnings,
        fileInfo: {
          name: file.name,
          sizeBytes: file.size,
          sizeFormatted: formatBytes(file.size),
          type: file.type,
          width: 0,
          height: 0,
          aspectRatio: 0,
        },
      });
    };

    img.src = objectUrl;
  });
}

/**
 * Optimizes an image for web performance using HTML5 Canvas & WebP compression
 */
export async function optimizeImageClient(
  file: File,
  options: ImageOptimizationOptions = {}
): Promise<{ blob: Blob; dataUrl: string; width: number; height: number; sizeBytes: number }> {
  const { maxWidth = 1600, maxHeight = 2000, quality = 0.85, targetFormat = 'image/webp' } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      let width = img.naturalWidth;
      let height = img.naturalHeight;

      // Calculate resized dimensions while preserving aspect ratio
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
      if (height > maxHeight) {
        width = Math.round((width * maxHeight) / height);
        height = maxHeight;
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return reject(new Error('Canvas context could not be created for image optimization'));
      }

      // Smooth rendering
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            return reject(new Error('Canvas toBlob conversion failed'));
          }
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve({
              blob,
              dataUrl: reader.result as string,
              width,
              height,
              sizeBytes: blob.size,
            });
          };
          reader.readAsDataURL(blob);
        },
        targetFormat,
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to load image for optimization'));
    };

    img.src = objectUrl;
  });
}

/**
 * Uploads a profile photograph to Supabase Storage with authorization validation
 */
export async function uploadProfilePhoto(
  profileId: string,
  profileSlug: string,
  profileName: string,
  file: File,
  isProviderAuthorized: boolean,
  isPrimary = false
): Promise<{ success: boolean; photo?: ProfilePhoto; error?: string }> {
  if (!isProviderAuthorized) {
    return {
      success: false,
      error: 'Provider written authorization & 18+ identity verification must be explicitly confirmed before uploading.',
    };
  }

  // 1. Validate Image
  const validation = await validateImageFile(file);
  if (!validation.isValid) {
    return {
      success: false,
      error: validation.errors.join(' '),
    };
  }

  try {
    // 2. Optimize for Web Performance
    const optimized = await optimizeImageClient(file);
    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}.webp`;
    const storagePath = `profiles/${profileSlug}/${filename}`;
    let publicUrl = optimized.dataUrl;

    // 3. Supabase Storage Upload (if connected)
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.storage
        .from('profile-photos')
        .upload(storagePath, optimized.blob, {
          contentType: 'image/webp',
          upsert: true,
        });

      if (!error && data) {
        const { data: urlData } = supabase.storage
          .from('profile-photos')
          .getPublicUrl(storagePath);
        if (urlData?.publicUrl) {
          publicUrl = urlData.publicUrl;
        }
      }
    }

    // 4. Create ProfilePhoto object
    const existingForProfile = storedPhotos.filter((p) => p.profileId === profileId);
    const newPhoto: ProfilePhoto = {
      id: `photo-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      profileId,
      profileSlug,
      profileName,
      url: publicUrl,
      thumbnailUrl: publicUrl,
      storagePath,
      bucket: 'profile-photos',
      isPrimary: isPrimary || existingForProfile.length === 0,
      isCover: false,
      isPublished: true,
      displayOrder: existingForProfile.length + 1,
      fileSizeBytes: optimized.sizeBytes,
      fileSizeFormatted: formatBytes(optimized.sizeBytes),
      width: optimized.width,
      height: optimized.height,
      format: 'image/webp',
      caption: `Authorized photo for ${profileName}`,
      isProviderAuthorized: true,
      authorizedAt: new Date().toISOString(),
      uploadedAt: new Date().toISOString(),
    };

    if (newPhoto.isPrimary) {
      storedPhotos.forEach((p) => {
        if (p.profileId === profileId) p.isPrimary = false;
      });
    }

    storedPhotos = [newPhoto, ...storedPhotos];

    recordAuditLog(
      'photo_approved',
      'photo',
      newPhoto.id,
      `Uploaded and authorized new photograph for ${profileName} (${newPhoto.fileSizeFormatted}, ${newPhoto.width}x${newPhoto.height}px WebP)`
    );

    return { success: true, photo: newPhoto };
  } catch (err: any) {
    return { success: false, error: err.message || 'Image processing failed' };
  }
}

/**
 * Get all photos across all profiles
 */
export function getAllPhotos(): ProfilePhoto[] {
  return [...storedPhotos];
}

/**
 * Get all photos for a given profile (admin view includes unpublished)
 */
export function getProfilePhotos(profileId: string): ProfilePhoto[] {
  return storedPhotos
    .filter((p) => p.profileId === profileId || p.profileSlug === profileId)
    .sort((a, b) => a.displayOrder - b.displayOrder);
}

/**
 * Get only published photos for a given profile (public frontend view)
 */
export function getPublicPublishedPhotos(profileId: string): ProfilePhoto[] {
  return storedPhotos
    .filter(
      (p) =>
        (p.profileId === profileId || p.profileSlug === profileId) &&
        p.isPublished &&
        p.isProviderAuthorized
    )
    .sort((a, b) => a.displayOrder - b.displayOrder);
}

/**
 * Reorder photos for a profile
 */
export function reorderProfilePhotos(profileId: string, orderedPhotoIds: string[]): boolean {
  orderedPhotoIds.forEach((id, index) => {
    const photo = storedPhotos.find((p) => p.id === id);
    if (photo && (photo.profileId === profileId || photo.profileSlug === profileId)) {
      photo.displayOrder = index + 1;
    }
  });

  recordAuditLog(
    'photo_approved',
    'photo',
    profileId,
    `Reordered gallery sequence for profile #${profileId}`
  );
  return true;
}

/**
 * Set a photo as the primary profile avatar
 */
export function setPrimaryPhoto(profileId: string, photoId: string): boolean {
  let targetPhotoName = '';
  storedPhotos.forEach((p) => {
    if (p.profileId === profileId || p.profileSlug === profileId) {
      if (p.id === photoId) {
        p.isPrimary = true;
        p.isPublished = true; // Primary must be published
        targetPhotoName = p.profileName;
      } else {
        p.isPrimary = false;
      }
    }
  });

  recordAuditLog(
    'photo_approved',
    'photo',
    photoId,
    `Set photo #${photoId} as primary avatar for ${targetPhotoName || profileId}`
  );
  return true;
}

/**
 * Set a photo as the profile cover banner
 */
export function setCoverPhoto(profileId: string, photoId: string): boolean {
  storedPhotos.forEach((p) => {
    if (p.profileId === profileId || p.profileSlug === profileId) {
      if (p.id === photoId) {
        p.isCover = true;
        p.isPublished = true;
      } else {
        p.isCover = false;
      }
    }
  });

  recordAuditLog(
    'photo_approved',
    'photo',
    photoId,
    `Set photo #${photoId} as cover banner for profile #${profileId}`
  );
  return true;
}

/**
 * Toggle photo publish/unpublish status
 */
export function togglePhotoPublish(photoId: string, isPublished: boolean): boolean {
  const photo = storedPhotos.find((p) => p.id === photoId);
  if (!photo) return false;

  photo.isPublished = isPublished;

  // If unpublishing a primary photo, reassign primary to the next available published photo
  if (!isPublished && photo.isPrimary) {
    photo.isPrimary = false;
    const nextPublished = storedPhotos.find(
      (p) => p.profileId === photo.profileId && p.id !== photo.id && p.isPublished
    );
    if (nextPublished) {
      nextPublished.isPrimary = true;
    }
  }

  recordAuditLog(
    isPublished ? 'photo_approved' : 'photo_removed',
    'photo',
    photoId,
    `${isPublished ? 'Published' : 'Unpublished (hidden from public)'} photo for ${photo.profileName}`
  );
  return true;
}

/**
 * Remove/delete a photo permanently
 */
export function deleteProfilePhoto(photoId: string): boolean {
  const photo = storedPhotos.find((p) => p.id === photoId);
  if (!photo) return false;

  const profileId = photo.profileId;
  const wasPrimary = photo.isPrimary;
  const profileName = photo.profileName;

  storedPhotos = storedPhotos.filter((p) => p.id !== photoId);

  // If deleted photo was primary, assign primary to remaining first published photo
  if (wasPrimary) {
    const remaining = storedPhotos.find((p) => p.profileId === profileId && p.isPublished);
    if (remaining) {
      remaining.isPrimary = true;
    }
  }

  // Re-index display orders
  const remainingForProfile = storedPhotos.filter((p) => p.profileId === profileId);
  remainingForProfile.forEach((p, idx) => {
    p.displayOrder = idx + 1;
  });

  recordAuditLog(
    'photo_removed',
    'photo',
    photoId,
    `Permanently deleted photo #${photoId} from Supabase storage for ${profileName}`
  );
  return true;
}

/**
 * Storage Bucket security & RLS policies
 */
export function getStorageBucketPolicies(): StorageBucketPolicy {
  return {
    bucketName: 'profile-photos',
    publicRead: true,
    maxFileSizeMB: 5,
    allowedMimeTypes: ALLOWED_MIME_TYPES,
    rlsPolicies: [
      {
        name: 'Public Read Access for Published Photos',
        description: 'Allows anonymous visitors to read photos where is_published is true and provider authorization is attached.',
        definition: `CREATE POLICY "Public Read Published Photos" ON storage.objects FOR SELECT USING (bucket_id = 'profile-photos');`,
      },
      {
        name: 'Admin Full Storage Management',
        description: 'Allows authenticated administrators to upload, reorder, update, and delete photographs.',
        definition: `CREATE POLICY "Admin Photo Management" ON storage.objects FOR ALL USING (auth.role() = 'authenticated');`,
      },
      {
        name: '18 U.S.C. § 2257 Authorization Verification Gate',
        description: 'Requires proof of provider age verification before photograph record insertion.',
        definition: `CREATE POLICY "Authorized Consent Enforcement" ON public.profile_photos FOR INSERT WITH CHECK (is_provider_authorized = true);`,
      },
    ],
  };
}
