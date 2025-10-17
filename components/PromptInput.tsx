import React from 'react';

interface PromptInputProps {
  userInput: string;
  setUserInput: (value: string) => void;
  isLoading: boolean;
}

export const PromptInput: React.FC<PromptInputProps> = ({
  userInput,
  setUserInput,
  isLoading,
}) => {
  return (
    <div className="rounded-2xl bg-slate-500/10 p-1 shadow-inner-glass border border-slate-700/50">
      <div className="p-5">
        <label htmlFor="prompt-input" className="block text-sm font-semibold text-slate-300 mb-3 tracking-wider uppercase">
          Your Idea
        </label>
        <textarea
          id="prompt-input"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="e.g., A robot reading a book... or upload an image for analysis"
          className="w-full h-28 p-0 bg-transparent border-none focus:ring-0 transition-colors text-slate-200 placeholder-slate-500 resize-none text-base"
          disabled={isLoading}
        />
      </div>
    </div>
  );
};