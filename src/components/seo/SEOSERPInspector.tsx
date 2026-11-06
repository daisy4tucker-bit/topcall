import React, { useState, useEffect } from 'react';
import {
  X,
  Search,
  Globe,
  CheckCircle,
  Download,
  FileCode,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  MapPin,
  Users,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  ArrowRight,
  Terminal,
} from 'lucide-react';
import { Profile } from '../../types';
import {
  downloadSitemapXml,
  generateSitemapXml,
  getSitemapStats,
  DEFAULT_BASE_URL,
} from '../../services/sitemapService';

interface SEOSERPInspectorProps {
  isOpen: boolean;
  onClose: () => void;
  currentTitle: string;
  currentDescription: string;
  currentUrl: string;
  profiles?: Profile[];
}

export const SEOSERPInspector: React.FC<SEOSERPInspectorProps> = ({
  isOpen,
  onClose,
  currentTitle,
  currentDescription,
  currentUrl,
  profiles,
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedSlug, setCopiedSlug] = useState(false);
  const [copiedXml, setCopiedXml] = useState(false);
  const [showXmlPreview, setShowXmlPreview] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'sitemap' | 'gsc' | 'serp'>('sitemap');

  // Google Search Console verification token helper
  const [gscToken, setGscToken] = useState(() => {
    return localStorage.getItem('topcallgirls_gsc_token') || '';
  });
  const [gscSaved, setGscSaved] = useState(false);

  useEffect(() => {
    // If token exists, ensure <meta name="google-site-verification"> is injected into <head>
    if (gscToken) {
      let meta = document.querySelector('meta[name="google-site-verification"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'google-site-verification');
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', gscToken);
    }
  }, [gscToken]);

  if (!isOpen) return null;

  const targetDomain = DEFAULT_BASE_URL;
  const sitemapStats = getSitemapStats(targetDomain, profiles);
  const sitemapUrl = `${targetDomain}/sitemap.xml`;

  const handleDownload = () => {
    setIsGenerating(true);
    setTimeout(() => {
      downloadSitemapXml(targetDomain, profiles, 'sitemap.xml');
      setIsGenerating(false);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    }, 200);
  };

  const handleCopyUrl = () => {
    navigator.clipboard?.writeText(sitemapUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleCopySlug = () => {
    navigator.clipboard?.writeText('sitemap.xml');
    setCopiedSlug(true);
    setTimeout(() => setCopiedSlug(false), 2000);
  };

  const handleCopyXml = () => {
    const xml = generateSitemapXml(targetDomain, profiles);
    navigator.clipboard?.writeText(xml);
    setCopiedXml(true);
    setTimeout(() => setCopiedXml(false), 2000);
  };

  const handleSaveGscToken = (token: string) => {
    const clean = token.replace(/<meta[^>]*content=["']([^"']+)["'][^>]*>/i, '$1').trim();
    setGscToken(clean);
    localStorage.setItem('topcallgirls_gsc_token', clean);
    setGscSaved(true);
    setTimeout(() => setGscSaved(false), 2500);
  };

  const xmlContent = generateSitemapXml(targetDomain, profiles);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative max-w-2xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Sitemap & Google Search Console Hub
              </h3>
              <p className="text-xs text-slate-400">
                Submit sitemap.xml to Google, verify ownership & index all locations and profiles
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
            aria-label="Close Inspector"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950/80 border border-slate-800 mt-4 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('sitemap')}
            className={`flex-1 py-2 px-3 rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'sitemap'
                ? 'bg-rose-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>XML Sitemap ({sitemapStats.totalUrls})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('gsc')}
            className={`flex-1 py-2 px-3 rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'gsc'
                ? 'bg-rose-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span>Google Search Console</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('serp')}
            className={`flex-1 py-2 px-3 rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'serp'
                ? 'bg-rose-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Search className="w-3.5 h-3.5 text-sky-400" />
            <span>SERP Preview</span>
          </button>
        </div>

        <div className="py-4 space-y-5 text-xs">
          {/* TAB 1: XML Sitemap Engine */}
          {activeTab === 'sitemap' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-amber-500/30 shadow-lg space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <FileCode className="w-5 h-5 text-amber-400" />
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <span>Automated sitemap.xml Engine</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                          Ready for Google
                        </span>
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Includes all 25 country, state, metropolitan city hubs & active verified profile slugs
                      </p>
                    </div>
                  </div>

                  {/* Download Button */}
                  <button
                    type="button"
                    onClick={handleDownload}
                    disabled={isGenerating}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 active:scale-95 text-white font-bold text-xs shadow-md shadow-red-950/50 transition-all cursor-pointer shrink-0"
                  >
                    {isGenerating ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : downloadSuccess ? (
                      <Check className="w-4 h-4 text-emerald-200" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                    <span>{downloadSuccess ? 'Downloaded sitemap.xml!' : 'Download sitemap.xml'}</span>
                  </button>
                </div>

                {/* Sitemap Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center">
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Indexable URLs</span>
                    <span className="text-base font-extrabold text-amber-400">{sitemapStats.totalUrls}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block flex items-center justify-center gap-1">
                      <MapPin className="w-3 h-3 text-sky-400" /> Country & State
                    </span>
                    <span className="text-base font-extrabold text-sky-400">
                      {sitemapStats.countryCount + sitemapStats.stateCount}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block flex items-center justify-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-400" /> Metro Cities
                    </span>
                    <span className="text-base font-extrabold text-emerald-400">{sitemapStats.cityCount}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block flex items-center justify-center gap-1">
                      <Users className="w-3 h-3 text-rose-400" /> Active Profiles
                    </span>
                    <span className="text-base font-extrabold text-rose-400">{sitemapStats.profileCount}</span>
                  </div>
                </div>

                {/* Sitemap URL Bar & Secondary Actions */}
                <div className="p-3 rounded-xl bg-black/60 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2 truncate text-[11px] text-slate-300">
                    <Globe className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="font-mono text-emerald-400 truncate">{sitemapUrl}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={handleCopyUrl}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-[11px] transition cursor-pointer"
                    >
                      {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                      <span>{copiedUrl ? 'Copied Full URL!' : 'Copy Full URL'}</span>
                    </button>
                    <a
                      href="/sitemap.xml"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-[11px] transition cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                      <span>Open XML</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => setShowXmlPreview(!showXmlPreview)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800/70 hover:bg-slate-700 text-slate-300 font-medium text-[11px] transition cursor-pointer"
                    >
                      <span>{showXmlPreview ? 'Hide' : 'Preview'}</span>
                      {showXmlPreview ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                {/* Expandable XML Preview */}
                {showXmlPreview && (
                  <div className="space-y-2 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>XML Content ({sitemapStats.totalUrls} indexable pages + image sitemap metadata)</span>
                      <button
                        type="button"
                        onClick={handleCopyXml}
                        className="text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer font-semibold"
                      >
                        {copiedXml ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedXml ? 'Copied XML!' : 'Copy XML'}</span>
                      </button>
                    </div>
                    <div className="p-3.5 rounded-xl bg-black/90 border border-slate-800 max-h-48 overflow-y-auto font-mono text-[10px] text-emerald-300/90 leading-relaxed select-all">
                      <pre className="whitespace-pre-wrap">{xmlContent}</pre>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: Google Search Console Step-by-Step Guide */}
          {activeTab === 'gsc' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Submission Card */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 font-bold text-xs">GSC</span>
                    <h4 className="text-sm font-bold text-white">How to Submit Sitemap to Google Search Console</h4>
                  </div>
                  <a
                    href="https://search.google.com/search-console/sitemaps"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 font-semibold cursor-pointer"
                  >
                    <span>Open Google Console</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Step-by-Step Instructions */}
                <ol className="space-y-3 text-slate-300 text-[11px] leading-relaxed">
                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 font-bold flex items-center justify-center shrink-0 text-xs">
                      1
                    </span>
                    <div>
                      <strong className="text-white">Add Property:</strong> In Google Search Console, click <em>&ldquo;Add property&rdquo;</em>, select <strong>URL prefix</strong>, and enter:
                      <div className="mt-1 font-mono text-emerald-400 bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800 select-all">
                        https://www.topcallgirls.online/
                      </div>
                    </div>
                  </li>

                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 font-bold flex items-center justify-center shrink-0 text-xs">
                      2
                    </span>
                    <div className="flex-1">
                      <strong className="text-white">Verify Ownership:</strong> Choose <strong>HTML tag</strong>. Paste the token from Google below to inject it:
                      <div className="mt-1.5 flex items-center gap-2">
                        <input
                          type="text"
                          value={gscToken}
                          onChange={(e) => handleSaveGscToken(e.target.value)}
                          placeholder="Paste google-site-verification token or full <meta> tag"
                          className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 font-mono"
                        />
                        {gscSaved && (
                          <span className="text-emerald-400 font-semibold text-xs flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Injected!
                          </span>
                        )}
                      </div>
                    </div>
                  </li>

                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 font-bold flex items-center justify-center shrink-0 text-xs">
                      3
                    </span>
                    <div className="flex-1">
                      <strong className="text-white">Submit the Sitemap:</strong> In Google Console, click <strong>&ldquo;Sitemaps&rdquo;</strong> on the left sidebar. In <em>&ldquo;Add a new sitemap&rdquo;</em>, enter:
                      <div className="mt-1.5 p-2 rounded-xl bg-black border border-slate-800 flex items-center justify-between gap-2">
                        <span className="font-mono text-amber-300 font-semibold">sitemap.xml</span>
                        <button
                          type="button"
                          onClick={handleCopySlug}
                          className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1 cursor-pointer transition"
                        >
                          {copiedSlug ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedSlug ? 'Copied!' : 'Copy "sitemap.xml"'}</span>
                        </button>
                      </div>
                      <p className="mt-1 text-slate-400 text-[10px]">
                        Google will automatically fetch <code className="text-emerald-400">https://www.topcallgirls.online/sitemap.xml</code> and show <strong>&ldquo;Success&rdquo;</strong> status.
                      </p>
                    </div>
                  </li>

                  <li className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 font-bold flex items-center justify-center shrink-0 text-xs">
                      4
                    </span>
                    <div>
                      <strong className="text-white">Request Immediate Indexing:</strong> Use the <em>URL Inspection Tool</em> at the top search bar in Google Search Console on any profile (e.g. <code className="text-slate-300">https://www.topcallgirls.online/profiles/aria-sterling</code>) and click <strong>&ldquo;Request Indexing&rdquo;</strong> to have Google crawl it in minutes!
                    </div>
                  </li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 3: SERP & AI Grounding Preview */}
          {activeTab === 'serp' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <h4 className="text-slate-400 uppercase tracking-wider text-[11px] font-bold mb-2">
                  Google Search Result Snippet Simulation
                </h4>
                <div className="p-4 sm:p-5 rounded-2xl bg-white text-slate-900 shadow-md space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Globe className="w-3.5 h-3.5 text-slate-500" />
                    <span className="truncate">topcallgirls.online{currentUrl}</span>
                  </div>
                  <h3 className="text-base sm:text-lg text-blue-700 hover:underline font-semibold cursor-pointer line-clamp-1">
                    {currentTitle}
                  </h3>
                  <p className="text-xs text-slate-700 line-clamp-2 leading-relaxed">
                    {currentDescription}
                  </p>
                </div>
              </div>

              {/* Signals */}
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2.5">
                <h4 className="font-bold text-white flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" /> Structured Data & Grounding Verification
                </h4>
                <ul className="text-slate-300 space-y-1.5 list-disc list-inside text-[11px] leading-relaxed">
                  <li>
                    <strong className="text-white">Robots.txt Directive:</strong> Points crawlers to <code className="text-amber-300">https://www.topcallgirls.online/sitemap.xml</code>.
                  </li>
                  <li>
                    <strong className="text-white">Google Image Sitemap:</strong> Companion portrait & cover URLs embedded so photos index in Google Images.
                  </li>
                  <li>
                    <strong className="text-white">Schema.org JSON-LD:</strong> Person, WebSite, and BreadcrumbList structured data for instant rich snippets.
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-800/80">
          <span className="text-[11px] text-slate-500">
            Build command: <code className="text-slate-400">npm run generate:sitemap</code>
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition cursor-pointer"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
