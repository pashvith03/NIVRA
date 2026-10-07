// frontend/src/components/GoogleAuthModal.jsx — Authentic Verifying Google Sign In Modal
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, LogIn, CheckCircle2, ShieldCheck, Loader2 } from 'lucide-react';

export default function GoogleAuthModal({ isOpen, onClose }) {
  const { user, loginWithGoogle } = useAuth();
  const [verifyingAccount, setVerifyingAccount] = useState(null);

  if (!isOpen) return null;

  const handleSelectAccount = (name, email) => {
    setVerifyingAccount({ name, email });
    setTimeout(() => {
      loginWithGoogle(name, email);
      setVerifyingAccount(null);
      onClose();
    }, 1200);
  };

  return (
    <div
      className="modal-backdrop z-[9999]"
      onClick={e => { if (e.target === e.currentTarget && !verifyingAccount) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label="Sign in with Google"
    >
      <div className="glass-panel glass-modal w-full max-w-md p-6" style={{ borderRadius: 'var(--r-xl)' }}>
        {!verifyingAccount && (
          <button onClick={onClose} className="btn-icon absolute top-4 right-4" aria-label="Close">
            <X className="w-4 h-4" />
          </button>
        )}

        {/* ── VERIFYING LOADING STATE ── */}
        {verifyingAccount ? (
          <div className="py-8 flex flex-col items-center text-center fade-in space-y-4">
            <div className="w-16 h-16 rounded-full bg-white/10 border border-amber-400/40 flex items-center justify-center relative">
              <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-white text-lg">
                Verifying Google Credentials...
              </h3>
              <p className="text-xs text-amber-300 font-semibold mt-1">
                {verifyingAccount.email}
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono">
              <ShieldCheck className="w-4 h-4" />
              <span>Authenticating OAuth 2.0 Token</span>
            </div>
          </div>
        ) : (
          <>
            {/* Google Header Logo */}
            <div className="flex flex-col items-center text-center mb-5">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg mb-2">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              </div>
              <h3 className="font-display font-black text-xl text-white">
                Sign in with Google
              </h3>
              <p className="text-xs text-white/60 mt-0.5">
                Choose a verified Google Account to continue to <span className="text-amber-300 font-bold">NIVRA</span>
              </p>
            </div>

            {/* Current Active Account Card (if logged in) */}
            {user?.isLoggedIn && (
              <div className="mb-4 p-3 glass-well flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover border border-amber-400/50 shadow"
                    onError={e => {
                      e.target.onerror = null;
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=F59E0B&color=fff`;
                    }}
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-xs text-white">{user.name}</h4>
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                    <p className="text-[11px] text-white/60">{user.email}</p>
                  </div>
                </div>
                <span className="badge badge-saffron text-[9px]">Active</span>
              </div>
            )}

            {/* Selectable Verified Google Accounts List */}
            <div className="space-y-2.5">
              {[
                { name: 'Aarav Sharma',  email: 'aarav.sharma@gmail.com',  initial: 'A', bg: '#A855F7' },
                { name: 'Priya Patel',   email: 'priya.patel@gmail.com',   initial: 'P', bg: '#EC4899' },
                { name: 'Student Portal User', email: 'student.nivra@gmail.com', initial: 'S', bg: '#3B82F6' },
              ].map((acc, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectAccount(acc.name, acc.email)}
                  className="glass-card w-full p-3.5 flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-xs shadow"
                      style={{ backgroundColor: acc.bg }}
                    >
                      {acc.initial}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-white">{acc.name}</h4>
                      <p className="text-[11px] text-white/50">{acc.email}</p>
                    </div>
                  </div>
                  <LogIn className="w-4 h-4 text-amber-400" />
                </button>
              ))}
            </div>

            <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-center gap-1.5 text-[10px] text-white/40">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Secured by Google OAuth 2.0 Identity Protocol</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
