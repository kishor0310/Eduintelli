import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { api } from '../services/api';

export interface VoiceAssistantContextType {
  isSpeaking: boolean;
  isPaused: boolean;
  isListening: boolean;
  isMuted: boolean;
  speed: number;
  pitch: number;
  volume: number;
  voices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;
  activeTitle: string;
  activeText: string;
  currentSentence: string;
  transcript: string;
  conversation: { role: 'user' | 'assistant'; text: string; timestamp: string }[];
  isAssistantOpen: boolean;
  isSupported: boolean;

  // Actions
  speak: (text: string, title?: string) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  toggleMute: () => void;
  setSpeed: (rate: number) => void;
  setPitch: (p: number) => void;
  setVolume: (v: number) => void;
  setSelectedVoice: (v: SpeechSynthesisVoice | null) => void;
  startListening: () => void;
  stopListening: () => void;
  askVoiceCoach: (question: string) => Promise<string>;
  openAssistant: () => void;
  closeAssistant: () => void;
  toggleAssistant: () => void;
  clearConversation: () => void;
}

const VoiceAssistantContext = createContext<VoiceAssistantContextType | undefined>(undefined);

export const VoiceAssistantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [speed, setSpeedState] = useState(1);
  const [pitch, setPitchState] = useState(1);
  const [volume, setVolumeState] = useState(1);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [activeTitle, setActiveTitle] = useState('EduIntelli AI Voiceover');
  const [activeText, setActiveText] = useState('');
  const [currentSentence, setCurrentSentence] = useState('');
  const [transcript, setTranscript] = useState('');
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [conversation, setConversation] = useState<{ role: 'user' | 'assistant'; text: string; timestamp: string }[]>([
    {
      role: 'assistant',
      text: 'Hello! I am your EduIntelli Academic Voice Assistant. You can ask me to read your risk assessment, explain study priorities, or answer questions about your courses.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const recognitionRef = useRef<any>(null);
  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  // Load available speech synthesis voices
  useEffect(() => {
    if (!isSupported) return;

    const updateVoices = () => {
      const available = window.speechSynthesis.getVoices();
      if (available.length > 0) {
        setVoices(available);
        // Prioritize natural sounding English voices
        const preferred =
          available.find((v) => v.name.includes('Google') && v.lang.startsWith('en')) ||
          available.find((v) => v.name.includes('Natural') && v.lang.startsWith('en')) ||
          available.find((v) => v.name.includes('Samantha') || v.name.includes('Daniel') || v.name.includes('Karen')) ||
          available.find((v) => v.lang.startsWith('en')) ||
          available[0];
        setSelectedVoice(preferred || null);
      }
    };

    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, [isSupported]);

  // Clean text of markdown / symbols for smooth spoken audio
  const cleanTextForSpeech = (rawText: string) => {
    return rawText
      .replace(/[#*_`~>[\]()]/g, '') // remove markdown symbols
      .replace(/\$(.*?)\$/g, '$1') // inline math
      .replace(/\\text\{([^}]+)\}/g, '$1')
      .replace(/\\times/g, 'times')
      .replace(/•/g, ', ')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const speak = (text: string, title?: string) => {
    if (!isSupported) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const clean = cleanTextForSpeech(text);
    if (!clean) return;

    setActiveTitle(title || 'EduIntelli Voiceover');
    setActiveText(clean);
    setCurrentSentence(clean.slice(0, 100) + '...');
    setIsSpeaking(true);
    setIsPaused(false);

    const utterance = new SpeechSynthesisUtterance(clean);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    utterance.rate = speed;
    utterance.pitch = pitch;
    utterance.volume = isMuted ? 0 : volume;

    // Boundary tracking
    utterance.onboundary = (event) => {
      if (event.name === 'sentence' || event.name === 'word') {
        const remaining = clean.substring(event.charIndex);
        const nextPeriod = remaining.indexOf('.');
        const chunk = nextPeriod !== -1 ? remaining.substring(0, nextPeriod + 1) : remaining.substring(0, 60);
        setCurrentSentence(chunk.trim());
      }
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      setCurrentSentence('');
    };

    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis error:', e);
      setIsSpeaking(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const pause = () => {
    if (!isSupported) return;
    window.speechSynthesis.pause();
    setIsPaused(true);
  };

  const resume = () => {
    if (!isSupported) return;
    window.speechSynthesis.resume();
    setIsPaused(false);
  };

  const stop = () => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
    setCurrentSentence('');
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (isSpeaking) {
      // Re-trigger current text with muted volume
      stop();
      if (!nextMuted) {
        speak(activeText, activeTitle);
      }
    }
  };

  const setSpeed = (rate: number) => {
    setSpeedState(rate);
    if (isSpeaking) {
      stop();
      speak(activeText, activeTitle);
    }
  };

  const setPitch = (p: number) => {
    setPitchState(p);
  };

  const setVolume = (v: number) => {
    setVolumeState(v);
  };

  // Speech to Text (Microphone voice input)
  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported by your browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript('');
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        if (transcript.trim()) {
          askVoiceCoach(transcript.trim());
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  // Query AI Coach and Speak Output
  const askVoiceCoach = async (question: string): Promise<string> => {
    const userMsg = {
      role: 'user' as const,
      text: question,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setConversation((prev) => [...prev, userMsg]);

    try {
      const res = await api.askAICoach(question);
      const answer = res.response || 'I analyzed your request and updated your study priorities.';

      const assistantMsg = {
        role: 'assistant' as const,
        text: answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setConversation((prev) => [...prev, assistantMsg]);

      // Speak the answer automatically!
      speak(answer, 'AI Coach Answer');
      return answer;
    } catch (error) {
      const fallback = 'Focus on raising your attendance above 75% and completing current coursework assignments.';
      const assistantMsg = {
        role: 'assistant' as const,
        text: fallback,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setConversation((prev) => [...prev, assistantMsg]);
      speak(fallback, 'Academic Coaching Advice');
      return fallback;
    }
  };

  const openAssistant = () => setIsAssistantOpen(true);
  const closeAssistant = () => setIsAssistantOpen(false);
  const toggleAssistant = () => setIsAssistantOpen((prev) => !prev);
  const clearConversation = () => setConversation([]);

  return (
    <VoiceAssistantContext.Provider
      value={{
        isSpeaking,
        isPaused,
        isListening,
        isMuted,
        speed,
        pitch,
        volume,
        voices,
        selectedVoice,
        activeTitle,
        activeText,
        currentSentence,
        transcript,
        conversation,
        isAssistantOpen,
        isSupported,
        speak,
        pause,
        resume,
        stop,
        toggleMute,
        setSpeed,
        setPitch,
        setVolume,
        setSelectedVoice,
        startListening,
        stopListening,
        askVoiceCoach,
        openAssistant,
        closeAssistant,
        toggleAssistant,
        clearConversation,
      }}
    >
      {children}
    </VoiceAssistantContext.Provider>
  );
};

export const useVoiceAssistant = () => {
  const context = useContext(VoiceAssistantContext);
  if (!context) {
    throw new Error('useVoiceAssistant must be used within a VoiceAssistantProvider');
  }
  return context;
};
