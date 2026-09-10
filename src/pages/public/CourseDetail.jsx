import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { courseService } from '../../services/course.service';
import { reviewService } from '../../services/review.service';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  Star,
  Clock,
  Globe,
  Award,
  Calendar,
  Lock,
  PlayCircle,
  HelpCircle,
  ChevronDown,
  ShieldCheck,
  Heart,
  ShoppingCart,
  CheckCircle2,
  Users,
  BookOpen,
  ArrowLeft,
  Share2,
  Check,
  X
} from 'lucide-react';
import { PageTransition } from '../../components/layout/PageTransition';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { CourseCard } from '../../components/ui/CourseCard';
import { Modal } from '../../components/ui/Modal';

export const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart, isInCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();
  const toast = useToast();

  const [course, setCourse] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [relatedCourses, setRelatedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Accordion active sections
  const [activeSections, setActiveSections] = useState({ 0: true });
  // Video player modal
  const [previewVideoUrl, setPreviewVideoUrl] = useState(null);

  useEffect(() => {
    const loadCourseDetails = async () => {
      setLoading(true);
      try {
        const cData = await courseService.getCourseById(id);
        setCourse(cData);
        
        const [rData, allCourses] = await Promise.all([
          reviewService.getCourseReviews(id),
          courseService.getCourses()
        ]);
        setReviews(rData || []);
        
        // Pick 3 related courses
        const related = (allCourses || []).filter(c => c.id !== id).slice(0, 3);
        setRelatedCourses(related);

        if (cData?.course_sections?.length > 0) {
          setActiveSections({ 0: true });
        }
      } catch (err) {
        setError('Course not found');
      } finally {
        setLoading(false);
      }
    };
    loadCourseDetails();
  }, [id]);

  const toggleSection = (idx) => {
    setActiveSections(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Course Not Found</h2>
        <p className="text-xs text-slate-500">The requested course does not exist or has been relocated.</p>
        <Link to="/courses">
          <Button>Browse All Courses</Button>
        </Link>
      </div>
    );
  }

  const inCart = isInCart(course.id);
  const inWishlist = isInWishlist(course.id);

  const teacher = course.teachers;
  const teacherName = teacher?.profiles?.display_name ||
    `${teacher?.profiles?.first_name || ''} ${teacher?.profiles?.last_name || ''}`.trim() ||
    course.instructor_name ||
    'Senior Staff Instructor';

  const teacherAvatar = teacher?.profiles?.avatar_url ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(teacherName)}&size=160&background=2563eb&color=fff`;

  const rating = Number(course.avg_rating ?? course.rating ?? 4.8).toFixed(1);
  const studentCount = Number(course.student_count ?? course.studentCount ?? 1240).toLocaleString();
  const price = Number(course.price ?? 49.99);
  const discountPrice = course.discount_price !== undefined && course.discount_price !== null
    ? Number(course.discount_price)
    : course.discountPrice !== undefined && course.discountPrice !== null
    ? Number(course.discountPrice)
    : price;
  const hasDiscount = discountPrice > 0 && discountPrice < price;

  const totalLessons = course.course_sections?.reduce(
    (acc, sec) => acc + (sec.course_lessons?.length || 0), 0
  ) || 24;

  const handleBuyNow = () => {
    if (!inCart) addToCart(course.id);
    navigate('/cart');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Course link copied to clipboard!');
  };

  const outcomes = [
    'Master production architecture, state management, and modern component design',
    'Write clean, maintainable, and type-safe code following industry standards',
    'Build and deploy portfolio-ready projects deployed to live servers',
    'Gain confidence in technical interviews and system design assessments',
    'Understand best practices for performance, accessibility, and testing',
    'Earn a verifiable certificate of completion to showcase to employers'
  ];

  return (
    <PageTransition>
      <div className="w-full">
        
        {/* ====================================================
            HEADER / HERO BANNER
            ==================================================== */}
        <section className="bg-slate-900 text-white pt-10 pb-16 relative overflow-hidden border-b border-slate-800">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(37,99,235,0.15),transparent_50%)] pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              
              {/* Left Details */}
              <div className="lg:col-span-8 space-y-5">
                
                {/* Breadcrumbs */}
                <div className="flex items-center space-x-2 text-xs text-slate-400">
                  <Link to="/" className="hover:text-white transition-colors">Home</Link>
                  <span>/</span>
                  <Link to="/courses" className="hover:text-white transition-colors">Courses</Link>
                  <span>/</span>
                  <span className="text-primary-400 font-semibold truncate max-w-[200px]">
                    {course.categories?.name || course.category || 'Development'}
                  </span>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2">
                  {course.is_bestseller && (
                    <Badge variant="bestseller" size="sm">Bestseller</Badge>
                  )}
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700 uppercase">
                    {course.level || 'All Levels'}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center space-x-1">
                    <Globe className="w-3.5 h-3.5" />
                    <span>{course.language || 'English'}</span>
                  </span>
                </div>

                {/* Course Title */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                  {course.title}
                </h1>

                {/* Subtitle */}
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                  {course.subtitle || course.description}
                </p>

                {/* Social Proof Bar */}
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-300 pt-1">
                  <div className="flex items-center space-x-1 text-amber-400 font-bold">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-white text-sm">{rating}</span>
                    <span className="text-slate-400 font-normal">({reviews.length || 1840} reviews)</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span>{studentCount} students enrolled</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span>Updated Recently</span>
                  </div>
                </div>

                {/* Instructor Chip */}
                <div className="flex items-center space-x-3 pt-2">
                  <img
                    src={teacherAvatar}
                    alt={teacherName}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-primary-500"
                  />
                  <div>
                    <p className="text-xs text-slate-400 font-medium">Created by</p>
                    <p className="text-sm font-bold text-white hover:text-primary-400 transition-colors">
                      {teacherName}
                    </p>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </section>

        {/* ====================================================
            MAIN BODY: DETAILS + STICKY PRICING CARD
            ==================================================== */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Column Content */}
            <div className="lg:col-span-8 space-y-12">
              
              {/* 1. What You'll Learn Box */}
              <div className="p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-5">
                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  What You'll Learn
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {outcomes.map((item, idx) => (
                    <div key={idx} className="flex items-start space-x-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="leading-snug">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Course Curriculum */}
              <div className="space-y-4">
                <div className="flex items-baseline justify-between">
                  <div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                      Course Curriculum
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {course.course_sections?.length || 3} sections • {totalLessons} lectures • {course.duration_hours || 14}h total length
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const allOpen = Object.keys(activeSections).length === (course.course_sections?.length || 0);
                      const updated = {};
                      (course.course_sections || []).forEach((_, i) => updated[i] = !allOpen);
                      setActiveSections(updated);
                    }}
                    className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    Toggle All Sections
                  </button>
                </div>

                <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                  {(course.course_sections || [
                    {
                      id: 'sec-1',
                      title: 'Section 1: Foundations & Architecture Setup',
                      course_lessons: [
                        { id: 'l1', title: 'Course Welcome & High-Level Tour', duration_minutes: 8, is_preview: true, video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' },
                        { id: 'l2', title: 'Setting Up Modern Dev Tools', duration_minutes: 15, is_preview: false },
                        { id: 'l3', title: 'Architectural Blueprint Overview', duration_minutes: 22, is_preview: false }
                      ]
                    },
                    {
                      id: 'sec-2',
                      title: 'Section 2: Deep Dive into Real-World Implementation',
                      course_lessons: [
                        { id: 'l4', title: 'State Patterns and Async Workflows', duration_minutes: 25, is_preview: true, video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4' },
                        { id: 'l5', title: 'Handling Edge Cases & Error Boundaries', duration_minutes: 30, is_preview: false }
                      ]
                    }
                  ]).map((section, sIdx) => {
                    const isOpen = !!activeSections[sIdx];
                    const lessons = section.course_lessons || [];

                    return (
                      <div key={section.id || sIdx} className="overflow-hidden">
                        <button
                          onClick={() => toggleSection(sIdx)}
                          className="w-full px-6 py-4 bg-slate-50/70 dark:bg-slate-850/50 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between text-left transition-colors"
                        >
                          <div className="flex items-center space-x-3 min-w-0 pr-4">
                            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                            <span className="font-bold text-sm text-slate-900 dark:text-white truncate">
                              {section.title}
                            </span>
                          </div>
                          <span className="text-xs text-slate-500 dark:text-slate-400 flex-shrink-0 font-medium">
                            {lessons.length} lectures
                          </span>
                        </button>

                        {isOpen && (
                          <div className="divide-y divide-slate-50 dark:divide-slate-800/40 px-6 py-2 bg-white dark:bg-slate-900">
                            {lessons.map((lesson) => (
                              <div
                                key={lesson.id}
                                className="py-3 flex items-center justify-between text-xs text-slate-700 dark:text-slate-300 hover:text-primary-600 transition-colors"
                              >
                                <div className="flex items-center space-x-3">
                                  {lesson.is_preview ? (
                                    <button
                                      onClick={() => setPreviewVideoUrl(lesson.video_url || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4')}
                                      className="flex items-center space-x-1.5 text-primary-600 dark:text-primary-400 font-bold hover:underline"
                                    >
                                      <PlayCircle className="w-4 h-4" />
                                      <span>{lesson.title}</span>
                                    </button>
                                  ) : (
                                    <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
                                      <Lock className="w-3.5 h-3.5 text-slate-400" />
                                      <span>{lesson.title}</span>
                                    </div>
                                  )}
                                </div>
                                
                                <div className="flex items-center space-x-3">
                                  {lesson.is_preview && (
                                    <button
                                      onClick={() => setPreviewVideoUrl(lesson.video_url || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4')}
                                      className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary-50 text-primary-600 dark:bg-primary-950/40 uppercase"
                                    >
                                      Preview
                                    </button>
                                  )}
                                  <span className="text-slate-400 font-mono text-[11px]">
                                    {lesson.duration_minutes || 10}m
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 3. Requirements & Description */}
              <div className="space-y-4">
                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  Requirements
                </h2>
                <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  <li>A computer (Windows, macOS, or Linux) with internet access</li>
                  <li>Basic understanding of modern programming concepts</li>
                  <li>No prior advanced framework experience required — we build up from fundamentals</li>
                </ul>

                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight pt-4">
                  Description
                </h2>
                <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed space-y-3">
                  <p>{course.description}</p>
                  <p>
                    Every lesson includes exercise repositories, solution code branches, and production architectural diagrams. You will not only learn the syntax, but also the mental models required to debug, test, and ship resilient code in commercial software teams.
                  </p>
                </div>
              </div>

              {/* 4. Instructor Card */}
              <div className="p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  Your Instructor
                </h2>
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-5">
                  <img
                    src={teacherAvatar}
                    alt={teacherName}
                    className="w-20 h-20 rounded-2xl object-cover ring-4 ring-primary-50 dark:ring-primary-950/40"
                  />
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{teacherName}</h3>
                    <p className="text-xs text-primary-600 dark:text-primary-400 font-semibold">{teacher?.expertise_areas?.[0] || 'Senior Engineering Leader'}</p>
                    <div className="flex items-center space-x-4 text-xs text-slate-500 pt-1.5">
                      <span className="flex items-center space-x-1 font-bold text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{Number(teacher?.avg_rating ?? 4.9).toFixed(1)} Instructor Rating</span>
                      </span>
                      <span>•</span>
                      <span>{teacher?.total_students?.toLocaleString() || '1.2M'} Students</span>
                      <span>•</span>
                      <span>{teacher?.total_courses || 12} Courses</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-2">
                  {teacher?.profiles?.bio || 'Teaching practical engineering and software architecture to learners globally.'}
                </p>
              </div>

              {/* 5. Student Reviews */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                    Student Feedback & Reviews
                  </h2>
                  <div className="flex items-center space-x-1 text-amber-500 font-bold text-sm">
                    <Star className="w-4 h-4 fill-current" />
                    <span>{rating} course rating</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {reviews.map((rev) => {
                    const reviewerName = rev.profiles?.display_name || rev.userName || 'Verified Student';
                    const reviewerAvatar = rev.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(reviewerName)}&background=random`;

                    return (
                      <div key={rev.id} className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <img src={reviewerAvatar} alt={reviewerName} className="w-9 h-9 rounded-full object-cover" />
                            <div>
                              <h4 className="font-bold text-xs text-slate-900 dark:text-white">{reviewerName}</h4>
                              <div className="flex items-center space-x-1 text-amber-500">
                                {[...Array(Number(rev.rating) || 5)].map((_, i) => (
                                  <Star key={i} className="w-3 h-3 fill-current" />
                                ))}
                              </div>
                            </div>
                          </div>
                          <span className="text-[11px] text-slate-400 font-medium">Verified Purchase</span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                          {rev.review || rev.comment}
                        </p>
                        {rev.instructor_reply && (
                          <div className="mt-2 p-3 bg-slate-50 dark:bg-slate-850 rounded-xl text-xs space-y-1 border-l-2 border-primary-500">
                            <p className="font-bold text-slate-800 dark:text-slate-200">Instructor Response</p>
                            <p className="text-slate-600 dark:text-slate-400">{rev.instructor_reply}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 6. Related Courses Carousel */}
              {relatedCourses.length > 0 && (
                <div className="space-y-6 pt-4">
                  <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                    Frequently Bought Together / Related Courses
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {relatedCourses.map((c) => (
                      <CourseCard key={c.id} course={c} />
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Right Column: Sticky Pricing & Enrollment Card */}
            <div className="lg:col-span-4 sticky top-28 space-y-6">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-6">
                
                {/* Course Video Preview Box */}
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 group cursor-pointer"
                  onClick={() => setPreviewVideoUrl('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4')}
                >
                  <img
                    src={course.thumbnail_url || course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600'}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/30 transition-colors">
                    <div className="w-14 h-14 rounded-full bg-white/90 text-primary-600 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                      <PlayCircle className="w-8 h-8 fill-current" />
                    </div>
                  </div>
                  <span className="absolute bottom-3 left-1/2 -translate-x-1/2 text-white text-[11px] font-bold tracking-wide drop-shadow-md">
                    Preview this course
                  </span>
                </div>

                {/* Price Display */}
                <div className="space-y-1">
                  <div className="flex items-baseline space-x-3">
                    <span className="text-3xl font-black text-slate-900 dark:text-white">
                      ${hasDiscount ? discountPrice.toFixed(2) : price.toFixed(2)}
                    </span>
                    {hasDiscount && (
                      <>
                        <span className="text-sm text-slate-400 line-through font-medium">
                          ${price.toFixed(2)}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                          {Math.round(((price - discountPrice) / price) * 100)}% off
                        </span>
                      </>
                    )}
                  </div>
                  <p className="text-[11px] text-rose-500 font-bold flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>Special promotional pricing ends soon!</span>
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    size="lg"
                    className="w-full font-bold shadow-lg shadow-primary-500/25"
                    onClick={handleBuyNow}
                  >
                    Buy Now
                  </Button>
                  
                  <button
                    onClick={() => {
                      if (inCart) {
                        toast.info('Course is already in your cart.');
                        navigate('/cart');
                      } else {
                        addToCart(course.id);
                        toast.success('Course added to cart!');
                      }
                    }}
                    className={`w-full py-3 rounded-xl text-sm font-bold border transition-all ${
                      inCart
                        ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-300'
                        : 'border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {inCart ? 'View in Cart' : 'Add to Cart'}
                  </button>

                  <div className="flex items-center space-x-2 pt-1">
                    <button
                      onClick={() => {
                        if (inWishlist) {
                          removeFromWishlist(course.id);
                          toast.info('Removed from wishlist');
                        } else {
                          addToWishlist(course.id);
                          toast.success('Saved to wishlist!');
                        }
                      }}
                      className={`flex-1 flex items-center justify-center space-x-1.5 py-2.5 rounded-xl border text-xs font-bold transition-colors ${
                        inWishlist
                          ? 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 border-rose-200'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current text-rose-500' : ''}`} />
                      <span>{inWishlist ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
                    </button>

                    <button
                      onClick={handleShare}
                      className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-colors"
                      title="Share course"
                      aria-label="Share course"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Assurance Points */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>30-Day Money-Back Guarantee</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span>Full Lifetime Access</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Award className="w-4 h-4 text-primary-500 flex-shrink-0" />
                    <span>Certificate of Completion Included</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span>Access on Mobile & Desktop</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* Video Preview Modal */}
        <Modal
          isOpen={!!previewVideoUrl}
          onClose={() => setPreviewVideoUrl(null)}
          title="Sample Video Preview"
          size="lg"
        >
          <div className="space-y-4">
            <div className="aspect-video bg-black rounded-xl overflow-hidden">
              {previewVideoUrl && (
                <video
                  src={previewVideoUrl}
                  controls
                  autoPlay
                  className="w-full h-full"
                />
              )}
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-sm text-slate-900 dark:text-white">{course.title}</p>
                <p className="text-xs text-slate-500">Free preview lesson</p>
              </div>
              <Button size="sm" onClick={handleBuyNow}>Enroll Now</Button>
            </div>
          </div>
        </Modal>

      </div>
    </PageTransition>
  );
};
