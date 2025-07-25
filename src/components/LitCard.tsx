import React from 'react';
import { cn } from '../lib/utils';

interface LitCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  gradient?: boolean;
}

export const LitCard: React.FC<LitCardProps> = ({
  children,
  className,
  glow = true,
  gradient = false,
  ...props
}) => {
  const baseClasses = [
    'bg-card border-2 border-primary rounded-2xl p-6',
    'text-card-foreground'
  ];

  const effectClasses = [
    glow ? 'shadow-glow-primary' : '',
    gradient ? 'bg-gradient-to-br from-secondary to-card' : ''
  ];

  return (
    <div className={cn(baseClasses, effectClasses, className)} {...props}>
      {children}
    </div>
  );
};