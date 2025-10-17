
import React from 'react';

export const LoadingSpinner: React.FC = () => (
  <div className="mt-10 flex flex-col items-center justify-center text-center">
    <div className="relative">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-brand-orange-500"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 border-4 border-dashed rounded-full animate-spin-reverse border-amber-500"></div>
    </div>
    <p className="mt-4 text-lg font-semibold text-slate-400 animate-pulse-fast">
      Crafting your masterpiece...
    </p>
  </div>
);
