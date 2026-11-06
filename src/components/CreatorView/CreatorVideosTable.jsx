import React from 'react';
import { useApp } from '../../context/AppContext';
import { PLATFORMS } from '../../constants/initialData';
import { 
  Eye, 
  ExternalLink, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  ArrowUpRight,
  FileSpreadsheet,
  Users,
  DollarSign
} from 'lucide-react';

export function CreatorVideosTable() {
  const { videos, setInspectVideoId, useLiveApi } = useApp();

  // Filter for logged-in creator
  const creatorVideos = videos.filter((v) => v.creator === 'Ayesha Khan');

  return (
    <div id="my-videos-section" className="bg-[#0b1b2e] border border-slate-800 rounded-xl sm:rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-blue-400" />
            <span>My Submitted Posts & Verification History</span>
          </h3>
          <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5">
            Real-time fraud audit logs and CPM settlement breakdown
          </p>
        </div>

        <div className="text-[11px] text-slate-400 font-mono shrink-0">
          {creatorVideos.length} post{creatorVideos.length !== 1 ? 's' : ''}
        </div>
      </div>

      {creatorVideos.length === 0 ? (
        <div className="py-12 px-4 text-center text-slate-400">
          <div className="flex flex-col items-center justify-center max-w-md mx-auto">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center mb-2">
              <Eye className="w-5 h-5" />
            </div>
            <p className="font-bold text-white text-xs">
              {useLiveApi ? 'Clean Live Database Active' : 'No Submissions Found'}
            </p>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              {useLiveApi
                ? 'All mock records have been removed. Submit any live public YouTube, TikTok, Instagram, or X post URL above to fetch real statistics.'
                : 'No submissions in current view. Click "Reset Sample Records" in the sidebar to reload demo test cases.'}
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Mobile Card Layout (Visible only on < md screens) */}
          <div className="md:hidden p-3 space-y-3">
            {creatorVideos.map((video) => {
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
                  {/* Card Top: Platform + Title + Status */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${plat.bgColor}`}>
                          {plat.name}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono truncate">
                          ID: {video.videoId}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-white truncate">
                        {video.title || video.videoId}
                      </h4>
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

                  {/* Card Middle: 3 Quick Metric Pills */}
                  <div className="grid grid-cols-3 gap-2 p-2 rounded-lg bg-slate-950/60 border border-slate-850 text-center font-mono">
                    <div>
                      <span className="text-[9px] text-slate-500 block uppercase">Views</span>
                      <span className="text-xs font-bold text-white">
                        {video.views >= 1000 ? `${(video.views / 1000).toFixed(1)}k` : video.views}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 block uppercase">ER (%)</span>
                      <span className={`text-xs font-bold ${
                        video.er > 35 ? 'text-red-400' : video.er < 0.2 ? 'text-amber-400' : 'text-emerald-400'
                      }`}>
                        {video.er}%
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 block uppercase">Payout</span>
                      <span className="text-xs font-bold text-white">
                        ${video.calculatedPay ? video.calculatedPay.toFixed(2) : '0.00'}
                      </span>
                    </div>
                  </div>

                  {/* Card Bottom: Payment status + Tap to Inspect */}
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-850">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        video.paymentStatus === 'Paid'
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                          : video.paymentStatus === 'Pending'
                          ? 'bg-blue-950/60 text-blue-400 border border-blue-500/30'
                          : video.paymentStatus === 'On Hold'
                          ? 'bg-amber-950/60 text-amber-400 border border-amber-500/30'
                          : 'bg-red-950/60 text-red-400 border border-red-500/30'
                      }`}
                    >
                      Payment: {video.paymentStatus}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setInspectVideoId(video.id);
                      }}
                      className="text-blue-400 hover:text-blue-300 font-bold text-[11px] inline-flex items-center gap-1"
                    >
                      <span>Audit Breakdown</span>
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
                <tr className="border-b border-slate-800/80 bg-slate-900/50 text-slate-400 uppercase tracking-wider text-[10px] font-bold">
                  <th className="py-3 px-4">Platform & Post</th>
                  <th className="py-3 px-4">Views</th>
                  <th className="py-3 px-4">Likes & Comments</th>
                  <th className="py-3 px-4">ER (%)</th>
                  <th className="py-3 px-4">Fraud Status</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Calculated Pay</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {creatorVideos.map((video) => {
                  const plat = PLATFORMS[video.platform] || PLATFORMS.instagram;
                  const isVerified = video.status === 'Verified';
                  const isSuspicious = video.status === 'Suspicious';
                  const isFake = video.status === 'Fake / Flagged';

                  return (
                    <tr
                      key={video.id}
                      className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                      onClick={() => setInspectVideoId(video.id)}
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 ${plat.bgColor}`}
                          >
                            {plat.name}
                          </span>
                          <div className="min-w-0 max-w-[200px]">
                            <p className="font-semibold text-white truncate text-xs">
                              {video.title || video.videoId}
                            </p>
                            <p className="text-[10px] text-slate-500 font-mono truncate">
                              ID: {video.videoId}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-semibold text-white">
                        {video.views?.toLocaleString()}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-300">
                        <div>
                          <span>{video.likes?.toLocaleString()} likes</span>
                          <span className="text-slate-500 text-[10px] block">
                            {video.comments?.toLocaleString()} comments
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`font-mono font-bold ${
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

                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                            video.paymentStatus === 'Paid'
                              ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                              : video.paymentStatus === 'Pending'
                              ? 'bg-blue-950/60 text-blue-400 border border-blue-500/30'
                              : video.paymentStatus === 'On Hold'
                              ? 'bg-amber-950/60 text-amber-400 border border-amber-500/30'
                              : 'bg-red-950/60 text-red-400 border border-red-500/30'
                          }`}
                        >
                          {video.paymentStatus}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-white">
                        ${video.calculatedPay ? video.calculatedPay.toFixed(2) : '0.00'}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setInspectVideoId(video.id);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white transition-all text-[11px] font-semibold inline-flex items-center gap-1"
                        >
                          <span>Audit</span>
                          <ArrowUpRight className="w-3 h-3" />
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
  );
}
