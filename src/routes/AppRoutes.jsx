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
import { LearningPaths } from '../pages/public/LearningPaths';
import { LearningPathDetail } from '../pages/public/LearningPathDetail';

// Aptitude Arena Pages
import AptitudeHome from '../pages/aptitude/AptitudeHome';
import AptitudePractice from '../pages/aptitude/AptitudePractice';
import AptitudeMockTests from '../pages/aptitude/AptitudeMockTests';
import AptitudeTestRunner from '../pages/aptitude/AptitudeTestRunner';
import AptitudeDailyChallenge from '../pages/aptitude/AptitudeDailyChallenge';
import AptitudeResults from '../pages/aptitude/AptitudeResults';
import AptitudeAnalytics from '../pages/aptitude/AptitudeAnalytics';
import AptitudeHistory from '../pages/aptitude/AptitudeHistory';

// CodeLab Pages
import { CodeLabHome } from '../pages/codelab/CodeLabHome';
import { ProblemDetail } from '../pages/codelab/ProblemDetail';
import { CodeLabDaily } from '../pages/codelab/CodeLabDaily';
import { CodeLabLeaderboard } from '../pages/codelab/CodeLabLeaderboard';
import { CodeLabSubmissions } from '../pages/codelab/CodeLabSubmissions';

// Projects Hub Pages
import { ProjectsHome } from '../pages/projects/ProjectsHome';
import { ProjectDetail } from '../pages/projects/ProjectDetail';
import { ProjectPortfolio } from '../pages/projects/ProjectPortfolio';

// Interview Hub Pages
import { InterviewHome } from '../pages/interview/InterviewHome';
import { InterviewQuestionDetail } from '../pages/interview/InterviewQuestionDetail';
import { InterviewMockTests } from '../pages/interview/InterviewMockTests';
import { InterviewPreparation } from '../pages/interview/InterviewPreparation';

// Career & Gamification Pages
import { CareerDashboard } from '../pages/career/CareerDashboard';
import { AchievementsPage } from '../pages/career/AchievementsPage';

// Jobs & Internships Pages
import { JobsHome } from '../pages/jobs/JobsHome';
import { JobDetail } from '../pages/jobs/JobDetail';
import { SavedJobs } from '../pages/jobs/SavedJobs';
import { JobApplications } from '../pages/jobs/JobApplications';

// AI Career Mentor Page
import { AiCareerAssistant } from '../pages/ai/AiCareerAssistant';


// Auth Pages
import { Login } from '../pages/auth/Login';
import { Register } from '../pages/auth/Register';
import { ForgotPassword } from '../pages/auth/ForgotPassword';
import { AdminLogin } from '../pages/auth/AdminLogin';

// Checkout Pages
import { Cart } from '../pages/checkout/Cart';
import { Wishlist } from '../pages/checkout/Wishlist';
import { Checkout } from '../pages/checkout/Checkout';
import { OrderSuccess, OrderFailed } from '../pages/checkout/OrderStatus';

// Dashboard & Classroom Pages
import { UserDashboard } from '../pages/user/UserDashboard';
import { CoursePlayer } from '../pages/user/CoursePlayer';
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { InstructorDashboard } from '../pages/instructor/InstructorDashboard';
import { CourseCreate } from '../pages/instructor/CourseCreate';

// Spinner loader for Suspense fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
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
        {/* Public & Standard routes — inside MainLayout (Navbar + Footer) */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/course/:id" element={<CourseDetail />} />
          <Route path="/learning-paths" element={<LearningPaths />} />
          <Route path="/learning-paths/:slug" element={<LearningPathDetail />} />

          {/* Aptitude Arena Routes */}
          <Route path="/aptitude" element={<AptitudeHome />} />
          <Route path="/aptitude/practice" element={<AptitudePractice />} />
          <Route path="/aptitude/mock-tests" element={<AptitudeMockTests />} />
          <Route path="/aptitude/mock-tests/:slug" element={<AptitudeTestRunner />} />
          <Route path="/aptitude/daily-challenge" element={<AptitudeDailyChallenge />} />
          <Route path="/aptitude/results/:attemptId" element={<AptitudeResults />} />
          <Route path="/aptitude/analytics" element={<AptitudeAnalytics />} />
          <Route path="/aptitude/history" element={<AptitudeHistory />} />

          {/* CodeLab Coding Practice Routes */}
          <Route path="/codelab" element={<CodeLabHome />} />
          <Route path="/codelab/problem/:slug" element={<ProblemDetail />} />
          <Route path="/codelab/daily" element={<CodeLabDaily />} />
          <Route path="/codelab/leaderboard" element={<CodeLabLeaderboard />} />
          <Route path="/codelab/submissions" element={<CodeLabSubmissions />} />

          {/* Projects Hub Routes */}
          <Route path="/projects" element={<ProjectsHome />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="/projects/portfolio" element={<ProjectPortfolio />} />

          {/* Interview Hub Routes */}
          <Route path="/interview" element={<InterviewHome />} />
          <Route path="/interview/question/:id" element={<InterviewQuestionDetail />} />
          <Route path="/interview/mock-tests" element={<InterviewMockTests />} />
          <Route path="/interview/preparation" element={<InterviewPreparation />} />

          {/* Career & Gamification Routes */}
          <Route path="/career" element={<CareerDashboard />} />
          <Route path="/career/achievements" element={<AchievementsPage />} />

          {/* Jobs & Internships Routes */}
          <Route path="/jobs" element={<JobsHome />} />
          <Route path="/jobs/:slug" element={<JobDetail />} />
          <Route path="/jobs/saved" element={<SavedJobs />} />
          <Route path="/jobs/applications" element={<JobApplications />} />

          {/* AI Career Mentor */}
          <Route path="/ai-career" element={<AiCareerAssistant />} />
          <Route path="/ai-assistant" element={<AiCareerAssistant />} />

          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/teachers" element={<Teachers />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />

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

          {/* Instructor Workspace Routes */}
          <Route path="/instructor" element={
            <ProtectedRoute>
              <InstructorDashboard />
            </ProtectedRoute>
          } />
          <Route path="/instructor/dashboard" element={<Navigate to="/instructor" replace />} />
          <Route path="/instructor/courses/create" element={
            <ProtectedRoute>
              <CourseCreate />
            </ProtectedRoute>
          } />
        </Route>

        {/* Classroom Video Player — Fullscreen Distraction-Free Layout */}
        <Route path="/learn/:courseId" element={
          <ProtectedRoute>
            <CoursePlayer />
          </ProtectedRoute>
        } />
        <Route path="/learn/:courseId/:lessonId" element={
          <ProtectedRoute>
            <CoursePlayer />
          </ProtectedRoute>
        } />

        {/* Admin login — inside MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/admin/login" element={<AdminLogin />} />
        </Route>

        {/* Admin dashboard — full-page sidebar layout */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute requireAdmin>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

        {/* Fallback 404 */}
        <Route path="*" element={
          <MainLayout>
            <div className="min-h-[70vh] flex flex-col items-center justify-center text-center space-y-5 py-16">
              <div className="text-8xl font-extrabold text-slate-200 dark:text-slate-800">404</div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Page Not Found</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs">
                The page you're looking for doesn't exist or has been moved.
              </p>
              <a href="/" className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-2xl text-sm transition-colors shadow-md">
                Go Back Home
              </a>
            </div>
          </MainLayout>
        } />
      </Routes>
    </Suspense>
  );
};
