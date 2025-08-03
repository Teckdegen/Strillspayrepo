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
    <div className="space-y-3">
      {label && (
        <label className="block text-sm font-bold bg-gradient-primary bg-clip-text text-transparent">
          {label}
        </label>
      )}
      <div className="relative group">
        {/* Glow effect */}
        <div className="absolute -inset-0.5 bg-gradient-primary rounded-xl opacity-0 group-hover:opacity-30 group-focus-within:opacity-50 blur transition-all duration-500" />
        
        {/* Select container */}
        <div className="relative">
          <select
            className={cn(
              'w-full px-6 py-4 bg-card/80 backdrop-blur-sm border-2 border-border/50 rounded-xl',
              'text-foreground text-base font-medium',
              'focus:outline-none focus:ring-0 focus:border-primary/80',
              'transition-all duration-300 cursor-pointer appearance-none',
              'hover:border-primary/60 hover:bg-card/90',
              'shadow-lg hover:shadow-xl',
              error ? 'border-destructive focus:border-destructive' : '',
              className
            )}
            {...props}
          >
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                className="bg-card text-foreground py-3 hover:bg-primary/10"
              >
                {option.label}
              </option>
            ))}
          </select>
          
          {/* Custom dropdown arrow */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
            <div className="w-6 h-6 bg-gradient-primary rounded-lg flex items-center justify-center shadow-sm">
              <svg 
                className="w-4 h-4 text-primary-foreground transform group-focus-within:rotate-180 transition-transform duration-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Bottom accent line */}
        <div className="h-0.5 w-0 group-focus-within:w-full bg-gradient-primary transition-all duration-500 mx-auto rounded-full mt-1" />
      </div>
      
      {error && (
        <div className="flex items-center space-x-2">
          <div className="w-1 h-1 bg-destructive rounded-full animate-pulse" />
          <p className="text-sm text-destructive font-medium">{error}</p>
        </div>
      )}
    </div>
  );
};