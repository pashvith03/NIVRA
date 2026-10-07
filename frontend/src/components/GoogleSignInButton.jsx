// frontend/src/components/GoogleSignInButton.jsx — official Google Identity Services button
import React, { useEffect, useRef, useState } from 'react';

const GIS_SRC = 'https://accounts.google.com/gsi/client';
let gisPromise = null;

function loadGis() {
  if (window.google?.accounts?.id) return Promise.resolve();
  if (!gisPromise) {
    gisPromise = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = GIS_SRC;
      s.async = true;
      s.onload = resolve;
      s.onerror = () => { gisPromise = null; reject(new Error('Could not load Google sign-in.')); };
      document.head.appendChild(s);
    });
  }
  return gisPromise;
}

// Google renders its own button inside our container; we receive a signed ID token
export default function GoogleSignInButton({ clientId, onCredential, onError }) {
  const ref = useRef(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadGis().then(() => {
      if (cancelled || !ref.current) return;
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (resp) => onCredential(resp.credential),
        ux_mode: 'popup',
      });
      window.google.accounts.id.renderButton(ref.current, {
        theme: 'outline', size: 'large', shape: 'pill', text: 'continue_with',
        width: Math.min(ref.current.offsetWidth || 340, 400),
      });
    }).catch(err => { setFailed(true); onError?.(err.message); });
    return () => { cancelled = true; };
  }, [clientId, onCredential, onError]);

  if (failed) return null;
  return <div ref={ref} className="w-full flex justify-center min-h-[44px]" />;
}
