import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layout & Navigation
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AnalysisPage from './pages/AnalysisPage';
import CsvUploadPage from './pages/CsvUploadPage';
import DiseaseRiskPage from './pages/DiseaseRiskPage';
import ExplainableAiPage from './pages/ExplainableAiPage';
import LiveMonitoringPage from './pages/LiveMonitoringPage';
import HistoryPage from './pages/HistoryPage';
import LocationsPage from './pages/LocationsPage';
import AlertsPage from './pages/AlertsPage';
import ReportsPage from './pages/ReportsPage';
import ModelInfoPage from './pages/ModelInfoPage';
import ProfilePage from './pages/ProfilePage';

function DashboardLayout() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400">
        <div className="w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mb-4" />
        <p className="text-xs">Initializing Water AI Application...</p>
      </div>
    );
  }

  // Allow guest access with demo fallback
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing & Auth Pages */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Dashboard Layout Routes */}
          <Route path="/app" element={<DashboardLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="analysis" element={<AnalysisPage />} />
            <Route path="upload" element={<CsvUploadPage />} />
            <Route path="disease-risk" element={<DiseaseRiskPage />} />
            <Route path="xai" element={<ExplainableAiPage />} />
            <Route path="live" element={<LiveMonitoringPage />} />
            <Route path="history" element={<HistoryPage />} />
            <Route path="locations" element={<LocationsPage />} />
            <Route path="alerts" element={<AlertsPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="model-info" element={<ModelInfoPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          {/* Catch-all redirect to Landing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
