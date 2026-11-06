import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  FileCheck2, 
  Eye, 
  CheckCircle2, 
  ShieldAlert, 
  DollarSign, 
  TrendingUp,
  Clock
} from 'lucide-react';

export function CreatorKPICards() {
  const { videos } = useApp();

  // Filter for creator Ayesha Khan
  const creatorVideos = videos.filter((v) => v.creator === 'Ayesha Khan');

  const totalSubmitted = creatorVideos.length;
  const totalViews = creatorVideos.reduce((acc, curr) => acc + (curr.views || 0), 0);
  const verifiedCount = creatorVideos.filter((v) => v.status === 'Verified').length;
  const flaggedCount = creatorVideos.filter(
    (v) => v.status === 'Suspicious' || v.status === 'Fake / Flagged'
  ).length;

  const totalEarnings = creatorVideos
    .filter((v) => v.status === 'Verified')
    .reduce((acc, curr) => acc + (curr.calculatedPay || 0), 0);

  const paidEarnings = creatorVideos
    .filter((v) => v.paymentStatus === 'Paid')
    .reduce((acc, curr) => acc + (curr.calculatedPay || 0), 0);

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5 sm:gap-3.5">
      {/* 1. Total Submitted */}
      <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[#0b1b2e] border border-slate-800/80 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all">
        <div className="flex items-center justify-between text-slate-400 mb-1.5 sm:mb-2">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">Submitted</span>
          <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-blue-500/10 text-blue-400">
            <FileCheck2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>
        <p className="text-xl sm:text-2xl font-black text-white">{totalSubmitted}</p>
        <p className="text-[9px] sm:text-[10px] text-slate-400 mt-0.5 truncate">Across platforms</p>
      </div>

      {/* 2. Total Views */}
      <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[#0b1b2e] border border-slate-800/80 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all">
        <div className="flex items-center justify-between text-slate-400 mb-1.5 sm:mb-2">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">Total Views</span>
          <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-purple-500/10 text-purple-400">
            <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>
        <p className="text-xl sm:text-2xl font-black text-white font-mono truncate">
          {totalViews >= 1000000
            ? `${(totalViews / 1000000).toFixed(1)}M`
            : totalViews >= 1000
            ? `${(totalViews / 1000).toFixed(1)}k`
            : totalViews}
        </p>
        <p className="text-[9px] sm:text-[10px] text-slate-400 mt-0.5 truncate">Audited volume</p>
      </div>

      {/* 3. Verified Posts */}
      <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[#0b1b2e] border border-slate-800/80 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all">
        <div className="flex items-center justify-between text-slate-400 mb-1.5 sm:mb-2">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">Verified</span>
          <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>
        <p className="text-xl sm:text-2xl font-black text-emerald-400">{verifiedCount}</p>
        <p className="text-[9px] sm:text-[10px] text-emerald-400/80 mt-0.5 truncate">Passed bot check</p>
      </div>

      {/* 4. Flagged / Held */}
      <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[#0b1b2e] border border-slate-800/80 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all">
        <div className="flex items-center justify-between text-slate-400 mb-1.5 sm:mb-2">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">Flagged</span>
          <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-red-500/10 text-red-400">
            <ShieldAlert className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>
        <p className="text-xl sm:text-2xl font-black text-red-400">{flaggedCount}</p>
        <p className="text-[9px] sm:text-[10px] text-red-400/80 mt-0.5 truncate">Held anomaly</p>
      </div>

      {/* 5. Total Earnings */}
      <div className="col-span-2 md:col-span-1 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-950/60 to-slate-900 border border-blue-500/30 shadow-lg relative overflow-hidden">
        <div className="flex items-center justify-between text-blue-300 mb-1.5 sm:mb-2">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider">Total Earnings</span>
          <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-blue-500/20 text-blue-400">
            <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>
        <p className="text-xl sm:text-2xl font-black text-white font-mono">
          ${totalEarnings.toFixed(2)}
        </p>
        <div className="flex items-center justify-between text-[9px] sm:text-[10px] text-slate-400 mt-0.5">
          <span>Paid: ${paidEarnings.toFixed(2)}</span>
          <span className="text-blue-300 font-semibold">
            Pending: ${(totalEarnings - paidEarnings).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
