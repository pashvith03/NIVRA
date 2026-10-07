// frontend/src/context/AuthContext.jsx — session state backed by the API's httpOnly cookie
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { auth } from '../services/userApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // authStatus: 'AUTH_LOADING' | 'AUTHENTICATED' | 'UNAUTHENTICATED'
  const [authStatus, setAuthStatus] = useState('AUTH_LOADING');
  const [user, setUser] = useState(null);
  const [authConfig, setAuthConfig] = useState({ googleClientId: null, mobileEnabled: false, mobileDevMode: false });
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [bootError, setBootError] = useState('');

  const applyUser = useCallback((u) => {
    setUser(u);
    setAuthStatus(u ? 'AUTHENTICATED' : 'UNAUTHENTICATED');
  }, []);

  const boot = useCallback(async () => {
    setBootError('');
    try {
      const [me, cfg] = await Promise.all([auth.me(), auth.config()]);
      setAuthConfig(cfg);
      applyUser(me.user);
    } catch (err) {
      setBootError(err.message);
      applyUser(null);
    }
  }, [applyUser]);

  useEffect(() => { boot(); }, [boot]);

  // Each login helper resolves to the user or throws an ApiError with a readable message
  const run = useCallback(async (promise) => {
    const { user: u } = await promise;
    applyUser(u);
    return u;
  }, [applyUser]);

  const value = {
    authStatus,
    user,
    authConfig,
    bootError,
    retryBoot: boot,
    showLogoutConfirm,
    setShowLogoutConfirm,
    register: (name, email, password) => run(auth.register(name, email, password)),
    loginWithEmail: (email, password) => run(auth.login(email, password)),
    loginWithGoogle: (credential) => run(auth.google(credential)),
    requestOtp: (phone) => auth.requestOtp(phone),
    verifyOtp: (phone, code) => run(auth.verifyOtp(phone, code)),
    loginAsGuest: () => run(auth.guest()),
    updateProfile: (patch) => run(auth.update(patch)),
    logout: async () => {
      setShowLogoutConfirm(false);
      try { await auth.logout(); } finally { applyUser(null); }
    },
    deleteAccount: async () => {
      await auth.deleteAccount();
      applyUser(null);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
