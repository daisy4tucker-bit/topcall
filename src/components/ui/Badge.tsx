import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'purple' | 'outline';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className = '',
  variant = 'default',
  size = 'md',
  icon,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center font-medium rounded-full tracking-wide shrink-0';
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[10px] gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
  };
  const variantStyles = {
    default: 'bg-zinc-900/95 text-zinc-100 border border-zinc-700 shadow-lg font-semibold',
    success: 'bg-zinc-950/95 text-emerald-300 border border-emerald-400/80 shadow-lg font-bold',
    warning: 'bg-zinc-950/95 text-amber-300 border border-amber-400/80 shadow-lg font-bold',
    danger: 'bg-zinc-950/95 text-rose-300 border border-rose-400/80 shadow-lg font-bold',
    purple: 'bg-zinc-950/95 text-purple-300 border border-purple-400/80 shadow-lg font-bold',
    outline: 'bg-zinc-900/95 text-zinc-200 border border-zinc-700 shadow-lg font-semibold',
  };

  return (
    <span
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
