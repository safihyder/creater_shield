import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  UserCheck, 
  LayoutDashboard, 
  BadgeCheck, 
  CreditCard, 
  Send, 
  Settings, 
  RotateCcw, 
  Trash2, 
  ExternalLink,
  Sparkles,
  Zap,
  Globe2,
  Lock,
  ChevronRight,
  TrendingUp,
  FileCheck2,
  X
} from 'lucide-react';

export function Sidebar() {
  const { 
    currentRole, 
    setCurrentRole, 
    adminTab, 
    setAdminTab, 
    useLiveApi, 
    resetToMockData,
    clearLiveData,
    videos,
    isMobileMenuOpen,
    setIsMobileMenuOpen
  } = useApp();

  // Metrics summary for sidebar badges
  const flaggedCount = videos.filter((v) => v.status === 'Fake / Flagged' || v.status === 'Suspicious').length;
  const pendingPayoutCount = videos.filter((v) => v.status === 'Verified' && v.paymentStatus === 'Pending').length;

  const handleNav = (action) => {
    action();
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-200"
        />
      )}

      {/* Sidebar / Slide-over Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#0b1b2e] border-r border-slate-800/80 flex flex-col shrink-0 text-slate-300 select-none shadow-2xl lg:shadow-none lg:static lg:w-64 lg:min-h-screen transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-blue-500/20">
              <div className="w-full h-full bg-[#0b1b2e] rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base font-extrabold text-white tracking-tight">CreatorShield</h1>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  v2.4
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Analytics & Fraud Suite</p>
            </div>
          </div>

          {/* Close button for mobile screens */}
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Switcher */}
        <div className="p-4 border-b border-slate-800/70">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 block">
            Select Active Role
          </label>
          <div className="grid grid-cols-2 p-1 bg-slate-900/90 rounded-xl border border-slate-800">
            <button
              onClick={() => handleNav(() => setCurrentRole('creator'))}
              className={`flex items-center justify-center gap-1.5 py-2.5 sm:py-2 px-2.5 rounded-lg text-xs font-semibold transition-all ${
                currentRole === 'creator'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Creator</span>
            </button>
            <button
              onClick={() => handleNav(() => setCurrentRole('admin'))}
              className={`flex items-center justify-center gap-1.5 py-2.5 sm:py-2 px-2.5 rounded-lg text-xs font-semibold transition-all ${
                currentRole === 'admin'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          </div>

          {/* User Profile Card */}
          <div className="mt-3 p-2.5 rounded-xl bg-slate-900/50 border border-slate-800/80 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
              {currentRole === 'creator' ? 'AK' : 'AD'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate">
                {currentRole === 'creator' ? 'Ayesha Khan' : 'Security Admin'}
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                {currentRole === 'creator' ? 'Verified Tier 1 Partner' : 'Fraud Audit Authority'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 p-3 space-y-1.5 overflow-y-auto">
          {currentRole === 'admin' ? (
            <>
              <div className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Admin Governance
              </div>

              <button
                onClick={() => handleNav(() => setAdminTab('overview'))}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  adminTab === 'overview'
                    ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <LayoutDashboard className="w-4 h-4 text-blue-400" />
                  <span>Overview Dashboard</span>
                </div>
              </button>

              <button
                onClick={() => handleNav(() => setAdminTab('verification'))}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  adminTab === 'verification'
                    ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <BadgeCheck className="w-4 h-4 text-amber-400" />
                  <span>Verification Center</span>
                </div>
                {flaggedCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {flaggedCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => handleNav(() => setAdminTab('payouts'))}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  adminTab === 'payouts'
                    ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                  <span>Payment Management</span>
                </div>
                {pendingPayoutCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {pendingPayoutCount}
                  </span>
                )}
              </button>
            </>
          ) : (
            <>
              <div className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Creator Portal
              </div>

              <div className="px-3 py-2.5 rounded-xl bg-blue-600/20 text-blue-300 border border-blue-500/30 flex items-center gap-2.5 text-xs font-semibold">
                <Send className="w-4 h-4 text-blue-400" />
                <span>Submit & Analyze Post</span>
              </div>

              <div className="p-3 mt-4 rounded-xl bg-slate-900/50 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs font-medium text-slate-300">
                  <span>Contract Rate</span>
                  <span className="font-bold text-white">$2.50 / 1k</span>
                </div>
                <div className="flex items-center justify-between text-xs font-medium text-slate-300">
                  <span>Account Status</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs font-medium text-slate-300">
                  <span>Fraud Shield</span>
                  <span className="text-[10px] text-blue-400 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Auto-Audit
                  </span>
                </div>
              </div>
            </>
          )}

          {/* Global Rule Summary quick card */}
          <div className="pt-4">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] space-y-1.5">
              <span className="text-slate-400 font-semibold block flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-cyan-400" /> Fraud Guard active
              </span>
              <ul className="text-slate-400 space-y-1 text-[10px] list-disc list-inside">
                <li>Max ER cap: 35%</li>
                <li>Likes/Views cap: 40%</li>
                <li>Comment Pod cap: 50%</li>
                <li>Ghost Views floor: 0.2%</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Global Status Banner & Controls */}
        <div className="p-4 border-t border-slate-800/80 space-y-2.5">
          <div
            className={`p-3 rounded-xl border flex flex-col gap-2 ${
              useLiveApi
                ? 'bg-blue-950/40 border-blue-500/30 text-blue-300'
                : 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold">
                {useLiveApi ? (
                  <>
                    <Globe2 className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
                    <span>Mode: Live API</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Mode: Instant Mock</span>
                  </>
                )}
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-black/40 font-mono font-bold">
                {useLiveApi ? 'CORS DIRECT' : 'OFFLINE DEMO'}
              </span>
            </div>
          </div>

          {/* Mode-specific Data Management button */}
          {useLiveApi ? (
            <button
              onClick={() => handleNav(clearLiveData)}
              className="w-full py-2.5 sm:py-2 px-3 rounded-xl text-xs font-semibold text-red-400 hover:text-white hover:bg-red-950/80 border border-red-500/30 flex items-center justify-center gap-2 transition-colors shadow-sm"
              title="Remove all live submission records from database"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-400" />
              <span>Clear Live Data ({videos.length})</span>
            </button>
          ) : (
            <button
              onClick={() => handleNav(resetToMockData)}
              className="w-full py-2.5 sm:py-2 px-3 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/80 border border-slate-800 flex items-center justify-center gap-2 transition-colors"
              title="Reset database to initial 5 mock test cases"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>Reset Sample Records</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
