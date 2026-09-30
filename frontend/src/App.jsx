// frontend/src/App.jsx — NIVRA Platform Central Routing & App Shell
import React, { useState } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import SplashScreen from './components/SplashScreen';
import LoginScreen from './components/LoginScreen';
import LogoutConfirmModal from './components/LogoutConfirmModal';
import AIChatAssistant from './components/AIChatAssistant';
import StudentHub from './components/StudentHub';
import CitizenPortal from './components/CitizenPortal';
import EmergencyCenter from './components/EmergencyCenter';
import TrackerDashboard from './components/TrackerDashboard';
import { Home as HomeIcon, Grid, Bell, User } from 'lucide-react';

function AppContent() {
  const { authStatus } = useAuth();
  const [currentTab, setCurrentTab] = useState('home'); // 'home' | 'services' | 'ai' | 'alerts' | 'profile' | 'student' | 'documents'
  const [trackedItemQueue, setTrackedItemQueue] = useState(null);

  const handleTrackService = (item) => {
    setTrackedItemQueue(item);
    setCurrentTab('profile');
  };

  // ── 1. AUTH_LOADING Guard: Show Cinematic NIVRA Glass Splash Screen ──
  if (authStatus === 'AUTH_LOADING') {
    return <SplashScreen />;
  }

  // ── 2. UNAUTHENTICATED Guard: Show NIVRA Glass Login & Sign Up Screen ──
  if (authStatus === 'UNAUTHENTICATED') {
    return <LoginScreen />;
  }

  // ── 3. AUTHENTICATED: Render Production NIVRA Mobile App Shell ──
  return (
    <div className="min-h-screen flex flex-col">

      {/* Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
      />

      {/* Main Protected View Container */}
      <main className="flex-1 pb-28 max-w-7xl w-full mx-auto px-3 sm:px-4 pt-2">

        {/* HOME TAB (Screen 2 & 4 view) */}
        {currentTab === 'home' && (
          <AIChatAssistant
            mode="home"
            onNavigate={setCurrentTab}
            onSelectServiceForTracking={handleTrackService}
          />
        )}

        {/* FULL AI CHAT ENGINE (Screen 3 & 5 view) */}
        {currentTab === 'ai' && (
          <AIChatAssistant
            mode="chat"
            onNavigate={setCurrentTab}
            onSelectServiceForTracking={handleTrackService}
          />
        )}

        {/* SERVICES HUB (Screen 4 & 6 view) */}
        {currentTab === 'services' && (
          <CitizenPortal
            viewMode="all-services"
            onNavigate={setCurrentTab}
            onTrackService={handleTrackService}
          />
        )}

        {/* SCHOLARSHIPS / STUDENT HUB (Screen 7 & 8 view) */}
        {currentTab === 'student' && (
          <StudentHub onTrackService={handleTrackService} />
        )}

        {/* DOCUMENTS GUIDE (Screen 10 view) */}
        {currentTab === 'documents' && (
          <CitizenPortal
            viewMode="documents"
            onNavigate={setCurrentTab}
            onTrackService={handleTrackService}
          />
        )}

        {/* EMERGENCY & DISASTER HUB (Screen 9 view) */}
        {(currentTab === 'alerts' || currentTab === 'emergency') && (
          <EmergencyCenter />
        )}

        {/* PROFILE & TRACKER DASHBOARD (Screen 11 view) */}
        {currentTab === 'profile' && (
          <TrackerDashboard newTrackedItem={trackedItemQueue} />
        )}

      </main>

      {/* Floating Glass Bottom Navigation Bar */}
      <nav className="bottom-nav-glass">
        <button
          onClick={() => setCurrentTab('home')}
          className={`bottom-nav-item ${currentTab === 'home' ? 'active' : ''}`}
        >
          <HomeIcon className="w-5 h-5" />
          <span>Home</span>
        </button>

        <button
          onClick={() => setCurrentTab('services')}
          className={`bottom-nav-item ${currentTab === 'services' ? 'active' : ''}`}
        >
          <Grid className="w-5 h-5" />
          <span>Services</span>
        </button>

        {/* Center Glowing NIVRA AI Button */}
        <button
          onClick={() => setCurrentTab('ai')}
          className="bottom-nav-ai-btn"
          title="NIVRA AI Assistant"
        >
          N
        </button>

        <button
          onClick={() => setCurrentTab('alerts')}
          className={`bottom-nav-item ${currentTab === 'alerts' || currentTab === 'emergency' ? 'active' : ''}`}
        >
          <Bell className="w-5 h-5" />
          <span>Alerts</span>
        </button>

        <button
          onClick={() => setCurrentTab('profile')}
          className={`bottom-nav-item ${currentTab === 'profile' ? 'active' : ''}`}
        >
          <User className="w-5 h-5" />
          <span>Profile</span>
        </button>
      </nav>

      {/* Global Session Logout Confirmation Dialog */}
      <LogoutConfirmModal />

      {/* Footer */}
      <footer className="text-center py-4 text-xs text-white/40 pb-24">
        NIVRA — One Place. Every Service. • A Safer, Smarter and Stronger India With NIVRA
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </AuthProvider>
  );
}
