import { Country, StateProvince, City, BreadcrumbItem } from '../types/location';

export const LOCATION_DATA: Country[] = [
  {
    id: 'country-us',
    slug: 'united-states',
    name: 'United States',
    code: 'US',
    flag: '🇺🇸',
    activeListings: 184,
    states: [
      {
        id: 'state-us-ca',
        slug: 'california',
        name: 'California',
        code: 'CA',
        countrySlug: 'united-states',
        activeListings: 78,
        cities: [
          {
            id: 'city-us-ca-la',
            slug: 'los-angeles',
            name: 'Los Angeles',
            stateSlug: 'california',
            countrySlug: 'united-states',
            stateCode: 'CA',
            activeListings: 48,
            isPopular: true,
            heroImage: 'https://images.unsplash.com/photo-1580655653885-65763b2597d0?w=1200&auto=format&fit=crop&q=80',
            description: 'Discover verified independent companions, VIP models, and luxury escorts in the metropolitan area.',
            lat: 34.0522,
            lng: -118.2437,
          },
          {
            id: 'city-us-ca-sf',
            slug: 'san-francisco',
            name: 'San Francisco',
            stateSlug: 'california',
            countrySlug: 'united-states',
            stateCode: 'CA',
            activeListings: 18,
            isPopular: true,
            heroImage: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1200&auto=format&fit=crop&q=80',
            description: 'Top-rated companion profiles and discreet dinner accompaniment throughout the San Francisco Bay Area and Silicon Valley.',
            lat: 37.7749,
            lng: -122.4194,
          },
          {
            id: 'city-us-ca-sd',
            slug: 'san-diego',
            name: 'San Diego',
            stateSlug: 'california',
            countrySlug: 'united-states',
            stateCode: 'CA',
            activeListings: 12,
            isPopular: false,
            heroImage: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=1200&auto=format&fit=crop&q=80',
            description: 'Coastal companions and social escort listings in La Jolla, Gaslamp Quarter, and Coronado.',
            lat: 32.7157,
            lng: -117.1611,
          },
        ],
      },
      {
        id: 'state-us-fl',
        slug: 'florida',
        name: 'Florida',
        code: 'FL',
        countrySlug: 'united-states',
        activeListings: 46,
        cities: [
          {
            id: 'city-us-fl-miami',
            slug: 'miami',
            name: 'Miami',
            stateSlug: 'florida',
            countrySlug: 'united-states',
            stateCode: 'FL',
            activeListings: 36,
            isPopular: true,
            heroImage: 'https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=1200&auto=format&fit=crop&q=80',
            description: 'Glamorous nightlife companions, yacht hostesses, and high-end companion profiles in the metropolitan area.',
            lat: 25.7617,
            lng: -80.1918,
          },
          {
            id: 'city-us-fl-orlando',
            slug: 'orlando',
            name: 'Orlando',
            stateSlug: 'florida',
            countrySlug: 'united-states',
            stateCode: 'FL',
            activeListings: 10,
            isPopular: false,
            heroImage: 'https://images.unsplash.com/photo-1575089776834-8be34696ffb9?w=1200&auto=format&fit=crop&q=80',
            description: 'Private incall and outcall companion services in Downtown Orlando and surrounding resort districts.',
            lat: 28.5383,
            lng: -81.3792,
          },
        ],
      },
      {
        id: 'state-us-nv',
        slug: 'nevada',
        name: 'Nevada',
        code: 'NV',
        countrySlug: 'united-states',
        activeListings: 34,
        cities: [
          {
            id: 'city-us-nv-vegas',
            slug: 'las-vegas',
            name: 'Las Vegas',
            stateSlug: 'nevada',
            countrySlug: 'united-states',
            stateCode: 'NV',
            activeListings: 34,
            isPopular: true,
            heroImage: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1200&auto=format&fit=crop&q=80',
            description: 'Premier casino companions, VIP event dates, and luxury Strip accompaniment available 24/7.',
            lat: 36.1699,
            lng: -115.1398,
          },
        ],
      },
      {
        id: 'state-us-ny',
        slug: 'new-york',
        name: 'New York',
        code: 'NY',
        countrySlug: 'united-states',
        activeListings: 26,
        cities: [
          {
            id: 'city-us-ny-nyc',
            slug: 'new-york-city',
            name: 'New York City',
            stateSlug: 'new-york',
            countrySlug: 'united-states',
            stateCode: 'NY',
            activeListings: 26,
            isPopular: true,
            heroImage: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1200&auto=format&fit=crop&q=80',
            description: 'Sophisticated escorts, independent artists, and elite high-society companions for cultural and fine dining events.',
            lat: 40.7128,
            lng: -74.006,
          },
        ],
      },
    ],
  },
  {
    id: 'country-ca',
    slug: 'canada',
    name: 'Canada',
    code: 'CA',
    flag: '🇨🇦',
    activeListings: 62,
    states: [
      {
        id: 'state-ca-on',
        slug: 'ontario',
        name: 'Ontario',
        code: 'ON',
        countrySlug: 'canada',
        activeListings: 32,
        cities: [
          {
            id: 'city-ca-on-toronto',
            slug: 'toronto',
            name: 'Toronto',
            stateSlug: 'ontario',
            countrySlug: 'canada',
            stateCode: 'ON',
            activeListings: 24,
            isPopular: true,
            heroImage: 'https://images.unsplash.com/photo-1507992781348-310259076fa0?w=1200&auto=format&fit=crop&q=80',
            description: 'Elite GTA companions, fine dining partners, and verified independent escorts in the metropolitan area.',
            lat: 43.6532,
            lng: -79.3832,
          },
          {
            id: 'city-ca-on-ottawa',
            slug: 'ottawa',
            name: 'Ottawa',
            stateSlug: 'ontario',
            countrySlug: 'canada',
            stateCode: 'ON',
            activeListings: 8,
            isPopular: false,
            heroImage: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1200&auto=format&fit=crop&q=80',
            description: 'Bilingual companions and discreet private bookings in Canada’s capital region.',
            lat: 45.4215,
            lng: -75.6972,
          },
        ],
      },
      {
        id: 'state-ca-bc',
        slug: 'british-columbia',
        name: 'British Columbia',
        code: 'BC',
        countrySlug: 'canada',
        activeListings: 18,
        cities: [
          {
            id: 'city-ca-bc-vancouver',
            slug: 'vancouver',
            name: 'Vancouver',
            stateSlug: 'british-columbia',
            countrySlug: 'canada',
            stateCode: 'BC',
            activeListings: 18,
            isPopular: true,
            heroImage: 'https://images.unsplash.com/photo-1559511260-66a65e09b245?w=1200&auto=format&fit=crop&q=80',
            description: 'West Coast companions, Yaletown private incall studios, and luxury Whistler travel companions.',
            lat: 49.2827,
            lng: -123.1207,
          },
        ],
      },
      {
        id: 'state-ca-qc',
        slug: 'quebec',
        name: 'Quebec',
        code: 'QC',
        countrySlug: 'canada',
        activeListings: 12,
        cities: [
          {
            id: 'city-ca-qc-montreal',
            slug: 'montreal',
            name: 'Montreal',
            stateSlug: 'quebec',
            countrySlug: 'canada',
            stateCode: 'QC',
            activeListings: 12,
            isPopular: true,
            heroImage: 'https://images.unsplash.com/photo-1519178173428-2d33454b5190?w=1200&auto=format&fit=crop&q=80',
            description: 'Charming French-speaking companions, Old Montreal nightlife guides, and luxury independent models.',
            lat: 45.5017,
            lng: -73.5673,
          },
        ],
      },
    ],
  },
];

