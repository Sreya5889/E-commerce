import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { adminService } from '../../services/admin.service';
import { faqService } from '../../services/faq.service';
import { couponService } from '../../services/coupon.service';
import { contactService } from '../../services/contact.service';
import { courseService } from '../../services/course.service';
import { PageTransition } from '../../components/layout/PageTransition';
import {
  BarChart2, Users, BookOpen, DollarSign, TrendingUp,
  GraduationCap, ShieldCheck, Settings, MessageSquare, HelpCircle,
  Tag, Package, Star, LogOut, Loader2, Check, Trash2, X,
  LayoutDashboard, PlusCircle, Eye, CheckCircle2, AlertCircle
} from 'lucide-react';
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
  const [loading, setLoading] = useState(false);

  // FAQ add form
  const [faqForm, setFaqForm] = useState({ question: '', answer: '' });
  const [faqSaving, setFaqSaving] = useState(false);

  // Coupon add form
  const [couponForm, setCouponForm] = useState({ code: '', discountPercent: 10 });
  const [couponSaving, setCouponSaving] = useState(false);

  const setTab = (key) => setSearchParams({ tab: key });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [stats, courses_, faqs_, msgs_, coupons_, users_, orders_] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getCourses(),
        faqService.getAllFAQs(),
        contactService.getContactMessages(),
        couponService.getActiveCoupons(),
        adminService.getUsers(),
        adminService.getOrders(),
      ]);
      setAnalytics(stats);
      setAllCourses(courses_ || []);
      setFaqs(faqs_ || []);
      setContactMessages(msgs_ || []);
      setCoupons(coupons_ || []);
      setAllUsers(users_ || []);
      setAllOrders(orders_ || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

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
                        { label: 'Total Revenue', value: `$${(totalRevenue || 0).toFixed(0)}`, icon: DollarSign, color: 'emerald' },
                        { label: 'Monthly Revenue', value: `$${(Number(stats.monthly_revenue ?? totalRevenue * 0.15 ?? 0) || 0).toFixed(0)}`, icon: TrendingUp, color: 'indigo' },
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
                                <td className="px-6 py-4 text-right text-slate-600 dark:text-slate-300 font-medium">${(course.discountPrice || course.price).toFixed(2)}</td>
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
                  <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Course Management</h1>
                  <span className="text-xs text-slate-400">{allCourses.length} total courses</span>
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
                                <img src={course.thumbnail_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200'} alt="" className="w-12 h-8 rounded-lg object-cover" />
                                <div className="min-w-0">
                                  <p className="font-semibold text-slate-900 dark:text-white line-clamp-1 max-w-xs">{course.title}</p>
                                  {course.badge && (
                                    <span className="px-1.5 py-0.5 bg-amber-100 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 text-[9px] font-bold rounded">{course.badge}</span>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{course.category}</td>
                            <td className="px-6 py-4 text-right font-semibold text-slate-900 dark:text-white">${(course.discountPrice || course.price).toFixed(2)}</td>
                            <td className="px-6 py-4 text-right text-slate-500 dark:text-slate-400">{course.studentCount?.toLocaleString()}</td>
                            <td className="px-6 py-4 text-right text-amber-500 font-bold">★ {course.rating}</td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end space-x-2">
                                <Link to={`/course/${course.id}`} className="p-1.5 text-slate-400 hover:text-primary-600 transition-colors">
                                  <Eye className="w-4 h-4" />
                                </Link>
                                <button onClick={() => handleDeleteCourse(course.id)} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors">
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
                            <td className="px-6 py-4 text-right font-bold text-slate-900 dark:text-white">${order.grandTotal?.toFixed(2)}</td>
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
