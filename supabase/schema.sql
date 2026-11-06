-- ============================================================================
-- AURA DIRECTORY PLATFORM — SUPABASE POSTGRESQL SCHEMA (PHASE 5)
-- Production Location-Based Profile Directory with Compliance & RLS
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ----------------------------------------------------------------------------
-- 1. COUNTRIES TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.countries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    code VARCHAR(10) UNIQUE NOT NULL, -- 'US', 'CA'
    flag VARCHAR(10) NOT NULL,        -- '🇺🇸', '🇨🇦'
    active_listings_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_countries_slug ON public.countries (slug);

-- ----------------------------------------------------------------------------
-- 2. STATES & PROVINCES TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.states_provinces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    country_id UUID NOT NULL REFERENCES public.countries(id) ON DELETE CASCADE,
    country_slug VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    name VARCHAR(150) NOT NULL,
    code VARCHAR(10) NOT NULL, -- 'CA', 'FL', 'ON'
    active_listings_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_state_country UNIQUE(country_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_states_country_slug ON public.states_provinces (country_slug, slug);

-- ----------------------------------------------------------------------------
-- 3. CITIES TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    country_id UUID NOT NULL REFERENCES public.countries(id) ON DELETE CASCADE,
    state_id UUID NOT NULL REFERENCES public.states_provinces(id) ON DELETE CASCADE,
    country_slug VARCHAR(100) NOT NULL,
    state_slug VARCHAR(100) NOT NULL,
    state_code VARCHAR(10) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    name VARCHAR(150) NOT NULL,
    hero_image TEXT,
    description TEXT,
    latitude DECIMAL(10, 7),
    longitude DECIMAL(10, 7),
    is_popular BOOLEAN DEFAULT false,
    active_listings_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_city_state UNIQUE(state_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_cities_hierarchy ON public.cities (country_slug, state_slug, slug);
CREATE INDEX IF NOT EXISTS idx_cities_popular ON public.cities (is_popular);

-- ----------------------------------------------------------------------------
-- 4. PROFILES TABLE (Public Directory Profiles)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    slug VARCHAR(150) UNIQUE NOT NULL,
    display_name VARCHAR(150) NOT NULL,
    handle VARCHAR(100) UNIQUE NOT NULL,
    tagline VARCHAR(255) NOT NULL,
    age INT NOT NULL CHECK (age >= 18), -- Mandatory 18+ legal constraint
    
    -- Location hierarchy references
    country_id UUID REFERENCES public.countries(id) ON DELETE RESTRICT,
    state_id UUID REFERENCES public.states_provinces(id) ON DELETE RESTRICT,
    city_id UUID REFERENCES public.cities(id) ON DELETE RESTRICT,
    country_name VARCHAR(100) NOT NULL,
    country_slug VARCHAR(100) NOT NULL,
    state_name VARCHAR(100) NOT NULL,
    state_slug VARCHAR(100) NOT NULL,
    city_name VARCHAR(100) NOT NULL,
    city_slug VARCHAR(100) NOT NULL,
    
    -- Media and Bio
    avatar_url TEXT NOT NULL,
    cover_url TEXT NOT NULL,
    bio_snippet TEXT NOT NULL,
    full_description TEXT NOT NULL,
    
    -- Verification & Status
    is_verified BOOLEAN DEFAULT false,
    is_online BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    status_badge VARCHAR(50) DEFAULT 'Active & Verified',
    
    -- Categories & Services JSON Arrays
    categories TEXT[] DEFAULT '{}',
    services TEXT[] DEFAULT '{}',
    languages TEXT[] DEFAULT '{}',
    
    -- Rates & Logistics
    starting_rate VARCHAR(50),
    distance_miles DECIMAL(5,2),
    rating DECIMAL(3,2) DEFAULT 5.0 CHECK (rating >= 0 AND rating <= 5),
    review_count INT DEFAULT 0,
    
    -- Availability JSON metadata
    availability_status VARCHAR(50) DEFAULT 'Available Today',
    availability_hours VARCHAR(100),
    schedule_notice TEXT,
    incall_available BOOLEAN DEFAULT true,
    outcall_available BOOLEAN DEFAULT true,
    travel_cities TEXT[] DEFAULT '{}',
    
    -- Contact Information
    preferred_channel VARCHAR(100) DEFAULT 'Inquiry Form',
    inquiry_email VARCHAR(255),
    response_time VARCHAR(100) DEFAULT 'Usually replies within 1 hour',
    booking_policy_note TEXT,
    
    is_published BOOLEAN DEFAULT true,
    last_updated TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_slug ON public.profiles (slug);
CREATE INDEX IF NOT EXISTS idx_profiles_location ON public.profiles (country_slug, state_slug, city_slug);
CREATE INDEX IF NOT EXISTS idx_profiles_published ON public.profiles (is_published, is_verified, is_featured);
CREATE INDEX IF NOT EXISTS idx_profiles_search_trgm ON public.profiles USING GIN (display_name gin_trgm_ops, tagline gin_trgm_ops);

-- ----------------------------------------------------------------------------
-- 5. PROFILE PHOTOS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profile_photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    photo_url TEXT NOT NULL,
    display_order INT DEFAULT 0,
    is_verified_photo BOOLEAN DEFAULT true,
    caption VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profile_photos_profile_id ON public.profile_photos (profile_id, display_order);

-- ----------------------------------------------------------------------------
-- 6. REPORTS TABLE (Safety, Impersonation & Content Violations)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    profile_slug VARCHAR(150),
    reporter_email VARCHAR(255),
    reason VARCHAR(100) NOT NULL, -- 'underage_suspicion', 'fake_photos', 'impersonation', 'harassment', 'other'
    details TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'investigating', 'action_taken', 'dismissed')),
    resolution_notes TEXT,
    reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reports_status ON public.reports (status, created_at);

