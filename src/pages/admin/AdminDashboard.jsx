import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { adminService } from '../../services/admin.service';
import { faqService } from '../../services/faq.service';
import { couponService } from '../../services/coupon.service';
import { contactService } from '../../services/contact.service';
import { courseService } from '../../services/course.service';
import { learningPathService } from '../../services/learningPath.service';
import { aptitudeService } from '../../services/aptitude.service';
import { codelabService } from '../../services/codelab.service';
import { projectService } from '../../services/project.service';
import { interviewService } from '../../services/interview.service';
import { jobService } from '../../services/job.service';
import { PageTransition } from '../../components/layout/PageTransition';
import {
  BarChart2, Users, BookOpen, DollarSign, TrendingUp,
  GraduationCap, ShieldCheck, Settings, MessageSquare, HelpCircle,
  Tag, Package, Star, LogOut, Loader2, Check, Trash2, X,
  LayoutDashboard, PlusCircle, Plus, Eye, CheckCircle2, AlertCircle, Route, Target,
  Code2, FolderGit2, Briefcase, Sparkles
} from 'lucide-react';
import { CATEGORIES } from '../../constants/mockData';
import { formatINR } from '../../utils/currency';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, Filler);

const ADMIN_TABS = [
  { key: 'overview', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'courses', label: 'Courses', icon: BookOpen },
  { key: 'learning-paths', label: 'Learning Paths', icon: Route },
  { key: 'codelab', label: 'CodeLab Manager', icon: Code2 },
  { key: 'projects', label: 'Projects Manager', icon: FolderGit2 },
  { key: 'interview', label: 'Interview Hub', icon: HelpCircle },
  { key: 'jobs', label: 'Jobs Manager', icon: Briefcase },
  { key: 'aptitude', label: 'Aptitude Arena', icon: Target },
  { key: 'users', label: 'Users & Students', icon: Users },
  { key: 'orders', label: 'Orders', icon: Package },
  { key: 'coupons', label: 'Coupons', icon: Tag },
  { key: 'reviews', label: 'Reviews', icon: Star },
  { key: 'faq', label: 'FAQ Manager', icon: HelpCircle },
  { key: 'messages', label: 'Contact Messages', icon: MessageSquare },
  { key: 'settings', label: 'Platform Settings', icon: Settings },
];

const chartOptions = {
  responsive: true,
  plugins: { legend: { display: false }, tooltip: { mode: 'index' } },
  scales: {
    x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 10 } } },
    y: { grid: { color: '#f1f5f9' }, ticks: { color: '#94a3b8', font: { size: 10 } } },
  },
};

