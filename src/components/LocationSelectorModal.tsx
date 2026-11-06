import React, { useState } from 'react';
import { X, MapPin, Search, Globe, ChevronRight } from 'lucide-react';
import { LOCATION_DATA } from '../data/locationHierarchy';

interface LocationSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCity: string;
  onSelectCity: (city: string) => void;
  radiusMiles: number;
  onRadiusChange: (miles: number) => void;
}

export const LocationSelectorModal: React.FC<LocationSelectorModalProps> = ({
  isOpen,
  onClose,
  selectedCity,
  onSelectCity,
  radiusMiles,
  onRadiusChange,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCountrySlug, setSelectedCountrySlug] = useState('united-states');

  if (!isOpen) return null;

  const currentCountry = LOCATION_DATA.find((c) => c.slug === selectedCountrySlug) || LOCATION_DATA[0];

  const allCities = currentCountry.states.flatMap((s) =>
    s.cities.map((c) => ({ ...c, stateName: s.name }))
  );

  const filteredCities = allCities.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.stateName.toLowerCase().includes(search.toLowerCase()) ||
    c.stateCode.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative max-w-lg w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-rose-500" />
            <h3 className="text-lg font-bold text-white">Select Location</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Country Selector Tabs */}
        <div className="flex gap-2 pt-4 pb-3">
          {LOCATION_DATA.map((c) => (
            <button
              key={c.slug}
              onClick={() => setSelectedCountrySlug(c.slug)}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                selectedCountrySlug === c.slug
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-900/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{c.name}</span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative my-3">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search city or state..."
            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-rose-500"
          />
        </div>

        {/* Radius filter slider */}
        <div className="py-2 px-3 rounded-xl bg-slate-800/50 border border-slate-800 mb-3 flex items-center justify-between text-xs">
          <span className="text-slate-400">Search Radius:</span>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={radiusMiles}
              onChange={(e) => onRadiusChange(Number(e.target.value))}
              className="accent-rose-500 cursor-pointer"
            />
            <span className="font-semibold text-rose-400 w-12 text-right">{radiusMiles} mi</span>
          </div>
        </div>

        {/* Cities List */}
        <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 max-h-60 scrollbar-thin">
          <button
            onClick={() => {
              onSelectCity('all');
              onClose();
            }}
            className="w-full p-2.5 rounded-xl bg-slate-800/40 hover:bg-slate-800 text-left text-xs font-semibold text-slate-300 flex items-center justify-between"
          >
            <span>All Locations ({currentCountry.name})</span>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>

          {filteredCities.map((city) => (
            <button
              key={city.slug}
              onClick={() => {
                onSelectCity(city.name);
                onClose();
              }}
              className="w-full p-2.5 rounded-xl bg-slate-800/40 hover:bg-rose-950/40 hover:border-rose-900/60 border border-transparent text-left text-xs font-medium text-slate-200 flex items-center justify-between transition-colors"
            >
              <div>
                <span className="font-semibold text-white">{city.name}</span>
                <span className="text-slate-400 ml-1.5">({city.stateCode})</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
