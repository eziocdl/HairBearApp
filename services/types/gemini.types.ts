export interface GeminiMessage {
  role: 'user' | 'model';
  content: string;
  timestamp?: number;
}

export interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
        inlineData?: {
          mimeType: string;
          data: string;
        };
      }>;
    };
  }>;
  text?: string;
  parts?: Array<{
    inlineData?: {
      mimeType: string;
      data: string;
    };
  }>;
}

export interface GeminiState {
  // Loading states
  isLoading: boolean;
  isTranscribing: boolean;
  isRecording: boolean;
  isGeneratingImage: boolean;
  
  // Content
  messages: GeminiMessage[];
  response: string;
  transcription: string;
  liveTranscription: string;
  generatedImage: string | null;
  
  // Error handling
  error: string | null;
}

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

export interface AudioFileConstraints {
  maxSize: number; // in bytes
  allowedTypes: string[];
}

export interface ImageFileConstraints {
  maxSize: number; // in bytes
  allowedTypes: string[];
}

export interface GeminiConfig {
  model: string;
  systemInstruction?: string;
}

export interface GenerateContentOptions {
  model?: string;
  systemInstruction?: string;
}

export interface TranscribeAudioOptions {
  language?: string;
  prompt?: string;
}

export interface GenerateImageOptions {
  model?: string;
  systemInstruction?: string;
  referenceImage?: File;
}

export type GeminiError = {
  message: string;
  type: 'validation' | 'api' | 'quota' | 'network' | 'unknown';
  details?: unknown;
};