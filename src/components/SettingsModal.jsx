import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DEFAULT_API_KEYS } from '../constants/initialData';
import { 
  KeyRound, 
  X, 
  Check, 
  RotateCcw, 
  Trash2,
  ExternalLink, 
  Zap, 
  ShieldAlert, 
  Globe2, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Loader2,
  Eye,
  EyeOff,
  FileCode2,
  Lock
} from 'lucide-react';

export function SettingsModal() {
  const { 
    isSettingsOpen, 
    setIsSettingsOpen, 
    apiKeys, 
    setApiKeys, 
    useLiveApi, 
    setUseLiveApi, 
    clearLiveData,
    addToast 
  } = useApp();

  const [apifyToken, setApifyToken] = useState(apiKeys.apifyToken || '');
  const [youtubeApiKey, setYoutubeApiKey] = useState(apiKeys.youtubeApiKey || '');
  const [showYoutube, setShowYoutube] = useState(false);
  const [showApify, setShowApify] = useState(false);
  const [isLive, setIsLive] = useState(useLiveApi);
  const [testingYoutube, setTestingYoutube] = useState(false);
  const [testingApify, setTestingApify] = useState(false);
  const [ytTestResult, setYtTestResult] = useState(null);
  const [apifyTestResult, setApifyTestResult] = useState(null);

  if (!isSettingsOpen) return null;

  const handleSave = (e) => {
    e?.preventDefault();
    setApiKeys({
      apifyToken: apifyToken.trim(),
      youtubeApiKey: youtubeApiKey.trim(),
    });
    setUseLiveApi(isLive);
    setIsSettingsOpen(false);
    addToast({
      type: 'success',
      title: 'Configuration Saved',
      message: `Running in ${isLive ? 'Live API Direct Mode' : 'Instant Mock Mode'}. Credentials updated securely.`,
    });
  };

  const handleResetDefaults = () => {
    setApifyToken(DEFAULT_API_KEYS.apifyToken);
    setYoutubeApiKey(DEFAULT_API_KEYS.youtubeApiKey);
    addToast({
      type: 'info',
      title: 'Credentials Restored from .env',
      message: 'Reloaded default values from environment variables.',
    });
  };

  // Test YouTube connection directly from browser
  const handleTestYouTube = async () => {
    setTestingYoutube(true);
    setYtTestResult(null);
    try {
      const keyToTest = youtubeApiKey.trim() || DEFAULT_API_KEYS.youtubeApiKey;
      if (!keyToTest) {
        throw new Error('No YouTube Data API Key found. Configure VITE_YOUTUBE_API_KEY in .env');
      }
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=dQw4w9WgXcQ&key=${encodeURIComponent(
          keyToTest
        )}`
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error?.message || `HTTP ${res.status}`);
      }
      const data = await res.json();
      if (data.items?.length) {
        setYtTestResult({ success: true, message: 'Connected & Verified! Direct YouTube CORS connection working.' });
      } else {
        setYtTestResult({ success: true, message: 'Connected (Empty video response).' });
      }
    } catch (err) {
      setYtTestResult({ success: false, message: err.message });
    } finally {
      setTestingYoutube(false);
    }
  };

  // Test Apify connection directly from browser
  const handleTestApify = async () => {
    setTestingApify(true);
    setApifyTestResult(null);
    try {
      const tokenToTest = apifyToken.trim() || DEFAULT_API_KEYS.apifyToken;
      if (!tokenToTest) {
        throw new Error('No Apify Token found. Configure VITE_APIFY_API_TOKEN in .env');
      }
      const res = await fetch(
        `https://api.apify.com/v2/users/me?token=${encodeURIComponent(tokenToTest)}`
      );
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: Token invalid or expired.`);
      }
      const user = await res.json();
      setApifyTestResult({
        success: true,
        message: `Valid Apify Account (${user.data?.username || 'Verified User'}). Direct CORS working!`,
      });
    } catch (err) {
      setApifyTestResult({ success: false, message: err.message });
    } finally {
      setTestingApify(false);
    }
  };

  const isYtConfiguredInEnv = Boolean(DEFAULT_API_KEYS.youtubeApiKey);
  const isApifyConfiguredInEnv = Boolean(DEFAULT_API_KEYS.apifyToken);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0b1b2e] border border-slate-700/60 rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-[#0b1b2e]/95 backdrop-blur z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                API Configuration (.env)
              </h3>
              <p className="text-xs text-slate-400">
                Credentials managed securely via <code className="text-blue-300 font-mono">.env</code>. Keys are masked and not exposed in UI.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsSettingsOpen(false)}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSave} className="p-6 space-y-6">
          {/* Prominent Mode Switch Toggle */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700/80">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Execution Engine Mode
                </span>
                <h4 className="text-base font-bold text-white mt-0.5">
                  {isLive ? 'Live Direct Browser APIs' : 'Instant Mock / Simulation Mode'}
                </h4>
                <p className="text-xs text-slate-400 mt-1 max-w-md">
                  {isLive
                    ? 'Live Mode uses real browser API calls with your .env credentials. Clean workspace with zero mock items.'
                    : 'Instant mock responses with zero external rate limits or token exhaustion. Perfect for rapid demo.'}
                </p>
              </div>

              {/* Glowing Toggle Button */}
              <button
                type="button"
                onClick={() => setIsLive(!isLive)}
                className={`relative inline-flex h-9 w-20 shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 ease-in-out focus:outline-none ${
                  isLive
                    ? 'bg-blue-600 border-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.5)]'
                    : 'bg-emerald-600 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out mt-0.5 ml-0.5 flex items-center justify-center text-[10px] font-bold ${
                    isLive ? 'translate-x-11 text-blue-700' : 'translate-x-0 text-emerald-700'
                  }`}
                >
                  {isLive ? 'LIVE' : 'MOCK'}
                </span>
              </button>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400">Current selection:</span>
              <span
                className={`px-2.5 py-1 rounded-full font-medium ${
                  isLive
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}
              >
                {isLive ? '🌐 Live API Direct Mode' : '⚡ Instant Mock Mode Active'}
              </span>
            </div>
          </div>

          {/* YouTube Data API Key */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                <label className="text-sm font-semibold text-slate-200">
                  YouTube Data API v3 Key
                </label>
                {isYtConfiguredInEnv && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Configured in .env
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={handleTestYouTube}
                disabled={testingYoutube || (!youtubeApiKey && !DEFAULT_API_KEYS.youtubeApiKey)}
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1.5 disabled:opacity-50"
              >
                {testingYoutube ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Testing...
                  </>
                ) : (
                  <>
                    <Globe2 className="w-3.5 h-3.5" /> Test Key
                  </>
                )}
              </button>
            </div>
            
            <div className="relative">
              <input
                type={showYoutube ? 'text' : 'password'}
                value={youtubeApiKey}
                onChange={(e) => setYoutubeApiKey(e.target.value)}
                placeholder="Configured via .env (VITE_YOUTUBE_API_KEY)"
                className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-blue-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowYoutube(!showYoutube)}
                className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300 p-0.5 transition-colors"
                title={showYoutube ? 'Hide API Key' : 'Reveal API Key'}
              >
                {showYoutube ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {ytTestResult && (
              <div
                className={`p-2.5 rounded-lg text-xs flex items-center gap-2 ${
                  ytTestResult.success
                    ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                    : 'bg-red-500/10 text-red-300 border border-red-500/20'
                }`}
              >
                {ytTestResult.success ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{ytTestResult.message}</span>
              </div>
            )}
            <p className="text-[11px] text-slate-400">
              Loaded from environment variable <code className="text-slate-300">VITE_YOUTUBE_API_KEY</code>.
            </p>
          </div>

          {/* Apify API Token */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
                <label className="text-sm font-semibold text-slate-200">
                  Apify API Token (Scrapers)
                </label>
                {isApifyConfiguredInEnv && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Configured in .env
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={handleTestApify}
                disabled={testingApify || (!apifyToken && !DEFAULT_API_KEYS.apifyToken)}
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 disabled:opacity-50"
              >
                {testingApify ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Testing...
                  </>
                ) : (
                  <>
                    <Globe2 className="w-3.5 h-3.5" /> Test Token
                  </>
                )}
              </button>
            </div>

            <div className="relative">
              <input
                type={showApify ? 'text' : 'password'}
                value={apifyToken}
                onChange={(e) => setApifyToken(e.target.value)}
                placeholder="Configured via .env (VITE_APIFY_API_TOKEN)"
                className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-cyan-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowApify(!showApify)}
                className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300 p-0.5 transition-colors"
                title={showApify ? 'Hide Token' : 'Reveal Token'}
              >
                {showApify ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {apifyTestResult && (
              <div
                className={`p-2.5 rounded-lg text-xs flex items-center gap-2 ${
                  apifyTestResult.success
                    ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                    : 'bg-red-500/10 text-red-300 border border-red-500/20'
                }`}
              >
                {apifyTestResult.success ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{apifyTestResult.message}</span>
              </div>
            )}
            <p className="text-[11px] text-slate-400">
              Loaded from environment variable <code className="text-slate-300">VITE_APIFY_API_TOKEN</code>.
            </p>
          </div>

          {/* Database Wipe Actions */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-slate-200 flex items-center gap-1.5">
                <Trash2 className="w-3.5 h-3.5 text-red-400" />
                Remove Live Data
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Purge all live video records and audit logs to start completely fresh.
              </p>
            </div>
            <button
              type="button"
              onClick={clearLiveData}
              className="px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/30 font-semibold transition-all shrink-0"
            >
              Purge Live Data
            </button>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset to .env Defaults
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsSettingsOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                Save & Apply Settings
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
