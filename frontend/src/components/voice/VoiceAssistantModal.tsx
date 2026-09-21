import React, { useState } from 'react';
import { useVoiceAssistant } from '../../context/VoiceAssistantContext';
import { useAuth } from '../../context/AuthContext';
import {
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Square,
  Play,
  Pause,
  X,
  Sparkles,
  Send,
  RotateCcw,
  Settings,
  Bot,
  User as UserIcon,
  HelpCircle,
  GraduationCap,
  CalendarCheck,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '../../utils/cn';

export const VoiceAssistantModal: React.FC = () => {
  const {
    isAssistantOpen,
    closeAssistant,
    isSpeaking,
    isPaused,
    isListening,
    activeTitle,
    activeText,
    currentSentence,
    pause,
    resume,
    stop,
    speed,
    setSpeed,
    voices,
    selectedVoice,
    setSelectedVoice,
    startListening,
    stopListening,
    askVoiceCoach,
    conversation,
    clearConversation,
    speak,
  } = useVoiceAssistant();

  const { user } = useAuth();
  const [inputText, setInputText] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAssistantOpen) return null;

  const handleSendText = async () => {
    if (!inputText.trim() || isSubmitting) return;
    const q = inputText.trim();
    setInputText('');
    setIsSubmitting(true);
    try {
      await askVoiceCoach(q);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendText();
    }
  };

  // Academic Quick Voice Presets
  const triggerBriefing = () => {
    if (user?.role === 'TEACHER') {
      speak(
        `Faculty Briefing for Professor ${user.name}: Your class currently has 21 enrolled students with an overall attendance average of 84.6%. 3 students have been flagged by the early warning system as High Risk, including Jordan Hayes at 69% risk. I recommend initiating 1-on-1 office hour interventions for weak scores in Discrete Mathematics.`,
        'Faculty Class Briefing'
      );
    } else if (user?.role === 'ADMIN') {
      speak(
        `Institutional Governance Briefing for ${user.name}: Campus enrollment is currently 1,240 students across 4 academic departments. Overall institutional retention is 94.2% with a mean CGPA of 3.42. The Computer Science department shows the highest academic momentum, while Information Technology requires supplemental TA support for Data Structures.`,
        'Executive Governance Briefing'
      );
    } else {
      // Student
      speak(
        `Academic Briefing for ${user?.name || 'Student'}: Your current semester standing shows a CGPA of 3.85 with an attendance rate of 94%. Your multi-factor risk index is Low at 12 out of 100. All assignments are submitted on time, and your academic velocity is positive. Excellent progress!`,
        'Student Academic Briefing'
      );
    }
  };

  const triggerRiskDiagnostic = () => {
    speak(
      `AI Risk Diagnostic: Your risk formulation evaluates four core pillars. Attendance carries a 25% weight, assignments 20%, midterms 35%, and historical velocity 20%. Any compound deficits below 75% attendance trigger early intervention warnings to prevent course failure.`,
      'AI Risk Engine Diagnostic'
    );
  };

  const triggerStudyPlan = () => {
    speak(
      `Your 7-Day Personalized Study Priorities: First, dedicate 45 minutes on Tuesday to review Graph Theory algorithms. Second, complete the upcoming Database Normalization problem set before Thursday at 5 PM. Third, schedule a 15-minute clarification session with your teaching assistant to solidify your exam score.`,
      '7-Day Academic Action Plan'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl h-[88vh] max-h-[720px] flex flex-col shadow-2xl shadow-purple-500/10 overflow-hidden text-slate-800 dark:text-slate-100">
        {/* Top Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/25">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white">
                  EduIntelli Voice Assistant
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                  SPEECH-AI
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Interactive voiceover narration, academic diagnostics, and voice Q&A
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={cn(
                'p-2 rounded-xl transition-colors text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white',
                showSettings && 'bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300'
              )}
              title="Voice Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={closeAssistant}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Collapsible Settings Drawer */}
        {showSettings && (
          <div className="px-6 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-purple-50/50 dark:bg-purple-950/20 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Synthesized Voice
              </label>
              <select
                value={selectedVoice?.name || ''}
                onChange={(e) => {
                  const v = voices.find((item) => item.name === e.target.value);
                  setSelectedVoice(v || null);
                }}
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 text-slate-800 dark:text-slate-200 text-xs"
              >
                {voices.map((v) => (
                  <option key={v.name} value={v.name}>
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Reading Speed: {speed}x
              </label>
              <div className="flex items-center gap-2">
                {[0.8, 1.0, 1.25, 1.5].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSpeed(s)}
                    className={cn(
                      'px-2.5 py-1 rounded-md font-bold transition-all text-xs',
                      speed === s
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-purple-300'
                    )}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Voice Visualizer Orb & Active Audio Status */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-b from-purple-50/30 to-transparent dark:from-purple-950/10 flex flex-col items-center text-center">
          {/* Pulsing Visualizer */}
          <div className="relative mb-3 flex items-center justify-center">
            <div
              className={cn(
                'w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300',
                isSpeaking
                  ? 'bg-gradient-to-tr from-purple-600 to-indigo-600 shadow-xl shadow-purple-500/40 ring-4 ring-purple-300 dark:ring-purple-900/50 scale-105'
                  : isListening
                  ? 'bg-rose-500 shadow-xl shadow-rose-500/40 ring-4 ring-rose-300 dark:ring-rose-900/50 scale-105 animate-pulse'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              )}
            >
              {isSpeaking ? (
                <div className="flex items-center gap-1 h-8">
                  <span className="w-1 bg-white rounded-full animate-[soundWave_0.7s_ease-in-out_infinite]" />
                  <span className="w-1 bg-white rounded-full animate-[soundWave_0.7s_ease-in-out_0.2s_infinite]" />
                  <span className="w-1 bg-white rounded-full animate-[soundWave_0.7s_ease-in-out_0.4s_infinite]" />
                  <span className="w-1 bg-white rounded-full animate-[soundWave_0.7s_ease-in-out_0.1s_infinite]" />
                  <span className="w-1 bg-white rounded-full animate-[soundWave_0.7s_ease-in-out_0.3s_infinite]" />
                </div>
              ) : isListening ? (
                <Mic className="w-8 h-8 text-white animate-bounce" />
              ) : (
                <Bot className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              )}
            </div>
          </div>

          {/* Active Status & Text */}
          <div className="max-w-lg">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                {isSpeaking ? `Speaking: ${activeTitle}` : isListening ? 'Listening for speech...' : 'Assistant Ready'}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 italic line-clamp-2 min-h-[32px]">
              {isSpeaking
                ? `"${currentSentence || activeText}"`
                : isListening
                ? 'Speak now — asking a question about attendance, assignments, or recommendations...'
                : 'Click any quick voice action below or tap the microphone to ask anything.'}
            </p>

            {/* Playback Controls if speaking */}
            {isSpeaking && (
              <div className="flex items-center justify-center gap-2 mt-2">
                <button
                  onClick={isPaused ? resume : pause}
                  className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 flex items-center gap-1"
                >
                  {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5" />}
                  <span>{isPaused ? 'Resume' : 'Pause'}</span>
                </button>
                <button
                  onClick={stop}
                  className="px-3 py-1 rounded-lg text-xs font-semibold bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 hover:bg-rose-100 flex items-center gap-1"
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>Stop</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 1-Click Academic Voice Presets Bar */}
        <div className="px-5 py-2.5 bg-slate-50 dark:bg-slate-950/40 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto custom-scrollbar">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0">
            Quick Actions:
          </span>
          <button
            onClick={triggerBriefing}
            className="px-3 py-1 rounded-full text-xs font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-purple-400 hover:text-purple-600 flex items-center gap-1.5 shrink-0 shadow-xs"
          >
            <GraduationCap className="w-3.5 h-3.5 text-brand-500" />
            <span>Academic Briefing</span>
          </button>
          <button
            onClick={triggerRiskDiagnostic}
            className="px-3 py-1 rounded-full text-xs font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-purple-400 hover:text-purple-600 flex items-center gap-1.5 shrink-0 shadow-xs"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            <span>Explain Risk Score</span>
          </button>
          <button
            onClick={triggerStudyPlan}
            className="px-3 py-1 rounded-full text-xs font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-purple-400 hover:text-purple-600 flex items-center gap-1.5 shrink-0 shadow-xs"
          >
            <CalendarCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>7-Day Study Plan</span>
          </button>
        </div>

        {/* Conversation Stream */}
        <div className="flex-1 p-5 overflow-y-auto space-y-3.5 custom-scrollbar">
          {conversation.map((msg, i) => (
            <div
              key={i}
              className={cn('flex items-start gap-2.5 max-w-[85%]', msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto')}
            >
              <div
                className={cn(
                  'w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs shadow-xs',
                  msg.role === 'user'
                    ? 'bg-brand-600 text-white'
                    : 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                )}
              >
                {msg.role === 'user' ? <UserIcon className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              <div
                className={cn(
                  'rounded-2xl p-3 text-xs leading-relaxed shadow-xs',
                  msg.role === 'user'
                    ? 'bg-brand-600 text-white rounded-tr-none'
                    : 'bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-200 dark:border-slate-700'
                )}
              >
                <div className="flex items-center justify-between gap-4 mb-1">
                  <span className="text-[10px] font-bold opacity-60">
                    {msg.role === 'user' ? 'You' : 'EduIntelli Voice Coach'}
                  </span>
                  <span className="text-[9px] opacity-40">{msg.timestamp}</span>
                </div>
                <p>{msg.text}</p>

                {msg.role === 'assistant' && (
                  <button
                    onClick={() => speak(msg.text, 'Voice Coach Response')}
                    className="mt-2 text-[10px] font-semibold text-purple-600 dark:text-purple-300 hover:underline flex items-center gap-1"
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>Listen again</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Voice Input & Text Box */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-950/60">
          <div className="flex items-center gap-2">
            {/* Big Microphone Toggle Button */}
            <button
              onClick={isListening ? stopListening : startListening}
              className={cn(
                'p-3 rounded-2xl transition-all shadow-md flex items-center justify-center shrink-0',
                isListening
                  ? 'bg-rose-600 text-white animate-pulse ring-4 ring-rose-300 dark:ring-rose-900/50'
                  : 'bg-gradient-to-tr from-purple-600 to-indigo-600 text-white hover:scale-105 shadow-purple-500/25'
              )}
              title={isListening ? 'Stop recording voice' : 'Speak to Voice Assistant'}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Input Bar */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isListening ? 'Listening to your microphone...' : 'Ask by voice or type your question here...'}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl pl-4 pr-10 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-inner"
              />
              <button
                onClick={handleSendText}
                disabled={!inputText.trim() || isSubmitting}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-xl text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40 disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
