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
import UsersManage from '../pages/admin/UsersManage';
import SettingsPage from '../pages/admin/SettingsPage';
import OpportunitiesManage from '../pages/admin/OpportunitiesManage';
import CalendarManage from '../pages/admin/CalendarManage';
import Programmes from '../pages/Programmes';
import ObservatoryManage from '../pages/admin/ObservatoryManage';
import ObservatoryPostDetail from '../pages/ObservatoryPostDetail';
import Opportunities from '../pages/Opportunities';
import Apply from '../pages/Apply';
import ApplyConfirmation from '../pages/ApplyConfirmation';
import Articles from '../pages/Articles';
import ArticleDetail from '../pages/ArticleDetail';
import Calendar from '../pages/Calendar';
import Donate from '../pages/Donate';









export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/programmes" element={<Programmes />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/login" element={<Login />} />
      <Route path="/verified" element={<EmailVerifiedConfirmation />} />
      <Route path="/observatory/:slug" element={<ObservatoryPostDetail />} />
      <Route path="/opportunities" element={<Opportunities />} />
      <Route path="/apply" element={<Apply />} />
      <Route path="/apply/confirmation" element={<ApplyConfirmation />} /> 
     <Route path="/articles" element={<Articles />} />
      <Route path="/articles/:slug" element={<ArticleDetail />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/donate" element={<Donate />} />
      <Route path="/calendar" element={<Calendar />} />

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
        <Route path="users" element={<UsersManage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="opportunities" element={<OpportunitiesManage />} />
        <Route path="calendar" element={<CalendarManage />} />
        <Route path="observatory" element={<ObservatoryManage />} />
      </Route>
    </Routes>
  );
}