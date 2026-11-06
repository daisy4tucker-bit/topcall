import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gradient';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className = '',
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      leftIcon,
      rightIcon,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 disabled:opacity-50 disabled:pointer-events-none cursor-pointer active:scale-[0.98] select-none';

    const sizeStyles = {
      xs: 'px-2.5 py-1.5 text-xs gap-1.5',
      sm: 'px-3.5 py-2 text-xs gap-1.5',
      md: 'px-4 py-2.5 text-sm gap-2',
      lg: 'px-6 py-3.5 text-base gap-2.5 font-semibold',
    };

    const variantStyles = {
      primary:
        'bg-zinc-100 hover:bg-white text-zinc-950 font-semibold shadow-md shadow-white/5 hover:shadow-zinc-200/10',
      secondary:
        'bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700/80 shadow-sm',
      outline:
        'bg-transparent hover:bg-zinc-800/60 text-zinc-300 hover:text-white border border-zinc-700 hover:border-zinc-500',
      ghost:
        'bg-transparent hover:bg-zinc-800/60 text-zinc-400 hover:text-zinc-100 border border-transparent',
      danger:
        'bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/20',
      gradient:
        'bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:from-rose-600 hover:via-pink-600 hover:to-amber-600 text-white font-semibold shadow-lg shadow-rose-500/20 border border-rose-400/30',
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0 text-current" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
