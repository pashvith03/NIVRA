// frontend/src/components/TrackerDashboard.jsx  — NIVRA Platform
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getTrackers, addTracker, deleteTracker } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../routes';
import {
  CheckCircle2, Clock, PlusCircle, X, MessageSquare, AlertCircle,
  ChevronRight, LogOut, Trash2, BellRing, ClipboardList, Loader2
} from 'lucide-react';

// Remembers which navigation hand-offs were consumed (survives StrictMode double effects)
const consumedTrackKeys = new Set();

function serviceToTracker(item) {
  return {
    title: item.name || item.schemeName || item.serviceName || 'Government Scheme',
    type: item.amount ? 'Scholarship' : (item.maxLoanAmount ? 'Education Loan' : 'Government Scheme'),
    referenceNo: 'REG/' + Math.floor(100000 + Math.random() * 900000),
    nextReminder: 'Review verification status in 5 days',
  };
}

export default function TrackerDashboard() {
  const { user, setShowGoogleModal, setShowLogoutConfirm } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [trackers, setTrackers] = useState(null);
  const [notice, setNotice] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Scholarship');
  const [referenceNo, setReferenceNo] = useState('');
  const pipelineRef = useRef(null);

  const { trackItem, trackKey } = location.state || {};

  const addedRef = useRef([]); // items added this session, kept if a stale list arrives later

  const mergeAdded = (list) => [
    ...addedRef.current.filter(a => !list.some(t => t.id === a.id)),
    ...list,
  ];

  // Load the pipeline once
  useEffect(() => {
    getTrackers().then(list => setTrackers(mergeAdded(list)));
  }, []);

  // Consume a "track this service" hand-off from another screen
  useEffect(() => {
    if (!trackItem || !trackKey || consumedTrackKeys.has(trackKey)) return;
    consumedTrackKeys.add(trackKey);

    (async () => {
      const draft = serviceToTracker(trackItem);
      const current = await getTrackers();
      if (current.some(t => t.title === draft.title)) {
        setNotice(`You're already tracking “${draft.title}”.`);
      } else {
        const res = await addTracker(draft);
        if (res.tracker) {
          addedRef.current = [res.tracker, ...addedRef.current];
          setTrackers(prev => mergeAdded((prev || []).filter(t => t.id !== res.tracker.id)));
          setNotice(`Now tracking “${res.tracker.title}”.`);
        }
      }
      // drop the hand-off from history so refresh/back doesn't re-add it
      navigate(location.pathname, { replace: true, state: null });
    })();
  }, [trackItem, trackKey, navigate, location.pathname]);

  useEffect(() => {
    if (!notice) return;
    const id = setTimeout(() => setNotice(''), 3500);
    return () => clearTimeout(id);
  }, [notice]);

  const handleManualAdd = async (e) => {
    e.preventDefault();
    if (!title.trim() || !referenceNo.trim()) return;

    const res = await addTracker({ title: title.trim(), type, referenceNo: referenceNo.trim(), nextReminder: 'Check status next week' });
    if (res.tracker) {
      addedRef.current = [res.tracker, ...addedRef.current];
      setTrackers(prev => mergeAdded((prev || []).filter(t => t.id !== res.tracker.id)));
    }

    setShowAddModal(false);
    setTitle('');
    setReferenceNo('');
  };

  const handleRemove = async (id) => {
    addedRef.current = addedRef.current.filter(t => t.id !== id);
    setTrackers(prev => prev.filter(t => t.id !== id));
    await deleteTracker(id);
  };

  const MENU = [
    { icon: ClipboardList, label: 'My Applications', sub: 'Jump to your application pipeline', color: '#5FD4FF', action: () => pipelineRef.current?.scrollIntoView({ behavior: 'smooth' }) },
    { icon: MessageSquare, label: 'My Queries',      sub: 'Continue your AI assistant chat',   color: '#C29BFF', action: () => navigate(ROUTES.assistant) },
    { icon: AlertCircle,   label: 'Emergency & Reports', sub: 'Disaster alerts & nearby help',  color: '#FFB547', action: () => navigate(ROUTES.emergency) },
    { icon: LogOut,        label: 'Log Out',         sub: 'End your current session',          color: '#FF4D63', action: () => setShowLogoutConfirm(true) },
  ];

  const doneCount = (tr) => tr.steps.filter(s => s.done).length;

  return (
    <div className="space-y-5 fade-in max-w-4xl mx-auto">

      {/* Profile Header */}
      <section className="glass-panel p-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <button
            onClick={() => setShowGoogleModal(true)}
            className="w-16 h-16 rounded-[20px] p-[2px] flex-shrink-0 hover:scale-105 transition-transform"
            style={{ background: 'var(--accent-grad)' }}
            title="Switch account"
            aria-label="Switch account"
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full rounded-[18px] object-cover"
                onError={e => {
                  e.target.onerror = null;
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=FF5FA2&color=fff`;
                }}
              />
            ) : (
              <span className="w-full h-full rounded-[18px] bg-[#17132a] flex items-center justify-center text-white font-bold text-xl">
                {user?.name ? user.name[0] : 'U'}
              </span>
            )}
          </button>

          <div className="min-w-0">
            <h2 className="text-xl font-black text-white truncate">{user?.name || 'Citizen User'}</h2>
            <p className="text-xs text-white/60 truncate">{user?.email || 'Account connected'}</p>
            <span className="badge badge-saffron !text-[9px] mt-1.5 capitalize">{user?.provider || 'guest'} account</span>
          </div>
        </div>

        <button onClick={() => setShowAddModal(true)} className="btn-primary !py-2 !px-4 text-xs flex-shrink-0">
          <PlusCircle className="w-4 h-4" />
          <span className="hidden sm:inline">Track Application</span>
        </button>
      </section>

      {notice && (
        <div className="liquid-pill rounded-full px-4 py-2.5 text-xs font-semibold text-white flex items-center gap-2 fade-in" role="status">
          <BellRing className="w-4 h-4 text-amber-300" /> {notice}
        </div>
      )}

      {/* Quick links */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {MENU.map(item => {
          const Icon = item.icon;
          return (
            <button key={item.label} onClick={item.action} className="glass-card p-3.5 flex items-center justify-between text-left">
              <div className="flex items-center gap-3">
                <div className="service-icon-box !w-10 !h-10 !rounded-xl" style={{ color: item.color, background: 'rgba(255,255,255,0.06)' }}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">{item.label}</h4>
                  <p className="text-[11px] text-white/50">{item.sub}</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-white/40" />
            </button>
          );
        })}
      </section>

      {/* Application pipeline */}
      <section ref={pipelineRef} className="space-y-3 pt-2 scroll-mt-24">
        <h3 className="text-base font-bold text-white px-1">Application Pipeline</h3>

        {trackers === null && (
          <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-amber-300" /></div>
        )}

        {trackers?.length === 0 && (
          <div className="glass-panel p-8 text-center">
            <p className="text-sm text-white/60">You aren't tracking any applications yet.</p>
            <button onClick={() => setShowAddModal(true)} className="btn-secondary mt-4 text-xs">
              <PlusCircle className="w-4 h-4" /> Add your first one
            </button>
          </div>
        )}

        <div className="space-y-3 stagger">
          {trackers?.map(tr => {
            const pct = Math.round((doneCount(tr) / tr.steps.length) * 100);
            return (
              <article key={tr.id} className="glass-card p-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="min-w-0">
                    <span className="badge badge-purple !text-[9px] mb-1">{tr.type}</span>
                    <h4 className="font-extrabold text-white text-sm">{tr.title}</h4>
                    <p className="text-[11px] font-mono text-white/50">Ref: {tr.referenceNo} · Applied {tr.appliedDate}</p>
                  </div>
                  <button onClick={() => handleRemove(tr.id)} className="btn-icon !p-1.5 flex-shrink-0" title="Stop tracking" aria-label="Stop tracking">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Progress */}
                <div className="h-1.5 rounded-full bg-white/10 overflow-hidden mb-3">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: 'var(--accent-grad)' }} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {tr.steps.map((st, i) => (
                    <div
                      key={i}
                      className={`p-2.5 rounded-xl border text-[10px] ${st.done ? 'bg-emerald-400/15 border-emerald-300/30 text-emerald-200' : 'bg-white/5 border-white/10 text-white/45'}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold uppercase tracking-wide">Step {i + 1}</span>
                        {st.done ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" /> : <Clock className="w-3.5 h-3.5 text-white/30" />}
                      </div>
                      <p className="font-bold text-white text-[11px] mt-0.5">{st.name}</p>
                      <p className="text-[10px] opacity-80">{st.date}</p>
                    </div>
                  ))}
                </div>

                <p className="text-[11px] text-amber-300 font-semibold mt-3 flex items-center gap-1.5">
                  <BellRing className="w-3 h-3" /> {tr.currentStatus} · {tr.nextReminder}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      {/* Manual add modal */}
      {showAddModal && (
        <div
          className="modal-backdrop z-[150]"
          onClick={e => { if (e.target === e.currentTarget) setShowAddModal(false); }}
          role="dialog"
          aria-modal="true"
          aria-label="Track application"
        >
          <div className="glass-panel glass-modal p-6 max-w-md w-full" style={{ borderRadius: 'var(--r-xl)' }}>
            <button onClick={() => setShowAddModal(false)} className="btn-icon absolute top-4 right-4" aria-label="Close">
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-lg font-extrabold text-white mb-4">Track Application</h3>
            <form onSubmit={handleManualAdd} className="space-y-3">
              <label className="block">
                <span className="block text-xs font-bold text-white/70 mb-1">Scheme / Service name</span>
                <input type="text" required placeholder="e.g. NSP Scholarship 2026" value={title} onChange={e => setTitle(e.target.value)} className="input-glass text-sm !py-2.5" />
              </label>
              <label className="block">
                <span className="block text-xs font-bold text-white/70 mb-1">Type</span>
                <select value={type} onChange={e => setType(e.target.value)} className="input-glass text-sm !py-2.5">
                  <option>Scholarship</option>
                  <option>Education Loan</option>
                  <option>Government Scheme</option>
                  <option>Certificate</option>
                </select>
              </label>
              <label className="block">
                <span className="block text-xs font-bold text-white/70 mb-1">Reference / registration number</span>
                <input type="text" required placeholder="e.g. NSP/2026/89412" value={referenceNo} onChange={e => setReferenceNo(e.target.value)} className="input-glass text-sm !py-2.5 font-mono" />
              </label>
              <button type="submit" className="btn-primary w-full justify-center !py-3 text-sm">Save to Tracker</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
