import React from 'react';
import { cn } from '@/lib/utils';

interface ECellLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function ECellLogo({ className, size = 'md' }: ECellLogoProps) {
  const sizeClasses = {
    sm: 'w-16 h-10',
    md: 'w-20 h-12',
    lg: 'w-32 h-20'
  };

  return (
    <div className={cn(sizeClasses[size], className)}>
      <svg
        viewBox="0 0 500 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Outer border frame */}
        <rect x="20" y="60" width="460" height="180" stroke="currentColor" strokeWidth="4" fill="none"/>

        {/* E-CELL text with exact styling from image */}
        <text x="120" y="160" fontFamily="Arial, sans-serif" fontSize="48" fontWeight="bold" fill="currentColor" letterSpacing="4">E-CELL</text>

        {/* Separator line */}
        <line x1="120" y1="180" x2="460" y2="180" stroke="currentColor" strokeWidth="2"/>

        {/* RAGHU ENGINEERING COLLEGE text */}
        <text x="120" y="200" fontFamily="Arial, sans-serif" fontSize="12" fill="currentColor" letterSpacing="4">RAGHU ENGINEERING COLLEGE</text>
      </svg>
    </div>
  );
}
