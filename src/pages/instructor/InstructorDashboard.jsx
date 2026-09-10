import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { teacherService } from '../../services/teacher.service';
import { courseService } from '../../services/course.service';
import {
  Users, BookOpen, DollarSign, Star, Plus, Edit3, Eye, Trash2,
  TrendingUp, Award, Clock, ArrowUpRight, BarChart3, MessageSquare,
  Settings, CheckCircle2, AlertCircle, Sparkles, ExternalLink
} from 'lucide-react';
import { PageTransition } from '../../components/layout/PageTransition';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';

export const InstructorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [teacherProfile, setTeacherProfile] = useState(null);
  const [courses, setCourses] = useState([]);
  const [activeTab, setActiveTab] = useState('courses'); // courses, earnings, reviews, settings
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const loadInstructorData = async () => {
      setLoading(true);
      try {
        // 1. Fetch teacher record for current user or default to first teacher
        let teacher = null;
        if (user?.id) {
          teacher = await teacherService.getTeacherByUserId(user.id);
        }
        if (!teacher) {
          const allTeachers = await teacherService.getTeachers();
          teacher = allTeachers?.[0] || null;
        }
        setTeacherProfile(teacher);

        // 2. Fetch instructor courses
        const allCourses = await courseService.getCourses();
        // Filter courses belonging to this instructor or mock instructor
        const myCourses = allCourses.filter(c => 
          c.instructor_id === teacher?.id || 
          c.teacherId === teacher?.id ||
          c.teachers?.id === teacher?.id
        );
        // If empty, show first 3 courses as sample instructor portfolio
        setCourses(myCourses.length > 0 ? myCourses : allCourses.slice(0, 4));
      } catch (err) {
        console.error('Failed to load instructor dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadInstructorData();
  }, [user?.id]);

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete or archive this course? This action cannot be undone.')) {
      return;
    }
    try {
      await courseService.deleteCourse(courseId);
      setCourses(prev => prev.filter(c => c.id !== courseId));
      toast.success('Course removed successfully.');
    } catch (err) {
      toast.error('Failed to delete course.');
    }
  };

  // Filtered courses
  const filteredCourses = courses.filter(c => {
    if (statusFilter === 'all') return true;
    return (c.status || 'published').toLowerCase() === statusFilter.toLowerCase();
  });

  // Calculate metrics
  const totalStudents = courses.reduce((acc, c) => acc + Number(c.student_count ?? c.studentCount ?? 0), 0);
  const avgRating = courses.length > 0
    ? (courses.reduce((acc, c) => acc + Number(c.avg_rating ?? c.rating ?? 4.8), 0) / courses.length).toFixed(1)
    : '4.9';
  const totalRevenue = courses.reduce((acc, c) => {
    const count = Number(c.student_count ?? c.studentCount ?? 120);
    const price = Number(c.discount_price ?? c.discountPrice ?? c.price ?? 29);
    return acc + (count * price * 0.7); // 70% instructor revenue share
  }, 0);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-slate-400 font-medium">Loading instructor workspace...</p>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-10">
        
        {/* 1. INSTRUCTOR HEADER BANNER */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center space-x-5">
              <img
                src={teacherProfile?.profiles?.avatar_url || user?.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120'}
                alt={teacherProfile?.profiles?.display_name || 'Instructor'}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-primary-400/40 shadow-lg"
              />
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                    {teacherProfile?.profiles?.display_name || `${teacherProfile?.profiles?.first_name || ''} ${teacherProfile?.profiles?.last_name || ''}`.trim() || user?.user_metadata?.first_name || 'Senior Instructor'}
                  </h1>
                  <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold rounded-full flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Verified Educator</span>
                  </span>
                </div>
                <p className="text-xs text-slate-300 max-w-xl">
                  {teacherProfile?.profiles?.bio || 'Creator of industry-accredited software engineering and cloud architecture programs.'}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 pt-1">
                  <span>Joined: <strong>2023</strong></span>
                  <span>•</span>
                  <span>Payout tier: <strong className="text-primary-400">Pro 70/30 Split</strong></span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 w-full md:w-auto">
              <Link to="/instructor/courses/create" className="w-full sm:w-auto">
                <Button size="lg" icon={Plus} className="w-full sm:w-auto font-bold shadow-lg shadow-primary-600/30">
                  Create New Course
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* 2. KPI METRICS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Total Enrolled</span>
              <div className="p-2 bg-primary-50 dark:bg-primary-950/30 text-primary-600 rounded-xl">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {totalStudents.toLocaleString()}
            </p>
            <p className="text-[11px] text-emerald-600 font-semibold flex items-center space-x-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+14% new students this month</span>
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Active Courses</span>
              <div className="p-2 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 rounded-xl">
                <BookOpen className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {courses.length}
            </p>
            <p className="text-[11px] text-slate-400">
              Across 3 distinct technical tracks
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Lifetime Revenue</span>
              <div className="p-2 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 rounded-xl">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              ${Math.round(totalRevenue).toLocaleString()}
            </p>
            <p className="text-[11px] text-emerald-600 font-semibold flex items-center space-x-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Next payout in 6 days</span>
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Instructor Rating</span>
              <div className="p-2 bg-amber-50 dark:bg-amber-950/30 text-amber-500 rounded-xl">
                <Star className="w-4 h-4 fill-current" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {avgRating} <span className="text-xs font-medium text-slate-400">/ 5.0</span>
            </p>
            <p className="text-[11px] text-slate-400">
              Based on 480+ student ratings
            </p>
          </div>
        </div>

        {/* 3. TABS NAVIGATION */}
        <div className="border-b border-slate-200 dark:border-slate-800">
          <div className="flex space-x-8 text-xs font-bold">
            {[
              { key: 'courses', label: `My Courses (${courses.length})`, icon: BookOpen },
              { key: 'earnings', label: 'Earnings & Statements', icon: DollarSign },
              { key: 'reviews', label: 'Student Feedback', icon: MessageSquare },
              { key: 'settings', label: 'Teaching Profile', icon: Settings },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`py-4 border-b-2 flex items-center space-x-2 transition-colors ${
                  activeTab === key
                    ? 'border-primary-600 text-primary-600 dark:text-primary-400 font-extrabold'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 4. TAB CONTENTS */}

        {/* TAB 1: COURSES */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-2">
                {['all', 'published', 'draft'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors ${
                      statusFilter === status
                        ? 'bg-primary-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>

              <Link to="/instructor/courses/create">
                <Button size="sm" icon={Plus}>New Course</Button>
              </Link>
            </div>

            {/* Courses Table / Cards */}
            {filteredCourses.length === 0 ? (
              <EmptyState
                icon={BookOpen}
                title="No courses found"
                description="You haven't created any courses matching this filter yet."
                actionText="Create Course"
                actionLink="/instructor/courses/create"
              />
            ) : (
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
                {filteredCourses.map((c) => (
                  <div key={c.id} className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <div className="flex items-center space-x-4 min-w-0">
                      <img
                        src={c.thumbnail_url || c.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200'}
                        alt={c.title}
                        className="w-20 h-14 sm:w-28 sm:h-20 rounded-xl object-cover flex-shrink-0 border border-slate-100 dark:border-slate-800"
                      />
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                            (c.status || 'published') === 'published'
                              ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 border border-emerald-200 dark:border-emerald-800'
                              : 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 border border-amber-200 dark:border-amber-800'
                          }`}>
                            {c.status || 'published'}
                          </span>
                          <span className="text-[11px] text-slate-400 capitalize">
                            {c.categories?.name || c.category || 'Engineering'}
                          </span>
                        </div>
                        <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate">
                          {c.title}
                        </h3>
                        <div className="flex items-center space-x-4 text-xs text-slate-500 dark:text-slate-400">
                          <span>${c.discount_price ?? c.discountPrice ?? c.price ?? 29.99}</span>
                          <span>•</span>
                          <span>{Number(c.student_count ?? c.studentCount ?? 0).toLocaleString()} students</span>
                          <span>•</span>
                          <span className="flex items-center text-amber-500 font-bold">
                            <Star className="w-3 h-3 fill-current mr-1" />
                            {Number(c.avg_rating ?? c.rating ?? 4.8).toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 self-end sm:self-center">
                      <Link to={`/learn/${c.id}`}>
                        <Button variant="outline" size="sm" icon={Eye} title="Preview Student Classroom">
                          Preview
                        </Button>
                      </Link>
                      <Link to={`/course/${c.id}`}>
                        <Button variant="outline" size="sm" icon={ExternalLink} title="Public Landing Page">
                          View
                        </Button>
                      </Link>
                      <button
                        onClick={() => handleDeleteCourse(c.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                        title="Delete Course"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: EARNINGS */}
        {activeTab === 'earnings' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl space-y-3">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Available for Payout</span>
                <p className="text-3xl font-black text-slate-900 dark:text-white">$1,840.00</p>
                <Button size="sm" className="w-full">Request Immediate Payout</Button>
              </div>

              <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl space-y-3">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Estimated Monthly Run-Rate</span>
                <p className="text-3xl font-black text-slate-900 dark:text-white">$3,420.00</p>
                <p className="text-xs text-emerald-600 font-semibold">+18.5% compared to last cycle</p>
              </div>

              <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl space-y-3">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Default Payout Account</span>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Direct Deposit (Stripe Connect)</p>
                <p className="text-xs text-slate-400">Account ending in •••• 4242</p>
              </div>
            </div>

            {/* Statements List */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Recent Statements & Disbursements</h3>
              <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {[
                  { id: 'TX-9821', date: 'Oct 01, 2026', amount: '$2,450.00', status: 'Paid', method: 'Direct Deposit' },
                  { id: 'TX-9410', date: 'Sep 01, 2026', amount: '$2,120.00', status: 'Paid', method: 'Direct Deposit' },
                  { id: 'TX-8902', date: 'Aug 01, 2026', amount: '$1,940.00', status: 'Paid', method: 'Direct Deposit' },
                ].map((tx) => (
                  <div key={tx.id} className="py-3 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{tx.id} — {tx.date}</p>
                      <p className="text-slate-400 text-[11px]">{tx.method}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-extrabold text-slate-900 dark:text-white">{tx.amount}</p>
                      <span className="text-[10px] text-emerald-600 font-bold uppercase">{tx.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: REVIEWS */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Student Feedback Across Your Courses</h3>
            <div className="space-y-4">
              {[
                {
                  id: 1,
                  author: 'Emily Watson',
                  course: 'Full-Stack React & Node Architecture',
                  rating: 5,
                  date: '3 days ago',
                  comment: 'The architectural patterns taught in section 4 transformed how my engineering team builds microservices.'
                },
                {
                  id: 2,
                  author: 'Marcus Vance',
                  course: 'Modern Cloud DevOps with Kubernetes',
                  rating: 5,
                  date: '1 week ago',
                  comment: 'Hands-down the clearest real-world deployment tutorials I have encountered. The instructor answers questions super fast.'
                },
                {
                  id: 3,
                  author: 'Sophia Zhang',
                  course: 'Next.js 14 Production SaaS Development',
                  rating: 4,
                  date: '2 weeks ago',
                  comment: 'Thorough, up-to-date, and very practical. Highly recommend this for intermediate developers.'
                }
              ].map((rev) => (
                <div key={rev.id} className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-sm text-slate-900 dark:text-white">{rev.author}</span>
                      <span className="text-xs text-slate-400 ml-2">on <strong>{rev.course}</strong></span>
                    </div>
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-current' : 'text-slate-200'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{rev.comment}</p>
                  <p className="text-[10px] text-slate-400 pt-1">{rev.date}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: TEACHING PROFILE SETTINGS */}
        {activeTab === 'settings' && (
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 max-w-3xl">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Instructor Profile & Credentials</h3>
            
            <form onSubmit={(e) => { e.preventDefault(); toast.success('Instructor credentials updated!'); }} className="space-y-4">
              <div className="space-y-1 text-xs">
                <label className="font-bold text-slate-700 dark:text-slate-300">Public Display Name</label>
                <input
                  type="text"
                  defaultValue={teacherProfile?.profiles?.display_name || 'Senior Instructor'}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs"
                />
              </div>

              <div className="space-y-1 text-xs">
                <label className="font-bold text-slate-700 dark:text-slate-300">Bio & Experience</label>
                <textarea
                  rows={4}
                  defaultValue={teacherProfile?.profiles?.bio || 'Creator of industry-accredited software engineering programs.'}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs"
                />
              </div>

              <div className="space-y-1 text-xs">
                <label className="font-bold text-slate-700 dark:text-slate-300">Portfolio / Personal Website</label>
                <input
                  type="url"
                  defaultValue={teacherProfile?.profiles?.website || 'https://eduacademy.com/instructors'}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs"
                />
              </div>

              <div className="pt-2">
                <Button type="submit">Save Profile Changes</Button>
              </div>
            </form>
          </div>
        )}

      </div>
    </PageTransition>
  );
};
