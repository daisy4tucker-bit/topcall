import React, { useState } from 'react';
import { Mail, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';

interface NewsletterSubscribeProps {
  className?: string;
}

export const NewsletterSubscribe: React.FC<NewsletterSubscribeProps> = ({ className = '' }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState('');

  const validateEmail = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !validateEmail(email)) {
      setStatus('error');
      setFeedback('Please enter a valid email address.');
      return;
    }
    setStatus('loading');
    setFeedback('');

    // Simulate async submission and record to localStorage for marketing capture
    setTimeout(() => {
      try {
        const existing = JSON.parse(localStorage.getItem('aura_newsletter_subscribers') || '[]');
        if (!existing.includes(email.trim().toLowerCase())) {
          existing.push(email.trim().toLowerCase());
          localStorage.setItem('aura_newsletter_subscribers', JSON.stringify(existing));
        }
      } catch (err) {
        // Safe fallback
      }
      setStatus('success');
      setFeedback('Thank you for subscribing! You are now on the VIP list for new listings & private alerts.');
      setEmail('');
    }, 600);
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-zinc-900/60 border border-zinc-800/90 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
        <div className="max-w-md space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <Mail className="w-4 h-4" />
            </span>
            <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
              Subscribe to Directory Updates
            </h3>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Get discreet alerts when new verified companion profiles and luxury travel hosts are published in your city.
          </p>
        </div>

        <div className="w-full md:max-w-md">
          {status === 'success' ? (
            <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{feedback}</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-2">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <label htmlFor="newsletter-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="newsletter-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (status === 'error') {
                        setStatus('idle');
                        setFeedback('');
                      }
                    }}
                    placeholder="Enter your email address"
                    autoComplete="email"
                    disabled={status === 'loading'}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 text-zinc-100 placeholder-zinc-500 text-xs rounded-xl px-3.5 py-2.5 outline-none transition disabled:opacity-50"
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white text-xs font-bold shadow-md shadow-rose-500/20 transition cursor-pointer disabled:opacity-50 shrink-0"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Subscribing...</span>
                    </>
                  ) : (
                    <>
                      <span>Subscribe</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>

              {status === 'error' && (
                <p className="text-[11px] text-rose-400 font-medium pl-1">
                  {feedback}
                </p>
              )}

              <p className="text-[10px] text-zinc-500 pl-1">
                Strict privacy. No spam. Unsubscribe anytime with one click.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
