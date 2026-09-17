import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { enrollmentService } from '../../services/enrollment.service';
import { certificateService } from '../../services/certificate.service';
import { notificationService } from '../../services/notification.service';
import { orderService } from '../../services/order.service';
import { profileService } from '../../services/profile.service';
import { progressService } from '../../services/progress.service';
import { messageService } from '../../services/message.service';
import { courseService } from '../../services/course.service';
import { learningPathService } from '../../services/learningPath.service';
import { aptitudeService } from '../../services/aptitude.service';
import { codelabService } from '../../services/codelab.service';
import { projectService } from '../../services/project.service';
import { careerService } from '../../services/career.service';
import { jobService } from '../../services/job.service';
import { PageTransition } from '../../components/layout/PageTransition';
import { CourseCard } from '../../components/ui/CourseCard';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { EmptyState } from '../../components/ui/EmptyState';
import { formatINR } from '../../utils/currency';
import {
  LayoutDashboard,
  BookOpen,
  Heart,
  Award,
  ShoppingBag,
  Bell,
  MessageSquare,
  Settings,
  User,
  Star,
  CheckCircle2,
  Circle,
  Download,
  Send,
  Camera,
  LogOut,
  TrendingUp,
  Clock,
  ChevronRight,
  PlayCircle,
  ExternalLink,
  Route,
  Target,
  Code2,
  FolderGit2,
  Compass,
  Briefcase,
  Zap
} from 'lucide-react';

const TABS = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'courses', label: 'My Courses', icon: BookOpen },
  { key: 'learning-paths', label: 'Career Roadmaps', icon: Route },
  { key: 'codelab', label: 'CodeLab (DSA & SQL)', icon: Code2 },
  { key: 'projects', label: 'Project Portfolio', icon: FolderGit2 },
  { key: 'aptitude', label: 'Aptitude & Mocks', icon: Target },
  { key: 'career', label: 'Career Readiness', icon: Compass },
  { key: 'jobs', label: 'Jobs & Applications', icon: Briefcase },
  { key: 'wishlist', label: 'Saved Wishlist', icon: Heart },
  { key: 'certificates', label: 'Certificates', icon: Award },
  { key: 'purchases', label: 'Order History', icon: ShoppingBag },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'messages', label: 'Direct Messages', icon: MessageSquare },
  { key: 'settings', label: 'Profile Settings', icon: Settings },
];

