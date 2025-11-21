import { create } from 'zustand';

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

    // Actions
    setBasePhoto: (photo: Blob | null) => void;
    setReferencePhoto: (photo: Blob | null) => void;
    setCurrentStage: (stage: AppState['currentStage']) => void;
    setIsReferenceFlow: (isReference: boolean) => void;
    setSelectedStyle: (style: string | null) => void;
    setSelectedChoice: (choice: AppState['selectedChoice']) => void;
    setResultImages: (images: string[]) => void;
    setQuizResults: (results: AppState['quizResults']) => void;
    reset: () => void;
}

export const useAppStore = create<AppState>((set) => ({
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

    setBasePhoto: (photo) => set({ basePhoto: photo }),
    setReferencePhoto: (photo) => set({ referencePhoto: photo }),
    setCurrentStage: (stage) => set({ currentStage: stage }),
    setIsReferenceFlow: (isReference) => set({ isReferenceFlow: isReference }),
    setSelectedStyle: (style) => set({ selectedStyle: style }),
    setSelectedChoice: (choice) => set({ selectedChoice: choice }),
    setResultImages: (images) => set({ resultImages: images }),
    setQuizResults: (results) => set({ quizResults: results }),
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
    }),
}));
