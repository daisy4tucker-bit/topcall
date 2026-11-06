import React from 'react';
import { ShieldCheck, Lock, HeartHandshake, MapPin } from 'lucide-react';

export const AboutTransEscortsSection: React.FC = () => {
  return (
    <section id="about-section" className="bg-[#071322] border-b border-slate-800/80 py-14 sm:py-20 text-slate-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            About Call Girls & Independent Escorts Near You
          </h2>
        </div>

        <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-slate-300">
          <p>
            Welcome to the premier nationwide directory dedicated exclusively to verified independent companions and escorts across the United States and Canada. Our mission is simple: to provide a safe, respectful, transparent, and direct platform connecting verified providers with discerning clients.
          </p>
          <p>
            Unlike traditional agency websites or unmoderated classified boards, every listing in our directory is managed by the independent provider themselves. Clients can review high-resolution photo portfolios, transparent starting rates, incall and outcall availability, and direct contact details without paying any broker fees or middleman commissions.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <div className="p-4 rounded-xl bg-[#081528] border border-slate-800/80 space-y-2">
              <div className="flex items-center gap-2 text-red-500 font-bold text-sm">
                <ShieldCheck className="w-4 h-4" />
                <span>Strict 18+ ID Verification</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                We uphold rigorous identity and legal age checks under 18 U.S.C. § 2257 to guarantee that all listed creators are verified adults operating consensually.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#081528] border border-slate-800/80 space-y-2">
              <div className="flex items-center gap-2 text-red-500 font-bold text-sm">
                <HeartHandshake className="w-4 h-4" />
                <span>Zero Middlemen & Direct Contact</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Connect directly with independent entertainers through their chosen phone, SMS, or encrypted messaging channels for authentic communication.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
