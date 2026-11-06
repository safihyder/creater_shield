import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PLATFORMS, SAMPLE_PRESETS } from '../../constants/initialData';
import { extractYouTubeId } from '../../services/apiService';
import { 
  Send, 
  Loader2, 
  Sparkles, 
  DollarSign, 
  Link2, 
  AlertCircle, 
  CheckCircle2, 
  Globe2, 
  Zap,
  Info
} from 'lucide-react';

export function SubmitVideoCard() {
  const { submitVideo, useLiveApi, setIsSettingsOpen } = useApp();

  const [platform, setPlatform] = useState('instagram');
  const [url, setUrl] = useState('');
  const [ratePer1k, setRatePer1k] = useState('2.50');
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastError, setLastError] = useState(null);

  const handleSelectPlatform = (platId) => {
    setPlatform(platId);
    setLastError(null);
    const matchingPreset = SAMPLE_PRESETS.find((p) => p.platform === platId) || SAMPLE_PRESETS[0];
    if (matchingPreset) {
      setSelectedPreset(matchingPreset);
      setUrl(matchingPreset.url);
      setRatePer1k(matchingPreset.ratePer1k?.toFixed(2) || '2.50');
    }
  };

  const handleSelectPreset = (preset) => {
    setSelectedPreset(preset);
    setPlatform(preset.platform);
    setUrl(preset.url);
    if (preset.ratePer1k) {
      setRatePer1k(preset.ratePer1k.toFixed(2));
    }
    setLastError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setLastError(null);

    const result = await submitVideo({
      platform,
      url: url.trim(),
      ratePer1k: parseFloat(ratePer1k) || 2.50,
      presetData: selectedPreset?.url === url.trim() ? selectedPreset : null,
    });

    setLoading(false);

    if (!result.success) {
      setLastError(result.error);
    }
  };

  const currentPlatformConfig = PLATFORMS[platform] || PLATFORMS.instagram;

  return (
    <div className="bg-[#0b1b2e] border border-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl relative overflow-hidden">
      {/* Background glow accent */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <Send className="w-4 h-4 text-blue-400 shrink-0" />
            <span>Submit Post for Engagement Audit & Payout</span>
          </h3>
          <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
            Submit any public post URL to extract views & engagement and run real-time bot fraud scoring.
          </p>
        </div>

        {/* Engine mode status pill */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <span
            className={`text-[11px] sm:text-xs px-2.5 py-1 rounded-full font-semibold border flex items-center gap-1.5 ${
              useLiveApi
                ? 'bg-blue-500/10 text-blue-300 border-blue-500/30'
                : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
            }`}
          >
            {useLiveApi ? (
              <>
                <Globe2 className="w-3.5 h-3.5 text-blue-400" />
                Live API Fetch
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                Simulation Mode
              </>
            )}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 sm:mt-5 space-y-4 sm:space-y-5">
        {/* 1. Platform Selector */}
        <div>
          <label className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
            1. Select Social Platform
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
            {Object.values(PLATFORMS).map((p) => {
              const isSelected = platform === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSelectPlatform(p.id)}
                  className={`flex items-center gap-2 sm:gap-2.5 p-2.5 sm:p-3 rounded-xl border text-xs font-semibold transition-all ${
                    isSelected
                      ? `${p.bgColor} border-current ring-1 ring-current shadow-md`
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: p.color }}
                  />
                  <span className="truncate">{p.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Sample Quick Load Presets */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              2. Load Realistic Test Presets
            </label>
            <span className="text-[10px] text-slate-500 hidden sm:inline">Tap to populate URL</span>
          </div>

          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {SAMPLE_PRESETS.map((preset, index) => {
              const isSelected = selectedPreset?.name === preset.name && url === preset.url;
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-medium border transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-blue-600/30 text-blue-200 border-blue-500 shadow-sm'
                      : 'bg-slate-900/80 text-slate-400 hover:text-white border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      preset.type === 'Organic'
                        ? 'bg-emerald-400'
                        : preset.type === 'Suspicious'
                        ? 'bg-amber-400'
                        : 'bg-red-400'
                    }`}
                  />
                  <span>{preset.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. URL Input & Rate CPM */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="md:col-span-3 space-y-1">
            <label className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Link2 className="w-3.5 h-3.5 text-blue-400" />
              3. Post or Video URL
            </label>
            <div className="relative">
              <input
                type="url"
                required
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setLastError(null);
                }}
                placeholder={`https://${currentPlatformConfig.domainHint}`}
                className="w-full px-3.5 sm:px-4 py-2.5 sm:py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs sm:text-xs font-mono placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">
              Format: <span className="text-slate-400 font-mono">{currentPlatformConfig.domainHint}</span>
            </p>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              Contract CPM ($/1k)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-xs text-slate-500 font-bold">$</span>
              <input
                type="number"
                step="0.10"
                min="0.10"
                required
                value={ratePer1k}
                onChange={(e) => setRatePer1k(e.target.value)}
                className="w-full pl-8 pr-4 py-2.5 sm:py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white text-xs font-mono font-bold focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-500">$2.50 / 1k standard</p>
          </div>
        </div>

        {/* Error Alert if fetch failed */}
        {lastError && (
          <div className="p-3 sm:p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-xs text-red-200 flex items-start justify-between gap-3 animate-in fade-in">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-200">Fetch Failed</p>
                <p className="text-[11px] text-red-300/90 mt-0.5">{lastError}</p>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-[11px] text-slate-400 hidden sm:block">
            <span>Client-side synchronous fraud evaluation on submission</span>
          </div>

          <button
            type="submit"
            disabled={loading || !url.trim()}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Auditing Risk & Fetching...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4 text-white" />
                <span>Submit Video for Verification</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
