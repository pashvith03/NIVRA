// frontend/src/components/SplashScreen.jsx — Liquid Glass Splash Screen
import React from 'react';

export default function SplashScreen() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center p-8 select-none">
      <div className="glass-panel flex flex-col items-center text-center px-10 py-12 fade-in" style={{ borderRadius: 'var(--r-xl)' }}>
        <img
          src="/nivra_logo.png"
          alt="NIVRA Logo"
          className="w-24 h-24 rounded-[28px] mb-6 object-cover"
          style={{ border: '1px solid rgba(255,255,255,0.35)', boxShadow: '0 20px 50px -12px rgba(255,140,90,0.6)' }}
        />
        <h1 className="font-display font-black text-4xl text-white tracking-tight mb-2">NIVRA</h1>
        <p className="text-[11px] font-extrabold tracking-[0.18em] text-amber-200 uppercase mb-2">
          Navigate · Inform · Verify · Reach · Assist
        </p>
        <p className="text-sm font-medium text-white/70">One Place. Every Service.</p>

        <div className="w-48 h-1.5 rounded-full bg-white/10 overflow-hidden mt-8">
          <div className="h-full w-2/3 rounded-full animate-pulse" style={{ background: 'var(--accent-grad)' }} />
        </div>
        <span className="text-[10px] font-semibold text-white/45 tracking-wider uppercase mt-3">Restoring session…</span>
      </div>
    </div>
  );
}
