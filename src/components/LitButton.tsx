import React from 'react';
import { cn } from '../lib/utils';

interface LitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
  children: React.ReactNode;
}

export const LitButton: React.FC<LitButtonProps> = ({
  variant = 'primary',
  size = 'md',
  glow = false,
  className,
  children,
  ...props
}) => {
  const baseClasses = [
    'font-bold rounded-full transition-all duration-200 flex items-center justify-center',
    'transform hover:scale-105 active:scale-95',
    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background'
  ];

  const variantClasses = {
    primary: [
      'bg-primary text-primary-foreground',
      'hover:bg-primary/90',
      'focus:ring-primary',
      glow ? 'shadow-glow-primary' : ''
    ],
    secondary: [
      'bg-secondary text-secondary-foreground',
      'hover:bg-secondary/90',
      'focus:ring-secondary',
      glow ? 'shadow-glow-secondary' : ''
    ],
    success: [
      'bg-gradient-primary text-primary-foreground',
      'hover:opacity-90',
      'focus:ring-primary',
      glow ? 'shadow-glow-primary' : ''
    ],
    danger: [
      'bg-destructive text-destructive-foreground',
      'hover:bg-destructive/90',
      'focus:ring-destructive',
      glow ? 'shadow-glow-accent' : ''
    ]
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};