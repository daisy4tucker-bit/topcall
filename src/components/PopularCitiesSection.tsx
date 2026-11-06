import React from 'react';
import { MapPin, ChevronRight } from 'lucide-react';
import { POPULAR_CITIES } from '../data/mockProfiles';

interface PopularCitiesSectionProps {
  onSelectCity: (citySlug: string) => void;
  onNavigateToCity?: (countrySlug: string, stateSlug: string, citySlug: string) => void;
}

export const PopularCitiesSection: React.FC<PopularCitiesSectionProps> = ({
  onSelectCity,
  onNavigateToCity,
}) => {
  const citiesList = [
    { name: 'Los Angeles', state: 'California', countrySlug: 'united-states', stateSlug: 'california', slug: 'los-angeles' },
    { name: 'New York City', state: 'New York', countrySlug: 'united-states', stateSlug: 'new-york', slug: 'new-york-city' },
    { name: 'Miami', state: 'Florida', countrySlug: 'united-states', stateSlug: 'florida', slug: 'miami' },
    { name: 'Las Vegas', state: 'Nevada', countrySlug: 'united-states', stateSlug: 'nevada', slug: 'las-vegas' },
    { name: 'Atlanta', state: 'Georgia', countrySlug: 'united-states', stateSlug: 'georgia', slug: 'atlanta' },
    { name: 'Chicago', state: 'Illinois', countrySlug: 'united-states', stateSlug: 'illinois', slug: 'chicago' },
    { name: 'Houston', state: 'Texas', countrySlug: 'united-states', stateSlug: 'texas', slug: 'houston' },
    { name: 'Dallas', state: 'Texas', countrySlug: 'united-states', stateSlug: 'texas', slug: 'dallas' },
    { name: 'San Francisco', state: 'California', countrySlug: 'united-states', stateSlug: 'california', slug: 'san-francisco' },
    { name: 'Phoenix', state: 'Arizona', countrySlug: 'united-states', stateSlug: 'arizona', slug: 'phoenix' },
    { name: 'Orlando', state: 'Florida', countrySlug: 'united-states', stateSlug: 'florida', slug: 'orlando' },
    { name: 'Seattle', state: 'Washington', countrySlug: 'united-states', stateSlug: 'washington', slug: 'seattle' },
    { name: 'San Diego', state: 'California', countrySlug: 'united-states', stateSlug: 'california', slug: 'san-diego' },
    { name: 'Denver', state: 'Colorado', countrySlug: 'united-states', stateSlug: 'colorado', slug: 'denver' },
    { name: 'Tampa', state: 'Florida', countrySlug: 'united-states', stateSlug: 'florida', slug: 'tampa' },
    { name: 'Boston', state: 'Massachusetts', countrySlug: 'united-states', stateSlug: 'massachusetts', slug: 'boston' },
  ];

  return (
    <section className="bg-[#060f1c] border-b border-slate-800/80 py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Section Heading */}
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Popular Cities
          </h2>
          <p className="text-sm text-slate-400">
            Explore verified independent companions in the most popular metropolitan areas.
          </p>
        </div>

        {/* City Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
          {citiesList.map((c) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => {
                if (onNavigateToCity) {
                  onNavigateToCity(c.countrySlug, c.stateSlug, c.slug);
                } else {
                  onSelectCity(c.slug);
                }
              }}
              className="group flex items-center justify-between p-3.5 rounded-xl bg-[#081528] border border-slate-800/80 hover:border-red-500/50 hover:bg-[#0c1e38] transition text-left cursor-pointer shadow-sm"
            >
              <div className="flex items-center gap-2.5 truncate">
                <MapPin className="w-4 h-4 text-red-500 shrink-0 group-hover:scale-110 transition" />
                <div className="truncate">
                  <span className="block text-xs sm:text-sm font-bold text-white group-hover:text-red-400 transition truncate">
                    {c.name}
                  </span>
                  <span className="block text-[11px] text-slate-400 truncate">
                    {c.state}
                  </span>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-red-400 transition shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
