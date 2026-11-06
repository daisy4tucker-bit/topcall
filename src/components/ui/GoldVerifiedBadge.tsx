import React, { useId } from 'react';

interface GoldVerifiedBadgeProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
  title?: string;
}

export const GoldVerifiedBadge: React.FC<GoldVerifiedBadgeProps> = ({
  size = 'md',
  showText = false,
  className = '',
  title = 'Verified Companion • Authentic Identity & Portfolio',
}) => {
  const uniqueId = useId().replace(/:/g, '');
  const gradId = `gold-badge-grad-${uniqueId}`;

  const sizeClasses = {
    xs: 'w-3.5 h-3.5',
    sm: 'w-4 h-4',
    md: 'w-4.5 h-4.5 sm:w-5 sm:h-5',
    lg: 'w-5 h-5 sm:w-6 sm:h-6',
  }[size];

  const svgIcon = (
    <svg
      className={`${sizeClasses} shrink-0 drop-shadow-[0_1px_3px_rgba(217,119,6,0.65)] transition-transform hover:scale-110`}
      viewBox="0 0 24 24"
      fill={`url(#${gradId})`}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Verified"
    >
      <defs>
        <linearGradient id={gradId} x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="25%" stopColor="#FACC15" />
          <stop offset="65%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>
      </defs>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.67-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.67-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z"
      />
    </svg>
  );

  if (showText) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 via-yellow-400/25 to-amber-600/20 border border-amber-400/50 text-amber-300 font-bold tracking-tight shadow-[0_0_12px_rgba(245,158,11,0.25)] select-none ${className}`}
        title={title}
      >
        {svgIcon}
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-200">
          Verified
        </span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center justify-center shrink-0 select-none cursor-help ${className}`}
      title={title}
    >
      {svgIcon}
    </span>
  );
};
