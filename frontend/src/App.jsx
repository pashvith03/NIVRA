// frontend/src/App.jsx — NIVRA Platform Central Routing & App Shell
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, NavLink, useLocation, Link } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import { ROUTES } from './routes';
import Header from './components/Header';
import SplashScreen from './components/SplashScreen';
import LoginScreen from './components/LoginScreen';
import LogoutConfirmModal from './components/LogoutConfirmModal';
import HomeScreen from './components/HomeScreen';
import AIChatAssistant from './components/AIChatAssistant';
import StudentHub from './components/StudentHub';
import CitizenPortal from './components/CitizenPortal';
import EmergencyCenter from './components/EmergencyCenter';
import TrackerDashboard from './components/TrackerDashboard';
import { Home as HomeIcon, Grid, Bell, User, Compass } from 'lucide-react';

// Tab bar slots (index 2 is the centre AI button)
const NAV_SLOTS = [
  { to: ROUTES.home,      label: 'Home',     icon: HomeIcon, match: p => p === '/' },
  { to: ROUTES.services,  label: 'Services', icon: Grid,     match: p => ['/services', '/scholarships', '/documents'].some(r => p.startsWith(r)) },
  { to: ROUTES.assistant, label: 'NIVRA AI', ai: true,       match: p => p.startsWith('/assistant') },
  { to: ROUTES.emergency, label: 'Alerts',   icon: Bell,     match: p => p.startsWith('/emergency') },
  { to: ROUTES.profile,   label: 'Profile',  icon: User,     match: p => p.startsWith('/profile') },
];

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0 }); }, [pathname]);
  return null;
}

function BottomNav() {
  const { pathname } = useLocation();
  const activeIndex = NAV_SLOTS.findIndex(s => s.match(pathname));
  const showIndicator = activeIndex !== -1 && !NAV_SLOTS[activeIndex].ai;

  return (
    <nav className="bottom-nav-glass" aria-label="Primary">
      <span
        className="nav-indicator"
        style={{ '--nav-index': Math.max(activeIndex, 0), opacity: showIndicator ? 1 : 0 }}
        aria-hidden="true"
      />
      {NAV_SLOTS.map((slot, i) => {
        const isActive = i === activeIndex;
        if (slot.ai) {
          return (
            <NavLink
              key={slot.to}
              to={slot.to}
              className={`bottom-nav-ai-btn ${isActive ? 'active' : ''}`}
              title="NIVRA AI Assistant"
              aria-label="NIVRA AI Assistant"
            >
              N
            </NavLink>
          );
        }
        const Icon = slot.icon;
        return (
          <NavLink
            key={slot.to}
            to={slot.to}
            className={`bottom-nav-item ${isActive ? 'active' : ''}`}
            aria-current={isActive ? 'page' : undefined}
          >
            <Icon className="w-5 h-5" />
            <span>{slot.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}

function NotFound() {
  return (
    <div className="max-w-md mx-auto glass-panel p-8 text-center fade-in mt-6">
      <div className="w-14 h-14 mx-auto rounded-2xl service-icon-box mb-4" style={{ background: 'rgba(255,181,71,0.15)', color: '#FFB547' }}>
        <Compass className="w-7 h-7" />
      </div>
      <h2 className="text-2xl font-black text-white">Page not found</h2>
      <p className="text-sm text-white/60 mt-1 mb-5">The page you were looking for doesn't exist or has moved.</p>
      <Link to={ROUTES.home} className="btn-primary justify-center">Back to Home</Link>
    </div>
  );
}

function AppContent() {
  const { authStatus, user } = useAuth();

  if (authStatus === 'AUTH_LOADING') return <SplashScreen />;
  if (authStatus === 'UNAUTHENTICATED') return <LoginScreen />;

  // keyed by user so a new sign-in never sees the previous user's conversation
  return (
    <ChatProvider key={user?.id}>
      <div className="min-h-screen flex flex-col">
        <ScrollToTop />
        <Header />

        <main className="flex-1 pb-32 max-w-7xl w-full mx-auto px-3 sm:px-4 pt-3">
          <Routes>
            <Route path={ROUTES.home} element={<HomeScreen />} />
            <Route path={ROUTES.assistant} element={<AIChatAssistant />} />
            <Route path={ROUTES.services} element={<CitizenPortal viewMode="all-services" />} />
            <Route path={ROUTES.scholarships} element={<StudentHub />} />
            <Route path={`${ROUTES.scholarships}/:id`} element={<StudentHub />} />
            <Route path={ROUTES.documents} element={<CitizenPortal viewMode="documents" />} />
            <Route path={ROUTES.emergency} element={<EmergencyCenter />} />
            <Route path={ROUTES.profile} element={<TrackerDashboard />} />

            {/* Legacy tab names → canonical URLs */}
            <Route path="/ai" element={<Navigate to={ROUTES.assistant} replace />} />
            <Route path="/student" element={<Navigate to={ROUTES.scholarships} replace />} />
            <Route path="/alerts" element={<Navigate to={ROUTES.emergency} replace />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <BottomNav />
        <LogoutConfirmModal />

        <footer className="text-center py-4 text-xs text-white/40 pb-28">
          NIVRA — One Place. Every Service. • A Safer, Smarter and Stronger India With NIVRA
        </footer>
      </div>
    </ChatProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LanguageProvider>
          <div className="liquid-bg" aria-hidden="true">
            <div className="blob blob-1" />
            <div className="blob blob-2" />
            <div className="blob blob-3" />
            <div className="blob blob-4" />
          </div>
          <AppContent />
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
