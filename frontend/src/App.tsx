import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { VoiceAssistantProvider } from './context/VoiceAssistantContext';
import { VoiceAssistantModal } from './components/voice/VoiceAssistantModal';
import { FloatingVoicePill } from './components/voice/FloatingVoicePill';
import { AppRouter } from './routes/AppRouter';

export function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <VoiceAssistantProvider>
              <AppRouter />
              <FloatingVoicePill />
              <VoiceAssistantModal />
            </VoiceAssistantProvider>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
