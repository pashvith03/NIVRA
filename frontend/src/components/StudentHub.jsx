// frontend/src/components/StudentHub.jsx  — NIVRA Platform
import React, { useState, useEffect } from 'react';
import { getScholarships, getEducationLoans } from '../services/api';
import {
  GraduationCap, Award, Landmark, Search, ExternalLink, BookmarkPlus,
  ChevronRight, CheckCircle2, FileText, Zap, Calendar, ArrowRight, ShieldCheck
} from 'lucide-react';

export default function StudentHub({ onTrackService }) {
  const [scholarships, setScholarships] = useState([]);
  const [loans, setLoans] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState('All');
  const [selectedScheme, setSelectedScheme] = useState(null);

  useEffect(() => {
    loadData();
  }, [searchQuery, filterTag]);

  const loadData = async () => {
    const schData = await getScholarships(filterTag.toLowerCase(), searchQuery);
    const loanData = await getEducationLoans();
    setScholarships(schData);
    setLoans(loanData);
  };

  // ── SCHEME DETAILS MODAL VIEW (Screen 7 Spec) ──
  if (selectedScheme) {
    return (
      <div className="space-y-5 fade-in max-w-4xl mx-auto">
        <button
          onClick={() => setSelectedScheme(null)}
          className="btn-secondary py-1.5 px-3 text-xs mb-2"
        >
          ← Back to Scholarships
        </button>

        {/* Hero Scheme Card Screen 7 */}
        <div className="glass-panel p-6 relative overflow-hidden">
          <span className="badge badge-green mb-2">Central Government Scheme</span>
          <h2 className="text-2xl font-black text-white">{selectedScheme.name}</h2>
          <p className="text-xs text-cyan-300 font-semibold mt-0.5">{selectedScheme.offeredBy}</p>

          {/* Key Facts Pills Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
            <div className="p-3 bg-black/40 rounded-xl border border-white/10">
              <span className="text-[10px] text-white/50 font-bold uppercase">Amount</span>
              <p className="text-sm font-black text-emerald-400">{selectedScheme.amount}</p>
            </div>
            <div className="p-3 bg-black/40 rounded-xl border border-white/10">
              <span className="text-[10px] text-white/50 font-bold uppercase">Beneficiary</span>
              <p className="text-xs font-bold text-white truncate">Students / Farmers</p>
            </div>
            <div className="p-3 bg-black/40 rounded-xl border border-white/10">
              <span className="text-[10px] text-white/50 font-bold uppercase">Application Mode</span>
              <p className="text-xs font-bold text-white">Online / NSP Portal</p>
            </div>
            <div className="p-3 bg-black/40 rounded-xl border border-white/10">
              <span className="text-[10px] text-white/50 font-bold uppercase">Deadline</span>
              <p className="text-xs font-bold text-amber-400">{selectedScheme.deadline}</p>
            </div>
          </div>

          {/* Eligibility & Docs */}
          <div className="mt-5 space-y-3">
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1">Eligibility Criteria</h4>
              <ul className="space-y-1 text-xs text-white/80">
                {selectedScheme.eligibility.map((el, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 mt-0.5" />
                    <span>{el}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1">Mandatory Documents</h4>
              <p className="text-xs text-white/70">{selectedScheme.documents.join(', ')}</p>
            </div>
          </div>

          {/* Screen 7 Action Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
            <a
              href={selectedScheme.officialLink}
              target="_blank"
              rel="noreferrer"
              className="btn-primary w-full sm:w-auto justify-center py-3 px-6 text-sm"
            >
              <span>Apply Now via Official Portal</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            {onTrackService && (
              <button
                onClick={() => onTrackService(selectedScheme)}
                className="btn-saffron w-full sm:w-auto justify-center py-3 px-6 text-sm"
              >
                <BookmarkPlus className="w-4 h-4" />
                <span>Track Application</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── SCHOLARSHIP FINDER SCREEN (Screen 6 Spec) ──
  return (
    <div className="space-y-5 fade-in max-w-4xl mx-auto">
      
      {/* Search & Header Screen 6 */}
      <div className="glass-panel p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">Scholarship Finder</h2>
            <p className="text-xs text-white/60">Verified government & merit scholarships for Indian students</p>
          </div>
        </div>

        {/* Search Input */}
        <div className="search-glow-wrapper">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-white/40 z-10 pointer-events-none" />
          <input
            type="text"
            placeholder="Search scholarships..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="input-glass pl-11 py-2.5 text-xs"
          />
        </div>

        {/* Filter Pills Screen 6 */}
        <div className="flex items-center gap-2 mt-3 overflow-x-auto">
          {['All', 'Engineering', 'UG', 'PG', 'State'].map(tag => (
            <button
              key={tag}
              onClick={() => setFilterTag(tag)}
              className={`chip text-xs ${filterTag === tag ? 'active' : ''}`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Scholarship Cards Grid Screen 6 */}
      <div className="space-y-3">
        {scholarships.map((sch) => (
          <div
            key={sch.id}
            onClick={() => setSelectedScheme(sch)}
            className="glass-card p-5 cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-400/20 to-purple-600/30 border border-cyan-400/30 flex items-center justify-center text-cyan-400 flex-shrink-0 mt-0.5">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <span className="badge badge-purple text-[9px] mb-1">{sch.category}</span>
                <h3 className="font-extrabold text-white text-base leading-tight">{sch.name}</h3>
                <p className="text-xs text-white/60 mt-0.5">{sch.offeredBy}</p>
                <div className="mt-2 flex items-center gap-3">
                  <span className="text-xs font-black text-emerald-400">{sch.amount}</span>
                  <span className="text-[10px] text-amber-400 font-bold">Deadline: {sch.deadline}</span>
                </div>
              </div>
            </div>

            <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10">
              <span className="text-xs text-cyan-400 font-bold flex items-center gap-1">
                Details <ChevronRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Education Loan Section */}
      <div className="glass-panel p-5 mt-6">
        <h3 className="text-lg font-black text-white mb-1 flex items-center gap-2">
          <Landmark className="w-5 h-5 text-cyan-400" /> Collateral-Free Education Loans
        </h3>
        <p className="text-xs text-white/60 mb-4">Under Vidya Lakshmi Portal guidelines, loans up to ₹7.5 Lakhs require zero third-party guarantee.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {loans.map(loan => (
            <div key={loan.id} className="glass-card p-4">
              <span className="badge badge-blue text-[9px] mb-1">{loan.offeredBy}</span>
              <h4 className="font-bold text-white text-sm">{loan.schemeName}</h4>
              <p className="text-xs text-emerald-400 font-bold mt-1">Up to {loan.maxLoanAmount} • {loan.interestRate}</p>
              <a href={loan.officialSource} target="_blank" rel="noreferrer" className="btn-saffron py-1 px-3 text-xs mt-3 inline-flex">
                <span>Apply Portal</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

