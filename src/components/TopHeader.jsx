import React from 'react';
import { useApp } from '../context/AppContext';

export function TopHeader() {
  const { 
    currentRole, 
    setCurrentRole, 
    adminTab, 
    useLiveApi, 
    setUseLiveApi 
  } = useApp();

  return (
    <header className="h-16 border-b border-slate-800/80 bg-[#060d17]/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left: View title & Breadcrumb */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-800/90 text-slate-300 border border-slate-700/80">
            {currentRole === 'creator' ? 'Creator Suite' : 'Admin Governance'}
          </span>
          <span className="text-slate-600">/</span>
          <h2 className="text-sm font-bold text-white tracking-wide">
            {currentRole === 'creator'
              ? 'Performance Analytics & Post Submissions'
              : adminTab === 'overview'
              ? 'Platform Overview & Fraud Analytics'
              : adminTab === 'verification'
              ? 'Verification Center & Risk Audit'
              : 'Payment Management & Clearinghouse'}
          </h2>
        </div>
      </div>

      {/* Right: Mode Toggle + User Quick Status */}
      <div className="flex items-center gap-4">
        {/* Quick Mode Toggle Pill */}
        <div className="flex items-center gap-2 p-1 pl-2.5 pr-1 rounded-full bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-1.5 text-xs font-semibold">
            {useLiveApi ? (
              <span className="flex items-center gap-1.5 text-blue-400">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
                <span>Live APIs</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Mock Mode</span>
              </span>
            )}
          </div>

          <button
            onClick={() => setUseLiveApi(!useLiveApi)}
            className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
              useLiveApi
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/50'
                : 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/50'
            }`}
            title="Toggle between Live Browser API calls and Instant Mock Simulation"
          >
            {useLiveApi ? 'Switch to Mock' : 'Switch to Live'}
          </button>
        </div>

        {/* User Pill with Instant Role Switcher */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-slate-800">
          <div className="text-right">
            <p className="text-xs font-bold text-white leading-tight">
              {currentRole === 'creator' ? 'Ayesha Khan' : 'Security Ops'}
            </p>
            <p className="text-[10px] text-slate-400">
              {currentRole === 'creator' ? 'Creator' : 'Admin'}
            </p>
          </div>
          <button
            onClick={() => setCurrentRole(currentRole === 'creator' ? 'admin' : 'creator')}
            className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white text-xs font-bold flex items-center justify-center hover:ring-2 hover:ring-blue-400/50 transition-all"
            title="Click to toggle role"
          >
            {currentRole === 'creator' ? 'AK' : 'AD'}
          </button>
        </div>
      </div>
    </header>
  );
}
