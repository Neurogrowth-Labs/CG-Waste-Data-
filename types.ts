
export enum View {
  DASHBOARD = 'DASHBOARD',
  PROJECTS = 'PROJECTS',
  TRACKING = 'TRACKING',
  INTELLIGENCE = 'INTELLIGENCE',
  CREATIVE = 'CREATIVE',
  SETTINGS = 'SETTINGS'
}

export interface WasteMetric {
  name: string;
  value: number;
  color: string;
}

export interface Project {
  id: string;
  name: string;
  location: string;
  status: 'Active' | 'Completed' | 'Planning';
  wasteDiversionRate: number;
  complianceScore: number;
  hazmatStatus: 'Clear' | 'Potential' | 'Detected';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  sources?: Array<{ title: string; uri: string }>;
  images?: string[];
}

export enum GeminiModel {
  FLASH_LITE = 'gemini-flash-lite-latest',
  FLASH_3 = 'gemini-3-flash-preview',
  PRO_3 = 'gemini-3-pro-preview',
  FLASH_IMG_2_5 = 'gemini-2.5-flash-image',
  PRO_IMG_3 = 'gemini-3-pro-image-preview',
  VEO_FAST = 'veo-3.1-fast-generate-preview',
  VEO_GEN = 'veo-3.1-generate-preview',
  LIVE_AUDIO = 'gemini-2.5-flash-native-audio-preview-09-2025',
  TTS = 'gemini-2.5-flash-preview-tts'
}

export interface User {
  name: string;
  email: string;
  role: string;
  organization: string;
  jurisdiction: string;
  standards: string[];
}

// Window augmentation for AudioContext
declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}
