// frontend/src/components/EmergencyCenter.jsx — NIVRA Emergency & Disaster Center
import React, { useState, useEffect } from 'react';
import { getEmergencyData } from '../services/api';
import { reports } from '../services/userApi';
import { FormError } from './LoginScreen';
import {
  ShieldAlert, PhoneCall, MapPin, Hospital, Flame, Ambulance, Building, Pill,
  CloudRain, Navigation, Layers, Sun, AlertTriangle, Crosshair, Tent, Megaphone, X, CheckCircle2, Loader2
} from 'lucide-react';

const FILTERS = ['All', 'Hospital', 'Ambulance', 'Police Station', 'Fire Station', 'Pharmacy'];
const MARKER_POSITIONS = [
  { top: '22%', left: '22%' }, { top: '30%', left: '76%' }, { top: '70%', left: '30%' },
  { top: '64%', left: '78%' }, { top: '16%', left: '52%' },
];
const USER_LOCATION = { city: 'Hyderabad, Telangana', lat: '17.3850° N', lng: '78.4867° E' };

function TypeIcon({ type, className = 'w-5 h-5' }) {
  switch (type) {
    case 'Hospital':       return <Hospital className={`${className} text-emerald-300`} />;
    case 'Fire Station':   return <Flame className={`${className} text-amber-300`} />;
    case 'Ambulance':      return <Ambulance className={`${className} text-red-300`} />;
    case 'Police Station': return <Building className={`${className} text-cyan-300`} />;
    case 'Pharmacy':       return <Pill className={`${className} text-pink-300`} />;
    default:               return <ShieldAlert className={`${className} text-red-300`} />;
  }
}

const openNavigation = (name, address) => {
  const query = encodeURIComponent([name, address].filter(Boolean).join(', '));
  window.open(`https://www.google.com/maps/dir/?api=1&destination=${query}`, '_blank', 'noopener');
};

