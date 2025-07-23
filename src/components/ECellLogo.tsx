import React from 'react';
import { cn } from '@/lib/utils';

interface ECellLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function ECellLogo({ className, size = 'md' }: ECellLogoProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={cn(sizeClasses[size], className)}>
      <svg 
        viewBox="0 0 497 497" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <rect x="66.5" y="194.5" width="364" height="108" stroke="currentColor" strokeWidth="3"/>
        <path d="M120.24 278V218.8H170.88V230.32H133.68V242.32H168.48V253.84H133.68V266.48H171.36V278H120.24Z" stroke="currentColor" strokeWidth="2"/>
        <path d="M205.44 278.96C199.04 278.96 193.44 277.68 188.64 275.12C183.84 272.56 180.08 268.96 177.36 264.32C174.64 259.68 173.28 254.24 173.28 248C173.28 241.76 174.64 236.32 177.36 231.68C180.08 227.04 183.84 223.44 188.64 220.88C193.44 218.32 199.04 217.04 205.44 217.04C210.88 217.04 215.68 218.08 219.84 220.16C224 222.24 227.28 225.2 229.68 229.04C232.08 232.88 233.28 237.36 233.28 242.48H219.84C219.84 239.12 218.8 236.48 216.72 234.56C214.64 232.64 211.84 231.68 208.32 231.68C204.8 231.68 202 232.64 189.92 234.56C187.84 236.48 186.8 239.12 186.8 242.48V253.52C186.8 256.88 187.84 259.52 189.92 261.44C192 263.36 194.8 264.32 208.32 264.32C211.84 264.32 214.64 263.36 216.72 261.44C218.8 259.52 219.84 256.88 219.84 253.52H233.28C233.28 258.64 232.08 263.12 229.68 266.96C227.28 270.8 224 273.76 219.84 275.84C215.68 277.92 210.88 278.96 205.44 278.96Z" stroke="currentColor" strokeWidth="2"/>
        <path d="M270.72 278V218.8H321.36V230.32H284.16V242.32H318.96V253.84H284.16V266.48H321.84V278H270.72Z" stroke="currentColor" strokeWidth="2"/>
        <path d="M356.16 278V218.8H369.6V266.48H402V278H356.16Z" stroke="currentColor" strokeWidth="2"/>
        <path d="M111.36 308.8V312.32H127.68V315.2H111.36V318.72H128.16V321.6H108V306H128.16V308.8H111.36Z" stroke="currentColor" strokeWidth="1"/>
        <path d="M138.24 321.6V306H141.6V318.72H153.12V321.6H138.24Z" stroke="currentColor" strokeWidth="1"/>
        <path d="M162.72 321.6V306H166.08V318.72H177.6V321.6H162.72Z" stroke="currentColor" strokeWidth="1"/>
        <path d="M186.24 321.6V306H189.6V321.6H186.24Z" stroke="currentColor" strokeWidth="1"/>
        <path d="M201.12 321.6V306H204.48V318.72H216V321.6H201.12Z" stroke="currentColor" strokeWidth="1"/>
        <path d="M225.6 321.6V306H229.44L235.68 316.32V306H238.8V321.6H235.68L228.72 310.56V321.6H225.6Z" stroke="currentColor" strokeWidth="1"/>
        <path d="M249.84 321.6V306H253.2V321.6H249.84Z" stroke="currentColor" strokeWidth="1"/>
        <path d="M264.72 321.6V306H268.08V318.72H279.6V321.6H264.72Z" stroke="currentColor" strokeWidth="1"/>
        <path d="M288.24 321.6V306H291.6V321.6H288.24Z" stroke="currentColor" strokeWidth="1"/>
        <path d="M303.12 321.6V306H306.48V318.72H318V321.6H303.12Z" stroke="currentColor" strokeWidth="1"/>
        <path d="M327.6 321.6V306H331.44L337.68 316.32V306H340.8V321.6H337.68L330.72 310.56V321.6H327.6Z" stroke="currentColor" strokeWidth="1"/>
        <path d="M351.84 321.6V306H355.2V321.6H351.84Z" stroke="currentColor" strokeWidth="1"/>
        <path d="M366.72 321.6V306H370.08V318.72H381.6V321.6H366.72Z" stroke="currentColor" strokeWidth="1"/>
      </svg>
    </div>
  );
}
