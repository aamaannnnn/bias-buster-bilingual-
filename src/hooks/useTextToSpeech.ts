import { useState, useCallback, useEffect } from 'react';
import { ttsService, TTSOptions, AVAILABLE_VOICES } from '../services/textToSpeech';

export interface UseTTSReturn {
  isPlaying: boolean;
  isPaused: boolean;
  isLoading: boolean;
  error: string | null;
  currentVoice: string;
  volume: number;
  speed: number;
  availableVoices: typeof AVAILABLE_VOICES;
  speak: (text: string) => Promise<void>;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  setVoice: (voiceId: string) => void;
  setVolume: (volume: number) => void;
  setSpeed: (speed: number) => void;
  readHeaders: () => Promise<void>;
}

export const useTextToSpeech = (): UseTTSReturn => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentVoice, setCurrentVoice] = useState('rachel');
  const [volume, setVolumeState] = useState(0.8);
  const [speed, setSpeedState] = useState(1.0);

  // Update playback state from service
  useEffect(() => {
    const interval = setInterval(() => {
      const state = ttsService.getPlaybackState();
      setIsPlaying(state.isPlaying);
      setIsPaused(state.isPaused);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const speak = useCallback(async (text: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const options: TTSOptions = {
        voice: currentVoice,
        speed,
        volume
      };

      const result = await ttsService.synthesizeSpeech(text, options);
      
      if (!result.success) {
        throw new Error(result.error || 'Speech synthesis failed');
      }

      if (result.audioUrl) {
        await ttsService.playAudio(result.audioUrl);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('TTS Error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentVoice, speed, volume]);

  const pause = useCallback(() => {
    ttsService.pause();
  }, []);

  const resume = useCallback(() => {
    ttsService.resume();
  }, []);

  const stop = useCallback(() => {
    ttsService.stop();
    setError(null);
  }, []);

  const setVoice = useCallback((voiceId: string) => {
    setCurrentVoice(voiceId);
  }, []);

  const setVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolumeState(clampedVolume);
    ttsService.setVolume(clampedVolume);
  }, []);

  const setSpeed = useCallback((newSpeed: number) => {
    const clampedSpeed = Math.max(0.5, Math.min(2.0, newSpeed));
    setSpeedState(clampedSpeed);
  }, []);

  const readHeaders = useCallback(async () => {
    try {
      // Find all headers on the page
      const headers = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      const headerTexts: string[] = [];

      headers.forEach((header) => {
        const text = header.textContent?.trim();
        if (text && text.length > 0) {
          // Add appropriate pauses between headers
          headerTexts.push(text);
        }
      });

      if (headerTexts.length === 0) {
        throw new Error('No headers found on the page');
      }

      // Join headers with pauses for better speech flow
      const combinedText = headerTexts.join('. ... '); // Ellipsis creates natural pauses
      
      await speak(combinedText);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to read headers';
      setError(errorMessage);
    }
  }, [speak]);

  return {
    isPlaying,
    isPaused,
    isLoading,
    error,
    currentVoice,
    volume,
    speed,
    availableVoices: AVAILABLE_VOICES,
    speak,
    pause,
    resume,
    stop,
    setVoice,
    setVolume,
    setSpeed,
    readHeaders
  };
};