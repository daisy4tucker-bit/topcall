import React from 'react';
import { Search, MapPin, Filter } from 'lucide-react';

interface SearchComponentProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onFilterClick?: () => void;
}

export const SearchComponent: React.FC<SearchComponentProps> = ({
  searchQuery,
  onSearchChange,
  onFilterClick,
}) => {
  return (
    <div className="flex items-center gap-2 max-w-xl mx-auto w-full">
      <div className="relative flex-1">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search companion profiles..."
          className="w-full pl-9 pr-4 py-2 bg-slate-800/90 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-rose-500"
        />
      </div>
      {onFilterClick && (
        <button
          onClick={onFilterClick}
          className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white"
          title="Filters"
        >
          <Filter className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
