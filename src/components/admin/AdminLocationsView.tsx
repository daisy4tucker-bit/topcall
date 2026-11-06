import React from 'react';
import { LOCATION_DATA } from '../../data/locationHierarchy';
import { MapPin, Globe, CheckCircle } from 'lucide-react';

export const AdminLocationsView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Location Hierarchy & Routing Nodes</h1>
        <p className="text-xs text-slate-400">Canonical slugs, metropolitan regions, and SEO landing page registry.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {LOCATION_DATA.map((country) => (
          <div key={country.slug} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-rose-500" />
                <h3 className="font-bold text-white">{country.name} ({country.code})</h3>
              </div>
              <span className="text-xs text-slate-400">/{country.slug}/</span>
            </div>

            <div className="space-y-4">
              {country.states.map((state) => (
                <div key={state.slug} className="bg-slate-800/40 p-3 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-200">{state.name} ({state.code})</span>
                    <span className="text-[10px] text-slate-500">/{state.slug}/</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {state.cities.map((city) => (
                      <span
                        key={city.slug}
                        className="px-2 py-0.5 rounded-lg bg-slate-800 text-[11px] text-slate-300 border border-slate-700/60"
                      >
                        {city.name} {city.isPopular && '🔥'}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