function ReportModal({ onClose }) {
  const [form, setForm] = useState({ category: 'Flooding', location: '', description: '', severity: 'HIGH', contactNumber: '' });
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | sending | done
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const update = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setError('');
    try {
      setResult(await reports.submit(form, image));
      setStatus('done');
    } catch (err) {
      setError(err.message);
      setStatus('idle');
    }
  };

  return (
    <div className="modal-backdrop z-[150]" onClick={e => { if (e.target === e.currentTarget) onClose(); }} role="dialog" aria-modal="true" aria-label="Report a disaster issue">
      <div className="glass-panel glass-modal p-6 max-w-md w-full max-h-[90vh] overflow-y-auto" style={{ borderRadius: 'var(--r-xl)' }}>
        <button onClick={onClose} className="btn-icon absolute top-4 right-4" aria-label="Close"><X className="w-4 h-4" /></button>

        {status === 'done' ? (
          <div className="text-center py-4">
            <div className="service-icon-box mx-auto mb-3" style={{ background: 'rgba(52,211,153,0.2)', color: '#34D399' }}>
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-white">Report submitted</h3>
            <p className="text-sm text-white/70 mt-1">{result?.message}</p>
            {result?.report?.id && <p className="text-xs font-mono text-white/50 mt-2">Reference: {result.report.id.slice(0, 8).toUpperCase()}</p>}
            <button onClick={onClose} className="btn-primary mt-5 justify-center">Done</button>
          </div>
        ) : (
          <>
            <h3 className="text-lg font-extrabold text-white mb-1 flex items-center gap-2"><Megaphone className="w-5 h-5 text-red-300" /> Report a disaster issue</h3>
            <p className="text-xs text-white/60 mb-4">Your report is shared with the local response team. In danger right now? Call 112.</p>
            <form onSubmit={submit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="block text-xs font-bold text-white/70 mb-1">Type</span>
                  <select value={form.category} onChange={update('category')} className="input-glass text-sm !py-2.5">
                    {['Flooding', 'Fire', 'Building Collapse', 'Landslide', 'Road Blocked', 'Power Line Down', 'Other'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </label>
                <label className="block">
                  <span className="block text-xs font-bold text-white/70 mb-1">Severity</span>
                  <select value={form.severity} onChange={update('severity')} className="input-glass text-sm !py-2.5">
                    <option value="CRITICAL">Critical</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </label>
              </div>
              <label className="block">
                <span className="block text-xs font-bold text-white/70 mb-1">Location</span>
                <input required value={form.location} onChange={update('location')} placeholder="Street, landmark, area" className="input-glass text-sm !py-2.5" />
              </label>
              <label className="block">
                <span className="block text-xs font-bold text-white/70 mb-1">What's happening?</span>
                <textarea required rows={3} value={form.description} onChange={update('description')} placeholder="Describe the situation" className="input-glass text-sm !rounded-2xl resize-none" />
              </label>
              <label className="block">
                <span className="block text-xs font-bold text-white/70 mb-1">Contact number (optional)</span>
                <input type="tel" value={form.contactNumber} onChange={update('contactNumber')} placeholder="+91" className="input-glass text-sm !py-2.5" />
              </label>
              <label className="block">
                <span className="block text-xs font-bold text-white/70 mb-1">Photo (optional)</span>
                <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0] || null)} className="text-xs text-white/70 file:mr-3 file:border-0 file:rounded-full file:px-3 file:py-1.5 file:bg-white/10 file:text-white" />
              </label>
              <FormError message={error} />
              <button type="submit" disabled={status === 'sending'} className="btn-emergency w-full justify-center !py-3 text-sm !animate-none">
                {status === 'sending' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Megaphone className="w-4 h-4" />}
                Submit report
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default function EmergencyCenter() {
  const [facilities, setFacilities] = useState([]);
  const [shelters, setShelters] = useState([]);
  const [filterType, setFilterType] = useState('All');
  const [selectedId, setSelectedId] = useState(null);
  const [mapMode, setMapMode] = useState('satellite');
  const [showReport, setShowReport] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getEmergencyData(filterType === 'All' ? 'all' : filterType).then(data => {
      if (cancelled) return;
      setFacilities(data.emergencyFacilities || []);
      setShelters(data.disasterShelters || []);
    });
    return () => { cancelled = true; };
  }, [filterType]);

  const focusFacility = (id) => {
    setSelectedId(id);
    document.getElementById(`fac-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="space-y-5 fade-in max-w-4xl mx-auto pb-6">

      {/* Location & weather */}
      <section className="glass-panel p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="service-icon-box flex-shrink-0" style={{ background: 'rgba(255,181,71,0.18)', color: '#FFB547' }}>
            <Sun className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <span className="text-[10px] text-emerald-300 font-bold flex items-center gap-1">
              <Crosshair className="w-3 h-3" /> Location
            </span>
            <h3 className="font-extrabold text-white text-base">{USER_LOCATION.city}</h3>
            <p className="text-xs text-white/55 font-mono">{USER_LOCATION.lat}, {USER_LOCATION.lng}</p>
          </div>
        </div>

        <div className="glass-well flex items-center gap-4 px-4 py-2 w-full md:w-auto justify-around">
          <div className="text-center">
            <p className="eyebrow !text-[9px]">Weather</p>
            <p className="text-sm font-black text-amber-300">28°C</p>
          </div>
          <div className="h-6 w-px bg-white/10" />
          <div className="text-center">
            <p className="eyebrow !text-[9px]">Humidity</p>
            <p className="text-sm font-black text-cyan-300">74%</p>
          </div>
          <div className="h-6 w-px bg-white/10" />
          <div className="text-center">
            <p className="eyebrow !text-[9px]">Risk</p>
            <p className="text-xs font-extrabold text-red-300 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Heavy Rain</p>
          </div>
        </div>
      </section>

      {/* Alert */}
      <section className="alert-banner flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <CloudRain className="w-6 h-6 text-red-300 flex-shrink-0" />
          <div>
            <span className="badge badge-red !text-[9px] mb-0.5">Disaster Alert</span>
            <h4 className="font-extrabold text-white text-sm">Heavy Rain & Flood Warning — {USER_LOCATION.city}</h4>
            <p className="text-xs text-red-100/80 mt-0.5">Continuous rainfall expected over the next 12 hours. High alert for low-lying areas.</p>
          </div>
        </div>
        <button onClick={() => setShowReport(true)} className="btn-secondary !py-2 !px-4 text-xs self-start sm:self-center flex-shrink-0">
          <Megaphone className="w-4 h-4 text-red-300" /> Report issue
        </button>
      </section>

      {/* Filters & map */}
      <section className="glass-panel p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
          <div>
            <h2 className="text-xl font-black text-white">Emergency Services</h2>
            <p className="text-xs text-white/60">Tap a marker or facility for directions</p>
          </div>

          <div className="liquid-pill rounded-full p-1 flex items-center gap-1">
            {[['satellite', '🛰️ Satellite'], ['radar', '🗺️ Radar']].map(([mode, label]) => (
              <button
                key={mode}
                onClick={() => setMapMode(mode)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${mapMode === mode ? 'bg-white/90 text-slate-900 shadow' : 'text-white/70 hover:text-white'}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {FILTERS.map(cat => (
            <button key={cat} onClick={() => setFilterType(cat)} className={`chip ${filterType === cat ? 'active' : ''}`}>
              {cat === 'All' ? 'All' : cat + 's'}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between mt-4 mb-2">
          <span className="text-xs font-bold text-white/70 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-amber-300" /> {mapMode === 'satellite' ? 'Satellite imagery' : 'Radar view'}
          </span>
          <span className="text-[11px] text-white/45 font-mono">Simulated map</span>
        </div>

        <div
          className="relative w-full h-72 rounded-2xl overflow-hidden flex items-center justify-center border border-white/10"
          style={{
            backgroundImage: mapMode === 'satellite'
              ? 'radial-gradient(circle at 50% 50%, rgba(13, 27, 42, 0.75), rgba(5, 11, 24, 0.95)), url("https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000&auto=format&fit=crop")'
              : 'repeating-linear-gradient(0deg, rgba(95,212,255,0.08) 0 1px, transparent 1px 32px), repeating-linear-gradient(90deg, rgba(95,212,255,0.08) 0 1px, transparent 1px 32px)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: '#050b18',
          }}
        >
          <div className="absolute w-52 h-52 rounded-full border border-amber-300/20 animate-ping opacity-30 pointer-events-none" />
          <div className="absolute w-32 h-32 rounded-full border border-cyan-300/30 pointer-events-none" />

          <div className="absolute z-20 flex flex-col items-center">
            <div className="w-5 h-5 rounded-full bg-amber-300 border-2 border-white shadow-2xl animate-pulse" />
            <span className="liquid-pill text-[10px] font-extrabold text-white px-2 py-0.5 rounded-full mt-1">You</span>
          </div>

          {facilities.map((fac, i) => {
            const pos = MARKER_POSITIONS[i % MARKER_POSITIONS.length];
            const active = selectedId === fac.id;
            return (
              <div key={fac.id} style={{ top: pos.top, left: pos.left }} className="absolute z-30 group">
                <button
                  onClick={() => focusFacility(fac.id)}
                  className={`p-2 rounded-full border-2 border-white shadow-2xl transition-transform hover:scale-125 ${active ? 'bg-amber-400 scale-125' : 'bg-red-500'}`}
                  title={fac.name}
                  aria-label={fac.name}
                >
                  <MapPin className="w-4 h-4 text-white" />
                </button>
                <div className={`${active ? 'flex' : 'hidden group-hover:flex'} absolute -top-8 left-1/2 -translate-x-1/2 liquid-pill text-white text-[10px] font-bold px-2 py-1 rounded-md whitespace-nowrap`}>
                  {fac.name}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Facilities list */}
      <section className="space-y-3">
        <h3 className="text-base font-bold text-white px-1">Nearby Facilities</h3>
        {facilities.length === 0 && (
          <div className="glass-panel p-6 text-center text-sm text-white/60">No facilities of this type nearby.</div>
        )}
        <div className="space-y-3 stagger">
          {facilities.map(fac => (
            <div
              key={fac.id}
              id={`fac-${fac.id}`}
              onClick={() => setSelectedId(fac.id)}
              className={`glass-card p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 cursor-pointer ${selectedId === fac.id ? 'ring-1 ring-amber-300/60' : ''}`}
            >
              <div className="flex items-center gap-3">
                <div className="service-icon-box !w-10 !h-10 !rounded-xl flex-shrink-0" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <TypeIcon type={fac.type} />
                </div>
                <div>
                  <h4 className="font-extrabold text-white text-sm">{fac.name}</h4>
                  <p className="text-xs text-white/60 mt-0.5">{fac.address}</p>
                  <p className="text-[11px] text-white/45">{fac.distance} · {fac.status}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={e => { e.stopPropagation(); openNavigation(fac.name, fac.address); }}
                  className="btn-primary !py-1.5 !px-3 text-xs"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Navigate</span>
                </button>
                <a
                  href={`tel:${String(fac.phone).split('/')[0].trim()}`}
                  className="btn-icon"
                  onClick={e => e.stopPropagation()}
                  title={`Call ${fac.phone}`}
                  aria-label={`Call ${fac.name}`}
                >
                  <PhoneCall className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Relief shelters */}
      {shelters.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-base font-bold text-white px-1">Disaster Relief Shelters</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {shelters.map(sh => (
              <div key={sh.id} className="glass-card p-4">
                <div className="flex items-start gap-3">
                  <div className="service-icon-box !w-10 !h-10 !rounded-xl flex-shrink-0" style={{ background: 'rgba(52,211,153,0.18)', color: '#34D399' }}>
                    <Tent className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="badge badge-green !text-[9px]">{sh.disasterType}</span>
                    <h4 className="font-extrabold text-white text-sm mt-1">{sh.name}</h4>
                    <p className="text-xs text-white/60">{sh.location}</p>
                    <p className="text-[11px] text-white/50 mt-1">Occupancy {sh.currentOccupancy} / {sh.capacity}</p>
                  </div>
                </div>
                {sh.facilities?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {sh.facilities.map(f => <span key={f} className="badge badge-blue !text-[9px] !normal-case">{f}</span>)}
                  </div>
                )}
                <div className="flex gap-2 mt-3">
                  <button onClick={() => openNavigation(sh.name, sh.location)} className="btn-secondary !py-1.5 !px-3 text-xs">
                    <Navigation className="w-3.5 h-3.5" /> Directions
                  </button>
                  {sh.contactPhone && (
                    <a href={`tel:${sh.contactPhone.replace(/\s/g, '')}`} className="btn-secondary !py-1.5 !px-3 text-xs">
                      <PhoneCall className="w-3.5 h-3.5" /> Call
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <a href="tel:112" className="btn-emergency w-full justify-center !py-4 text-base tracking-wider !rounded-2xl uppercase">
        <ShieldAlert className="w-6 h-6" />
        <span>Emergency Help Now · 112</span>
      </a>

      {showReport && <ReportModal onClose={() => setShowReport(false)} />}
    </div>
  );
}
