import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { PromptInput } from './components/PromptInput';
import { OutputDisplay } from './components/OutputDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import { generatePrompt } from './services/geminiService';
import { OutputMode, Emotion, ConsistencyOptions, SearchSource, TargetModel, PromptTemplate } from './types';
import { Sidebar } from './components/Sidebar';
import { NewFeatureShowcase } from './components/NewFeatureShowcase';

const App: React.FC = () => {
  const [userInput, setUserInput] = useState<string>('');
  const [outputMode, setOutputMode] = useState<OutputMode>(OutputMode.Full);
  const [aspectRatio, setAspectRatio] = useState<string>('16:9');
  const [emotion, setEmotion] = useState<Emotion>(Emotion.None);
  const [consistency, setConsistency] = useState<ConsistencyOptions>({
    lighting: false,
    colorPalette: false,
    character: false,
    cameraAngle: false,
  });
  const [targetModel, setTargetModel] = useState<TargetModel>(TargetModel.Generic);
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [ratioMode, setRatioMode] = useState<'standard' | 'social'>('standard');
  const [socialMediaTarget, setSocialMediaTarget] = useState<string | null>(null);
  const [searchWeb, setSearchWeb] = useState<boolean>(false);
  const [sources, setSources] = useState<SearchSource[] | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string | null>(null);
  const [customModeInput, setCustomModeInput] = useState<string>('');
  const [customNegativePrompt, setCustomNegativePrompt] = useState<string>('');
  const [savedPrompts, setSavedPrompts] = useState<string[]>([]);
  const [savedTemplates, setSavedTemplates] = useState<PromptTemplate[]>([]);
  const [promptHistory, setPromptHistory] = useState<string[]>([]);
  const [promptRating, setPromptRating] = useState<'up' | 'down' | null>(null);
  const [showFeatureShowcase, setShowFeatureShowcase] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);


  useEffect(() => {
    try {
      const storedPrompts = localStorage.getItem('savedPrompts');
      if (storedPrompts) {
        setSavedPrompts(JSON.parse(storedPrompts));
      }
      const storedTemplates = localStorage.getItem('savedTemplates');
      if (storedTemplates) {
        setSavedTemplates(JSON.parse(storedTemplates));
      }
      const storedHistory = localStorage.getItem('promptHistory');
      if (storedHistory) {
        setPromptHistory(JSON.parse(storedHistory));
      }
      const hasSeenFeatures = localStorage.getItem('hasSeenV2Features');
      if (!hasSeenFeatures) {
        setShowFeatureShowcase(true);
      }
    } catch (error) {
      console.error("Failed to parse from localStorage", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('savedPrompts', JSON.stringify(savedPrompts));
    } catch (error) {
      console.error("Failed to save prompts to localStorage", error);
    }
  }, [savedPrompts]);

  useEffect(() => {
    try {
      localStorage.setItem('savedTemplates', JSON.stringify(savedTemplates));
    } catch (error) {
      console.error("Failed to save templates to localStorage", error);
    }
  }, [savedTemplates]);

  useEffect(() => {
    try {
      localStorage.setItem('promptHistory', JSON.stringify(promptHistory));
    } catch (error) {
      console.error("Failed to save prompt history to localStorage", error);
    }
  }, [promptHistory]);

  useEffect(() => {
    const isMobile = window.innerWidth < 1024; // Corresponds to lg breakpoint
    if (isSidebarOpen && isMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto'; // Cleanup on unmount
    };
  }, [isSidebarOpen]);

  const handleCloseShowcase = () => {
    localStorage.setItem('hasSeenV2Features', 'true');
    setShowFeatureShowcase(false);
  };


  const handleImageChange = (file: File | null) => {
    if (!file) {
      setImageBase64(null);
      setImageMimeType(null);
      return;
    }

    if (!file.type.startsWith('image/')) {
        setError('Please upload a valid image file (e.g., PNG, JPG, WEBP).');
        return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      // Strips the "data:image/jpeg;base64," part
      const base64String = (reader.result as string).split(',')[1];
      setImageBase64(base64String);
      setImageMimeType(file.type);
      setError(null); // Clear previous errors
    };
    reader.onerror = () => {
        setError('Failed to read the image file.');
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = useCallback(async () => {
    if (!userInput.trim() && !imageBase64) {
      setError('Please enter an idea or upload an image to generate a prompt.');
      return;
    }
    
    setIsSidebarOpen(false); // Close sidebar on mobile when generating
    setIsLoading(true);
    setError(null);
    setGeneratedPrompt('');
    setSources(null);
    setPromptRating(null); // Reset rating for new prompt

    try {
      const result = await generatePrompt(
        userInput, 
        outputMode, 
        aspectRatio, 
        emotion, 
        consistency, 
        socialMediaTarget, 
        searchWeb,
        imageBase64,
        imageMimeType,
        customModeInput,
        targetModel,
        customNegativePrompt
      );
      setGeneratedPrompt(result.text);
      setSources(result.sources);

      // Add to history
      setPromptHistory(prevHistory => {
        const filteredHistory = prevHistory.filter(p => p !== result.text);
        const updatedHistory = [result.text, ...filteredHistory];
        return updatedHistory.slice(0, 20); // Keep last 20 prompts
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [userInput, outputMode, aspectRatio, emotion, consistency, socialMediaTarget, searchWeb, imageBase64, imageMimeType, customModeInput, targetModel, customNegativePrompt]);

  const handleSavePrompt = () => {
    if (generatedPrompt && !savedPrompts.includes(generatedPrompt)) {
      setSavedPrompts(prev => [generatedPrompt, ...prev]);
    }
  };

  const handleDeleteSavedPrompt = (index: number) => {
    setSavedPrompts(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleClearSavedPrompts = () => {
    setSavedPrompts([]);
  };

  const handleUseSavedPrompt = (prompt: string) => {
    setUserInput(prompt);
  };

  const handleSaveAsTemplate = () => {
    if (!generatedPrompt) return;
    const name = window.prompt("Enter a name for your template:", "");
    if (name && name.trim()) {
      const trimmedName = name.trim();
      if (savedTemplates.some(t => t.name.toLowerCase() === trimmedName.toLowerCase())) {
        setError(`A template with the name "${trimmedName}" already exists. Please choose a different name.`);
        setTimeout(() => setError(null), 3000);
        return;
      }
      setSavedTemplates(prev => [{ name: trimmedName, prompt: generatedPrompt }, ...prev]);
    }
  };

  const handleDeleteSavedTemplate = (index: number) => {
    setSavedTemplates(prev => prev.filter((_, i) => i !== index));
  };

  const handleClearSavedTemplates = () => {
    setSavedTemplates([]);
  };

  const handleUseSavedTemplate = (prompt: string) => {
    setUserInput(prompt);
  };
  
  const handleDeleteHistoryPrompt = (index: number) => {
    setPromptHistory(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleClearHistory = () => {
    setPromptHistory([]);
  };
  
  const handleUseHistoryPrompt = (prompt: string) => {
    setUserInput(prompt);
  };

  const handleRatePrompt = (rating: 'up' | 'down') => {
    if (promptRating === null) {
      setPromptRating(rating);
      // In a real application, you would send this feedback to a server.
      console.log(`Prompt rated: ${rating}. Feedback captured for analysis.`);
    }
  };

  const isGenerateDisabled = isLoading || (!userInput.trim() && !imageBase64);

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-mid to-brand-dark text-slate-200 font-sans flex">
      {showFeatureShowcase && <NewFeatureShowcase onClose={handleCloseShowcase} />}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        outputMode={outputMode}
        setOutputMode={setOutputMode}
        aspectRatio={aspectRatio}
        setAspectRatio={setAspectRatio}
        emotion={emotion}
        setEmotion={setEmotion}
        consistency={consistency}
        setConsistency={setConsistency}
        ratioMode={ratioMode}
        setRatioMode={setRatioMode}
        setSocialMediaTarget={setSocialMediaTarget}
        searchWeb={searchWeb}
        setSearchWeb={setSearchWeb}
        imageBase64={imageBase64}
        onImageChange={handleImageChange}
        onGenerate={handleGenerate}
        isLoading={isLoading}
        isGenerateDisabled={isGenerateDisabled}
        customModeInput={customModeInput}
        setCustomModeInput={setCustomModeInput}
        targetModel={targetModel}
        setTargetModel={setTargetModel}
        customNegativePrompt={customNegativePrompt}
        setCustomNegativePrompt={setCustomNegativePrompt}
        savedPrompts={savedPrompts}
        onDeleteSavedPrompt={handleDeleteSavedPrompt}
        onClearSavedPrompts={handleClearSavedPrompts}
        onUseSavedPrompt={handleUseSavedPrompt}
        onUseInspiration={setUserInput}
        savedTemplates={savedTemplates}
        onDeleteSavedTemplate={handleDeleteSavedTemplate}
        onClearSavedTemplates={handleClearSavedTemplates}
        onUseSavedTemplate={handleUseSavedTemplate}
        promptHistory={promptHistory}
        onDeleteHistoryPrompt={handleDeleteHistoryPrompt}
        onClearHistory={handleClearHistory}
        onUseHistoryPrompt={handleUseHistoryPrompt}
      />

      <div className="flex-1 flex flex-col h-screen">
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-4xl mx-auto">
                <Header onMenuClick={() => setIsSidebarOpen(true)} />
                <div className="mt-8 space-y-8">
                    <PromptInput
                        userInput={userInput}
                        setUserInput={setUserInput}
                        isLoading={isLoading}
                    />

                    {error && (
                        <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-center">
                        <p>{error}</p>
                        </div>
                    )}

                    {isLoading && <LoadingSpinner />}
                    
                    {generatedPrompt && !isLoading && (
                        <OutputDisplay 
                          prompt={generatedPrompt} 
                          sources={sources}
                          onSave={handleSavePrompt}
                          isSaved={savedPrompts.includes(generatedPrompt)}
                          onSaveAsTemplate={handleSaveAsTemplate}
                          rating={promptRating}
                          onRate={handleRatePrompt}
                        />
                    )}

                    {!isLoading && !generatedPrompt && !error && (
                         <div className="pt-16 flex flex-col items-center justify-center text-center text-slate-500">
                            <div className="relative w-16 h-16 mb-6 text-brand-orange-500">
                                <svg xmlns="http://www.w.org/2000/svg" className="absolute w-16 h-16 top-0 left-0 opacity-70" viewBox="0 0 64 64" fill="currentColor"><path d="M32 0l-6 26-26 6 26 6 6 26 6-26 26-6-26-6z"></path></svg>
                                <svg xmlns="http://www.w3.org/2000/svg" className="absolute w-8 h-8 -top-2 -right-4 opacity-50 transform rotate-45" viewBox="0 0 64 64" fill="currentColor"><path d="M32 0l-6 26-26 6 26 6 6 26 6-26 26-6-26-6z"></path></svg>
                                <svg xmlns="http://www.w3.org/2000/svg" className="absolute w-6 h-6 bottom-1 -left-3 opacity-60 transform -rotate-30" viewBox="0 0 64 64" fill="currentColor"><path d="M32 0l-6 26-26 6 26 6 6 26 6-26 26-6-26-6z"></path></svg>
                            </div>
                            <h3 className="text-xl font-semibold text-slate-300">Your professionally engineered prompt will appear here</h3>
                            <p className="text-slate-500 mt-2 max-w-md">Configure your settings, enter an idea or upload an image, and let Prompt Shell work its magic.</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
      </div>
    </div>
  );
};

export default App;