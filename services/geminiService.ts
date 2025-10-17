import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from '../constants';
import { OutputMode, Emotion, ConsistencyOptions, SearchSource, TargetModel } from '../types';

const buildUserRequest = (
  userInput: string,
  mode: OutputMode,
  aspectRatio: string,
  emotion: Emotion,
  consistency: ConsistencyOptions,
  socialMediaTarget: string | null,
  searchWeb: boolean,
  customModeInput: string,
  targetModel: TargetModel,
  customNegativePrompt: string
) => {
  const consistencyRequest = Object.entries(consistency)
    .filter(([, value]) => value)
    .map(([key]) => {
        switch (key) {
            case 'colorPalette': return 'Color Palette';
            case 'cameraAngle': return 'Camera Angle';
            default: return key.charAt(0).toUpperCase() + key.slice(1);
        }
    })
    .join(', ');

  return `
    User Idea: "${userInput || 'Not provided. Base prompt on image analysis.'}"
    Output Mode: "${mode}"
    Target Image Model: "${targetModel}"
    ${mode === OutputMode.Custom && customModeInput ? `Custom Instructions: "${customModeInput}"` : ''}
    ${customNegativePrompt ? `Custom Negative Prompt: "${customNegativePrompt}"` : ''}
    Aspect Ratio: "${aspectRatio}"
    ${socialMediaTarget ? `Social Media Target: "${socialMediaTarget}"` : ''}
    ${emotion !== Emotion.None ? `Emotion Tone: "${emotion}"` : ''}
    ${consistencyRequest ? `Maintain Consistency in: "${consistencyRequest}"` : ''}
    ${searchWeb ? `Web Search: "Enabled"`: ''}

    Generate the prompt.
    `;
};

export const generatePrompt = async (
  userInput: string,
  mode: OutputMode,
  aspectRatio: string,
  emotion: Emotion,
  consistency: ConsistencyOptions,
  socialMediaTarget: string | null,
  searchWeb: boolean,
  imageBase64: string | null,
  imageMimeType: string | null,
  customModeInput: string,
  targetModel: TargetModel,
  customNegativePrompt: string
): Promise<{ text: string; sources: SearchSource[] | null }> => {
  
  if (!process.env.API_KEY) {
    throw new Error("API key not found. Please ensure it is configured correctly.");
  }
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const userRequest = buildUserRequest(
      userInput, 
      mode, 
      aspectRatio, 
      emotion, 
      consistency, 
      socialMediaTarget, 
      searchWeb, 
      customModeInput,
      targetModel,
      customNegativePrompt
  );
    
  const config: any = {
      systemInstruction: SYSTEM_PROMPT,
      temperature: 0.8,
      topP: 0.9,
  };

  if (searchWeb) {
      config.tools = [{googleSearch: {}}];
  }

  const parts: any[] = [];

  if (imageBase64 && imageMimeType) {
    parts.push({
      inlineData: {
        data: imageBase64,
        mimeType: imageMimeType,
      },
    });
  }
  
  parts.push({ text: userRequest });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts },
      config: config,
    });

    const text = response.text.trim();
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const sources = groundingChunks
        ? groundingChunks
            .map(chunk => chunk.web)
            .filter((web): web is SearchSource => !!(web && web.uri))
        : null;

    return { text, sources };

  } catch (error) {
    console.error("Gemini API error:", error); // Detailed log for developers

    // Provide more specific user-facing errors
    if (error instanceof Error) {
        if (error.message.includes('API key not valid')) {
            throw new Error('The provided API key is invalid. Please check your configuration.');
        }
        if (error.message.includes('quota')) {
            throw new Error('API quota exceeded. Please check your usage or billing status and try again later.');
        }
        if (error.message.toLowerCase().includes('safety')) {
             throw new Error('The request was blocked for safety reasons. Please adjust your prompt and try again.');
        }
    }
    
    // Fallback for other errors
    throw new Error("Failed to generate prompt. The AI service may be experiencing issues. Please try again shortly.");
  }
};