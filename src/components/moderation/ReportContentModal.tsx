import React, { useState } from 'react';
import { X, ShieldAlert, CheckCircle2, AlertTriangle, Send } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { submitSafetyReport } from '../../services/profileService';

export interface ReportContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: 'profile' | 'photograph';
  profileId: string;
  profileSlug: string;
  profileName: string;
  photoUrl?: string;
}

export const ReportContentModal: React.FC<ReportContentModalProps> = ({
  isOpen,
  onClose,
  targetType,
  profileId,
  profileSlug,
  profileName,
  photoUrl,
}) => {
  const [reason, setReason] = useState<string>('impersonation');
  const [details, setDetails] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const reportPayload = {
      profileSlug,
      reporterEmail: email.trim() || undefined,
      reason,
      details: photoUrl ? `[Photo Report: ${photoUrl}] ${details}` : details,
    };

    const result = await submitSafetyReport(reportPayload);
    setIsSubmitting(false);

    if (result.success) {
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setDetails('');
        setEmail('');
        onClose();
      }, 2000);
    } else {
      setErrorMessage(result.error || 'Failed to submit report. Please try again.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-lg w-full p-6 text-zinc-100 shadow-2xl relative space-y-5">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/20">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Report Content: {profileName}
            </h3>
            <p className="text-xs text-zinc-400">
              {targetType === 'photograph' ? 'Report a specific photograph' : 'Report this profile for investigation'}
            </p>
          </div>
        </div>

        {isSubmitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white">Report Received</h4>
            <p className="text-xs text-zinc-400 max-w-xs mx-auto">
              Thank you. Our moderation team has queued this item for compliance review.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {photoUrl && (
              <div className="flex items-center gap-3 p-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs">
                <img src={photoUrl} alt="Target" className="w-10 h-10 rounded-lg object-cover" />
                <span className="text-zinc-400 text-[11px] truncate flex-1">Reporting photograph item</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Reason for Report
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs rounded-xl px-3.5 py-2.5 outline-none focus:border-rose-500 transition"
              >
                <option value="impersonation">Fake Profile / Photo Impersonation</option>
                <option value="underage">Age Verification Violation</option>
                <option value="consent">Non-Consensual Imagery</option>
                <option value="scam">Fraud / Financial Scam</option>
                <option value="harassment">Harassment or Abuse</option>
                <option value="other">Other Community Guideline Breach</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Details & Description <span className="text-rose-400">*</span>
              </label>
              <Textarea
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Please describe why this content violates community guidelines (at least 10 characters)..."
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Your Email (Optional, for investigation updates)
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
              />
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-zinc-800">
              <Button type="button" variant="secondary" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="gradient"
                size="sm"
                isLoading={isSubmitting}
                leftIcon={<Send className="w-3.5 h-3.5" />}
              >
                Submit Report
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