export const UserDashboard = () => {
  const { user, profile, logout } = useAuth();
  const { wishlistItems } = useCart();
  const toast = useToast();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  const displayName =
    profile?.display_name ||
    `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() ||
    user?.user_metadata?.full_name ||
    user?.email?.split('@')[0] ||
    'Student';

  const [enrollments, setEnrollments] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [messages, setMessages] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [studentLearningPaths, setStudentLearningPaths] = useState([]);
  const [aptitudeAnalytics, setAptitudeAnalytics] = useState(null);
  const [aptitudeHistory, setAptitudeHistory] = useState([]);
  const [learningAnalytics, setLearningAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);

  const [settingsForm, setSettingsForm] = useState({
    firstName: profile?.first_name || '',
    lastName: profile?.last_name || '',
    bio: profile?.bio || '',
    phone: profile?.phone || '',
    website: profile?.website || '',
  });
  const [settingsSaving, setSettingsSaving] = useState(false);

  // Message compose state
  const [msgRecipient, setMsgRecipient] = useState('Senior Instructor');
  const [msgText, setMsgText] = useState('');
  const [msgSending, setMsgSending] = useState(false);

  const setTab = (key) => setSearchParams({ tab: key });

  const loadData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [enr, certs, notifs, orders_, recommended, userPaths, aptAnalytics, aptHist, learnAnalytics] = await Promise.all([
        enrollmentService.getUserEnrollments(user.id),
        certificateService.getUserCertificates(user.id),
        notificationService.getNotifications(user.id),
        orderService.getUserOrders(user.id),
        courseService.getCourses(),
        learningPathService.getMyLearningPaths(),
        aptitudeService.getAnalytics().catch(() => null),
        aptitudeService.getHistory({ limit: 5 }).catch(() => ({ attempts: [] })),
        progressService.getLearningAnalytics().catch(() => null)
      ]);

      // If user has no enrollments in DB yet, provide seed enrollments for preview
      const resolvedEnrollments = enr && enr.length > 0 ? enr : (recommended || []).slice(0, 2).map((c, i) => ({
        id: `enr-${i}`,
        course_id: c.id,
        progress_percentage: i === 0 ? 68 : 25,
        courses: c,
        enrolled_at: new Date().toISOString()
      }));

      setEnrollments(resolvedEnrollments);
      setCertificates(certs || []);
      setLearningAnalytics(learnAnalytics);
      setNotifications(notifs || []);
      setPurchases(orders_ || []);
      setRecommendedCourses((recommended || []).slice(0, 3));
      setStudentLearningPaths(userPaths || []);
      setAptitudeAnalytics(aptAnalytics || null);
      setAptitudeHistory(aptHist?.attempts || []);

      try {
        const convos = await messageService.getConversations(user.id);
        setMessages(convos || []);
      } catch (err) {
        setMessages([]);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSettingsSaving(true);
    try {
      await profileService.updateProfile(user.id, {
        first_name: settingsForm.firstName,
        last_name: settingsForm.lastName,
        display_name: `${settingsForm.firstName} ${settingsForm.lastName}`.trim(),
        bio: settingsForm.bio,
        phone: settingsForm.phone,
        website: settingsForm.website
      });
      toast.success('Profile settings updated successfully!');
    } catch (err) {
      toast.error('Failed to update profile settings.');
    } finally {
      setSettingsSaving(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!msgText.trim()) return;
    setMsgSending(true);
    try {
      await messageService.sendMessage(user.id, 'usr-instructor-1', msgText);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          sender_id: user.id,
          message_text: msgText,
          created_at: new Date().toISOString()
        }
      ]);
      setMsgText('');
      toast.success('Message sent to instructor.');
    } catch (err) {
      toast.error('Message failed to send.');
    } finally {
      setMsgSending(false);
    }
  };

  const handleMarkNotificationsRead = async () => {
    if (!user) return;
    try {
      await notificationService.markAllAsRead(user.id);
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      toast.info('Notifications marked as read.');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-primary-600 via-indigo-600 to-primary-700 rounded-3xl p-6 sm:p-10 text-white shadow-xl mb-10 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_50%)] pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-sm">
                <span>Student Hub</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
                Welcome back, {displayName}!
              </h1>
              <p className="text-xs sm:text-sm text-primary-100 max-w-lg leading-relaxed">
                You are on track. Continue learning where you left off or explore new certifications.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Enrolled', val: enrollments.length },
                { label: 'Completed', val: certificates.length },
                { label: 'Hours', val: enrollments.length * 12 },
                { label: 'Saved', val: wishlistItems.length },
              ].map((stat, i) => (
                <div key={i} className="px-4 py-3 bg-white/10 backdrop-blur-md rounded-2xl text-center border border-white/10">
                  <p className="text-xl sm:text-2xl font-black">{stat.val}</p>
                  <p className="text-[10px] uppercase font-bold text-primary-200 tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex space-x-2 overflow-x-auto pb-4 mb-8 scrollbar-none border-b border-slate-200 dark:border-slate-800">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                onClick={() => setTab(tab.key)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-10">
            {/* Continue Learning Section */}
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Continue Learning</h2>
                <button onClick={() => setTab('courses')} className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline">
                  View All Enrolled ({enrollments.length})
                </button>
              </div>

              {enrollments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {enrollments.slice(0, 2).map((enr) => {
                    const c = enr.courses || {};
                    const progress = enr.progress_percentage || 50;

                    return (
                      <div
                        key={enr.id}
                        className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row gap-4 items-center"
                      >
                        <img
                          src={c.thumbnail_url || c.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300'}
                          alt={c.title}
                          className="w-full sm:w-36 h-24 rounded-xl object-cover"
                        />
                        <div className="flex-1 min-w-0 space-y-2 w-full">
                          <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                            {c.title}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate flex items-center gap-1.5">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            <span>Current Lesson: <strong className="text-slate-700 dark:text-slate-300 font-semibold">{enr.last_lesson_title || 'Introduction & Core Architecture'}</strong></span>
                          </p>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[11px] text-slate-500">
                              <span>Course Progress</span>
                              <span className="font-bold text-primary-600">{progress}% complete</span>
                            </div>
                            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary-600 rounded-full transition-all duration-500"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                          <div className="pt-1">
                            <Link to={`/learn/${c.id || enr.course_id}`}>
                              <Button size="sm" icon={PlayCircle} className="w-full sm:w-auto shadow-sm shadow-primary-500/20">
                                Continue Learning
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <EmptyState
                  icon={BookOpen}
                  title="No active courses yet"
                  description="Explore our top engineering masterclasses to start your curriculum."
                  actionText="Explore Courses"
                  actionLink="/courses"
                />
              )}
            </div>

            {/* Learning Analytics & Consistency (Feature 2) */}
            {learningAnalytics && (
              <div className="p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                      Learning Analytics & Study Rhythm
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Personal performance, learning velocity, and consistency metrics.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-bold rounded-full flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 fill-current" />
                      <span>{learningAnalytics.currentStreak || 5}-Day Active Streak</span>
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] font-bold text-slate-500 uppercase block">Enrolled Courses</span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-2xl font-black text-slate-900 dark:text-white">{learningAnalytics.coursesCompleted || 1}</span>
                      <span className="text-xs text-slate-500">/ {learningAnalytics.coursesEnrolled || 3} Completed</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] font-bold text-slate-500 uppercase block">Lessons Finished</span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-2xl font-black text-primary-600 dark:text-primary-400">{learningAnalytics.lessonsCompleted || 18}</span>
                      <span className="text-xs text-slate-500">Lectures</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] font-bold text-slate-500 uppercase block">Learning Hours</span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{learningAnalytics.learningHours || 32.5}</span>
                      <span className="text-xs text-slate-500">Hours</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] font-bold text-slate-500 uppercase block">Completion Rate</span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{learningAnalytics.completionRate || 75}%</span>
                      <span className="text-xs text-slate-500">Target 100%</span>
                    </div>
                  </div>
                </div>

                {/* Weekly Distribution Bar Visualization */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                    <span>Weekly Study Distribution</span>
                    <span className="text-slate-400 text-[11px]">Longest Streak: {learningAnalytics.longestStreak || 12} Days</span>
                  </div>
                  <div className="grid grid-cols-7 gap-2 pt-1">
                    {(learningAnalytics.weeklyActivity || []).map((w, idx) => {
                      const heightPct = Math.min(100, Math.round((w.hours / 4) * 100));
                      return (
                        <div key={idx} className="flex flex-col items-center gap-1.5">
                          <div className="w-full h-14 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden flex flex-col justify-end p-1">
                            <div
                              className="w-full bg-primary-500 rounded-lg transition-all duration-500"
                              style={{ height: `${heightPct}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-bold text-slate-500">{w.day}</span>
                          <span className="text-[9px] text-slate-400 font-mono">{w.hours}h</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

              {/* Active Career Roadmaps in Overview */}
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center space-x-2">
                    <Route className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Active Career Roadmaps</h2>
                  </div>
                  <Link to="/learning-paths" className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline">
                    Browse All 20 Paths
                  </Link>
                </div>

                {studentLearningPaths.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {studentLearningPaths.slice(0, 2).map((slp) => {
                      const lp = slp.learning_paths || {};
                      return (
                        <div
                          key={slp.id}
                          className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                        >
                          <div>
                            <div className="flex items-center justify-between text-[11px] font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-1">
                              <span>{lp.category || 'Specialization'}</span>
                              <span className="text-slate-400 capitalize">{lp.difficulty || 'All Levels'}</span>
                            </div>
                            <h3 className="font-bold text-base text-slate-900 dark:text-white">
                              {lp.title || 'Career Learning Path'}
                            </h3>
                            <div className="mt-3 space-y-1.5">
                              <div className="flex justify-between text-xs font-medium text-slate-500">
                                <span>Stage {slp.current_stage || 1}</span>
                                <span className="font-bold text-primary-600">{slp.progress_pct || 0}% Complete</span>
                              </div>
                              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-primary-600 to-indigo-600 rounded-full"
                                  style={{ width: `${slp.progress_pct || 0}%` }}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <span className="text-xs text-slate-500">
                              {slp.completed_courses?.length || 0} of {lp.total_courses || 3} courses completed
                            </span>
                            <Link to={`/learning-paths/${lp.slug || lp.id}`}>
                              <Button size="sm">Resume Path</Button>
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-6 bg-gradient-to-r from-primary-500/10 via-indigo-500/10 to-transparent border border-primary-200/50 dark:border-primary-900/30 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="space-y-1 text-center sm:text-left">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">Ready to prepare for a specific tech role?</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md">
                        Follow sequenced course tracks for Full Stack Developer, Data Scientist, DevOps, AI Engineer, and 16 more IT careers.
                      </p>
                    </div>
                    <Link to="/learning-paths" className="flex-shrink-0">
                      <Button size="sm">Explore 20 Career Paths</Button>
                    </Link>
                  </div>
                )}
              </div>

              {/* Aptitude Arena & Placement Readiness Spotlight */}
              <div className="p-6 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-transparent border border-indigo-200/60 dark:border-indigo-900/40 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="space-y-1 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <Target className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                      Campus Placements & IT Technical Screenings
                    </span>
                  </div>
                  <h4 className="font-bold text-base text-slate-900 dark:text-white">
                    EduAcademy Aptitude Arena
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed">
                    Practice Quantitative, Logical, Verbal, and DI with company placement pattern questions. 
                    {aptitudeAnalytics?.total_questions_solved ? (
                      <span className="font-bold text-indigo-600 dark:text-indigo-400 block mt-1">
                        You've solved {aptitudeAnalytics.total_questions_solved} questions with {aptitudeAnalytics.overall_accuracy}% accuracy!
                      </span>
                    ) : (
                      ' Diagnostic feedback identifies your weak topics automatically.'
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                  <Link to="/aptitude/practice">
                    <Button size="sm">Launch Practice</Button>
                  </Link>
                  <button
                    type="button"
                    onClick={() => setTab('aptitude')}
                    className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-300"
                  >
                    View Scores
                  </button>
                </div>
              </div>

              {/* Recommended Courses Carousel */}
              {recommendedCourses.length > 0 && (
                <div className="space-y-5 pt-4">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recommended for Your Track</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recommendedCourses.map((rc) => (
                      <CourseCard key={rc.id} course={rc} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

        {/* TAB 2: MY COURSES */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Enrolled Masterclasses</h2>
            {enrollments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrollments.map((enr) => {
                  const c = enr.courses || {};
                  return (
                    <div key={enr.id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
                      <img
                        src={c.thumbnail_url || c.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400'}
                        alt={c.title}
                        className="w-full aspect-video object-cover"
                      />
                      <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                        <div className="space-y-2">
                          <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2">
                            {c.title}
                          </h3>
                          <div className="space-y-1">
                            <div className="flex justify-between text-[11px] text-slate-400">
                              <span>Overall Progress</span>
                              <span className="font-bold text-primary-600">{enr.progress_percentage || 0}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary-600 rounded-full"
                                style={{ width: `${enr.progress_percentage || 0}%` }}
                              />
                            </div>
                          </div>
                        </div>
                        <Link to={`/learn/${c.id || enr.course_id}`}>
                          <Button size="sm" className="w-full" icon={PlayCircle}>
                            Go to Classroom
                          </Button>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyState
                icon={BookOpen}
                title="You have no courses yet"
                description="Enroll in a course to start learning."
                actionText="Explore Courses"
                actionLink="/courses"
              />
            )}
          </div>
        )}

        {/* TAB: LEARNING PATHS */}
        {activeTab === 'learning-paths' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                  <Route className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  <span>Enrolled Career Learning Paths</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Sequential role-based tracks to prepare you for industry developer, analyst, and cloud engineering positions.
                </p>
              </div>
              <Link to="/learning-paths">
                <Button size="sm">Browse All 20 Career Paths</Button>
              </Link>
            </div>

            {studentLearningPaths.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {studentLearningPaths.map((slp) => {
                  const lp = slp.learning_paths || {};
                  return (
                    <div
                      key={slp.id}
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div className="relative h-36 bg-slate-100 dark:bg-slate-800">
                        <img
                          src={lp.banner_url || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600'}
                          alt={lp.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/60 text-white text-[10px] font-bold">
                          {lp.category || 'Specialization'}
                        </span>
                        <span className="absolute bottom-3 left-3 text-white text-xs font-bold">
                          Stage {slp.current_stage || 1}
                        </span>
                      </div>

                      <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                        <div className="space-y-3">
                          <h3 className="font-bold text-base text-slate-900 dark:text-white line-clamp-1">
                            {lp.title || 'Career Learning Path'}
                          </h3>
                          <div className="space-y-1.5">
                            <div className="flex justify-between text-xs font-semibold">
                              <span className="text-slate-500">Path Progress</span>
                              <span className="text-primary-600 dark:text-primary-400">{slp.progress_pct || 0}%</span>
                            </div>
                            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-primary-600 to-indigo-600 rounded-full transition-all duration-500"
                                style={{ width: `${slp.progress_pct || 0}%` }}
                              />
                            </div>
                            <p className="text-[11px] text-slate-400">
                              {slp.completed_courses?.length || 0} of {lp.total_courses || 3} courses completed
                            </p>
                          </div>
                        </div>

                        <Link to={`/learning-paths/${lp.slug || lp.id}`}>
                          <Button size="sm" className="w-full">
                            Resume Learning Roadmap
                          </Button>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyState
                icon={Route}
                title="You haven't enrolled in any career paths yet"
                description="EduAcademy offers 20 comprehensive IT Career Learning Paths with guided stage sequences and capstone projects."
                actionText="Explore 20 Career Paths"
                actionLink="/learning-paths"
              />
            )}
          </div>
        )}


        {/* TAB: CODELAB */}
        {activeTab === 'codelab' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                  <Code2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span>CodeLab Problem Solving</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Practice algorithmic DSA, SQL queries, and full-stack challenges in our isolated sandbox.
                </p>
              </div>
              <div className="flex items-center gap-2.5">
                <Link to="/codelab">
                  <Button size="sm">Browse 30+ Problems</Button>
                </Link>
                <Link to="/codelab/daily">
                  <Button size="sm" variant="outline">Daily Challenge</Button>
                </Link>
                <Link to="/codelab/submissions">
                  <Button size="sm" variant="ghost">My Submissions</Button>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Coding Streak</span>
                <div className="text-2xl font-black text-amber-500 mt-1">4 Days 🔥</div>
                <span className="text-xs text-slate-500">Keep solving daily</span>
              </div>
              <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Submissions Evaluated</span>
                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">12 Passed</div>
                <span className="text-xs text-slate-500">100% test-case accuracy</span>
              </div>
              <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Global Rank</span>
                <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">#42</div>
                <span className="text-xs text-slate-500">CodeLab Leaderboard</span>
              </div>
            </div>

            <div className="p-6 bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-lg font-bold">Ready to write code?</h3>
                <p className="text-xs text-emerald-100">Step inside our full Monaco code editor with live Node.js/Python/SQL execution.</p>
              </div>
              <Link to="/codelab">
                <Button variant="secondary" size="md">Open CodeLab Workspace</Button>
              </Link>
            </div>
          </div>
        )}

        {/* TAB: PROJECTS */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                  <FolderGit2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <span>Real-World Project Blueprints</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Build production systems from architecture schemas to CI/CD deployments for your hiring portfolio.
                </p>
              </div>
              <div className="flex items-center gap-2.5">
                <Link to="/projects">
                  <Button size="sm">Explore 10+ Blueprints</Button>
                </Link>
                <Link to="/projects/portfolio">
                  <Button size="sm" variant="outline">Verified Portfolio</Button>
                </Link>
              </div>
            </div>

            <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl text-center space-y-4">
              <FolderGit2 className="w-12 h-12 text-purple-500 mx-auto" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Active Engineering Blueprints</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                Choose a project blueprint (e.g. Modern Full Stack E-Commerce or Real-Time Collaborative Workspace), follow step-by-step milestones, and link your live demo.
              </p>
              <Link to="/projects">
                <Button>Select a Project Blueprint</Button>
              </Link>
            </div>
          </div>
        )}

        {/* TAB: CAREER */}
        {activeTab === 'career' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                  <Compass className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  <span>Career Readiness Command Center</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Your holistic 0-100 hiring readiness index synthesized across coursework, code accuracy, and portfolio.
                </p>
              </div>
              <Link to="/career">
                <Button size="sm">Full Readiness Analysis</Button>
              </Link>
            </div>

            <div className="p-6 bg-gradient-to-r from-blue-700 to-indigo-800 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-200">Current Score</span>
                <div className="text-4xl font-black">68 / 100</div>
                <p className="text-xs text-indigo-100 max-w-sm">
                  You are approaching Job Ready status. Complete one more project blueprint to reach the 75+ benchmark.
                </p>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <Link to="/career">
                  <Button variant="secondary" size="sm">View Recommendations</Button>
                </Link>
                <Link to="/career/achievements">
                  <Button variant="outline" className="bg-white/10 text-white border-white/20" size="sm">Achievements & XP</Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* TAB: JOBS */}
        {activeTab === 'jobs' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                  <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span>Job & Internship Applications</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Track recruiter updates on roles applied through EduAcademy Easy Apply.
                </p>
              </div>
              <div className="flex items-center gap-2.5">
                <Link to="/jobs">
                  <Button size="sm">Explore Openings</Button>
                </Link>
                <Link to="/jobs/saved">
                  <Button size="sm" variant="outline">Saved Bookmarks</Button>
                </Link>
                <Link to="/jobs/applications">
                  <Button size="sm" variant="ghost">Application Tracker</Button>
                </Link>
              </div>
            </div>

            <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl text-center space-y-4">
              <Briefcase className="w-12 h-12 text-blue-500 mx-auto" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Active Career Board</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                Apply to curated roles at top partner companies with 1-click credential verification.
              </p>
              <Link to="/jobs">
                <Button>Browse Matching Tech Jobs</Button>
              </Link>
            </div>
          </div>
        )}

        {/* TAB: APTITUDE & MOCKS */}
        {activeTab === 'aptitude' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                  <Target className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <span>Aptitude Arena Performance</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Track your preparation for IT placement exams and technical aptitude screenings.
                </p>
              </div>
              <div className="flex items-center gap-2.5">
                <Link to="/aptitude/practice">
                  <Button size="sm">Start Practice Set</Button>
                </Link>
                <Link to="/aptitude/mock-tests">
                  <Button size="sm" variant="outline">Browse Mocks</Button>
                </Link>
                <Link to="/aptitude/analytics">
                  <Button size="sm" variant="ghost">Full Analytics</Button>
                </Link>
              </div>
            </div>

            {/* Metrics Overview */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Total Attempts</span>
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  {aptitudeAnalytics?.total_attempts || 0}
                </div>
                <span className="text-[11px] text-slate-500">Practice sets & exams</span>
              </div>

              <div className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Questions Solved</span>
                <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                  {aptitudeAnalytics?.total_questions_solved || 0}
                </div>
                <span className="text-[11px] text-slate-500">{aptitudeAnalytics?.total_correct || 0} correct</span>
              </div>

              <div className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Overall Accuracy</span>
                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  {aptitudeAnalytics?.overall_accuracy || 0}%
                </div>
                <span className="text-[11px] text-slate-500">Target: 80%+</span>
              </div>

              <div className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase">Avg Response Speed</span>
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  {aptitudeAnalytics?.average_time_per_question || 0}s
                </div>
                <span className="text-[11px] text-slate-500">Per question</span>
              </div>
            </div>

            {/* Recent Attempts Table */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Recent Assessments & Reports
                </h3>
                <Link to="/aptitude/history" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
                  View Full History
                </Link>
              </div>

              {aptitudeHistory.length > 0 ? (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-[11px] font-bold uppercase text-slate-400">
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Mode</th>
                        <th className="py-3 px-4">Score</th>
                        <th className="py-3 px-4">Accuracy</th>
                        <th className="py-3 px-4 text-right">Report</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {aptitudeHistory.map((att) => (
                        <tr key={att.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                          <td className="py-3.5 px-4 font-medium">
                            {att.created_at ? new Date(att.created_at).toLocaleDateString() : 'Recent'}
                          </td>
                          <td className="py-3.5 px-4 capitalize font-semibold text-indigo-600">
                            {att.mode?.replace('_', ' ') || 'Practice'}
                          </td>
                          <td className="py-3.5 px-4 font-bold">
                            {att.score} / {att.total_questions}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-emerald-600">
                            {att.accuracy}%
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <Link
                              to={`/aptitude/results/${att.id}`}
                              className="text-xs font-bold text-indigo-600 hover:underline inline-flex items-center gap-1"
                            >
                              Report <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <EmptyState
                  icon={Target}
                  title="No aptitude attempts yet"
                  description="Complete a practice session or placement mock test to measure your skill."
                  actionText="Launch Practice"
                  actionLink="/aptitude/practice"
                />
              )}
            </div>
          </div>
        )}

        {/* TAB 3: WISHLIST */}
        {activeTab === 'wishlist' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Saved in Wishlist</h2>
            {wishlistItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {wishlistItems.map((c) => (
                  <CourseCard key={c.id} course={c} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Heart}
                title="Your wishlist is currently empty"
                description="Bookmark courses while browsing to save them for later."
                actionText="Browse Courses"
                actionLink="/courses"
              />
            )}
          </div>
        )}

        {/* TAB 4: CERTIFICATES */}
        {activeTab === 'certificates' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Earned Certificates</h2>
            <div className="p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-center space-y-4 max-w-xl mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/30 text-amber-500 flex items-center justify-center mx-auto shadow-inner">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Official Course Credentials</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Complete 100% of curriculum lectures and project milestones in any enrolled course to generate a verifiable digital certificate.
              </p>
              <div className="pt-2">
                <Link to="/courses">
                  <Button size="sm">Explore Eligible Courses</Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: PURCHASES */}
        {activeTab === 'purchases' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Order History & Invoices</h2>
            {purchases.length > 0 ? (
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
                {purchases.map((order) => (
                  <div key={order.id} className="p-5 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">Order #{order.id.slice(0, 8)}</p>
                      <p className="text-slate-400">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm text-slate-900 dark:text-white">{formatINR(order.total_amount || order.total || 999)}</p>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 uppercase">Paid</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={ShoppingBag}
                title="No orders yet"
                description="Your purchase history and downloadable receipts will appear here."
              />
            )}
          </div>
        )}

        {/* TAB 6: NOTIFICATIONS */}
        {activeTab === 'notifications' && (
          <div className="space-y-6 max-w-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Notifications</h2>
              {notifications.length > 0 && (
                <button onClick={handleMarkNotificationsRead} className="text-xs font-bold text-primary-600 hover:underline">
                  Mark all as read
                </button>
              )}
            </div>
            {notifications.length > 0 ? (
              <div className="space-y-3">
                {notifications.map((n) => (
                  <div key={n.id} className={`p-4 rounded-2xl border ${n.is_read ? 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800' : 'bg-primary-50/50 dark:bg-primary-950/20 border-primary-100 dark:border-primary-900/40'}`}>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white">{n.title}</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{n.message}</p>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Bell}
                title="No new notifications"
                description="You are completely caught up."
              />
            )}
          </div>
        )}

        {/* TAB 7: MESSAGES */}
        {activeTab === 'messages' && (
          <div className="space-y-6 max-w-2xl">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Instructor Messages</h2>
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1 divide-y divide-slate-100 dark:divide-slate-800">
                {messages.length > 0 ? (
                  messages.map((m) => (
                    <div key={m.id} className="pt-2">
                      <p className="font-bold text-xs text-slate-900 dark:text-white">{m.sender_name || 'Instructor'}</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{m.message_text}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 py-4 text-center">No active message threads yet.</p>
                )}
              </div>

              {/* Compose Message */}
              <form onSubmit={handleSendMessage} className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <input
                  type="text"
                  placeholder="Type message to instructor..."
                  value={msgText}
                  onChange={(e) => setMsgText(e.target.value)}
                  className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <Button type="submit" size="sm" loading={msgSending} icon={Send}>
                  Send
                </Button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 8: PROFILE SETTINGS */}
        {activeTab === 'settings' && (
          <div className="max-w-xl space-y-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Account & Profile Settings</h2>
            <form onSubmit={handleSettingsSubmit} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  value={settingsForm.firstName}
                  onChange={(e) => setSettingsForm(p => ({ ...p, firstName: e.target.value }))}
                />
                <Input
                  label="Last Name"
                  value={settingsForm.lastName}
                  onChange={(e) => setSettingsForm(p => ({ ...p, lastName: e.target.value }))}
                />
              </div>

              <Input
                label="Phone Number"
                value={settingsForm.phone}
                onChange={(e) => setSettingsForm(p => ({ ...p, phone: e.target.value }))}
              />

              <Input
                label="Portfolio / Website URL"
                value={settingsForm.website}
                onChange={(e) => setSettingsForm(p => ({ ...p, website: e.target.value }))}
              />

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">Short Bio</label>
                <textarea
                  rows={3}
                  value={settingsForm.bio}
                  onChange={(e) => setSettingsForm(p => ({ ...p, bio: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="pt-2">
                <Button type="submit" size="md" loading={settingsSaving}>
                  Save Profile Changes
                </Button>
              </div>
            </form>
          </div>
        )}

      </div>
    </PageTransition>
  );
};
