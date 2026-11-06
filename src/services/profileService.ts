import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { Profile } from '../types';
import { SAMPLE_PROFILES } from '../data/mockProfiles';
import { sanitizeInput, checkClientRateLimit, formatSafeErrorMessage } from '../utils/securityUtils';

export async function fetchProfilesFromDB(): Promise<Profile[]> {
  if (!isSupabaseConfigured || !supabase) {
    // If running in in-memory simulation, fetch from localStorage to keep admin changes synchronized!
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('aura_admin_profiles');
      if (saved) {
        try {
          const list = JSON.parse(saved);
          const hasOldData = Array.isArray(list) && list.some((p: any) => 
            p.avatarUrl?.includes('unsplash.com') || p.coverUrl?.includes('unsplash.com') ||
            p.avatarUrl?.includes('fbcdn.net') || p.coverUrl?.includes('fbcdn.net') ||
            (p.id === '3' && !p.avatarUrl?.includes('aria_therapist_black')) ||
            p.bioSnippet?.includes('Manhattan') || p.bioSnippet?.includes('Beverly Hills') ||
            p.fullDescription?.includes('Manhattan') || p.fullDescription?.includes('Beverly Hills') ||
            p.services?.some((s: string) => s.includes('Penthouse') || s.includes('West Hollywood'))
          );
          if (!hasOldData && Array.isArray(list) && list.length > 0) {
            return list.filter((p: any) => p.status === 'published' || p.isPublished);
          }
        } catch (e) {
          // fallback
        }
      }
    }
    return SAMPLE_PROFILES;
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        *,
        profile_photos (
          photo_url,
          display_order
        )
      `)
      .eq('is_published', true)
      .order('is_featured', { ascending: false })
      .order('rating', { ascending: false });

    if (error || !data || data.length === 0) {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('aura_admin_profiles');
        if (saved) {
          try {
            const list = JSON.parse(saved);
            const hasOldImages = Array.isArray(list) && list.some((p: any) => 
              p.avatarUrl?.includes('unsplash.com') || p.coverUrl?.includes('unsplash.com')
            );
            if (!hasOldImages && Array.isArray(list) && list.length > 0) {
              return list.filter((p: any) => p.status === 'published' || p.isPublished);
            }
          } catch (e) {
            // fallback
          }
        }
      }
      return SAMPLE_PROFILES;
    }

    // Map database snake_case row to frontend Profile interface
    return data.map((row: any): Profile => {
      const photos: string[] = (row.profile_photos || [])
        .sort((a: any, b: any) => a.display_order - b.display_order)
        .map((p: any) => p.photo_url);

      if (photos.length === 0) {
        photos.push(row.avatar_url, row.cover_url);
      }

      return {
        id: row.id,
        slug: row.slug,
        displayName: row.display_name,
        handle: row.handle,
        tagline: row.tagline,
        age: row.age,
        country: row.country_name,
        countrySlug: row.country_slug,
        state: row.state_name,
        stateSlug: row.state_slug,
        city: row.city_name,
        citySlug: row.city_slug,
        distanceMiles: row.distance_miles ? Number(row.distance_miles) : undefined,
        avatarUrl: row.avatar_url,
        coverUrl: row.cover_url,
        galleryPhotos: photos,
        isVerified: row.is_verified,
        isOnline: row.is_online,
        featured: row.is_featured,
        categories: row.categories || [],
        services: row.services || [],
        languages: row.languages || [],
        startingRate: row.starting_rate || undefined,
        rating: Number(row.rating) || 5.0,
        reviewCount: row.review_count || 0,
        bioSnippet: row.bio_snippet,
        fullDescription: row.full_description,
        availability: {
          statusText: row.availability_status || 'Available Today',
          hours: row.availability_hours || '1:00 PM – 10:00 PM',
          scheduleNotice: row.schedule_notice || 'Advance notice preferred.',
          incallAvailable: row.incall_available,
          outcallAvailable: row.outcall_available,
          travelCities: row.travel_cities || [],
        },
        contactInfo: {
          preferredChannel: row.preferred_channel || 'Inquiry Form',
          inquiryEmail: row.inquiry_email || undefined,
          responseTime: row.response_time || 'Replies within 1 hour',
          bookingPolicyNote: row.booking_policy_note || 'Strict legal compliance required.',
        },
        statusBadge: row.status_badge || 'Active & Verified',
        lastUpdated: new Date(row.last_updated || row.created_at).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        }),
      };
    });
  } catch (err) {
    console.error('Failed to fetch from Supabase, using local data:', err);
    return SAMPLE_PROFILES;
  }
}

export async function insertProfileToDB(profile: Partial<Profile>): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) {
    return true; // simulated in memory
  }

  try {
    const { error } = await supabase.from('profiles').insert({
      slug: profile.slug || `creator-${Date.now()}`,
      display_name: profile.displayName || 'New Creator',
      handle: profile.handle || `@creator_${Date.now()}`,
      tagline: profile.tagline || 'Verified social companion',
      age: profile.age || 25,
      country_name: profile.country || 'United States',
      country_slug: profile.countrySlug || 'united-states',
      state_name: profile.state || 'California',
      state_slug: profile.stateSlug || 'california',
      city_name: profile.city || 'Los Angeles',
      city_slug: profile.citySlug || 'los-angeles',
      avatar_url: profile.avatarUrl || 'https://callgirls.city/uploads/1790205590094-27427353.webp',
      cover_url: profile.coverUrl || 'https://callgirls.city/uploads/1790205590094-27427353.webp',
      bio_snippet: profile.bioSnippet || 'New listing bio.',
      full_description: profile.fullDescription || profile.bioSnippet || 'Full description.',
      categories: profile.categories || ['New Listings'],
      services: profile.services || ['Dinner Accompaniment'],
      languages: profile.languages || ['English'],
      starting_rate: profile.startingRate || '$400/hr',
      rating: 5.0,
      review_count: 0,
      is_verified: true,
      is_online: true,
      is_featured: false,
      status_badge: 'New Listing',
      is_published: true,
      incall_available: true,
      outcall_available: true,
    } as any);

    return !error;
  } catch (err) {
    console.error('Error inserting profile to Supabase:', err);
    return false;
  }
}

export async function submitSafetyReport(report: {
  profileSlug: string;
  reporterEmail?: string;
  reason: string;
  details: string;
}): Promise<{ success: boolean; error?: string }> {
  // Rate limiting defense
  const rateLimit = checkClientRateLimit('safety_report', 3, 60);
  if (!rateLimit.allowed) {
    return {
      success: false,
      error: `Too many submissions. Please wait ${rateLimit.retryAfterSeconds} seconds before submitting again.`,
    };
  }

  const cleanDetails = sanitizeInput(report.details);
  const cleanEmail = report.reporterEmail ? sanitizeInput(report.reporterEmail).toLowerCase() : null;

  if (cleanDetails.length < 10) {
    return { success: false, error: 'Report details must be at least 10 characters long.' };
  }

  if (!isSupabaseConfigured || !supabase) {
    return { success: true };
  }

  try {
    const { error } = await (supabase.from('reports') as any).insert({
      profile_slug: sanitizeInput(report.profileSlug),
      reporter_email: cleanEmail,
      reason: sanitizeInput(report.reason),
      details: cleanDetails,
      status: 'pending',
    });
    if (error) {
      return { success: false, error: formatSafeErrorMessage(error) };
    }
    return { success: true };
  } catch (err) {
    return { success: false, error: formatSafeErrorMessage(err) };
  }
}
