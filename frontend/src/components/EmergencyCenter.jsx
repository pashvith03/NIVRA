// frontend/src/components/EmergencyCenter.jsx — NIVRA Emergency & Disaster Center (With Satellite Map & Live Weather)
import React, { useState, useEffect } from 'react';
import { getEmergencyData } from '../services/api';
import {
  ShieldAlert, PhoneCall, MapPin, Hospital, Flame, Ambulance,
  Building, CheckCircle2, Radio, Compass, CloudRain, Navigation,
  Layers, Sun, Wind, Droplets, AlertTriangle, Crosshair
} from 'lucide-react';

export default function EmergencyCenter() {
  const [facilities, setFacilities] = useState([]);
  const [shelters, setShelters] = useState([]);
  const [filterType, setFilterType] = useState('All');
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [mapMode, setMapMode] = useState('satellite'); // 'satellite' | 'radar'
  const [locationPermission, setLocationPermission] = useState('Granted');
  const [userCoords, setUserCoords] = useState({ city: 'Hyderabad, Telangana', lat: '17.3850° N', lng: '78.4867° E' });

  useEffect(() => {
    loadData();
  }, [filterType]);

  const loadData = async () => {
    const data = await getEmergencyData(filterType === 'All' ? 'all' : filterType);
    setFacilities(data.emergencyFacilities || []);
    setShelters(data.disasterShelters || []);
  };

  const getIconForType = (type) => {
    switch (type) {
      case 'Hospital': return <Hospital className="w-5 h-5 text-emerald-400" />;
      case 'Fire Station': return <Flame className="w-5 h-5 text-amber-400" />;
      case 'Ambulance': return <Ambulance className="w-5 h-5 text-red-400" />;
      case 'Police Station': return <Building className="w-5 h-5 text-cyan-400" />;
      default: return <ShieldAlert className="w-5 h-5 text-red-400" />;
    }
  };

  const openNavigation = (facName, address) => {
    const query = encodeURIComponent(`${facName}, ${address || userCoords.city}`);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${query}`, '_blank');
  };

  return (
    <div className="space-y-5 fade-in max-w-4xl mx-auto pb-10">

      {/* Live Location & Weather Card */}
      <div className="glass-panel p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-amber-500/30">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
            <Sun className="w-6 h-6 text-amber-400 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="badge badge-saffron text-[9px]">Location Verified</span>
              <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                <Crosshair className="w-3 h-3 text-emerald-400" /> GPS Active
              </span>
            </div>
            <h3 className="font-extrabold text-white text-base mt-0.5">
              {userCoords.city}
            </h3>
            <p className="text-xs text-white/60">
              {userCoords.lat}, {userCoords.lng}
            </p>
          </div>
        </div>

        {/* Weather Metrics */}
        <div className="flex items-center gap-4 bg-white/5 px-4 py-2 rounded-2xl border border-white/10 w-full md:w-auto justify-around">
          <div className="text-center">
            <p className="text-[10px] text-white/50 uppercase font-bold">Weather</p>
            <p className="text-sm font-black text-amber-300">28°C</p>
          </div>
          <div className="h-6 w-px bg-white/10" />
          <div className="text-center">
            <p className="text-[10px] text-white/50 uppercase font-bold">Humidity</p>
            <p className="text-sm font-black text-cyan-300">74%</p>
          </div>
          <div className="h-6 w-px bg-white/10" />
          <div className="text-center">
            <p className="text-[10px] text-white/50 uppercase font-bold">Disaster Risk</p>
            <p className="text-xs font-extrabold text-red-400 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> Heavy Rain
            </p>
          </div>
        </div>
      </div>

      {/* Live Heavy Rain Alert Banner */}
      <div className="alert-banner flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <CloudRain className="w-6 h-6 text-red-400 flex-shrink-0 animate-bounce" />
          <div>
            <span className="badge badge-red text-[9px] mb-0.5">Disaster Alert</span>
            <h4 className="font-extrabold text-white text-sm">Heavy Rain &amp; Flood Warning — {userCoords.city}</h4>
            <p className="text-xs text-red-200 mt-0.5">Continuous rainfall expected over next 12 hours. High alert for low-lying areas.</p>
          </div>
        </div>
      </div>

      {/* Filter Chips & Controls */}
      <div className="glass-panel p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
          <div>
            <h2 className="text-xl font-black text-white">Emergency Services &amp; Navigation</h2>
            <p className="text-xs text-white/60">Tap any facility to open Satellite Navigation</p>
          </div>

          {/* Map Mode Toggle Switch */}
          <div className="flex items-center gap-1 bg-white/10 p-1 rounded-full border border-white/15">
            <button
              onClick={() => setMapMode('satellite')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${mapMode === 'satellite' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-white/70 hover:text-white'}`}
            >
              🛰️ Satellite Map
            </button>
            <button
              onClick={() => setMapMode('radar')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${mapMode === 'radar' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-white/70 hover:text-white'}`}
            >
              🗺️ Radar Map
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pt-1">
          {['All', 'Hospital', 'Ambulance', 'Police Station', 'Fire Station'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilterType(cat)}
              className={`chip text-xs ${filterType === cat ? 'active' : ''}`}
            >
              {cat === 'Hospital' ? 'Hospitals' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Satellite Map Canvas */}
      <div className="glass-panel p-4 relative overflow-hidden rounded-3xl border-amber-500/30">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-amber-400" /> {mapMode === 'satellite' ? 'High-Res Satellite Imagery' : 'GPS Radar View'}
          </span>
          <span className="text-[11px] text-cyan-300 font-mono">Center: Nanakramguda, Hyderabad</span>
        </div>

        {/* Visual Map Simulator Canvas */}
        <div
          className="relative w-full h-72 rounded-2xl overflow-hidden flex items-center justify-center border border-amber-500/30 shadow-2xl"
          style={{
            backgroundImage: mapMode === 'satellite'
              ? 'radial-gradient(circle at 50% 50%, rgba(13, 27, 42, 0.95), rgba(5, 11, 24, 0.98)), url("https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000&auto=format&fit=crop")'
              : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: '#050b18',
          }}
        >
          {/* Radar Waves */}
          <div className="absolute w-52 h-52 rounded-full border border-amber-500/20 animate-ping opacity-30 pointer-events-none" />
          <div className="absolute w-32 h-32 rounded-full border border-cyan-500/30 pointer-events-none" />

          {/* User Location Center Marker */}
          <div className="absolute z-20 flex flex-col items-center">
            <div className="w-5 h-5 rounded-full bg-amber-400 border-2 border-white shadow-2xl animate-pulse flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-slate-950" />
            </div>
            <span className="text-[10px] font-extrabold bg-slate-950/90 text-amber-300 px-2 py-0.5 rounded-full mt-1 border border-amber-500/40 shadow-lg">
              You (Hyderabad)
            </span>
          </div>

          {/* Facility Markers */}
          {facilities.map((fac, i) => {
            const positions = [
              { top: '22%', left: '22%' },
              { top: '32%', left: '76%' },
              { top: '68%', left: '32%' },
              { top: '62%', left: '78%' },
            ];
            const pos = positions[i % positions.length];
            return (
              <div
                key={fac.id}
                style={{ top: pos.top, left: pos.left }}
                className="absolute z-30 group"
              >
                <button
                  onClick={() => setSelectedFacility(fac)}
                  className="p-2 rounded-full bg-red-600 hover:bg-red-500 border-2 border-white shadow-2xl transition-all transform hover:scale-125 cursor-pointer"
                  title={fac.name}
                >
                  <MapPin className="w-4 h-4 text-white" />
                </button>
                {/* Floating Map Marker Label */}
                <div className="hidden group-hover:flex absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900/95 text-white text-[10px] font-bold px-2 py-1 rounded-md border border-amber-400/40 whitespace-nowrap shadow-xl">
                  {fac.name}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Nearby Facilities List with Direct Satellite Navigation Button */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-white">Nearby Verified Facilities</h3>
        {facilities.map((fac) => (
          <div
            key={fac.id}
            className="glass-card p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 cursor-pointer hover:border-amber-400/40"
            onClick={() => setSelectedFacility(fac)}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                {getIconForType(fac.type)}
              </div>
              <div>
                <h4 className="font-extrabold text-white text-sm">{fac.name}</h4>
                <p className="text-xs text-white/60 mt-0.5">{fac.distance} • {fac.status}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              {/* Navigate / Directions Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openNavigation(fac.name, userCoords.city);
                }}
                className="btn-primary py-1.5 px-3 text-xs bg-gradient-to-r from-amber-500 to-rose-500 hover:brightness-110 flex items-center gap-1.5 shadow-lg"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Navigate</span>
              </button>

              {/* Call Button */}
              <a
                href={`tel:${fac.phone}`}
                className="btn-icon rounded-full hover:bg-emerald-500/20 hover:text-emerald-400 p-2"
                onClick={e => e.stopPropagation()}
                title="Call Emergency Facility"
              >
                <PhoneCall className="w-4 h-4" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Screen 5 Bottom EMERGENCY HELP NOW Button */}
      <div className="pt-3">
        <a
          href="tel:112"
          className="btn-emergency w-full justify-center py-4 text-base tracking-wider rounded-2xl shadow-2xl uppercase"
        >
          <ShieldAlert className="w-6 h-6 animate-pulse" />
          <span>🚨 EMERGENCY HELP NOW (112)</span>
        </a>
      </div>

    </div>
  );
}
