// frontend/src/context/AuthContext.jsx — NIVRA Centralized Auth State & Session Persistence
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

const STORAGE_KEY = 'nivra_session_v1';

export const AuthProvider = ({ children }) => {
  // authStatus: 'AUTH_LOADING' | 'AUTHENTICATED' | 'UNAUTHENTICATED'
  const [authStatus, setAuthStatus] = useState('AUTH_LOADING');
  const [user, setUser] = useState(null);
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // ── AUTO LOGIN: Restore persisted session on startup immediately ──
  useEffect(() => {
    try {
      const savedSession = localStorage.getItem(STORAGE_KEY);
      if (savedSession) {
        const parsedUser = JSON.parse(savedSession);
        if (parsedUser && parsedUser.isLoggedIn) {
          if (parsedUser.provider === 'guest') {
            parsedUser.avatar = '/guest_pfp.png';
          }
          setUser(parsedUser);
          setAuthStatus('AUTHENTICATED');
          return;
        }
      }
    } catch (err) {
      console.error("Failed to restore NIVRA session:", err);
      localStorage.removeItem(STORAGE_KEY);
    }

    // No valid session -> transition to UNAUTHENTICATED immediately (shows Login Screen)
    setAuthStatus('UNAUTHENTICATED');
  }, []);

  // ── 1. Google OAuth / Quick Login ──
  const loginWithGoogle = (name = 'Citizen User', email = 'user@nivra.in', avatarUrl = null) => {
    const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0D8ABC&color=fff&bold=true`;
    const sessionData = {
      isLoggedIn: true,
      id: 'usr_' + Date.now(),
      name,
      email,
      avatar: avatarUrl || defaultAvatar,
      provider: 'google',
      loginTime: new Date().toISOString(),
      locationState: 'Granted (Hyderabad, India)',
      language: 'en',
    };

    setUser(sessionData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionData));
    setAuthStatus('AUTHENTICATED');
    setShowGoogleModal(false);
  };

  // ── 2. Direct Mobile Login (No OTP required as requested) ──
  const loginWithMobile = (mobileNumber, name = 'Citizen User') => {
    const sessionData = {
      isLoggedIn: true,
      id: 'usr_mob_' + Date.now(),
      name: name || `User +91 ${mobileNumber.slice(-4)}`,
      email: `${mobileNumber}@nivra.in`,
      mobile: mobileNumber,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'Mobile User')}&background=FF9933&color=fff&bold=true`,
      provider: 'mobile',
      loginTime: new Date().toISOString(),
      locationState: 'Granted (India)',
      language: 'en',
    };

    setUser(sessionData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionData));
    setAuthStatus('AUTHENTICATED');
  };

  // ── 3. Direct Email Login ──
  const loginWithEmail = (email, name = 'Student User') => {
    const sessionData = {
      isLoggedIn: true,
      id: 'usr_eml_' + Date.now(),
      name: name || email.split('@')[0],
      email: email,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name || email)}&background=7B2FFF&color=fff&bold=true`,
      provider: 'email',
      loginTime: new Date().toISOString(),
      locationState: 'Granted (India)',
      language: 'en',
    };

    setUser(sessionData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionData));
    setAuthStatus('AUTHENTICATED');
  };

  // ── 4. Explore as Guest ──
  const loginAsGuest = () => {
    const sessionData = {
      isLoggedIn: true,
      id: 'usr_guest_' + Date.now(),
      name: 'Guest Explorer',
      email: 'guest@nivra.in',
      avatar: '/guest_pfp.png',
      provider: 'guest',
      loginTime: new Date().toISOString(),
      locationState: 'Granted (Hyderabad, Telangana)',
      language: 'en',
    };

    setUser(sessionData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionData));
    setAuthStatus('AUTHENTICATED');
  };

  // ── 5. LOGOUT with Confirmation ──
  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
    setAuthStatus('UNAUTHENTICATED');
    setShowLogoutConfirm(false);
  };

  return (
    <AuthContext.Provider
      value={{
        authStatus,
        user,
        setUser,
        showGoogleModal,
        setShowGoogleModal,
        showLogoutConfirm,
        setShowLogoutConfirm,
        loginWithGoogle,
        loginWithMobile,
        loginWithEmail,
        loginAsGuest,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
