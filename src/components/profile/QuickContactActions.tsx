import React from 'react';
import { MessageSquare, Mail, Sparkles, Clock, PhoneCall } from 'lucide-react';
import { Profile } from '../../types';

interface QuickContactActionsProps {
  profile: Profile;
  isStickyBar?: boolean;
}

export const QuickContactActions: React.FC<QuickContactActionsProps> = ({ profile, isStickyBar = false }) => {
  const isAria = profile.slug === 'aria-sterling';

  // Specific contact endpoints for Aria Sterling
  const smsHref = isAria
    ? 'sms:+16233406916?body=Hey,%20i%20found%20your%20ad.%20Are%20you%20available%20now.'
    : `sms:${profile.contactInfo?.handleOrUsername || ''}?body=Hello%20${encodeURIComponent(profile.displayName)},%20are%20you%20available%20now?`;

  const emailHref = isAria
    ? 'mailto:Wellness4alls@gmail.com?subject=Massage%20Therapy%20Inquiry'
    : `mailto:${profile.contactInfo?.inquiryEmail || 'inquiry@aura-directory.com'}?subject=Inquiry%20for%20${encodeURIComponent(profile.displayName)}`;

  if (isStickyBar) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 backdrop-blur-xl border-t border-zinc-800 p-3 sm:hidden shadow-2xl animate-in slide-in-from-bottom duration-300">
        <div className="flex items-center gap-2.5 max-w-lg mx-auto">
          {/* SMS / Text Button */}
          <a
            href={smsHref}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-bold text-sm shadow-lg shadow-emerald-950/50 transition cursor-pointer"
            aria-label={`Send text SMS to ${profile.displayName}`}
          >
            <MessageSquare className="w-4 h-4 shrink-0" />
            <span>Text / SMS</span>
          </a>

          {/* Email Button */}
          <a
            href={emailHref}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-rose-600 hover:bg-rose-500 active:scale-98 text-white font-bold text-sm shadow-lg shadow-rose-950/50 transition cursor-pointer"
            aria-label={`Send email to ${profile.displayName}`}
          >
            <Mail className="w-4 h-4 shrink-0" />
            <span>Send Email</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-900/90 border-2 border-emerald-500/30 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-xs font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5" /> Direct Contact & Instant Booking
          </div>
          <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
            Connect with {profile.displayName}
          </h3>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{profile.availability?.statusText || 'Available Today'}</span>
          </div>
          <div className="hidden md:inline-flex items-center gap-1 text-xs text-zinc-400">
            <Clock className="w-3.5 h-3.5 text-zinc-500" />
            <span>Fast Replies</span>
          </div>
        </div>
      </div>

      <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
        For immediate appointments, custom wellness sessions, or inquiries, contact directly via SMS or email below:
      </p>

      {/* Prominent High-Visibility Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
        {/* SMS / Text Button */}
        <a
          href={smsHref}
          className="group relative flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-98 text-white font-extrabold text-base shadow-xl shadow-emerald-950/40 border border-emerald-400/40 transition-all transform hover:-translate-y-0.5 cursor-pointer"
          aria-label={`Send text SMS to ${profile.displayName}`}
        >
          <div className="p-2 rounded-xl bg-white/10 group-hover:bg-white/20 transition-colors">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <span className="block text-xs uppercase tracking-wider text-emerald-100 font-semibold">Immediate Text</span>
            <span className="block text-base font-bold text-white">Text / SMS</span>
          </div>
        </a>

        {/* Email Button */}
        <a
          href={emailHref}
          className="group relative flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 active:scale-98 text-white font-extrabold text-base shadow-xl shadow-rose-950/40 border border-rose-400/40 transition-all transform hover:-translate-y-0.5 cursor-pointer"
          aria-label={`Send email to ${profile.displayName}`}
        >
          <div className="p-2 rounded-xl bg-white/10 group-hover:bg-white/20 transition-colors">
            <Mail className="w-5 h-5 text-white" />
          </div>
          <div className="text-left">
            <span className="block text-xs uppercase tracking-wider text-rose-100 font-semibold">Direct Message</span>
            <span className="block text-base font-bold text-white">Send Email</span>
          </div>
        </a>
      </div>

      <div className="flex items-center justify-center gap-2 pt-1 text-[11px] text-zinc-500 text-center">
        <span>✓ 1-Tap Mobile Redirect</span>
        <span>•</span>
        <span>Strict Privacy & Discretion Guaranteed</span>
      </div>
    </div>
  );
};
