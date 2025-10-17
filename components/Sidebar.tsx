import React, { useState, useEffect } from 'react';
import { OutputMode, Emotion, ConsistencyOptions, TargetModel, PromptTemplate } from '../types';
import { SOCIAL_MEDIA_SIZES, INSPIRATION_EXAMPLES } from '../constants';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  outputMode: OutputMode;
  setOutputMode: (mode: OutputMode) => void;
  aspectRatio: string;
  setAspectRatio: (ratio: string) => void;
  emotion: Emotion;
  setEmotion: (emotion: Emotion) => void;
  consistency: ConsistencyOptions;
  setConsistency: (options: ConsistencyOptions) => void;
  ratioMode: 'standard' | 'social';
  setRatioMode: (mode: 'standard' | 'social') => void;
  setSocialMediaTarget: (target: string | null) => void;
  searchWeb: boolean;
  setSearchWeb: (value: boolean) => void;
  imageBase64: string | null;
  onImageChange: (file: File | null) => void;
  onGenerate: () => void;
  isLoading: boolean;
  isGenerateDisabled: boolean;
  customModeInput: string;
  setCustomModeInput: (value: string) => void;
  targetModel: TargetModel;
  setTargetModel: (model: TargetModel) => void;
  customNegativePrompt: string;
  setCustomNegativePrompt: (value: string) => void;
  savedPrompts: string[];
  onDeleteSavedPrompt: (index: number) => void;
  onClearSavedPrompts: () => void;
  onUseSavedPrompt: (prompt: string) => void;
  onUseInspiration: (prompt: string) => void;
  savedTemplates: PromptTemplate[];
  onDeleteSavedTemplate: (index: number) => void;
  onClearSavedTemplates: () => void;
  onUseSavedTemplate: (prompt: string) => void;
  promptHistory: string[];
  onDeleteHistoryPrompt: (index: number) => void;
  onClearHistory: () => void;
  onUseHistoryPrompt: (prompt: string) => void;
}

const aspectRatios = ['16:9', '1:1', '9:16', '4:3', '3:4', '2:3', '3:2'];

const negativePromptModels = [
  TargetModel.StableDiffusion,
  TargetModel.Leonardo,
  TargetModel.Kandinsky,
  TargetModel.Playground,
];

