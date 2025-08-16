import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { cn } from '../lib/utils';
import { Check, ChevronDown, AlertCircle } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

interface LitSelectProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
}

export const LitSelect = forwardRef<HTMLDivElement, LitSelectProps>(({
  label,
  error,
  options,
  value,
  onValueChange,
  placeholder = 'Select an option',
  className,
  disabled = false,
  required = false,
  ...props
}, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(value || '');
  const selectRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Update internal value when value prop changes
  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option: SelectOption) => {
    if (option.disabled) return;
    setInternalValue(option.value);
    onValueChange?.(option.value);
    setIsOpen(false);
  };

  const selectedOption = options.find(opt => opt.value === internalValue);

  return (
    <div className={cn('w-full space-y-2', className)} ref={ref} {...props}>
      {label && (
        <label className={cn(
          'block text-sm font-bold bg-gradient-primary bg-clip-text text-transparent',
          error && 'text-destructive',
          disabled && 'opacity-50 cursor-not-allowed'
        )}>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      
      <div className="relative w-full" ref={selectRef}>
        {/* Select Button */}
        <button
          type="button"
          className={cn(
            'w-full px-4 py-3 text-left bg-card/80 backdrop-blur-sm border-2 rounded-xl',
            'text-foreground text-base font-medium flex items-center justify-between',
            'focus:outline-none focus:ring-2 focus:ring-primary/50',
            'transition-all duration-200',
            'hover:bg-card/90 hover:border-primary/60',
            'shadow-sm hover:shadow-md',
            error ? 'border-destructive' : 'border-border/50',
            disabled && 'opacity-50 cursor-not-allowed',
            isOpen ? 'ring-2 ring-primary/50 border-primary/80' : ''
          )}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-labelledby={`${props.id || 'select'}-label`}
        >
          <div className="flex items-center truncate">
            {selectedOption?.icon && (
              <span className="mr-2 flex-shrink-0">
                {selectedOption.icon}
              </span>
            )}
            <span className="truncate">
              {selectedOption?.label || (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
            </span>
          </div>
          <ChevronDown 
            className={cn(
              'ml-2 h-4 w-4 flex-shrink-0 text-foreground/70 transition-transform duration-200',
              isOpen ? 'rotate-180' : ''
            )} 
            aria-hidden="true"
          />
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div 
            ref={dropdownRef}
            className={cn(
              'absolute z-50 mt-1 w-full rounded-xl bg-card border border-border/50 shadow-lg',
              'py-1 animate-in fade-in-80',
              'overflow-auto max-h-60',
              'focus:outline-none',
              'ring-1 ring-black/5 dark:ring-white/10',
              'backdrop-blur-lg bg-card/95'
            )}
            role="listbox"
            aria-labelledby={`${props.id || 'select'}-label`}
          >
            {options.length === 0 ? (
              <div className="px-4 py-2 text-sm text-muted-foreground text-center">
                No options available
              </div>
            ) : (
              options.map((option) => (
                <div
                  key={option.value}
                  className={cn(
                    'relative flex items-center px-4 py-2.5 text-sm cursor-pointer',
                    'transition-colors duration-150',
                    'hover:bg-accent/50 hover:text-accent-foreground',
                    option.value === internalValue && 'bg-accent/30 text-accent-foreground',
                    option.disabled && 'opacity-50 cursor-not-allowed',
                    'group'
                  )}
                  onClick={() => handleSelect(option)}
                  role="option"
                  aria-selected={option.value === internalValue}
                  aria-disabled={option.disabled}
                >
                  {option.icon && (
                    <span className="mr-2 flex-shrink-0">
                      {option.icon}
                    </span>
                  )}
                  <span className="flex-1 truncate">{option.label}</span>
                  {option.value === internalValue && (
                    <Check className="h-4 w-4 text-primary flex-shrink-0 ml-2" />
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="flex items-center text-sm text-destructive mt-1">
          <AlertCircle className="h-4 w-4 mr-1.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
});

LitSelect.displayName = 'LitSelect';