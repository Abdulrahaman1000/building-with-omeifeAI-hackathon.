import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import LandingPage from './components/Pages/LandingPage';
import DashboardPage from './components/Pages/Dashboard/DashboardPage';
import GenerateAPIKey from './components/Pages/GenerateAPI/GenarateAPI';
import SpeechTranslation from './components/Pages/Translate/SRTranslate';
import TranslationComponent from './components/Pages/Translate/TextTranslation';
import KnowledgeAssistanceComponent from './components/Pages/KnowledgeAssistance/KnowledgeAssistance';
import AudioTranscription from './components/Pages/AudioTranscription/AudioTranscription';
import SpeechSynthesis from './components/Pages/SpeechSynthesis/SpeechSynthesis';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route 
            element={<ProtectedRoute><Layout /></ProtectedRoute>}
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/generateapi" element={<GenerateAPIKey />} />
            <Route path="/speechtranslation" element={<SpeechTranslation />} />
            <Route path="/texttranslation" element={<TranslationComponent />} />
            <Route path="/knowledge" element={<KnowledgeAssistanceComponent />} />
            <Route path="/audio" element={<AudioTranscription />} />
            <Route path="/synthesis" element={<SpeechSynthesis />} />
            {/* You can add more protected routes here */}
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;