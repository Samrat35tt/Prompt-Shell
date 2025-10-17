import React, { useState } from 'react';
import { SearchSource } from '../types';

interface OutputDisplayProps {
  prompt: string;
  sources: SearchSource[] | null;
  onSave: () => void;
  isSaved: boolean;
  onSaveAsTemplate: () => void;
  rating: 'up' | 'down' | null;
  onRate: (rating: 'up' | 'down') => void;
}

export const OutputDisplay: React.FC<OutputDisplayProps> = ({ prompt, sources, onSave, isSaved, onSaveAsTemplate, rating, onRate }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedPrompt = prompt.split('\n').filter(line => line.trim() !== '').map((line, index) => {
    const trimmedLine = line.trim();

    // 1. Heading Check
    if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
      const isNegative = trimmedLine.toLowerCase().includes('negative');
      const title = trimmedLine.replace(/\*\*/g, '');
      return (
        <div key={index} className="flex items-center gap-3 mt-4 mb-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isNegative ? 'bg-red-900/50 text-red-400' : 'bg-orange-900/50 text-orange-400'}`}>
            {isNegative ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            )}
          </div>
          <h3 className={`font-semibold text-lg ${isNegative ? 'text-red-400' : 'text-orange-400'}`}>
            {title}
          </h3>
        </div>
      );
    }
    
    // 2. Parameters check
    if (trimmedLine.includes('--')) {
      return (
        <code key={index} className="block mt-4 bg-slate-800/60 text-cyan-400 px-4 py-2 rounded-lg shadow-inner text-sm font-medium">
          {trimmedLine}
        </code>
      );
    }

    // 3. Keyword list check
    const isKeywordList = trimmedLine.includes(',') && !trimmedLine.startsWith('>') && !trimmedLine.startsWith('`');
    if (isKeywordList && trimmedLine.length > 20) {
      return (
        <div key={index} className="flex flex-wrap gap-2 leading-relaxed py-1">
          {trimmedLine.split(',').map((keyword, kwIndex) => {
            const trimmedKeyword = keyword.trim();
            if (!trimmedKeyword) return null;
            return (
              <span key={kwIndex} className="inline-block bg-slate-700/60 rounded-md px-2.5 py-1 text-slate-300 text-xs ring-1 ring-slate-600/50 hover:bg-slate-700 transition-colors cursor-default">
                {trimmedKeyword}
              </span>
            );
          })}
        </div>
      );
    }

    // 4. Default: Descriptive text
    return (
      <p key={index} className="text-slate-300 leading-relaxed text-base my-1">
        {line}
      </p>
    );
  });

  const isRated = rating !== null;

  return (
    <div className="mt-8 relative group animate-prompt-reveal">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-orange-700 via-rose-600 to-purple-700 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
      <div className="relative rounded-2xl bg-brand-mid/95 shadow-inner-glass border border-slate-700/50">
        <div className="p-6">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Engineered Prompt</h2>
          <div className="space-y-2">
              {formattedPrompt}
          </div>
          {sources && sources.length > 0 && (
            <div className="mt-6 pt-4 border-t border-slate-700/50">
              <h3 className="text-sm font-semibold text-slate-400 mb-2">Sources</h3>
              <ul className="space-y-1">
                {sources.map((source, index) => (
                  <li key={index} className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-2 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    <a
                      href={source.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-400 hover:text-orange-300 text-xs hover:underline truncate"
                      title={source.title || source.uri}
                    >
                      {source.title || source.uri}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="absolute top-4 right-4 flex space-x-2">
          <button
            onClick={() => onRate('up')}
            disabled={isRated}
            className={`p-2 rounded-lg transition-all duration-300 backdrop-blur-sm ${
              rating === 'up' 
                ? 'bg-green-600 text-white' 
                : 'bg-slate-700/50 hover:bg-green-600 text-slate-300 hover:text-white'
            } disabled:opacity-100 disabled:cursor-default`}
            aria-label="Rate prompt up"
            title="Good prompt"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333V17a1 1 0 001 1h6.364a1 1 0 00.942-.671l1.85-5.48a1 1 0 00-.203-1.134L14.5 8.118V6.5a1 1 0 00-1-1h-2.5a1 1 0 00-1 1v1.882L8.203 10.333a1 1 0 00-.203 1.134L6 10.333z" />
            </svg>
          </button>
          <button
            onClick={() => onRate('down')}
            disabled={isRated}
            className={`p-2 rounded-lg transition-all duration-300 backdrop-blur-sm ${
              rating === 'down' 
                ? 'bg-red-600 text-white' 
                : 'bg-slate-700/50 hover:bg-red-600 text-slate-300 hover:text-white'
            } disabled:opacity-100 disabled:cursor-default`}
            aria-label="Rate prompt down"
            title="Bad prompt"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667V3a1 1 0 00-1-1h-6.364a1 1 0 00-.942.671l-1.85 5.48a1 1 0 00.203 1.134L5.5 11.882V13.5a1 1 0 001 1h2.5a1 1 0 001-1v-1.882l1.797-1.882a1 1 0 00.203-1.134L14 9.667z" />
            </svg>
          </button>
          <div className="w-px bg-slate-600/50 mx-1"></div>
          <button
            onClick={onSaveAsTemplate}
            className="bg-slate-700/50 hover:bg-blue-600 text-slate-300 hover:text-white p-2 rounded-lg transition-all duration-300 backdrop-blur-sm"
            aria-label="Save as template"
            title="Save as template"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v2a2 2 0 01-2 2H7a2 2 0 01-2-2V4z" />
              <path d="M3 9a2 2 0 012-2h10a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            </svg>
          </button>
          <button
            onClick={onSave}
            disabled={isSaved}
            className="bg-slate-700/50 hover:bg-green-600 disabled:bg-green-800/50 disabled:text-green-400 disabled:cursor-not-allowed text-slate-300 hover:text-white p-2 rounded-lg transition-all duration-300 backdrop-blur-sm"
            aria-label={isSaved ? "Prompt saved" : "Save prompt"}
            title={isSaved ? "Prompt saved" : "Save prompt"}
          >
            {isSaved ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            )}
          </button>
          <button
            onClick={handleCopy}
            className="bg-slate-700/50 hover:bg-brand-orange-600 text-slate-300 hover:text-white p-2 rounded-lg transition-all duration-300 backdrop-blur-sm"
            aria-label="Copy prompt"
            title="Copy prompt"
          >
            {copied ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};