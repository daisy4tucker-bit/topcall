import React from 'react';
import { Sparkles, Shield, MapPin } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-[#071322] to-[#071322] py-12 border-b border-slate-800 text-center">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-3">
          Elite Verified Companions
        </h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          High-end companionship, dinner dates, and event accompaniment across the United States and Canada.
        </p>
      </div>
    </section>
  );
};
