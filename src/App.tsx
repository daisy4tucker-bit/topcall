import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { SearchComponent } from './components/SearchComponent';
import { ProfileGrid } from './components/ProfileGrid';
import { ProfilePage } from './components/profile/ProfilePage';
import { MissingProfileView } from './components/profile/MissingProfileView';
import { LocationSelectorModal } from './components/LocationSelectorModal';
import { LocationSelectorBar } from './components/location/LocationSelectorBar';
import { LocationExplorer } from './components/location/LocationExplorer';
import { LocationPageView } from './components/location/LocationPageView';
import { FeaturedProfilesSection } from './components/FeaturedProfilesSection';
import { InformationSection } from './components/InformationSection';
import { CreateListingModal } from './components/CreateListingModal';
import { DatabaseStatusModal } from './components/database/DatabaseStatusModal';
import { SyncImportModal } from './components/SyncImportModal';
import { SafetyBanner } from './components/SafetyBanner';
import { ArchitectureGuide } from './components/ArchitectureGuide';
import { DesignSystemTester } from './components/DesignSystemTester';
import { SkeletonProfileGrid, LoadingSpinner } from './components/LoadingStates';
import { EmptyStates } from './components/EmptyStates';
import { ErrorStates } from './components/ErrorStates';
import { Pagination } from './components/Pagination';
import { Footer } from './components/Footer';

// Direct & Simple Homepage Components
import { DirectHeroSection } from './components/DirectHeroSection';
import { PopularCitiesSection } from './components/PopularCitiesSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { AvailableNowSection } from './components/AvailableNowSection';
import { HomeFaqSection } from './components/HomeFaqSection';
import { AboutTransEscortsSection } from './components/AboutTransEscortsSection';

// SEO & SERP Optimization Imports
import { SEOHead } from './components/seo/SEOHead';
import { SEOSERPInspector } from './components/seo/SEOSERPInspector';
import { InternalLinkNetwork } from './components/seo/InternalLinkNetwork';

import { INITIAL_ADMIN_PROFILES } from './services/adminService';

import { fetchProfilesFromDB, insertProfileToDB } from './services/profileService';
import { LOCATION_DATA, getLocationBySlugs, buildLocationBreadcrumbs } from './data/locationHierarchy';
import { SAMPLE_PROFILES } from './data/mockProfiles';
import { Profile, FilterState } from './types';

