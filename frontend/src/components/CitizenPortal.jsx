// frontend/src/components/CitizenPortal.jsx  — NIVRA Platform
import React, { useState, useEffect } from 'react';
import { getGovernmentSchemes, getServiceGuides } from '../services/api';
import {
  Building2, Search, ExternalLink, ShieldCheck, FileText, CheckCircle2,
  ChevronRight, BookmarkPlus, GraduationCap, Landmark, Briefcase, HeartPulse,
  AlertTriangle, Flame, HelpCircle, Users, Sprout, Folder
} from 'lucide-react';

const SERVICES_GRID_ITEMS = [
  { id: 'student',   name: 'Government Schemes',   icon: Building2,     color: '#FF9933', bg: 'rgba(255,153,51,0.15)' },
  { id: 'student',   name: 'Student Scholarships', icon: GraduationCap, color: '#A855F7', bg: 'rgba(168,85,247,0.15)' },
  { id: 'student',   name: 'Education Loans',      icon: Landmark,      color: '#00C6FF', bg: 'rgba(0,198,255,0.15)' },
  { id: 'documents', name: 'Certificates & Docs',  icon: FileText,      color: '#38BDF8', bg: 'rgba(56,189,248,0.15)' },
  { id: 'student',   name: 'Job & Skill Dev',      icon: Briefcase,     color: '#EC4899', bg: 'rgba(236,72,153,0.15)' },
  { id: 'citizen',   name: 'Health & Insurance',   icon: HeartPulse,    color: '#FF334B', bg: 'rgba(255,51,75,0.15)' },
  { id: 'alerts',    name: 'Emergency Services',   icon: AlertTriangle, color: '#EF4444', bg: 'rgba(239,68,68,0.15)' },
  { id: 'alerts',    name: 'Disaster Assistance',  icon: ShieldCheck,   color: '#34D399', bg: 'rgba(52,211,153,0.15)' },
  { id: 'citizen',   name: 'Grievance Complaints', icon: HelpCircle,    color: '#F59E0B', bg: 'rgba(245,158,11,0.15)' },
  { id: 'citizen',   name: 'Women & Child Support',icon: Users,         color: '#F472B6', bg: 'rgba(244,114,182,0.15)' },
  { id: 'citizen',   name: 'Farmer Support',       icon: Sprout,        color: '#10B981', bg: 'rgba(16,185,129,0.15)' },
  { id: 'citizen',   name: 'Other Services',       icon: Folder,        color: '#94A3B8', bg: 'rgba(148,163,184,0.15)' },
];

const DOCUMENTS_LIST = [
  { name: 'Aadhaar Card', desc: 'Identity & Address Proof', cat: 'Personal', portal: 'https://uidai.gov.in' },
  { name: 'Income Certificate', desc: 'Required for fee reimbursement & government schemes', cat: 'Income', portal: 'https://serviceonline.gov.in' },
  { name: 'Caste Certificate', desc: 'For reservation benefits & SC/ST/OBC scholarships', cat: 'Personal', portal: 'https://serviceonline.gov.in' },
  { name: 'Domicile Certificate', desc: 'State residency proof for local quota', cat: 'Personal', portal: 'https://serviceonline.gov.in' },
  { name: 'Bonafide Certificate', desc: 'Issued by college/school for student verification', cat: 'Educational', portal: 'https://scholarships.gov.in' },
  { name: 'Disability Certificate', desc: 'For Divyangjan benefits & quota reservation', cat: 'Personal', portal: 'https://www.swavlambancard.gov.in' },
  { name: 'Ration Card', desc: 'Food security & PDS distribution eligibility', cat: 'Income', portal: 'https://nfsa.gov.in' },
];

