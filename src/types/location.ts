export interface City {
  id: string;
  slug: string; // e.g. "los-angeles", "toronto"
  name: string; // e.g. "Los Angeles"
  stateSlug: string; // e.g. "california"
  countrySlug: string; // e.g. "united-states"
  stateCode: string; // e.g. "CA", "ON"
  activeListings: number;
  isPopular?: boolean;
  heroImage?: string;
  description?: string;
  lat?: number;
  lng?: number;
}

export interface StateProvince {
  id: string;
  slug: string; // e.g. "california", "ontario"
  name: string; // e.g. "California", "Ontario"
  code: string; // e.g. "CA", "ON"
  countrySlug: string; // e.g. "united-states"
  activeListings: number;
  cities: City[];
}

export interface Country {
  id: string;
  slug: string; // e.g. "united-states", "canada"
  name: string; // e.g. "United States", "Canada"
  code: string; // e.g. "US", "CA"
  flag: string; // e.g. "🇺🇸", "🇨🇦"
  activeListings: number;
  states: StateProvince[];
}

export interface LocationRouteState {
  countrySlug?: string;
  stateSlug?: string;
  citySlug?: string;
}

export interface BreadcrumbItem {
  label: string;
  path: string;
  isActive?: boolean;
}

export type LocationBreadcrumb = BreadcrumbItem;

export interface LocationContext {
  country?: Country | null;
  state?: StateProvince | null;
  city?: City | null;
}