-- ----------------------------------------------------------------------------
-- 7. MODERATION ACTIONS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.moderation_actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    moderator_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    target_type VARCHAR(50) NOT NULL, -- 'profile', 'photo', 'user'
    target_id UUID NOT NULL,
    action_type VARCHAR(50) NOT NULL, -- 'verify', 'suspend', 'unpublish', 'remove_photo', 'reinstate'
    reason TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_moderation_target ON public.moderation_actions (target_type, target_id);

-- ----------------------------------------------------------------------------
-- 8. CONTENT REMOVAL REQUESTS TABLE (DMCA, USC 2257, Privacy)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.content_removal_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    requester_name VARCHAR(150) NOT NULL,
    requester_email VARCHAR(255) NOT NULL,
    relationship VARCHAR(100) NOT NULL, -- 'subject_in_photo', 'copyright_holder', 'legal_representative'
    target_profile_url TEXT NOT NULL,
    reason TEXT NOT NULL,
    verification_hash VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'removed', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

-- ----------------------------------------------------------------------------
-- 9. AUDIT LOGS TABLE (Immutable Compliance Audit Trail)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL, -- 'profile_created', 'profile_verified', 'photo_deleted', 'report_filed'
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID,
    ip_hash VARCHAR(255),
    payload JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs (action, created_at);

-- ----------------------------------------------------------------------------
-- 10. REVIEWS TABLE (Optional Prepared Table)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    client_alias VARCHAR(100) NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_profile ON public.reviews (profile_id, is_approved);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.states_provinces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moderation_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_removal_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- 1. Location Hierarchy: Public Read
CREATE POLICY "Public can view countries" ON public.countries FOR SELECT USING (true);
CREATE POLICY "Public can view states" ON public.states_provinces FOR SELECT USING (true);
CREATE POLICY "Public can view cities" ON public.cities FOR SELECT USING (true);

-- 2. Profiles: Public Read published profiles, Owners can update
CREATE POLICY "Public can view published profiles" 
    ON public.profiles FOR SELECT 
    USING (is_published = true);

CREATE POLICY "Owners can update own profile" 
    ON public.profiles FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Owners can insert profile" 
    ON public.profiles FOR INSERT 
    WITH CHECK (auth.uid() = user_id OR auth.uid() IS NULL);

-- 3. Profile Photos: Public Read, Owners write
CREATE POLICY "Public can view profile photos" 
    ON public.profile_photos FOR SELECT 
    USING (true);

CREATE POLICY "Owners can manage photos" 
    ON public.profile_photos FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = profile_photos.profile_id 
            AND (profiles.user_id = auth.uid() OR auth.uid() IS NULL)
        )
    );

-- 4. Reports & Content Removal: Anyone can submit (INSERT), only Staff can read
CREATE POLICY "Anyone can submit reports" 
    ON public.reports FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Anyone can submit content removal" 
    ON public.content_removal_requests FOR INSERT 
    WITH CHECK (true);

-- 5. Reviews: Public read approved reviews
CREATE POLICY "Public can view approved reviews" 
    ON public.reviews FOR SELECT 
    USING (is_approved = true);

-- ============================================================================
-- INITIAL SEED DATA (United States & Canada Hubs)
-- ============================================================================

INSERT INTO public.countries (slug, name, code, flag, active_listings_count)
VALUES 
    ('united-states', 'United States', 'US', '🇺🇸', 184),
    ('canada', 'Canada', 'CA', '🇨🇦', 62)
ON CONFLICT (slug) DO NOTHING;

-- States
DO $$
DECLARE
    us_id UUID;
    ca_id UUID;
