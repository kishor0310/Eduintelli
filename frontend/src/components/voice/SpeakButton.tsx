import React from 'react';
import { useVoiceAssistant } from '../../context/VoiceAssistantContext';
import { Volume2, VolumeX, Square, Play } from 'lucide-react';
import { cn } from '../../utils/cn';

interface SpeakButtonProps {
  text: string;
  title?: string;
  label?: string;
  size?: 'sm' | 'md' | 'icon';
  variant?: 'default' | 'outline' | 'ghost' | 'brand';
  className?: string;
}

export const SpeakButton: React.FC<SpeakButtonProps> = ({
  text,
  title,
  label = 'Listen',
  size = 'sm',
  variant = 'outline',
  className,
}) => {
  const { speak, stop, isSpeaking, activeText, isPaused, resume, pause } = useVoiceAssistant();

  const isCurrentPlaying = isSpeaking && activeText.slice(0, 50) === text.replace(/[#*_`~>[\]()]/g, '').slice(0, 50);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCurrentPlaying) {
      stop();
    } else {
      speak(text, title || 'Voiceover Narration');
    }
  };

  if (size === 'icon') {
    return (
      <button
        onClick={handleClick}
        title={isCurrentPlaying ? 'Stop Voiceover' : 'Listen with Voiceover Assistant'}
        aria-label={isCurrentPlaying ? 'Stop Voiceover' : 'Listen with Voiceover Assistant'}
        className={cn(
          'p-1.5 rounded-lg transition-all flex items-center justify-center',
          isCurrentPlaying
            ? 'bg-purple-600 text-white shadow-md shadow-purple-500/30 animate-pulse'
            : 'text-slate-500 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40',
          className
        )}
      >
        {isCurrentPlaying ? (
          <Square className="w-3.5 h-3.5 fill-current" />
        ) : (
          <Volume2 className="w-3.5 h-3.5" />
        )}
      </button>
    );
  }

  const variantStyles = {
    default: 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm',
    outline:
      'border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:border-purple-300 dark:hover:border-purple-500/50 hover:text-purple-600 dark:hover:text-purple-300',
    ghost: 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800',
    brand: 'bg-brand-50 text-brand-700 dark:bg-brand-950/50 dark:text-brand-300 border border-brand-200 dark:border-brand-800',
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-lg transition-all',
        size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3.5 py-1.5 text-sm',
        isCurrentPlaying
          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/25 ring-2 ring-purple-400/50'
          : variantStyles[variant],
        className
      )}
    >
      {isCurrentPlaying ? (
        <>
          <div className="flex items-center gap-0.5 h-3">
            <span className="w-1 bg-white rounded-full animate-[soundWave_0.8s_ease-in-out_infinite]" />
            <span className="w-1 bg-white rounded-full animate-[soundWave_0.8s_ease-in-out_0.2s_infinite]" />
            <span className="w-1 bg-white rounded-full animate-[soundWave_0.8s_ease-in-out_0.4s_infinite]" />
          </div>
          <span>Playing Voiceover</span>
          <Square className="w-3 h-3 fill-current ml-1 opacity-80 hover:opacity-100" />
        </>
      ) : (
        <>
          <Volume2 className="w-3.5 h-3.5 text-purple-500" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
};
