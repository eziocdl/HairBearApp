import { useState, useRef, useCallback, useEffect } from 'react';
import { useAppStore } from '../lib/store';

interface UseAudioRecordingOptions {
  onTranscriptionUpdate?: (text: string) => void;
  onRecordingComplete?: (audioBlob: Blob) => void;
  onError?: (error: string) => void;
  sampleRate?: number;
  channelCount?: number;
}

interface AudioRecordingState {
  isRecording: boolean;
  isSupported: boolean;
  duration: number;
  error: string | null;
}

export function useAudioRecording(options: UseAudioRecordingOptions = {}) {
  const {
    onTranscriptionUpdate,
    onRecordingComplete,
    onError,
    sampleRate = 44100,
    channelCount = 1,
  } = options;

  // Store
  const setGeminiRecording = useAppStore(state => state.setGeminiRecording);
  const setGeminiError = useAppStore(state => state.setGeminiError);
  const updateGeminiLiveTranscription = useAppStore(state => state.updateGeminiLiveTranscription);
  const clearGeminiLiveTranscription = useAppStore(state => state.clearGeminiLiveTranscription);

  // Local state
  const [state, setState] = useState<AudioRecordingState>({
    isRecording: false,
    isSupported: typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia,
    duration: 0,
    error: null,
  });

  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const durationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const volumeCheckRef = useRef<boolean>(true);

  // Update duration timer
  const updateDuration = useCallback(() => {
    setState(prev => ({ ...prev, duration: prev.duration + 1 }));
  }, []);

  // Silence detection
  const checkForSilence = useCallback(() => {
    if (!analyserRef.current || !volumeCheckRef.current) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteFrequencyData(dataArray);

    // Calculate average volume
    const average = dataArray.reduce((acc, value) => acc + value, 0) / bufferLength;
    const volume = average / 255; // Normalize to 0-1

    // Silence threshold (adjustable)
    const silenceThreshold = 0.01;
    
    if (volume < silenceThreshold) {
      // Start silence timer if not already started
      if (!silenceTimerRef.current) {
        silenceTimerRef.current = setTimeout(() => {
          // Auto-stop recording after 3 seconds of silence
          stopRecording();
        }, 3000);
      }
    } else {
      // Clear silence timer if there's sound
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
    }

    // Continue checking if still recording
    if (state.isRecording) {
      requestAnimationFrame(checkForSilence);
    }
  }, [state.isRecording]);

  const startRecording = useCallback(async () => {
    if (!state.isSupported) {
      const error = 'Gravação de áudio não é suportada neste navegador';
      setState(prev => ({ ...prev, error }));
      setGeminiError(error);
      onError?.(error);
      return;
    }

    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate,
          channelCount,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        }
      });

      streamRef.current = stream;

      // Create MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
      });

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      // Create AudioContext for volume analysis
      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      const analyser = audioContextRef.current.createAnalyser();
      
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      // Set up event handlers
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        onRecordingComplete?.(audioBlob);
        
        // Cleanup
        streamRef.current?.getTracks().forEach(track => track.stop());
        audioContextRef.current?.close();
      };

      mediaRecorder.onerror = (event) => {
        const error = 'Erro durante a gravação';
        setState(prev => ({ ...prev, error, isRecording: false }));
        setGeminiError(error);
        setGeminiRecording(false);
        onError?.(error);
      };

      // Start recording
      mediaRecorder.start(1000); // Collect data every second

      setState(prev => ({
        ...prev,
        isRecording: true,
        duration: 0,
        error: null
      }));
      
      setGeminiRecording(true);
      setGeminiError(null);
      clearGeminiLiveTranscription();
      volumeCheckRef.current = true;

      // Start duration timer
      durationTimerRef.current = setInterval(updateDuration, 1000);

      // Start silence detection
      setTimeout(checkForSilence, 1000); // Start after 1 second

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao acessar o microfone';
      setState(prev => ({ ...prev, error: errorMessage }));
      setGeminiError(errorMessage);
      onError?.(errorMessage);
    }
  }, [
    state.isSupported,
    sampleRate,
    channelCount,
    onRecordingComplete,
    onError,
    setGeminiRecording,
    setGeminiError,
    clearGeminiLiveTranscription,
    updateDuration,
    checkForSilence
  ]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && state.isRecording) {
      volumeCheckRef.current = false;
      
      // Clear timers
      if (durationTimerRef.current) {
        clearInterval(durationTimerRef.current);
        durationTimerRef.current = null;
      }
      
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }

      mediaRecorderRef.current.stop();
      
      setState(prev => ({ ...prev, isRecording: false }));
      setGeminiRecording(false);
    }
  }, [state.isRecording, setGeminiRecording]);

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && state.isRecording) {
      mediaRecorderRef.current.pause();
      volumeCheckRef.current = false;
      
      if (durationTimerRef.current) {
        clearInterval(durationTimerRef.current);
        durationTimerRef.current = null;
      }
    }
  }, [state.isRecording]);

  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && state.isRecording) {
      mediaRecorderRef.current.resume();
      volumeCheckRef.current = true;
      
      // Restart duration timer
      durationTimerRef.current = setInterval(updateDuration, 1000);
      
      // Restart silence detection
      checkForSilence();
    }
  }, [state.isRecording, updateDuration, checkForSilence]);

  const updateLiveTranscription = useCallback((text: string) => {
    updateGeminiLiveTranscription(text);
    onTranscriptionUpdate?.(text);
  }, [updateGeminiLiveTranscription, onTranscriptionUpdate]);

  // Format duration for display
  const formatDuration = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      volumeCheckRef.current = false;
      
      if (durationTimerRef.current) {
        clearInterval(durationTimerRef.current);
      }
      
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
      
      streamRef.current?.getTracks().forEach(track => track.stop());
      audioContextRef.current?.close();
    };
  }, []);

  return {
    ...state,
    formattedDuration: formatDuration(state.duration),
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    updateLiveTranscription,
  };
}

// Specialized hook for simple recording without live transcription
export function useSimpleAudioRecording() {
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  
  const recording = useAudioRecording({
    onRecordingComplete: setAudioBlob,
  });

  return {
    ...recording,
    audioBlob,
    clearAudio: () => setAudioBlob(null),
  };
}