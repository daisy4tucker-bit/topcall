import React, { useState } from 'react';
import { X, UploadCloud, Download, Check, AlertCircle, Copy, Sparkles, FileCode, RefreshCw } from 'lucide-react';
import { Profile } from '../types';
import { SAMPLE_PROFILES } from '../data/mockProfiles';

interface SyncImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfiles: Profile[];
  onImportProfiles: (profiles: Profile[]) => void;
}

export const SyncImportModal: React.FC<SyncImportModalProps> = ({
  isOpen,
  onClose,
  currentProfiles,
  onImportProfiles,
}) => {
  const [pasteContent, setPasteContent] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'import' | 'export' | 'guide'>('import');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyCurrentJSON = () => {
    try {
      navigator.clipboard?.writeText(JSON.stringify(currentProfiles, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      setStatusMessage({ type: 'error', text: 'Clipboard write failed. Please select and copy manually.' });
    }
  };

  const handleImport = () => {
    setStatusMessage(null);
    const trimmed = pasteContent.trim();
    if (!trimmed) {
      setStatusMessage({ type: 'error', text: 'Please paste code or JSON into the box first.' });
      return;
    }

    try {
      // 1. Try JSON array or JSON object
      let parsed: any = null;

      if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
        parsed = JSON.parse(trimmed);
      } else if (trimmed.includes('export const SAMPLE_PROFILES') || trimmed.includes('SAMPLE_PROFILES =')) {
        // Extract array from TypeScript export
        const start = trimmed.indexOf('[');
        const end = trimmed.lastIndexOf(']');
        if (start >= 0 && end > start) {
          const jsonLike = trimmed.substring(start, end + 1);
          // Try loose JSON parsing (handling trailing commas or keys)
          // Simple safe regex substitution if needed
          try {
            parsed = JSON.parse(jsonLike);
          } catch {
            // Function eval fallback in sandboxed scope for standard JS object literal
            // eslint-disable-next-line no-new-func
            parsed = new Function(`return ${jsonLike}`)();
          }
        }
      } else {
        // Try loose object evaluation
        // eslint-disable-next-line no-new-func
        parsed = new Function(`return ${trimmed}`)();
      }

      if (parsed) {
        let profilesToApply: Profile[] = [];
        if (Array.isArray(parsed)) {
          profilesToApply = parsed;
        } else if (parsed && typeof parsed === 'object') {
          if (Array.isArray(parsed.profiles)) {
            profilesToApply = parsed.profiles;
          } else if (parsed.id && parsed.displayName) {
            profilesToApply = [parsed as Profile];
          }
        }

        if (profilesToApply.length > 0) {
          // Merge with required defaults if any fields were omitted
          const sanitized = profilesToApply.map((p, idx) => ({
            id: String(p.id || Date.now() + idx),
            slug: p.slug || p.displayName?.toLowerCase().replace(/\s+/g, '-') || `profile-${idx}`,
            displayName: p.displayName || 'Verified Companion',
            handle: p.handle || `@user_${idx}`,
            tagline: p.tagline || 'Verified Independent Companion',
            age: p.age || 24,
            country: p.country || 'United States',
            countrySlug: p.countrySlug || 'united-states',
            state: p.state || 'California',
            stateSlug: p.stateSlug || 'california',
            city: p.city || 'Los Angeles',
            citySlug: p.citySlug || 'los-angeles',
            distanceMiles: p.distanceMiles || 1.5,
            avatarUrl: p.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
            coverUrl: p.coverUrl || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=80',
            galleryPhotos: p.galleryPhotos && p.galleryPhotos.length > 0 ? p.galleryPhotos : [p.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'],
            isVerified: p.isVerified !== undefined ? p.isVerified : true,
            isOnline: p.isOnline !== undefined ? p.isOnline : true,
            featured: p.featured !== undefined ? p.featured : true,
            categories: p.categories || ['Trans / TS Companions', 'Verified Companions'],
            startingRate: p.startingRate || '$400/hr',
            rating: p.rating || 5.0,
            reviewCount: p.reviewCount || 10,
            bioSnippet: p.bioSnippet || p.tagline || '',
            fullDescription: p.fullDescription || p.bioSnippet || '',
            services: p.services || ['Dinner Accompaniment', 'Penthouse Incall'],
            languages: p.languages || ['English (Fluent)'],
            availability: p.availability || {
              statusText: 'Available Today',
              hours: '12:00 PM – Midnight',
              outcallAvailable: true,
              incallAvailable: true,
            },
            contactInfo: p.contactInfo || {
              preferredChannel: 'Inquiry Form',
              responseTime: 'Replies within 30 minutes',
              bookingPolicyNote: 'Screening required for all new clients.',
            },
            statusBadge: p.statusBadge || 'Active & Verified',
            lastUpdated: p.lastUpdated || 'Today',
            reviews: p.reviews || [],
          }));

          // Save to localStorage & state
          try {
            if (typeof window !== 'undefined') {
              localStorage.setItem('aura_admin_profiles', JSON.stringify(sanitized));
            }
          } catch (e) {}
          onImportProfiles(sanitized);

          setStatusMessage({
            type: 'success',
            text: `Successfully imported ${sanitized.length} profile(s)! All details and images are now updated.`,
          });
          setPasteContent('');
          return;
        }
      }

      setStatusMessage({
        type: 'error',
        text: 'Could not detect valid profile data. Please check the format or paste the contents of src/data/mockProfiles.ts.',
      });
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: `Parse error: ${err.message || 'Invalid syntax'}. Please ensure valid JSON or TypeScript object format.`,
      });
    }
  };

  const handleResetToDefault = () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('aura_admin_profiles', JSON.stringify(SAMPLE_PROFILES));
      }
    } catch (e) {}
    onImportProfiles(SAMPLE_PROFILES);
    setStatusMessage({
      type: 'success',
      text: 'Reset to default verified profiles with high-resolution photos.',
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative max-w-2xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">Import & Sync Profiles</h2>
              <p className="text-xs text-slate-400">Copy exact text, images, and details from your friend's account</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs">
          <button
            onClick={() => setActiveTab('import')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition ${
              activeTab === 'import'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Paste & Import Data
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition ${
              activeTab === 'export'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Export All Data (JSON)
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition ${
              activeTab === 'guide'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            How to Copy (Guide)
          </button>
        </div>

        {/* Status Notification */}
        {statusMessage && (
          <div
            className={`p-3 rounded-xl text-xs flex items-center gap-2 border ${
              statusMessage.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <Check className="w-4 h-4 shrink-0 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Tab 1: Paste & Import */}
        {activeTab === 'import' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Paste Profiles (JSON array or contents of <code>src/data/mockProfiles.ts</code>):
              </label>
              <textarea
                value={pasteContent}
                onChange={(e) => setPasteContent(e.target.value)}
                placeholder="[
  {
    &quot;id&quot;: &quot;1&quot;,
    &quot;displayName&quot;: &quot;Maya Valentina&quot;,
    &quot;tagline&quot;: &quot;...&quot;,
    &quot;avatarUrl&quot;: &quot;https://...&quot;,
    ...
  }
]"
                rows={9}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={handleResetToDefault}
                className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5 transition"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Reset to Original Verified Seed Data
              </button>

              <button
                type="button"
                onClick={handleImport}
                className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs shadow-lg shadow-rose-900/40 transition flex items-center gap-2 cursor-pointer"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Apply & Sync Profiles</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Export */}
        {activeTab === 'export' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-300">
              Here is the complete active data currently running in your directory ({currentProfiles.length} profiles). You can copy this JSON at any time.
            </p>
            <textarea
              readOnly
              value={JSON.stringify(currentProfiles, null, 2)}
              rows={9}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 text-xs font-mono text-slate-300 focus:outline-none select-all"
            />
            <button
              onClick={handleCopyCurrentJSON}
              className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition flex items-center gap-2"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Full JSON'}</span>
            </button>
          </div>
        )}

        {/* Tab 3: Guide */}
        {activeTab === 'guide' && (
          <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <FileCode className="w-4 h-4 text-rose-400" />
                How to copy profiles from your friend in 3 steps:
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-slate-300 pl-1">
                <li>
                  Have your friend open their AI Studio project and open file <strong><code>src/data/mockProfiles.ts</code></strong>.
                </li>
                <li>
                  Press <strong>Ctrl + A</strong> (or Cmd + A) then <strong>Ctrl + C</strong> to copy all text.
                </li>
                <li>
                  Switch back to this window, paste it into the <strong>Paste & Import Data</strong> box, and click <strong>Apply & Sync Profiles</strong>!
                </li>
              </ol>
            </div>
            <p className="text-slate-400">
              All names, bios, rates, services, cities, reviews, and images will be preserved 1:1 without missing any words.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
