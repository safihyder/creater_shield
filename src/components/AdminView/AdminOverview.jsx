import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, 
  Eye, 
  ShieldAlert, 
  DollarSign, 
  ShieldCheck, 
  TrendingUp, 
  AlertTriangle,
  ArrowUpRight,
  PieChart as PieIcon,
  Activity,
  Globe2,
  Send
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  BarChart, 
  Bar, 
  Cell, 
  Legend 
} from 'recharts';

export function AdminOverview() {
  const { videos, setAdminTab, setInspectVideoId, useLiveApi, setCurrentRole } = useApp();

  // Platform-wide calculations
  const totalSubmissions = videos.length;
  const verifiedVideos = videos.filter((v) => v.status === 'Verified');
  const flaggedVideos = videos.filter(
    (v) => v.status === 'Suspicious' || v.status === 'Fake / Flagged'
  );

  const totalViews = videos.reduce((sum, v) => sum + (v.views || 0), 0);
  const verifiedViews = verifiedVideos.reduce((sum, v) => sum + (v.views || 0), 0);
  const flaggedViews = flaggedVideos.reduce((sum, v) => sum + (v.views || 0), 0);

  const fraudRate = totalSubmissions > 0 
    ? Number(((flaggedVideos.length / totalSubmissions) * 100).toFixed(1)) 
    : 0;

  const totalPayout = verifiedVideos.reduce((sum, v) => sum + (v.calculatedPay || 0), 0);

  // Fraud loss prevented: estimate payout that would have been paid if bot views weren't blocked
  const fraudPrevented = flaggedVideos.reduce((sum, v) => {
    return sum + Number(((v.views / 1000) * (v.ratePer1k || 2.5)).toFixed(2));
  }, 0);

  // Dynamic progression timeline data
  let progressionData = [];
  if (totalSubmissions > 0) {
    if (!useLiveApi) {
      // Mock mode reference progression
      progressionData = [
        { day: 'Mon', organicViews: 42000, flaggedViews: 8500 },
        { day: 'Tue', organicViews: 65000, flaggedViews: 12000 },
        { day: 'Wed', organicViews: 89000, flaggedViews: 22000 },
        { day: 'Thu', organicViews: 115000, flaggedViews: 48000 },
        { day: 'Fri', organicViews: Math.floor(verifiedViews * 0.7), flaggedViews: flaggedViews > 0 ? flaggedViews : 20000 },
        { day: 'Sat', organicViews: verifiedViews, flaggedViews: flaggedViews },
      ];
    } else {
      // Live mode data points
      progressionData = [
        { day: 'Prior', organicViews: 0, flaggedViews: 0 },
        { day: 'Current Live', organicViews: verifiedViews, flaggedViews: flaggedViews },
      ];
    }
  }

  // Platform breakdown data
  const platformStats = ['instagram', 'tiktok', 'youtube', 'x'].map((platKey) => {
    const list = videos.filter((v) => v.platform === platKey);
    const count = list.length;
    const flagged = list.filter((v) => v.status !== 'Verified').length;
    const views = list.reduce((acc, v) => acc + (v.views || 0), 0);
    return {
      platform: platKey.toUpperCase(),
      submissions: count, 
      flagged,
      views,
    };
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Top Admin KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5 sm:gap-3.5">
        {/* Total Submissions */}
        <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[#0b1b2e] border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-1.5 sm:mb-2">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">Submissions</span>
            <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-blue-500/10 text-blue-400">
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-white">{totalSubmissions}</p>
          <p className="text-[9px] sm:text-[10px] text-slate-400 mt-0.5 truncate">
            {useLiveApi ? 'Live verified' : 'Across 4 platforms'}
          </p>
        </div>

        {/* Verified Organic Views */}
        <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[#0b1b2e] border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-1.5 sm:mb-2">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">Verified Views</span>
            <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
            {verifiedViews >= 1000000
              ? `${(verifiedViews / 1000000).toFixed(2)}M`
              : `${(verifiedViews / 1000).toFixed(1)}k`}
          </p>
          <p className="text-[9px] sm:text-[10px] text-slate-400 mt-0.5 truncate">
            {totalViews > 0 ? ((verifiedViews / totalViews) * 100).toFixed(1) : 0}% of gross
          </p>
        </div>

        {/* Fraud Rate */}
        <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[#0b1b2e] border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-1.5 sm:mb-2">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">Fraud Rate</span>
            <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-red-500/10 text-red-400">
              <ShieldAlert className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-red-400 font-mono">{fraudRate}%</p>
          <p className="text-[9px] sm:text-[10px] text-red-400/80 mt-0.5 truncate">{flaggedVideos.length} flagged</p>
        </div>

        {/* Payout Pool */}
        <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[#0b1b2e] border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-1.5 sm:mb-2">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">Payout Pool</span>
            <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-blue-500/10 text-blue-400">
              <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-white font-mono">${totalPayout.toFixed(2)}</p>
          <p className="text-[9px] sm:text-[10px] text-slate-400 mt-0.5 truncate">Pending & settled</p>
        </div>

        {/* Fraud Dollars Blocked */}
        <div className="col-span-2 md:col-span-1 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-red-950/40 to-slate-900 border border-red-500/30 shadow-lg">
          <div className="flex items-center justify-between text-red-300 mb-1.5 sm:mb-2">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">Fraud Prevented</span>
            <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-red-500/20 text-red-400">
              <ShieldAlert className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-red-400 font-mono">
            ${fraudPrevented.toFixed(2)}
          </p>
          <p className="text-[9px] sm:text-[10px] text-slate-400 mt-0.5 truncate">Saved from bots</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Progression Chart (2 Cols) */}
        <div className="lg:col-span-2 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-[#0b1b2e] border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                Campaign Views Progression (Organic vs. Bot Anomalies)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {useLiveApi ? 'Real-time live traffic volume audited directly from platform APIs' : 'Daily traffic volume audited by client-side fraud heuristics'}
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-1 rounded bg-slate-900 text-slate-400 border border-slate-800">
              {useLiveApi ? 'Live Environment' : 'Rolling 7-Day Window'}
            </span>
          </div>

          {totalSubmissions === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 bg-slate-900/40 rounded-xl border border-dashed border-slate-800">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3">
                <Globe2 className="w-6 h-6 animate-pulse" />
              </div>
              <h4 className="text-sm font-bold text-white">Clean Live Environment Active</h4>
              <p className="text-xs text-slate-400 max-w-md mt-1.5 leading-relaxed">
                All mock data has been removed for live operations. Switch to the Creator View to submit real post URLs from YouTube, TikTok, Instagram, or X.
              </p>
              <button
                onClick={() => setCurrentRole('creator')}
                className="mt-4 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-blue-600/30"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Live Video</span>
              </button>
            </div>
          ) : (
            <div className="h-56 sm:h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={progressionData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="organicGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="flaggedGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="day" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={10} tickFormatter={(v) => `${v / 1000}k`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '0.75rem',
                      fontSize: '11px',
                      color: '#f8fafc',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                  <Area
                    type="monotone"
                    dataKey="organicViews"
                    name="Verified Organic Views"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#organicGrad)"
                  />
                  <Area
                    type="monotone"
                    dataKey="flaggedViews"
                    name="Flagged Bot Views"
                    stroke="#ef4444"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#flaggedGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Platform Risk Breakdown (1 Col) */}
        <div className="p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-[#0b1b2e] border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <PieIcon className="w-4 h-4 text-cyan-400" />
                  Platform Risk Distribution
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Submissions & flag count by network
                </p>
              </div>
            </div>

            {totalSubmissions === 0 ? (
              <div className="h-44 sm:h-52 flex flex-col items-center justify-center text-center p-4 bg-slate-900/40 rounded-xl border border-dashed border-slate-800">
                <p className="text-xs text-slate-400 font-medium">Zero submissions in live database.</p>
                <p className="text-[11px] text-slate-500 mt-1">Platform metrics will appear here on submission.</p>
              </div>
            ) : (
              <div className="h-44 sm:h-52 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={platformStats} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="platform" stroke="#64748b" fontSize={10} />
                    <YAxis stroke="#64748b" fontSize={10} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: '0.5rem',
                        fontSize: '11px',
                      }}
                    />
                    <Bar dataKey="submissions" name="Total Submissions" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="flagged" name="Flagged Fraud" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-xs text-slate-400">Auditing anomalous items?</span>
            <button
              onClick={() => setAdminTab('verification')}
              className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              Verification Center <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Flagged Alerts Banner */}
      {flaggedVideos.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-200">
                {flaggedVideos.length} Posts Require Manual Review
              </h4>
              <p className="text-xs text-amber-300/80">
                Anomalies detected: Bot package ratios and ghost view farms placed on hold.
              </p>
            </div>
          </div>
          <button
            onClick={() => setAdminTab('verification')}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all shrink-0 shadow-lg shadow-amber-500/20"
          >
            Review Flagged Queue
          </button>
        </div>
      )}
    </div>
  );
}
