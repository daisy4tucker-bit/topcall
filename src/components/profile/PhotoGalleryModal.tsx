import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, ShieldCheck, Maximize2 } from 'lucide-react';
import { handleImageError } from '../../utils/imageUtils';

interface PhotoGalleryModalProps {
  photos: string[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
  creatorName: string;
}

export const PhotoGalleryModal: React.FC<PhotoGalleryModalProps> = ({
  photos,
  initialIndex = 0,
  isOpen,
  onClose,
  creatorName,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  if (!isOpen || !photos.length) return null;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label={`Photo gallery for ${creatorName}`}
      onClick={onClose}
    >
      {/* Top Controls */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between text-white">
        <div className="flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-xl border border-zinc-800 backdrop-blur-md">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold">{creatorName} — Verified Authorized Photo</span>
          <span className="text-zinc-500 text-xs">
            ({currentIndex + 1} / {photos.length})
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-2.5 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700 transition cursor-pointer"
          aria-label="Close photo gallery"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Photo Display */}
      <div
        className="relative max-w-4xl max-h-[80vh] w-full flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={photos[currentIndex]}
          alt={`${creatorName} authorized photograph ${currentIndex + 1}`}
          referrerPolicy="no-referrer"
          onError={(e) => handleImageError(e)}
          className="max-h-[80vh] max-w-full rounded-2xl object-contain shadow-2xl border border-zinc-800"
        />

        {/* Prev / Next Buttons */}
        {photos.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-2 sm:-left-12 p-3 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-white border border-zinc-700 backdrop-blur-md transition cursor-pointer"
              aria-label="Previous photograph"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 sm:-right-12 p-3 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-white border border-zinc-700 backdrop-blur-md transition cursor-pointer"
              aria-label="Next photograph"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      {/* Bottom Thumbnail Strip */}
      {photos.length > 1 && (
        <div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 p-2 rounded-2xl bg-zinc-950/80 border border-zinc-800 backdrop-blur-md overflow-x-auto max-w-full"
          onClick={(e) => e.stopPropagation()}
        >
          {photos.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`relative w-12 h-12 rounded-lg overflow-hidden border-2 transition cursor-pointer shrink-0 ${
                idx === currentIndex ? 'border-rose-500 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img
                src={img}
                alt="thumbnail"
                referrerPolicy="no-referrer"
                onError={(e) => handleImageError(e)}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
