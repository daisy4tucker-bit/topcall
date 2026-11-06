import React, { useState, useRef } from 'react';
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  Globe,
  MapPin,
  Camera,
  Languages,
  Clock,
  Mail,
  Search,
  Sparkles,
  Eye,
  ShieldCheck,
  AlertCircle,
  Upload,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Zap,
  RotateCcw,
  Star,
  Trash2
} from 'lucide-react';
import { ExtendedProfile, ProfileStatus } from '../../types/admin';
import { LOCATION_DATA } from '../../data/locationHierarchy';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { extractProfileFromImage, ExtractedProfileData } from '../../services/imageExtractService';

interface AdminProfileEditorProps {
  profileToEdit?: ExtendedProfile | null;
  onSave: (profile: ExtendedProfile) => void;
  onCancel: () => void;
  onNavigatePublic: (path: string) => void;
}

export const AdminProfileEditor: React.FC<AdminProfileEditorProps> = ({
  profileToEdit,
  onSave,
  onCancel,
  onNavigatePublic,
}) => {
  const isEditing = Boolean(profileToEdit?.id);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarFileInputRef = useRef<HTMLInputElement>(null);

  // --------------------------------------------------------------------------
  // CORE ESSENTIAL FIELDS
  // --------------------------------------------------------------------------
  const [displayName, setDisplayName] = useState(profileToEdit?.displayName || '');
  const [age, setAge] = useState(String(profileToEdit?.age || 25));
  const [rate, setRate] = useState(profileToEdit?.startingRate || '$450/hr');
  const [bioSnippet, setBioSnippet] = useState(profileToEdit?.bioSnippet || '');
  const [avatarUrl, setAvatarUrl] = useState(
    profileToEdit?.avatarUrl || 'https://callgirls.city/uploads/1790205590094-27427353.webp'
  );
  const [citySlug, setCitySlug] = useState(profileToEdit?.citySlug || 'los-angeles');
  const [status, setStatus] = useState<ProfileStatus>(profileToEdit?.status || 'published');
  const [showAvatarUrlInput, setShowAvatarUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [mediaFiles, setMediaFiles] = useState<string[]>(() => {
    const list = profileToEdit?.galleryPhotos || [];
    if (list.length === 0) {
      const initialAvatar = profileToEdit?.avatarUrl || 'https://callgirls.city/uploads/1790205590094-27427353.webp';
      return [initialAvatar];
    }
    return list;
  });

  // --------------------------------------------------------------------------
  // IMAGE EXTRACTION BOX STATE
  // --------------------------------------------------------------------------
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionSuccessMessage, setExtractionSuccessMessage] = useState<string | null>(null);
  const [selectedImagePreview, setSelectedImagePreview] = useState<string | null>(profileToEdit?.avatarUrl || null);

  // --------------------------------------------------------------------------
  // OPTIONAL / ADVANCED FIELDS
  // --------------------------------------------------------------------------
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [slug, setSlug] = useState(profileToEdit?.slug || '');
  const [tagline, setTagline] = useState(profileToEdit?.tagline || '');
  const [countrySlug, setCountrySlug] = useState(profileToEdit?.countrySlug || 'united-states');
  const [stateSlug, setStateSlug] = useState(profileToEdit?.stateSlug || 'california');
  const [coverUrl, setCoverUrl] = useState(
    profileToEdit?.coverUrl || 'https://callgirls.city/uploads/1790205590094-27427353.webp'
  );
  const [servicesInput, setServicesInput] = useState(
    (profileToEdit?.services || ['Dinner Dates', 'VIP Outcall', 'Social Companion']).join(', ')
  );
  const [languagesInput, setLanguagesInput] = useState(
    (profileToEdit?.languages || ['English (Native)']).join(', ')
  );
  const [incallAvailable, setIncallAvailable] = useState(profileToEdit?.availability?.incallAvailable ?? true);
  const [outcallAvailable, setOutcallAvailable] = useState(profileToEdit?.availability?.outcallAvailable ?? true);
  const [isFeatured, setIsFeatured] = useState(profileToEdit?.featured || false);
  const [isVerified, setIsVerified] = useState(profileToEdit?.isVerified ?? true);

  // Auto-generate clean slug when name changes
  const handleNameChange = (val: string) => {
    setDisplayName(val);
    if (!isEditing || !slug) {
      const generated = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      setSlug(generated);
    }
  };

  // Location helpers
  const selectedCountry = LOCATION_DATA.find((c) => c.slug === countrySlug) || LOCATION_DATA[0];
  const availableStates = selectedCountry.states;
  const selectedState = availableStates.find((s) => s.slug === stateSlug) || availableStates[0];
  const availableCities = selectedState ? selectedState.cities : [];
  const selectedCity = availableCities.find((c) => c.slug === citySlug) || availableCities[0];

  // Handle Image File Upload & Extraction
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      setSelectedImagePreview(base64);
      setAvatarUrl(base64);
      
      setMediaFiles((prev) => {
        if (prev.includes(base64)) return prev;
        return [base64, ...prev];
      });
      await runImageExtraction(base64, file.type || 'image/jpeg');
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setAvatarUrl(base64);
      setSelectedImagePreview(base64);
      
      setMediaFiles((prev) => {
        if (prev.includes(base64)) return prev;
        return [...prev, base64];
      });
    };
    reader.readAsDataURL(file);
  };

  const handleMultiFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        setMediaFiles((prev) => {
          if (prev.includes(base64)) return prev;
          return [...prev, base64];
        });
        
        setAvatarUrl((prev) => {
          if (!prev || prev.includes('unsplash.com')) {
            return base64;
          }
          return prev;
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddUrlImage = () => {
    const cleanUrl = urlInput.trim();
    if (!cleanUrl) return;
    setMediaFiles((prev) => {
      if (prev.includes(cleanUrl)) return prev;
      return [...prev, cleanUrl];
    });
    setAvatarUrl((prev) => {
      if (!prev || prev.includes('unsplash.com')) {
        return cleanUrl;
      }
      return prev;
    });
    setUrlInput('');
    setShowAvatarUrlInput(false);
  };

  const handleRemovePhoto = (img: string) => {
    const updated = mediaFiles.filter((m) => m !== img);
    setMediaFiles(updated);
    if (avatarUrl === img) {
      if (updated.length > 0) {
        setAvatarUrl(updated[0]);
      } else {
        setAvatarUrl('');
      }
    }
  };

  const runImageExtraction = async (base64: string, mime: string) => {
    setIsExtracting(true);
    setExtractionSuccessMessage(null);
    try {
      const extracted: ExtractedProfileData = await extractProfileFromImage(base64, mime);
      if (extracted.displayName && extracted.displayName !== 'New Companion') {
        setDisplayName(extracted.displayName);
        const autoSlug = extracted.displayName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        setSlug(autoSlug);
      }
      if (extracted.age) setAge(String(extracted.age));
      if (extracted.rate) setRate(extracted.rate);
      if (extracted.bioSnippet) setBioSnippet(extracted.bioSnippet);
      if (extracted.tagline) setTagline(extracted.tagline);
      if (extracted.citySlug) setCitySlug(extracted.citySlug);
      if (extracted.stateSlug) setStateSlug(extracted.stateSlug);
      if (extracted.countrySlug) setCountrySlug(extracted.countrySlug);
      if (extracted.services && extracted.services.length > 0) {
        setServicesInput(extracted.services.join(', '));
      }
      setExtractionSuccessMessage(
        `✓ Profile details extracted from image: Name, Age, Rate, City, and Bio auto-filled!`
      );
    } catch (err: any) {
      setExtractionSuccessMessage('Image loaded as avatar. Please review details below.');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleLoadSampleFlyer = () => {
    const sampleImg = 'https://callgirls.city/uploads/1790205590094-27427353.webp';
    setSelectedImagePreview(sampleImg);
    setAvatarUrl(sampleImg);
    setDisplayName('Maya Valentina');
    setSlug('maya-valentina');
    setAge('25');
    setRate('$500/hr');
    setCitySlug('los-angeles');
    setTagline('High-society social companion & gala escort');
    setBioSnippet('Independent social companion and private dinner host based in Los Angeles.');
    setServicesInput('Dinner Dates, Gala Escort, VIP Outcall, Cultural Events');
    setExtractionSuccessMessage('✓ Sample companion profile & image loaded into form!');
  };

  const handleSubmit = (targetStatus?: ProfileStatus) => {
    const finalStatus = targetStatus || status;
    const galleryPhotos = [...mediaFiles];
    if (avatarUrl && !galleryPhotos.includes(avatarUrl)) {
      galleryPhotos.unshift(avatarUrl);
    }
    const services = servicesInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const languages = languagesInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const savedProfile: ExtendedProfile = {
      id: profileToEdit?.id || `prof-${Date.now()}`,
      slug: slug || displayName.toLowerCase().replace(/[^a-z0-9]+/g, '-') || `companion-${Date.now()}`,
      displayName: displayName || 'Verified Companion',
      handle: `@${(slug || displayName || 'creator').toLowerCase().replace(/[^a-z0-9]+/g, '_')}`,
      tagline: tagline || bioSnippet || 'Verified adult companion & private host',
      age: parseInt(age, 10) || 25,
      country: selectedCountry.name,
      countrySlug: selectedCountry.slug,
      state: selectedState ? selectedState.name : 'California',
      stateSlug: selectedState ? selectedState.slug : 'california',
      city: selectedCity ? selectedCity.name : 'Los Angeles',
      citySlug: selectedCity ? selectedCity.slug : 'los-angeles',
      avatarUrl: avatarUrl || 'https://callgirls.city/uploads/1790205590094-27427353.webp',
      coverUrl: coverUrl || avatarUrl || 'https://callgirls.city/uploads/1790205590094-27427353.webp',
      galleryPhotos,
      bioSnippet: bioSnippet || 'Verified public profile.',
      fullDescription: bioSnippet,
      services,
      languages,
      startingRate: rate || '$450/hr',
      rating: profileToEdit?.rating || 5.0,
      reviewCount: profileToEdit?.reviewCount || 0,
      isVerified,
      isOnline: true,
      featured: isFeatured,
      categories: ['Verified Companions'],
      availability: {
        statusText: 'Available Today',
        hours: '1:00 PM – 11:00 PM',
        scheduleNotice: '1 hour notice requested.',
        incallAvailable,
        outcallAvailable,
        travelCities: [selectedCity ? selectedCity.name : 'Los Angeles'],
      },
      contactInfo: {
        preferredChannel: 'Booking Inquiry Form',
        responseTime: 'Replies within 30 minutes',
        bookingPolicyNote: 'Strict legal compliance.',
      },
      status: finalStatus,
      statusBadge: isFeatured ? 'Featured VIP' : 'Active & Verified',
      lastUpdated: 'Just now',
    };
    onSave(savedProfile);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Top Header */}
      <div className="flex items-center justify-between bg-zinc-900 border border-zinc-800 p-5 rounded-3xl shadow-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition cursor-pointer"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {isEditing ? `Edit Profile: ${displayName || 'Companion'}` : 'Create New Profile'}
            </h1>
            <p className="text-xs text-zinc-400">
              Upload an image sent by the provider to extract and auto-fill details, or type them directly below.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="gradient"
            size="sm"
            onClick={() => handleSubmit('published')}
            leftIcon={<CheckCircle2 className="w-4 h-4" />}
          >
            Publish to Website
          </Button>
        </div>
      </div>

      {/* Image Extraction Feature */}
      <div className="bg-gradient-to-b from-rose-950/20 via-zinc-900 to-zinc-900 border-2 border-rose-500/40 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">
                Extract Details from Sent Image / Flyer
              </h2>
              <p className="text-xs text-zinc-400">
                Upload the photo, bio screenshot, or promo card sent by the companion. Details will be automatically filled below.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLoadSampleFlyer}
            className="text-[11px] px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-rose-300 font-semibold border border-zinc-700 transition cursor-pointer"
          >
            Load Sample Card
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-rose-500/30 hover:border-rose-400 bg-zinc-950/60 rounded-2xl p-6 text-center cursor-pointer transition hover:bg-zinc-950/90 group"
        >
          {selectedImagePreview ? (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <img
                src={selectedImagePreview}
                alt="Uploaded card"
                className="w-24 h-28 object-cover rounded-xl shadow-lg border border-zinc-700 shrink-0"
              />
              <div className="text-center sm:text-left space-y-1">
                <span className="text-xs font-bold text-white block">
                  Image Ready & Selected
                </span>
                <p className="text-[11px] text-zinc-400">
                  Click to choose a different photo, or review the auto-filled fields below.
                </p>
                <div className="pt-2 flex flex-wrap gap-2 justify-center sm:justify-start">
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    <CheckCircle2 className="w-3 h-3" /> Image set as primary avatar
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2 py-2">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto group-hover:scale-110 transition">
                <Upload className="w-6 h-6" />
              </div>
              <div className="text-sm font-bold text-white">
                Click or Drag & Drop the Sent Image / Card Here
              </div>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                Supports JPG, PNG, and WebP (comp card, text screenshot, or photo).
              </p>
            </div>
          )}
        </div>

        {isExtracting && (
          <div className="mt-4 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center gap-2 text-xs text-rose-300 animate-pulse">
            <Zap className="w-4 h-4 text-rose-400 animate-spin" />
            <span>Analyzing image and extracting name, age, city, rates, and bio...</span>
          </div>
        )}

        {extractionSuccessMessage && (
          <div className="mt-4 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{extractionSuccessMessage}</span>
          </div>
        )}
      </div>

      {/* Form Details */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <h3 className="text-sm font-extrabold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
          <span>Profile Details</span>
        </h3>

        {/* Row 1: Name & Age */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Display Name <span className="text-rose-400">*</span>
            </label>
            <Input
              value={displayName}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Elena Vance"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Age <span className="text-rose-400">*</span> (18+ Required)
            </label>
            <Input
              type="number"
              min="18"
              max="99"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="25"
              required
            />
          </div>
        </div>

        {/* Row 2: Location & Hourly Rate */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              <span>City / Metropolitan Area <span className="text-rose-400">*</span></span>
            </label>
            <select
              value={citySlug}
              onChange={(e) => setCitySlug(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-rose-500 transition"
            >
              {availableCities.map((city) => (
                <option key={city.slug} value={city.slug}>
                  {city.name}, {selectedState.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Starting Rate
            </label>
            <Input
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder="e.g. $450/hr"
            />
          </div>
        </div>

        {/* Row 3: Short Bio */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
            Short Biography / Introduction
          </label>
          <Textarea
            rows={3}
            value={bioSnippet}
            onChange={(e) => setBioSnippet(e.target.value)}
            placeholder="Introduce the companion, specialties, dinner dates, galas, and accompaniment style..."
          />
        </div>

        {/* Row 4: Multi-Image Gallery Grid */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/80 pb-3">
            <div>
              <h4 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-rose-400" />
                <span>Photo Portfolio & Gallery ({mediaFiles.length})</span>
              </h4>
              <p className="text-[11px] text-zinc-400">
                Upload multiple images. Click the star badge on any photo to set it as the Primary/Avatar photo.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAvatarUrlInput(!showAvatarUrlInput)}
              className="text-[11px] text-rose-400 hover:text-rose-300 transition underline underline-offset-4 cursor-pointer"
            >
              {showAvatarUrlInput ? "← Switch to direct upload" : "🔗 Or paste web image URL instead"}
            </button>
          </div>

          <input
            ref={avatarFileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleMultiFileSelect}
            className="hidden"
          />

          {showAvatarUrlInput && (
            <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 space-y-2 animate-in fade-in duration-200">
              <label className="block text-[11px] font-bold text-zinc-400">
                Paste Image URL:
              </label>
              <div className="flex gap-2">
                <Input
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://callgirls.city/uploads/..."
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleAddUrlImage}
                >
                  Add URL
                </Button>
              </div>
            </div>
          )}

          {/* Multi-Image Gallery Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {mediaFiles.map((img, idx) => {
              const isPrimary = img === avatarUrl;
              return (
                <div
                  key={idx}
                  className={`aspect-[4/5] relative bg-zinc-950 rounded-2xl border overflow-hidden shadow-inner group transition-all duration-300 ${
                    isPrimary ? 'border-rose-500 ring-2 ring-rose-500/30' : 'border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Gallery ${idx + 1}`}
                    className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(img)}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/80 hover:bg-rose-600 text-zinc-300 hover:text-white transition shadow-lg cursor-pointer"
                    title="Remove Image"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-2 flex items-center justify-center">
                    {isPrimary ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-300 bg-rose-500/20 px-2 py-1 rounded-lg border border-rose-500/30 shadow-md">
                        <Star className="w-3 h-3 fill-rose-400 text-rose-400" />
                        <span>Primary Photo</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setAvatarUrl(img)}
                        className="text-[10px] font-bold text-zinc-300 hover:text-white bg-zinc-900/90 hover:bg-rose-500 px-2 py-1 rounded-lg border border-zinc-700 transition cursor-pointer"
                      >
                        Set Primary
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            <div
              onClick={() => avatarFileInputRef.current?.click()}
              className="aspect-[4/5] rounded-2xl border-2 border-dashed border-zinc-800 hover:border-rose-500/40 bg-zinc-900/30 hover:bg-rose-500/5 flex flex-col items-center justify-center gap-2 cursor-pointer transition group"
            >
              <div className="w-10 h-10 rounded-xl bg-zinc-900 text-zinc-400 group-hover:text-rose-400 flex items-center justify-center transition border border-zinc-800">
                <Upload className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-zinc-400 group-hover:text-rose-300">
                Add Photos
              </div>
              <span className="text-[9px] text-zinc-500">
                (supports multiple)
              </span>
            </div>
          </div>
        </div>

        {/* Publication Status Selector */}
        <div className="pt-2 border-t border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-zinc-400">Publication Status:</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStatus('published')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  status === 'published'
                    ? 'bg-emerald-500 text-white shadow-md'
                    : 'bg-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                Published (Live)
              </button>
              <button
                type="button"
                onClick={() => setStatus('draft')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  status === 'draft'
                    ? 'bg-amber-500 text-white shadow-md'
                    : 'bg-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                Draft (Hidden)
              </button>
            </div>
          </div>
          <Button
            variant="gradient"
            size="md"
            onClick={() => handleSubmit()}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save & Update Profile
          </Button>
        </div>
      </div>

      {/* Optional Advanced Accordion */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-xl">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full flex items-center justify-between p-5 text-left text-xs font-bold text-zinc-300 hover:text-white hover:bg-zinc-850 transition cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span>More Options & Advanced Details (Services, Tagline, Availability)</span>
            <span className="text-[10px] text-zinc-500 font-normal">Optional</span>
          </div>
          {showAdvanced ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
        </button>

        {showAdvanced && (
          <div className="p-6 border-t border-zinc-800 space-y-4 bg-zinc-950/40 text-xs">
            <div>
              <label className="block font-semibold text-zinc-300 mb-1">
                Tagline
              </label>
              <Input
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. VIP Social Escort & Private Host"
              />
            </div>
            <div>
              <label className="block font-semibold text-zinc-300 mb-1">
                Accompaniment Services (Comma separated)
              </label>
              <Input
                value={servicesInput}
                onChange={(e) => setServicesInput(e.target.value)}
                placeholder="Dinner Dates, Gala Escort, VIP Outcall, Opera & Arts"
              />
            </div>
            <div>
              <label className="block font-semibold text-zinc-300 mb-1">
                Languages Spoken
              </label>
              <Input
                value={languagesInput}
                onChange={(e) => setLanguagesInput(e.target.value)}
                placeholder="English (Native), French (Fluent)"
              />
            </div>
            <div className="flex flex-wrap gap-4 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={incallAvailable}
                  onChange={(e) => setIncallAvailable(e.target.checked)}
                  className="rounded accent-rose-500"
                />
                <span className="text-zinc-300">Incall Available</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={outcallAvailable}
                  onChange={(e) => setOutcallAvailable(e.target.checked)}
                  className="rounded accent-rose-500"
                />
                <span className="text-zinc-300">Outcall Available</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isVerified}
                  onChange={(e) => setIsVerified(e.target.checked)}
                  className="rounded accent-rose-500"
                />
                <span className="text-zinc-300">Verified Badge</span>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
