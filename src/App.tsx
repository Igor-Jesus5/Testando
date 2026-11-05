// ============================================================================
// MES Plastico — Main App Root & Router Configuration
// ============================================================================

import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastProvider } from './components/feedback/Toast';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import PageContainer from './components/layout/PageContainer';
import { SkeletonCard } from './components/feedback/Skeleton';

// Code-splitting via React.lazy for all modules
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const ExtrusionPage = lazy(() => import('./pages/tablet/extrusion/ExtrusionPage'));
const PrintingPage = lazy(() => import('./pages/tablet/printing/PrintingPage'));
const CuttingPage = lazy(() => import('./pages/tablet/cutting/CuttingPage'));
const SupervisorPage = lazy(() => import('./pages/supervisor/SupervisorPage'));
const ExecutivePage = lazy(() => import('./pages/executive/ExecutivePage'));

// Layout Shell that displays Header and Sidebar for operational views
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-surface-900 text-gray-100">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <PageContainer>
          {children}
        </PageContainer>
      </div>
    </div>
  );
};

// Skeleton Loading Fallback
const PageLoadingFallback: React.FC = () => (
  <div className="space-y-4 p-6 animate-fadeIn">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <SkeletonCard />
        <SkeletonCard />
      </div>
      <div>
        <SkeletonCard />
      </div>
    </div>
  </div>
);

export function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <AppLayout>
          <Suspense fallback={<PageLoadingFallback />}>
            <Routes>
              {/* Authentication */}
              <Route path="/login" element={<LoginPage />} />

              {/* Machine Tablet Chão de Fábrica */}
              <Route path="/tablet/extrusion" element={<ExtrusionPage />} />
              <Route path="/tablet/printing" element={<PrintingPage />} />
              <Route path="/tablet/cutting" element={<CuttingPage />} />

              {/* Supervisor & Preparador Management */}
              <Route path="/supervisor" element={<SupervisorPage />} />

              {/* Owner / Executive Portal & AI Copilot */}
              <Route path="/executive" element={<ExecutivePage />} />

              {/* Default Fallback Route */}
              <Route path="/" element={<Navigate to="/tablet/cutting" replace />} />
              <Route path="*" element={<Navigate to="/tablet/cutting" replace />} />
            </Routes>
          </Suspense>
        </AppLayout>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
