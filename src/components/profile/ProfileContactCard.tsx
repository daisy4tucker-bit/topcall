import React, { useState } from 'react';
import { MessageSquare, Mail, Send, CheckCircle2, ShieldCheck, Clock, AlertTriangle } from 'lucide-react';
import { Profile } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';

interface ProfileContactCardProps {
  profile: Profile;
}

export const ProfileContactCard: React.FC<ProfileContactCardProps> = ({ profile }) => {
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [eventType, setEventType] = useState('Dinner & Social Event');
  const [message, setMessage] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 800);
  };

  if (profile.slug === 'aria-sterling') {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 text-xs font-semibold mb-1">
              <MessageSquare className="w-3.5 h-3.5" /> Direct Booking & Inquiries
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              Connect with {profile.displayName}
            </h3>
          </div>
          <div className="text-right hidden sm:block">
            <span className="text-[10px] text-zinc-400 block font-semibold">Availability</span>
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Available Today
            </span>
          </div>
        </div>

        <div className="space-y-4 py-2">
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            For prompt booking, inquiries, and custom session scheduling, please contact directly via SMS or email below:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <a
              href="sms:+16233406916?body=Hey,%20i%20found%20your%20ad.%20Are%20you%20available%20now."
              className="flex items-center justify-center gap-2.5 p-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg transition transform hover:scale-[1.02] cursor-pointer"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Text / SMS</span>
            </a>

            <a
              href="mailto:Wellness4alls@gmail.com?subject=Massage%20Therapy%20Inquiry"
              className="flex items-center justify-center gap-2.5 p-4 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-lg transition transform hover:scale-[1.02] cursor-pointer"
            >
              <Mail className="w-5 h-5" />
              <span>Send Email</span>
            </a>
          </div>

          <p className="text-[11px] text-zinc-500 text-center pt-2">
            Professional & discreet wellness inquiries only. We look forward to welcoming you!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-rose-500/10 text-rose-300 text-xs font-semibold mb-1">
            <Mail className="w-3.5 h-3.5" /> Public Contact & Inquiry
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            Inquire with {profile.displayName}
          </h3>
        </div>
        <div className="text-right hidden sm:block">
          <span className="text-[10px] text-zinc-400 block font-semibold">Response Time</span>
          <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {profile.contactInfo.responseTime}
          </span>
        </div>
      </div>

      {isSubmitted ? (
        <div className="bg-emerald-950/20 border border-emerald-500/40 p-6 rounded-2xl text-center space-y-3 animate-in fade-in">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-white">Inquiry Received</h4>
          <p className="text-xs text-zinc-300 max-w-sm mx-auto leading-relaxed">
            Your inquiry has been logged for {profile.displayName}. In Phase 5 (Messaging System), real-time encrypted messages and SMS alerts will dispatch directly.
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setIsSubmitted(false);
              setMessage('');
            }}
          >
            Send Another Inquiry
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Your Name or Alias"
              required
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="e.g. Marcus"
            />
            <Input
              label="Your Contact Email"
              type="email"
              required
              value={senderEmail}
              onChange={(e) => setSenderEmail(e.target.value)}
              placeholder="name@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Event or Engagement Type
            </label>
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs rounded-xl px-3 py-2.5 focus:border-rose-500 outline-none cursor-pointer"
            >
              <option value="Dinner & Social Event">Formal Dinner / Restaurant Accompaniment</option>
              <option value="Arts, Gala or Theatre">Gala, Theatre, or Arts Exhibition</option>
              <option value="Private Studio Incall">Private Incall Studio Visit</option>
              <option value="Travel & Vacation">Vacation / Travel Companion</option>
              <option value="General Consultation">General Inquiry / Availability Check</option>
            </select>
          </div>

          <Textarea
            label="Inquiry Details & Proposed Schedule"
            required
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`Hello ${profile.displayName}, I would like to inquire about your availability for...`}
          />

          {/* Legal / Screening Checkbox */}
          <label className="flex items-start gap-2 text-[11px] text-zinc-400 bg-zinc-950 p-3 rounded-xl border border-zinc-800 cursor-pointer">
            <input
              type="checkbox"
              required
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-0.5 rounded border-zinc-700 accent-rose-500 cursor-pointer"
            />
            <span>
              I certify that I am at least 18 years of age, propose consensual social accompaniment, and agree to respectful communication.
            </span>
          </label>

          <Button
            type="submit"
            variant="gradient"
            size="md"
            className="w-full"
            isLoading={isLoading}
            leftIcon={<Send className="w-4 h-4" />}
          >
            Submit Public Inquiry
          </Button>

          <p className="text-[11px] text-zinc-500 text-center">
            {profile.contactInfo.bookingPolicyNote}
          </p>
        </form>
      )}
    </div>
  );
};
