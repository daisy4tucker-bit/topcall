import React, { useState } from 'react';
import { X, FileX, CheckCircle2, AlertTriangle, Send } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';

export interface ContentRemovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetProfileSlug?: string;
}

export const ContentRemovalModal: React.FC<ContentRemovalModalProps> = ({
  isOpen,
  onClose,
  targetProfileSlug,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [relationship, setRelationship] = useState('self');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setFullName('');
        setEmail('');
        setReason('');
        onClose();
      }, 2000);
    }, 600);
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
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
            <FileX className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Content Removal & DMCA Notice
            </h3>
            <p className="text-xs text-zinc-400">
              Submit an official takedown request under 18 U.S.C. § 2257 or copyright laws
            </p>
          </div>
        </div>

        {isSubmitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white">Removal Request Logged</h4>
            <p className="text-xs text-zinc-400 max-w-xs mx-auto">
              Your takedown notice has been logged and assigned to the legal compliance team.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {targetProfileSlug && (
              <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300">
                Target Profile: <strong className="text-rose-400 font-mono">/profiles/{targetProfileSlug}</strong>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Your Legal Full Name <span className="text-rose-400">*</span>
              </label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="First & Last Name"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Contact Email <span className="text-rose-400">*</span>
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="legal.contact@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Relationship to Content
              </label>
              <select
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs rounded-xl px-3.5 py-2.5 outline-none focus:border-rose-500 transition"
              >
                <option value="self">I am the individual depicted in the content</option>
                <option value="copyright_holder">I am the exclusive copyright owner (DMCA)</option>
                <option value="authorized_rep">I am an authorized legal representative</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Basis for Removal <span className="text-rose-400">*</span>
              </label>
              <Textarea
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="State the factual basis for removal (unauthorized imagery, expired rights, personal privacy request)..."
                required
              />
            </div>

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
                Submit Takedown Notice
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
