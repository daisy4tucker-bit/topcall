import React from 'react';
import { AlertCircle } from 'lucide-react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className = '', id, rows = 3, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={textareaId} className="block text-xs font-semibold text-zinc-300">
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          rows={rows}
          className={`w-full bg-zinc-900 border rounded-xl text-zinc-100 placeholder-zinc-500 text-sm p-3 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 disabled:opacity-50 resize-y min-h-[80px] ${
            error ? 'border-rose-500/80 bg-rose-500/5 focus:border-rose-500' : 'border-zinc-800 hover:border-zinc-700'
          } ${className}`}
          {...props}
        />
        {error ? (
          <p className="flex items-center gap-1 text-[11px] text-rose-400 mt-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </p>
        ) : helperText ? (
          <p className="text-[11px] text-zinc-500 mt-1">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
