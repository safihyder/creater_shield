import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { DEFAULT_API_KEYS, INITIAL_VIDEOS } from '../constants/initialData';
import { fetchVideoMetrics } from '../services/apiService';
import { analyzeVideoMetrics } from '../services/fraudEngine';

const AppContext = createContext();

export function AppProvider({ children }) {
  // 1. Persistent API Keys (Loaded securely from .env with localStorage fallback)
  const [apiKeys, setApiKeys] = useState(() => {
    try {
      const saved = localStorage.getItem('cs_api_keys');
      const parsed = saved ? JSON.parse(saved) : {};
      return {
        apifyToken: DEFAULT_API_KEYS.apifyToken || parsed?.apifyToken || '',
        youtubeApiKey: DEFAULT_API_KEYS.youtubeApiKey || parsed?.youtubeApiKey || '',
      };
    } catch {
      return DEFAULT_API_KEYS;
    }
  });

  // 2. Persistent Live vs Mock Mode switch (default to false or saved)
  const [useLiveApi, setUseLiveApiState] = useState(() => {
    try {
      const saved = localStorage.getItem('cs_use_live_api');
      return saved !== null ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  // 3. SEPARATED DATA STORES:
  // Live Mode Data: 100% clean slate, ZERO mock items
  const [liveVideos, setLiveVideos] = useState(() => {
    try {
      const saved = localStorage.getItem('cs_live_videos');
      return saved ? JSON.parse(saved) : []; // Strictly empty for Live Mode
    } catch {
      return [];
    }
  });

  // Mock Mode Data: Contains simulation demo items
  const [mockVideos, setMockVideos] = useState(() => {
    try {
      const saved = localStorage.getItem('cs_mock_videos');
      return saved ? JSON.parse(saved) : INITIAL_VIDEOS;
    } catch {
      return INITIAL_VIDEOS;
    }
  });

  // Active videos depending on current mode
  const videos = useLiveApi ? liveVideos : mockVideos;

  // 4. Role Navigation ('creator' | 'admin')
  const [currentRole, setCurrentRole] = useState('creator');

  // 5. Active Admin Tab ('overview' | 'verification' | 'payouts')
  const [adminTab, setAdminTab] = useState('overview');

  // 6. UI Modals & Mobile Drawer
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [inspectVideoId, setInspectVideoId] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 7. Toasts System
  const [toasts, setToasts] = useState([]);

  // Persistence effects
  useEffect(() => {
    localStorage.setItem('cs_api_keys', JSON.stringify(apiKeys));
  }, [apiKeys]);

  useEffect(() => {
    localStorage.setItem('cs_use_live_api', JSON.stringify(useLiveApi));
  }, [useLiveApi]);

  useEffect(() => {
    localStorage.setItem('cs_live_videos', JSON.stringify(liveVideos));
  }, [liveVideos]);

  useEffect(() => {
    localStorage.setItem('cs_mock_videos', JSON.stringify(mockVideos));
  }, [mockVideos]);

  const addToast = (toast) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    const newToast = { id, ...toast };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, toast.duration || 4500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Toggle Live API Mode with feedback
  const setUseLiveApi = (val) => {
    setUseLiveApiState(val);
    setInspectVideoId(null);
    if (val) {
      addToast({
        type: 'info',
        title: 'Live Mode Active',
        message: 'Loaded clean live environment with zero mock data. Real API calls will be made directly from your browser.',
      });
    } else {
      addToast({
        type: 'info',
        title: 'Mock Mode Active',
        message: 'Loaded demo simulation environment with mock test cases.',
      });
    }
  };

  // Clear all data for current mode or specifically for Live Mode
  const clearLiveData = () => {
    setLiveVideos([]);
    localStorage.removeItem('cs_live_videos');
    localStorage.setItem('cs_live_videos', '[]');
    setInspectVideoId(null);
    addToast({
      type: 'warning',
      title: 'Live Data Cleared',
      message: 'All live video submissions, fraud records, and payment queues have been completely removed.',
    });
  };

  const clearAllData = () => {
    if (useLiveApi) {
      clearLiveData();
    } else {
      setMockVideos([]);
      localStorage.setItem('cs_mock_videos', '[]');
      setInspectVideoId(null);
      addToast({
        type: 'warning',
        title: 'Data Cleared',
        message: 'All records in active mode have been completely removed.',
      });
    }
  };

  // Submit Video Action
  const submitVideo = async ({ platform, url, ratePer1k, presetData }) => {
    try {
      // 1. Fetch metrics from either Live API or Mock Generator
      const fetched = await fetchVideoMetrics({
        platform,
        url,
        useLiveApi,
        apiKeys,
        presetData: useLiveApi ? null : presetData, // Ignore mock metrics if in live mode
      });

      // 2. Synchronous Client-Side Fraud Analysis
      const analysis = analyzeVideoMetrics({
        views: fetched.views,
        likes: fetched.likes,
        comments: fetched.comments,
        shares: fetched.shares || 0,
        ratePer1k,
      });

      // 3. Assemble complete video record
      const newVideo = {
        id: 'vid-' + Date.now().toString().slice(-6),
        creator: 'Ayesha Khan', // Active logged-in creator
        platform,
        url,
        videoId: fetched.videoId,
        title: fetched.title || `${platform.toUpperCase()} Post`,
        thumbnail: fetched.thumbnail,
        views: analysis.views,
        likes: analysis.likes,
        comments: analysis.comments,
        shares: analysis.shares,
        er: analysis.er,
        riskScore: analysis.riskScore,
        riskLevel: analysis.riskLevel,
        reasons: analysis.reasons,
        signals: analysis.signals,
        status: analysis.status,
        paymentStatus: analysis.paymentStatus,
        ratePer1k: analysis.ratePer1k,
        calculatedPay: analysis.calculatedPay,
        isLive: !!fetched.isLive,
        isMock: !fetched.isLive,
        submittedAt: new Date().toISOString(),
        auditLogs: [
          {
            timestamp: new Date().toISOString(),
            event: `Submitted via ${fetched.isLive ? 'Live API Direct CORS' : 'Simulation Mode'}`,
          },
          {
            timestamp: new Date().toISOString(),
            event: `Fraud Engine classified as: ${analysis.status} (Risk Score: ${analysis.riskScore}/100)`,
          },
        ],
      };

      if (useLiveApi) {
        setLiveVideos((prev) => [newVideo, ...prev]);
      } else {
        setMockVideos((prev) => [newVideo, ...prev]);
      }

      if (analysis.status === 'Verified') {
        addToast({
          type: 'success',
          title: 'Video Verified & Queued!',
          message: `Calculated payout: $${analysis.calculatedPay.toFixed(2)} (${analysis.er}% ER, Low Risk)`,
        });
      } else if (analysis.status === 'Suspicious') {
        addToast({
          type: 'warning',
          title: 'Flagged for Admin Review',
          message: `High risk score (${analysis.riskScore}/100). Payout placed on hold pending audit.`,
        });
      } else {
        addToast({
          type: 'error',
          title: 'High Fraud Risk Detected!',
          message: `Score ${analysis.riskScore}/100. Payout rejected: ${analysis.reasons[0] || 'Bot patterns detected'}`,
        });
      }

      return { success: true, video: newVideo };
    } catch (err) {
      console.error('Submission failed:', err);
      addToast({
        type: 'error',
        title: 'Metric Fetch Failed',
        message: err.message,
        duration: 7000,
      });
      return { success: false, error: err.message, canFallback: err.canFallbackToMock };
    }
  };

  // Admin Override Action
  const overrideVideoStatus = (videoId, newStatus, newPaymentStatus, note = '') => {
    const updater = (prev) =>
      prev.map((v) => {
        if (v.id !== videoId) return v;

        let calcPay = v.calculatedPay;
        if (newStatus === 'Verified' && calcPay === 0) {
          calcPay = Number(((v.views / 1000) * (v.ratePer1k || 2.5)).toFixed(2));
        } else if (newStatus === 'Fake / Flagged' || newPaymentStatus === 'Rejected') {
          calcPay = 0;
        }

        const newLog = {
          timestamp: new Date().toISOString(),
          event: `Admin override: Status changed to "${newStatus}" (${newPaymentStatus}) ${note ? `[${note}]` : ''}`,
        };

        return {
          ...v,
          status: newStatus,
          paymentStatus: newPaymentStatus,
          calculatedPay: calcPay,
          auditLogs: [...(v.auditLogs || []), newLog],
        };
      });

    if (useLiveApi) {
      setLiveVideos(updater);
    } else {
      setMockVideos(updater);
    }

    addToast({
      type: 'info',
      title: 'Status Updated',
      message: `Video ${videoId} updated to ${newStatus} (${newPaymentStatus}).`,
    });
  };

  // Payment Status Management
  const updatePaymentStatus = (videoId, paymentStatus, note = '') => {
    const updater = (prev) =>
      prev.map((v) => {
        if (v.id !== videoId) return v;

        const newLog = {
          timestamp: new Date().toISOString(),
          event: `Payment updated to "${paymentStatus}" ${note ? `[${note}]` : ''}`,
        };

        return {
          ...v,
          paymentStatus,
          auditLogs: [...(v.auditLogs || []), newLog],
        };
      });

    if (useLiveApi) {
      setLiveVideos(updater);
    } else {
      setMockVideos(updater);
    }

    if (paymentStatus === 'Paid') {
      try {
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
      } catch (e) {}
    }

    addToast({
      type: paymentStatus === 'Paid' ? 'success' : paymentStatus === 'On Hold' ? 'warning' : 'info',
      title: `Payment ${paymentStatus}`,
      message: `Updated video ${videoId} payment status to ${paymentStatus}.`,
    });
  };

  // Batch Payment Approval
  const batchApprovePayments = (videoIds) => {
    if (!videoIds || videoIds.length === 0) return;

    const updater = (prev) =>
      prev.map((v) => {
        if (videoIds.includes(v.id) && v.status === 'Verified') {
          return {
            ...v,
            paymentStatus: 'Paid',
            auditLogs: [
              ...(v.auditLogs || []),
              {
                timestamp: new Date().toISOString(),
                event: 'Batch payout approved and marked Paid by Admin',
              },
            ],
          };
        }
        return v;
      });

    if (useLiveApi) {
      setLiveVideos(updater);
    } else {
      setMockVideos(updater);
    }

    try {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    } catch (e) {}

    addToast({
      type: 'success',
      title: 'Batch Payout Executed',
      message: `Approved and settled ${videoIds.length} verified payouts.`,
    });
  };

  // Reset Mock Data to Defaults (only affects Mock Mode)
  const resetToMockData = () => {
    setMockVideos(INITIAL_VIDEOS);
    addToast({
      type: 'info',
      title: 'Mock Database Restored',
      message: 'Restored initial 5 mock demo test cases in Mock Mode.',
    });
  };

  const inspectedVideo = videos.find((v) => v.id === inspectVideoId) || null;

  return (
    <AppContext.Provider
      value={{
        apiKeys,
        setApiKeys,
        useLiveApi,
        setUseLiveApi,
        videos,
        liveVideosCount: liveVideos.length,
        mockVideosCount: mockVideos.length,
        currentRole,
        setCurrentRole,
        adminTab,
        setAdminTab,
        isSettingsOpen,
        setIsSettingsOpen,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        inspectVideoId,
        setInspectVideoId,
        inspectedVideo,
        toasts,
        addToast,
        removeToast,
        submitVideo,
        overrideVideoStatus,
        updatePaymentStatus,
        batchApprovePayments,
        resetToMockData,
        clearLiveData,
        clearAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
