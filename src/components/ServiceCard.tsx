import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../lib/utils';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
  className?: string;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  description,
  icon: Icon,
  onClick,
  className
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'group relative overflow-hidden cursor-pointer',
        'bg-card/50 backdrop-blur-sm border border-border/50',
        'rounded-2xl p-8 transition-all duration-500',
        'hover:scale-105 hover:shadow-2xl hover:border-primary/50',
        'before:absolute before:inset-0 before:bg-gradient-primary before:opacity-0',
        'before:transition-opacity before:duration-500 hover:before:opacity-10',
        className
      )}
    >
      {/* Glow effect */}
      <div className="absolute -inset-1 bg-gradient-primary opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 rounded-2xl" />
      
      {/* Content */}
      <div className="relative z-10 text-center space-y-6">
        {/* Icon container */}
        <div className="relative mx-auto w-20 h-20">
          <div className="absolute inset-0 bg-gradient-primary rounded-2xl shadow-glow-primary opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative w-full h-full bg-gradient-primary rounded-2xl flex items-center justify-center">
            <Icon className="w-10 h-10 text-primary-foreground" />
          </div>
          
          {/* Floating particles effect */}
          <div className="absolute -top-2 -right-2 w-3 h-3 bg-secondary rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 group-hover:animate-pulse" />
          <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 delay-200 group-hover:animate-pulse" />
        </div>

        {/* Text content */}
        <div className="space-y-3">
          <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
            {title}
          </h3>
          <p className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">
            {description}
          </p>
        </div>

        {/* Bottom accent */}
        <div className="h-1 w-0 group-hover:w-full bg-gradient-primary transition-all duration-500 mx-auto rounded-full" />
      </div>
    </div>
  );
};