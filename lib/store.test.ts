import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from './store';

describe('Zustand Store', () => {
    beforeEach(() => {
        // Reset store state before each test
        useAppStore.getState().reset();
    });

    it('initializes with default values', () => {
        const state = useAppStore.getState();

        expect(state.basePhoto).toBeNull();
        expect(state.referencePhoto).toBeNull();
        expect(state.currentStage).toBe('onboarding');
        expect(state.isReferenceFlow).toBe(false);
        expect(state.selectedStyle).toBeNull();
        expect(state.selectedChoice).toBeNull();
        expect(state.resultImages).toEqual([]);
    });

    it('sets base photo', () => {
        const mockBlob = new Blob(['test'], { type: 'image/jpeg' });

        useAppStore.getState().setBasePhoto(mockBlob);

        expect(useAppStore.getState().basePhoto).toBe(mockBlob);
    });

    it('sets reference photo', () => {
        const mockBlob = new Blob(['reference'], { type: 'image/jpeg' });

        useAppStore.getState().setReferencePhoto(mockBlob);

        expect(useAppStore.getState().referencePhoto).toBe(mockBlob);
    });

    it('updates current stage', () => {
        useAppStore.getState().setCurrentStage('camera');
        expect(useAppStore.getState().currentStage).toBe('camera');

        useAppStore.getState().setCurrentStage('results');
        expect(useAppStore.getState().currentStage).toBe('results');
    });

    it('sets reference flow flag', () => {
        useAppStore.getState().setIsReferenceFlow(true);
        expect(useAppStore.getState().isReferenceFlow).toBe(true);
    });

    it('sets selected style', () => {
        useAppStore.getState().setSelectedStyle('pompadour');
        expect(useAppStore.getState().selectedStyle).toBe('pompadour');
    });

    it('sets selected choice', () => {
        useAppStore.getState().setSelectedChoice('haircut_beard');
        expect(useAppStore.getState().selectedChoice).toBe('haircut_beard');
    });

    it('sets result images', () => {
        const images = ['image1.jpg', 'image2.jpg', 'image3.jpg'];

        useAppStore.getState().setResultImages(images);

        expect(useAppStore.getState().resultImages).toEqual(images);
    });

    it('sets quiz results', () => {
        const quizResults = {
            faceShape: 'oval',
            hairType: 'wavy',
            stylePreference: 'classic',
        };

        useAppStore.getState().setQuizResults(quizResults);

        expect(useAppStore.getState().quizResults).toEqual(quizResults);
    });

    it('resets store to initial state', () => {
        // Set some values
        const mockBlob = new Blob(['test'], { type: 'image/jpeg' });
        useAppStore.getState().setBasePhoto(mockBlob);
        useAppStore.getState().setCurrentStage('results');
        useAppStore.getState().setSelectedStyle('fade');

        // Reset
        useAppStore.getState().reset();

        // Verify all values are reset
        const state = useAppStore.getState();
        expect(state.basePhoto).toBeNull();
        expect(state.currentStage).toBe('onboarding');
        expect(state.selectedStyle).toBeNull();
    });
});
