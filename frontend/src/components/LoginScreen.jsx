// frontend/src/components/LoginScreen.jsx — NIVRA Liquid Glass Login
import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import GoogleAuthModal from './GoogleAuthModal';
import { Smartphone, Mail, ArrowRight, X, CheckCircle2, Loader2, KeyRound } from 'lucide-react';

const GoogleG = () => (
  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
  </svg>
);

function Modal({ children, onClose, locked }) {
  return (
    <div
      className="modal-backdrop z-[1000]"
      onClick={e => { if (!locked && e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
    >
      <div className="glass-panel glass-modal w-full max-w-sm p-6" style={{ borderRadius: 'var(--r-xl)' }}>
        {!locked && (
          <button onClick={onClose} className="btn-icon absolute top-4 right-4" aria-label="Close">
            <X className="w-4 h-4" />
          </button>
        )}
        {children}
      </div>
    </div>
  );
}

function Verifying({ title, subtitle }) {
  return (
    <div className="flex flex-col items-center text-center py-4 gap-3">
      <div className="service-icon-box !w-14 !h-14 !rounded-full" style={{ background: 'rgba(255,181,71,0.15)', color: '#FFB547' }}>
        <Loader2 className="w-7 h-7 animate-spin" />
      </div>
      <div>
        <h3 className="font-display font-extrabold text-white text-base">{title}</h3>
        <p className="text-xs text-amber-200 mt-1">{subtitle}</p>
      </div>
    </div>
  );
}

export default function LoginScreen() {
  const { loginWithMobile, loginWithEmail, loginAsGuest, showGoogleModal, setShowGoogleModal } = useAuth();

  const [activeModal, setActiveModal] = useState(null); // 'mobile' | 'email' | null
  const [mobileNum, setMobileNum] = useState('');
  const [emailAddr, setEmailAddr] = useState('');
  const [otpStep, setOtpStep] = useState(1); // 1: number, 2: code, 3: verifying
  const [otpCode, setOtpCode] = useState(['', '', '', '']);
  const [emailStep, setEmailStep] = useState(1); // 1: address, 2: verifying
  const otpRefs = useRef([]);

  const mobileValid = /^[6-9]\d{9}$/.test(mobileNum);

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!mobileValid) return;
    setOtpCode(['', '', '', '']);
    setOtpStep(2);
    setTimeout(() => otpRefs.current[0]?.focus(), 50);
  };

  const handleOtpChange = (idx, value) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...otpCode];
    next[idx] = digit;
    setOtpCode(next);
    if (digit && idx < 3) otpRefs.current[idx + 1]?.focus();
  };

  const handleOtpKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !otpCode[idx] && idx > 0) otpRefs.current[idx - 1]?.focus();
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otpCode.some(d => !d)) return;
    setOtpStep(3);
    setTimeout(() => {
      loginWithMobile(mobileNum, `User +91 ${mobileNum.slice(-4)}`);
    }, 1000);
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (!emailAddr) return;
    setEmailStep(2);
    setTimeout(() => {
      loginWithEmail(emailAddr, emailAddr.split('@')[0]);
    }, 1000);
  };

  const closeModal = () => { setActiveModal(null); setOtpStep(1); setEmailStep(1); };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative">

      {/* Brand */}
      <div className="flex flex-col items-center text-center mb-7 w-full max-w-[400px] fade-in">
        <img
          src="/nivra_logo.png"
          alt="NIVRA Logo"
          className="w-20 h-20 rounded-[24px] object-cover mb-4"
          style={{ border: '1px solid rgba(255,255,255,0.35)', boxShadow: '0 18px 40px -10px rgba(255,140,90,0.55)' }}
        />
        <h1 className="font-display font-black text-4xl text-white tracking-tight">NIVRA</h1>
        <p className="text-[11px] font-extrabold text-amber-200 tracking-[0.18em] uppercase mt-2">
          Navigate · Inform · Verify · Reach · Assist
        </p>
        <p className="text-sm font-medium text-white/75 mt-1.5">Your services. Simplified.</p>
      </div>

      {/* Card */}
      <div className="glass-panel w-full max-w-[400px] p-6 fade-in" style={{ borderRadius: 'var(--r-xl)', animationDelay: '0.08s' }}>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => setShowGoogleModal(true)}
            className="w-full py-3.5 px-5 rounded-full bg-white text-slate-900 font-bold text-sm flex items-center justify-center gap-3 transition-transform hover:scale-[1.02] active:scale-[0.98]"
            style={{ boxShadow: '0 10px 26px -8px rgba(0,0,0,0.5), inset 0 -2px 0 rgba(0,0,0,0.06)' }}
          >
            <GoogleG />
            Continue with Google
          </button>

          <button onClick={() => setActiveModal('mobile')} className="btn-secondary w-full justify-center !py-3.5 text-sm">
            <Smartphone className="w-[18px] h-[18px] text-amber-300" />
            Continue with Mobile
          </button>

          <button onClick={() => setActiveModal('email')} className="btn-secondary w-full justify-center !py-3.5 text-sm">
            <Mail className="w-[18px] h-[18px] text-purple-300" />
            Continue with Email
          </button>

          <div className="flex items-center gap-3 my-1">
            <div className="h-px flex-1 bg-white/15" />
            <span className="text-[10px] font-extrabold text-white/45 tracking-[0.2em]">OR</span>
            <div className="h-px flex-1 bg-white/15" />
          </div>

          <button onClick={loginAsGuest} className="btn-primary w-full justify-center !py-3.5 text-sm">
            Explore as Guest
            <ArrowRight className="w-[18px] h-[18px]" />
          </button>
        </div>

        <p className="text-[11px] text-center text-white/50 mt-5 leading-relaxed">
          By continuing, you agree to NIVRA's{' '}
          <span className="text-amber-200 font-semibold underline underline-offset-2">Terms of Service</span> &{' '}
          <span className="text-amber-200 font-semibold underline underline-offset-2">Privacy Policy</span>
        </p>
      </div>

      <p className="text-[11px] text-white/40 text-center mt-6">NIVRA Platform • One Place. Every Service.</p>

      <GoogleAuthModal isOpen={showGoogleModal} onClose={() => setShowGoogleModal(false)} />

      {/* Mobile OTP */}
      {activeModal === 'mobile' && (
        <Modal onClose={closeModal} locked={otpStep === 3}>
          {otpStep === 3 ? (
            <Verifying title="Verifying code…" subtitle={`Securing session for +91 ${mobileNum}`} />
          ) : otpStep === 2 ? (
            <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
              <div className="flex items-center gap-2.5">
                <KeyRound className="w-5 h-5 text-amber-300" />
                <div>
                  <h3 className="font-display font-extrabold text-white text-base">Enter verification code</h3>
                  <p className="text-[11px] text-white/60">Sent via SMS to +91 {mobileNum}</p>
                </div>
              </div>

              <div className="flex justify-center gap-2.5 my-1">
                {otpCode.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={el => (otpRefs.current[idx] = el)}
                    inputMode="numeric"
                    autoComplete={idx === 0 ? 'one-time-code' : 'off'}
                    maxLength={1}
                    value={digit}
                    onChange={e => handleOtpChange(idx, e.target.value)}
                    onKeyDown={e => handleOtpKeyDown(idx, e)}
                    aria-label={`Digit ${idx + 1}`}
                    className="input-glass !w-12 !h-14 !p-0 !rounded-2xl text-center text-xl font-black font-mono"
                  />
                ))}
              </div>
              <p className="text-[10px] text-center text-white/40 -mt-2">Demo mode: any 4 digits work</p>

              <button type="submit" disabled={otpCode.some(d => !d)} className="btn-primary w-full justify-center !py-3 text-sm">
                <CheckCircle2 className="w-4 h-4" /> Verify & Continue
              </button>
              <button type="button" onClick={() => setOtpStep(1)} className="text-xs text-white/60 hover:text-white">Change number</button>
            </form>
          ) : (
            <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
              <div className="flex items-center gap-2.5">
                <Smartphone className="w-5 h-5 text-amber-300" />
                <h3 className="font-display font-extrabold text-white text-base">Mobile verification</h3>
              </div>
              <label className="block">
                <span className="block text-[11px] font-bold text-white/70 mb-1.5">10-digit mobile number</span>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-extrabold text-amber-300 z-10">+91</span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    required
                    autoFocus
                    placeholder="98765 43210"
                    value={mobileNum}
                    onChange={e => setMobileNum(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="input-glass !pl-12 font-mono"
                  />
                </div>
                {mobileNum.length === 10 && !mobileValid && (
                  <span className="block text-[11px] text-red-300 mt-1.5">Indian mobile numbers start with 6–9.</span>
                )}
              </label>
              <button type="submit" disabled={!mobileValid} className="btn-primary w-full justify-center !py-3 text-sm">
                Send verification code <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </Modal>
      )}

      {/* Email */}
      {activeModal === 'email' && (
        <Modal onClose={closeModal} locked={emailStep === 2}>
          {emailStep === 2 ? (
            <Verifying title="Signing you in…" subtitle={emailAddr} />
          ) : (
            <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
              <div className="flex items-center gap-2.5">
                <Mail className="w-5 h-5 text-purple-300" />
                <h3 className="font-display font-extrabold text-white text-base">Email sign-in</h3>
              </div>
              <label className="block">
                <span className="block text-[11px] font-bold text-white/70 mb-1.5">Email address</span>
                <input
                  type="email"
                  autoComplete="email"
                  required
                  autoFocus
                  placeholder="student@gmail.com"
                  value={emailAddr}
                  onChange={e => setEmailAddr(e.target.value)}
                  className="input-glass"
                />
              </label>
              <button type="submit" className="btn-primary w-full justify-center !py-3 text-sm">
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </Modal>
      )}
    </div>
  );
}
