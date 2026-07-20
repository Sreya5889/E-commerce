import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { db } from '../../services/db';
import { INSTRUCTORS, COURSES } from '../../constants/mockData';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
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
  MessageSquare,
  ArrowLeft
} from 'lucide-react';
import { PageTransition } from '../../components/layout/PageTransition';

export const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart, isInCart, addToWishlist, isInWishlist } = useCart();

  const [course, setCourse] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Accordion active sections
  const [activeSections, setActiveSections] = useState({});
  // Video player modal
  const [previewVideoUrl, setPreviewVideoUrl] = useState(null);

  useEffect(() => {
    const loadCourseDetails = async () => {
      setLoading(true);
      try {
        const cData = await db.getCourseById(id);
        setCourse(cData);
        
        const rData = await db.getReviewsByCourse(id);
        setReviews(rData);

        // Open first section by default
        if (cData?.curriculum?.length > 0) {
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="max-w-md mx-auto text-center py-20 space-y-4">
        <h2 className="text-xl font-bold text-red-500">Course not found</h2>
        <Link to="/courses" className="inline-block px-4 py-2 bg-primary-600 text-white rounded-premium">
          Back to Courses
        </Link>
      </div>
    );
  }

  const teacher = INSTRUCTORS.find(t => t.id === course.teacherId);
  const isAlreadyInCart = isInCart(course.id);
  const isWishlisted = isInWishlist(course.id);

  // Filter other courses by same category
  const relatedCourses = COURSES.filter(c => c.category === course.category && c.id !== course.id).slice(0, 3);

  const toggleSection = (idx) => {
    setActiveSections(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleBuyNow = async () => {
    if (!isAlreadyInCart) {
      await addToCart(course.id);
    }
    navigate('/cart');
  };

  return (
    <PageTransition>
      {/* 1. Header Banner */}
      <div className="bg-slate-900 text-slate-100 py-12 md:py-16 transition-colors duration-300 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-8 space-y-4">
            <Link to="/courses" className="inline-flex items-center space-x-2 text-slate-400 hover:text-white transition-colors text-xs font-semibold">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Course Catalog</span>
            </Link>

            {course.badge && (
              <span className="inline-block px-3 py-1 bg-amber-500 text-white text-[10px] font-bold uppercase rounded-full shadow-sm">
                {course.badge}
              </span>
            )}
            
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight max-w-3xl">
              {course.title}
            </h1>
            <p className="text-base text-slate-300 max-w-3xl">
              {course.subtitle}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center text-amber-500 font-bold">
                <Star className="w-4 h-4 fill-current mr-1" />
                <span>{course.rating}</span>
                <span className="text-slate-400 font-normal ml-1">({reviews.length} reviews)</span>
              </div>
              <span className="text-slate-500">•</span>
              <span className="text-slate-300">{course.studentCount.toLocaleString()} Enrolled Students</span>
            </div>

            <div className="flex items-center space-x-4 text-xs text-slate-400">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{course.durationHours} Hours Duration</span>
              </div>
              <div className="flex items-center space-x-1">
                <Globe className="w-4 h-4" />
                <span>{course.language}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Award className="w-4 h-4" />
                <span>Verified Certificate</span>
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <img src={teacher?.avatar} alt={teacher?.name} className="w-8 h-8 rounded-full object-cover" />
              <div className="text-xs">
                <p className="text-slate-300">Created by <span className="font-semibold text-white">{teacher?.name}</span></p>
                <p className="text-slate-500">{teacher?.designation}</p>
              </div>
            </div>
          </div>
          
          {/* Desktop Right Side Sticky Payment Card */}
          <div className="lg:col-span-4 lg:absolute lg:top-12 lg:right-8 lg:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-premium p-6 shadow-2xl space-y-6 text-slate-800 dark:text-slate-100 z-20">
            <img src={course.thumbnail} alt={course.title} className="w-full aspect-video rounded-xl object-cover" />
            
            <div className="space-y-2">
              <div className="flex items-baseline space-x-3">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                  ${course.discountPrice || course.price}
                </span>
                {course.discountPrice && (
                  <span className="text-sm text-slate-400 line-through">
                    ${course.price}
                  </span>
                )}
                <span className="text-xs font-semibold text-green-600 bg-green-50 dark:bg-green-950/20 px-2 py-1 rounded">
                  {Math.round(((course.price - (course.discountPrice || course.price)) / course.price) * 100)}% OFF
                </span>
              </div>
              <p className="text-[10px] text-red-500 font-semibold animate-pulse">⏰ Sale ends in 24 hours at this price!</p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleBuyNow}
                className="w-full py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-premium font-bold text-sm shadow-md transition-colors"
              >
                Buy Now
              </button>
              <button
                onClick={() => addToCart(course.id)}
                disabled={isAlreadyInCart}
                className="w-full py-3 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-premium font-bold text-sm transition-colors"
              >
                {isAlreadyInCart ? 'Already in Cart' : 'Add to Cart'}
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-4">
              <h4 className="font-bold text-slate-700 dark:text-slate-300">This course includes:</h4>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-green-500" />
                  <span>Full Lifetime Access</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Award className="w-4 h-4 text-green-500" />
                  <span>Certificate of Completion</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-green-500" />
                  <span>30-Day Money-Back Guarantee</span>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>

      {/* 2. Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Columns (Syllabus, Specs, Teacher) */}
        <div className="lg:col-span-8 space-y-12">
          
          {/* What you'll learn */}
          <div className="p-6 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-premium space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">What You'll Learn</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-start space-x-2">
                <ShieldCheck className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
                <span>Build standard production-ready platforms using latest specifications.</span>
              </div>
              <div className="flex items-start space-x-2">
                <ShieldCheck className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
                <span>Master authentication systems, RLS setups, and secure databases.</span>
              </div>
              <div className="flex items-start space-x-2">
                <ShieldCheck className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
                <span>Architect responsive and premium layout designs using flex and grid patterns.</span>
              </div>
              <div className="flex items-start space-x-2">
                <ShieldCheck className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
                <span>Understand state managers, custom hooks, and server fetching strategies.</span>
              </div>
            </div>
          </div>

          {/* Curriculum Sections Accordion */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Course Curriculum</h2>
            <div className="border border-slate-200 dark:border-slate-800 rounded-premium overflow-hidden bg-white dark:bg-slate-900">
              {course.curriculum && course.curriculum.map((section, sIdx) => {
                const isOpen = activeSections[sIdx];
                return (
                  <div key={sIdx} className="border-b border-slate-100 dark:border-slate-850 last:border-0">
                    <button
                      onClick={() => toggleSection(sIdx)}
                      className="w-full flex items-center justify-between p-5 bg-slate-50/50 dark:bg-slate-900/50 text-left font-bold text-sm text-slate-800 dark:text-slate-200 focus:outline-none"
                    >
                      <span>{section.title}</span>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isOpen && (
                      <div className="px-5 py-3 divide-y divide-slate-100 dark:divide-slate-800/50 bg-white dark:bg-slate-900">
                        {section.lessons && section.lessons.map((lesson) => (
                          <div key={lesson.id} className="py-3 flex items-center justify-between text-xs">
                            <div className="flex items-center space-x-2.5">
                              {lesson.isPreview ? (
                                <button
                                  onClick={() => setPreviewVideoUrl(lesson.videoUrl)}
                                  className="text-primary-600 hover:text-primary-700 transition-colors flex items-center space-x-2.5 font-semibold"
                                >
                                  <PlayCircle className="w-4.5 h-4.5 text-primary-600" />
                                  <span>{lesson.title}</span>
                                </button>
                              ) : (
                                <div className="flex items-center space-x-2.5 text-slate-500">
                                  <Lock className="w-4 h-4 text-slate-400" />
                                  <span>{lesson.title}</span>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center space-x-3 text-slate-400">
                              <span>{lesson.duration} mins</span>
                              {lesson.isPreview && (
                                <button
                                  onClick={() => setPreviewVideoUrl(lesson.videoUrl)}
                                  className="px-2.5 py-1 bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400 font-bold rounded text-[10px] uppercase"
                                >
                                  Preview
                                </button>
                              )}
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

          {/* Instructor Bio */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Your Instructor</h2>
            <div className="p-6 border border-slate-100 dark:border-slate-800 rounded-premium bg-white dark:bg-slate-900 space-y-6">
              <div className="flex items-center space-x-4">
                <img src={teacher?.avatar} alt={teacher?.name} className="w-16 h-16 rounded-premium object-cover" />
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">{teacher?.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{teacher?.qualification} • {teacher?.designation}</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {teacher?.biography}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center border-t border-slate-100 dark:border-slate-800 pt-4 text-xs">
                <div>
                  <p className="font-bold text-slate-950 dark:text-white">{teacher?.rating} ★</p>
                  <p className="text-[10px] text-slate-400">Instructor Rating</p>
                </div>
                <div>
                  <p className="font-bold text-slate-950 dark:text-white">{teacher?.students.toLocaleString()}</p>
                  <p className="text-[10px] text-slate-400">Total Students</p>
                </div>
                <div>
                  <p className="font-bold text-slate-950 dark:text-white">{teacher?.totalCourses}</p>
                  <p className="text-[10px] text-slate-400">Courses</p>
                </div>
                <div>
                  <p className="font-bold text-slate-950 dark:text-white">{teacher?.experience.split(',')[0]}</p>
                  <p className="text-[10px] text-slate-400">Experience</p>
                </div>
              </div>
            </div>
          </div>

          {/* Student Reviews */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Student Reviews</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-premium">
              <div className="text-center space-y-1.5">
                <h3 className="text-4xl font-extrabold text-slate-900 dark:text-white">{course.rating}</h3>
                <div className="flex justify-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < Math.floor(course.rating) ? 'fill-current' : ''}`} />
                  ))}
                </div>
                <p className="text-xs text-slate-400">Course Rating</p>
              </div>
              
              <div className="md:col-span-2 space-y-2 text-xs">
                {/* Visual bar distributions */}
                {[
                  { stars: 5, pct: '82%' },
                  { stars: 4, pct: '12%' },
                  { stars: 3, pct: '4%' },
                  { stars: 2, pct: '1%' },
                  { stars: 1, pct: '1%' }
                ].map((row, idx) => (
                  <div key={idx} className="flex items-center space-x-3">
                    <span className="w-3 text-slate-600 dark:text-slate-400">{row.stars}</span>
                    <Star className="w-3 h-3 text-amber-500 fill-current" />
                    <div className="flex-grow h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400" style={{ width: row.pct }}></div>
                    </div>
                    <span className="w-8 text-right text-slate-400">{row.pct}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {reviews.map((rev) => (
                <div key={rev.id} className="p-6 border border-slate-100 dark:border-slate-800 rounded-premium bg-white dark:bg-slate-900 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{rev.userName}</h4>
                      <p className="text-[10px] text-slate-400">{new Date(rev.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-current' : ''}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {rev.comment}
                  </p>
                  {rev.replyComment && (
                    <div className="mt-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-premium border border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-slate-950 dark:text-white">Response from {teacher?.name}:</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-350">{rev.replyComment}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Video Preview Modal */}
      {previewVideoUrl && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setPreviewVideoUrl(null)}></div>
          <div className="relative w-full max-w-3xl bg-slate-900 rounded-premium overflow-hidden shadow-2xl border border-slate-800">
            <div className="p-4 border-b border-slate-850 flex items-center justify-between text-white">
              <span className="font-bold text-sm">Course Preview Video</span>
              <button onClick={() => setPreviewVideoUrl(null)} className="p-1 hover:bg-slate-800 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="aspect-video bg-black flex items-center justify-center">
              <video src={previewVideoUrl} controls autoPlay className="w-full h-full object-contain" />
            </div>
          </div>
        </div>
      )}

    </PageTransition>
  );
};
