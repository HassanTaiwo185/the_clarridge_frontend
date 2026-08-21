import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Signup from '../pages/Signup';
import VerifyEmail from '../pages/VerifyEmail';
import Login from '../pages/Login';
import EmailVerifiedConfirmation from '../pages/EmailVerifiedConfirmation';
import Dashboard from '../pages/Dashboard';
import AdminRoute from './AdminRoute';
import AdminLayout from '../layouts/AdminLayout';
import DashboardOverview from '../pages/admin/DashboardOverview';
import ProgrammesManage from '../pages/admin/ProgrammesManage';
import ApplicationsManage from '../pages/admin/ApplicationsManage';
import CollegiumManage from '../pages/admin/CollegiumManage';
import TestimonialsManage from '../pages/admin/TestimonialsManage';
import ArticlesManage from '../pages/admin/ArticlesManage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/login" element={<Login />} />
      <Route path="/verified" element={<EmailVerifiedConfirmation />} />
      <Route path="/dashboard" element={<Dashboard />} />

      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<DashboardOverview />} />
        <Route path="programmes" element={<ProgrammesManage />} />
        <Route path="applications" element={<ApplicationsManage />} />
        <Route path="collegium" element={<CollegiumManage />} />
        <Route path="testimonials" element={<TestimonialsManage />} />
        <Route path="articles" element={<ArticlesManage />} />
      </Route>
    </Routes>
  );
}