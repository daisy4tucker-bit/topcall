import React from 'react';
import { ShieldCheck, Radio, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { CATEGORIES } from '../data/mockProfiles';
import { FilterState } from '../types';

interface DirectoryFilterBarProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  totalResults: number;
}

export const DirectoryFilterBar: React.FC<DirectoryFilterBarProps> = ({
  filters,
  onFilterChange,
  totalResults,
}) => {
  return (
    <div className="space-y-4 mb-6">
      {/* Category scroll bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isSelected = filters.selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onFilterChange({ selectedCategory: cat })}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                isSelected
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Secondary filter & sort row */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-900/60 border border-zinc-800/80 p-3 rounded-xl text-xs">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-zinc-400 font-medium">
            <strong className="text-white">{totalResults}</strong> profiles found
          </span>
          <div className="h-4 w-px bg-zinc-800 hidden sm:block" />

          {/* Verified filter */}
          <button
            onClick={() => onFilterChange({ verifiedOnly: !filters.verifiedOnly })}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition cursor-pointer ${
              filters.verifiedOnly
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 font-semibold'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Verified ID Only</span>
          </button>

          {/* Online filter */}
          <button
            onClick={() => onFilterChange({ onlineOnly: !filters.onlineOnly })}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition cursor-pointer ${
              filters.onlineOnly
                ? 'bg-rose-500/15 border-rose-500/40 text-rose-300 font-semibold'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            <span>Available Nearby</span>
          </button>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 ml-auto">
          <ArrowUpDown className="w-3.5 h-3.5 text-zinc-500" />
          <span className="text-zinc-400">Sort:</span>
          <select
            value={filters.sortBy}
            onChange={(e) => onFilterChange({ sortBy: e.target.value as any })}
            aria-label="Sort profiles by"
            className="bg-zinc-900 border border-zinc-700 text-zinc-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-rose-500 cursor-pointer"
          >
            <option value="recommended">Featured / Recommended</option>
            <option value="distance">Nearest Distance</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Newest Profiles</option>
          </select>
        </div>
      </div>
    </div>
  );
};
