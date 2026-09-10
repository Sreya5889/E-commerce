import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { courseService } from '../../services/course.service';
import { progressService } from '../../services/progress.service';
import { reviewService } from '../../services/review.service';
import {
  Play, Pause, SkipBack, SkipForward, CheckCircle2, Circle,
  ChevronDown, ChevronUp, ChevronLeft, Volume2, VolumeX, Maximize,
  FileText, Download, MessageSquare, Star, Award, BookOpen, Clock,
  Menu, X, Check, Share2, HelpCircle, ExternalLink, ThumbsUp
} from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const CoursePlayer = () => {
  const { courseId, lessonId: paramLessonId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeLesson, setActiveLesson] = useState(null);
  const [completedLessons, setCompletedLessons] = useState(new Set());
  const [expandedSections, setExpandedSections] = useState(new Set());
  const [activeTab, setActiveTab] = useState('overview'); // overview, resources, qa, reviews, notes
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Video player state
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [autoplayNext, setAutoplayNext] = useState(true);

  // Notes state (stored per lesson in localStorage)
  const [personalNote, setPersonalNote] = useState('');
  const [noteSaved, setNoteSaved] = useState(false);

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [userRating, setUserRating] = useState(5);
  const [userReviewText, setUserReviewText] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Q&A state
  const [questions, setQuestions] = useState([
    {
      id: 'q1',
      author: 'David Miller',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
      time: '2 days ago',
      title: 'How do we handle state persistence across page refreshes in this setup?',
      content: 'In lecture 3, we configured the main store, but what is the recommended practice for persisting tokens securely?',
      upvotes: 4,
      answers: [
        {
          author: 'Alex Chen (Instructor)',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
          time: '1 day ago',
          content: 'Great question! You can store session tokens in httpOnly cookies or utilize the local storage sync middleware shown in lecture 5.'
        }
      ]
    },
    {
      id: 'q2',
      author: 'Sarah Jenkins',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      time: '4 days ago',
      title: 'Can we use Docker compose instead of local Postgres installation?',
      content: 'I followed along with the setup scripts, but wondered if a containerized Docker file is provided in the course assets.',
      upvotes: 7,
      answers: [
        {
          author: 'Alex Chen (Instructor)',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
          time: '3 days ago',
          content: 'Yes! Check the Resources tab for this section; the repository includes a docker-compose.yml ready to launch with a single command.'
        }
      ]
    }
  ]);
  const [newQuestionTitle, setNewQuestionTitle] = useState('');
  const [newQuestionBody, setNewQuestionBody] = useState('');

  // 1. Fetch course details
  useEffect(() => {
    const loadCourse = async () => {
      setLoading(true);
      try {
        const data = await courseService.getCourseById(courseId);
        if (data) {
          setCourse(data);

          // Find first lesson or match paramLessonId
          const sections = data.course_sections || [];
          let targetLesson = null;
          const initialExpanded = new Set();

          sections.forEach((sec, sIdx) => {
            initialExpanded.add(sec.id || `sec-${sIdx}`);
            (sec.course_lessons || []).forEach(l => {
              if (paramLessonId && (l.id === paramLessonId || String(l.id) === String(paramLessonId))) {
                targetLesson = l;
              }
            });
          });

          if (!targetLesson && sections.length > 0 && sections[0].course_lessons?.length > 0) {
            targetLesson = sections[0].course_lessons[0];
          }

          setActiveLesson(targetLesson);
          setExpandedSections(initialExpanded);
        }
      } catch (err) {
        console.error('Failed to load course for player:', err);
        toast.error('Unable to load course classroom.');
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      loadCourse();
    }
  }, [courseId, paramLessonId]);

  // 2. Fetch user progress & reviews
  useEffect(() => {
    if (!user?.id || !course?.id) return;

    const loadProgressAndReviews = async () => {
      try {
        const [progressData, reviewsData] = await Promise.all([
          progressService.getLessonProgress(user.id, course.id).catch(() => []),
          reviewService.getCourseReviews(course.id).catch(() => [])
        ]);

        if (progressData && progressData.length > 0) {
          const completedSet = new Set(
            progressData.filter(p => p.completed).map(p => String(p.lesson_id))
          );
          setCompletedLessons(completedSet);
        }

        if (reviewsData && reviewsData.length > 0) {
          setReviews(reviewsData);
        }
      } catch (err) {
        console.warn('Non-fatal error loading user progress/reviews:', err);
      }
    };

    loadProgressAndReviews();
  }, [user?.id, course?.id]);

  // 3. Load note for active lesson from localStorage
  useEffect(() => {
    if (activeLesson?.id) {
      const saved = localStorage.getItem(`edu_note_${courseId}_${activeLesson.id}`);
      setPersonalNote(saved || '');
      setNoteSaved(false);
      setIsPlaying(false);
    }
  }, [activeLesson?.id, courseId]);

  // Flattened list of all lessons for prev/next navigation
  const allLessons = useMemo(() => {
    if (!course?.course_sections) return [];
    const list = [];
    course.course_sections.forEach(sec => {
      (sec.course_lessons || []).forEach(les => {
        list.push({ ...les, sectionTitle: sec.title });
      });
    });
    return list;
  }, [course]);

  const currentLessonIndex = useMemo(() => {
    if (!activeLesson || allLessons.length === 0) return -1;
    return allLessons.findIndex(l => String(l.id) === String(activeLesson.id));
  }, [activeLesson, allLessons]);

  const prevLesson = currentLessonIndex > 0 ? allLessons[currentLessonIndex - 1] : null;
  const nextLesson = currentLessonIndex < allLessons.length - 1 ? allLessons[currentLessonIndex + 1] : null;

  // Calculate course completion percentage
  const totalLessonsCount = allLessons.length;
  const completedCount = allLessons.filter(l => completedLessons.has(String(l.id))).length;
  const overallPercentage = totalLessonsCount > 0 ? Math.round((completedCount / totalLessonsCount) * 100) : 0;

  // Toggle lesson complete state
  const handleToggleComplete = async (lessonToToggle = activeLesson) => {
    if (!lessonToToggle) return;
    const lessonIdStr = String(lessonToToggle.id);
    const isNowCompleted = !completedLessons.has(lessonIdStr);

    const updated = new Set(completedLessons);
    if (isNowCompleted) {
      updated.add(lessonIdStr);
    } else {
      updated.delete(lessonIdStr);
    }
    setCompletedLessons(updated);

    try {
      if (user?.id && course?.id) {
        await progressService.updateLessonProgress(
          user.id,
          course.id,
          lessonToToggle.id,
          isNowCompleted,
          60,
          0
        );
      }
      if (isNowCompleted) {
        toast.success(`Lesson completed! 🎉 (${updated.size}/${totalLessonsCount})`);
        // If autoplay and there's a next lesson, advance automatically
        if (autoplayNext && nextLesson && lessonToToggle.id === activeLesson?.id) {
          setTimeout(() => {
            setActiveLesson(nextLesson);
          }, 800);
        }
      } else {
        toast.info('Lesson marked as incomplete.');
      }
    } catch (err) {
      console.error('Failed to sync progress with backend:', err);
    }
  };

  // Section toggle in sidebar
  const toggleSection = (sectionId) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  // Play/pause controls
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const handleSaveNote = () => {
    if (!activeLesson?.id) return;
    localStorage.setItem(`edu_note_${courseId}_${activeLesson.id}`, personalNote);
    setNoteSaved(true);
    toast.success('Note saved locally.');
    setTimeout(() => setNoteSaved(false), 2500);
  };

  const handleAddQuestion = (e) => {
    e.preventDefault();
    if (!newQuestionTitle.trim()) return;

    const newQ = {
      id: `q_${Date.now()}`,
      author: user?.user_metadata?.first_name || user?.email?.split('@')[0] || 'You',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.email || 'User')}&background=2563eb&color=fff`,
      time: 'Just now',
      title: newQuestionTitle,
      content: newQuestionBody,
      upvotes: 0,
      answers: []
    };

    setQuestions([newQ, ...questions]);
    setNewQuestionTitle('');
    setNewQuestionBody('');
    toast.success('Question posted to course discussion forum.');
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!userReviewText.trim()) return;

    setSubmittingReview(true);
    try {
      if (user?.id && course?.id) {
        await reviewService.createReview(user.id, course.id, userRating, userReviewText);
      }
      const newRev = {
        id: `rev_${Date.now()}`,
        rating: userRating,
        comment: userReviewText,
        created_at: new Date().toISOString(),
        profiles: {
          display_name: user?.user_metadata?.first_name || user?.email?.split('@')[0] || 'Student',
          avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.email || 'Student')}`
        }
      };
      setReviews([newRev, ...reviews]);
      setUserReviewText('');
      toast.success('Thank you for submitting your course feedback!');
    } catch (err) {
      toast.error('Failed to submit review. Please try again.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white space-y-4">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-slate-400 font-medium">Entering interactive classroom...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white space-y-4 p-6">
        <h2 className="text-2xl font-bold">Course Not Found</h2>
        <p className="text-slate-400 text-sm">The course you are attempting to access does not exist or has been retired.</p>
        <Link to="/courses">
          <Button>Explore All Courses</Button>
        </Link>
      </div>
    );
  }

  const isCurrentCompleted = activeLesson ? completedLessons.has(String(activeLesson.id)) : false;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* 1. TOP CLASSROOM NAV BAR */}
      <header className="h-16 bg-slate-900/95 backdrop-blur border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center space-x-4 min-w-0">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">My Courses</span>
          </button>

          <div className="h-5 w-px bg-slate-800 hidden sm:block"></div>

          <div className="min-w-0">
            <h1 className="text-sm font-bold text-white truncate max-w-xs sm:max-w-md md:max-w-lg">
              {course.title}
            </h1>
            <p className="text-[11px] text-slate-400 truncate hidden md:block">
              {activeLesson ? activeLesson.title : 'Select a lesson'}
            </p>
          </div>
        </div>

        {/* Progress & Actions */}
        <div className="flex items-center space-x-3 sm:space-x-5">
          <div className="hidden lg:flex items-center space-x-3 text-xs">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Your Progress</span>
              <p className="font-extrabold text-primary-400">{overallPercentage}% Complete</p>
            </div>
            <div className="w-28 h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-primary-500 to-indigo-500 transition-all duration-300 rounded-full"
                style={{ width: `${overallPercentage}%` }}
              />
            </div>
          </div>

          {overallPercentage === 100 && (
            <div className="hidden sm:flex items-center space-x-1 px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-xs font-bold animate-pulse">
              <Award className="w-3.5 h-3.5" />
              <span>Certified</span>
            </div>
          )}

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors flex items-center space-x-1 text-xs"
            title="Toggle Course Syllabus"
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden md:inline font-semibold">{sidebarOpen ? 'Hide Syllabus' : 'Show Syllabus'}</span>
          </button>
        </div>
      </header>

      {/* 2. MAIN LEARNING STAGE */}
      <div className="flex-1 flex overflow-hidden">
        {/* CENTER PLAYER & LESSON DETAILS */}
        <main className={`flex-1 overflow-y-auto transition-all duration-300 ${sidebarOpen ? 'lg:mr-96' : ''}`}>
          {/* Video Container */}
          <div className="w-full bg-black aspect-video max-h-[72vh] flex items-center justify-center relative group select-none shadow-2xl">
            {activeLesson?.video_url ? (
              <video
                ref={videoRef}
                src={activeLesson.video_url}
                className="w-full h-full object-contain"
                controls
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => handleToggleComplete(activeLesson)}
              />
            ) : (
              /* Simulated High-Fidelity Video Player for interactive previews */
              <div className="relative w-full h-full bg-gradient-to-br from-slate-900 via-slate-950 to-black flex flex-col items-center justify-center p-6 text-center">
                <div className="absolute inset-0 bg-[radial-gradient(#2563eb15_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none"></div>

                <div className="relative z-10 space-y-4 max-w-lg">
                  <div className="w-20 h-20 rounded-3xl bg-primary-600/20 border border-primary-500/30 flex items-center justify-center text-primary-400 mx-auto shadow-2xl backdrop-blur">
                    <Play className="w-10 h-10 ml-1 fill-current" />
                  </div>
                  <div className="space-y-1">
                    <span className="px-2.5 py-0.5 bg-primary-500/10 text-primary-400 border border-primary-500/20 text-[10px] font-extrabold uppercase rounded-full tracking-wider">
                      Interactive Lecture
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-white">{activeLesson?.title || 'Course Lecture'}</h3>
                    <p className="text-xs text-slate-400">
                      Duration: {activeLesson?.duration_minutes || 15} minutes • Professional HD Masterclass
                    </p>
                  </div>

                  <div className="pt-2 flex justify-center space-x-3">
                    <Button
                      size="sm"
                      onClick={togglePlay}
                      className="shadow-lg shadow-primary-600/30"
                    >
                      {isPlaying ? <Pause className="w-4 h-4 mr-1.5" /> : <Play className="w-4 h-4 mr-1.5 fill-current" />}
                      {isPlaying ? 'Pause Stream' : 'Begin Video Lecture'}
                    </Button>
                  </div>
                </div>

                {/* Bottom Custom Playback Bar */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-center justify-between text-xs text-slate-300">
                  <div className="flex items-center space-x-4">
                    <button onClick={togglePlay} className="hover:text-white transition-colors">
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
                    </button>
                    <span className="text-[11px] font-mono text-slate-400">
                      {isPlaying ? '04:12' : '00:00'} / {activeLesson?.duration_minutes ? `${activeLesson.duration_minutes}:00` : '15:00'}
                    </span>
                  </div>

                  <div className="flex items-center space-x-4">
                    {/* Speed selector */}
                    <div className="flex items-center space-x-1 bg-slate-800/80 px-2 py-1 rounded-md text-[11px]">
                      {[0.75, 1, 1.25, 1.5, 2].map(speed => (
                        <button
                          key={speed}
                          onClick={() => handleSpeedChange(speed)}
                          className={`px-1.5 py-0.5 rounded ${playbackSpeed === speed ? 'bg-primary-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
                        >
                          {speed}x
                        </button>
                      ))}
                    </div>

                    <button onClick={() => setIsMuted(!isMuted)} className="hover:text-white transition-colors">
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Lesson Action Bar */}
          <div className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <Button
                variant={isCurrentCompleted ? 'secondary' : 'primary'}
                size="sm"
                onClick={() => handleToggleComplete(activeLesson)}
                className="font-bold flex items-center space-x-2"
              >
                {isCurrentCompleted ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-current" />
                    <span>Completed</span>
                  </>
                ) : (
                  <>
                    <Circle className="w-4 h-4" />
                    <span>Mark as Complete</span>
                  </>
                )}
              </Button>

              <label className="hidden sm:flex items-center space-x-2 text-xs text-slate-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={autoplayNext}
                  onChange={(e) => setAutoplayNext(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-primary-600 focus:ring-primary-500"
                />
                <span>Autoplay Next</span>
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                disabled={!prevLesson}
                onClick={() => prevLesson && setActiveLesson(prevLesson)}
                className="text-xs"
              >
                <SkipBack className="w-3.5 h-3.5 mr-1" />
                <span>Previous</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                disabled={!nextLesson}
                onClick={() => nextLesson && setActiveLesson(nextLesson)}
                className="text-xs"
              >
                <span>Next</span>
                <SkipForward className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="border-b border-slate-800 px-6">
            <nav className="flex space-x-8 text-xs font-bold">
              {[
                { key: 'overview', label: 'Overview & Notes', icon: BookOpen },
                { key: 'resources', label: 'Resources & Code', icon: Download },
                { key: 'qa', label: `Q&A (${questions.length})`, icon: MessageSquare },
                { key: 'reviews', label: `Reviews (${reviews.length})`, icon: Star },
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`py-4 border-b-2 flex items-center space-x-2 transition-colors ${
                    activeTab === key
                      ? 'border-primary-500 text-primary-400'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content Area */}
          <div className="p-6 max-w-4xl space-y-8">
            {/* 1. OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Lesson summary */}
                <div className="space-y-3">
                  <h2 className="text-xl font-bold text-white">About this Lecture</h2>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {activeLesson?.description || course.description}
                  </p>
                </div>

                {/* Personal Notes Scratchpad */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-primary-400" />
                      <h4 className="text-sm font-bold text-white">Your Personal Notes</h4>
                    </div>
                    {noteSaved && (
                      <span className="text-xs text-emerald-400 flex items-center space-x-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>Saved!</span>
                      </span>
                    )}
                  </div>
                  <textarea
                    rows={4}
                    value={personalNote}
                    onChange={(e) => setPersonalNote(e.target.value)}
                    placeholder="Take notes during this lecture. Notes are saved automatically to your device for easy study review..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-primary-500 transition-colors"
                  />
                  <div className="flex justify-end">
                    <Button size="sm" onClick={handleSaveNote}>
                      Save Note
                    </Button>
                  </div>
                </div>

                {/* Instructor card */}
                {course.teachers && (
                  <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 flex items-start space-x-4">
                    <img
                      src={course.teachers.profiles?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                      alt={course.teachers.profiles?.display_name || 'Instructor'}
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-700 flex-shrink-0"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-bold text-white text-sm">
                          {course.teachers.profiles?.display_name || `${course.teachers.profiles?.first_name || ''} ${course.teachers.profiles?.last_name || ''}`}
                        </h4>
                        <span className="px-2 py-0.5 bg-primary-500/10 text-primary-400 border border-primary-500/20 text-[10px] font-bold rounded-full">
                          Course Instructor
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        {course.teachers.profiles?.bio || 'Senior Software Engineer & Lead Curriculum Director.'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 2. RESOURCES TAB */}
            {activeTab === 'resources' && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white">Downloadable Lesson Assets</h3>
                  <p className="text-xs text-slate-400">
                    All source code, configuration files, and presentation slide decks for this lecture.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between hover:border-primary-500/40 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-primary-500/10 text-primary-400 flex items-center justify-center">
                        <Download className="w-5 h-5" />
                      </div>
                      <div>
                        <h5 className="font-bold text-xs text-white">Starter Repository (.zip)</h5>
                        <p className="text-[10px] text-slate-400">14.2 MB • Clean initial template</p>
                      </div>
                    </div>
                    <a
                      href="#download"
                      onClick={(e) => { e.preventDefault(); toast.success('Beginning project download...'); }}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-semibold rounded-lg transition-colors"
                    >
                      Download
                    </a>
                  </div>

                  <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between hover:border-primary-500/40 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h5 className="font-bold text-xs text-white">Lecture Slides (.pdf)</h5>
                        <p className="text-[10px] text-slate-400">3.8 MB • Complete diagrams & cheatsheets</p>
                      </div>
                    </div>
                    <a
                      href="#download"
                      onClick={(e) => { e.preventDefault(); toast.success('Downloading slides PDF...'); }}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-semibold rounded-lg transition-colors"
                    >
                      Download
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* 3. Q&A TAB */}
            {activeTab === 'qa' && (
              <div className="space-y-6">
                {/* Ask Question Box */}
                <form onSubmit={handleAddQuestion} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <h3 className="text-sm font-bold text-white">Ask a Question in this Course</h3>
                  <input
                    type="text"
                    required
                    value={newQuestionTitle}
                    onChange={(e) => setNewQuestionTitle(e.target.value)}
                    placeholder="e.g. Issue installing PostgreSQL on Windows 11..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-primary-500"
                  />
                  <textarea
                    rows={3}
                    value={newQuestionBody}
                    onChange={(e) => setNewQuestionBody(e.target.value)}
                    placeholder="Provide details or code snippets explaining what you've tried..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-primary-500"
                  />
                  <div className="flex justify-end">
                    <Button type="submit" size="sm">
                      Post Question
                    </Button>
                  </div>
                </form>

                {/* Questions List */}
                <div className="space-y-4">
                  {questions.map((q) => (
                    <div key={q.id} className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <img src={q.avatar} alt={q.author} className="w-8 h-8 rounded-full object-cover" />
                          <div>
                            <p className="text-xs font-bold text-white">{q.author}</p>
                            <p className="text-[10px] text-slate-400">{q.time}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => toast.info('Question upvoted!')}
                          className="flex items-center space-x-1 text-xs text-slate-400 hover:text-primary-400 px-2.5 py-1 bg-slate-800/80 rounded-lg"
                        >
                          <ThumbsUp className="w-3 h-3" />
                          <span>{q.upvotes}</span>
                        </button>
                      </div>

                      <div className="space-y-1">
                        <h4 className="font-bold text-sm text-white">{q.title}</h4>
                        <p className="text-xs text-slate-300 leading-relaxed">{q.content}</p>
                      </div>

                      {/* Answers */}
                      {q.answers.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-3 pl-4 border-l-2 border-primary-500/50">
                          {q.answers.map((ans, aIdx) => (
                            <div key={aIdx} className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <img src={ans.avatar} alt={ans.author} className="w-6 h-6 rounded-full object-cover" />
                                <span className="text-xs font-bold text-primary-400">{ans.author}</span>
                                <span className="text-[10px] text-slate-500">{ans.time}</span>
                              </div>
                              <p className="text-xs text-slate-300 pl-8">{ans.content}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. REVIEWS TAB */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {/* Leave Review Box */}
                <form onSubmit={handleSubmitReview} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <h3 className="text-sm font-bold text-white">Review this Course</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-slate-400">Your Rating:</span>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setUserRating(star)}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star className={`w-5 h-5 ${star <= userRating ? 'text-amber-400 fill-current' : 'text-slate-700'}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea
                    rows={3}
                    required
                    value={userReviewText}
                    onChange={(e) => setUserReviewText(e.target.value)}
                    placeholder="Tell other students what you liked most about the curriculum, projects, and instruction..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-primary-500"
                  />
                  <div className="flex justify-end">
                    <Button type="submit" size="sm" loading={submittingReview}>
                      Submit Feedback
                    </Button>
                  </div>
                </form>

                {/* Reviews List */}
                <div className="space-y-4">
                  {reviews.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-6">No reviews recorded yet. Be the first to leave one!</p>
                  ) : (
                    reviews.map((rev) => (
                      <div key={rev.id} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <img
                              src={rev.profiles?.avatar_url || 'https://ui-avatars.com/api/?name=Student'}
                              alt="Reviewer"
                              className="w-7 h-7 rounded-full object-cover"
                            />
                            <span className="text-xs font-bold text-white">{rev.profiles?.display_name || 'Verified Student'}</span>
                          </div>
                          <div className="flex text-amber-400">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-3.5 h-3.5 ${i < (rev.rating || 5) ? 'fill-current' : 'text-slate-700'}`} />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">{rev.comment}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </main>

        {/* 3. SYLLABUS SIDEBAR (FIXED RIGHT DESKTOP DRAWER) */}
        {sidebarOpen && (
          <aside className="w-full lg:w-96 bg-slate-900 border-l border-slate-800 flex flex-col fixed lg:absolute right-0 top-16 bottom-0 z-20 shadow-2xl overflow-hidden">
            {/* Syllabus Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-white">Course Content</h3>
                <p className="text-[11px] text-slate-400">
                  {completedCount} / {totalLessonsCount} lectures completed ({overallPercentage}%)
                </p>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors lg:hidden"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sections Accordion */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-800">
              {(course.course_sections || []).map((section, sIdx) => {
                const isExpanded = expandedSections.has(section.id || `sec-${sIdx}`);
                const sectionLessons = section.course_lessons || [];
                const secCompleted = sectionLessons.filter(l => completedLessons.has(String(l.id))).length;

                return (
                  <div key={section.id || sIdx} className="bg-slate-900">
                    {/* Section Accordion Trigger */}
                    <button
                      onClick={() => toggleSection(section.id || `sec-${sIdx}`)}
                      className="w-full px-4 py-3.5 text-left flex items-center justify-between hover:bg-slate-800/60 transition-colors"
                    >
                      <div className="space-y-0.5 pr-2">
                        <p className="text-xs font-bold text-white line-clamp-1">
                          Section {sIdx + 1}: {section.title}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {secCompleted}/{sectionLessons.length} • {sectionLessons.length * 15} mins
                        </p>
                      </div>
                      <div className="text-slate-400 flex-shrink-0">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </button>

                    {/* Lessons list */}
                    {isExpanded && (
                      <div className="bg-slate-950/60 divide-y divide-slate-900">
                        {sectionLessons.map((lesson) => {
                          const isCompleted = completedLessons.has(String(lesson.id));
                          const isActive = activeLesson?.id === lesson.id;

                          return (
                            <div
                              key={lesson.id}
                              onClick={() => setActiveLesson(lesson)}
                              className={`px-4 py-3 flex items-start space-x-3 cursor-pointer transition-colors ${
                                isActive
                                  ? 'bg-primary-950/40 border-l-4 border-primary-500 text-white'
                                  : 'hover:bg-slate-900/80 text-slate-300'
                              }`}
                            >
                              {/* Completion checkbox button */}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleComplete(lesson);
                                }}
                                className="mt-0.5 text-slate-400 hover:text-emerald-400 transition-colors flex-shrink-0"
                              >
                                {isCompleted ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-current" />
                                ) : (
                                  <Circle className="w-4 h-4 text-slate-600 hover:text-slate-400" />
                                )}
                              </button>

                              <div className="min-w-0 flex-1 space-y-1">
                                <p className={`text-xs font-medium line-clamp-2 ${isActive ? 'font-bold text-primary-300' : ''}`}>
                                  {lesson.title}
                                </p>
                                <div className="flex items-center space-x-2 text-[10px] text-slate-500">
                                  <Clock className="w-3 h-3" />
                                  <span>{lesson.duration_minutes || 15} min</span>
                                  {lesson.is_preview && (
                                    <span className="px-1.5 py-0.2 bg-slate-800 text-primary-400 rounded text-[9px]">
                                      Free Preview
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};
