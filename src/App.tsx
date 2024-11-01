import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import Profile from './pages/Profile';
import Program from './pages/Program';
import Participants from './pages/Participants';
import Training from './pages/Training';
import NotFound from './pages/NotFound';
import WebApp from '@twa-dev/sdk';
import { useUserPresence } from './hooks/useUserPresence';
import { UserProvider } from './contexts/UserContext';

function App() {
  useUserPresence();

  React.useEffect(() => {
    WebApp.ready();
    WebApp.expand();
  }, []);

  return (
    <UserProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-black/40">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="video-background"
            src="https://dl.dropboxusercontent.com/scl/fi/komfpmygc6tdhd52q9i3w/_2_1_1_1-1.mp4?rlkey=vyq4ujf4f228c709qo6ug2v93&st=54yhncqa&dl=0"
          />
          <Routes>
            <Route path="/" element={<Profile />} />
            <Route path="/program" element={<Program />} />
            <Route path="/participants" element={<Participants />} />
            <Route path="/training" element={<Training />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
          <Navigation />
        </div>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;