export default function App() {
  const [profiles, setProfiles] = useState<Profile[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('aura_admin_profiles');
        if (saved) {
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
            const published = list.filter((p: any) => p.status === 'published' || p.isPublished);
            if (published.length > 0) return published;
          }
        }
      } catch (e) {
        // ignore
      }
      try {
        localStorage.setItem('aura_admin_profiles', JSON.stringify(INITIAL_ADMIN_PROFILES));
      } catch (e) {}
    }
    return SAMPLE_PROFILES;
  });
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDbModalOpen, setIsDbModalOpen] = useState(false);
  const [isSeoModalOpen, setIsSeoModalOpen] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [showTester, setShowTester] = useState(false);
  const [layoutView, setLayoutView] = useState<'grid' | 'list'>('grid');
  const [radiusMiles, setRadiusMiles] = useState(25);
  const [activeMobileTab, setActiveMobileTab] = useState<'explore' | 'search' | 'favorites' | 'post' | 'guide'>('explore');

  // Client Navigation Path State initialized directly from browser location
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined' && window.location.pathname) {
      return window.location.pathname;
    }
    return '/';
  });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoadingDB, setIsLoadingDB] = useState<boolean>(false);
  const pageSize = 6;

  // Simulator state for Phase 2/3/4 UI Tester
  const [simMode, setSimMode] = useState<'normal' | 'loading' | 'error' | 'empty'>('normal');

  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    selectedCountrySlug: 'all',
    selectedStateSlug: 'all',
    selectedCitySlug: 'all',
    selectedCategory: 'All Categories',
    verifiedOnly: false,
    onlineOnly: false,
    sortBy: 'recommended',
  });

  // Load profiles from database service on mount
  useEffect(() => {
    async function loadData() {
      setIsLoadingDB(true);
      try {
        const dbProfiles = await fetchProfilesFromDB();
        setProfiles(dbProfiles);
      } catch (e) {
        console.error('Error loading profiles from DB service:', e);
      } finally {
        setIsLoadingDB(false);
      }
    }
    loadData();
  }, []);

  // Browser history sync & back/forward button support
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname || '/';
      setCurrentPath(path);
      setCurrentPage(1);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    setCurrentPath(path);
    setCurrentPage(1);
    window.history.pushState({}, '', path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleAddProfile = async (newProfile: Profile) => {
    setProfiles((prev) => [newProfile, ...prev]);
    await insertProfileToDB(newProfile);
  };

  // Check route types
  const isAdminRoute = currentPath.startsWith('/admin');
  const isProfileRoute = currentPath.startsWith('/profiles/');
  const currentProfileSlug = isProfileRoute
    ? decodeURIComponent(currentPath.replace('/profiles/', '').replace(/\/$/, '')).trim().toLowerCase()
    : null;

  const currentProfile = useMemo(() => {
    if (!currentProfileSlug) return null;
    return profiles.find((p) => p.slug.toLowerCase() === currentProfileSlug);
  }, [profiles, currentProfileSlug]);

  const relatedProfiles = useMemo(() => {
    if (!currentProfile) return [];
    return profiles.filter(
      (p) => p.citySlug === currentProfile.citySlug && p.id !== currentProfile.id
    );
  }, [profiles, currentProfile]);



  // Location route segments for public directory
  const routeSegments = useMemo(() => {
    if (isProfileRoute || isAdminRoute) return [];
    const clean = currentPath.replace(/^\/+|\/+$/g, '');
    if (!clean) return [];
    return clean.split('/');
  }, [currentPath, isProfileRoute, isAdminRoute]);

  const activeCountrySlug = routeSegments[0];
  const activeStateSlug = routeSegments[1];
  const activeCitySlug = routeSegments[2];

  const locationContext = useMemo(() => {
    if (!activeCountrySlug || isProfileRoute || isAdminRoute) return null;
    return getLocationBySlugs(activeCountrySlug, activeStateSlug, activeCitySlug);
  }, [activeCountrySlug, activeStateSlug, activeCitySlug, isProfileRoute, isAdminRoute]);

  const breadcrumbs = useMemo(() => {
    return buildLocationBreadcrumbs(activeCountrySlug, activeStateSlug, activeCitySlug);
  }, [activeCountrySlug, activeStateSlug, activeCitySlug]);

  const locationProfiles = useMemo(() => {
    if (!locationContext) return [];
    return profiles.filter((p) => {
      if (activeCitySlug) return p.citySlug === activeCitySlug;
      if (activeStateSlug) return p.stateSlug === activeStateSlug;
      if (activeCountrySlug) return p.countrySlug === activeCountrySlug;
      return true;
    });
  }, [profiles, locationContext, activeCountrySlug, activeStateSlug, activeCitySlug]);

  // SEO & Entity metadata computation for Google SERP & AI engines
  const seoData = useMemo(() => {
    if (isProfileRoute && currentProfile) {
      return {
        title: `${currentProfile.displayName} – Verified Companion in ${currentProfile.city}, ${currentProfile.state}`,
        description: currentProfile.bioSnippet || `View verified photos, schedule availability, and contact information for ${currentProfile.displayName} in ${currentProfile.city}.`,
        type: 'profile' as const,
        canonicalPath: currentPath,
        profileData: currentProfile,
        breadcrumbs: [
          { label: 'Directory Home', path: '/' },
          { label: currentProfile.displayName, path: `/profiles/${currentProfile.slug}` },
        ],
      };
    }

    if (locationContext && locationContext.country) {
      const city = locationContext.city;
      const state = locationContext.state;
      const country = locationContext.country;
      const locTitle = city
        ? `${city.name} Escorts & Verified Companions | ${city.stateCode}`
        : state
        ? `${state.name} Verified Escorts & Companions Directory`
        : `${country.name} Companion & Escort Directory`;

      const locDesc = city
        ? `Explore top rated 18+ verified independent companions, gala escorts, and outcall services in ${city.name}, ${city.stateCode}.`
        : state
        ? `Browse active verified companion listings across major metropolitan cities in ${state.name}, ${country.name}.`
        : `Verified companion directory covering United States & Canada metropolitan hubs with fast filtering.`;

      return {
        title: locTitle,
        description: locDesc,
        type: 'location' as const,
        canonicalPath: currentPath,
        locationData: locationContext,
        breadcrumbs,
      };
    }

    return {
      title: 'Top Call Girls',
      description: 'Discover verified independent companions, VIP outcalls, and social escorts across major US & Canadian metropolitan hubs. 18+ ID verified.',
      type: 'website' as const,
      canonicalPath: '/',
      breadcrumbs: [{ label: 'Directory Home', path: '/' }],
    };
  }, [isProfileRoute, currentProfile, locationContext, currentPath, breadcrumbs]);

  // Homepage Profiles
  const homeFilteredProfiles = useMemo(() => {
    if (simMode === 'empty') return [];

    return profiles
      .filter((p) => {
        if (activeMobileTab === 'favorites' && !favorites.includes(p.id)) {
          return false;
        }
        if (filters.selectedCountrySlug !== 'all' && p.countrySlug !== filters.selectedCountrySlug) {
          return false;
        }
        if (filters.selectedStateSlug !== 'all' && p.stateSlug !== filters.selectedStateSlug) {
          return false;
        }
        if (filters.selectedCitySlug !== 'all' && p.citySlug !== filters.selectedCitySlug) {
          return false;
        }
        if (filters.selectedCategory !== 'All Categories' && !p.categories.includes(filters.selectedCategory)) {
          return false;
        }
        if (filters.verifiedOnly && !p.isVerified) return false;
        if (filters.onlineOnly && !p.isOnline) return false;

        if (filters.searchQuery.trim() !== '') {
          const q = filters.searchQuery.toLowerCase();
          const matchName = p.displayName.toLowerCase().includes(q);
          const matchCity = p.city.toLowerCase().includes(q);
          const matchState = p.state.toLowerCase().includes(q);
          const matchCountry = p.country.toLowerCase().includes(q);
          const matchTagline = p.tagline.toLowerCase().includes(q);
          const matchBio = p.bioSnippet.toLowerCase().includes(q);
          const matchServices = p.services.some((s) => s.toLowerCase().includes(q));
          const matchLanguages = p.languages?.some((l) => l.toLowerCase().includes(q));
          if (!matchName && !matchCity && !matchState && !matchCountry && !matchTagline && !matchBio && !matchServices && !matchLanguages) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'rating') return b.rating - a.rating;
        if (filters.sortBy === 'distance') return (a.distanceMiles || 99) - (b.distanceMiles || 99);
        if (filters.sortBy === 'newest') return Number(b.id) - Number(a.id);
        if (a.featured !== b.featured) return a.featured ? -1 : 1;
        return b.rating - a.rating;
      });
  }, [profiles, filters, favorites, activeMobileTab, simMode]);

  const totalHomePages = Math.ceil(homeFilteredProfiles.length / pageSize);
  const displayedHomeProfiles = homeFilteredProfiles.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // --------------------------------------------------------------------------
  // ROUTE BRANCH 1: ADMIN CMS BACKEND (/admin/*) - DISABLED BY USER REQUEST
  // --------------------------------------------------------------------------
  if (isAdminRoute) {
    if (typeof window !== 'undefined' && currentPath !== '/') {
      window.history.replaceState({}, '', '/');
    }
  }

  // --------------------------------------------------------------------------
  // ROUTE BRANCH 2: PUBLIC DIRECTORY FRONTEND
  // --------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#071322] text-slate-100 flex flex-col selection:bg-rose-500 selection:text-white font-sans antialiased">
      {/* Dynamic SEO & Schema.org JSON-LD for Google SERP & AI engines */}
      <SEOHead {...seoData} />

      {/* Header */}
      <Header
        selectedCity={filters.selectedCitySlug !== 'all' ? filters.selectedCitySlug.replace(/-/g, ' ') : 'All Locations'}
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
        favoritesCount={favorites.length}
        onOpenFavorites={() => {
          if (activeMobileTab === 'favorites') {
            setActiveMobileTab('explore');
          } else {
            setActiveMobileTab('favorites');
          }
        }}
        onToggleDevPanel={() => setShowTester(!showTester)}
        showDevPanel={showTester}
        onOpenDbModal={() => setIsDbModalOpen(true)}
        onOpenSeoModal={() => setIsSeoModalOpen(true)}
      />

      <main className="flex-1">
        {/* PUBLIC ROUTE A: Individual Profile Page (/profiles/:slug) */}
        {isProfileRoute ? (
          currentProfile ? (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
              <ProfilePage
                profile={currentProfile}
                relatedProfiles={relatedProfiles}
                onSelectRelatedProfile={(p) => navigateTo(`/profiles/${p.slug}`)}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
                onNavigateToLocation={navigateTo}
                onBackToDirectory={() => navigateTo('/')}
              />
            </div>
          ) : (
            <MissingProfileView
              slug={currentProfileSlug || 'unknown'}
              onNavigateHome={() => navigateTo('/')}
              onExploreCities={() => {
                navigateTo('/');
                const el = document.getElementById('browse-locations-title');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />
          )
        ) : locationContext && locationContext.country ? (
          /* PUBLIC ROUTE B: Location Landing Page (/united-states/california/los-angeles/, etc.) */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <LocationPageView
              country={locationContext.country}
              state={locationContext.state}
              city={locationContext.city}
              breadcrumbs={breadcrumbs}
              profiles={locationProfiles}
              onSelectProfile={(p) => navigateTo(`/profiles/${p.slug}`)}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              onNavigateToLocation={navigateTo}
              onBackToAll={() => navigateTo('/')}
            />
          </div>
        ) : (
          /* PUBLIC ROUTE C: Primary Directory Homepage — Direct & Simple */
          <>
            {/* 1. Direct Hero with Companions Near You */}
            <DirectHeroSection
              searchQuery={filters.searchQuery}
              onSearchChange={(q) => handleFilterChange({ searchQuery: q })}
              onSelectCity={(city) => {
                const found = LOCATION_DATA.flatMap((c) => c.states).flatMap((s) => s.cities).find((c) => c.name === city);
                if (found) {
                  navigateTo(`/${found.countrySlug}/${found.stateSlug}/${found.slug}/`);
                }
              }}
              onUseCurrentLocation={() => {
                navigateTo('/united-states/california/los-angeles/');
              }}
            />

            {/* 2. Available Nearby Listings Section */}
            <AvailableNowSection
              profiles={homeFilteredProfiles}
              displayedProfiles={displayedHomeProfiles}
              onSelectProfile={(p) => navigateTo(`/profiles/${p.slug}`)}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              layoutView={layoutView}
              onLayoutChange={setLayoutView}
              sortBy={filters.sortBy}
              onSortChange={(val) => handleFilterChange({ sortBy: val as 'recommended' | 'distance' | 'rating' | 'newest' })}
              currentPage={currentPage}
              totalPages={totalHomePages}
              onPageChange={setCurrentPage}
              pageSize={pageSize}
              onOpenCreateProfile={() => setIsCreateModalOpen(true)}
            />

            {/* 3. How It Works */}
            <HowItWorksSection />

            {/* 4. Frequently Asked Questions */}
            <HomeFaqSection />

            {/* 5. About Shemale & Trans Escorts Near You */}
            <AboutTransEscortsSection />
          </>
        )}
      </main>

      {/* SEO, SERP & AI Grounding Inspector Modal */}
      <SEOSERPInspector
        isOpen={isSeoModalOpen}
        onClose={() => setIsSeoModalOpen(false)}
        currentTitle={seoData.title}
        currentDescription={seoData.description}
        currentUrl={currentPath}
        profiles={profiles}
      />

      {/* Location Selector Modal */}
      <LocationSelectorModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        selectedCity={filters.selectedCitySlug !== 'all' ? filters.selectedCitySlug : 'All Locations'}
        onSelectCity={(city) => {
          const found = LOCATION_DATA.flatMap((c) => c.states).flatMap((s) => s.cities).find((c) => c.name === city);
          if (found) {
            navigateTo(`/${found.countrySlug}/${found.stateSlug}/${found.slug}/`);
          } else {
            handleFilterChange({ selectedCitySlug: 'all' });
          }
        }}
        radiusMiles={radiusMiles}
        onRadiusChange={setRadiusMiles}
      />

      {/* Supabase DB Status Modal */}
      <DatabaseStatusModal
        isOpen={isDbModalOpen}
        onClose={() => setIsDbModalOpen(false)}
      />

      {/* Sync & Import Profiles from Friend Modal */}
      <SyncImportModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        currentProfiles={profiles}
        onImportProfiles={(importedList) => {
          setProfiles(importedList);
        }}
      />

      {/* Create Listing Modal */}
      <CreateListingModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={(newP) => {
          const slug = newP.displayName.toLowerCase().replace(/\s+/g, '-');
          handleAddProfile({
            ...newP,
            slug,
            galleryPhotos: [newP.avatarUrl, newP.coverUrl],
            fullDescription: newP.bioSnippet,
            languages: ['English (Fluent)'],
            availability: {
              statusText: 'Available Today',
              hours: '1:00 PM – 10:00 PM',
              scheduleNotice: '1 hour notice requested.',
              outcallAvailable: true,
              incallAvailable: true,
            },
            contactInfo: {
              preferredChannel: 'Inquiry Form',
              responseTime: 'Replies within 30 minutes',
              bookingPolicyNote: 'Strictly consensual social accompaniment.',
            },
            statusBadge: 'New Listing',
            lastUpdated: 'Just now',
          });
          navigateTo(`/profiles/${slug}`);
        }}
      />

      {/* Design System / UI Tester Drawer */}
      <DesignSystemTester
        isOpen={showTester}
        onClose={() => setShowTester(false)}
        onSimulateLoading={() => setSimMode('loading')}
        onSimulateError={() => setSimMode('error')}
        onSimulateEmpty={() => setSimMode('empty')}
        onResetNormal={() => setSimMode('normal')}
        currentSimMode={simMode}
      />


      {/* Architecture Guide Modal */}
      <ArchitectureGuide
        isOpen={showGuide}
        onClose={() => setShowGuide(false)}
      />

      {/* Footer */}
      <Footer onNavigateToLocation={navigateTo} />
    </div>
  );
}
