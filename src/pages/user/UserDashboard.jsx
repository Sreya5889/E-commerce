import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { db } from '../../services/db';
import { PageTransition } from '../../components/layout/PageTransition';
import {
  LayoutDashboard, BookOpen, Heart, Award, ShoppingBag, Bell,
  MessageSquare, Settings, User, Star, CheckCircle2, Circle,
  Download, Send, Camera, LogOut, TrendingUp, Clock, ChevronRight,
  Loader2, BadgeCheck
} from 'lucide-react';

const TABS = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'courses', label: 'My Courses', icon: BookOpen },
  { key: 'wishlist', label: 'Wishlist', icon: Heart },
  { key: 'certificates', label: 'Certificates', icon: Award },
  { key: 'purchases', label: 'Purchase History', icon: ShoppingBag },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'messages', label: 'Messages', icon: MessageSquare },
  { key: 'settings', label: 'Settings', icon: Settings },
];

export const UserDashboard = () => {
  const { user, updateProfile, logout } = useAuth();
  const { wishlistItems, removeFromWishlist, addToCart, isInCart } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  const [enrollments, setEnrollments] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [messages, setMessages] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(false);

  // Settings form
  const [settingsForm, setSettingsForm] = useState({
    fullName: user?.fullName || '',
    bio: user?.bio || '',
    phone: user?.phone || '',
    website: user?.website || '',
    linkedinUrl: user?.linkedinUrl || '',
    githubUrl: user?.githubUrl || '',
  });
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // Message compose
  const [msgRecipient, setMsgRecipient] = useState('usr-teacher-1');
  const [msgText, setMsgText] = useState('');
  const [msgSending, setMsgSending] = useState(false);

  const setTab = (key) => setSearchParams({ tab: key });

  const loadData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [enr, certs, notifs, msgs, purchases_] = await Promise.all([
        db.getEnrollments(user.id),
        db.getCertificates(user.id),
        db.getNotifications(user.id),
        db.getMessages(user.id),
        db.getPurchases(user.id),
      ]);
      setEnrollments(enr || []);
      setCertificates(certs || []);
      setNotifications(notifs || []);
      setMessages(msgs || []);
      setPurchases(purchases_ || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleLessonToggle = async (courseId, lessonId, isCompleted) => {
    try {
      const updated = await db.updateLessonProgress(user.id, courseId, lessonId, isCompleted);
      setEnrollments(prev => prev.map(e => e.courseId === courseId ? { ...e, ...updated } : e));
    } catch (err) { console.error(err); }
  };

  const handleMarkAllNotificationsRead = async () => {
    await db.markNotificationsRead(user.id);
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSettingsSaving(true);
    try {
      await updateProfile(settingsForm);
      setSettingsSuccess(true);
      setTimeout(() => setSettingsSuccess(false), 3000);
    } catch (err) { console.error(err); }
    finally { setSettingsSaving(false); }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!msgText.trim()) return;
    setMsgSending(true);
    try {
      await db.sendMessage(user.id, msgRecipient, msgText);
      setMsgText('');
      await loadData();
    } catch (err) { console.error(err); }
    finally { setMsgSending(false); }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-4">
            {/* Profile Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-premium p-6 text-center space-y-3 shadow-sm">
              <div className="relative inline-block">
                <img src={user?.avatarUrl} alt={user?.fullName} className="w-20 h-20 rounded-premium object-cover border-4 border-slate-50 dark:border-slate-800 mx-auto" />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-slate-900"></div>
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">{user?.fullName || 'My Account'}</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">{user?.email}</p>
                <span className="inline-block mt-1.5 px-2.5 py-0.5 bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400 text-[10px] font-bold rounded-full capitalize">
                  {user?.role || 'Student'} Account
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{enrollments.length}</p>
                  <p className="text-[9px] text-slate-400">Courses</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{certificates.length}</p>
                  <p className="text-[9px] text-slate-400">Certs</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{purchases.length}</p>
                  <p className="text-[9px] text-slate-400">Orders</p>
                </div>
              </div>
            </div>

            {/* Nav Menu */}
            <nav className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-premium shadow-sm overflow-hidden">
              {TABS.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  className={`w-full flex items-center space-x-3 px-4 py-3.5 text-xs font-semibold transition-colors relative ${
                    activeTab === key
                      ? 'bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400 border-r-2 border-primary-500'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                  {key === 'notifications' && unreadCount > 0 && (
                    <span className="ml-auto w-5 h-5 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
              ))}
              <button
                onClick={logout}
                className="w-full flex items-center space-x-3 px-4 py-3.5 text-xs font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors border-t border-slate-100 dark:border-slate-800"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3 space-y-6">

            {/* ===== OVERVIEW ===== */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Welcome back, {user?.fullName?.split(' ')[0]} 👋</h2>
                {/* Stats Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: 'Enrolled Courses', value: enrollments.length, color: 'primary', icon: BookOpen },
                    { label: 'Completed', value: enrollments.filter(e => e.progressPercent === 100).length, color: 'green', icon: CheckCircle2 },
                    { label: 'Certificates', value: certificates.length, color: 'amber', icon: Award },
                    { label: 'In Wishlist', value: wishlistItems.length, color: 'red', icon: Heart },
                  ].map(({ label, value, color, icon: Icon }) => (
                    <div key={label} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-premium p-5 shadow-sm text-center space-y-2">
                      <div className={`w-10 h-10 rounded-xl mx-auto flex items-center justify-center bg-${color}-50 dark:bg-${color}-950/20 text-${color}-600 dark:text-${color}-400`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{value}</p>
                      <p className="text-[10px] text-slate-400">{label}</p>
                    </div>
                  ))}
                </div>

                {/* Continue Learning */}
                {enrollments.length > 0 && (
                  <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-premium p-6 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">Continue Learning</h3>
                      <button onClick={() => setTab('courses')} className="text-xs text-primary-600 dark:text-primary-400 font-semibold hover:underline">View All</button>
                    </div>
                    {enrollments.slice(0, 2).map(enr => (
                      enr.course && (
                        <div key={enr.id} className="flex items-center space-x-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                          <img src={enr.course.thumbnail} alt={enr.course.title} className="w-16 h-12 rounded-lg object-cover flex-shrink-0" />
                          <div className="flex-grow min-w-0">
                            <p className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">{enr.course.title}</p>
                            <div className="flex items-center space-x-2 mt-2">
                              <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div className="h-full bg-primary-500 rounded-full transition-all" style={{ width: `${enr.progressPercent || 0}%` }}></div>
                              </div>
                              <span className="text-[10px] text-slate-400 font-mono">{enr.progressPercent || 0}%</span>
                            </div>
                          </div>
                          <button onClick={() => setTab('courses')} className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex-shrink-0">
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      )
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ===== MY COURSES ===== */}
            {activeTab === 'courses' && (
              <div className="space-y-5">
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">My Enrolled Courses</h2>
                {loading ? (
                  <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary-500" /></div>
                ) : enrollments.length === 0 ? (
                  <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-premium border border-slate-100 dark:border-slate-800 space-y-4">
                    <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
                    <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">No enrolled courses yet</p>
                    <Link to="/courses" className="inline-block px-5 py-2 bg-primary-600 text-white rounded-premium text-xs font-semibold">Browse Courses</Link>
                  </div>
                ) : enrollments.map(enr => (
                  enr.course && (
                    <div key={enr.id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-premium p-6 shadow-sm space-y-4">
                      <div className="flex items-start space-x-4">
                        <img src={enr.course.thumbnail} alt={enr.course.title} className="w-20 h-14 rounded-xl object-cover flex-shrink-0" />
                        <div className="flex-grow min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2">{enr.course.title}</h3>
                            {enr.progressPercent === 100 && (
                              <span className="flex-shrink-0 px-2 py-1 bg-green-100 dark:bg-green-950/20 text-green-600 text-[9px] font-bold uppercase rounded-full flex items-center space-x-1">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Completed</span>
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 mt-2">
                            <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full transition-all duration-500"
                                style={{ width: `${enr.progressPercent || 0}%` }}
                              ></div>
                            </div>
                            <span className="text-[10px] text-slate-500 font-mono font-medium">{enr.progressPercent || 0}% complete</span>
                          </div>
                          <p className="text-[10px] text-slate-400 mt-1">
                            {enr.completedLessons?.length || 0} lessons completed
                            {enr.completedAt && ` • Completed ${new Date(enr.completedAt).toLocaleDateString()}`}
                          </p>
                        </div>
                      </div>

                      {/* Curriculum Checklist */}
                      {enr.course.curriculum && (
                        <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-3">
                          {enr.course.curriculum.map((section, sIdx) => (
                            <div key={sIdx} className="space-y-2">
                              <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{section.title}</p>
                              {section.lessons && section.lessons.map(lesson => {
                                const done = enr.completedLessons?.includes(lesson.id);
                                return (
                                  <button
                                    key={lesson.id}
                                    onClick={() => handleLessonToggle(enr.courseId, lesson.id, !done)}
                                    className={`w-full flex items-center space-x-3 p-3 rounded-xl text-xs transition-colors ${done ? 'bg-green-50 dark:bg-green-950/10' : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                                  >
                                    {done ? (
                                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                                    ) : (
                                      <Circle className="w-4 h-4 text-slate-300 dark:text-slate-600 flex-shrink-0" />
                                    )}
                                    <span className={`flex-grow text-left ${done ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-300'}`}>
                                      {lesson.title}
                                    </span>
                                    <span className="text-slate-400">{lesson.duration} min</span>
                                  </button>
                                );
                              })}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                ))}
              </div>
            )}

            {/* ===== WISHLIST ===== */}
            {activeTab === 'wishlist' && (
              <div className="space-y-5">
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">My Wishlist</h2>
                {wishlistItems.length === 0 ? (
                  <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-premium border border-slate-100 dark:border-slate-800 space-y-4">
                    <Heart className="w-12 h-12 text-slate-300 mx-auto" />
                    <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">No wishlisted courses yet</p>
                    <Link to="/courses" className="inline-block px-5 py-2 bg-primary-600 text-white rounded-premium text-xs font-semibold">Browse Courses</Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {wishlistItems.map(course => (
                      <div key={course.id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-premium overflow-hidden shadow-sm hover:shadow-premium transition-shadow">
                        <Link to={`/course/${course.id}`}>
                          <img src={course.thumbnail} alt={course.title} className="w-full aspect-video object-cover" />
                        </Link>
                        <div className="p-4 space-y-3">
                          <Link to={`/course/${course.id}`} className="font-bold text-sm text-slate-900 dark:text-white hover:text-primary-600 line-clamp-2 block">
                            {course.title}
                          </Link>
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-slate-900 dark:text-white">${(course.discountPrice || course.price).toFixed(2)}</span>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => !isInCart(course.id) && addToCart(course.id)}
                                className="px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold rounded-lg transition-colors"
                              >
                                {isInCart(course.id) ? 'In Cart' : 'Add to Cart'}
                              </button>
                              <button
                                onClick={() => removeFromWishlist(course.id)}
                                className="p-1.5 border border-red-200 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Heart className="w-3.5 h-3.5 fill-current" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ===== CERTIFICATES ===== */}
            {activeTab === 'certificates' && (
              <div className="space-y-5">
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">My Certificates</h2>
                {certificates.length === 0 ? (
                  <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-premium border border-slate-100 dark:border-slate-800 space-y-4">
                    <Award className="w-12 h-12 text-slate-300 mx-auto" />
                    <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Complete a course to earn your first certificate!</p>
                    <button onClick={() => setTab('courses')} className="inline-block px-5 py-2 bg-primary-600 text-white rounded-premium text-xs font-semibold">
                      View My Courses
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {certificates.map(cert => (
                      <div key={cert.id} className="bg-gradient-to-br from-primary-600 to-secondary-600 rounded-premium p-6 text-white space-y-4 shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
                        <div className="relative z-10 space-y-3">
                          <div className="flex items-center space-x-2">
                            <Award className="w-8 h-8 text-amber-300" />
                            <span className="text-xs font-bold uppercase tracking-wider opacity-80">Certificate of Completion</span>
                          </div>
                          <h3 className="font-extrabold text-base leading-snug">
                            {cert.course?.title || 'Course Certificate'}
                          </h3>
                          <div className="text-[10px] opacity-70 space-y-1">
                            <p>Issued to: <span className="font-bold">{user?.fullName}</span></p>
                            <p>Issued on: {new Date(cert.issuedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            <p>Certificate ID: <span className="font-mono font-bold">{cert.certificateCode}</span></p>
                          </div>
                          <button className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur text-white text-xs font-semibold rounded-xl transition-colors">
                            <Download className="w-4 h-4" />
                            <span>Download Certificate</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ===== PURCHASES ===== */}
            {activeTab === 'purchases' && (
              <div className="space-y-5">
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Purchase History</h2>
                {purchases.length === 0 ? (
                  <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-premium border border-slate-100 dark:border-slate-800 space-y-4">
                    <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
                    <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">No purchase history yet</p>
                  </div>
                ) : purchases.map(order => (
                  <div key={order.id} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-premium p-6 shadow-sm space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Order #{order.id}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                      <span className="px-2.5 py-1 bg-green-100 dark:bg-green-950/20 text-green-700 dark:text-green-400 text-[9px] font-bold uppercase rounded-full">
                        Completed
                      </span>
                    </div>
                    <div className="text-xs space-y-1 border-t border-slate-100 dark:border-slate-800 pt-3">
                      <div className="flex justify-between text-slate-500 dark:text-slate-400">
                        <span>Subtotal</span><span>${order.subtotal?.toFixed(2)}</span>
                      </div>
                      {order.discountAmount > 0 && (
                        <div className="flex justify-between text-green-600 dark:text-green-400">
                          <span>Discount</span><span>-${order.discountAmount?.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-extrabold text-sm text-slate-900 dark:text-white border-t border-slate-100 dark:border-slate-800 pt-2">
                        <span>Total Paid</span><span>${order.grandTotal?.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ===== NOTIFICATIONS ===== */}
            {activeTab === 'notifications' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Notifications</h2>
                  {unreadCount > 0 && (
                    <button onClick={handleMarkAllNotificationsRead} className="text-xs text-primary-600 dark:text-primary-400 font-semibold hover:underline">
                      Mark All Read
                    </button>
                  )}
                </div>
                {notifications.length === 0 ? (
                  <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-premium border border-slate-100 dark:border-slate-800 space-y-4">
                    <Bell className="w-12 h-12 text-slate-300 mx-auto" />
                    <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">No notifications yet</p>
                  </div>
                ) : notifications.map(notif => (
                  <div key={notif.id} className={`bg-white dark:bg-slate-900 border rounded-premium p-5 shadow-sm flex items-start space-x-4 transition-colors ${!notif.isRead ? 'border-primary-200 dark:border-primary-800/30 bg-primary-50/30 dark:bg-primary-950/10' : 'border-slate-100 dark:border-slate-800'}`}>
                    <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${!notif.isRead ? 'bg-primary-500' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
                    <div className="flex-grow">
                      <p className="font-bold text-xs text-slate-900 dark:text-white">{notif.title}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{notif.content}</p>
                      <p className="text-[10px] text-slate-400 mt-1.5">{new Date(notif.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ===== MESSAGES ===== */}
            {activeTab === 'messages' && (
              <div className="space-y-5">
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Messages</h2>
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-premium overflow-hidden shadow-sm">
                  <div className="max-h-80 overflow-y-auto p-5 space-y-4 border-b border-slate-100 dark:border-slate-800">
                    {messages.length === 0 ? (
                      <div className="text-center py-8 space-y-2">
                        <MessageSquare className="w-10 h-10 text-slate-300 mx-auto" />
                        <p className="text-xs text-slate-400">No messages. Start a conversation with an instructor!</p>
                      </div>
                    ) : messages.map(msg => {
                      const isMine = msg.senderId === user.id;
                      return (
                        <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-xs px-4 py-3 rounded-premium text-xs leading-relaxed ${
                            isMine ? 'bg-primary-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
                          }`}>
                            {!isMine && <p className="font-bold mb-1 opacity-70">{msg.senderName}</p>}
                            <p>{msg.messageText}</p>
                            <p className={`text-[9px] mt-1 ${isMine ? 'opacity-60' : 'text-slate-400'}`}>
                              {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <form onSubmit={handleSendMessage} className="p-4 flex items-center space-x-3">
                    <select
                      value={msgRecipient}
                      onChange={e => setMsgRecipient(e.target.value)}
                      className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    >
                      <option value="usr-teacher-1">Dr. Angela Steele</option>
                      <option value="usr-admin">Admin Support</option>
                    </select>
                    <input
                      type="text"
                      value={msgText}
                      onChange={e => setMsgText(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-primary-500 text-slate-800 dark:text-slate-200"
                    />
                    <button type="submit" disabled={msgSending || !msgText} className="p-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-colors disabled:opacity-50">
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* ===== SETTINGS ===== */}
            {activeTab === 'settings' && (
              <div className="space-y-5">
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Profile Settings</h2>
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-premium p-8 shadow-sm">
                  <form onSubmit={handleSaveSettings} className="space-y-5">
                    {settingsSuccess && (
                      <div className="p-4 bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border border-green-200 rounded-premium flex items-center space-x-2 text-xs">
                        <CheckCircle2 className="w-4 h-4" /><span>Profile updated successfully!</span>
                      </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {[
                        { key: 'fullName', label: 'Full Name', placeholder: 'Jane Doe' },
                        { key: 'phone', label: 'Phone Number', placeholder: '+1 (555) 000-0000' },
                        { key: 'website', label: 'Personal Website', placeholder: 'https://yoursite.com' },
                        { key: 'linkedinUrl', label: 'LinkedIn Profile URL', placeholder: 'https://linkedin.com/in/...' },
                        { key: 'githubUrl', label: 'GitHub Profile URL', placeholder: 'https://github.com/...' },
                      ].map(({ key, label, placeholder }) => (
                        <div key={key} className="space-y-1.5 text-xs">
                          <label className="font-semibold text-slate-700 dark:text-slate-300">{label}</label>
                          <input
                            type="text"
                            value={settingsForm[key]}
                            onChange={e => setSettingsForm(p => ({ ...p, [key]: e.target.value }))}
                            placeholder={placeholder}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-premium focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-slate-100 transition-all"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="space-y-1.5 text-xs">
                      <label className="font-semibold text-slate-700 dark:text-slate-300">Bio / About</label>
                      <textarea
                        rows={4}
                        value={settingsForm.bio}
                        onChange={e => setSettingsForm(p => ({ ...p, bio: e.target.value }))}
                        placeholder="Tell us a bit about yourself..."
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-premium focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-slate-100 transition-all resize-none"
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      disabled={settingsSaving}
                      className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm rounded-premium shadow-md transition-colors disabled:opacity-60"
                    >
                      {settingsSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </form>
                </div>
              </div>
            )}

          </main>
        </div>
      </div>
    </PageTransition>
  );
};
