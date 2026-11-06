import React from 'react';
import { Globe, MapPin, Navigation, ArrowRight } from 'lucide-react';
import { LOCATION_DATA } from '../../data/locationHierarchy';
import { Button } from '../ui/Button';

interface LocationSelectorBarProps {
  selectedCountrySlug: string;
  selectedStateSlug: string;
  selectedCitySlug: string;
  onSelectCountry: (countrySlug: string) => void;
  onSelectState: (stateSlug: string) => void;
  onSelectCity: (citySlug: string) => void;
  onNavigateToLocation: (path: string) => void;
}

export const LocationSelectorBar: React.FC<LocationSelectorBarProps> = ({
  selectedCountrySlug,
  selectedStateSlug,
  selectedCitySlug,
  onSelectCountry,
  onSelectState,
  onSelectCity,
  onNavigateToLocation,
}) => {
  const currentCountry = LOCATION_DATA.find((c) => c.slug === selectedCountrySlug);
  const availableStates = currentCountry ? currentCountry.states : [];
  const currentState = availableStates.find((s) => s.slug === selectedStateSlug);
  const availableCities = currentState ? currentState.cities : [];

  const handleGo = () => {
    if (!selectedCountrySlug || selectedCountrySlug === 'all') {
      onNavigateToLocation('/');
      return;
    }
    if (!selectedStateSlug || selectedStateSlug === 'all') {
      onNavigateToLocation(`/${selectedCountrySlug}/`);
      return;
    }
    if (!selectedCitySlug || selectedCitySlug === 'all') {
      onNavigateToLocation(`/${selectedCountrySlug}/${selectedStateSlug}/`);
      return;
    }
    onNavigateToLocation(`/${selectedCountrySlug}/${selectedStateSlug}/${selectedCitySlug}/`);
  };

  return (
    <div className="bg-zinc-900/90 border border-zinc-800 p-4 rounded-2xl shadow-xl backdrop-blur-md">
      <div className="flex items-center gap-2 text-xs font-bold text-zinc-300 uppercase tracking-wider mb-3">
        <Globe className="w-4 h-4 text-rose-400" />
        <span>Hierarchy Location Filter</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {/* Country Select */}
        <div>
          <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
            1. Country
          </label>
          <select
            value={selectedCountrySlug}
            onChange={(e) => {
              onSelectCountry(e.target.value);
            }}
            aria-label="Filter by Country"
            className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs rounded-xl px-3 py-2.5 focus:border-rose-500 outline-none cursor-pointer"
          >
            <option value="all">🌐 All Countries (US & Canada)</option>
            {LOCATION_DATA.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.flag} {c.name} ({c.activeListings} profiles)
              </option>
            ))}
          </select>
        </div>

        {/* State/Province Select */}
        <div>
          <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
            2. State / Province
          </label>
          <select
            value={selectedStateSlug}
            disabled={!currentCountry}
            onChange={(e) => {
              onSelectState(e.target.value);
            }}
            aria-label="Filter by State or Province"
            className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs rounded-xl px-3 py-2.5 focus:border-rose-500 outline-none disabled:opacity-40 cursor-pointer"
          >
            <option value="all">
              {currentCountry ? 'All States / Provinces' : 'Select Country First'}
            </option>
            {availableStates.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.name} ({s.code}) — {s.activeListings} listings
              </option>
            ))}
          </select>
        </div>

        {/* City Select */}
        <div>
          <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
            3. Metro City
          </label>
          <select
            value={selectedCitySlug}
            disabled={!currentState}
            onChange={(e) => {
              onSelectCity(e.target.value);
            }}
            aria-label="Filter by City"
            className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs rounded-xl px-3 py-2.5 focus:border-rose-500 outline-none disabled:opacity-40 cursor-pointer"
          >
            <option value="all">
              {currentState ? 'All Cities in ' + currentState.name : 'Select State First'}
            </option>
            {availableCities.map((c) => (
              <option key={c.slug} value={c.slug}>
                📍 {c.name} ({c.activeListings} listings)
              </option>
            ))}
          </select>
        </div>

        {/* Direct Link / Apply CTA */}
        <div className="flex items-end">
          <Button
            variant="gradient"
            size="sm"
            className="w-full h-[38px]"
            onClick={handleGo}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Explore Location
          </Button>
        </div>
      </div>
    </div>
  );
};
