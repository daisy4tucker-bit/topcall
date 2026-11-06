import { Country, StateProvince, City, LocationRouteState, BreadcrumbItem } from './location';

export interface ProfileAvailability {
  statusText: 'Available Today' | 'Accepting Inquiries' | 'Advance Booking Only' | 'Away / Touring';
  hours: string;
  scheduleNotice?: string;
  outcallAvailable: boolean;
  incallAvailable: boolean;
  travelCities?: string[];
}

export interface ProfileContactInfo {
  preferredChannel: string;
  inquiryEmail?: string;
  handleOrUsername?: string;
  responseTime: string;
  bookingPolicyNote: string;
}

export interface Profile {
  id: string;
  slug: string; // e.g. "elena-vance", "sasha-laurent"
  displayName: string;
  handle: string;
  tagline: string;
  age: number;
  country: string;
  countrySlug: string; // "united-states", "canada"
  state: string;
  stateSlug: string; // "california", "ontario"
  city: string;
  citySlug: string; // "los-angeles", "toronto"
  distanceMiles?: number;
  avatarUrl: string;
  coverUrl: string;
  galleryPhotos: string[];
  isVerified: boolean;
  isOnline: boolean;
  featured: boolean;
  categories: string[];
  startingRate?: string;
  rating: number;
  reviewCount: number;
  bioSnippet: string;
  fullDescription: string;
  services: string[];
  languages: string[];
  availability: ProfileAvailability;
  contactInfo: ProfileContactInfo;
  statusBadge: 'Active & Verified' | 'Featured VIP' | 'New Listing' | 'Away' | string;
  lastUpdated: string;
  status?: string;
  isPublished?: boolean;
  reviews?: ProfileReview[];
}

export interface ProfileReview {
  id: string;
  authorName: string;
  rating: number;
  date: string;
  comment: string;
  verifiedClient: boolean;
}

export interface CityOption {
  name: string;
  state: string;
  count: number;
  popular?: boolean;
}

export interface FilterState {
  searchQuery: string;
  selectedCountrySlug: string;
  selectedStateSlug: string;
  selectedCitySlug: string;
  selectedCategory: string;
  verifiedOnly: boolean;
  onlineOnly: boolean;
  sortBy: 'recommended' | 'distance' | 'rating' | 'newest';
}

export * from './location';
