import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import StartupsPage from './pages/StartupsPage';
import StartupDetailPage from './pages/StartupDetailPage';
import MyStartupsPage from './pages/MyStartupsPage';
import MyInvestmentsPage from './pages/MyInvestmentsPage';
import IncomingRequestsPage from './pages/IncomingRequestsPage';
import InvestorRequestsPage from './pages/InvestorRequestsPage';
import MyTeamsPage from './pages/MyTeamsPage';
import FindInvestorsPage from './pages/FindInvestorsPage';
import FindCofoundersPage from './pages/FindCofoundersPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Authenticated — any role */}
          <Route path="/dashboard" element={
            <ProtectedRoute><DashboardPage /></ProtectedRoute>
          } />
          <Route path="/startups" element={
            <ProtectedRoute><StartupsPage /></ProtectedRoute>
          } />
          <Route path="/startup/:id" element={
            <ProtectedRoute><StartupDetailPage /></ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute><ProfilePage /></ProtectedRoute>
          } />
          <Route path="/my-teams" element={
            <ProtectedRoute><MyTeamsPage /></ProtectedRoute>
          } />

          {/* FOUNDER only */}
          <Route path="/my-startups" element={
            <ProtectedRoute roles={['FOUNDER']}>
              <MyStartupsPage />
            </ProtectedRoute>
          } />
          <Route path="/investor-requests" element={
            <ProtectedRoute roles={['FOUNDER']}>
              <InvestorRequestsPage />
            </ProtectedRoute>
          } />
          <Route path="/find-investors" element={
            <ProtectedRoute roles={['FOUNDER']}>
              <FindInvestorsPage />
            </ProtectedRoute>
          } />
          <Route path="/find-cofounders" element={
            <ProtectedRoute roles={['FOUNDER']}>
              <FindCofoundersPage />
            </ProtectedRoute>
          } />

          {/* INVESTOR only */}
          <Route path="/my-investments" element={
            <ProtectedRoute roles={['INVESTOR']}>
              <MyInvestmentsPage />
            </ProtectedRoute>
          } />
          <Route path="/incoming-requests" element={
            <ProtectedRoute roles={['INVESTOR']}>
              <IncomingRequestsPage />
            </ProtectedRoute>
          } />

          {/* ADMIN only */}
          <Route path="/admin" element={
            <ProtectedRoute roles={['ADMIN']}>
              <AdminPage />
            </ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
