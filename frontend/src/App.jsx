import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// --- Layouts ---
import AdminLayout from './layouts/AdminLayout';
import UserLayout from './layouts/UserLayout'; 
import PublicLayout from './layouts/PublicLayout';
import PickupPersonLayout from './layouts/PickupPersonLayout';

// --- Route Protection ---
import AdminRoute from './components/common/AdminRoute';
import ProtectedRoute from './components/common/ProtectedRoute';

// --- Page Components ---
import HomePage from './components/Home/HomePage';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ProfileSettings from './pages/ProfileSettings';

// --- Dashboard Components ---
import UserDashboard from './components/Dashboard/UserDashboard';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import PickupPersonDashboard from './components/Dashboard/PickupPersonDashboard';

// --- Pickup Person Pages ---
import MyAssignments from './pages/MyAssignments';
import Schedule from './pages/Schedule';
import RouteMap from './pages/RouteMap';
import CompletedJobs from './pages/CompleteJobs';
import Performance from './pages/Performance';
import DailyReports from './pages/DailyReports';

// --- User/Other Pages ---
import TrackYourImpact from './pages/TrackYourImpact';
import ViewProgress from './pages/ViewProgress';
import QueriesSupport from './pages/QueriesSupport';
import Reports from './pages/Reports';
import NewRequest from './components/Requests/NewRequest';
import RequestHistory from './components/Requests/RequestHistory';
import AdminRequests from './components/Admin/AdminRequests';
import PickupPersonManagement from './components/Admin/PickupPersonManagement';
import Certificate from './components/Certificate/Certificate';
import ManageUsers from './components/Admin/ManageUsers';    
import ManageTickets from './components/Admin/ManageTickets';
import ManageReports from './components/Admin/ManageReports';

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner />;

  // Helper to redirect logged-in users who try to access unknown routes
  const getDefaultRedirect = () => {
    if (!user) return '/'; // Redirect to Home if not logged in
    if (user.role === 'ROLE_ADMIN' || user.role === 'ADMIN') return '/admin';
    if (user.role === 'ROLE_PICKUP_PERSON' || user.role === 'PICKUP_PERSON') return '/pickup-person';
    return '/dashboard';
  };

  return (
    <Routes>
      {/* === 1. Public Routes (Home is defined here) === */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* === 2. Admin Routes === */}
      <Route path="/admin" element={
          <AdminRoute user={user}><AdminLayout /></AdminRoute>
      }>
        <Route index element={<AdminDashboard />} />
        <Route path="requests" element={<AdminRequests />} />
        <Route path="pickup-persons" element={<PickupPersonManagement />} />
        <Route path="settings" element={<ProfileSettings />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="reports" element={<ManageReports />} />
        <Route path="tickets" element={<ManageTickets />} />
      </Route>

      {/* === 3. Pickup Person Routes === */}
      <Route path="/pickup-person" element={
          <ProtectedRoute user={user} allowedRoles={['ROLE_PICKUP_PERSON', 'PICKUP_PERSON']}><PickupPersonLayout /></ProtectedRoute>
      }>
        <Route index element={<PickupPersonDashboard />} />
        <Route path="assignments" element={<MyAssignments />} />
        <Route path="schedule" element={<Schedule />} />
        <Route path="route" element={<RouteMap />} />
        <Route path="completed" element={<CompletedJobs />} />
        <Route path="performance" element={<Performance />} />
        <Route path="reports" element={<DailyReports />} />
        <Route path="settings" element={<ProfileSettings />} />
      </Route>

      {/* === 4. User Routes (Pathless Layout Route) === */}
      <Route element={
          <ProtectedRoute user={user}><UserLayout /></ProtectedRoute>
      }>
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/new-request" element={<NewRequest />} />
        <Route path="/requests" element={<RequestHistory />} />
        <Route path="/certificate" element={<Certificate />} />
        <Route path="/profile/settings" element={<ProfileSettings />} />
        <Route path="/track-impact" element={<TrackYourImpact />} />
        <Route path="/view-progress" element={<ViewProgress />} />
        <Route path="/queries" element={<QueriesSupport />} />
        <Route path="/reports" element={<Reports />} />
      </Route>

      {/* --- Fallback Route --- */}
      <Route path="*" element={<Navigate to={getDefaultRedirect()} replace />} />
    </Routes>
  );
}

function App() {
  return (
    // CRITICAL: Router must wrap AuthProvider
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <AppRoutes />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;