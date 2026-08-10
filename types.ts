
export enum View {
  DASHBOARD = 'DASHBOARD',
  PROJECTS = 'PROJECTS',
  FIELD_OPS = 'FIELD_OPS',
  TRACKING = 'TRACKING',
  INTELLIGENCE = 'INTELLIGENCE',
  CREATIVE = 'CREATIVE',
  EDGE = 'EDGE',
  COMPLIANCE = 'COMPLIANCE',
  TWIN = 'TWIN',
  MARKETPLACE = 'MARKETPLACE',
  EDUCATION = 'EDUCATION',
  SETTINGS = 'SETTINGS',
  KYC_SECURITY = 'KYC_SECURITY'
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
  LIVE_AUDIO = 'gemini-2.5-flash-native-audio-preview-12-2025',
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

// --- EDGE-Specific Data Models (Part 1: Core Entity Architecture) ---

export interface EdgeProject {
  project_id: string;
  project_name: string;
  location: string; // Country, City, GPS
  project_type: 'Residential' | 'Commercial' | 'Mixed' | 'Hospitality' | 'Retail';
  edge_target_level: 'Certified' | 'Advanced' | 'Zero Carbon';
  gross_floor_area: number; // m2
  construction_phase: 'Design' | 'Construction' | 'Demolition';
  start_date?: string;
  end_date?: string;
}

export interface EdgeMaterialStream {
  material_id: string;
  material_type: 'Concrete' | 'Steel' | 'Timber' | 'Glass' | 'Plastics' | 'Brick' | 'Excavation' | 'Hazardous';
  category: 'Structure' | 'Envelope' | 'Finish' | 'Site'; 
  baseline_quantity_tons: number; // Locked EDGE Baseline (Audit Safe)
  improved_quantity_tons: number; // Actual / Proposed Strategy
  disposal_method: 'Landfill' | 'Reuse' | 'Recycle';
  recovery_percentage: number;
  evidence_status: 'Pending' | 'Uploaded' | 'Verified';
  source?: 'Estimated' | 'BIM-Derived' | 'Measured' | 'Manual Input'; // Track origin of data
}

export interface BimMaterial {
  id: string;
  element_name: string; // e.g. "Basic Wall: Generic 200mm"
  bim_quantity: number;
  unit: 'm3' | 'm2' | 'kg';
  edge_category: string; // Mapped category
  estimated_waste_rate: number; // %
}

// Window augmentation for AudioContext and AI Studio
declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
    aistudio?: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}
