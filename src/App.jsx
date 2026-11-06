import React from 'react';
import { useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { SettingsModal } from './components/SettingsModal';
import { InspectModal } from './components/InspectModal';
import { ToastContainer } from './components/ToastContainer';

// Creator Components
import { CreatorKPICards } from './components/CreatorView/CreatorKPICards';
import { SubmitVideoCard } from './components/CreatorView/SubmitVideoCard';
import { CreatorVideosTable } from './components/CreatorView/CreatorVideosTable';

// Admin Components
import { AdminOverview } from './components/AdminView/AdminOverview';
import { VerificationCenter } from './components/AdminView/VerificationCenter';
import { PaymentManagement } from './components/AdminView/PaymentManagement';

// Icons for Mobile Bottom Nav
import { 
  LayoutDashboard, 
  BadgeCheck, 
  CreditCard, 
  Send, 
  UserCheck, 
  ShieldCheck 
} from 'lucide-react';

export function AppContent() {
  const { currentRole, setCurrentRole, adminTab, setAdminTab } = useApp();

  return (
    <div className="flex min-h-screen bg-[#060d17] text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      {/* Dark Navy Sidebar / Mobile Slide-Over Drawer */}
      <Sidebar />

      {/* Main Workspace Column */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0">
        <TopHeader />

        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-4 sm:space-y-6 min-w-0 overflow-x-hidden">
          {currentRole === 'creator' ? (
            /* Creator Portal View */
            <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-300">
              <CreatorKPICards />
              <SubmitVideoCard />
              <CreatorVideosTable />
            </div>
          ) : (
            /* Admin Governance Suite */
            <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-300">
              {adminTab === 'overview' && <AdminOverview />}
              {adminTab === 'verification' && <VerificationCenter />}
              {adminTab === 'payouts' && <PaymentManagement />}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (Visible only on < lg screens) */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-[#0b1b2e]/95 backdrop-blur-md border-t border-slate-800/80 px-2 py-1.5 flex items-center justify-around shadow-2xl safe-area-bottom">
        {currentRole === 'creator' ? (
          <>
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-blue-400 font-semibold text-[10px]"
            >
              <Send className="w-4 h-4" />
              <span>Submit</span>
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('my-videos-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else window.scrollTo({ top: 500, behavior: 'smooth' });
              }}
              className="flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-slate-400 hover:text-white text-[10px]"
            >
              <BadgeCheck className="w-4 h-4" />
              <span>My Videos</span>
            </button>
            <button
              onClick={() => setCurrentRole('admin')}
              className="flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-slate-400 hover:text-white text-[10px]"
            >
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>To Admin</span>
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setAdminTab('overview')}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-[10px] font-semibold transition-colors ${
                adminTab === 'overview' ? 'text-blue-400' : 'text-slate-400'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Overview</span>
            </button>
            <button
              onClick={() => setAdminTab('verification')}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-[10px] font-semibold transition-colors ${
                adminTab === 'verification' ? 'text-blue-400' : 'text-slate-400'
              }`}
            >
              <BadgeCheck className="w-4 h-4" />
              <span>Verify</span>
            </button>
            <button
              onClick={() => setAdminTab('payouts')}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-[10px] font-semibold transition-colors ${
                adminTab === 'payouts' ? 'text-blue-400' : 'text-slate-400'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Payouts</span>
            </button>
            <button
              onClick={() => setCurrentRole('creator')}
              className="flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-slate-400 hover:text-white text-[10px]"
            >
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span>To Creator</span>
            </button>
          </>
        )}
      </nav>

      {/* Modals & Overlays */}
      <SettingsModal />
      <InspectModal />
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return <AppContent />;
}
