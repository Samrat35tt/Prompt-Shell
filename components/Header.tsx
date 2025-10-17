import React from 'react';

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => (
  <header className="flex justify-between items-center">
    <div className="text-left">
      <h1 className="text-4xl sm:text-5xl font-bold text-brand-orange-500 tracking-tight">
        Prompt Shell
      </h1>
      <p className="mt-1 text-md text-slate-400">
        Your Elite AI Image Prompt Engineer
      </p>
    </div>
    <button
      onClick={onMenuClick}
      className="p-2 -mr-2 text-slate-300 rounded-md hover:text-brand-orange-500 hover:bg-slate-700/50 lg:hidden"
      aria-label="Open settings menu"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  </header>
);