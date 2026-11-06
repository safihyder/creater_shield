import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PLATFORMS } from '../../constants/initialData';
import { 
  BadgeCheck, 
  Search, 
  Filter, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  ExternalLink, 
  ArrowUpRight,
  SlidersHorizontal,
  RotateCcw
} from 'lucide-react';

export function VerificationCenter() {
  const { videos, setInspectVideoId, useLiveApi } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Filtered dataset
  const filteredVideos = videos.filter((v) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      v.creator?.toLowerCase().includes(q) ||
      v.videoId?.toLowerCase().includes(q) ||
      v.title?.toLowerCase().includes(q) ||
      v.platform?.toLowerCase().includes(q);

    const matchesPlatform = platformFilter === 'all' || v.platform === platformFilter;

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'verified' && v.status === 'Verified') ||
      (statusFilter === 'suspicious' && v.status === 'Suspicious') ||
      (statusFilter === 'flagged' && v.status === 'Fake / Flagged');

    return matchesSearch && matchesPlatform && matchesStatus;
  });

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Search & Filter Toolbar */}
      <div className="bg-[#0b1b2e] border border-slate-800 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search creator, ID, or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 sm:py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2.5">
          {/* Horizontally scrollable platform tabs on mobile */}
          <div className="flex items-center overflow-x-auto no-scrollbar p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs shrink-0 max-w-full">
            {['all', 'instagram', 'tiktok', 'youtube', 'x'].map((plat) => (
              <button
                key={plat}
                onClick={() => setPlatformFilter(plat)}
                className={`px-3 py-1.5 sm:py-1 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-all ${
                  platformFilter === plat
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/50'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {plat === 'all' ? 'All' : plat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {/* Status Dropdown */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 sm:flex-none px-3 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-xs font-semibold text-slate-300 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="verified">Verified Only</option>
              <option value="suspicious">Suspicious</option>
              <option value="flagged">Fake / Flagged</option>
            </select>

            {(searchQuery || platformFilter !== 'all' || statusFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setPlatformFilter('all');
                  setStatusFilter('all');
                }}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
                title="Reset Filters"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Ledger */}
      <div className="bg-[#0b1b2e] border border-slate-800 rounded-xl sm:rounded-2xl shadow-xl overflow-hidden">
        <div className="p-3.5 sm:p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BadgeCheck className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
            <h3 className="text-xs sm:text-sm font-bold text-white">
              Creator Verification & Fraud Audit Ledger
            </h3>
          </div>
          <span className="text-[10px] sm:text-xs text-slate-400 font-mono">
            {filteredVideos.length} record{filteredVideos.length !== 1 ? 's' : ''}
          </span>
        </div>

        {filteredVideos.length === 0 ? (
          <div className="py-12 px-4 text-center text-slate-400">
            <div className="flex flex-col items-center justify-center max-w-md mx-auto">
              <p className="font-bold text-white text-xs">
                {useLiveApi ? 'Clean Live Database Active' : 'No Videos Found'}
              </p>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                {useLiveApi
                  ? 'All mock data has been removed for live operations. Submit real post URLs via the Creator View to audit metrics.'
                  : 'No videos match your active filter criteria. Try clearing search filters or reset sample records.'}
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Mobile Cards (Visible only on < md screens) */}
            <div className="md:hidden p-3 space-y-3">
              {filteredVideos.map((video) => {
                const plat = PLATFORMS[video.platform] || PLATFORMS.instagram;
                const isVerified = video.status === 'Verified';
                const isSuspicious = video.status === 'Suspicious';
                const isFake = video.status === 'Fake / Flagged';

                return (
                  <div
                    key={video.id}
                    onClick={() => setInspectVideoId(video.id)}
                    className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3 cursor-pointer active:scale-[0.99] transition-transform"
                  >
                    {/* Top: Creator + Platform */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="font-bold text-white text-xs truncate">
                            {video.creator}
                          </span>
                          <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase ${plat.bgColor}`}>
                            {plat.name}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate">
                          {video.title || video.videoId}
                        </p>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase shrink-0 border ${
                          isVerified
                            ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                            : isSuspicious
                            ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                            : 'bg-red-500/10 text-red-300 border-red-500/30'
                        }`}
                      >
                        {isVerified && <ShieldCheck className="w-3 h-3 text-emerald-400" />}
                        {isSuspicious && <AlertTriangle className="w-3 h-3 text-amber-400" />}
                        {isFake && <ShieldAlert className="w-3 h-3 text-red-400" />}
                        {video.status}
                      </span>
                    </div>

                    {/* Middle: Metrics grid */}
                    <div className="grid grid-cols-4 gap-1.5 p-2 rounded-lg bg-slate-950/60 border border-slate-850 text-center font-mono">
                      <div>
                        <span className="text-[8px] text-slate-500 block uppercase">Views</span>
                        <span className="text-[11px] font-bold text-white">
                          {video.views >= 1000 ? `${(video.views / 1000).toFixed(0)}k` : video.views}
                        </span>
                      </div>
                      <div>
                        <span className="text-[8px] text-slate-500 block uppercase">Likes</span>
                        <span className="text-[11px] font-bold text-white">
                          {video.likes >= 1000 ? `${(video.likes / 1000).toFixed(1)}k` : video.likes}
                        </span>
                      </div>
                      <div>
                        <span className="text-[8px] text-slate-500 block uppercase">ER (%)</span>
                        <span className={`text-[11px] font-bold ${
                          video.er > 35 ? 'text-red-400' : video.er < 0.2 ? 'text-amber-400' : 'text-emerald-400'
                        }`}>
                          {video.er}%
                        </span>
                      </div>
                      <div>
                        <span className="text-[8px] text-slate-500 block uppercase">Risk</span>
                        <span className={`text-[11px] font-bold ${
                          video.riskScore >= 70 ? 'text-red-400' : video.riskScore >= 35 ? 'text-amber-400' : 'text-emerald-400'
                        }`}>
                          {video.riskScore}
                        </span>
                      </div>
                    </div>

                    {/* Bottom: Payout & Inspect Button */}
                    <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-850">
                      <div>
                        <span className="text-[10px] text-slate-400">Pay: </span>
                        <strong className="text-white font-mono">
                          ${video.calculatedPay ? video.calculatedPay.toFixed(2) : '0.00'}
                        </strong>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setInspectVideoId(video.id);
                        }}
                        className="px-3 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 text-[11px] font-semibold inline-flex items-center gap-1"
                      >
                        <span>Audit Video</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop Table Layout (Visible on md+ screens) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800/80 bg-slate-900/60 text-slate-400 uppercase tracking-wider text-[10px] font-bold">
                    <th className="py-3 px-4">Creator & Post</th>
                    <th className="py-3 px-4">Platform</th>
                    <th className="py-3 px-4">Views</th>
                    <th className="py-3 px-4">Interactions</th>
                    <th className="py-3 px-4">ER (%)</th>
                    <th className="py-3 px-4">Risk Score</th>
                    <th className="py-3 px-4">Fraud Status</th>
                    <th className="py-3 px-4">Payout</th>
                    <th className="py-3 px-4 text-right">Audit Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {filteredVideos.map((video) => {
                    const plat = PLATFORMS[video.platform] || PLATFORMS.instagram;
                    const isVerified = video.status === 'Verified';
                    const isSuspicious = video.status === 'Suspicious';
                    const isFake = video.status === 'Fake / Flagged';

                    return (
                      <tr
                        key={video.id}
                        onClick={() => setInspectVideoId(video.id)}
                        className="hover:bg-slate-800/50 transition-colors group cursor-pointer"
                      >
                        <td className="py-3.5 px-4">
                          <div>
                            <p className="font-bold text-white group-hover:text-blue-400 transition-colors">
                              {video.creator}
                            </p>
                            <p className="text-[11px] text-slate-400 truncate max-w-[200px]">
                              {video.title || video.videoId}
                            </p>
                            <span className="text-[9px] text-slate-500 font-mono">
                              ID: {video.videoId}
                            </span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${plat.bgColor}`}
                          >
                            {plat.name}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 font-mono font-bold text-white">
                          {video.views?.toLocaleString()}
                        </td>

                        <td className="py-3.5 px-4 font-mono text-slate-300">
                          <div className="space-y-0.5">
                            <span className="block text-[11px]">
                              {video.likes?.toLocaleString()} likes
                            </span>
                            <span className="block text-[10px] text-slate-500">
                              {video.comments?.toLocaleString()} comments
                            </span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-mono">
                          <span
                            className={`font-bold ${
                              video.er > 35
                                ? 'text-red-400'
                                : video.er < 0.2
                                ? 'text-amber-400'
                                : 'text-emerald-400'
                            }`}
                          >
                            {video.er}%
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-12 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  video.riskScore >= 70
                                    ? 'bg-red-500'
                                    : video.riskScore >= 35
                                    ? 'bg-amber-500'
                                    : 'bg-emerald-500'
                                }`}
                                style={{ width: `${Math.min(100, Math.max(5, video.riskScore))}%` }}
                              />
                            </div>
                            <span
                              className={`font-mono font-bold text-xs ${
                                video.riskScore >= 70
                                  ? 'text-red-400'
                                  : video.riskScore >= 35
                                  ? 'text-amber-400'
                                  : 'text-emerald-400'
                              }`}
                            >
                              {video.riskScore}
                            </span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                              isVerified
                                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                                : isSuspicious
                                ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                                : 'bg-red-500/10 text-red-300 border-red-500/30'
                            }`}
                          >
                            {isVerified && <ShieldCheck className="w-3 h-3 text-emerald-400" />}
                            {isSuspicious && <AlertTriangle className="w-3 h-3 text-amber-400" />}
                            {isFake && <ShieldAlert className="w-3 h-3 text-red-400" />}
                            {video.status}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 font-mono font-bold text-white">
                          <div>
                            <span>${video.calculatedPay ? video.calculatedPay.toFixed(2) : '0.00'}</span>
                            <span className="block text-[9px] text-slate-500 uppercase">
                              {video.paymentStatus}
                            </span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setInspectVideoId(video.id);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 transition-all font-semibold inline-flex items-center gap-1.5 shadow-sm"
                          >
                            <span>Inspect</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
