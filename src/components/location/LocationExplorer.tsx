import React, { useState } from 'react';
import { MapPin, Globe, ArrowRight, Sparkles, Compass } from 'lucide-react';
import { LOCATION_DATA } from '../../data/locationHierarchy';

interface LocationExplorerProps {
  onNavigateToLocation: (path: string) => void;
}

export const LocationExplorer: React.FC<LocationExplorerProps> = ({ onNavigateToLocation }) => {
  const [selectedCountrySlug, setSelectedCountrySlug] = useState<string>('united-states');
  const currentCountry = LOCATION_DATA.find((c) => c.slug === selectedCountrySlug) || LOCATION_DATA[0];

  return (
    <section aria-labelledby="browse-locations-title" className="py-12 border-t border-zinc-850">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-semibold mb-2">
              <Compass className="w-3.5 h-3.5" /> Direct Location Hierarchy
            </div>
            <h2 id="browse-locations-title" className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Browse Companions by Region
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm mt-1">
              Select your territory to view verified independent escorts and companion listings.
            </p>
          </div>

          {/* Country Switcher Tabs */}
          <div className="flex items-center bg-zinc-900 p-1.5 rounded-2xl border border-zinc-800 shrink-0">
            {LOCATION_DATA.map((country) => {
              const isSelected = selectedCountrySlug === country.slug;
              return (
                <button
                  key={country.slug}
                  onClick={() => setSelectedCountrySlug(country.slug)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    isSelected
                      ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <span>{country.flag}</span>
                  <span>{country.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${isSelected ? 'bg-black/30' : 'bg-zinc-800'}`}>
                    {country.activeListings}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* State/Province & City Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentCountry.states.map((state) => (
            <div
              key={state.slug}
              className="bg-zinc-900/80 border border-zinc-800/80 hover:border-zinc-700 rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white tracking-tight">{state.name}</span>
                    <span className="text-[10px] font-bold text-rose-300 bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20">
                      {state.code}
                    </span>
                  </div>
                  <button
                    onClick={() => onNavigateToLocation(`/${currentCountry.slug}/${state.slug}/`)}
                    className="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <span>View State</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {/* City list under state */}
                <div className="space-y-2 mt-4">
                  {state.cities.map((city) => (
                    <button
                      key={city.slug}
                      onClick={() =>
                        onNavigateToLocation(
                          `/${currentCountry.slug}/${state.slug}/${city.slug}/`
                        )
                      }
                      className="w-full flex items-center justify-between p-2.5 rounded-xl bg-zinc-950/60 hover:bg-zinc-800/80 border border-zinc-855 hover:border-zinc-700 text-xs transition cursor-pointer text-left group"
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-zinc-500 group-hover:text-rose-400 transition-colors" />
                        <span className="text-zinc-300 group-hover:text-white font-medium">
                          {city.name}
                        </span>
                        {city.isPopular && (
                          <span className="text-[9px] uppercase font-bold text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                            Hot
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-zinc-500 group-hover:text-zinc-300 font-medium">
                        {city.activeListings} profiles &rarr;
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* State Summary Footer */}
              <div className="pt-4 mt-4 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500">
                <span>Total State Active Listings</span>
                <span className="font-bold text-zinc-300">{state.activeListings} verified</span>
              </div>
            </div>
          ))}
        </div>

        {/* View full country directory link */}
        <div className="mt-8 text-center">
          <button
            onClick={() => onNavigateToLocation(`/${currentCountry.slug}/`)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-xs font-semibold text-zinc-200 transition cursor-pointer"
          >
            <span>Explore All {currentCountry.name} Profiles ({currentCountry.activeListings})</span>
            <ArrowRight className="w-4 h-4 text-rose-400" />
          </button>
        </div>
      </div>
    </section>
  );
};
