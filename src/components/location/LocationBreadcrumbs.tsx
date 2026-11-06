import React from 'react';
import { ChevronRight, Home, MapPin } from 'lucide-react';
import { BreadcrumbItem } from '../../types/location';

interface LocationBreadcrumbsProps {
  items: BreadcrumbItem[];
  onNavigate: (path: string) => void;
  className?: string;
}

export const LocationBreadcrumbs: React.FC<LocationBreadcrumbsProps> = ({
  items,
  onNavigate,
  className = '',
}) => {
  const hierarchyKey = items.map((i) => i.path).join('>');

  return (
    <nav
      key={hierarchyKey}
      aria-label="Breadcrumb navigation"
      className={`animate-breadcrumb-slide flex items-center flex-wrap gap-1.5 text-xs text-zinc-400 py-2.5 px-4 rounded-xl bg-zinc-900/70 backdrop-blur-sm border border-zinc-800/80 mb-6 shadow-sm overflow-hidden transition-all duration-300 ${className}`}
    >
      <ol className="flex items-center flex-wrap gap-1.5 list-none m-0 p-0">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const delayStyle = {
            animationDelay: `${index * 35}ms`,
            animationFillMode: 'both' as const,
          };

          return (
            <li
              key={item.path || `${item.label}-${index}`}
              className="flex items-center gap-1.5 animate-breadcrumb-item"
              style={delayStyle}
            >
              {index === 0 ? (
                <button
                  type="button"
                  onClick={() => onNavigate(item.path)}
                  className="group flex items-center gap-1.5 hover:text-white transition-colors duration-150 text-zinc-300 font-medium cursor-pointer rounded px-1.5 py-0.5 hover:bg-zinc-800/60 focus:outline-none focus:ring-1 focus:ring-rose-500/50"
                  aria-label="Go to Home"
                >
                  <Home className="w-3.5 h-3.5 text-rose-400 group-hover:scale-105 transition-transform duration-150" />
                  <span>{item.label}</span>
                </button>
              ) : isLast ? (
                <span
                  aria-current="page"
                  className="animate-breadcrumb-badge flex items-center gap-1 text-rose-300 font-semibold bg-rose-500/10 px-2.5 py-0.5 rounded-md border border-rose-500/25 shadow-xs"
                >
                  <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
                  <span className="truncate max-w-[200px] sm:max-w-none">{item.label}</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => onNavigate(item.path)}
                  className="hover:text-white transition-colors duration-150 text-zinc-300 hover:underline cursor-pointer rounded px-1 py-0.5 hover:bg-zinc-800/40 focus:outline-none focus:ring-1 focus:ring-rose-500/50 truncate max-w-[160px] sm:max-w-none"
                >
                  {item.label}
                </button>
              )}
              {!isLast && (
                <ChevronRight
                  className="w-3.5 h-3.5 text-zinc-600 shrink-0 select-none opacity-80"
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
