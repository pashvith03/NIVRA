// frontend/src/components/Header.jsx  — NIVRA Platform
import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import GoogleAuthModal from './GoogleAuthModal';
import {
  ShieldAlert, Globe, PhoneCall, X, User, LogIn
} from 'lucide-react';

export default function Header({ currentTab, setCurrentTab }) {
  const { lang, setLang } = useLanguage();
  const { user, showGoogleModal, setShowGoogleModal } = useAuth();
  const [showSOSModal, setShowSOSModal] = useState(false);

  return (
    <>
      <header
        className="glass-panel sticky top-0 z-50 mx-2 sm:mx-4 mt-2 mb-2 px-4 py-3"
        style={{ borderRadius: 'var(--r-lg)' }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">

          {/* ── Logo & Brand ── */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setCurrentTab('home')}
          >
            {/* 3D Glowing N Logo */}
            <div className="n-logo-box">
              N
            </div>

            {/* App Name & Tagline */}
            <div>
              <h1 className="font-display font-black text-xl tracking-tight text-white leading-none">
                NIVRA
              </h1>
              <div
                className="text-[9px] font-black uppercase tracking-widest mt-0.5"
                style={{
                  background: 'linear-gradient(90deg, #FF9933 0%, #FFFFFF 50%, #138808 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '1.5px',
                }}
              >
                India Edition
              </div>
              <p className="text-[10px] font-medium hidden md:block text-white/50 mt-0.5">
                Navigate · Inform · Verify · Reach · Assist
              </p>
            </div>
          </div>

          {/* ── Right Quick Actions ── */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Google User Profile Button */}
            <button
              onClick={() => setShowGoogleModal(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all hover:border-cyan-400"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--glass-border)' }}
              title="Google Account"
            >
              {user.isLoggedIn ? (
                <>
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-6 h-6 rounded-full object-cover border border-cyan-400"
                    onError={e => {
                      e.target.onerror = null;
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0D8ABC&color=fff`;
                    }}
                  />
                  <span className="hidden md:inline text-white font-bold">{user.name.split(' ')[0]}</span>
                </>
              ) : (
                <>
                  <div className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <span className="hidden md:inline text-cyan-300 font-bold">Google Sign-In</span>
                </>
              )}
            </button>

            {/* SOS Emergency Helpline */}
            <button
              className="btn-emergency text-xs"
              onClick={() => setShowSOSModal(true)}
              title="Emergency Helplines"
            >
              <ShieldAlert className="w-4 h-4" />
              <span className="hidden sm:inline">SOS 112</span>
            </button>

            {/* Language Selector */}
            <div
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs cursor-pointer"
              style={{
                background: 'var(--bg-input)',
                border: '1px solid var(--glass-border)',
              }}
            >
              <Globe className="w-3.5 h-3.5" style={{ color: 'var(--aurora-cyan)' }} />
              <select
                value={lang}
                onChange={e => setLang(e.target.value)}
                className="bg-transparent text-xs outline-none cursor-pointer text-white"
              >
                <option value="en"  style={{ background: '#070d24' }}>English</option>
                <option value="hi"  style={{ background: '#070d24' }}>हिंदी</option>
                <option value="te"  style={{ background: '#070d24' }}>తెలుగు</option>
                <option value="ta"  style={{ background: '#070d24' }}>தமிழ்</option>
                <option value="mr"  style={{ background: '#070d24' }}>मराठी</option>
                <option value="bn"  style={{ background: '#070d24' }}>বাংলা</option>
              </select>
            </div>

          </div>
        </div>
      </header>

      {/* ── Google Auth Modal ── */}
      <GoogleAuthModal
        isOpen={showGoogleModal}
        onClose={() => setShowGoogleModal(false)}
      />

      {/* ── SOS Helpline Modal ── */}
      {showSOSModal && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 fade-in"
          style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}
          onClick={e => { if (e.target === e.currentTarget) setShowSOSModal(false); }}
        >
          <div
            className="glass-panel w-full max-w-md p-6 relative"
            style={{ border: '1px solid rgba(255,51,75,0.5)', borderRadius: 'var(--r-xl)' }}
          >
            <button
              onClick={() => setShowSOSModal(false)}
              className="btn-icon absolute top-4 right-4"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-5">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ background: 'rgba(255,51,75,0.2)', border: '1px solid rgba(255,51,75,0.5)' }}
              >
                <ShieldAlert className="w-6 h-6" style={{ color: '#FF334B' }} />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-white">
                  National Emergency Helplines
                </h3>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  Tap any card below to place instant call
                </p>
              </div>
            </div>

            {/* Numbers Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { number: '112', label: 'National Emergency',    color: '#FF334B', bg: 'rgba(255,51,75,0.12)',   border: 'rgba(255,51,75,0.4)' },
                { number: '108', label: 'Medical Ambulance',     color: '#10B981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.4)' },
                { number: '101', label: 'Fire & Rescue',         color: '#F59E0B', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.4)' },
                { number: '1070',label: 'Disaster NDMA',         color: '#00C6FF', bg: 'rgba(0,198,255,0.12)', border: 'rgba(0,198,255,0.4)' },
              ].map(({ number, label, color, bg, border }) => (
                <a
                  key={number}
                  href={`tel:${number}`}
                  className="flex items-center justify-between p-4 rounded-xl transition-all duration-200"
                  style={{ background: bg, border: `1px solid ${border}` }}
                >
                  <div>
                    <p className="text-[10px] font-bold uppercase mb-0.5" style={{ color }}>{label}</p>
                    <p className="text-2xl font-black text-white" style={{ fontFamily: 'Space Grotesk' }}>{number}</p>
                  </div>
                  <PhoneCall className="w-5 h-5" style={{ color }} />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}


