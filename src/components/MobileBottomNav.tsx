import React from 'react';
import { Compass, Search, Heart, PlusCircle, HelpCircle } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: 'explore' | 'search' | 'favorites' | 'post' | 'guide';
  onTabChange: (tab: 'explore' | 'search' | 'favorites' | 'post' | 'guide') => void;
  favoritesCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onTabChange,
  favoritesCount,
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 py-1.5 px-3">
      <div className="flex items-center justify-around">
        <button
          onClick={() => onTabChange('explore')}
          className={`flex flex-col items-center gap-1 py-1 px-3 text-[10px] font-semibold transition-colors ${
            activeTab === 'explore' ? 'text-rose-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span>Explore</span>
        </button>

        <button
          onClick={() => onTabChange('favorites')}
          className={`relative flex flex-col items-center gap-1 py-1 px-3 text-[10px] font-semibold transition-colors ${
            activeTab === 'favorites' ? 'text-rose-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Heart className={`w-5 h-5 ${favoritesCount > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
          <span>Saved</span>
          {favoritesCount > 0 && (
            <span className="absolute top-0 right-2 w-3.5 h-3.5 bg-rose-600 text-white rounded-full text-[9px] flex items-center justify-center font-bold">
              {favoritesCount}
            </span>
          )}
        </button>

        <button
          onClick={() => onTabChange('post')}
          className="flex flex-col items-center gap-1 py-1 px-3 text-[10px] font-semibold text-rose-400 hover:text-rose-300"
        >
          <div className="w-7 h-7 rounded-full bg-rose-600 text-white flex items-center justify-center -mt-2 shadow-lg shadow-rose-900/40">
            <PlusCircle className="w-5 h-5" />
          </div>
          <span className="mt-0.5">Post</span>
        </button>

        <button
          onClick={() => onTabChange('guide')}
          className={`flex flex-col items-center gap-1 py-1 px-3 text-[10px] font-semibold transition-colors ${
            activeTab === 'guide' ? 'text-rose-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <HelpCircle className="w-5 h-5" />
          <span>Guide</span>
        </button>
      </div>
    </nav>
  );
};
