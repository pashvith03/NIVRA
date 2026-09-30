// frontend/src/components/AIChatAssistant.jsx  — NIVRA Platform
import React, { useState, useRef, useEffect } from 'react';
import { sendAIQuery, analyzeImageAI } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import {
  Zap, Send, Upload, FileText, CheckCircle2, ExternalLink,
  Bot, User, ArrowRight, BookmarkPlus, HelpCircle, Mic, Sparkles, X,
  Building2, GraduationCap, Landmark, AlertTriangle, ShieldAlert, ChevronRight, Search, Clock
} from 'lucide-react';

const INTENT_BADGES = {
  STUDENT_SCHOLARSHIP: { label: '🎓 Scholarship', cls: 'badge-blue' },
  STUDENT_LOAN:        { label: '🏦 Education Loan', cls: 'badge-blue' },
  DISASTER_ASSISTANCE: { label: '🚨 Disaster & Emergency', cls: 'badge-red' },
  EMERGENCY_LOCATOR:   { label: '🚑 Emergency Locator', cls: 'badge-red' },
  GOVT_SERVICE_GUIDE:  { label: '📄 Certificate Guide', cls: 'badge-green' },
  GOVT_SCHEME:         { label: '🇮🇳 Government Scheme', cls: 'badge-green' },
  GENERAL_GUIDANCE:    { label: '💡 AI Guidance', cls: 'badge-saffron' },
};

const PRESET_QUERIES = [
  { label: '🎓 Find scholarships for engineering students', query: "I am an engineering student. What government scholarships can I apply for?" },
  { label: '📄 How to apply for income certificate?', query: "How to apply for an income certificate and what documents are required?" },
  { label: '🏥 Nearest hospital around me', query: "Show me nearest 24/7 hospitals and emergency ambulance contacts." },
  { label: '🚨 Disaster alerts in my area', query: "Are there any heavy rain or flood alerts in my location?" },
  { label: '🏦 Education loan process', query: "How can I get an education loan without collateral under Vidya Lakshmi portal?" },
];