export const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  const [analytics, setAnalytics] = useState(null);
  const [allCourses, setAllCourses] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [allReviews, setAllReviews] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [adminProblems, setAdminProblems] = useState([]);
  const [adminProjects, setAdminProjects] = useState([]);
  const [adminQuestions, setAdminQuestions] = useState([]);
  const [adminJobs, setAdminJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  // FAQ add form
  const [faqForm, setFaqForm] = useState({ question: '', answer: '' });
  const [faqSaving, setFaqSaving] = useState(false);

  // Coupon add form
  const [couponForm, setCouponForm] = useState({ code: '', discountPercent: 10 });
  const [couponSaving, setCouponSaving] = useState(false);

  // Course add form & modal
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [courseSaving, setCourseSaving] = useState(false);
  const [courseError, setCourseError] = useState('');
  const [courseForm, setCourseForm] = useState({
    title: '',
    subtitle: '',
    description: '',
    category: 'Web Development',
    level: 'all_levels',
    price: 49.99,
    discountPrice: 19.99,
    isFree: false,
    thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
    bannerUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1600',
    previewVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    learningObjectives: 'Build scalable real-world projects\nMaster modern best practices and patterns',
    requirements: 'Basic computer and internet knowledge',
    targetAudience: 'Developers, designers, and tech enthusiasts',
    status: 'published',
    badge: 'none'
  });

  // Learning Paths add form & modal
  const [allLearningPaths, setAllLearningPaths] = useState([]);
  const [showPathModal, setShowPathModal] = useState(false);
  const [pathSaving, setPathSaving] = useState(false);
  const [pathError, setPathError] = useState('');
  const [pathForm, setPathForm] = useState({
    title: '',
    description: '',
    category: 'Software Development',
    difficulty: 'all_levels',
    duration_weeks: 12,
    key_skills: 'React, Node.js, TypeScript',
    tools_and_technologies: 'Git, VS Code, Postman',
    career_outcomes: 'Full Stack Developer, Software Engineer',
    banner_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800'
  });

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    if (!courseForm.title.trim() || !courseForm.description.trim()) {
      setCourseError('Title and description are required.');
      return;
    }

    setCourseSaving(true);
    setCourseError('');
    try {
      const catObj = CATEGORIES.find(c => c.name === courseForm.category || c.slug === courseForm.category) || CATEGORIES[0];
      const payload = {
        title: courseForm.title.trim(),
        subtitle: courseForm.subtitle.trim(),
        description: courseForm.description.trim(),
        category: catObj.name,
        categoryId: catObj.id,
        category_id: catObj.id,
        categories: { id: catObj.id, name: catObj.name, slug: catObj.slug },
        level: courseForm.level,
        price: courseForm.isFree ? 0 : Number(courseForm.price || 0),
        discountPrice: courseForm.isFree ? null : (courseForm.discountPrice ? Number(courseForm.discountPrice) : null),
        discount_price: courseForm.isFree ? null : (courseForm.discountPrice ? Number(courseForm.discountPrice) : null),
        isFree: Boolean(courseForm.isFree),
        is_free: Boolean(courseForm.isFree),
        thumbnailUrl: courseForm.thumbnailUrl.trim(),
        thumbnail_url: courseForm.thumbnailUrl.trim(),
        bannerUrl: courseForm.bannerUrl.trim(),
        banner_url: courseForm.bannerUrl.trim(),
        previewVideoUrl: courseForm.previewVideoUrl.trim(),
        preview_video_url: courseForm.previewVideoUrl.trim(),
        what_you_will_learn: courseForm.learningObjectives.split('\n').map(s => s.trim()).filter(Boolean),
        learning_objectives: courseForm.learningObjectives.split('\n').map(s => s.trim()).filter(Boolean),
        requirements: courseForm.requirements.split('\n').map(s => s.trim()).filter(Boolean),
        target_audience: courseForm.targetAudience.split('\n').map(s => s.trim()).filter(Boolean),
        status: courseForm.status,
        badge: courseForm.badge !== 'none' ? courseForm.badge : null,
      };

      const created = await courseService.createCourse(user?.id || 'inst-1', payload);
      setAllCourses(prev => [created, ...prev]);
      setShowCourseModal(false);
      setCourseForm({
        title: '',
        subtitle: '',
        description: '',
        category: 'Web Development',
        level: 'all_levels',
        price: 49.99,
        discountPrice: 19.99,
        isFree: false,
        thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
        bannerUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1600',
        previewVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        learningObjectives: 'Build scalable real-world projects\nMaster modern best practices and patterns',
        requirements: 'Basic computer and internet knowledge',
        targetAudience: 'Developers, designers, and tech enthusiasts',
        status: 'published',
        badge: 'none'
      });
    } catch (err) {
      console.error('Failed to create course:', err);
      setCourseError(err.message || 'Failed to create course. Please try again.');
    } finally {
      setCourseSaving(false);
    }
  };

  const setTab = (key) => setSearchParams({ tab: key });

  // Aptitude Arena state
  const [aptitudeQuestions, setAptitudeQuestions] = useState([]);
  const [aptitudeMockTests, setAptitudeMockTests] = useState([]);
  const [aptitudeCategories, setAptitudeCategories] = useState([]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [stats, courses_, faqs_, msgs_, coupons_, users_, orders_, paths_, aptQs, aptMocks, aptCats] = await Promise.all([
        adminService.getDashboardAnalytics(),
        courseService.getCourses(),
        faqService.getFAQs(),
        contactService.getContactMessages(),
        couponService.getCoupons(),
        adminService.getUsers(),
        adminService.getOrders(),
        learningPathService.adminGetAllPaths(),
        aptitudeService.getQuestions({ limit: 50 }).catch(() => ({ questions: [] })),
        aptitudeService.getMockTests().catch(() => []),
        aptitudeService.getCategories().catch(() => [])
      ]);
      setAnalytics(stats);
      setAllCourses(courses_ || []);
      setFaqs(faqs_ || []);
      setContactMessages(msgs_ || []);
      setCoupons(coupons_ || []);
      setAllUsers(users_ || []);
      setAllOrders(orders_ || []);
      setAllLearningPaths(paths_ || []);
      setAptitudeQuestions(aptQs?.questions || []);
      setAptitudeMockTests(aptMocks || []);
      setAptitudeCategories(aptCats || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDeleteAptitudeQuestion = (id) => {
    if (!window.confirm('Delete this aptitude question?')) return;
    setAptitudeQuestions(prev => prev.filter(q => q.id !== id));
  };

  useEffect(() => { loadData(); }, [loadData]);

  const handleDeleteCourse = async (id) => {
    if (!window.confirm('Delete this course?')) return;
    try {
      await courseService.deleteCourse(id);
      setAllCourses(prev => prev.filter(c => c.id !== id));
    } catch (err) { console.error(err); }
  };

  const handleAddFaq = async (e) => {
    e.preventDefault();
    setFaqSaving(true);
    try {
      const newFaq = await faqService.createFAQ(faqForm.question, faqForm.answer);
      setFaqs(prev => [...prev, newFaq]);
      setFaqForm({ question: '', answer: '' });
    } catch (err) { console.error(err); }
    finally { setFaqSaving(false); }
  };

  const handleDeleteFaq = async (id) => {
    try {
      await faqService.deleteFAQ(id);
      setFaqs(prev => prev.filter(f => f.id !== id));
    } catch (err) { console.error(err); }
  };

  const handleAddCoupon = async (e) => {
    e.preventDefault();
    setCouponSaving(true);
    try {
      const newCoupon = await couponService.createCoupon({
        code: couponForm.code,
        discount_type: 'percentage',
        discount_value: parseInt(couponForm.discountPercent)
      });
      setCoupons(prev => [...prev, newCoupon]);
      setCouponForm({ code: '', discountPercent: 10 });
    } catch (err) { console.error(err); }
    finally { setCouponSaving(false); }
  };

  const handleDeleteCoupon = async (id) => {
    try {
      await couponService.deleteCoupon(id);
      setCoupons(prev => prev.filter(c => c.id !== id));
    } catch (err) { console.error(err); }
  };

  const handleResolveMessage = async (id) => {
    try {
      await contactService.resolveContactMessage(id);
      setContactMessages(prev => prev.map(m => m.id === id ? { ...m, is_resolved: true } : m));
    } catch (err) { console.error(err); }
  };

  const handleUpdateCourseStatus = async (courseId, status) => {
    try {
      const updated = await adminService.updateCourseStatus(courseId, status);
      setAllCourses(prev => prev.map(c => c.id === courseId ? { ...c, status: updated.status } : c));
    } catch (err) { console.error(err); }
  };

  const handleTogglePublishPath = async (id, currentStatus) => {
    try {
      const updated = await learningPathService.updatePath(id, { is_published: !currentStatus });
      if (updated) {
        setAllLearningPaths(prev => prev.map(p => (p.id === id || p.slug === id) ? { ...p, is_published: !currentStatus } : p));
      }
    } catch (err) { console.error(err); }
  };

  const handleDeleteLearningPath = async (id) => {
    if (!window.confirm('Delete this career learning path?')) return;
    try {
      await learningPathService.deletePath(id);
      setAllLearningPaths(prev => prev.filter(p => p.id !== id && p.slug !== id));
    } catch (err) { console.error(err); }
  };

  const handleCreateLearningPath = async (e) => {
    e.preventDefault();
    if (!pathForm.title.trim() || !pathForm.description.trim()) {
      setPathError('Title and description are required.');
      return;
    }
    setPathSaving(true);
    setPathError('');
    try {
      const payload = {
        title: pathForm.title.trim(),
        description: pathForm.description.trim(),
        category: pathForm.category,
        difficulty: pathForm.difficulty,
        duration_weeks: Number(pathForm.duration_weeks || 12),
        banner_url: pathForm.banner_url.trim(),
        key_skills: pathForm.key_skills.split(',').map(s => s.trim()).filter(Boolean),
        tools_and_technologies: pathForm.tools_and_technologies.split(',').map(s => s.trim()).filter(Boolean),
        career_outcomes: pathForm.career_outcomes.split(',').map(s => s.trim()).filter(Boolean),
        is_published: true
      };
      const created = await learningPathService.createPath(payload);
      if (created) {
        setAllLearningPaths(prev => [created, ...prev]);
        setShowPathModal(false);
        setPathForm({
          title: '',
          description: '',
          category: 'Software Development',
          difficulty: 'all_levels',
          duration_weeks: 12,
          key_skills: 'React, Node.js, TypeScript',
          tools_and_technologies: 'Git, VS Code, Postman',
          career_outcomes: 'Full Stack Developer, Software Engineer',
          banner_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800'
        });
      }
    } catch (err) {
      console.error('Failed to create learning path:', err);
      setPathError(err.message || 'Failed to create learning path.');
    } finally {
      setPathSaving(false);
    }
  };

  // Extract stats from adminService response (RPC returns different structure)
  const stats = analytics || {};
  const totalRevenue = Number(stats.total_revenue ?? 0);
  const totalStudents = Number(stats.total_students ?? 0);
  const totalCourses = Number(stats.total_courses ?? allCourses.length);
  const totalOrders = Number(stats.total_orders ?? allOrders.length);

  // Placeholder chart data - will use real data when available
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const salesChartData = {
    labels: months,
    datasets: [{
      label: 'Enrollments',
      data: [allOrders.length > 0 ? Math.floor(allOrders.length * 0.3) : 12, Math.floor(allOrders.length * 0.5) || 18, Math.floor(allOrders.length * 0.7) || 25, Math.floor(allOrders.length * 0.6) || 20, Math.floor(allOrders.length * 0.8) || 30, allOrders.length || 35],
      backgroundColor: 'rgba(37, 99, 235, 0.15)',
      borderColor: '#2563eb',
      borderWidth: 2,
      fill: true,
      tension: 0.4,
    }],
  };

  const revenueChartData = {
    labels: months,
    datasets: [{
      label: 'Revenue ($)',
      data: [totalRevenue * 0.1 || 500, totalRevenue * 0.15 || 800, totalRevenue * 0.2 || 1200, totalRevenue * 0.18 || 1000, totalRevenue * 0.22 || 1500, totalRevenue * 0.15 || 900],
      backgroundColor: 'rgba(79, 70, 229, 0.7)',
      borderRadius: 8,
      borderSkipped: false,
    }],
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-slate-900 text-slate-300 flex flex-col min-h-screen sticky top-0 h-screen overflow-y-auto">
        {/* Brand */}
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary-600 to-secondary-600 flex items-center justify-center text-white font-extrabold text-lg">E</div>
            <div>
              <p className="font-extrabold text-white text-sm">EduAcademy</p>
              <p className="text-[10px] text-slate-500">Admin Control Panel</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {ADMIN_TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                activeTab === key
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <div className="flex items-center space-x-3">
            <img src={user?.avatarUrl} alt={user?.fullName} className="w-9 h-9 rounded-xl object-cover" />
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">{user?.fullName}</p>
              <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center space-x-2 px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-950/20 hover:text-red-300 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <PageTransition>
          <div className="p-8 space-y-8">

            {/* ===== OVERVIEW ===== */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Analytics Dashboard</h1>
                  <p className="text-xs text-slate-400 mt-1">Welcome back, {user?.email?.split('@')[0]}. Here's today's platform snapshot.</p>
                </div>

                {loading ? (
                  <div className="flex justify-center py-16"><Loader2 className="w-10 h-10 animate-spin text-primary-500" /></div>
                ) : (
                  <>
                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                      {[
                        { label: 'Total Users', value: totalStudents + Number(stats.total_teachers ?? 0), icon: Users, color: 'blue' },
                        { label: 'Students', value: totalStudents, icon: GraduationCap, color: 'green' },
                        { label: 'Instructors', value: Number(stats.total_teachers ?? 0), icon: ShieldCheck, color: 'purple' },
                        { label: 'Courses', value: totalCourses, icon: BookOpen, color: 'amber' },
                        { label: 'Total Revenue', value: formatINR(totalRevenue || 0), icon: DollarSign, color: 'emerald' },
                        { label: 'Monthly Revenue', value: formatINR(Number(stats.monthly_revenue ?? totalRevenue * 0.15 ?? 0) || 0), icon: TrendingUp, color: 'indigo' },
                      ].map(({ label, value, icon: Icon, color }) => (
                        <div key={label} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-premium p-5 shadow-sm space-y-3">
                          <div className={`w-10 h-10 rounded-xl bg-${color}-50 dark:bg-${color}-950/20 flex items-center justify-center`}>
                            <Icon className={`w-5 h-5 text-${color}-600 dark:text-${color}-400`} />
                          </div>
                          <p className="text-xl font-extrabold text-slate-900 dark:text-white">{value}</p>
                          <p className="text-[10px] text-slate-400 font-medium">{label}</p>
                        </div>
                      ))}
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-premium p-6 shadow-sm">
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-4">Sales Over 6 Months</h3>
                        <Line data={salesChartData} options={chartOptions} />
                      </div>
                      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-premium p-6 shadow-sm">
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-4">Monthly Revenue ($)</h3>
                        <Bar data={revenueChartData} options={chartOptions} />
                      </div>
                    </div>

                    {/* Top Courses Table */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-premium shadow-sm overflow-hidden">
                      <div className="p-5 border-b border-slate-100 dark:border-slate-800">
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white">Course Performance</h3>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50">
                              <th className="text-left px-6 py-3 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Course</th>
                              <th className="text-right px-6 py-3 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Students</th>
                              <th className="text-right px-6 py-3 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Revenue</th>
                              <th className="text-right px-6 py-3 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Rating</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {allCourses.map(course => (
                              <tr key={course.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                <td className="px-6 py-4">
                                  <div className="flex items-center space-x-3">
                                    <img src={course.thumbnail_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200'} alt="" className="w-10 h-7 rounded-lg object-cover flex-shrink-0" />
                                    <p className="font-semibold text-slate-900 dark:text-white line-clamp-1 max-w-xs">{course.title}</p>
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-right text-slate-600 dark:text-slate-300 font-medium">{course.studentCount?.toLocaleString()}</td>
                                <td className="px-6 py-4 text-right text-slate-600 dark:text-slate-300 font-medium">{formatINR(course.discountPrice || course.price || 999)}</td>
                                <td className="px-6 py-4 text-right">
                                  <span className="flex items-center justify-end space-x-1 text-amber-500 font-bold">
                                    <Star className="w-3.5 h-3.5 fill-current" />
                                    <span>{course.rating}</span>
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ===== COURSES ===== */}
            {activeTab === 'courses' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Course Management</h1>
                    <p className="text-xs text-slate-400 mt-0.5">{allCourses.length} total courses in catalog</p>
                  </div>
                  <button
                    onClick={() => setShowCourseModal(true)}
                    className="flex items-center gap-2 px-3.5 py-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-xs rounded-xl transition-all shadow-sm active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Course</span>
                  </button>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-premium shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800/50">
                          <th className="text-left px-6 py-4 font-bold text-slate-500 uppercase tracking-wider">Course</th>
                          <th className="text-left px-6 py-4 font-bold text-slate-500 uppercase tracking-wider">Category</th>
                          <th className="text-right px-6 py-4 font-bold text-slate-500 uppercase tracking-wider">Price</th>
                          <th className="text-right px-6 py-4 font-bold text-slate-500 uppercase tracking-wider">Students</th>
                          <th className="text-right px-6 py-4 font-bold text-slate-500 uppercase tracking-wider">Rating</th>
                          <th className="text-right px-6 py-4 font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {allCourses.map(course => (
                          <tr key={course.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-3">
                                <img src={course.thumbnail_url || course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200'} alt="" className="w-12 h-8 rounded-lg object-cover" />
                                <div className="min-w-0">
                                  <p className="font-semibold text-slate-900 dark:text-white line-clamp-1 max-w-xs">{course.title}</p>
                                  {course.badge && (
                                    <span className="px-1.5 py-0.5 bg-amber-100 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 text-[9px] font-bold rounded capitalize">{course.badge}</span>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{course.category || course.categories?.name || 'Development'}</td>
                            <td className="px-6 py-4 text-right font-semibold text-slate-900 dark:text-white">
                              ${Number(course.discount_price ?? course.discountPrice ?? course.price ?? 0).toFixed(2)}
                            </td>
                            <td className="px-6 py-4 text-right text-slate-500 dark:text-slate-400">
                              {Number(course.student_count ?? course.studentCount ?? 0).toLocaleString()}
                            </td>
                            <td className="px-6 py-4 text-right text-amber-500 font-bold">★ {Number(course.avg_rating ?? course.rating ?? 4.8).toFixed(1)}</td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end space-x-2">
                                <Link to={`/courses/${course.id}`} className="p-1.5 text-slate-400 hover:text-primary-600 transition-colors" title="View course">
                                  <Eye className="w-4 h-4" />
                                </Link>
                                <button onClick={() => handleDeleteCourse(course.id)} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors" title="Delete course">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Modal: Add New Course (16 Fields) */}
                {showCourseModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
                      {/* Modal Header */}
                      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                        <div>
                          <h2 className="text-base font-bold text-slate-900 dark:text-white">Add New Course</h2>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Configure all course details for the platform catalog</p>
                        </div>
                        <button
                          onClick={() => setShowCourseModal(false)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Modal Body / Form */}
                      <form onSubmit={handleCreateCourse} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
                        {courseError && (
                          <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl text-red-600 dark:text-red-400 font-medium">
                            {courseError}
                          </div>
                        )}

                        {/* 1. Title & 2. Subtitle */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                              1. Course Title *
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Master Modern React 19"
                              value={courseForm.title}
                              onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                              2. Subtitle
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Comprehensive guide from zero to hero"
                              value={courseForm.subtitle}
                              onChange={(e) => setCourseForm({ ...courseForm, subtitle: e.target.value })}
                              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none dark:text-white"
                            />
                          </div>
                        </div>

                        {/* 3. Description */}
                        <div>
                          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            3. Description *
                          </label>
                          <textarea
                            rows={3}
                            required
                            placeholder="Provide an in-depth summary of what students will master..."
                            value={courseForm.description}
                            onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none dark:text-white"
                          />
                        </div>

                        {/* 4. Category & 5. Level */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                              4. Category
                            </label>
                            <select
                              value={courseForm.category}
                              onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
                              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none dark:text-white"
                            >
                              {CATEGORIES.map((cat) => (
                                <option key={cat.id || cat.slug} value={cat.name}>
                                  {cat.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                              5. Level
                            </label>
                            <select
                              value={courseForm.level}
                              onChange={(e) => setCourseForm({ ...courseForm, level: e.target.value })}
                              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none dark:text-white capitalize"
                            >
                              <option value="all_levels">All Levels</option>
                              <option value="beginner">Beginner</option>
                              <option value="intermediate">Intermediate</option>
                              <option value="advanced">Advanced</option>
                            </select>
                          </div>
                        </div>

                        {/* 6. Price, 7. Discount Price & 8. Free toggle */}
                        <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-slate-700 dark:text-slate-300">Pricing Configuration</span>
                            <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-600 dark:text-slate-300">
                              <input
                                type="checkbox"
                                checked={courseForm.isFree}
                                onChange={(e) => setCourseForm({ ...courseForm, isFree: e.target.checked })}
                                className="rounded border-slate-300 text-primary-600 focus:ring-primary-500 w-4 h-4"
                              />
                              <span>8. Free Course</span>
                            </label>
                          </div>
                          {!courseForm.isFree && (
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-[11px] font-medium text-slate-500 mb-1">6. Regular Price ($)</label>
                                <input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  value={courseForm.price}
                                  onChange={(e) => setCourseForm({ ...courseForm, price: e.target.value })}
                                  className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg dark:text-white"
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] font-medium text-slate-500 mb-1">7. Discount Price ($)</label>
                                <input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  value={courseForm.discountPrice}
                                  onChange={(e) => setCourseForm({ ...courseForm, discountPrice: e.target.value })}
                                  className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg dark:text-white"
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        {/* 9. Thumbnail & 10. Banner URLs */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                              9. Thumbnail Image URL
                            </label>
                            <input
                              type="url"
                              placeholder="https://..."
                              value={courseForm.thumbnailUrl}
                              onChange={(e) => setCourseForm({ ...courseForm, thumbnailUrl: e.target.value })}
                              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                              10. Banner Image URL
                            </label>
                            <input
                              type="url"
                              placeholder="https://..."
                              value={courseForm.bannerUrl}
                              onChange={(e) => setCourseForm({ ...courseForm, bannerUrl: e.target.value })}
                              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none dark:text-white"
                            />
                          </div>
                        </div>

                        {/* 11. Preview Video URL */}
                        <div>
                          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            11. Preview Video URL
                          </label>
                          <input
                            type="url"
                            placeholder="https://..."
                            value={courseForm.previewVideoUrl}
                            onChange={(e) => setCourseForm({ ...courseForm, previewVideoUrl: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none dark:text-white"
                          />
                        </div>

                        {/* 12. Learning Objectives, 13. Requirements, 14. Target Audience */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                              12. Learning Objectives
                            </label>
                            <textarea
                              rows={2}
                              placeholder="One outcome per line"
                              value={courseForm.learningObjectives}
                              onChange={(e) => setCourseForm({ ...courseForm, learningObjectives: e.target.value })}
                              className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                              13. Requirements
                            </label>
                            <textarea
                              rows={2}
                              placeholder="One per line"
                              value={courseForm.requirements}
                              onChange={(e) => setCourseForm({ ...courseForm, requirements: e.target.value })}
                              className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                              14. Target Audience
                            </label>
                            <textarea
                              rows={2}
                              placeholder="One per line"
                              value={courseForm.targetAudience}
                              onChange={(e) => setCourseForm({ ...courseForm, targetAudience: e.target.value })}
                              className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs dark:text-white"
                            />
                          </div>
                        </div>

                        {/* 15. Status & 16. Badge */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                              15. Publication Status
                            </label>
                            <select
                              value={courseForm.status}
                              onChange={(e) => setCourseForm({ ...courseForm, status: e.target.value })}
                              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white capitalize"
                            >
                              <option value="published">Published</option>
                              <option value="draft">Draft</option>
                            </select>
                          </div>
                          <div>
                            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                              16. Promotional Badge
                            </label>
                            <select
                              value={courseForm.badge}
                              onChange={(e) => setCourseForm({ ...courseForm, badge: e.target.value })}
                              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl dark:text-white"
                            >
                              <option value="none">None</option>
                              <option value="Bestseller">Bestseller</option>
                              <option value="Trending">Trending</option>
                              <option value="New">New</option>
                              <option value="Premium">Premium</option>
                            </select>
                          </div>
                        </div>

                        {/* Modal Actions */}
                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                          <button
                            type="button"
                            onClick={() => setShowCourseModal(false)}
                            className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={courseSaving}
                            className="flex items-center gap-2 px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-all shadow-sm disabled:opacity-60"
                          >
                            {courseSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                            <span>{courseSaving ? 'Creating Course...' : 'Create Course'}</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ===== LEARNING PATHS ===== */}
            {activeTab === 'learning-paths' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">IT Career Learning Paths</h1>
                    <p className="text-xs text-slate-400 mt-0.5">{allLearningPaths.length} career roadmaps configured</p>
                  </div>
                  <button
                    onClick={() => setShowPathModal(true)}
                    className="flex items-center gap-2 px-3.5 py-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-xs rounded-xl transition-all shadow-sm active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Learning Path</span>
                  </button>
                </div>

                {/* Learning Paths Table */}
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-premium shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800/50">
                          <th className="text-left px-6 py-4 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Learning Path</th>
                          <th className="text-left px-4 py-4 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Category</th>
                          <th className="text-left px-4 py-4 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Difficulty</th>
                          <th className="text-center px-4 py-4 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Courses</th>
                          <th className="text-center px-4 py-4 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Enrolled</th>
                          <th className="text-center px-4 py-4 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                          <th className="text-right px-6 py-4 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {allLearningPaths.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="text-center py-12 text-slate-400">
                              No learning paths found. Create one using the button above.
                            </td>
                          </tr>
                        ) : (
                          allLearningPaths.map((pathItem) => (
                            <tr key={pathItem.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                              <td className="px-6 py-4">
                                <div className="flex items-center space-x-3">
                                  <img
                                    src={pathItem.banner_url || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=300'}
                                    alt=""
                                    className="w-14 h-9 rounded-lg object-cover flex-shrink-0"
                                  />
                                  <div>
                                    <Link
                                      to={`/learning-paths/${pathItem.slug || pathItem.id}`}
                                      target="_blank"
                                      className="font-bold text-slate-900 dark:text-white hover:text-primary-600 transition-colors line-clamp-1 max-w-xs"
                                    >
                                      {pathItem.title}
                                    </Link>
                                    <p className="text-[10px] text-slate-400 line-clamp-1">{pathItem.slug}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-4 font-medium text-slate-600 dark:text-slate-300">
                                {pathItem.category || 'Development'}
                              </td>
                              <td className="px-4 py-4">
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 capitalize">
                                  {pathItem.difficulty?.replace('_', ' ') || 'All Levels'}
                                </span>
                              </td>
                              <td className="px-4 py-4 text-center font-bold text-slate-700 dark:text-slate-300">
                                {pathItem.total_courses || 3}
                              </td>
                              <td className="px-4 py-4 text-center text-slate-500 dark:text-slate-400">
                                {(pathItem.enrolled_count || 0).toLocaleString()}
                              </td>
                              <td className="px-4 py-4 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleTogglePublishPath(pathItem.id, pathItem.is_published)}
                                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-colors cursor-pointer ${
                                    pathItem.is_published
                                      ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200'
                                      : 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-200'
                                  }`}
                                >
                                  {pathItem.is_published ? 'Published' : 'Draft'}
                                </button>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end space-x-2">
                                  <Link
                                    to={`/learning-paths/${pathItem.slug || pathItem.id}`}
                                    target="_blank"
                                    className="p-1.5 text-slate-400 hover:text-primary-600 transition-colors"
                                    title="View Public Page"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Link>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteLearningPath(pathItem.id)}
                                    className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                                    title="Delete Learning Path"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Create Learning Path Modal */}
                {showPathModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 my-8">
                      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center space-x-2">
                          <Route className="w-5 h-5 text-primary-600" />
                          <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                            Create New Career Learning Path
                          </h2>
                        </div>
                        <button
                          onClick={() => setShowPathModal(false)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <form onSubmit={handleCreateLearningPath} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
                        {pathError && (
                          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-700 dark:text-rose-300 rounded-xl">
                            {pathError}
                          </div>
                        )}

                        <div>
                          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Path Title *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. AI / Machine Learning Engineer Learning Path"
                            value={pathForm.title}
                            onChange={(e) => setPathForm({ ...pathForm, title: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none dark:text-white"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                              Category
                            </label>
                            <select
                              value={pathForm.category}
                              onChange={(e) => setPathForm({ ...pathForm, category: e.target.value })}
                              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none dark:text-white"
                            >
                              <option value="Software Development">Software Development</option>
                              <option value="Data & AI">Data & AI</option>
                              <option value="Cloud & DevOps">Cloud & DevOps</option>
                              <option value="Cybersecurity">Cybersecurity</option>
                              <option value="Design & UX">Design & UX</option>
                              <option value="Quality Assurance">Quality Assurance</option>
                            </select>
                          </div>

                          <div>
                            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                              Difficulty
                            </label>
                            <select
                              value={pathForm.difficulty}
                              onChange={(e) => setPathForm({ ...pathForm, difficulty: e.target.value })}
                              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none dark:text-white"
                            >
                              <option value="all_levels">All Levels</option>
                              <option value="beginner">Beginner</option>
                              <option value="intermediate">Intermediate</option>
                              <option value="advanced">Advanced</option>
                            </select>
                          </div>

                          <div>
                            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                              Duration (Weeks)
                            </label>
                            <input
                              type="number"
                              min={1}
                              value={pathForm.duration_weeks}
                              onChange={(e) => setPathForm({ ...pathForm, duration_weeks: Number(e.target.value) })}
                              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none dark:text-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Description *
                          </label>
                          <textarea
                            rows={3}
                            required
                            placeholder="Provide a comprehensive summary of this career track and who it is for..."
                            value={pathForm.description}
                            onChange={(e) => setPathForm({ ...pathForm, description: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none dark:text-white"
                          />
                        </div>

                        <div>
                          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Banner Image URL
                          </label>
                          <input
                            type="url"
                            value={pathForm.banner_url}
                            onChange={(e) => setPathForm({ ...pathForm, banner_url: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none dark:text-white"
                          />
                        </div>

                        <div>
                          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Key Skills (comma-separated)
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. React, Node.js, TypeScript, PostgreSQL"
                            value={pathForm.key_skills}
                            onChange={(e) => setPathForm({ ...pathForm, key_skills: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none dark:text-white"
                          />
                        </div>

                        <div>
                          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Tools & Technologies (comma-separated)
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Git, Docker, VS Code, Postman"
                            value={pathForm.tools_and_technologies}
                            onChange={(e) => setPathForm({ ...pathForm, tools_and_technologies: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none dark:text-white"
                          />
                        </div>

                        <div>
                          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            Target Job Outcomes (comma-separated)
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Full Stack Developer, Software Engineer"
                            value={pathForm.career_outcomes}
                            onChange={(e) => setPathForm({ ...pathForm, career_outcomes: e.target.value })}
                            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:outline-none dark:text-white"
                          />
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                          <button
                            type="button"
                            onClick={() => setShowPathModal(false)}
                            className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={pathSaving}
                            className="flex items-center gap-2 px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-all shadow-sm disabled:opacity-60"
                          >
                            {pathSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                            <span>{pathSaving ? 'Creating...' : 'Create Learning Path'}</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ===== APTITUDE ARENA ===== */}
            {activeTab === 'aptitude' && (
              <div className="space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                      <Target className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      <span>Aptitude Arena & Placement Management</span>
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Manage campus recruitment questions, topic taxonomy, and placement exam simulations.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      to="/aptitude"
                      target="_blank"
                      className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-50 flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" /> View Arena
                    </Link>
                    <Link
                      to="/aptitude/practice"
                      target="_blank"
                      className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" /> Practice
                    </Link>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xs">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Total Questions</span>
                    <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                      {aptitudeQuestions.length}
                    </div>
                  </div>
                  <div className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xs">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Categories</span>
                    <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
                      {aptitudeCategories.length || 4}
                    </div>
                  </div>
                  <div className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xs">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Topic Modules</span>
                    <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                      36
                    </div>
                  </div>
                  <div className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xs">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Placement Mocks</span>
                    <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                      {aptitudeMockTests.length || 5}
                    </div>
                  </div>
                </div>

                {/* Placement Mock Tests Table */}
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden space-y-4 p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Placement Exam Blueprints ({aptitudeMockTests.length})
                    </h3>
                    <Link to="/aptitude/mock-tests" target="_blank" className="text-xs text-indigo-600 font-bold hover:underline">
                      View Catalog
                    </Link>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800/50 text-[11px] font-bold uppercase text-slate-400">
                          <th className="text-left px-4 py-3">Exam Title</th>
                          <th className="text-left px-4 py-3">Slug</th>
                          <th className="text-center px-4 py-3">Duration</th>
                          <th className="text-center px-4 py-3">Questions</th>
                          <th className="text-right px-4 py-3">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {aptitudeMockTests.map((t) => (
                          <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                            <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">{t.title}</td>
                            <td className="px-4 py-3 text-slate-500 font-mono text-[11px]">{t.slug}</td>
                            <td className="px-4 py-3 text-center">{t.duration_minutes} mins</td>
                            <td className="px-4 py-3 text-center font-bold">{t.question_count || t.question_ids?.length || 20}</td>
                            <td className="px-4 py-3 text-right">
                              <Link
                                to={`/aptitude/mock-tests/${t.slug}`}
                                target="_blank"
                                className="text-indigo-600 font-bold hover:underline inline-flex items-center gap-1"
                              >
                                Test <Eye className="w-3.5 h-3.5" />
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Questions Bank Table */}
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden space-y-4 p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Curated Questions Bank ({aptitudeQuestions.length})
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800/50 text-[11px] font-bold uppercase text-slate-400">
                          <th className="text-left px-4 py-3">Topic / Category</th>
                          <th className="text-left px-4 py-3">Question Prompt</th>
                          <th className="text-center px-4 py-3">Difficulty</th>
                          <th className="text-center px-4 py-3">Answer</th>
                          <th className="text-right px-4 py-3">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {aptitudeQuestions.map((q) => (
                          <tr key={q.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                            <td className="px-4 py-3 font-semibold text-indigo-600 whitespace-nowrap">
                              {q.topic_name || q.topic_id}
                            </td>
                            <td className="px-4 py-3 text-slate-800 dark:text-slate-200 line-clamp-2 max-w-md">
                              {q.question_text}
                            </td>
                            <td className="px-4 py-3 text-center whitespace-nowrap">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800">
                                {q.difficulty || 'Easy'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center font-bold text-emerald-600">
                              {q.correct_option || 'A'}
                            </td>
                            <td className="px-4 py-3 text-right whitespace-nowrap">
                              <button
                                type="button"
                                onClick={() => handleDeleteAptitudeQuestion(q.id)}
                                className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                                title="Delete Question"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ===== USERS ===== */}
            {activeTab === 'users' && (
              <div className="space-y-6">
                <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Users & Students ({allUsers.length})</h1>
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-premium shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800/50">
                          <th className="text-left px-6 py-4 font-bold text-slate-500 uppercase tracking-wider">User</th>
                          <th className="text-left px-6 py-4 font-bold text-slate-500 uppercase tracking-wider">Email</th>
                          <th className="text-left px-6 py-4 font-bold text-slate-500 uppercase tracking-wider">Role</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {allUsers.map(u => (
                          <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-3">
                                {u.avatarUrl ? (
                                  <img src={u.avatarUrl} alt={u.fullName} className="w-8 h-8 rounded-lg object-cover" />
                                ) : (
                                  <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 font-bold text-xs">{(u.fullName || u.email || 'U')[0].toUpperCase()}</div>
                                )}
                                <span className="font-semibold text-slate-900 dark:text-white">{u.fullName || 'Unnamed'}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{u.email}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 text-[9px] font-bold rounded-full uppercase ${
                                u.role === 'admin' ? 'bg-secondary-100 dark:bg-secondary-950/20 text-secondary-600 dark:text-secondary-400' :
                                u.role === 'teacher' ? 'bg-blue-100 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400' :
                                'bg-green-100 dark:bg-green-950/20 text-green-600 dark:text-green-400'
                              }`}>
                                {u.role}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ===== ORDERS ===== */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Orders ({allOrders.length})</h1>
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-premium shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800/50">
                          <th className="text-left px-6 py-4 font-bold text-slate-500 uppercase tracking-wider">Order ID</th>
                          <th className="text-left px-6 py-4 font-bold text-slate-500 uppercase tracking-wider">Date</th>
                          <th className="text-right px-6 py-4 font-bold text-slate-500 uppercase tracking-wider">Total</th>
                          <th className="text-left px-6 py-4 font-bold text-slate-500 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {allOrders.map(order => (
                          <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                            <td className="px-6 py-4 font-mono text-slate-600 dark:text-slate-300">{order.id}</td>
                            <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{new Date(order.createdAt).toLocaleDateString()}</td>
                            <td className="px-6 py-4 text-right font-bold text-slate-900 dark:text-white">{formatINR(order.grandTotal || 0)}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 text-[9px] font-bold rounded-full uppercase ${
                                order.status === 'completed' ? 'bg-green-100 text-green-700' :
                                order.status === 'failed' ? 'bg-red-100 text-red-700' :
                                'bg-amber-100 text-amber-700'
                              }`}>
                                {order.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ===== COUPONS ===== */}
            {activeTab === 'coupons' && (
              <div className="space-y-6">
                <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Coupon Manager</h1>
                {/* Add Coupon Form */}
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-premium p-6 shadow-sm">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-4">Create New Coupon</h3>
                  <form onSubmit={handleAddCoupon} className="flex flex-wrap gap-4 items-end">
                    <div className="space-y-1.5 text-xs flex-1 min-w-32">
                      <label className="font-semibold text-slate-600 dark:text-slate-400">Coupon Code</label>
                      <input
                        type="text"
                        value={couponForm.code}
                        onChange={e => setCouponForm(p => ({ ...p, code: e.target.value.toUpperCase() }))}
                        placeholder="SUMMER25"
                        required
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono focus:outline-none focus:ring-1 focus:ring-primary-500 text-slate-900 dark:text-slate-100"
                      />
                    </div>
                    <div className="space-y-1.5 text-xs w-32">
                      <label className="font-semibold text-slate-600 dark:text-slate-400">Discount %</label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={couponForm.discountPercent}
                        onChange={e => setCouponForm(p => ({ ...p, discountPercent: e.target.value }))}
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary-500 text-slate-900 dark:text-slate-100"
                      />
                    </div>
                    <button type="submit" disabled={couponSaving} className="flex items-center space-x-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl transition-colors disabled:opacity-60">
                      <PlusCircle className="w-4 h-4" />
                      <span>Add Coupon</span>
                    </button>
                  </form>
                </div>
                {/* Coupons Table */}
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-premium shadow-sm overflow-hidden">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-800/50">
                        <th className="text-left px-6 py-4 font-bold text-slate-500 uppercase tracking-wider">Code</th>
                        <th className="text-right px-6 py-4 font-bold text-slate-500 uppercase tracking-wider">Discount</th>
                        <th className="text-left px-6 py-4 font-bold text-slate-500 uppercase tracking-wider">Status</th>
                        <th className="text-right px-6 py-4 font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {coupons.map(c => (
                        <tr key={c.code} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                          <td className="px-6 py-4 font-mono font-bold text-slate-900 dark:text-white">{c.code}</td>
                          <td className="px-6 py-4 text-right text-primary-600 dark:text-primary-400 font-bold">{c.discountPercent}% OFF</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 text-[9px] font-bold rounded-full uppercase ${c.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                              {c.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button onClick={() => handleDeleteCoupon(c.id)} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ===== REVIEWS ===== */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Student Reviews ({allReviews.length})</h1>
                <div className="space-y-4">
                  {allReviews.map(rev => (
                    <div key={rev.id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-premium p-5 shadow-sm space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-sm text-slate-900 dark:text-white">{rev.userName}</p>
                          <p className="text-[10px] text-slate-400">{new Date(rev.createdAt).toLocaleDateString()} • Course: {rev.courseId}</p>
                        </div>
                        <div className="flex text-amber-500">
                          {[...Array(5)].map((_, i) => <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-current' : ''}`} />)}
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ===== FAQ ===== */}
            {activeTab === 'faq' && (
              <div className="space-y-6">
                <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">FAQ Manager</h1>
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-premium p-6 shadow-sm space-y-4">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">Add New FAQ</h3>
                  <form onSubmit={handleAddFaq} className="space-y-4">
                    <div className="space-y-1.5 text-xs">
                      <label className="font-semibold text-slate-600 dark:text-slate-400">Question</label>
                      <input
                        type="text"
                        value={faqForm.question}
                        onChange={e => setFaqForm(p => ({ ...p, question: e.target.value }))}
                        placeholder="Enter the question..."
                        required
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary-500 text-slate-900 dark:text-slate-100"
                      />
                    </div>
                    <div className="space-y-1.5 text-xs">
                      <label className="font-semibold text-slate-600 dark:text-slate-400">Answer</label>
                      <textarea
                        rows={3}
                        value={faqForm.answer}
                        onChange={e => setFaqForm(p => ({ ...p, answer: e.target.value }))}
                        placeholder="Enter the answer..."
                        required
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary-500 text-slate-900 dark:text-slate-100 resize-none"
                      ></textarea>
                    </div>
                    <button type="submit" disabled={faqSaving} className="flex items-center space-x-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl transition-colors">
                      <PlusCircle className="w-4 h-4" />
                      <span>Add FAQ</span>
                    </button>
                  </form>
                </div>
                <div className="space-y-3">
                  {faqs.map(faq => (
                    <div key={faq.id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-premium p-5 shadow-sm flex items-start space-x-4">
                      <div className="flex-grow space-y-2">
                        <p className="font-bold text-xs text-slate-900 dark:text-white">{faq.question}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{faq.answer}</p>
                      </div>
                      <button onClick={() => handleDeleteFaq(faq.id)} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors flex-shrink-0">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ===== MESSAGES ===== */}
            {activeTab === 'messages' && (
              <div className="space-y-6">
                <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Contact Messages ({contactMessages.length})</h1>
                <div className="space-y-4">
                  {contactMessages.length === 0 ? (
                    <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-premium border border-slate-100 dark:border-slate-800 space-y-3">
                      <MessageSquare className="w-12 h-12 text-slate-300 mx-auto" />
                      <p className="text-sm text-slate-500">No contact messages yet</p>
                    </div>
                  ) : contactMessages.map(msg => (
                    <div key={msg.id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-premium p-5 shadow-sm space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-bold text-sm text-slate-900 dark:text-white">{msg.name}</p>
                          <p className="text-[10px] text-slate-400">{msg.email} • {new Date(msg.createdAt).toLocaleDateString()}</p>
                          {msg.subject && <p className="text-xs font-medium text-slate-600 dark:text-slate-300 mt-1">Subject: {msg.subject}</p>}
                        </div>
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          {msg.is_resolved ? (
                            <span className="px-2 py-1 bg-green-100 dark:bg-green-950/20 text-green-700 dark:text-green-400 text-[9px] font-bold rounded-full flex items-center space-x-1">
                              <CheckCircle2 className="w-3 h-3" /><span>Resolved</span>
                            </span>
                          ) : (
                            <button onClick={() => handleResolveMessage(msg.id)} className="px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white text-[10px] font-semibold rounded-lg transition-colors">
                              Mark Resolved
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800 p-3 rounded-xl">
                        {msg.message}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ===== SETTINGS ===== */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Platform Settings</h1>
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-premium p-8 shadow-sm space-y-6">
                  {[
                    { label: 'Platform Name', defaultValue: 'EduAcademy', type: 'text' },
                    { label: 'Support Email', defaultValue: 'support@eduacademy.com', type: 'email' },
                    { label: 'Tax Rate (%)', defaultValue: '5', type: 'number' },
                    { label: 'Default Currency', defaultValue: 'USD', type: 'text' },
                  ].map(({ label, defaultValue, type }) => (
                    <div key={label} className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-5">
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{label}</p>
                        <p className="text-xs text-slate-400 mt-0.5">Current value: {defaultValue}</p>
                      </div>
                      <input
                        type={type}
                        defaultValue={defaultValue}
                        className="w-40 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-primary-500"
                      />
                    </div>
                  ))}
                  <button className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm rounded-premium transition-colors shadow-md">
                    Save Settings
                  </button>
                </div>
              </div>
            )}

          </div>
        </PageTransition>
      </main>
    </div>
  );
};
