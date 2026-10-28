import React, { useState } from 'react';
import { PlacementProvider, usePlacement } from './context/PlacementContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { ToastContainer } from './components/common/Toast';
import { AuthPage } from './components/auth/AuthPage';
import { ProtectedAccessView } from './components/auth/ProtectedAccessView';

import { DashboardView } from './components/views/DashboardView';
import { StudentsView } from './components/views/StudentsView';
import { CompaniesView } from './components/views/CompaniesView';
import { JobsView } from './components/views/JobsView';
import { ApplicationsView } from './components/views/ApplicationsView';
import { EligibilityView } from './components/views/EligibilityView';
import { InterviewsView } from './components/views/InterviewsView';
import { ResultsView } from './components/views/ResultsView';
import { ReportsView } from './components/views/ReportsView';

const MainLayout: React.FC = () => {
  const { activeTab, isTabAllowed } = usePlacement();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const renderActiveView = () => {
    // Route authorization check
    if (!isTabAllowed(activeTab)) {
      return <ProtectedAccessView tabName={activeTab} />;
    }

    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'students':
        return <StudentsView />;
      case 'companies':
        return <CompaniesView />;
      case 'jobs':
        return <JobsView />;
      case 'applications':
        return <ApplicationsView />;
      case 'eligibility':
        return <EligibilityView />;
      case 'interviews':
        return <InterviewsView />;
      case 'results':
        return <ResultsView />;
      case 'reports':
        return <ReportsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <Header onToggleMobileSidebar={() => setMobileSidebarOpen(true)} />

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6 max-w-7xl w-full mx-auto">
          {renderActiveView()}
        </main>
      </div>

      {/* Global Toast Alerts */}
      <ToastContainer />
    </div>
  );
};

const AppContent: React.FC = () => {
  const { isAuthenticated } = usePlacement();

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return <MainLayout />;
};

export default function App() {
  return (
    <PlacementProvider>
      <AppContent />
    </PlacementProvider>
  );
}
