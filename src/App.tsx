import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ExperiencePage } from './pages/ExperiencePage';
import { TechnologyPage } from './pages/TechnologyPage';
import { DemoPage } from './pages/DemoPage';
import { EvidencePage } from './pages/EvidencePage';
import { BookingPage } from './pages/BookingPage';
import { AboutPage } from './pages/AboutPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { ProfilePage } from './pages/ProfilePage';
import { MyBookingsPage } from './pages/MyBookingsPage';
import { useAuth } from './hooks/useAuth';
import { VoiceEngineInfo } from './types';

export default function App() {
  const { user, login, signup, logout } = useAuth();
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      return path && path !== '/' ? path : '/';
    }
    return '/';
  });

  const [engineInfo, setEngineInfo] = useState<VoiceEngineInfo>({
    provider: 'Rime',
    model: 'mistv2',
    voice: 'astra',
    samplingRate: 24000,
    isVerifiedRime: false,
    statusNote: 'Checking voice engine...',
  });

  useEffect(() => {
    fetch('/api/voice/engine-status')
      .then((res) => res.json())
      .then((data) => {
        setEngineInfo({
          provider: data.provider || 'LOCAL FALLBACK SPEECH',
          model: data.model || 'mistv2',
          voice: data.voice || 'astra',
          samplingRate: data.samplingRate || 24000,
          isVerifiedRime: Boolean(data.isVerifiedRime),
          statusNote: data.statusNote,
        });
      })
      .catch((e) => console.warn('Could not load voice engine status:', e));
  }, []);

  // Listen to popstate for browser back/forward
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      setCurrentRoute(path && path !== '' ? path : '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = (route: string) => {
    setCurrentRoute(route);
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', route);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderCurrentPage = () => {
    switch (currentRoute) {
      case '/experience':
        return <ExperiencePage onNavigate={handleNavigate} />;
      case '/technology':
        return <TechnologyPage />;
      case '/demo':
        return <DemoPage engineInfo={engineInfo} />;
      case '/evidence':
        return <EvidencePage />;
      case '/booking':
        return <BookingPage onNavigate={handleNavigate} />;
      case '/about':
        return <AboutPage />;
      case '/login':
        return <LoginPage onLogin={login} onNavigate={handleNavigate} />;
      case '/signup':
        return <SignupPage onSignup={signup} onNavigate={handleNavigate} />;
      case '/profile':
        return <ProfilePage user={user} onNavigate={handleNavigate} />;
      case '/my-bookings':
        return <MyBookingsPage onNavigate={handleNavigate} />;
      case '/':
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#070709] text-zinc-100 selection:bg-cyan-500 selection:text-black">
      {/* Global Navigation */}
      <Navigation
        currentRoute={currentRoute}
        onNavigate={handleNavigate}
        user={user}
        onLogout={logout}
      />

      {/* Main Routed Page Content with Transitions */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentRoute}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            {renderCurrentPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Global Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
