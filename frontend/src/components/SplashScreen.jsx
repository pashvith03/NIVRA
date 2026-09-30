// frontend/src/components/SplashScreen.jsx — Cinematic Glassmorphism Splash Screen
import React from 'react';

export default function SplashScreen() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-between p-8 bg-[#030712] overflow-hidden select-none">

      {/* ── Ambient Radial Aurora Lighting Background (Golden & Icy Aurora) ── */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none opacity-40 animate-pulse"
        style={{
          background: 'radial-gradient(circle, rgba(255, 184, 108, 0.4) 0%, rgba(0, 198, 255, 0.25) 45%, rgba(123, 47, 255, 0.15) 70%, transparent 90%)',
          filter: 'blur(70px)',
          animationDuration: '3s',
        }}
      />

      {/* Background Micro Reflections */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="flex-1" />

      {/* ── Hero Center Logo & Branding ── */}
      <div className="flex flex-col items-center text-center relative z-10 fade-in">

        {/* Official NIVRA Brand Logo */}
        <img
          src="/nivra_logo.png"
          alt="NIVRA Logo"
          className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl mb-8 object-cover shadow-2xl border border-white/40"
          style={{
            boxShadow: '0 20px 50px rgba(0, 198, 255, 0.4)',
          }}
        />

        {/* App Title */}
        <h1
          className="font-display font-black text-4xl sm:text-5xl text-white tracking-tight mb-2"
          style={{ textShadow: '0 4px 20px rgba(0, 198, 255, 0.3)' }}
        >
          NIVRA
        </h1>

        {/* Brand Language */}
        <p className="text-xs sm:text-sm font-extrabold tracking-widest text-cyan-300 uppercase mb-3">
          Navigate · Inform · Verify · Reach · Assist
        </p>

        {/* Tagline */}
        <p className="text-sm sm:text-base font-medium text-white/70 tracking-wide">
          One Place. Every Service.
        </p>
      </div>

      <div className="flex-1" />

      {/* ── Bottom Animated Loading Indicator ── */}
      <div className="w-full max-w-xs flex flex-col items-center gap-3 relative z-10 pb-6">

        {/* Glass Shimmer Progress Bar */}
        <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden relative border border-white/10">
          <div
            className="h-full rounded-full animate-pulse"
            style={{
              width: '65%',
              background: 'linear-gradient(90deg, #00C6FF 0%, #FF9933 50%, #7B2FFF 100%)',
              boxShadow: '0 0 12px rgba(0, 198, 255, 0.8)',
            }}
          />
        </div>

        {/* Status text */}
        <span className="text-[11px] font-semibold text-white/50 tracking-wider uppercase">
          Restoring Session...
        </span>
      </div>

    </div>
  );
}
