import React from 'react';
import { useApp } from '../context/AppContext';
import { Menu, ShieldCheck, Zap, Globe2 } from 'lucide-react';

export function TopHeader() {
  const { 
    currentRole, 
    setCurrentRole, 
    adminTab, 
    useLiveApi, 
    setUseLiveApi,
    setIsMobileMenuOpen 
  } = useApp();

  return (
    <header className="h-16 border-b border-slate-800/80 bg-[#060d17]/90 backdrop-blur-md px-3 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Mobile Hamburger & View Breadcrumbs */}
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        {/* Hamburger Menu Trigger for Mobile Screens */}
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors shrink-0"
          aria-label="Open mobile navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Mobile Brand Name */}
        <div className="flex items-center gap-1.5 lg:hidden shrink-0">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-400 p-0.5 shadow-sm">
            <div className="w-full h-full bg-[#0b1b2e] rounded-[6px] flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            </div>
          </div>
          <span className="font-extrabold text-white text-xs tracking-tight">CreatorShield</span>
        </div>

        {/* Desktop View Breadcrumbs */}
        <div className="hidden lg:flex items-center gap-2 min-w-0 truncate">
          <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-800/90 text-slate-300 border border-slate-700/80 shrink-0">
            {currentRole === 'creator' ? 'Creator Suite' : 'Admin Governance'}
          </span>
          <span className="text-slate-600">/</span>
          <h2 className="text-sm font-bold text-white tracking-wide truncate">
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
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        {/* Quick Mode Toggle Pill */}
        <div className="flex items-center gap-1.5 p-1 pl-2 sm:pl-2.5 pr-1 rounded-full bg-slate-900 border border-slate-800">
          <div className="flex items-center gap-1 text-[11px] sm:text-xs font-semibold">
            {useLiveApi ? (
              <span className="flex items-center gap-1.5 text-blue-400">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
                <span className="hidden sm:inline">Live APIs</span>
                <span className="sm:hidden text-[10px]">Live</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="hidden sm:inline">Mock Mode</span>
                <span className="sm:hidden text-[10px]">Mock</span>
              </span>
            )}
          </div>

          <button
            onClick={() => setUseLiveApi(!useLiveApi)}
            className={`px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-bold transition-all ${
              useLiveApi
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/50'
                : 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/50'
            }`}
            title="Toggle between Live Browser API calls and Instant Mock Simulation"
          >
            {useLiveApi ? 'Mock' : 'Live'}
          </button>
        </div>

        {/* User Pill with Instant Role Switcher */}
        <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-slate-800">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-white leading-tight">
              {currentRole === 'creator' ? 'Ayesha Khan' : 'Security Ops'}
            </p>
            <p className="text-[10px] text-slate-400">
              {currentRole === 'creator' ? 'Creator' : 'Admin'}
            </p>
          </div>
          <button
            onClick={() => setCurrentRole(currentRole === 'creator' ? 'admin' : 'creator')}
            className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white text-xs font-bold flex items-center justify-center hover:ring-2 hover:ring-blue-400/50 transition-all shrink-0"
            title="Tap to toggle role (Creator vs Admin)"
          >
            {currentRole === 'creator' ? 'AK' : 'AD'}
          </button>
        </div>
      </div>
    </header>
  );
}