// Helper to look up country, state, city from slugs
export function getLocationBySlugs(countrySlug?: string, stateSlug?: string, citySlug?: string) {
  if (!countrySlug) return null;
  const country = LOCATION_DATA.find((c) => c.slug === countrySlug);
  if (!country) return null;

  if (!stateSlug) {
    return { country, state: null, city: null };
  }

  const state = country.states.find((s) => s.slug === stateSlug);
  if (!state) return { country, state: null, city: null };

  if (!citySlug) {
    return { country, state, city: null };
  }

  const city = state.cities.find((c) => c.slug === citySlug);
  return { country, state, city: city || null };
}

// Helper to construct breadcrumb trail
export function buildLocationBreadcrumbs(
  countrySlug?: string,
  stateSlug?: string,
  citySlug?: string
): BreadcrumbItem[] {
  const crumbs: BreadcrumbItem[] = [
    { label: 'Directory Home', path: '/' },
  ];

  if (!countrySlug) return crumbs;

  const country = LOCATION_DATA.find((c) => c.slug === countrySlug);
  if (country) {
    const isCountryActive = !stateSlug && !citySlug;
    crumbs.push({
      label: country.name,
      path: `/${country.slug}/`,
      isActive: isCountryActive,
    });

    if (stateSlug) {
      const state = country.states.find((s) => s.slug === stateSlug);
      if (state) {
        const isStateActive = !citySlug;
        crumbs.push({
          label: state.name,
          path: `/${country.slug}/${state.slug}/`,
          isActive: isStateActive,
        });

        if (citySlug) {
          const city = state.cities.find((c) => c.slug === citySlug);
          if (city) {
            crumbs.push({
              label: city.name,
              path: `/${country.slug}/${state.slug}/${city.slug}/`,
              isActive: true,
            });
          }
        }
      }
    }
  }

  return crumbs;
}

// Get flat list of all popular cities
export function getPopularCities(): City[] {
  const popular: City[] = [];
  LOCATION_DATA.forEach((country) => {
    country.states.forEach((state) => {
      state.cities.forEach((city) => {
        if (city.isPopular) {
          popular.push(city);
        }
      });
    });
  });
  return popular;
}
