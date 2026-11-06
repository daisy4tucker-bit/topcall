import React, { useState } from 'react';
import { MapPin, ShieldCheck, PlusCircle, Menu, X, Sparkles, SlidersHorizontal } from 'lucide-react';
import { POPULAR_CITIES } from '../data/mockProfiles';

interface NavbarProps {
  selectedCity: string;
  onSelectCity: (city: string) => void;
  onOpenCreateModal: () => void;
  onToggleGuide: () => void;
  showGuide: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  selectedCity,
  onSelectCity,
  onOpenCreateModal,
  onToggleGuide,
  showGuide,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
                  AURA
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  18+
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-medium hidden sm:block">
                Location-Based Adult Profile Directory
              </p>
            </div>
          </div>

          {/* Location Quick Switcher */}
          <div className="hidden md:flex items-center gap-2 relative">
            <button
              onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-sm font-medium text-zinc-200 transition"
            >
              <MapPin className="w-4 h-4 text-rose-400" />
              <span>{selectedCity === 'All Locations' ? 'Browse All Locations' : selectedCity}</span>
              <span className="text-xs text-zinc-400 bg-zinc-800 px-1.5 py-0.5 rounded-md">
                Change
              </span>
            </button>

            {cityDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl p-2 z-50">
                <div className="text-[11px] font-semibold uppercase text-zinc-400 px-3 py-1.5">
                  Select Metro Area
                </div>
                {POPULAR_CITIES.map((city) => (
                  <button
                    key={city.name}
                    onClick={() => {
                      onSelectCity(city.name);
                      setCityDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm text-left transition ${
                      selectedCity === city.name
                        ? 'bg-rose-500/20 text-rose-300 font-semibold'
                        : 'text-zinc-300 hover:bg-zinc-800'
                    }`}
                  >
                    <span>
                      {city.name} {city.state && `(${city.state})`}
                    </span>
                    <span className="text-xs text-zinc-500">{city.count}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={onToggleGuide}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition ${
                showGuide
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:bg-zinc-800'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Phase 1 Architecture Doc</span>
            </button>

            <button
              onClick={onOpenCreateModal}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-semibold text-sm shadow-md shadow-rose-500/20 transition cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post Listing (Demo)</span>
            </button>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-800 bg-zinc-950 p-4 space-y-4 animate-in slide-in-from-top duration-200">
          <div>
            <label className="text-xs font-semibold text-zinc-400 block mb-1">
              Select City / Metro Area:
            </label>
            <select
              value={selectedCity}
              onChange={(e) => {
                onSelectCity(e.target.value);
                setMobileMenuOpen(false);
              }}
              className="w-full bg-zinc-900 border border-zinc-800 text-zinc-200 text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-rose-500"
            >
              {POPULAR_CITIES.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name} {c.state ? `(${c.state})` : ''} — {c.count} listings
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2 pt-2 border-t border-zinc-900">
            <button
              onClick={() => {
                onToggleGuide();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm font-medium text-zinc-300"
            >
              <SlidersHorizontal className="w-4 h-4 text-amber-400" />
              <span>{showGuide ? 'Hide Architecture Guide' : 'View Phase 1 Guide'}</span>
            </button>

            <button
              onClick={() => {
                onOpenCreateModal();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-semibold text-sm shadow-md"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post Listing Preview</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
