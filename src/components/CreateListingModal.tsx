import React, { useState } from 'react';
import { X, Sparkles, Upload, MapPin, DollarSign, UserCheck } from 'lucide-react';
import { Profile } from '../types';

interface CreateListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (profile: Profile) => void;
}

export const CreateListingModal: React.FC<CreateListingModalProps> = ({
  isOpen,
  onClose,
  onCreated,
}) => {
  const [displayName, setDisplayName] = useState('');
  const [tagline, setTagline] = useState('');
  const [age, setAge] = useState(23);
  const [city, setCity] = useState('Los Angeles');
  const [state, setState] = useState('California');
  const [startingRate, setStartingRate] = useState('$350 / hr');
  const [avatarUrl, setAvatarUrl] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80');
  const [bioSnippet, setBioSnippet] = useState('');
  const [services, setServices] = useState('Dinner Dates, VIP Galas, Social Events');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) return;

    const newProfile: Profile = {
      id: String(Date.now()),
      slug: displayName.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-'),
      displayName: displayName.trim(),
      handle: `@${displayName.toLowerCase().replace(/\s+/g, '')}`,
      tagline: tagline.trim() || 'Independent Companion & Event Hostess',
      age: Number(age) || 21,
      country: 'United States',
      countrySlug: 'united-states',
      state: state,
      stateSlug: state.toLowerCase().replace(/\s+/g, '-'),
      city: city,
      citySlug: city.toLowerCase().replace(/\s+/g, '-'),
      avatarUrl: avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      coverUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80',
      galleryPhotos: [avatarUrl],
      isVerified: true,
      isOnline: true,
      featured: true,
      categories: ['VIP Escorts', 'Dinner Dates'],
      startingRate: startingRate,
      rating: 5.0,
      reviewCount: 1,
      bioSnippet: bioSnippet || `${displayName} is an elegant independent companion in ${city}.`,
      fullDescription: bioSnippet || `Hello, I look forward to providing engaging company for dinner and upscale events in ${city}.`,
      services: services.split(',').map((s) => s.trim()).filter(Boolean),
      languages: ['English (Fluent)'],
      availability: {
        statusText: 'Available Today',
        hours: '2:00 PM – 10:00 PM',
        outcallAvailable: true,
        incallAvailable: true,
      },
      contactInfo: {
        preferredChannel: 'Form Inquiry',
        responseTime: 'Within 30 mins',
        bookingPolicyNote: 'Screening required prior to booking.',
      },
      statusBadge: 'New Listing',
      lastUpdated: 'Just now',
      status: 'published',
      isPublished: true,
    };

    onCreated(newProfile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative max-w-xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-rose-500" />
            <h3 className="text-lg font-bold text-white">Post New Profile Listing</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="py-4 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Display Name *</label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Scarlett Monroe"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Age (18+) *</label>
              <input
                type="number"
                min="18"
                max="65"
                required
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Tagline</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Elegant Galas, Dinner Dates & High-End Companionship"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-rose-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">State / Province</label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-rose-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Starting Rate</label>
              <input
                type="text"
                value={startingRate}
                onChange={(e) => setStartingRate(e.target.value)}
                placeholder="$400 / hr"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Photo Image URL</label>
            <input
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">About / Bio Snippet</label>
            <textarea
              rows={3}
              value={bioSnippet}
              onChange={(e) => setBioSnippet(e.target.value)}
              placeholder="Describe your background, interests, and style of accompaniment..."
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Services (comma-separated)</label>
            <input
              type="text"
              value={services}
              onChange={(e) => setServices(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-800 flex items-center gap-2 text-slate-400 text-[11px]">
            <UserCheck className="w-4 h-4 text-rose-400 shrink-0" />
            <span>Listing will be marked 18+ verified and published directly to the directory.</span>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-lg shadow-rose-900/30"
            >
              Publish Listing
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
