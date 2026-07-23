import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { SmartRecipesPage } from './pages/SmartRecipesPage';
import { GroceryPage } from './pages/GroceryPage';
import { WeeklyPlannerPage } from './pages/WeeklyPlannerPage';
import { PantryPage } from './pages/PantryPage';
import { AiHistoryPage } from './pages/AiHistoryPage';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ padding: '40px', textAlign: 'center', fontSize: '0.9rem', fontWeight: 700 }}>Cargando Loop Kitchen...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const AppContent = () => {
  const { user } = useAuth();

  return (
    <div className="mobile-app-shell">
      <Navbar />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/app" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/planner" element={<ProtectedRoute><WeeklyPlannerPage /></ProtectedRoute>} />
          <Route path="/recipes" element={<ProtectedRoute><SmartRecipesPage /></ProtectedRoute>} />
          <Route path="/grocery" element={<ProtectedRoute><GroceryPage /></ProtectedRoute>} />
          <Route path="/pantry" element={<ProtectedRoute><PantryPage /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><AiHistoryPage /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {user && <BottomNav />}
    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
