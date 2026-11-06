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
    // Search
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      v.creator?.toLowerCase().includes(q) ||
      v.videoId?.toLowerCase().includes(q) ||
      v.title?.toLowerCase().includes(q) ||
      v.platform?.toLowerCase().includes(q);

    // Platform
    const matchesPlatform = platformFilter === 'all' || v.platform === platformFilter;

    // Status
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'verified' && v.status === 'Verified') ||
      (statusFilter === 'suspicious' && v.status === 'Suspicious') ||
      (statusFilter === 'flagged' && v.status === 'Fake / Flagged');

    return matchesSearch && matchesPlatform && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      <div className="bg-[#0b1b2e] border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search creator, video ID, or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Platform Pills */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            {['all', 'instagram', 'tiktok', 'youtube', 'x'].map((plat) => (
              <button
                key={plat}
                onClick={() => setPlatformFilter(plat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                  platformFilter === plat
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/50'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {plat === 'all' ? 'All Platforms' : plat}
              </button>
            ))}
          </div>

          {/* Status Dropdown */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-xs font-semibold text-slate-300 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="verified">Verified Only</option>
              <option value="suspicious">Suspicious (On Hold)</option>
              <option value="flagged">Fake / Flagged</option>
            </select>
          </div>

          {(searchQuery || platformFilter !== 'all' || statusFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setPlatformFilter('all');
                setStatusFilter('all');
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Reset Filters"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Data Table */}
      <div className="bg-[#0b1b2e] border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BadgeCheck className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-bold text-white">
              Creator Verification & Fraud Audit Ledger
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {filteredVideos.length} record{filteredVideos.length !== 1 ? 's' : ''} found
          </span>
        </div>

        <div className="overflow-x-auto">
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
              {filteredVideos.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-slate-400">
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
                  </td>
                </tr>
              ) : (
                filteredVideos.map((video) => {
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
                      {/* Creator & Post */}
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

                      {/* Platform */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${plat.bgColor}`}
                        >
                          {plat.name}
                        </span>
                      </td>

                      {/* Views */}
                      <td className="py-3.5 px-4 font-mono font-bold text-white">
                        {video.views?.toLocaleString()}
                      </td>

                      {/* Interactions */}
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

                      {/* ER% */}
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

                      {/* Risk Score */}
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

                      {/* Fraud Status */}
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

                      {/* Calculated Payout */}
                      <td className="py-3.5 px-4 font-mono font-bold text-white">
                        <div>
                          <span>${video.calculatedPay ? video.calculatedPay.toFixed(2) : '0.00'}</span>
                          <span className="block text-[9px] text-slate-500 uppercase">
                            {video.paymentStatus}
                          </span>
                        </div>
                      </td>

                      {/* Action */}
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
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
