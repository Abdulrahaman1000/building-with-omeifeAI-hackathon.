import { Routes, Route } from 'react-router-dom';
import LandingPage from './components/Pages/LandingPage';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Layout from './components/Layout/Layout';
import DashboardPage from './components/Pages/Dashboard/DashboardPage';


export default function AppRoutes() {
  return (
    <Routes>
      {/* Landing page with modals */}
      <Route path="/" element={<LandingPage />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<DashboardPage />} />
        {/* <Route path="/profile" element={<ProfilePage />} /> */}
      </Route>
    </Routes>
  );
}