BEGIN
    SELECT id INTO us_id FROM public.countries WHERE slug = 'united-states';
    SELECT id INTO ca_id FROM public.countries WHERE slug = 'canada';

    IF us_id IS NOT NULL THEN
        INSERT INTO public.states_provinces (country_id, country_slug, slug, name, code, active_listings_count)
        VALUES 
            (us_id, 'united-states', 'california', 'California', 'CA', 78),
            (us_id, 'united-states', 'florida', 'Florida', 'FL', 46),
            (us_id, 'united-states', 'nevada', 'Nevada', 'NV', 34),
            (us_id, 'united-states', 'new-york', 'New York', 'NY', 26)
        ON CONFLICT DO NOTHING;
    END IF;

    IF ca_id IS NOT NULL THEN
        INSERT INTO public.states_provinces (country_id, country_slug, slug, name, code, active_listings_count)
        VALUES 
            (ca_id, 'canada', 'ontario', 'Ontario', 'ON', 32),
            (ca_id, 'canada', 'british-columbia', 'British Columbia', 'BC', 18),
            (ca_id, 'canada', 'quebec', 'Quebec', 'QC', 12)
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- Cities
DO $$
DECLARE
    ca_state_id UUID;
    fl_state_id UUID;
    nv_state_id UUID;
    ny_state_id UUID;
    on_state_id UUID;
    bc_state_id UUID;
    qc_state_id UUID;
    us_id UUID;
    ca_id UUID;
BEGIN
    SELECT id INTO us_id FROM public.countries WHERE slug = 'united-states';
    SELECT id INTO ca_id FROM public.countries WHERE slug = 'canada';

    SELECT id INTO ca_state_id FROM public.states_provinces WHERE slug = 'california';
    SELECT id INTO fl_state_id FROM public.states_provinces WHERE slug = 'florida';
    SELECT id INTO nv_state_id FROM public.states_provinces WHERE slug = 'nevada';
    SELECT id INTO ny_state_id FROM public.states_provinces WHERE slug = 'new-york';

    SELECT id INTO on_state_id FROM public.states_provinces WHERE slug = 'ontario';
    SELECT id INTO bc_state_id FROM public.states_provinces WHERE slug = 'british-columbia';
    SELECT id INTO qc_state_id FROM public.states_provinces WHERE slug = 'quebec';

    IF ca_state_id IS NOT NULL THEN
        INSERT INTO public.cities (country_id, state_id, country_slug, state_slug, state_code, slug, name, hero_image, description, latitude, longitude, is_popular, active_listings_count)
        VALUES (us_id, ca_state_id, 'united-states', 'california', 'CA', 'los-angeles', 'Los Angeles', 'https://images.unsplash.com/photo-1580655653885-65763b2597d0?w=1200', 'Verified independent companions and social escorts in Beverly Hills and West Hollywood.', 34.0522, -118.2437, true, 48)
        ON CONFLICT DO NOTHING;
    END IF;

    IF fl_state_id IS NOT NULL THEN
        INSERT INTO public.cities (country_id, state_id, country_slug, state_slug, state_code, slug, name, hero_image, description, latitude, longitude, is_popular, active_listings_count)
        VALUES (us_id, fl_state_id, 'united-states', 'florida', 'FL', 'miami', 'Miami', 'https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=1200', 'Luxury companion profiles and South Beach private appointments.', 25.7617, -80.1918, true, 36)
        ON CONFLICT DO NOTHING;
    END IF;

    IF nv_state_id IS NOT NULL THEN
        INSERT INTO public.cities (country_id, state_id, country_slug, state_slug, state_code, slug, name, hero_image, description, latitude, longitude, is_popular, active_listings_count)
        VALUES (us_id, nv_state_id, 'united-states', 'nevada', 'NV', 'las-vegas', 'Las Vegas', 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1200', 'High-end Strip accompaniments and VIP casino gala escorts.', 36.1699, -115.1398, true, 34)
        ON CONFLICT DO NOTHING;
    END IF;

    IF ny_state_id IS NOT NULL THEN
        INSERT INTO public.cities (country_id, state_id, country_slug, state_slug, state_code, slug, name, hero_image, description, latitude, longitude, is_popular, active_listings_count)
        VALUES (us_id, ny_state_id, 'united-states', 'new-york', 'NY', 'new-york-city', 'New York City', 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1200', 'Manhattan fine dining and Broadway theater companions.', 40.7128, -74.0060, true, 26)
        ON CONFLICT DO NOTHING;
    END IF;

    IF on_state_id IS NOT NULL THEN
        INSERT INTO public.cities (country_id, state_id, country_slug, state_slug, state_code, slug, name, hero_image, description, latitude, longitude, is_popular, active_listings_count)
        VALUES (ca_id, on_state_id, 'canada', 'ontario', 'ON', 'toronto', 'Toronto', 'https://images.unsplash.com/photo-1507992781348-310259076fa0?w=1200', 'Yorkville incall studios and downtown companion listings.', 43.6532, -79.3832, true, 24)
        ON CONFLICT DO NOTHING;
    END IF;

    IF bc_state_id IS NOT NULL THEN
        INSERT INTO public.cities (country_id, state_id, country_slug, state_slug, state_code, slug, name, hero_image, description, latitude, longitude, is_popular, active_listings_count)
        VALUES (ca_id, bc_state_id, 'canada', 'british-columbia', 'BC', 'vancouver', 'Vancouver', 'https://images.unsplash.com/photo-1559511260-66a65e09b245?w=1200', 'West Coast companions and Yaletown private studios.', 49.2827, -123.1207, true, 18)
        ON CONFLICT DO NOTHING;
    END IF;
END $$;
