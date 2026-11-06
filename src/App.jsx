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

export function AppContent() {
  const { currentRole, adminTab } = useApp();

  return (
    <div className="flex min-h-screen bg-[#060d17] text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      {/* Dark Navy Sidebar */}
      <Sidebar />

      {/* Main Workspace Column */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopHeader />

        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {currentRole === 'creator' ? (
            /* Creator Portal View */
            <div className="space-y-6 animate-in fade-in duration-300">
              <CreatorKPICards />
              <SubmitVideoCard />
              <CreatorVideosTable />
            </div>
          ) : (
            /* Admin Governance Suite */
            <div className="space-y-6 animate-in fade-in duration-300">
              {adminTab === 'overview' && <AdminOverview />}
              {adminTab === 'verification' && <VerificationCenter />}
              {adminTab === 'payouts' && <PaymentManagement />}
            </div>
          )}
        </main>
      </div>

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

