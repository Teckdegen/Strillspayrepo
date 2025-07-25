import React from 'react';
import { cn } from '../lib/utils';

interface LitInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const LitInput: React.FC<LitInputProps> = ({
  label,
  error,
  className,
  ...props
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-bold text-neon-pink">
          {label}
        </label>
      )}
      <input
        className={cn(
          'w-full px-4 py-3 bg-input border-2 border-primary rounded-lg',
          'text-foreground placeholder-muted-foreground',
          'focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-electric-blue',
          'transition-all duration-200',
          error ? 'border-neon-pink focus:ring-neon-pink' : '',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-neon-pink font-medium">{error}</p>
      )}
    </div>
  );
};