// frontend/src/components/TrackerDashboard.jsx — Profile, application pipeline, saved items, reports
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { trackers as trackersApi, saved as savedApi, reports as reportsApi } from '../services/userApi';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../routes';
import { FormError, EmailFlow } from './LoginScreen';
import {
  CheckCircle2, Circle, PlusCircle, X, MessageSquare, ChevronRight, LogOut, Trash2,
  BellRing, ClipboardList, Loader2, Bookmark, Megaphone, UserPlus, ShieldAlert
} from 'lucide-react';

// Remembers which navigation hand-offs were consumed (survives StrictMode double effects)
const consumedTrackKeys = new Set();

function serviceToTracker(item) {
  return {
    itemId: item.id,
    title: item.name || item.schemeName || item.serviceName || 'Government Scheme',
    type: item.amount ? 'Scholarship' : (item.maxLoanAmount ? 'Education Loan' : 'Government Scheme'),
    // the real number comes from the portal after applying; the user can note it later
    referenceNo: 'Not yet applied',
    nextReminder: 'Apply on the official portal, then mark each step here',
  };
}

const STATUS_STYLE = {
  'Received': 'badge-saffron',
  'Verified': 'badge-blue',
  'Team Dispatched': 'badge-purple',
  'Resolved': 'badge-green',
};

function Section({ title, action, children, sectionRef }) {
  return (
    <section ref={sectionRef} className="space-y-3 pt-2 scroll-mt-24">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-base font-bold text-white">{title}</h3>
        {action}
      </div>
      {children}
    </section>
  );
}

