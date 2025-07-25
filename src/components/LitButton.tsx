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
      'hover:bg-primary-glow',
      'focus:ring-primary',
      glow ? 'shadow-glow-primary' : ''
    ],
    secondary: [
      'bg-electric-blue text-secondary',
      'hover:bg-cyan-400',
      'focus:ring-electric-blue',
      glow ? 'shadow-glow-electric-blue' : ''
    ],
    success: [
      'bg-lime-green text-secondary',
      'hover:bg-green-400',
      'focus:ring-lime-green',
      glow ? 'shadow-glow-lime-green' : ''
    ],
    danger: [
      'bg-neon-pink text-primary-foreground',
      'hover:bg-pink-500',
      'focus:ring-neon-pink',
      glow ? 'shadow-glow-neon-pink' : ''
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