import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const FutureToolsLogo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const iconSize = size === 'sm' ? 'w-7 h-7' : size === 'lg' ? 'w-10 h-10' : 'w-8 h-8';
  const textSize = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-xl';

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Modern geometric financial emblem: Emerald vault shield with dual layers */}
      <div className={`${iconSize} relative flex items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 shadow-xs text-white p-1`}>
        <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
          {/* Outer shield / vault frame */}
          <rect x="5" y="5" width="22" height="22" rx="6" stroke="white" strokeWidth="2.5" />
          {/* Inner financial graph / key bars */}
          <rect x="10" y="15" width="3" height="7" rx="1.5" fill="white" />
          <rect x="15" y="11" width="3" height="11" rx="1.5" fill="white" />
          <rect x="20" y="8" width="3" height="14" rx="1.5" fill="white" />
        </svg>
      </div>

      <div className="flex flex-col leading-none">
        <div className="flex items-center gap-1">
          <span className={`${textSize} font-extrabold tracking-tight text-slate-900 dark:text-white`}>
            Moneytize
          </span>
          <span className="text-xs px-1.5 py-0.5 rounded-md font-bold bg-emerald-500 text-white tracking-wider uppercase">
            X
          </span>
        </div>
      </div>
    </div>
  );
};
