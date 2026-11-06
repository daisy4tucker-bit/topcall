import React from 'react';
import { LOCATION_DATA } from '../../data/locationHierarchy';

interface InternalLinkNetworkProps {
  onNavigate: (path: string) => void;
  currentCitySlug?: string;
  currentStateSlug?: string;
  currentCountrySlug?: string;
}

export const InternalLinkNetwork: React.FC<InternalLinkNetworkProps> = ({ onNavigate }) => {
  return (
    <div className="py-6 border-t border-slate-800 text-xs text-slate-400">
      <h4 className="font-semibold text-slate-300 mb-3">Directory Network Links</h4>
      <div className="flex flex-wrap gap-2">
        {LOCATION_DATA.flatMap((c) =>
          c.states.flatMap((s) =>
            s.cities.map((city) => (
              <button
                key={city.slug}
                onClick={() => onNavigate(`/${c.slug}/${s.slug}/${city.slug}/`)}
                className="hover:text-rose-400 transition-colors"
              >
                {city.name} Escorts •
              </button>
            ))
          )
        )}
      </div>
    </div>
  );
};
