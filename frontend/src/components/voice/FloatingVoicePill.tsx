import React, { useState } from 'react';
import { useVoiceAssistant } from '../../context/VoiceAssistantContext';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  Mic,
  MicOff,
  Sparkles,
  ChevronUp,
  X,
  Gauge,
} from 'lucide-react';
import { cn } from '../../utils/cn';

export const FloatingVoicePill: React.FC = () => {
  const {
    isSpeaking,
    isPaused,
    isListening,
    activeTitle,
    currentSentence,
    pause,
    resume,
    stop,
    toggleMute,
    isMuted,
    speed,
    setSpeed,
    startListening,
    stopListening,
    openAssistant,
  } = useVoiceAssistant();

  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) {
    return (
      <button
        onClick={() => setIsDismissed(false)}
        className="fixed bottom-5 right-5 z-40 p-3 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-xl shadow-purple-500/30 hover:scale-110 transition-transform flex items-center justify-center"
        title="Open Voice Over Assistant"
      >
        <Volume2 className="w-5 h-5 animate-pulse" />
      </button>
    );
  }

  const cycleSpeed = () => {
    if (speed === 1) setSpeed(1.25);
    else if (speed === 1.25) setSpeed(1.5);
    else if (speed === 1.5) setSpeed(0.85);
    else setSpeed(1);
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 max-w-sm sm:max-w-md w-full px-4 sm:px-0 transition-all duration-300">
      <div
        className={cn(
          'rounded-2xl p-3 sm:p-4 backdrop-blur-xl border transition-all duration-300 shadow-xl',
          isSpeaking || isListening
            ? 'bg-white/95 dark:bg-slate-900/95 border-purple-500/40 shadow-purple-500/20 ring-1 ring-purple-500/30'
            : 'bg-white/90 dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 shadow-slate-900/10 dark:shadow-black/40'
        )}
      >
        {/* Top Header Row */}
        <div className="flex items-center justify-between gap-3 mb-2">
          <div
            onClick={openAssistant}
            className="flex items-center gap-2 cursor-pointer group flex-1 min-w-0"
          >
            {/* Visual Equalizer / Mic Orb */}
            <div
              className={cn(
                'w-8 h-8 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105',
                isSpeaking
                  ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/30'
                  : isListening
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300'
              )}
            >
              {isSpeaking ? (
                <div className="flex items-center gap-0.5 h-3">
                  <span className="w-0.5 bg-white rounded-full animate-[soundWave_0.6s_ease-in-out_infinite]" />
                  <span className="w-0.5 bg-white rounded-full animate-[soundWave_0.6s_ease-in-out_0.2s_infinite]" />
                  <span className="w-0.5 bg-white rounded-full animate-[soundWave_0.6s_ease-in-out_0.4s_infinite]" />
                  <span className="w-0.5 bg-white rounded-full animate-[soundWave_0.6s_ease-in-out_0.1s_infinite]" />
                </div>
              ) : isListening ? (
                <Mic className="w-4 h-4 animate-bounce" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
            </div>

            <div className="truncate">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-800 dark:text-white tracking-tight">
                  {isSpeaking ? activeTitle : isListening ? 'Listening to you...' : 'Voice Assistant'}
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                  {isSpeaking ? 'LIVE SPEECH' : isListening ? 'VOICE IN' : 'READY'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {isSpeaking
                  ? currentSentence || 'Reading academic insights...'
                  : isListening
                  ? 'Speak your question clearly...'
                  : 'Click to open interactive voice suite'}
              </p>
            </div>
          </div>

          {/* Quick Action Controls */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Speed multiplier */}
            {isSpeaking && (
              <button
                onClick={cycleSpeed}
                title="Change Voice Speed"
                className="px-1.5 py-1 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-purple-100 dark:hover:bg-purple-900/40"
              >
                {speed}x
              </button>
            )}

            {/* Play / Pause Toggle */}
            {isSpeaking && (
              <button
                onClick={isPaused ? resume : pause}
                title={isPaused ? 'Resume' : 'Pause'}
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-purple-600 dark:hover:text-purple-400"
              >
                {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5" />}
              </button>
            )}

            {/* Stop Button */}
            {isSpeaking && (
              <button
                onClick={stop}
                title="Stop Voiceover"
                className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
              </button>
            )}

            {/* Mute Toggle */}
            <button
              onClick={toggleMute}
              title={isMuted ? 'Unmute' : 'Mute Voiceover'}
              className={cn(
                'p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white',
                isMuted && 'text-rose-500 hover:text-rose-600 bg-rose-50 dark:bg-rose-950/30'
              )}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>

            {/* Voice Input Mic Toggle */}
            <button
              onClick={isListening ? stopListening : startListening}
              title={isListening ? 'Stop listening' : 'Ask Voice Assistant by Voice'}
              className={cn(
                'p-1.5 rounded-lg transition-colors',
                isListening
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-300'
              )}
            >
              {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
            </button>

            {/* Expand Full Assistant */}
            <button
              onClick={openAssistant}
              title="Expand Voice Assistant"
              className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-300 hover:bg-purple-100"
            >
              <ChevronUp className="w-3.5 h-3.5" />
            </button>

            {/* Dismiss / Minimize */}
            <button
              onClick={() => setIsDismissed(true)}
              title="Minimize Assistant"
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Live Audio Waves when speaking */}
        {isSpeaking && (
          <div className="flex items-center gap-1 w-full pt-1">
            <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex items-center">
              <div className="h-full w-full bg-gradient-to-r from-purple-500 via-indigo-500 to-sky-400 animate-[pulse_1.5s_ease-in-out_infinite]" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