const sharedSelectClass = "w-full p-2.5 bg-slate-800/50 border border-slate-700/80 rounded-lg focus:ring-2 focus:ring-brand-orange-500 focus:border-brand-orange-500 transition-colors text-slate-200 text-sm";

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  outputMode,
  setOutputMode,
  aspectRatio,
  setAspectRatio,
  emotion,
  setEmotion,
  consistency,
  setConsistency,
  ratioMode,
  setRatioMode,
  setSocialMediaTarget,
  searchWeb,
  setSearchWeb,
  imageBase64,
  onImageChange,
  onGenerate,
  isLoading,
  isGenerateDisabled,
  customModeInput,
  setCustomModeInput,
  targetModel,
  setTargetModel,
  customNegativePrompt,
  setCustomNegativePrompt,
  savedPrompts,
  onDeleteSavedPrompt,
  onClearSavedPrompts,
  onUseSavedPrompt,
  onUseInspiration,
  savedTemplates,
  onDeleteSavedTemplate,
  onClearSavedTemplates,
  onUseSavedTemplate,
  promptHistory,
  onDeleteHistoryPrompt,
  onClearHistory,
  onUseHistoryPrompt,
}) => {
  const socialPlatforms = Object.keys(SOCIAL_MEDIA_SIZES || {});

  const [platform, setPlatform] = useState(() => socialPlatforms[0] || '');

  const [postType, setPostType] = useState(() => {
    const initialPlatform = socialPlatforms[0] || '';
    const platformData = (SOCIAL_MEDIA_SIZES || {})[initialPlatform];
    const postTypes = Object.keys(platformData || {});
    return postTypes[0] || '';
  });

  useEffect(() => {
    if (ratioMode === 'social') {
      const newRatio = SOCIAL_MEDIA_SIZES?.[platform]?.[postType];
      if (newRatio) {
        setAspectRatio(newRatio);
        setSocialMediaTarget(`${platform} - ${postType}`);
      }
    } else {
      if (!aspectRatios.includes(aspectRatio)) {
        setAspectRatio(aspectRatios[0]);
      }
      setSocialMediaTarget(null);
    }
  }, [ratioMode, platform, postType, setAspectRatio, setSocialMediaTarget]);
  

  const handlePlatformChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPlatform = e.target.value;
    setPlatform(newPlatform);
    const postTypes = Object.keys(SOCIAL_MEDIA_SIZES?.[newPlatform] || {});
    const newPostType = postTypes[0] || '';
    setPostType(newPostType);
  };

  const handlePostTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPostType(e.target.value);
  };
  
  const handleConsistencyChange = (option: keyof ConsistencyOptions) => {
    setConsistency({
      ...consistency,
      [option]: !consistency[option],
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    onImageChange(file || null);
  };

  const handleRemoveImage = () => {
    onImageChange(null);
    const fileInput = document.getElementById('image-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const renderSection = (title: string, children: React.ReactNode, titleAddon?: React.ReactNode) => (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</label>
        {titleAddon}
      </div>
      {children}
    </div>
  );

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/60 z-30 transition-opacity lg:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      ></div>
      <aside className={`fixed top-0 left-0 z-40 w-80 h-screen bg-brand-mid/80 border-r-2 border-brand-orange-700/50 flex flex-col transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex-grow overflow-y-auto p-6 space-y-6 backdrop-blur-sm">

          <div className="flex justify-between items-center lg:hidden -mt-2 mb-2">
              <h2 className="text-lg font-bold text-brand-orange-500">Settings</h2>
              <button onClick={onClose} className="p-2 -mr-2 text-slate-400 rounded-md hover:bg-slate-700/50 hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
          </div>
        
          {renderSection('Target Image Model', (
            <select value={targetModel} onChange={(e) => setTargetModel(e.target.value as TargetModel)} className={sharedSelectClass} disabled={isLoading}>
              {Object.values(TargetModel).map((model) => (
                <option key={model} value={model}>{model}</option>
              ))}
            </select>
          ))}

          {negativePromptModels.includes(targetModel) && renderSection('Custom Negative Prompt', (
            <textarea
                value={customNegativePrompt}
                onChange={(e) => setCustomNegativePrompt(e.target.value)}
                placeholder="e.g., extra limbs, blurry"
                className={`${sharedSelectClass} h-20 resize-none`}
                disabled={isLoading}
            />
          ))}

          {renderSection('Output Mode', (
            <>
              <select value={outputMode} onChange={(e) => setOutputMode(e.target.value as OutputMode)} className={sharedSelectClass} disabled={isLoading}>
                {Object.values(OutputMode).map((mode) => (
                  <option key={mode} value={mode}>{mode}</option>
                ))}
              </select>
              {outputMode === OutputMode.Short && (
                <div className="mt-2 p-2 bg-slate-800/70 rounded-md text-xs text-slate-400 border border-slate-700/50">
                  <p className="font-semibold text-slate-300 mb-1">Example:</p>
                  <p className="font-mono">Lone cyberpunk samurai, rainy skyscraper rooftop, melancholic, neon city --ar 16:9</p>
                </div>
              )}
              {outputMode === OutputMode.Custom && (
                <textarea
                  value={customModeInput}
                  onChange={(e) => setCustomModeInput(e.target.value)}
                  placeholder="Explain how you want the prompt to be generated..."
                  className={`${sharedSelectClass} h-24 mt-2 resize-none`}
                  disabled={isLoading}
                />
              )}
            </>
          ))}

          {renderSection('Image Size', (
            <>
              <div className="flex items-center rounded-lg bg-slate-800/60 p-1">
                <button onClick={() => setRatioMode('standard')} className={`w-1/2 p-1.5 text-xs font-semibold rounded-md transition-colors ${ratioMode === 'standard' ? 'bg-brand-orange-600 text-white shadow' : 'text-slate-300 hover:bg-slate-700/50'}`}>
                  Standard
                </button>
                <button onClick={() => setRatioMode('social')} className={`w-1/2 p-1.5 text-xs font-semibold rounded-md transition-colors ${ratioMode === 'social' ? 'bg-brand-orange-600 text-white shadow' : 'text-slate-300 hover:bg-slate-700/50'}`}>
                  Social Media
                </button>
              </div>
              {ratioMode === 'standard' ? (
                <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)} className={sharedSelectClass} disabled={isLoading}>
                  {aspectRatios.map((ratio) => <option key={ratio} value={ratio}>{ratio}</option>)}
                </select>
              ) : (
                <div className="space-y-2">
                  <select value={platform} onChange={handlePlatformChange} className={sharedSelectClass} disabled={isLoading}>
                    {socialPlatforms.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                  <select value={postType} onChange={handlePostTypeChange} className={sharedSelectClass} disabled={isLoading}>
                    {Object.keys(SOCIAL_MEDIA_SIZES?.[platform] || {}).map((pt) => <option key={pt} value={pt}>{pt}</option>)}
                  </select>
                </div>
              )}
            </>
          ))}

          {renderSection('Emotion', (
            <select value={emotion} onChange={(e) => setEmotion(e.target.value as Emotion)} className={sharedSelectClass} disabled={isLoading}>
              {Object.values(Emotion).map((emo) => <option key={emo} value={emo}>{emo}</option>)}
            </select>
          ))}
          
          {renderSection('Visual Consistency', (
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-1 text-sm">
                {(Object.keys(consistency) as Array<keyof ConsistencyOptions>).map((key) => (
                    <label key={key} htmlFor={`consistency-${key}`} className="flex items-center space-x-2 cursor-pointer text-slate-300">
                        <input
                            id={`consistency-${key}`}
                            type="checkbox"
                            checked={consistency[key]}
                            onChange={() => handleConsistencyChange(key)}
                            disabled={isLoading}
                            className="h-4 w-4 rounded bg-slate-700 border-slate-600 text-brand-orange-600 focus:ring-brand-orange-500 focus:ring-offset-brand-mid"
                        />
                        <span>{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}</span>
                    </label>
                ))}
              </div>
          ))}

          {renderSection('Visual Intelligence', (
            <label htmlFor="search-web" className="flex items-center justify-between p-2 rounded-lg bg-slate-800/50 cursor-pointer">
              <span className="text-slate-300 text-sm font-medium">Search for Trending Styles</span>
              <div className="relative">
                <input
                  id="search-web"
                  type="checkbox"
                  className="sr-only peer"
                  checked={searchWeb}
                  onChange={() => setSearchWeb(!searchWeb)}
                  disabled={isLoading}
                />
                <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-focus:ring-2 peer-focus:ring-offset-2 peer-focus:ring-offset-slate-800 peer-focus:ring-brand-orange-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-orange-600"></div>
              </div>
            </label>
          ))}

          {renderSection('Image Analysis', (
            <div>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={isLoading}
              />
              {imageBase64 ? (
                <div className="relative group">
                  <img src={`data:image/jpeg;base64,${imageBase64}`} alt="Uploaded preview" className="rounded-lg w-full h-auto" />
                  <button
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1.5"
                    aria-label="Remove image"
                    title="Remove image"
                    disabled={isLoading}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => document.getElementById('image-upload')?.click()}
                  disabled={isLoading}
                  className="w-full text-center px-4 py-3 border-2 border-dashed border-slate-600 rounded-lg text-slate-400 hover:bg-slate-700/50 hover:border-slate-500 transition-colors"
                >
                  <span className="text-sm">Upload Image</span>
                </button>
              )}
            </div>
          ))}

          {renderSection('Inspiration', (
            <div className="flex flex-wrap gap-2">
              {INSPIRATION_EXAMPLES.map((example) => (
                <button
                  key={example.name}
                  onClick={() => onUseInspiration(example.prompt)}
                  disabled={isLoading}
                  className="px-2 py-1 bg-slate-700/50 text-slate-300 rounded-md text-xs hover:bg-brand-orange-600 hover:text-white transition-colors disabled:opacity-50"
                >
                  {example.name}
                </button>
              ))}
            </div>
          ))}

          {promptHistory.length > 0 && renderSection(
            'Prompt History',
            (
              <div className="space-y-2 max-h-48 overflow-y-auto bg-slate-800/50 p-2 rounded-lg border border-slate-700/80">
                {promptHistory.map((prompt, index) => (
                  <div key={index} className="bg-slate-700/50 p-2 rounded-md flex justify-between items-center group">
                    <p className="text-xs text-slate-300 truncate pr-2 flex-1">{prompt}</p>
                    <div className="flex items-center space-x-1">
                      <button onClick={() => onUseHistoryPrompt(prompt)} title="Use this prompt" className="p-1 rounded text-slate-400 hover:bg-brand-orange-600 hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                            <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                          </svg>
                      </button>
                      <button onClick={() => onDeleteHistoryPrompt(index)} title="Delete prompt" className="p-1 rounded text-slate-400 hover:bg-red-600 hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                          </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ),
            <button onClick={onClearHistory} className="text-xs text-red-400 hover:text-red-300 hover:underline" disabled={isLoading}>
              Clear All
            </button>
          )}

          {savedTemplates.length > 0 && renderSection(
            'My Templates',
            (
              <div className="space-y-2 max-h-48 overflow-y-auto bg-slate-800/50 p-2 rounded-lg border border-slate-700/80">
                {savedTemplates.map((template, index) => (
                  <div key={index} className="bg-slate-700/50 p-2 rounded-md flex justify-between items-center group">
                    <p className="text-xs text-slate-300 truncate pr-2 flex-1 font-semibold">{template.name}</p>
                    <div className="flex items-center space-x-1">
                      <button onClick={() => onUseSavedTemplate(template.prompt)} title="Use this template" className="p-1 rounded text-slate-400 hover:bg-brand-orange-600 hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                            <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                          </svg>
                      </button>
                      <button onClick={() => onDeleteSavedTemplate(index)} title="Delete template" className="p-1 rounded text-slate-400 hover:bg-red-600 hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                          </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ),
            <button onClick={onClearSavedTemplates} className="text-xs text-red-400 hover:text-red-300 hover:underline" disabled={isLoading}>
              Clear All
            </button>
          )}

          {savedPrompts.length > 0 && renderSection(
            'Saved Prompts',
            (
              <div className="space-y-2 max-h-48 overflow-y-auto bg-slate-800/50 p-2 rounded-lg border border-slate-700/80">
                {savedPrompts.map((prompt, index) => (
                  <div key={index} className="bg-slate-700/50 p-2 rounded-md flex justify-between items-center group">
                    <p className="text-xs text-slate-300 truncate pr-2 flex-1">{prompt}</p>
                    <div className="flex items-center space-x-1">
                      <button onClick={() => onUseSavedPrompt(prompt)} title="Use this prompt" className="p-1 rounded text-slate-400 hover:bg-brand-orange-600 hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                            <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                          </svg>
                      </button>
                      <button onClick={() => onDeleteSavedPrompt(index)} title="Delete prompt" className="p-1 rounded text-slate-400 hover:bg-red-600 hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                          </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ),
            <button onClick={onClearSavedPrompts} className="text-xs text-red-400 hover:text-red-300 hover:underline" disabled={isLoading}>
              Clear All
            </button>
          )}
        </div>

        <div className="mt-auto p-6 pt-4 border-t border-slate-700/50">
          <button
            onClick={onGenerate}
            disabled={isGenerateDisabled}
            className="w-full flex items-center justify-center p-3 font-semibold text-white bg-brand-orange-600 rounded-lg hover:bg-brand-orange-700 disabled:bg-brand-orange-900/50 disabled:text-slate-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 shadow-lg shadow-brand-orange-900/30"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Engineering...
              </>
            ) : (
              'Forge Prompt'
            )}
          </button>
        </div>
      </aside>
    </>
  );
};