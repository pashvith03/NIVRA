// frontend/src/components/TrackerDashboard.jsx  — NIVRA Platform
import React, { useState, useEffect } from 'react';
import { getTrackers, addTracker } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  ListFilter, CheckCircle2, Clock, PlusCircle, Bell, User, Bookmark,
  ShieldCheck, X, FileText, Settings, HelpCircle, MessageSquare, AlertCircle, ChevronRight, LogIn
} from 'lucide-react';

export default function TrackerDashboard({ newTrackedItem }) {
  const { user, setShowGoogleModal, setShowLogoutConfirm } = useAuth();
  const [trackers, setTrackers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Scholarship');
  const [referenceNo, setReferenceNo] = useState('');

  useEffect(() => {
    loadTrackers();
  }, []);

  useEffect(() => {
    if (newTrackedItem) {
      handleAutoAddFromService(newTrackedItem);
    }
  }, [newTrackedItem]);

  const loadTrackers = async () => {
    const data = await getTrackers();
    setTrackers(data);
  };

  const handleAutoAddFromService = async (item) => {
    const serviceTitle = item.name || item.schemeName || item.serviceName || "Government Scheme";
    const serviceType = item.amount ? "Scholarship" : (item.maxLoanAmount ? "Education Loan" : "Government Scheme");
    const autoRef = "REG/" + Math.floor(100000 + Math.random() * 900000);

    const res = await addTracker({
      title: serviceTitle,
      type: serviceType,
      referenceNo: autoRef,
      nextReminder: "Review verification portal status in 5 days"
    });

    if (res.tracker) {
      setTrackers(prev => [res.tracker, ...prev]);
    }
  };

  const handleManualAdd = async (e) => {
    e.preventDefault();
    if (!title || !referenceNo) return;

    const res = await addTracker({
      title,
      type,
      referenceNo,
      nextReminder: "Check status next week"
    });

    if (res.tracker) {
      setTrackers(prev => [res.tracker, ...prev]);
    }

    setShowAddModal(false);
    setTitle('');
    setReferenceNo('');
  };

  return (
    <div className="space-y-5 fade-in max-w-4xl mx-auto">
      
      {/* Profile Header Screen 10 */}
      <div className="glass-panel p-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div
            onClick={() => setShowGoogleModal(true)}
            className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-400 via-blue-600 to-purple-600 p-0.5 shadow-xl flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
            title="Switch Google Account"
          >
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full rounded-[14px] object-cover"
                onError={e => {
                  e.target.onerror = null;
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=0D8ABC&color=fff`;
                }}
              />
            ) : (
              <div className="w-full h-full rounded-[14px] bg-[#070d24] flex items-center justify-center text-white font-bold text-xl">
                {user?.name ? user.name[0] : 'U'}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-xl font-black text-white">{user?.name || 'Citizen User'}</h2>
            <p className="text-xs text-white/60">{user?.email || 'Account Connected'}</p>
            <button
              onClick={() => setShowGoogleModal(true)}
              className="text-[11px] text-cyan-300 font-bold mt-1 hover:underline flex items-center gap-1"
            >
              <LogIn className="w-3 h-3 text-cyan-400" /> Switch / Manage Google Account
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-saffron py-2 px-4 text-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Track Application</span>
          </button>
        </div>
      </div>

      {/* Profile Menu Quick Links Screen 10 */}
      <div className="space-y-2">
        <h3 className="text-sm font-bold text-white/80 px-1">My Account</h3>

        {[
          { icon: FileText, label: 'My Applications', sub: 'Track your applied schemes & status', color: '#00C6FF' },
          { icon: Bookmark, label: 'Saved Services', sub: 'View your bookmarked items', color: '#A855F7' },
          { icon: Bell, label: 'Notifications', sub: 'Important updates & deadlines', color: '#FF334B' },
          { icon: MessageSquare, label: 'My Queries', sub: 'View AI assistant chat history', color: '#38BDF8' },
          { icon: AlertCircle, label: 'My Reports', sub: 'Disaster & emergency issue reports', color: '#F59E0B' },
          { icon: Settings, label: 'Settings', sub: 'App preferences & language', color: '#94A3B8' },
          { icon: HelpCircle, label: 'Help & Support', sub: 'Get platform assistance', color: '#10B981' },
          { icon: LogIn, label: 'Log Out', sub: 'End your current session', color: '#FF334B', action: () => setShowLogoutConfirm(true) },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              onClick={item.action ? item.action : undefined}
              className="glass-card p-3.5 flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center" style={{ color: item.color }}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">{item.label}</h4>
                  <p className="text-[10px] text-white/50">{item.sub}</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-white/40" />
            </div>
          );
        })}
      </div>

      {/* Tracked Applications Pipeline Status */}
      <div className="space-y-3 pt-2">
        <h3 className="text-sm font-bold text-white/80 px-1">Active Application Pipeline</h3>

        {trackers.map((tr) => (
          <div key={tr.id} className="glass-card p-4 border-l-4 border-l-purple-500">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="badge badge-purple text-[9px] mb-1">{tr.type}</span>
                <h4 className="font-extrabold text-white text-sm">{tr.title}</h4>
                <p className="text-[10px] font-mono text-white/50">Ref: {tr.referenceNo}</p>
              </div>
              <span className="text-[10px] text-amber-300 font-bold">{tr.nextReminder}</span>
            </div>

            {/* Steps Horizontal Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-white/10">
              {tr.steps.map((st, i) => (
                <div key={i} className={`p-2 rounded-xl border text-[10px] ${st.done ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300' : 'bg-white/5 border-white/10 text-white/40'}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold uppercase">Step {i + 1}</span>
                    {st.done ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Clock className="w-3 h-3 text-white/30" />}
                  </div>
                  <p className="font-bold text-white text-[11px] truncate mt-0.5">{st.name}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modal Manual Add Tracker */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 fade-in">
          <div className="glass-panel p-6 max-w-md w-full relative">
            <button onClick={() => setShowAddModal(false)} className="btn-icon absolute top-4 right-4">
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-lg font-extrabold text-white mb-3">Track Application</h3>
            <form onSubmit={handleManualAdd} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-white/70 mb-1">Scheme / Service Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NSP Scholarship 2026"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="input-glass text-xs py-2"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-white/70 mb-1">Reference Registration Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NSP/2026/89412"
                  value={referenceNo}
                  onChange={e => setReferenceNo(e.target.value)}
                  className="input-glass text-xs py-2"
                />
              </div>
              <button type="submit" className="btn-saffron w-full justify-center py-2.5 text-xs">
                Save to Tracker
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

