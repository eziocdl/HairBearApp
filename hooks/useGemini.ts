import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppStore } from '../lib/store';
import { geminiService } from '../services/gemini.service';
import type {
  GenerateContentOptions,
  TranscribeAudioOptions,
  GenerateImageOptions,
  GeminiMessage,
} from '../services/types/gemini.types';

export function useGemini() {
  const queryClient = useQueryClient();
  
  // Store selectors
  const geminiState = useAppStore(state => state.gemini);
  const setGeminiLoading = useAppStore(state => state.setGeminiLoading);
  const setGeminiTranscribing = useAppStore(state => state.setGeminiTranscribing);
  const setGeminiGeneratingImage = useAppStore(state => state.setGeminiGeneratingImage);
  const setGeminiError = useAppStore(state => state.setGeminiError);
  const setGeminiResponse = useAppStore(state => state.setGeminiResponse);
  const setGeminiTranscription = useAppStore(state => state.setGeminiTranscription);
  const setGeminiGeneratedImage = useAppStore(state => state.setGeminiGeneratedImage);
  const addGeminiMessage = useAppStore(state => state.addGeminiMessage);
  const clearGeminiMessages = useAppStore(state => state.clearGeminiMessages);
  const clearGeminiTranscription = useAppStore(state => state.clearGeminiTranscription);

  // Generate Content Mutation
  const generateContentMutation = useMutation({
    mutationFn: async ({ prompt, options }: { prompt: string; options?: GenerateContentOptions }) => {
      setGeminiLoading(true);
      setGeminiError(null);
      
      try {
        const response = await geminiService.generateContent(prompt, options);
        
        // Add messages to store
        addGeminiMessage({ role: 'user', content: prompt });
        addGeminiMessage({ role: 'model', content: response });
        
        // Set response in store
        setGeminiResponse(response);
        
        return response;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro ao gerar conteúdo';
        setGeminiError(errorMessage);
        throw error;
      } finally {
        setGeminiLoading(false);
      }
    },
    onSuccess: (data) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['gemini', 'content'] });
    },
  });

  // Transcribe Audio Mutation
  const transcribeAudioMutation = useMutation({
    mutationFn: async ({ file, options }: { file: File; options?: TranscribeAudioOptions }) => {
      setGeminiTranscribing(true);
      setGeminiError(null);
      
      try {
        const transcription = await geminiService.transcribeAudio(file, options);
        setGeminiTranscription(transcription);
        return transcription;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro na transcrição';
        setGeminiError(errorMessage);
        throw error;
      } finally {
        setGeminiTranscribing(false);
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['gemini', 'transcription'] });
    },
  });

  // Generate Image Mutation
  const generateImageMutation = useMutation({
    mutationFn: async ({ prompt, options }: { prompt: string; options?: GenerateImageOptions }) => {
      setGeminiGeneratingImage(true);
      setGeminiError(null);
      
      try {
        const imageData = await geminiService.generateImage(prompt, options);
        setGeminiGeneratedImage(imageData);
        return imageData;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro ao gerar imagem';
        setGeminiError(errorMessage);
        throw error;
      } finally {
        setGeminiGeneratingImage(false);
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['gemini', 'image'] });
    },
  });

  // Validation queries (cached)
  const validateAudioFile = useQuery({
    queryKey: ['gemini', 'validate', 'audio'],
    queryFn: () => null, // This will be used with setQueryData
    enabled: false,
  });

  const validateImageFile = useQuery({
    queryKey: ['gemini', 'validate', 'image'],
    queryFn: () => null,
    enabled: false,
  });

  // Helper functions
  const generateContent = (prompt: string, options?: GenerateContentOptions) => {
    return generateContentMutation.mutate({ prompt, options });
  };

  const transcribeAudio = (file: File, options?: TranscribeAudioOptions) => {
    return transcribeAudioMutation.mutate({ file, options });
  };

  const generateImage = (prompt: string, options?: GenerateImageOptions) => {
    return generateImageMutation.mutate({ prompt, options });
  };

  const validateAudio = (file: File) => {
    const validation = geminiService.validateAudioFile(file);
    queryClient.setQueryData(['gemini', 'validate', 'audio', file.name], validation);
    return validation;
  };

  const validateImage = (file: File) => {
    const validation = geminiService.validateImageFile(file);
    queryClient.setQueryData(['gemini', 'validate', 'image', file.name], validation);
    return validation;
  };

  const clearMessages = () => {
    clearGeminiMessages();
    queryClient.removeQueries({ queryKey: ['gemini', 'content'] });
  };

  const clearTranscription = () => {
    clearGeminiTranscription();
    queryClient.removeQueries({ queryKey: ['gemini', 'transcription'] });
  };

  const clearError = () => {
    setGeminiError(null);
  };

  return {
    // State
    ...geminiState,
    
    // Loading states from mutations
    isGeneratingContent: generateContentMutation.isPending,
    isTranscribingAudio: transcribeAudioMutation.isPending,
    isGeneratingImage: generateImageMutation.isPending,
    
    // Actions
    generateContent,
    transcribeAudio,
    generateImage,
    validateAudio,
    validateImage,
    clearMessages,
    clearTranscription,
    clearError,
    
    // Mutations (for advanced usage)
    mutations: {
      generateContent: generateContentMutation,
      transcribeAudio: transcribeAudioMutation,
      generateImage: generateImageMutation,
    },
  };
}

// Specialized hook for text generation only
export function useGeminiText() {
  const {
    messages,
    response,
    error,
    isGeneratingContent,
    generateContent,
    clearMessages,
    clearError,
  } = useGemini();

  return {
    messages,
    response,
    error,
    isLoading: isGeneratingContent,
    generate: generateContent,
    clearMessages,
    clearError,
  };
}

// Specialized hook for audio transcription
export function useGeminiAudio() {
  const {
    transcription,
    error,
    isTranscribingAudio,
    transcribeAudio,
    validateAudio,
    clearTranscription,
    clearError,
  } = useGemini();

  return {
    transcription,
    error,
    isTranscribing: isTranscribingAudio,
    transcribe: transcribeAudio,
    validateFile: validateAudio,
    clearTranscription,
    clearError,
  };
}

// Specialized hook for image generation
export function useGeminiImages() {
  const {
    generatedImage,
    error,
    isGeneratingImage,
    generateImage,
    validateImage,
    clearError,
  } = useGemini();

  return {
    generatedImage,
    error,
    isGenerating: isGeneratingImage,
    generate: generateImage,
    validateFile: validateImage,
    clearError,
  };
}