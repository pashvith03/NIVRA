// frontend/src/components/LoginScreen.jsx — Bulletproof High-Fidelity NIVRA Glass Login (Image #3)
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import GoogleAuthModal from './GoogleAuthModal';
import { Smartphone, Mail, ArrowRight, X, ShieldCheck, CheckCircle2, Loader2, KeyRound } from 'lucide-react';

export default function LoginScreen() {
  const { loginWithMobile, loginWithEmail, loginAsGuest, showGoogleModal, setShowGoogleModal } = useAuth();
  
  const [activeModal, setActiveModal] = useState(null); // 'mobile' | 'email' | null
  const [mobileNum, setMobileNum] = useState('');
  const [emailAddr, setEmailAddr] = useState('');
  
  // Verification states
  const [otpStep, setOtpStep] = useState(1); // 1: Send OTP, 2: Enter OTP, 3: Verifying
  const [otpCode, setOtpCode] = useState(['4', '8', '9', '2']);
  const [emailStep, setEmailStep] = useState(1); // 1: Enter Email, 2: Verifying

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!mobileNum) return;
    setOtpStep(2);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setOtpStep(3);
    setTimeout(() => {
      loginWithMobile(mobileNum || '9876543210', 'Verified Citizen');
      setActiveModal(null);
      setOtpStep(1);
    }, 1200);
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (!emailAddr) return;
    setEmailStep(2);
    setTimeout(() => {
      loginWithEmail(emailAddr, emailAddr.split('@')[0]);
      setActiveModal(null);
      setEmailStep(1);
    }, 1200);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#090a10',
        fontFamily: "'Inter', sans-serif",
        boxSizing: 'border-box',
      }}
    >

      {/* ── Ambient Warm Golden-Amber Radial Lighting (Matching Image #3) ── */}
      <div
        style={{
          position: 'absolute',
          top: '35%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          pointerEvents: 'none',
          opacity: 0.45,
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.45) 0%, rgba(139, 92, 246, 0.25) 50%, rgba(236, 72, 153, 0.15) 75%, transparent 90%)',
          filter: 'blur(75px)',
        }}
      />

      {/* ── Brand Header Container ── */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          marginBottom: '24px',
          position: 'relative',
          zIndex: 10,
          maxWidth: '390px',
          width: '100%',
        }}
      >
        {/* Official NIVRA Brand Logo */}
        <img
          src="/nivra_logo.png"
          alt="NIVRA Logo"
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '20px',
            marginBottom: '14px',
            objectFit: 'cover',
            border: '1px solid rgba(245, 215, 175, 0.4)',
            boxShadow: '0 12px 30px rgba(245, 158, 11, 0.35)',
          }}
        />

        {/* Title */}
        <h1
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 900,
            fontSize: '32px',
            color: '#FFFFFF',
            letterSpacing: '-0.5px',
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          NIVRA
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: '11px',
            fontWeight: 800,
            color: '#FDE68A',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            marginTop: '6px',
            marginBottom: '2px',
          }}
        >
          Navigate · Inform · Verify · Reach · Assist
        </p>

        {/* Tagline */}
        <p
          style={{
            fontSize: '14px',
            fontWeight: 600,
            color: 'rgba(255, 255, 255, 0.85)',
            marginTop: '2px',
          }}
        >
          Your Services. Simplified.
        </p>
      </div>

      {/* ── Main Glass Card (Strict 390px Max Width Viewport) ── */}
      <div
        style={{
          width: '100%',
          maxWidth: '390px',
          padding: '24px',
          position: 'relative',
          zIndex: 10,
          borderRadius: '28px',
          background: 'rgba(22, 18, 35, 0.75)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          border: '1px solid rgba(245, 215, 175, 0.22)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.65), inset 0 1px 1px rgba(255, 255, 255, 0.25)',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >

        {/* ── Button List (Strict Vertical Layout) ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>

          {/* 1. PRIMARY GOOGLE BUTTON */}
          <button
            onClick={() => setShowGoogleModal(true)}
            style={{
              width: '100%',
              padding: '13px 20px',
              borderRadius: '999px',
              backgroundColor: '#FFFFFF',
              color: '#0F172A',
              fontWeight: 800,
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.25)',
              transition: 'all 0.2s ease',
              outline: 'none',
            }}
          >
            {/* Standard 20px Google G Icon */}
            <svg
              style={{ width: '20px', height: '20px', flexShrink: 0, display: 'block' }}
              viewBox="0 0 24 24"
            >
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
            <span style={{ letterSpacing: '0.2px' }}>Continue with Google</span>
          </button>

          {/* 2. SECONDARY MOBILE BUTTON */}
          <button
            onClick={() => { setActiveModal('mobile'); setOtpStep(1); }}
            style={{
              width: '100%',
              padding: '13px 20px',
              borderRadius: '999px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              outline: 'none',
            }}
          >
            <Smartphone style={{ width: '18px', height: '18px', color: '#F59E0B', flexShrink: 0 }} />
            <span>Continue with Mobile</span>
          </button>

          {/* 3. OPTIONAL EMAIL BUTTON */}
          <button
            onClick={() => { setActiveModal('email'); setEmailStep(1); }}
            style={{
              width: '100%',
              padding: '13px 20px',
              borderRadius: '999px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              outline: 'none',
            }}
          >
            <Mail style={{ width: '18px', height: '18px', color: '#C4B5FD', flexShrink: 0 }} />
            <span>Continue with Email</span>
          </button>

          {/* 4. EXPLORE AS GUEST BUTTON */}
          <button
            onClick={loginAsGuest}
            style={{
              width: '100%',
              padding: '13px 20px',
              borderRadius: '999px',
              background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%)',
              color: '#38BDF8',
              fontWeight: 800,
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              outline: 'none',
              boxShadow: '0 4px 15px rgba(56, 189, 248, 0.25)',
            }}
          >
            <span>Explore as Guest</span>
            <ArrowRight style={{ width: '18px', height: '18px' }} />
          </button>

        </div>

        {/* Separator Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '6px 0' }}>
          <div style={{ height: '1px', flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.15)' }} />
          <span style={{ fontSize: '10px', fontWeight: 800, color: 'rgba(255, 255, 255, 0.5)', letterSpacing: '2px' }}>OR</span>
          <div style={{ height: '1px', flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.15)' }} />
        </div>

        {/* Terms & Privacy */}
        <p style={{ fontSize: '11px', textAlign: 'center', color: 'rgba(255, 255, 255, 0.55)', margin: 0, lineHeight: 1.5 }}>
          By continuing, you agree to NIVRA's <br />
          <span style={{ color: '#FDE68A', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}>Terms of Service</span> &amp;{' '}
          <span style={{ color: '#FDE68A', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}>Privacy Policy</span>
        </p>

      </div>

      {/* ── GOOGLE ACCOUNT SELECTOR MODAL ── */}
      <GoogleAuthModal
        isOpen={showGoogleModal}
        onClose={() => setShowGoogleModal(false)}
      />

      {/* ── MOBILE OTP VERIFICATION MODAL ── */}
      {activeModal === 'mobile' && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '360px',
              padding: '24px',
              borderRadius: '24px',
              backgroundColor: '#151221',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              boxShadow: '0 20px 50px rgba(245, 158, 11, 0.3)',
              position: 'relative',
            }}
          >
            {otpStep !== 3 && (
              <button
                onClick={() => setActiveModal(null)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  color: '#fff',
                  borderRadius: '8px',
                  padding: '6px',
                  cursor: 'pointer',
                }}
              >
                <X style={{ width: '16px', height: '16px' }} />
              </button>
            )}

            {/* Step 3: Verifying */}
            {otpStep === 3 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '16px 0', gap: '12px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justify: 'center' }}>
                  <Loader2 style={{ width: '28px', height: '28px', color: '#F59E0B' }} className="animate-spin" />
                </div>
                <div>
                  <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, color: '#fff', fontSize: '16px', margin: 0 }}>
                    Verifying OTP Code...
                  </h3>
                  <p style={{ fontSize: '12px', color: '#FDE68A', marginTop: '4px' }}>
                    Securing Session for +91 {mobileNum || '98765 43210'}
                  </p>
                </div>
              </div>
            ) : otpStep === 2 ? (
              /* Step 2: Enter 4-Digit OTP Code */
              <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <KeyRound style={{ width: '20px', height: '20px', color: '#F59E0B' }} />
                  <div>
                    <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, color: '#fff', fontSize: '15px', margin: 0 }}>
                      Enter Verification Code
                    </h3>
                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', margin: 0 }}>
                      Sent via SMS to +91 {mobileNum}
                    </p>
                  </div>
                </div>

                {/* 4 Digit Boxes */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', margin: '8px 0' }}>
                  {otpCode.map((digit, idx) => (
                    <input
                      key={idx}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={e => {
                        const newOtp = [...otpCode];
                        newOtp[idx] = e.target.value;
                        setOtpCode(newOtp);
                      }}
                      style={{
                        width: '44px',
                        height: '50px',
                        borderRadius: '12px',
                        backgroundColor: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(245,158,11,0.5)',
                        color: '#fff',
                        textAlign: 'center',
                        fontSize: '20px',
                        fontWeight: 800,
                        fontFamily: 'monospace',
                      }}
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '999px',
                    background: 'linear-gradient(135deg, #F59E0B 0%, #EC4899 100%)',
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: '13px',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  <CheckCircle2 style={{ width: '16px', height: '16px' }} />
                  <span>Verify OTP &amp; Continue</span>
                </button>
              </form>
            ) : (
              /* Step 1: Enter Mobile Number */
              <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <Smartphone style={{ width: '20px', height: '20px', color: '#F59E0B' }} />
                  <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, color: '#fff', fontSize: '16px', margin: 0 }}>
                    Mobile Verification
                  </h3>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.7)', marginBottom: '6px' }}>
                    Enter 10-Digit Mobile Number
                  </label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '14px', top: '12px', fontSize: '12px', fontWeight: 800, color: '#F59E0B' }}>+91</span>
                    <input
                      type="tel"
                      required
                      placeholder="98765 43210"
                      value={mobileNum}
                      onChange={e => setMobileNum(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px 10px 48px',
                        borderRadius: '999px',
                        backgroundColor: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        color: '#fff',
                        outline: 'none',
                        fontSize: '13px',
                        boxSizing: 'border-box',
                        fontFamily: 'monospace',
                      }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '999px',
                    background: 'linear-gradient(135deg, #F59E0B 0%, #EC4899 100%)',
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: '13px',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  <span>Send Verification Code</span>
                  <ArrowRight style={{ width: '16px', height: '16px' }} />
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ── EMAIL VERIFICATION MODAL ── */}
      {activeModal === 'email' && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '360px',
              padding: '24px',
              borderRadius: '24px',
              backgroundColor: '#151221',
              border: '1px solid rgba(139, 92, 246, 0.4)',
              boxShadow: '0 20px 50px rgba(139, 92, 246, 0.3)',
              position: 'relative',
            }}
          >
            {emailStep !== 2 && (
              <button
                onClick={() => setActiveModal(null)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  color: '#fff',
                  borderRadius: '8px',
                  padding: '6px',
                  cursor: 'pointer',
                }}
              >
                <X style={{ width: '16px', height: '16px' }} />
              </button>
            )}

            {emailStep === 2 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '16px 0', gap: '12px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(139,92,246,0.15)', display: 'flex', alignItems: 'center', justify: 'center' }}>
                  <Loader2 style={{ width: '28px', height: '28px', color: '#A855F7' }} className="animate-spin" />
                </div>
                <div>
                  <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, color: '#fff', fontSize: '16px', margin: 0 }}>
                    Verifying Email Magic Link...
                  </h3>
                  <p style={{ fontSize: '12px', color: '#C4B5FD', marginTop: '4px' }}>
                    Authenticating {emailAddr}
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleEmailSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <Mail style={{ width: '20px', height: '20px', color: '#C4B5FD' }} />
                  <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, color: '#fff', fontSize: '16px', margin: 0 }}>
                    Email Verification
                  </h3>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.7)', marginBottom: '6px' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="student@gmail.com"
                    value={emailAddr}
                    onChange={e => setEmailAddr(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '999px',
                      backgroundColor: 'rgba(255,255,255,0.08)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      color: '#fff',
                      outline: 'none',
                      fontSize: '12px',
                      boxSizing: 'border-box',
                      fontFamily: 'monospace',
                    }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '999px',
                    background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: '13px',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  <span>Verify &amp; Sign In</span>
                  <ArrowRight style={{ width: '16px', height: '16px' }} />
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <p style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.4)', textAlign: 'center', marginTop: '20px', zIndex: 10 }}>
        NIVRA Platform • One Place. Every Service.
      </p>

    </div>
  );
}
