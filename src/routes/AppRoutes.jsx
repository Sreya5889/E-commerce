import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Layout
import { MainLayout } from '../layouts/MainLayout';

// Public Pages
import { Home } from '../pages/public/Home';
import { Courses } from '../pages/public/Courses';
import { CourseDetail } from '../pages/public/CourseDetail';
import { About } from '../pages/public/About';
import { Contact } from '../pages/public/Contact';
import { Pricing } from '../pages/public/Pricing';
import { Teachers } from '../pages/public/Teachers';

// Auth Pages
import { Login } from '../pages/auth/Login';
import { Register } from '../pages/auth/Register';
import { AdminLogin } from '../pages/auth/AdminLogin';

// Checkout Pages
import { Cart } from '../pages/checkout/Cart';
import { Checkout } from '../pages/checkout/Checkout';
import { OrderSuccess, OrderFailed } from '../pages/checkout/OrderStatus';

// Dashboard Pages
import { UserDashboard } from '../pages/user/UserDashboard';
import { AdminDashboard } from '../pages/admin/AdminDashboard';

// Spinner loader for Suspense fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// Protected Route wrapper
const ProtectedRoute = ({ children, requireAdmin = false, requireAuth = true }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return <PageLoader />;
  }

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public routes — inside MainLayout (Navbar + Footer) */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/course/:id" element={<CourseDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } />
          <Route path="/checkout/success" element={
            <ProtectedRoute>
              <OrderSuccess />
            </ProtectedRoute>
          } />
          <Route path="/checkout/failed" element={<OrderFailed />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          } />
        </Route>

        {/* Admin login — inside MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/admin/login" element={<AdminLogin />} />
        </Route>

        {/* Admin dashboard — no navbar/footer (full-page sidebar layout) */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute requireAdmin>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

        {/* Fallback */}
        <Route path="*" element={
          <MainLayout>
            <div className="min-h-[70vh] flex flex-col items-center justify-center text-center space-y-5 py-16">
              <div className="text-8xl font-extrabold text-slate-200 dark:text-slate-800">404</div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Page Not Found</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs">
                The page you're looking for doesn't exist or has been moved.
              </p>
              <a href="/" className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-premium text-sm transition-colors shadow-md">
                Go Back Home
              </a>
            </div>
          </MainLayout>
        } />
      </Routes>
    </Suspense>
  );
};
