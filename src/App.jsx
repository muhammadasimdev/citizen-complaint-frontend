import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import PublicFeedPage from './pages/PublicFeedPage';
import SubmitComplaintPage from './pages/SubmitComplaintPage';
import CitizenDashboardPage from './pages/CitizenDashboardPage';
import OfficerDashboardPage from './pages/OfficerDashboardPage';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="p-8 text-center text-slate-500">Loading app...</div>;
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const userRole = user.role || 'citizen';

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const RootRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/browse" replace />;
  const userRole = user.role || 'citizen';
  if (userRole === 'officer' || userRole === 'admin') return <Navigate to="/officer-dashboard" replace />;
  return <Navigate to="/my-complaints" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white font-sans text-[#16211c]">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<RootRedirect />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/browse" element={<PublicFeedPage />} />
            
            <Route path="/report" element={
              <ProtectedRoute allowedRoles={['citizen']}>
                <SubmitComplaintPage />
              </ProtectedRoute>
            } />
            <Route path="/my-complaints" element={
              <ProtectedRoute allowedRoles={['citizen']}>
                <CitizenDashboardPage />
              </ProtectedRoute>
            } />
            
            <Route path="/officer-dashboard" element={
              <ProtectedRoute allowedRoles={['officer', 'admin']}>
                <OfficerDashboardPage />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;