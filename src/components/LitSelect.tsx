import React from 'react';
import { cn } from '../lib/utils';

interface LitSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
}

export const LitSelect: React.FC<LitSelectProps> = ({
  label,
  error,
  options,
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
      <select
        className={cn(
          'w-full px-4 py-3 bg-input border-2 border-primary rounded-lg',
          'text-foreground',
          'focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-electric-blue',
          'transition-all duration-200 cursor-pointer',
          error ? 'border-neon-pink focus:ring-neon-pink' : '',
          className
        )}
        {...props}
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
            className="bg-secondary text-foreground hover:bg-lime-green hover:text-secondary"
          >
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-sm text-neon-pink font-medium">{error}</p>
      )}
    </div>
  );
};