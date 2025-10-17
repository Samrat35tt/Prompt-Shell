export enum OutputMode {
  Full = 'Full Professional Mode',
  Short = 'Short Mode',
  Breakdown = 'Breakdown Mode',
  Poster = 'Poster / Cover Art',
  UGC = 'UGC Ad Photo',
  Product = 'Product Shot',
  Custom = 'Custom Mode',
}

export enum Emotion {
  None = 'None',
  Joyful = 'Joyful',
  Melancholic = 'Melancholic',
  Triumphant = 'Triumphant',
  Nostalgic = 'Nostalgic',
  Mysterious = 'Mysterious',
  Ominous = 'Ominous',
  Serene = 'Serene',
}

export interface ConsistencyOptions {
  lighting: boolean;
  colorPalette: boolean;
  character: boolean;
  cameraAngle: boolean;
}

export interface SearchSource {
  uri: string;
  title: string;
}

export interface PromptTemplate {
  name: string;
  prompt: string;
}

export enum TargetModel {
    Generic = 'Generic / Universal',
    Midjourney = 'Midjourney',
    StableDiffusion = 'Stable Diffusion',
    Leonardo = 'Leonardo.Ai',
    Dalle3 = 'DALL-E 3',
    Firefly = 'Adobe Firefly',
    Ideogram = 'Ideogram',
    Kandinsky = 'Kandinsky',
    Playground = 'Playground AI',
    NanoBanana = 'Nano Banana',
    Sora = 'Sora',
    Runway = 'Runway',
}