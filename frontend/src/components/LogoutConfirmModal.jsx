// frontend/src/components/LogoutConfirmModal.jsx — Glassmorphism Logout Confirmation Dialog
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, ShieldAlert, X } from 'lucide-react';

export default function LogoutConfirmModal() {
  const { showLogoutConfirm, setShowLogoutConfirm, logout } = useAuth();

  if (!showLogoutConfirm) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 fade-in"
      style={{ background: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(16px)' }}
      onClick={e => { if (e.target === e.currentTarget) setShowLogoutConfirm(false); }}
    >
      <div
        className="glass-panel w-full max-w-sm p-6 relative rounded-3xl text-center"
        style={{
          border: '1px solid rgba(255, 51, 75, 0.4)',
          boxShadow: '0 20px 50px rgba(255, 51, 75, 0.25)',
        }}
      >
        <button
          onClick={() => setShowLogoutConfirm(false)}
          className="btn-icon absolute top-4 right-4 text-white/60 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Warning Icon Box */}
        <div
          className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center"
          style={{ background: 'rgba(255, 51, 75, 0.15)', border: '1px solid rgba(255, 51, 75, 0.4)' }}
        >
          <LogOut className="w-7 h-7 text-red-500" />
        </div>

        <h3 className="font-display font-extrabold text-white text-lg mb-1">
          Log Out of NIVRA?
        </h3>
        <p className="text-xs text-white/60 mb-6 px-2 leading-relaxed">
          Are you sure you want to end your current session? You will need to sign in again to access saved schemes and AI services.
        </p>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setShowLogoutConfirm(false)}
            className="py-2.5 px-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/15 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={logout}
            className="py-2.5 px-4 rounded-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-lg transition-all"
          >
            Yes, Log Out
          </button>
        </div>

      </div>
    </div>
  );
}
