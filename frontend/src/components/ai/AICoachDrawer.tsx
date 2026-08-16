import React, { useState } from 'react';
import { Sparkles, Send, X, Bot, User as UserIcon, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { api } from '../../services/api';

interface AICoachDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  studentName?: string;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

export const AICoachDrawer: React.FC<AICoachDrawerProps> = ({
  isOpen,
  onClose,
  studentName = 'Alex',
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: `Hello ${studentName}! I am your EduIntelli Academic Intelligence Coach. I continuously analyze your attendance, assignments, and exam results. How can I assist your study priorities today?`,
      timestamp: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (customPrompt?: string) => {
    const query = customPrompt || input.trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: 'Just now',
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await api.askAICoach(query);
      const aiReply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: res.response || 'Continue dedicating 30 minutes daily to core practice problems and maintain strong lecture attendance.',
        timestamp: 'Just now',
      };
      setMessages(prev => [...prev, aiReply]);
    } catch {
      const fallbackReply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: 'Prioritize Discrete Mathematics graph traversal problems for the next 7 days and ensure all pending assignments are submitted.',
        timestamp: 'Just now',
      };
      setMessages(prev => [...prev, fallbackReply]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    'How do I lower my academic risk score?',
    'What should I prioritize this week?',
    'How can I raise my Discrete Math grade?',
    'What is my attendance recovery roadmap?',
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md h-full bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">EduIntelli AI Coach</h3>
              <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Academic Diagnostic
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 custom-scrollbar text-xs">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`p-1.5 rounded-lg shrink-0 ${
                  msg.sender === 'user' ? 'bg-brand-600 text-white' : 'bg-purple-600/30 text-purple-300 border border-purple-500/30'
                }`}
              >
                {msg.sender === 'user' ? <UserIcon className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>
              <div
                className={`p-3 rounded-2xl max-w-[80%] leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-brand-600 text-white rounded-tr-none shadow-md'
                    : 'bg-slate-800/90 text-slate-200 border border-slate-700/60 rounded-tl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-slate-400 text-xs pl-2">
              <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
              <span>Analyzing academic models & recommendations...</span>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
          <div className="text-[10px] uppercase font-bold text-slate-400 mb-1.5">Suggested Prompts</div>
          <div className="flex flex-wrap gap-1.5">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-all text-left truncate max-w-[200px]"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 border-t border-slate-800 flex items-center gap-2 bg-slate-950/80"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your AI coach anything..."
            className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-slate-800/90 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-colors"
          />
          <Button type="submit" variant="ai" size="sm" isLoading={isLoading}>
            <Send className="w-3.5 h-3.5" />
          </Button>
        </form>
      </div>
    </div>
  );
};
