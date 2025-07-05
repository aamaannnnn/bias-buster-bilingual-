import axios from 'axios';

export interface TTSOptions {
  voice?: string;
  speed?: number;
  pitch?: number;
  volume?: number;
}

export interface TTSResponse {
  success: boolean;
  audioUrl?: string;
  error?: string;
}

const TTS_API_KEY = 'ap2_65657be6-38e9-40a2-aa90-920efd4e51ba';
const TTS_API_BASE_URL = 'https://api.elevenlabs.io/v1';

// Available voices (you can expand this list based on ElevenLabs available voices)
export const AVAILABLE_VOICES = [
  { id: 'rachel', name: 'Rachel', gender: 'female', accent: 'american' },
  { id: 'drew', name: 'Drew', gender: 'male', accent: 'american' },
  { id: 'clyde', name: 'Clyde', gender: 'male', accent: 'american' },
  { id: 'paul', name: 'Paul', gender: 'male', accent: 'american' },
  { id: 'domi', name: 'Domi', gender: 'female', accent: 'american' },
  { id: 'dave', name: 'Dave', gender: 'male', accent: 'british' },
  { id: 'fin', name: 'Fin', gender: 'male', accent: 'irish' },
  { id: 'sarah', name: 'Sarah', gender: 'female', accent: 'american' },
];

export class TextToSpeechService {
  private currentAudio: HTMLAudioElement | null = null;
  private isPlaying: boolean = false;
  private isPaused: boolean = false;

  async synthesizeSpeech(text: string, options: TTSOptions = {}): Promise<TTSResponse> {
    try {
      const {
        voice = 'rachel',
        speed = 1.0,
        pitch = 1.0,
        volume = 0.8
      } = options;

      // Clean and prepare text for TTS
      const cleanText = this.cleanTextForTTS(text);
      
      if (!cleanText.trim()) {
        return { success: false, error: 'No text to synthesize' };
      }

      const response = await axios.post(
        `${TTS_API_BASE_URL}/text-to-speech/${voice}`,
        {
          text: cleanText,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
            style: 0.0,
            use_speaker_boost: true
          }
        },
        {
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': TTS_API_KEY
          },
          responseType: 'blob'
        }
      );

      // Create audio URL from blob
      const audioBlob = new Blob([response.data], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);

      return { success: true, audioUrl };
    } catch (error) {
      console.error('TTS API Error:', error);
      
      // Fallback to browser's built-in speech synthesis
      return this.fallbackToWebSpeechAPI(text, options);
    }
  }

  private fallbackToWebSpeechAPI(text: string, options: TTSOptions): TTSResponse {
    try {
      if (!('speechSynthesis' in window)) {
        return { success: false, error: 'Speech synthesis not supported' };
      }

      const utterance = new SpeechSynthesisUtterance(this.cleanTextForTTS(text));
      utterance.rate = options.speed || 1.0;
      utterance.pitch = options.pitch || 1.0;
      utterance.volume = options.volume || 0.8;

      // Try to find a voice that matches the requested voice
      const voices = speechSynthesis.getVoices();
      const selectedVoice = voices.find(voice => 
        voice.name.toLowerCase().includes(options.voice || 'default')
      ) || voices[0];

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      speechSynthesis.speak(utterance);
      return { success: true };
    } catch (error) {
      console.error('Web Speech API Error:', error);
      return { success: false, error: 'Speech synthesis failed' };
    }
  }

  private cleanTextForTTS(text: string): string {
    return text
      .replace(/[^\w\s.,!?;:-]/g, '') // Remove special characters except basic punctuation
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
  }

  async playAudio(audioUrl: string): Promise<void> {
    try {
      if (this.currentAudio) {
        this.currentAudio.pause();
        this.currentAudio = null;
      }

      this.currentAudio = new Audio(audioUrl);
      this.currentAudio.volume = 0.8;
      
      this.currentAudio.addEventListener('ended', () => {
        this.isPlaying = false;
        this.isPaused = false;
        URL.revokeObjectURL(audioUrl); // Clean up blob URL
      });

      this.currentAudio.addEventListener('error', (e) => {
        console.error('Audio playback error:', e);
        this.isPlaying = false;
        this.isPaused = false;
      });

      await this.currentAudio.play();
      this.isPlaying = true;
      this.isPaused = false;
    } catch (error) {
      console.error('Error playing audio:', error);
      throw error;
    }
  }

  pause(): void {
    if (this.currentAudio && this.isPlaying) {
      this.currentAudio.pause();
      this.isPaused = true;
      this.isPlaying = false;
    }
  }

  resume(): void {
    if (this.currentAudio && this.isPaused) {
      this.currentAudio.play();
      this.isPaused = false;
      this.isPlaying = true;
    }
  }

  stop(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.isPlaying = false;
      this.isPaused = false;
    }
    
    // Stop web speech synthesis if it's running
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
  }

  getPlaybackState(): { isPlaying: boolean; isPaused: boolean } {
    return {
      isPlaying: this.isPlaying,
      isPaused: this.isPaused
    };
  }

  setVolume(volume: number): void {
    if (this.currentAudio) {
      this.currentAudio.volume = Math.max(0, Math.min(1, volume));
    }
  }
}

// Singleton instance
export const ttsService = new TextToSpeechService();