export default function AIChatAssistant({ mode = 'chat', onNavigate, onSelectServiceForTracking }) {
  const { t } = useLanguage();
  const { user, setShowGoogleModal } = useAuth();
  const [inputText, setInputText]       = useState('');
  const [loading, setLoading]           = useState(false);
  const [imageFile, setImageFile]       = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const messagesEndRef                  = useRef(null);

  const [messages, setMessages] = useState([{
    sender: 'ai',
    text: "Namaste! 👋 I'm your **NIVRA AI Assistant**. Tell me your situation in simple words — for example: *'I am a college student needing help with fees'* or *'There is flooding in my street'*. I'll classify your problem and show exact schemes, loan rules, or emergency shelter steps.",
    intentCategory: 'GENERAL_GUIDANCE',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  }]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (queryText = inputText) => {
    const textToSend = queryText || inputText;
    if (!textToSend.trim() && !imageFile) return;

    if (mode === 'home') {
      if (onNavigate) onNavigate('ai');
    }

    const userMsg = {
      sender: 'user',
      text: textToSend,
      imagePreview,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    let imageAnalysisData = null;
    if (imageFile) {
      imageAnalysisData = await analyzeImageAI(imageFile);
      setImageFile(null);
      setImagePreview(null);
    }

    const res = await sendAIQuery(textToSend);
    const aiMsg = {
      sender: 'ai',
      text: res.responseText || 'Here is the guidance I prepared for your query.',
      intentCategory: res.intentCategory || 'GENERAL_GUIDANCE',
      matchedItems: res.matchedItems || [],
      documentChecklist: res.documentChecklist || [],
      nextSteps: res.nextSteps || [],
      officialSources: res.officialSources || [],
      urgentAction: res.urgentAction || false,
      imageAnalysis: imageAnalysisData,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, aiMsg]);
    setLoading(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const IntentBadge = ({ category }) => {
    const badge = INTENT_BADGES[category] || INTENT_BADGES.GENERAL_GUIDANCE;
    return <span className={`badge ${badge.cls}`}>{badge.label}</span>;
  };

  // ── HOME MODE VIEW (Screen 2 matching image spec) ──
  if (mode === 'home') {
    const firstName = user.name ? user.name.split(' ')[0] : 'User';
    return (
      <div className="space-y-6 fade-in max-w-4xl mx-auto">
        
        {/* User Greeting Hero Card */}
        <div className="glass-panel p-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>
                Good morning,
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                {firstName} 👋
              </h2>
              <p className="text-sm mt-1 text-blue-200">
                How can I help you today?
              </p>
            </div>

            {/* Dynamic Google Profile Avatar */}
            <div
              onClick={() => setShowGoogleModal(true)}
              className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-400 via-blue-600 to-purple-600 p-0.5 shadow-lg flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
              title="Google Account"
            >
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full rounded-[14px] object-cover"
                  onError={e => {
                    e.target.onerror = null;
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0D8ABC&color=fff`;
                  }}
                />
              ) : (
                <div className="w-full h-full rounded-[14px] bg-[#070d24] flex items-center justify-center text-white font-bold text-lg">
                  {firstName[0]}
                </div>
              )}
            </div>
          </div>

          {/* Ask NIVRA Search Pill with Moving Glow Border */}
          <form
            onSubmit={e => { e.preventDefault(); handleSend(); }}
            className="mt-5 relative flex items-center"
          >
            <div className="search-glow-wrapper">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-white/50 z-10 pointer-events-none" />
              <input
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder="Ask NIVRA anything..."
                className="input-glass pl-12 pr-12 py-3.5 text-sm w-full"
              />
              <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-400 hover:text-white z-10">
                <Mic className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>

        {/* 6 Glass Grid Service Icons (Screen 2 Spec) */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-base font-bold text-white">Core Services</h3>
            <span className="text-xs text-amber-300 font-semibold cursor-pointer" onClick={() => onNavigate && onNavigate('services')}>View All</span>
          </div>

          <div className="grid-services-spec">
            {[
              { id: 'services',  title: 'Government Schemes', icon: Building2,     color: '#FF9933', bg: 'rgba(255,153,51,0.15)' },
              { id: 'student',   title: 'Student Support',    icon: GraduationCap, color: '#A855F7', bg: 'rgba(168,85,247,0.15)' },
              { id: 'student',   title: 'Education Loans',    icon: Landmark,      color: '#00C6FF', bg: 'rgba(0,198,255,0.15)' },
              { id: 'alerts',    title: 'Emergency Services', icon: AlertTriangle, color: '#FF334B', bg: 'rgba(255,51,75,0.15)' },
              { id: 'alerts',    title: 'Disaster Assistance',icon: ShieldAlert,   color: '#34D399', bg: 'rgba(52,211,153,0.15)' },
              { id: 'documents', title: 'Documents',          icon: FileText,      color: '#38BDF8', bg: 'rgba(56,189,248,0.15)' },
            ].map((item, idx) => {
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
                  <span className="text-xs font-bold text-white leading-snug">{item.title}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recommended for You Section (Screen 2 Spec) */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-base font-bold text-white">Recommended for You</h3>
            <span className="text-xs text-amber-300 font-semibold cursor-pointer" onClick={() => onNavigate && onNavigate('student')}>View All</span>
          </div>

          <div
            onClick={() => onNavigate && onNavigate('student')}
            className="glass-card p-5 cursor-pointer flex items-center justify-between border-l-4 border-l-amber-400"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-white text-base">Scholarships for You</h4>
                <p className="text-xs text-white/60">Find schemes you may be eligible for based on profile</p>
              </div>
            </div>
            <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white">
              <ChevronRight className="w-5 h-5" />
            </div>
          </div>
        </div>

      </div>
    );
  }

  // ── FULL NIVRA AI ASSISTANT CHAT ENGINE (Screen 3 matching image spec) ──
  return (
    <div className="max-w-4xl mx-auto space-y-4 fade-in">

      {/* Futuristic AI Header Screen 3 */}
      <div className="glass-panel p-6 text-center relative overflow-hidden flex flex-col items-center justify-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600 p-1 shadow-2xl mb-3 animate-pulse">
          <div className="w-full h-full rounded-full bg-[#151221] flex items-center justify-center text-amber-300">
            <Bot className="w-10 h-10" />
          </div>
        </div>

        <h2 className="font-display text-2xl font-black text-white">
          NIVRA AI
        </h2>
        <div className="flex items-center justify-center gap-2 mt-0.5">
          <span className="badge badge-saffron text-[9px]">🌐 Real-Time Web Verified</span>
          <p className="text-xs text-amber-300 font-semibold uppercase tracking-wider">
            Your Intelligent Service Guide
          </p>
        </div>

        {/* Quick Query Pills Screen 3 */}
        <div className="mt-5 w-full space-y-2">
          {PRESET_QUERIES.map((pq, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(pq.query)}
              className="w-full glass-card p-3 text-xs font-semibold text-left text-white/90 hover:text-amber-300 flex items-center justify-between"
            >
              <span>{pq.label}</span>
              <ChevronRight className="w-4 h-4 text-amber-400 flex-shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Stream */}
      <div
        className="glass-panel p-4 flex flex-col gap-4"
        style={{ minHeight: '380px', maxHeight: '550px', overflowY: 'auto' }}
      >
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex flex-col fade-in ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
            <div className="flex items-center gap-2 mb-1">
              {msg.sender === 'ai' ? (
                <>
                  <div className="n-logo-box text-xs w-6 h-6 rounded-lg">N</div>
                  <span className="text-xs font-bold text-amber-300">NIVRA AI</span>
                  <IntentBadge category={msg.intentCategory} />
                </>
              ) : (
                <span className="text-xs font-bold text-amber-200">You</span>
              )}
            </div>

            <div
              className="max-w-2xl p-4 rounded-2xl text-sm"
              style={
                msg.sender === 'user'
                  ? { background: 'linear-gradient(135deg, #F59E0B, #EC4899)', color: '#fff', borderRadius: '18px 18px 4px 18px' }
                  : { background: 'rgba(22, 18, 35, 0.85)', border: '1px solid rgba(245, 215, 175, 0.25)', color: 'var(--text-primary)', borderRadius: '4px 18px 18px 18px' }
              }
            >
              <div className="leading-relaxed whitespace-pre-line">{msg.text}</div>

              {/* Required Documents & Application Deadlines Breakdown */}
              {msg.sender === 'ai' && (
                <div className="mt-3 pt-3 border-t border-white/10 space-y-3">
                  
                  {/* Documents Checklist */}
                  <div className="p-3 bg-black/40 rounded-xl border border-white/10">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-extrabold text-amber-300 flex items-center gap-1.5 uppercase tracking-wider">
                        <FileText className="w-3.5 h-3.5 text-amber-400" /> Required Documents Checklist
                      </span>
                      <span className="badge badge-green text-[9px]">Verified</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-white/80">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span>Aadhaar Card (Linked to Mobile)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span>Income Certificate (Current FY)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span>Educational Marksheets &amp; Bonafide</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span>Bank Account Details (DBT enabled)</span>
                      </div>
                    </div>
                  </div>

                  {/* Deadlines & Processing info */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-amber-500/10 rounded-xl border border-amber-500/30 gap-2">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
                      <div>
                        <p className="text-[10px] font-bold text-amber-300 uppercase">Application Deadline &amp; Processing</p>
                        <p className="text-xs text-white font-bold">Deadline: 31st October 2026 • Est. Processing: 15 Working Days</p>
                      </div>
                    </div>

                    <a
                      href="https://myscheme.gov.in"
                      target="_blank"
                      rel="noreferrer"
                      className="btn-primary py-1 px-3 text-[11px] bg-gradient-to-r from-amber-500 to-pink-500 hover:brightness-110 flex items-center gap-1"
                    >
                      <span>Apply on Official Portal</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                </div>
              )}

              {/* Matched Items */}
              {msg.matchedItems?.length > 0 && (
                <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {msg.matchedItems.map((item, i) => (
                    <div key={i} className="p-3 bg-black/40 rounded-xl border border-white/10 text-xs">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-white">{item.name || item.schemeName}</h4>
                        <span className="badge badge-saffron text-[8px]">Web Live</span>
                      </div>
                      <p className="text-[11px] text-white/70 mt-1">{item.description || item.benefit}</p>
                      {onSelectServiceForTracking && (
                        <button
                          onClick={() => onSelectServiceForTracking(item)}
                          className="mt-2 text-[10px] font-bold text-amber-300 flex items-center gap-1"
                        >
                          <BookmarkPlus className="w-3 h-3" /> Track Application
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form Bar with Moving Glow Border */}
      <div className="glass-panel p-3">
        <form
          onSubmit={e => { e.preventDefault(); handleSend(); }}
          className="flex items-center gap-2"
        >
          <label className="btn-icon rounded-full cursor-pointer">
            <Upload className="w-4 h-4 text-amber-400" />
            <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </label>

          <div className="search-glow-wrapper flex-1">
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder="Type your question..."
              className="input-glass w-full"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary py-2.5 px-5 bg-gradient-to-r from-amber-500 to-pink-500">
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
}

