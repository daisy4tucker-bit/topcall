import React from 'react';
import { Heart, KeyRound, MapPin } from 'lucide-react';
import { NewsletterSubscribe } from './NewsletterSubscribe';

interface FooterProps {
  onNavigateToLocation?: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateToLocation }) => {
  const handleLocationClick = (path: string) => {
    if (onNavigateToLocation) {
      onNavigateToLocation(path);
    } else {
      window.history.pushState({}, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  return (
    <footer className="border-t border-slate-800 bg-[#050e1b] text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Newsletter Signup Banner */}
        <NewsletterSubscribe />

        {/* 4 Footer Columns matching Screenshot 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1 Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="relative flex items-center justify-center w-7 h-7 rounded-lg overflow-hidden bg-red-950/40 border border-red-500/40 shadow-[0_0_10px_rgba(239,68,68,0.4)]">
                <img
                  src="/logo.jpg"
                  alt="Top Call Girls Logo"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex items-center text-lg font-black tracking-tight">
                <span className="text-red-500">Top</span>
                <span className="text-white ml-1">Call</span>
                <span className="text-red-500 ml-1">Girls</span>
              </div>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-xs">
              A directory of independent escort companions across the USA & Canada. Real profiles, direct contact, no agencies.
            </p>
          </div>

          {/* Col 2 Browse */}
          <div>
            <h4 className="text-zinc-200 font-bold mb-3 uppercase tracking-wider text-[11px]">
              Browse
            </h4>
            <ul className="space-y-2 text-zinc-400">
              <li>
                <button
                  type="button"
                  onClick={() => handleLocationClick('/united-states/california/los-angeles/')}
                  className="hover:text-pink-400 transition cursor-pointer text-left"
                >
                  Los Angeles, CA
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleLocationClick('/united-states/new-york/new-york-city/')}
                  className="hover:text-pink-400 transition cursor-pointer text-left"
                >
                  New York City, NY
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleLocationClick('/united-states/florida/miami/')}
                  className="hover:text-pink-400 transition cursor-pointer text-left"
                >
                  Miami, FL
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleLocationClick('/united-states/nevada/las-vegas/')}
                  className="hover:text-pink-400 transition cursor-pointer text-left"
                >
                  Las Vegas, NV
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleLocationClick('/united-states/georgia/atlanta/')}
                  className="hover:text-pink-400 transition cursor-pointer text-left"
                >
                  Atlanta, GA
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleLocationClick('/united-states/illinois/chicago/')}
                  className="hover:text-pink-400 transition cursor-pointer text-left"
                >
                  Chicago, IL
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleLocationClick('/united-states/texas/houston/')}
                  className="hover:text-pink-400 transition cursor-pointer text-left"
                >
                  Houston, TX
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleLocationClick('/united-states/texas/dallas/')}
                  className="hover:text-pink-400 transition cursor-pointer text-left"
                >
                  Dallas, TX
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleLocationClick('/united-states/california/san-francisco/')}
                  className="hover:text-pink-400 transition cursor-pointer text-left"
                >
                  San Francisco, CA
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleLocationClick('/canada/ontario/toronto/')}
                  className="hover:text-pink-400 transition cursor-pointer text-left"
                >
                  Toronto, ON
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleLocationClick('/canada/british-columbia/vancouver/')}
                  className="hover:text-pink-400 transition cursor-pointer text-left"
                >
                  Vancouver, BC
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleLocationClick('/canada/quebec/montreal/')}
                  className="hover:text-pink-400 transition cursor-pointer text-left"
                >
                  Montreal, QC
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3 About */}
          <div>
            <h4 className="text-zinc-200 font-bold mb-3 uppercase tracking-wider text-[11px]">
              About
            </h4>
            <ul className="space-y-2 text-zinc-400 text-xs">
              <li>
                <span className="hover:text-pink-400 cursor-pointer">How It Works</span>
              </li>
              <li>
                <span className="hover:text-pink-400 cursor-pointer">FAQ</span>
              </li>
              <li>
                <span className="hover:text-pink-400 cursor-pointer">Terms of Use</span>
              </li>
              <li>
                <span className="hover:text-pink-400 cursor-pointer">Privacy Policy</span>
              </li>
              <li>
                <span className="hover:text-pink-400 cursor-pointer">Content Policy</span>
              </li>
              <li>
                <span className="hover:text-pink-400 cursor-pointer">Content Removal</span>
              </li>
            </ul>
          </div>

          {/* Col 4 Real People. Real Connections. */}
          <div className="space-y-2">
            <h4 className="text-zinc-100 font-bold text-sm">
              Real People.
              <br />
              Real Connections.
            </h4>
            <p className="text-zinc-500 text-xs leading-relaxed">
              Independent trans escorts in cities across the United States.
            </p>
          </div>
        </div>

        {/* 18+ Disclaimer Box */}
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-zinc-400 text-[11px] leading-relaxed flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <span className="px-2 py-0.5 rounded-lg bg-red-600 text-white font-extrabold text-[11px] shrink-0">
            18+
          </span>
          <p className="text-zinc-400">
            This website contains adult content and is intended for adults aged 18 or over (19 where that is the age of majority). By using this site you confirm you are of legal age in your province or territory. CallGirls City is an advertising platform only — we are not an escort agency, we do not arrange meetings, and we take no part in any arrangement made between users and advertisers.
          </p>
        </div>

        {/* Bottom copyright */}
        <div className="pt-4 border-t border-zinc-900 text-center text-zinc-500 text-xs">
          <p>© {new Date().getFullYear()} CallGirls City. All rights reserved. Strictly 18+ Adults Only.</p>
        </div>
      </div>
    </footer>
  );
};