export default function CitizenPortal({ viewMode = 'all-services', onNavigate, onTrackService }) {
  const [schemes, setSchemes] = useState([]);
  const [guides, setGuides] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [docFilter, setDocFilter] = useState('All');

  useEffect(() => {
    loadData();
  }, [searchQuery]);

  const loadData = async () => {
    const sData = await getGovernmentSchemes(searchQuery);
    const gData = await getServiceGuides();
    setSchemes(sData);
    setGuides(gData);
  };

  // ── DOCUMENTS GUIDE SCREEN (Screen 9 Spec) ──
  if (viewMode === 'documents') {
    const filteredDocs = docFilter === 'All'
      ? DOCUMENTS_LIST
      : DOCUMENTS_LIST.filter(d => d.cat === docFilter);

    return (
      <div className="space-y-5 fade-in max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="glass-panel p-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white">Documents Guide</h2>
              <p className="text-xs text-white/60">Official certificate procedures, eligibility & verified links</p>
            </div>
          </div>

          {/* Search */}
          <div className="search-glow-wrapper mt-4">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-white/40 z-10 pointer-events-none" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="input-glass pl-11 py-2.5 text-xs"
            />
          </div>

          {/* Filter Chips Screen 9 */}
          <div className="flex items-center gap-2 mt-3 overflow-x-auto">
            {['All', 'Personal', 'Educational', 'Income'].map(cat => (
              <button
                key={cat}
                onClick={() => setDocFilter(cat)}
                className={`chip text-xs ${docFilter === cat ? 'active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Documents Cards List (Screen 9 Spec) */}
        <div className="space-y-3">
          {filteredDocs.map((doc, idx) => (
            <div key={idx} className="glass-card p-4 flex items-center justify-between">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-blue-600/30 border border-cyan-400/30 flex items-center justify-center text-cyan-400 flex-shrink-0 mt-0.5">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">{doc.name}</h3>
                  <p className="text-xs text-white/60 mt-0.5">{doc.desc}</p>
                </div>
              </div>

              <a
                href={doc.portal}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary py-1.5 px-3 text-xs"
              >
                <span>Portal</span>
                <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
              </a>
            </div>
          ))}
        </div>

      </div>
    );
  }

  // ── SERVICES HUB SCREEN (Screen 4 Spec) ──
  return (
    <div className="space-y-5 fade-in max-w-4xl mx-auto">
      
      {/* Header & Search Bar Screen 4 */}
      <div className="glass-panel p-5">
        <h2 className="text-2xl font-black text-white mb-1">Services</h2>
        <p className="text-xs text-white/60 mb-4">Discover all national citizen & student services in one platform</p>

        <div className="search-glow-wrapper">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-white/40 z-10 pointer-events-none" />
          <input
            type="text"
            placeholder="Search all services..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="input-glass pl-11 py-2.5 text-xs"
          />
        </div>
      </div>

      {/* 3x4 Services Grid (Screen 4 Spec) */}
      <div className="grid-services-spec">
        {SERVICES_GRID_ITEMS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              onClick={() => onNavigate && onNavigate(item.id)}
              className="service-card-spec"
            >
              <div className="service-icon-box" style={{ background: item.bg, color: item.color }}>
                <Icon className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-white leading-snug">{item.name}</span>
            </div>
          );
        })}
      </div>

      {/* Verified Government Schemes Showcase */}
      <div className="space-y-3 pt-2">
        <h3 className="text-base font-bold text-white">Popular Welfare Schemes</h3>
        <div className="grid-cards">
          {schemes.slice(0, 4).map((sch) => (
            <div key={sch.id} className="glass-card p-4 flex flex-col justify-between">
              <div>
                <span className="badge badge-green text-[9px] mb-2">{sch.category}</span>
                <h4 className="font-extrabold text-white text-base mb-1">{sch.name}</h4>
                <p className="text-xs text-cyan-300 font-semibold mb-2">{sch.ministry}</p>
                <p className="text-xs text-white/70 line-clamp-2">{sch.benefit}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                <a href={sch.officialLink} target="_blank" rel="noreferrer" className="btn-saffron py-1.5 px-3 text-xs">
                  <span>myScheme Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                {onTrackService && (
                  <button onClick={() => onTrackService(sch)} className="btn-secondary py-1.5 px-3 text-xs">
                    <BookmarkPlus className="w-3.5 h-3.5 text-purple-300" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

