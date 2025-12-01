import { create } from 'zustand';
import type { GeminiMessage, GeminiState } from '../services/types/gemini.types';

export interface AppState {
    // Photo states
    basePhoto: Blob | null;
    referencePhoto: Blob | null;

    // Flow states
    currentStage: 'onboarding' | 'camera' | 'upload' | 'analysis' | 'suggestions' | 'results' | 'reference';
    isReferenceFlow: boolean;

    // Selection states
    selectedStyle: string | null;
    selectedChoice: 'haircut' | 'haircut_beard' | 'beard' | null;

    // Result states
    resultImages: string[];

    quizResults: {
        faceShape: string | null;
        hairType: string | null;
        stylePreference: string | null;
    };

    // Gemini states
    gemini: GeminiState;

    // Actions
    setBasePhoto: (photo: Blob | null) => void;
    setReferencePhoto: (photo: Blob | null) => void;
    setCurrentStage: (stage: AppState['currentStage']) => void;
    setIsReferenceFlow: (isReference: boolean) => void;
    setSelectedStyle: (style: string | null) => void;
    setSelectedChoice: (choice: AppState['selectedChoice']) => void;
    setResultImages: (images: string[]) => void;
    setQuizResults: (results: AppState['quizResults']) => void;

    // Gemini actions
    setGeminiLoading: (loading: boolean) => void;
    setGeminiTranscribing: (transcribing: boolean) => void;
    setGeminiRecording: (recording: boolean) => void;
    setGeminiGeneratingImage: (generating: boolean) => void;
    setGeminiError: (error: string | null) => void;
    setGeminiResponse: (response: string) => void;
    setGeminiTranscription: (transcription: string) => void;
    setGeminiLiveTranscription: (transcription: string) => void;
    setGeminiGeneratedImage: (image: string | null) => void;
    addGeminiMessage: (message: GeminiMessage) => void;
    clearGeminiMessages: () => void;
    clearGeminiTranscription: () => void;
    clearGeminiLiveTranscription: () => void;
    updateGeminiLiveTranscription: (text: string) => void;
    
    reset: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
    basePhoto: null,
    referencePhoto: null,
    currentStage: 'onboarding',
    isReferenceFlow: false,
    selectedStyle: null,
    selectedChoice: null,
    resultImages: [],
    quizResults: {
        faceShape: null,
        hairType: null,
        stylePreference: null,
    },

    // Gemini initial state
    gemini: {
        isLoading: false,
        isTranscribing: false,
        isRecording: false,
        isGeneratingImage: false,
        messages: [],
        response: '',
        transcription: '',
        liveTranscription: '',
        generatedImage: null,
        error: null,
    },

    setBasePhoto: (photo) => set({ basePhoto: photo }),
    setReferencePhoto: (photo) => set({ referencePhoto: photo }),
    setCurrentStage: (stage) => set({ currentStage: stage }),
    setIsReferenceFlow: (isReference) => set({ isReferenceFlow: isReference }),
    setSelectedStyle: (style) => set({ selectedStyle: style }),
    setSelectedChoice: (choice) => set({ selectedChoice: choice }),
    setResultImages: (images) => set({ resultImages: images }),
    setQuizResults: (results) => set({ quizResults: results }),

    // Gemini actions
    setGeminiLoading: (loading) => set((state) => ({
        gemini: { ...state.gemini, isLoading: loading }
    })),
    setGeminiTranscribing: (transcribing) => set((state) => ({
        gemini: { ...state.gemini, isTranscribing: transcribing }
    })),
    setGeminiRecording: (recording) => set((state) => ({
        gemini: { ...state.gemini, isRecording: recording }
    })),
    setGeminiGeneratingImage: (generating) => set((state) => ({
        gemini: { ...state.gemini, isGeneratingImage: generating }
    })),
    setGeminiError: (error) => set((state) => ({
        gemini: { ...state.gemini, error }
    })),
    setGeminiResponse: (response) => set((state) => ({
        gemini: { ...state.gemini, response }
    })),
    setGeminiTranscription: (transcription) => set((state) => ({
        gemini: { ...state.gemini, transcription }
    })),
    setGeminiLiveTranscription: (liveTranscription) => set((state) => ({
        gemini: { ...state.gemini, liveTranscription }
    })),
    setGeminiGeneratedImage: (generatedImage) => set((state) => ({
        gemini: { ...state.gemini, generatedImage }
    })),
    addGeminiMessage: (message) => set((state) => ({
        gemini: {
            ...state.gemini,
            messages: [...state.gemini.messages, { ...message, timestamp: Date.now() }]
        }
    })),
    clearGeminiMessages: () => set((state) => ({
        gemini: { ...state.gemini, messages: [] }
    })),
    clearGeminiTranscription: () => set((state) => ({
        gemini: { ...state.gemini, transcription: '' }
    })),
    clearGeminiLiveTranscription: () => set((state) => ({
        gemini: { ...state.gemini, liveTranscription: '' }
    })),
    updateGeminiLiveTranscription: (text) => {
        const { gemini } = get();
        const current = gemini.liveTranscription;
        let separator = '';
        
        if (current && text) {
            // Se o texto atual não termina com pontuação e o novo não começa com pontuação
            const currentEndsWithPunctuation = /[.!?]$/.test(current.trim());
            const newStartsWithPunctuation = /^[.!?,]/.test(text);

            if (!currentEndsWithPunctuation && !newStartsWithPunctuation) {
                separator = ' ';
            } else if (currentEndsWithPunctuation && !newStartsWithPunctuation) {
                separator = ' ';
            }
        }

        set((state) => ({
            gemini: {
                ...state.gemini,
                liveTranscription: current + separator + text
            }
        }));
    },

    reset: () => set({
        basePhoto: null,
        referencePhoto: null,
        currentStage: 'onboarding',
        isReferenceFlow: false,
        selectedStyle: null,
        selectedChoice: null,
        resultImages: [],
        quizResults: {
            faceShape: null,
            hairType: null,
            stylePreference: null,
        },
        gemini: {
            isLoading: false,
            isTranscribing: false,
            isRecording: false,
            isGeneratingImage: false,
            messages: [],
            response: '',
            transcription: '',
            liveTranscription: '',
            generatedImage: null,
            error: null,
        },
    }),
}));
