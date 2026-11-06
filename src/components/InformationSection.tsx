import React from 'react';
import { ShieldCheck, UserCheck, HeartHandshake } from 'lucide-react';

export const InformationSection: React.FC = () => {
  return (
    <section className="bg-slate-900/60 border-t border-slate-800 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <ShieldCheck className="w-6 h-6 text-rose-500 mb-2" />
          <h4 className="font-bold text-white text-sm mb-1">Authentic ID Verification</h4>
          <p className="text-slate-400">All published profiles undergo strict 18+ identity verification to safeguard clients and talent alike.</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <UserCheck className="w-6 h-6 text-sky-400 mb-2" />
          <h4 className="font-bold text-white text-sm mb-1">Direct Independent Contact</h4>
          <p className="text-slate-400">Communicate directly with verified companions via Telegram, WhatsApp, phone, or private email.</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <HeartHandshake className="w-6 h-6 text-amber-400 mb-2" />
          <h4 className="font-bold text-white text-sm mb-1">Discretion & Etiquette</h4>
          <p className="text-slate-400">Our community strictly upholds consensual accompaniment, mutual respect, and total privacy standards.</p>
        </div>
      </div>
    </section>
  );
};
