import React from 'react';

interface NewFeatureShowcaseProps {
  onClose: () => void;
}

const FeatureItem: React.FC<{ title: string; description: string; children: React.ReactNode }> = ({ title, description, children }) => (
    <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 w-10 h-10 bg-brand-orange-900/50 border border-brand-orange-700/50 rounded-lg flex items-center justify-center text-brand-orange-500">
            {children}
        </div>
        <div>
            <h4 className="font-semibold text-slate-100">{title}</h4>
            <p className="text-slate-400 text-sm">{description}</p>
        </div>
    </div>
);

export const NewFeatureShowcase: React.FC<NewFeatureShowcaseProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-brand-dark/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-[fadeIn_0.3s_ease-out]">
        <div className="w-full max-w-2xl bg-gradient-to-br from-brand-mid to-brand-dark border-2 border-brand-orange-700/50 rounded-2xl shadow-2xl shadow-brand-dark/50 transform animate-[zoomIn_0.3s_ease-out] overflow-hidden">
            <div className="p-6 sm:p-8 space-y-6">
                <header className="text-center">
                    <h2 className="text-2xl sm:text-3xl font-bold text-brand-orange-500 tracking-tight">Welcome to the New Prompt Shell</h2>
                    <p className="mt-2 text-slate-400">We've rebuilt our core intelligence to turn you into a world-class creative director.</p>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <FeatureItem title="Core Intelligence Upgrade" description="Generate cinematic, professional prompts with enhanced understanding of lighting, composition, and art styles.">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                    </FeatureItem>

                    <FeatureItem title="Trend Awareness" description="Leverage web search to incorporate trending styles, aesthetics, and themes into your prompts automatically.">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                    </FeatureItem>

                    <FeatureItem title="Interactive Refinement" description="New output modes like 'Breakdown' and 'Short' give you more control and help you learn prompt engineering.">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                    </FeatureItem>

                     <FeatureItem title="Technical Precision" description="Optimize prompts for specific platforms and aspect ratios, with advanced camera and lighting logic.">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </FeatureItem>
                </div>
            </div>
            <div className="bg-brand-dark/30 px-6 sm:px-8 py-4 flex justify-end">
                <button
                    onClick={onClose}
                    className="px-6 py-2 font-semibold text-white bg-brand-orange-600 rounded-lg hover:bg-brand-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-brand-orange-900/30"
                >
                    Explore Now
                </button>
            </div>
        </div>
    </div>
  );
};