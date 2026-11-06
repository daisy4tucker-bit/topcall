import React, { useState } from 'react';
import { Share2, Check, Copy, Flame } from 'lucide-react';

interface SocialShareBarProps {
  displayName: string;
  tagline: string;
  slug?: string;
}

export const SocialShareBar: React.FC<SocialShareBarProps> = ({ displayName, tagline, slug }) => {
  const [copied, setCopied] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [shareCounts, setShareCounts] = useState({
    twitter: 89,
    facebook: 64,
    telegram: 142,
    direct: 116,
  });
  const [lastSharedPlatform, setLastSharedPlatform] = useState<string | null>(null);

  const fallbackOrigin = 'https://www.topcallgirls.online';
  const profilePath = slug ? `/profiles/${slug}` : (typeof window !== 'undefined' ? window.location.pathname : '');
  const currentUrl = typeof window !== 'undefined' && !window.location.origin.includes('localhost')
    ? `${window.location.origin}${profilePath}`
    : `${fallbackOrigin}${profilePath}`;
  const shareText = `Check out ${displayName} — ${tagline}`;
  const htmlAnchorTag = `<a href="${currentUrl}" title="${displayName} - Top Call Girls Directory">${displayName}</a>`;

  const handleShare = (platform: 'twitter' | 'facebook' | 'telegram' | 'direct') => {
    // Increment simulated share count for social proof
    setShareCounts((prev) => ({
      ...prev,
      [platform]: prev[platform] + 1,
    }));
    setLastSharedPlatform(platform);
    setTimeout(() => setLastSharedPlatform(null), 3000);

    const encodedUrl = encodeURIComponent(currentUrl);
    const encodedText = encodeURIComponent(shareText);

    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`, '_blank', 'noopener,noreferrer,width=550,height=420');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank', 'noopener,noreferrer,width=550,height=420');
    } else if (platform === 'telegram') {
      window.open(`https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`, '_blank', 'noopener,noreferrer,width=550,height=420');
    } else if (platform === 'direct') {
      if (navigator.share) {
        navigator.share({
          title: displayName,
          text: shareText,
          url: currentUrl,
        }).catch(() => {
          // Fallback to copy if user dismissed or canceled
          copyToClipboard();
        });
      } else {
        copyToClipboard();
      }
    }
  };

  const copyToClipboard = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const totalShares = shareCounts.twitter + shareCounts.facebook + shareCounts.telegram + shareCounts.direct;

  return (
    <section aria-labelledby="social-share-heading" className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 sm:p-7 shadow-xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/80 pb-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-rose-500/10 text-rose-300 text-xs font-semibold mb-1">
            <Share2 className="w-3.5 h-3.5" /> Share Listing
          </div>
          <h3 id="social-share-heading" className="text-base sm:text-lg font-bold text-white tracking-tight">
            Share {displayName}&apos;s Profile
          </h3>
        </div>

        {/* Social Proof Counter */}
        <div className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-xl text-amber-400 text-xs font-bold self-start sm:self-auto">
          <Flame className="w-4 h-4 fill-amber-400 text-amber-400 animate-pulse" />
          <span>{totalShares} Total Shares</span>
          <span className="text-zinc-500 font-normal hidden md:inline">• High Social Proof</span>
        </div>
      </div>

      <p className="text-xs text-zinc-400">
        Share with friends or recommend discreetly across social platforms. Every share increases listing visibility.
      </p>

      {/* Sharing Grid: Mobile Optimized */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
        {/* Twitter / X */}
        <button
          type="button"
          onClick={() => handleShare('twitter')}
          className="group flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-850 text-white transition-all transform hover:-translate-y-0.5 cursor-pointer shadow-sm"
          title="Share on X (Twitter)"
        >
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 fill-white group-hover:scale-110 transition-transform" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            <span className="text-xs font-bold text-zinc-200">X / Twitter</span>
          </div>
          <span className="text-[11px] font-semibold text-zinc-400 group-hover:text-amber-300 transition-colors">
            {shareCounts.twitter} shares
          </span>
        </button>

        {/* Facebook */}
        <button
          type="button"
          onClick={() => handleShare('facebook')}
          className="group flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-blue-600/60 hover:bg-blue-950/20 text-white transition-all transform hover:-translate-y-0.5 cursor-pointer shadow-sm"
          title="Share on Facebook"
        >
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 fill-blue-500 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span className="text-xs font-bold text-zinc-200">Facebook</span>
          </div>
          <span className="text-[11px] font-semibold text-zinc-400 group-hover:text-blue-400 transition-colors">
            {shareCounts.facebook} shares
          </span>
        </button>

        {/* Telegram */}
        <button
          type="button"
          onClick={() => handleShare('telegram')}
          className="group flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-sky-500/60 hover:bg-sky-950/20 text-white transition-all transform hover:-translate-y-0.5 cursor-pointer shadow-sm"
          title="Share on Telegram"
        >
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 fill-sky-400 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.458c.536-.196 1.006.128.832.941z" />
            </svg>
            <span className="text-xs font-bold text-zinc-200">Telegram</span>
          </div>
          <span className="text-[11px] font-semibold text-zinc-400 group-hover:text-sky-300 transition-colors">
            {shareCounts.telegram} shares
          </span>
        </button>

        {/* Direct / Copy Link */}
        <button
          type="button"
          onClick={() => handleShare('direct')}
          className="group flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-rose-500/60 hover:bg-rose-950/20 text-white transition-all transform hover:-translate-y-0.5 cursor-pointer shadow-sm"
          title="Copy Link or Native Share"
        >
          <div className="flex items-center gap-1.5">
            {copied ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <Copy className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
            )}
            <span className="text-xs font-bold text-zinc-200">
              {copied ? 'Link Copied!' : 'Copy Link'}
            </span>
          </div>
          <span className="text-[11px] font-semibold text-zinc-400 group-hover:text-rose-300 transition-colors">
            {shareCounts.direct} shares
          </span>
        </button>
      </div>

      {/* Direct HTML <a href="..."> Backlink Box */}
      <div className="mt-3 p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800/80 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-zinc-300 flex items-center gap-1.5">
            <span className="font-mono text-rose-400">&lt;a href&gt;</span> Direct Backlink Code
          </span>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard?.writeText(htmlAnchorTag);
              setCopiedHtml(true);
              setTimeout(() => setCopiedHtml(false), 2000);
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-[11px] font-bold text-white transition cursor-pointer"
          >
            {copiedHtml ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-rose-400" />}
            <span>{copiedHtml ? 'Copied HTML!' : 'Copy <a href>'}</span>
          </button>
        </div>
        <div className="p-2.5 rounded-xl bg-black/80 border border-zinc-800 font-mono text-[11px] text-emerald-400 break-all select-all">
          {htmlAnchorTag}
        </div>
      </div>

      {lastSharedPlatform && (
        <div className="text-center text-xs text-emerald-400 font-semibold animate-in fade-in flex items-center justify-center gap-1.5">
          <Check className="w-3.5 h-3.5" />
          <span>Thanks for sharing! Share counter updated.</span>
        </div>
      )}
    </section>
  );
};
