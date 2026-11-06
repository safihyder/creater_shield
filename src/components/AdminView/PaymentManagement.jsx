import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PLATFORMS } from '../../constants/initialData';
import { 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  XCircle, 
  DollarSign, 
  Sparkles, 
  ArrowUpRight,
  ShieldCheck,
  CheckCheck
} from 'lucide-react';

export function PaymentManagement() {
  const { videos, updatePaymentStatus, batchApprovePayments, setInspectVideoId, useLiveApi } = useApp();

  const [paymentFilter, setPaymentFilter] = useState('all');

  // Payout aggregations
  const totalPaid = videos
    .filter((v) => v.paymentStatus === 'Paid')
    .reduce((sum, v) => sum + (v.calculatedPay || 0), 0);

  const totalPending = videos
    .filter((v) => v.paymentStatus === 'Pending')
    .reduce((sum, v) => sum + (v.calculatedPay || 0), 0);

  const totalOnHold = videos
    .filter((v) => v.paymentStatus === 'On Hold')
    .reduce((sum, v) => {
      return sum + Number(((v.views / 1000) * (v.ratePer1k || 2.5)).toFixed(2));
    }, 0);

  const totalRejectedSaved = videos
    .filter((v) => v.paymentStatus === 'Rejected')
    .reduce((sum, v) => {
      return sum + Number(((v.views / 1000) * (v.ratePer1k || 2.5)).toFixed(2));
    }, 0);

  const pendingVideos = videos.filter((v) => v.status === 'Verified' && v.paymentStatus === 'Pending');

  // Filtered list
  const filteredList = videos.filter((v) => {
    if (paymentFilter === 'all') return true;
    return v.paymentStatus?.toLowerCase() === paymentFilter.toLowerCase();
  });

  return (
    <div className="space-y-6">
      {/* 4 Financial Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Paid */}
        <div className="p-4 rounded-2xl bg-[#0b1b2e] border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-emerald-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Settled & Paid</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white font-mono">${totalPaid.toFixed(2)}</p>
          <p className="text-[10px] text-slate-400 mt-1">Disbursed to creators</p>
        </div>

        {/* Pending Approval */}
        <div className="p-4 rounded-2xl bg-[#0b1b2e] border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-blue-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Pending Clearance</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-white font-mono">${totalPending.toFixed(2)}</p>
          <p className="text-[10px] text-slate-400 mt-1">{pendingVideos.length} verified payouts awaiting</p>
        </div>

        {/* On Hold */}
        <div className="p-4 rounded-2xl bg-[#0b1b2e] border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-amber-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Held in Escrow</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-400 font-mono">${totalOnHold.toFixed(2)}</p>
          <p className="text-[10px] text-slate-400 mt-1">Under fraud investigation</p>
        </div>

        {/* Blocked Fraud */}
        <div className="p-4 rounded-2xl bg-[#0b1b2e] border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-red-400 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Rejected & Saved</span>
            <div className="p-2 rounded-xl bg-red-500/10 text-red-400">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-red-400 font-mono">${totalRejectedSaved.toFixed(2)}</p>
          <p className="text-[10px] text-slate-400 mt-1">Bot packages prevented</p>
        </div>
      </div>

      {/* Batch Actions Bar */}
      <div className="bg-[#0b1b2e] border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Payout Clearinghouse Pipeline</h4>
            <p className="text-xs text-slate-400">
              Formula: <code className="text-blue-300 font-mono font-bold">(Verified Views / 1000) × CPM</code>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Status filter tabs */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            {['all', 'pending', 'paid', 'on hold', 'rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setPaymentFilter(status)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                  paymentFilter === status
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Batch Approve All Button */}
          {pendingVideos.length > 0 && (
            <button
              onClick={() => batchApprovePayments(pendingVideos.map((v) => v.id))}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-600/30 flex items-center gap-2"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Approve All Pending ({pendingVideos.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#0b1b2e] border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800/80 bg-slate-900/60 text-slate-400 uppercase tracking-wider text-[10px] font-bold">
                <th className="py-3 px-4">Creator</th>
                <th className="py-3 px-4">Platform & ID</th>
                <th className="py-3 px-4">Verified Views</th>
                <th className="py-3 px-4">CPM Rate</th>
                <th className="py-3 px-4">Calculated Pay</th>
                <th className="py-3 px-4">Fraud Status</th>
                <th className="py-3 px-4">Payment Status</th>
                <th className="py-3 px-4 text-right">Settlement Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center max-w-md mx-auto">
                      <p className="font-bold text-white text-xs">
                        {useLiveApi ? 'No Live Settlement Records' : 'No Transactions Found'}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                        {useLiveApi
                          ? 'Live clearinghouse is empty. Once live verified posts are processed, payments will appear here for payout approval.'
                          : 'No transactions match the selected filter.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredList.map((video) => {
                  const plat = PLATFORMS[video.platform] || PLATFORMS.instagram;

                  return (
                    <tr
                      key={video.id}
                      className="hover:bg-slate-800/40 transition-colors group"
                    >
                      {/* Creator */}
                      <td className="py-3.5 px-4 font-bold text-white">{video.creator}</td>

                      {/* Platform & ID */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${plat.bgColor}`}
                          >
                            {plat.name}
                          </span>
                          <span className="font-mono text-[11px] text-slate-400">
                            {video.videoId}
                          </span>
                        </div>
                      </td>

                      {/* Verified Views */}
                      <td className="py-3.5 px-4 font-mono font-semibold text-white">
                        {video.views?.toLocaleString()}
                      </td>

                      {/* CPM Rate */}
                      <td className="py-3.5 px-4 font-mono text-slate-400">
                        ${video.ratePer1k ? video.ratePer1k.toFixed(2) : '2.50'}/1k
                      </td>

                      {/* Calculated Pay */}
                      <td className="py-3.5 px-4 font-mono font-bold text-white text-sm">
                        ${video.calculatedPay ? video.calculatedPay.toFixed(2) : '0.00'}
                      </td>

                      {/* Fraud Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                            video.status === 'Verified'
                              ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                              : video.status === 'Suspicious'
                              ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                              : 'bg-red-500/10 text-red-300 border-red-500/30'
                          }`}
                        >
                          {video.status}
                        </span>
                      </td>

                      {/* Payment Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${
                            video.paymentStatus === 'Paid'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : video.paymentStatus === 'Pending'
                              ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                              : video.paymentStatus === 'On Hold'
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                              : 'bg-red-500/20 text-red-300 border-red-500/40'
                          }`}
                        >
                          {video.paymentStatus}
                        </span>
                      </td>

                      {/* Settlement Action Buttons */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {video.paymentStatus !== 'Paid' && video.status === 'Verified' && (
                            <button
                              onClick={() => updatePaymentStatus(video.id, 'Paid', 'Manual approval')}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold shadow-sm flex items-center gap-1 transition-colors"
                              title="Mark as Paid"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Pay</span>
                            </button>
                          )}

                          {video.paymentStatus !== 'On Hold' && (
                            <button
                              onClick={() => updatePaymentStatus(video.id, 'On Hold', 'Held by admin')}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-amber-600 hover:text-white text-slate-300 text-[11px] font-semibold transition-colors"
                              title="Place on Hold"
                            >
                              <span>Hold</span>
                            </button>
                          )}

                          <button
                            onClick={() => setInspectVideoId(video.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                            title="Inspect Details"
                          >
                            <ArrowUpRight className="w-4 h-4" />
                          </button>
                        </div>
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