export default function TrackerDashboard() {
  const { user, setShowLogoutConfirm, deleteAccount } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [trackers, setTrackers] = useState(null);
  const [savedItems, setSavedItems] = useState([]);
  const [myReports, setMyReports] = useState([]);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const pipelineRef = useRef(null);
  const reportsRef = useRef(null);

  const { trackItem, trackKey } = location.state || {};

  useEffect(() => {
    trackersApi.list().then(setTrackers).catch(err => { setError(err.message); setTrackers([]); });
    savedApi.list().then(r => setSavedItems(r.data)).catch(() => {});
    reportsApi.mine().then(setMyReports).catch(() => {});
  }, []);

  // Consume a "track this service" hand-off from another screen (server de-duplicates per item)
  useEffect(() => {
    if (!trackItem || !trackKey || consumedTrackKeys.has(trackKey)) return;
    consumedTrackKeys.add(trackKey);
    navigate(location.pathname, { replace: true, state: null });

    trackersApi.add(serviceToTracker(trackItem))
      .then(({ tracker, duplicate }) => {
        setNotice(duplicate ? `You're already tracking “${tracker.title}”.` : `Now tracking “${tracker.title}”.`);
        if (!duplicate) setTrackers(prev => [tracker, ...(prev || []).filter(t => t.id !== tracker.id)]);
      })
      .catch(err => setError(err.message));
  }, [trackItem, trackKey, navigate, location.pathname]);

  useEffect(() => {
    if (!notice) return;
    const id = setTimeout(() => setNotice(''), 3500);
    return () => clearTimeout(id);
  }, [notice]);

  const toggleStep = async (tr, i) => {
    try {
      const updated = await trackersApi.setStep(tr.id, i, !tr.steps[i].done);
      setTrackers(prev => prev.map(t => (t.id === updated.id ? updated : t)));
    } catch (err) { setError(err.message); }
  };

  const removeTracker = async (id) => {
    const before = trackers;
    setTrackers(prev => prev.filter(t => t.id !== id));
    try { await trackersApi.remove(id); } catch (err) { setTrackers(before); setError(err.message); }
  };

  const unsave = async (id) => {
    setSavedItems(prev => prev.filter(s => s.item.id !== id));
    try { await savedApi.remove(id); } catch (err) { setError(err.message); }
  };

  const MENU = [
    { icon: ClipboardList, label: 'My Applications', sub: `${trackers?.length ?? 0} being tracked`, color: '#5FD4FF', action: () => pipelineRef.current?.scrollIntoView({ behavior: 'smooth' }) },
    { icon: Megaphone,     label: 'My Reports',      sub: `${myReports.length} disaster report${myReports.length === 1 ? '' : 's'}`, color: '#FFB547', action: () => reportsRef.current?.scrollIntoView({ behavior: 'smooth' }) },
    { icon: MessageSquare, label: 'My Queries',      sub: 'Continue your AI assistant chat', color: '#C29BFF', action: () => navigate(ROUTES.assistant) },
    ...(user?.isAdmin ? [{ icon: ShieldAlert, label: 'Report Queue', sub: 'Review & update incoming reports', color: '#FF4D63', action: () => navigate(ROUTES.admin) }] : []),
    { icon: LogOut,        label: 'Log Out',         sub: 'End your current session', color: '#FF4D63', action: () => setShowLogoutConfirm(true) },
  ];

  return (
    <div className="space-y-5 fade-in max-w-4xl mx-auto">

      {/* Profile header */}
      <section className="glass-panel p-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-16 h-16 rounded-[20px] p-[2px] flex-shrink-0" style={{ background: 'var(--accent-grad)' }}>
            <img
              src={user?.avatar || '/guest_pfp.png'}
              alt=""
              className="w-full h-full rounded-[18px] object-cover bg-[#17132a]"
              onError={e => { e.target.onerror = null; e.target.src = '/guest_pfp.png'; }}
            />
          </div>
          <div className="min-w-0">
            <h2 className="text-xl font-black text-white truncate">{user?.name}</h2>
            <p className="text-xs text-white/60 truncate">{user?.email || user?.phone || 'Guest session on this device'}</p>
            <span className="badge badge-saffron !text-[9px] mt-1.5 capitalize">{user?.provider} account</span>
          </div>
        </div>

        <button onClick={() => setShowAddModal(true)} className="btn-primary !py-2 !px-4 text-xs flex-shrink-0">
          <PlusCircle className="w-4 h-4" />
          <span className="hidden sm:inline">Track Application</span>
        </button>
      </section>

      {user?.isGuest && (
        <section className="glass-card p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="service-icon-box !w-10 !h-10 !rounded-xl flex-shrink-0" style={{ background: 'rgba(169,112,255,0.2)', color: '#C29BFF' }}>
              <UserPlus className="w-5 h-5" />
            </div>
            <p className="text-xs text-white/75">You're browsing as a guest. Create an account to keep your trackers and reports on any device. Everything you've saved comes with you.</p>
          </div>
          <button onClick={() => setShowSignup(true)} className="btn-secondary !py-1.5 !px-3 text-xs flex-shrink-0">Create account</button>
        </section>
      )}

      {notice && (
        <div className="liquid-pill rounded-full px-4 py-2.5 text-xs font-semibold text-white flex items-center gap-2 fade-in" role="status">
          <BellRing className="w-4 h-4 text-amber-300" /> {notice}
        </div>
      )}
      <FormError message={error} />

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
      <Section title="Application Pipeline" sectionRef={pipelineRef}>
        {trackers === null && <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-amber-300" /></div>}

        {trackers?.length === 0 && (
          <div className="glass-panel p-8 text-center">
            <p className="text-sm text-white/60">You aren't tracking any applications yet.</p>
            <div className="flex justify-center gap-2 mt-4">
              <Link to={ROUTES.scholarships} className="btn-secondary text-xs">Find scholarships</Link>
              <button onClick={() => setShowAddModal(true)} className="btn-secondary text-xs"><PlusCircle className="w-4 h-4" /> Add manually</button>
            </div>
          </div>
        )}

        <div className="space-y-3 stagger">
          {trackers?.map(tr => {
            const pct = Math.round((tr.steps.filter(s => s.done).length / tr.steps.length) * 100);
            return (
              <article key={tr.id} className="glass-card p-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="min-w-0">
                    <span className="badge badge-purple !text-[9px] mb-1">{tr.type}</span>
                    <h4 className="font-extrabold text-white text-sm">{tr.title}</h4>
                    <p className="text-[11px] font-mono text-white/50">
                      Ref: {tr.referenceNo} · Added {tr.appliedDate}{tr.deadline ? ` · Deadline ${tr.deadline}` : ''}
                    </p>
                  </div>
                  <button onClick={() => removeTracker(tr.id)} className="btn-icon !p-1.5 flex-shrink-0" title="Stop tracking" aria-label={`Stop tracking ${tr.title}`}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="h-1.5 rounded-full bg-white/10 overflow-hidden mb-3" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: 'var(--accent-grad)' }} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {tr.steps.map((st, i) => (
                    <button
                      key={i}
                      onClick={() => toggleStep(tr, i)}
                      className={`p-2.5 rounded-xl border text-left text-[10px] transition-colors ${st.done ? 'bg-emerald-400/15 border-emerald-300/30 text-emerald-200' : 'bg-white/5 border-white/10 text-white/45 hover:bg-white/10'}`}
                      aria-pressed={st.done}
                      title={st.done ? 'Mark as not done' : 'Mark as done'}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold uppercase tracking-wide">Step {i + 1}</span>
                        {st.done ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" /> : <Circle className="w-3.5 h-3.5 text-white/30" />}
                      </div>
                      <p className="font-bold text-white text-[11px] mt-0.5">{st.name}</p>
                      <p className="text-[10px] opacity-80">{st.date || 'Tap when done'}</p>
                    </button>
                  ))}
                </div>

                <p className="text-[11px] text-amber-300 font-semibold mt-3 flex items-center gap-1.5">
                  <BellRing className="w-3 h-3" /> {tr.currentStatus} · {tr.nextReminder}
                </p>
              </article>
            );
          })}
        </div>
      </Section>

      {/* Saved */}
      <Section title="Saved Services">
        {savedItems.length === 0 ? (
          <p className="text-xs text-white/50 px-1">Tap the bookmark on any scholarship or scheme to save it here.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {savedItems.map(({ item }) => (
              <div key={item.id} className="glass-card p-3.5 flex items-center justify-between gap-2">
                <Link to={item.id.startsWith('sch-') ? ROUTES.scholarship(item.id) : ROUTES.services} className="flex items-center gap-3 min-w-0">
                  <Bookmark className="w-4 h-4 text-amber-300 flex-shrink-0" />
                  <span className="text-sm font-bold text-white truncate">{item.name || item.schemeName}</span>
                </Link>
                <button onClick={() => unsave(item.id)} className="btn-icon !p-1.5" aria-label={`Remove ${item.name || item.schemeName} from saved`}>
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* Reports */}
      <Section title="My Reports" sectionRef={reportsRef} action={<Link to={ROUTES.emergency} className="text-xs text-amber-300 font-semibold">New report</Link>}>
        {myReports.length === 0 ? (
          <p className="text-xs text-white/50 px-1">Disaster reports you submit appear here with their latest status.</p>
        ) : (
          <div className="space-y-2.5">
            {myReports.map(r => (
              <article key={r.id} className="glass-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h4 className="font-bold text-white text-sm">{r.category} · <span className="text-white/60 font-semibold">{r.location}</span></h4>
                    <p className="text-xs text-white/60 mt-0.5 line-clamp-2">{r.description}</p>
                    <p className="text-[10px] text-white/40 mt-1">{new Date(r.reportedAt).toLocaleString()}</p>
                  </div>
                  <span className={`badge ${STATUS_STYLE[r.status] || 'badge-red'} !text-[9px] flex-shrink-0`}>{r.status}</span>
                </div>
                {r.statusHistory?.length > 1 && (
                  <ol className="mt-3 pt-3 border-t border-white/10 space-y-1">
                    {r.statusHistory.map((h, i) => (
                      <li key={i} className="text-[11px] text-white/60 flex gap-2">
                        <span className="text-white/40 font-mono">{new Date(h.at).toLocaleDateString()}</span>
                        <span className="text-white/80 font-semibold">{h.status}</span>
                        {h.note && <span className="text-white/50">— {h.note}</span>}
                      </li>
                    ))}
                  </ol>
                )}
              </article>
            ))}
          </div>
        )}
      </Section>

      {/* Danger zone */}
      <section className="pt-4">
        {confirmDelete ? (
          <div className="glass-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-xs text-white/70">Permanently delete your account, trackers, saved items and uploaded photos?</p>
            <div className="flex gap-2">
              <button onClick={() => setConfirmDelete(false)} className="btn-secondary !py-1.5 text-xs">Cancel</button>
              <button onClick={() => deleteAccount().catch(err => setError(err.message))} className="btn-emergency !animate-none !py-1.5 text-xs">Delete forever</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setConfirmDelete(true)} className="text-xs text-white/40 hover:text-red-300 px-1">Delete my account</button>
        )}
      </section>

      {/* Signing up from the guest session moves the guest's data to the new account */}
      {showSignup && <EmailFlow initialMode="signup" onClose={() => setShowSignup(false)} />}

      {showAddModal && (
        <AddTrackerModal
          onClose={() => setShowAddModal(false)}
          onAdded={(t) => { setTrackers(prev => [t, ...(prev || [])]); setShowAddModal(false); }}
        />
      )}
    </div>
  );
}

function AddTrackerModal({ onClose, onAdded }) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Scholarship');
  const [referenceNo, setReferenceNo] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setError('');
    try {
      const { tracker } = await trackersApi.add({ title, type, referenceNo });
      onAdded(tracker);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <div className="modal-backdrop z-[150]" onClick={e => { if (e.target === e.currentTarget) onClose(); }} role="dialog" aria-modal="true" aria-label="Track application">
      <div className="glass-panel glass-modal p-6 max-w-md w-full" style={{ borderRadius: 'var(--r-xl)' }}>
        <button onClick={onClose} className="btn-icon absolute top-4 right-4" aria-label="Close"><X className="w-4 h-4" /></button>
        <h3 className="text-lg font-extrabold text-white mb-4">Track Application</h3>
        <form onSubmit={submit} className="space-y-3">
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
          <FormError message={error} />
          <button type="submit" disabled={busy} className="btn-primary w-full justify-center !py-3 text-sm">
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save to Tracker'}
          </button>
        </form>
      </div>
    </div>
  );
}
