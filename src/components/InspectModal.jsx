import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PLATFORMS } from '../constants/initialData';
import { 
  X, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  ExternalLink, 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Share2, 
  Eye, 
  CheckCircle2, 
  XCircle, 
  DollarSign, 
  Clock, 
  Sliders, 
  History,
  AlertOctagon
} from 'lucide-react';

export function InspectModal() {
  const { 
    inspectVideoId, 
    setInspectVideoId, 
    inspectedVideo, 
    overrideVideoStatus, 
    updatePaymentStatus,
    currentRole 
  } = useApp();

  const [overrideNote, setOverrideNote] = useState('');

  if (!inspectVideoId || !inspectedVideo) return null;

  const video = inspectedVideo;
  const platformConfig = PLATFORMS[video.platform] || PLATFORMS.instagram;

  // Ratios for visual gauges
  const likesToViews = video.views > 0 ? (video.likes / video.views) * 100 : 0;
  const commentsToLikes = video.likes > 0 ? (video.comments / video.likes) * 100 : 0;

  const handleAction = (status, paymentStatus, defaultNote) => {
    const note = overrideNote.trim() || defaultNote;
    overrideVideoStatus(video.id, status, paymentStatus, note);
    setOverrideNote('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0b1b2e] border border-slate-700/80 rounded-2xl w-full max-w-4xl max-h-[96vh] sm:max-h-[94vh] overflow-y-auto shadow-2xl flex flex-col text-slate-200">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800 flex items-start justify-between sticky top-0 bg-[#0b1b2e]/95 backdrop-blur z-20">
          <div className="flex items-start gap-3 sm:gap-4 min-w-0">
            <div
              className={`p-2.5 sm:p-3 rounded-xl border flex items-center justify-center text-xs sm:text-sm font-bold shrink-0 ${platformConfig.bgColor}`}
            >
              {platformConfig.name}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm sm:text-lg font-bold text-white leading-tight truncate max-w-[200px] sm:max-w-md">
                  {video.title || `Video ${video.videoId}`}
                </h3>
                <span
                  className={`text-[9px] sm:text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full border ${
                    video.status === 'Verified'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : video.status === 'Suspicious'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      : 'bg-red-500/20 text-red-300 border-red-500/30'
                  }`}
                >
                  {video.status}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-[11px] sm:text-xs text-slate-400 mt-1">
                <span>Creator: <strong className="text-slate-200">{video.creator}</strong></span>
                <span>•</span>
                <span>ID: <code className="text-slate-300 font-mono">{video.videoId}</code></span>
                <span>•</span>
                <a
                  href={video.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-400 hover:text-blue-300 inline-flex items-center gap-1"
                >
                  Post <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          <button
            onClick={() => setInspectVideoId(null)}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Top Risk Score & Payout Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Risk Score Dial Card */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-4">
              <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-800"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={
                      video.riskScore >= 70
                        ? 'text-red-500'
                        : video.riskScore >= 35
                        ? 'text-amber-500'
                        : 'text-emerald-500'
                    }
                    strokeDasharray={`${video.riskScore}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-base font-extrabold text-white leading-none">
                    {video.riskScore}
                  </span>
                  <span className="text-[9px] text-slate-400">/100</span>
                </div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Fraud Risk Rating
                </span>
                <h4
                  className={`text-sm font-bold mt-0.5 ${
                    video.riskScore >= 70
                      ? 'text-red-400'
                      : video.riskScore >= 35
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {video.riskLevel} Risk ({video.riskScore} pts)
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {video.riskScore >= 70
                    ? 'Automated bot activity threshold exceeded.'
                    : video.riskScore >= 35
                    ? 'Suspicious engagement anomalies flagged.'
                    : 'Within organic viral baselines.'}
                </p>
              </div>
            </div>

            {/* Engagement Rate (ER%) */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Engagement Rate (ER)
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-white">{video.er}%</span>
                <span className="text-xs text-slate-400">vs 3%–10% normal</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full mt-2.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    video.er > 35
                      ? 'bg-red-500'
                      : video.er < 0.2
                      ? 'bg-amber-500'
                      : 'bg-blue-500'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(5, (video.er / 45) * 100))}%` }}
                />
              </div>
              <div className="flex justify-between text-[9px] text-slate-500 mt-1 font-mono">
                <span>0.2% floor</span>
                <span>Normal: 3-10%</span>
                <span>35% ceiling</span>
              </div>
            </div>

            {/* Payout & Financial Status */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Financial Status
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-white">
                  ${video.calculatedPay ? video.calculatedPay.toFixed(2) : '0.00'}
                </span>
                <span className="text-xs text-slate-400">@ ${video.ratePer1k || 2.5}/1k CPM</span>
              </div>
              <div className="mt-2.5 flex items-center justify-between">
                <span className="text-xs text-slate-400">Payout Status:</span>
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    video.paymentStatus === 'Paid'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : video.paymentStatus === 'Pending'
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      : video.paymentStatus === 'On Hold'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-red-500/20 text-red-300 border border-red-500/30'
                  }`}
                >
                  {video.paymentStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Raw Metrics Cards */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
              Verified Interaction Statistics
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                  <Eye className="w-3.5 h-3.5 text-blue-400" /> Views
                </div>
                <p className="text-lg font-bold text-white font-mono">
                  {video.views?.toLocaleString()}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                  <Users className="w-3.5 h-3.5 text-pink-400" /> Likes
                </div>
                <p className="text-lg font-bold text-white font-mono">
                  {video.likes?.toLocaleString()}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5 font-mono">
                  {likesToViews.toFixed(1)}% of views
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                  <MessageSquare className="w-3.5 h-3.5 text-amber-400" /> Comments
                </div>
                <p className="text-lg font-bold text-white font-mono">
                  {video.comments?.toLocaleString()}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5 font-mono">
                  {commentsToLikes.toFixed(1)}% of likes
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                  <Share2 className="w-3.5 h-3.5 text-purple-400" /> Shares
                </div>
                <p className="text-lg font-bold text-white font-mono">
                  {(video.shares || 0)?.toLocaleString()}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5 font-mono">
                  {video.views > 0 ? (((video.shares || 0) / video.views) * 100).toFixed(2) : 0}% of views
                </p>
              </div>
            </div>
          </div>

          {/* Fraud Triggers Section */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between mb-3">
              <span className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-400" />
                Detected Fraud Triggers & Risk Assessment
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                {video.reasons?.length || 0} trigger(s) active
              </span>
            </h4>

            {video.reasons && video.reasons.length > 0 ? (
              <div className="space-y-2.5">
                {video.reasons.map((reason, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-red-950/30 border border-red-500/30 text-xs flex items-start gap-3"
                  >
                    <AlertOctagon className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold text-red-200">{reason}</p>
                      <p className="text-[10px] text-red-300/80 mt-0.5">
                        Violation flagged by Client-Side Fraud Rule Engine. Payout automatically blocked.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3.5 rounded-lg bg-emerald-950/20 border border-emerald-500/30 text-xs flex items-center gap-3 text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  No suspicious bot patterns detected. Video metrics conform to natural engagement distributions.
                </span>
              </div>
            )}
          </div>

          {/* Audit Trail Timeline */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-blue-400" />
              Verification & Audit Trail
            </h4>
            <div className="space-y-2">
              {video.auditLogs && video.auditLogs.length > 0 ? (
                video.auditLogs.map((log, index) => (
                  <div
                    key={index}
                    className="p-2.5 rounded-lg bg-slate-900/50 border border-slate-800 text-xs flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-slate-300">{log.event}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(log.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500">No previous audit logs.</p>
              )}
            </div>
          </div>

          {/* Admin Override Action Bar */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-blue-400" />
                Admin Audit Override Actions
              </label>
              <span className="text-[11px] text-slate-400">
                Authorized role: <strong className="text-white">{currentRole.toUpperCase()}</strong>
              </span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Optional audit override note (e.g., 'Audited creator analytics panel')"
                value={overrideNote}
                onChange={(e) => setOverrideNote(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 pt-1">
              <button
                onClick={() => handleAction('Verified', 'Pending', 'Admin manual verification')}
                className="py-2.5 px-3 rounded-xl text-xs font-bold bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 transition-all flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Mark Verified
              </button>

              <button
                onClick={() => handleAction('Suspicious', 'On Hold', 'Admin flagged suspicious spike')}
                className="py-2.5 px-3 rounded-xl text-xs font-bold bg-amber-600/20 hover:bg-amber-600 text-amber-300 hover:text-white border border-amber-500/30 transition-all flex items-center justify-center gap-1.5"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                Flag Suspicious
              </button>

              <button
                onClick={() => handleAction('Fake / Flagged', 'Rejected', 'Admin marked bot fraud')}
                className="py-2.5 px-3 rounded-xl text-xs font-bold bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/30 transition-all flex items-center justify-center gap-1.5"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                Mark Fake
              </button>

              <button
                onClick={() => handleAction(video.status, 'Rejected', 'Payout rejected by admin')}
                className="py-2.5 px-3 rounded-xl text-xs font-bold bg-slate-800 hover:bg-red-950 text-slate-300 hover:text-red-300 border border-slate-700 hover:border-red-500/40 transition-all flex items-center justify-center gap-1.5"
              >
                <XCircle className="w-3.5 h-3.5" />
                Reject Payout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

