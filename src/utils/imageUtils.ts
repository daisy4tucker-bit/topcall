import React from 'react';

export const FALLBACK_PROFILE_IMAGES: Record<string, string> = {
  '1': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
  '2': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
  '3': '/images/aria/aria_therapist_black.jpeg',
  '4': 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=80',
  default: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
};

export const FALLBACK_COVER_IMAGE =
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80';

/**
 * Handle broken image load errors gracefully by replacing with a reliable high-res asset
 */
export function handleImageError(
  event: React.SyntheticEvent<HTMLImageElement, Event>,
  fallbackSrc: string = FALLBACK_PROFILE_IMAGES.default
) {
  const target = event.currentTarget;
  if (target.dataset.fallbackApplied === 'true') {
    return;
  }
  target.dataset.fallbackApplied = 'true';
  target.src = fallbackSrc;
}
