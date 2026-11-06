import React, { useState } from 'react';
import { MapPin, Heart, Menu, X, Search, Database } from 'lucide-react';

interface HeaderProps {
  selectedCity: string;
  onOpenLocationModal: () => void;
  favoritesCount: number;
  onOpenFavorites: () => void;
  onToggleDevPanel: () => void;
  showDevPanel: boolean;
  onOpenDbModal: () => void;
  onOpenSeoModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedCity,
  onOpenLocationModal,
  favoritesCount,
  onOpenFavorites,
  onOpenDbModal,
  onOpenSeoModal,
}) => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const handleAboutClick = () => {
    const target = document.getElementById('about-section');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.history.pushState({}, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
      setTimeout(() => {
        const el = document.getElementById('about-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new PopStateEvent('popstate'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#081528] backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <a
            href="/"
            onClick={handleLogoClick}
            className="flex items-center gap-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded-lg"
            aria-label="Top Call Girls Home"
          >
            <div className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden bg-red-950/40 border border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.5)] group-hover:scale-105 transition-transform">
              <img
                src="/logo.jpg"
                alt="Top Call Girls Logo"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 ring-1 ring-[#081528] animate-ping" />
            </div>
            <div className="flex items-center text-xl sm:text-2xl font-black tracking-tight">
              <span className="text-red-500">Top</span>
              <span className="text-white ml-1.5">Call</span>
              <span className="text-red-500 ml-1.5">Girls</span>
            </div>
          </a>

          {/* Desktop Right Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <button
              type="button"
              onClick={handleAboutClick}
              className="text-slate-300 hover:text-white text-sm font-medium transition cursor-pointer"
            >
              About
            </button>

            {/* Location indicator */}
            <button
              type="button"
              onClick={onOpenLocationModal}
              className="flex items-center gap-2 text-xs text-slate-200 hover:text-white px-3.5 py-2 rounded-full bg-slate-900/80 border border-slate-700/80 hover:border-red-500/50 shadow-md transition cursor-pointer group"
            >
              <MapPin className="w-4 h-4 text-red-500 fill-red-500/30 drop-shadow-[0_0_8px_rgba(239,68,68,0.6)] group-hover:scale-110 transition-transform" />
              <span className="font-semibold">{selectedCity}</span>
            </button>

            {/* Saved favorites */}
            <button
              type="button"
              onClick={onOpenFavorites}
              className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded-full bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition cursor-pointer"
              title="Saved profiles"
            >
              <Heart className={`w-3.5 h-3.5 ${favoritesCount > 0 ? 'text-red-500 fill-red-500' : 'text-slate-400'}`} />
              <span>{favoritesCount}</span>
            </button>
          </div>

          {/* Mobile Right Controls */}
          <div className="flex md:hidden items-center gap-3">
            <button
              type="button"
              onClick={handleAboutClick}
              className="text-slate-300 hover:text-white text-sm font-medium transition cursor-pointer"
            >
              About
            </button>
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
              aria-label="Toggle navigation menu"
            >
              {mobileDrawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileDrawerOpen && (
        <div className="md:hidden border-t border-slate-800 bg-[#081528] p-4 space-y-3 animate-in slide-in-from-top duration-200 shadow-2xl">
          <button
            type="button"
            onClick={() => {
              handleAboutClick();
              setMobileDrawerOpen(false);
            }}
            className="w-full text-left p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-200 text-sm font-medium"
          >
            About Directory
          </button>
          <button
            type="button"
            onClick={() => {
              onOpenLocationModal();
              setMobileDrawerOpen(false);
            }}
            className="w-full flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-200 text-sm font-semibold"
          >
            <MapPin className="w-4 h-4 text-red-500 fill-red-500/30 drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
            <span>Select Location: {selectedCity}</span>
          </button>
        </div>
      )}
    </header>
  );
};
