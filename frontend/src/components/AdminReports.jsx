// frontend/src/components/AdminReports.jsx — report triage queue for ADMIN_EMAILS accounts
import React, { useEffect, useState } from 'react';
import { reports } from '../services/userApi';
import { FormError } from './LoginScreen';
import { Loader2, MapPin, Phone, ShieldAlert } from 'lucide-react';

const SEVERITY_BADGE = { CRITICAL: 'badge-red', HIGH: 'badge-saffron', MEDIUM: 'badge-blue', LOW: 'badge-green' };

export default function AdminReports() {
  const [data, setData] = useState(null);
  const [statuses, setStatuses] = useState([]);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('Open');

  useEffect(() => {
    reports.adminList()
      .then(r => { setData(r.data); setStatuses(r.statuses); })
      .catch(err => { setError(err.message); setData([]); });
  }, []);

  const setStatus = async (id, status) => {
    const note = window.prompt(`Optional note for "${status}" (shown to the reporter):`) ?? undefined;
    try {
      const { report } = await reports.adminSetStatus(id, status, note || undefined);
      setData(prev => prev.map(r => (r.id === id ? report : r)));
    } catch (err) { setError(err.message); }
  };

  const isOpen = (r) => !['Resolved'].includes(r.status) && !r.status.startsWith('Closed');
  const visible = (data || []).filter(r => (filter === 'Open' ? isOpen(r) : true));

  return (
    <div className="space-y-5 fade-in max-w-5xl mx-auto">
      <section className="glass-panel p-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="service-icon-box" style={{ background: 'rgba(255,77,99,0.18)', color: '#FF4D63' }}><ShieldAlert className="w-6 h-6" /></div>
          <div>
            <h2 className="text-2xl font-black text-white">Report Queue</h2>
            <p className="text-xs text-white/60">Status changes are shown to the person who reported.</p>
          </div>
        </div>
        <div className="liquid-pill rounded-full p-1 flex gap-1">
          {['Open', 'All'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1 rounded-full text-xs font-bold ${filter === f ? 'bg-white/90 text-slate-900' : 'text-white/70'}`}>{f}</button>
          ))}
        </div>
      </section>

      <FormError message={error} />
      {data === null && <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-amber-300" /></div>}
      {data && visible.length === 0 && <div className="glass-panel p-8 text-center text-sm text-white/60">No reports in this view.</div>}

      <div className="space-y-3">
        {visible.map(r => (
          <article key={r.id} className="glass-card p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {r.image && <img src={r.image} alt="Report" className="w-full sm:w-36 h-36 object-cover rounded-xl" />}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className={`badge ${SEVERITY_BADGE[r.severity]} !text-[9px]`}>{r.severity}</span>
                  <span className="text-sm font-bold text-white">{r.category}</span>
                  <span className="text-[11px] text-white/40">{new Date(r.reportedAt).toLocaleString()}</span>
                </div>
                <p className="text-sm text-white/80">{r.description}</p>
                <p className="text-xs text-white/60 mt-2 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {r.location}
                  {r.lat != null && (
                    <a className="text-amber-300 ml-1" href={`https://www.google.com/maps?q=${r.lat},${r.lng}`} target="_blank" rel="noreferrer">map</a>
                  )}
                </p>
                {r.contactNumber && (
                  <a href={`tel:${r.contactNumber}`} className="text-xs text-white/60 mt-1 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> {r.contactNumber}</a>
                )}
              </div>
              <label className="sm:w-48 flex-shrink-0">
                <span className="eyebrow">Status</span>
                <select value={r.status} onChange={e => setStatus(r.id, e.target.value)} className="input-glass !py-2 text-xs mt-1">
                  {statuses.map(s => <option key={s}>{s}</option>)}
                </select>
              </label>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
