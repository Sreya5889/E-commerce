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
  Menu, X, Check, Share2, HelpCircle, ExternalLink, ThumbsUp,
  Bookmark, Trash2, HelpCircle as QuizIcon, CheckCircle
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
  const [bookmarks, setBookmarks] = useState(new Set());
  const [filterBookmarked, setFilterBookmarked] = useState(false);
  const [expandedSections, setExpandedSections] = useState(new Set());
  const [activeTab, setActiveTab] = useState('overview'); // overview, notes, quiz, resources, qa, reviews
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Video player state
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [currentVideoSeconds, setCurrentVideoSeconds] = useState(0);
  const [lastSavedSeconds, setLastSavedSeconds] = useState(0);
  const [autoplayNext, setAutoplayNext] = useState(true);

  // Notes state
  const [studentNotes, setStudentNotes] = useState([]);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [noteIncludeTimestamp, setNoteIncludeTimestamp] = useState(true);
  const [savingNote, setSavingNote] = useState(false);

  // Quizzes state
  const [quizData, setQuizData] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(null);
  const [submittingQuiz, setSubmittingQuiz] = useState(false);

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

  // 1. Fetch course details & auto-resume position
  useEffect(() => {
    const loadCourse = async () => {
      setLoading(true);
      try {
        const [courseData, resumeData, bookmarksData] = await Promise.all([
          courseService.getCourseById(courseId),
          progressService.getResumePosition(courseId).catch(() => null),
          progressService.getBookmarks(courseId).catch(() => [])
        ]);

        if (courseData) {
          setCourse(courseData);

          if (bookmarksData && Array.isArray(bookmarksData)) {
            setBookmarks(new Set(bookmarksData.map(b => String(b.lesson_id))));
          }

          // Find target lesson
          const sections = courseData.course_sections || [];
          let targetLesson = null;
          const initialExpanded = new Set();

          sections.forEach((sec, sIdx) => {
            initialExpanded.add(sec.id || `sec-${sIdx}`);
            (sec.course_lessons || []).forEach(l => {
              if (paramLessonId && (l.id === paramLessonId || String(l.id) === String(paramLessonId))) {
                targetLesson = l;
              } else if (!paramLessonId && resumeData?.lesson_id && (String(l.id) === String(resumeData.lesson_id))) {
                targetLesson = l;
              }
            });
          });

          if (!targetLesson && sections.length > 0 && sections[0].course_lessons?.length > 0) {
            targetLesson = sections[0].course_lessons[0];
          }

          setActiveLesson(targetLesson);
          setExpandedSections(initialExpanded);

          // Resume playback seconds if available
          if (resumeData?.position_seconds && resumeData.position_seconds > 0) {
            setCurrentVideoSeconds(resumeData.position_seconds);
            if (videoRef.current) {
              videoRef.current.currentTime = resumeData.position_seconds;
            }
          }
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

  // 2. Fetch user progress, reviews, notes
  useEffect(() => {
    if (!course?.id) return;

    const loadProgressAndReviews = async () => {
      try {
        const [progressData, reviewsData, notesData] = await Promise.all([
          user?.id ? progressService.getLessonProgress(user.id, course.id).catch(() => []) : [],
          reviewService.getCourseReviews(course.id).catch(() => []),
          progressService.getNotes(course.id).catch(() => [])
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

        if (notesData && Array.isArray(notesData)) {
          setStudentNotes(notesData);
        }
      } catch (err) {
        console.warn('Non-fatal error loading user progress/reviews:', err);
      }
    };

    loadProgressAndReviews();
  }, [user?.id, course?.id]);

  // 3. Load Quiz when active lesson changes
  useEffect(() => {
    if (activeLesson?.id) {
      const loadQuiz = async () => {
        try {
          const quiz = await progressService.getQuiz(activeLesson.id);
          setQuizData(quiz);
          setQuizAnswers({});
          setQuizSubmitted(false);
          setQuizScore(null);
        } catch {
          setQuizData(null);
        }
      };
      loadQuiz();
      setIsPlaying(false);
    }
  }, [activeLesson?.id]);

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
  const isCurrentCompleted = activeLesson ? completedLessons.has(String(activeLesson.id)) : false;
  const isCurrentBookmarked = activeLesson ? bookmarks.has(String(activeLesson.id)) : false;

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
          currentVideoSeconds
        );
      }
      if (isNowCompleted) {
        toast.success(`Lesson completed! 🎉 (${updated.size}/${totalLessonsCount})`);
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

  // Toggle Bookmark
  const handleToggleBookmark = async (lesson = activeLesson) => {
    if (!lesson?.id || !courseId) return;
    const lessonIdStr = String(lesson.id);
    const updated = new Set(bookmarks);
    const wasBookmarked = updated.has(lessonIdStr);

    if (wasBookmarked) {
      updated.delete(lessonIdStr);
    } else {
      updated.add(lessonIdStr);
    }
    setBookmarks(updated);

    try {
      await progressService.toggleBookmark(courseId, lesson.id);
      if (!wasBookmarked) {
        toast.success('Lesson bookmarked for easy revision! 🔖');
      } else {
        toast.info('Bookmark removed.');
      }
    } catch (err) {
      console.warn('Failed to persist bookmark to server:', err);
    }
  };

  // Format seconds into MM:SS
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Video Time Update & Periodic Position Save
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const cur = videoRef.current.currentTime;
    const dur = videoRef.current.duration;
    setCurrentVideoSeconds(cur);
    if (dur > 0) setProgressPercent((cur / dur) * 100);

    // Debounced position save every 10 seconds
    if (Math.abs(cur - lastSavedSeconds) > 10 && activeLesson?.id && courseId) {
      setLastSavedSeconds(cur);
      progressService.saveResumePosition(courseId, activeLesson.id, Math.floor(cur));
    }
  };

  // Save Note with Timestamp
  const handleSaveNote = async (e) => {
    e.preventDefault();
    if (!newNoteContent.trim() || !activeLesson?.id || !courseId) return;

    setSavingNote(true);
    const ts = noteIncludeTimestamp ? Math.floor(currentVideoSeconds) : 0;
    try {
      const created = await progressService.createNote(courseId, activeLesson.id, newNoteContent.trim(), ts);
      setStudentNotes(prev => [created, ...prev]);
      setNewNoteContent('');
      toast.success('Note saved with timestamp!');
    } catch (err) {
      toast.error('Failed to save note.');
    } finally {
      setSavingNote(false);
    }
  };

  // Delete Note
  const handleDeleteNote = async (noteId) => {
    try {
      await progressService.deleteNote(noteId);
      setStudentNotes(prev => prev.filter(n => n.id !== noteId));
      toast.info('Note deleted.');
    } catch {
      toast.error('Could not delete note.');
    }
  };

  // Seek video to specific timestamp
  const handleSeekTo = (seconds) => {
    if (videoRef.current) {
      videoRef.current.currentTime = seconds;
      videoRef.current.play();
      setIsPlaying(true);
    }
    toast.info(`Jumped video to ${formatTime(seconds)}`);
  };

  // Submit Quiz Attempt
  const handleSubmitQuiz = async () => {
    if (!quizData) return;
    setSubmittingQuiz(true);
    try {
      const answersArray = (quizData.questions || []).map((_, idx) => quizAnswers[idx] ?? -1);
      const res = await progressService.submitQuizAttempt(quizData.id, answersArray);
      setQuizScore(res.score ?? 100);
      setQuizSubmitted(true);
      if (res.passed) {
        toast.success(`Quiz passed with ${res.score}%! 🎉`);
      } else {
        toast.error(`Score: ${res.score}%. Review explanations and try again.`);
      }
    } catch (err) {
      toast.error('Failed to submit quiz attempt.');
    } finally {
      setSubmittingQuiz(false);
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
      toast.error('Unable to post review at this moment.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white space-y-4">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-slate-400 font-medium">Entering classroom & restoring your progress...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-white space-y-4">
        <h2 className="text-xl font-bold text-rose-400">Course Classroom Unavailable</h2>
        <p className="text-sm text-slate-400 max-w-md">
          We could not load the requested syllabus. Please verify your enrollment or return to the course catalog.
        </p>
        <Link to="/courses">
          <Button variant="primary">Browse Courses</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col select-none">
      {/* 1. TOP NAVBAR */}
      <header className="h-16 bg-slate-900 border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between z-30 sticky top-0">
        <div className="flex items-center space-x-3 sm:space-x-4 min-w-0">
          <Link
            to="/dashboard"
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors flex items-center space-x-1 text-xs"
            title="Return to Student Dashboard"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden sm:inline font-semibold">Dashboard</span>
          </Link>

          <div className="h-5 w-[1px] bg-slate-800 hidden sm:block"></div>

          <div className="min-w-0">
            <h1 className="font-bold text-sm sm:text-base text-white truncate max-w-xs sm:max-w-md md:max-w-xl">
              {course.title}
            </h1>
            <div className="flex items-center space-x-2 text-[11px] text-slate-400 truncate">
              <span>{activeLesson?.title || 'Course Lecture'}</span>
              <span>•</span>
              <span className="text-primary-400 font-medium">
                {currentLessonIndex >= 0 ? `Lecture ${currentLessonIndex + 1} of ${totalLessonsCount}` : 'Introduction'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Header Status Bar */}
        <div className="flex items-center space-x-4 flex-shrink-0">
          <div className="hidden md:flex items-center space-x-3 text-xs">
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
                onTimeUpdate={handleTimeUpdate}
                onEnded={() => handleToggleComplete(activeLesson)}
              />
            ) : (
              /* Simulated High-Fidelity Video Player */
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

              {/* Bookmark Toggle Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleToggleBookmark(activeLesson)}
                className={`text-xs flex items-center space-x-1.5 ${
                  isCurrentBookmarked ? 'border-amber-500/50 text-amber-400 bg-amber-500/10' : 'text-slate-400'
                }`}
                title="Bookmark lesson for quick review"
              >
                <Bookmark className={`w-3.5 h-3.5 ${isCurrentBookmarked ? 'fill-current text-amber-400' : ''}`} />
                <span>{isCurrentBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
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
            <nav className="flex space-x-8 text-xs font-bold overflow-x-auto">
              {[
                { key: 'overview', label: 'Overview', icon: BookOpen },
                { key: 'notes', label: `Personal Notes (${studentNotes.length})`, icon: FileText },
                { key: 'quiz', label: 'Lesson Quiz', icon: HelpCircle },
                { key: 'resources', label: 'Resources & Code', icon: Download },
                { key: 'qa', label: `Q&A (${questions.length})`, icon: MessageSquare },
                { key: 'reviews', label: `Reviews (${reviews.length})`, icon: Star },
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`py-4 border-b-2 flex items-center space-x-2 transition-colors whitespace-nowrap ${
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
                <div className="space-y-3">
                  <h2 className="text-xl font-bold text-white">About this Lecture</h2>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {activeLesson?.description || course.description}
                  </p>
                </div>

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

            {/* 2. PERSONAL NOTES TAB (FEATURE 2) */}
            {activeTab === 'notes' && (
              <div className="space-y-6">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-primary-400" />
                      <span>Take a Personal Note</span>
                    </h3>
                    <span className="text-[11px] font-mono text-primary-400 bg-primary-950/60 px-2.5 py-1 rounded-md border border-primary-500/30">
                      Timestamp: {formatTime(currentVideoSeconds)}
                    </span>
                  </div>

                  <textarea
                    rows={3}
                    value={newNoteContent}
                    onChange={(e) => setNewNoteContent(e.target.value)}
                    placeholder="Type personal study observations, key architectural formulas, or syntax reminders..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-primary-500"
                  />

                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center space-x-2 text-xs text-slate-400 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={noteIncludeTimestamp}
                        onChange={(e) => setNoteIncludeTimestamp(e.target.checked)}
                        className="rounded bg-slate-800 border-slate-700 text-primary-600 focus:ring-primary-500"
                      />
                      <span>Tag current video timestamp ({formatTime(currentVideoSeconds)})</span>
                    </label>

                    <Button size="sm" onClick={handleSaveNote} disabled={savingNote || !newNoteContent.trim()}>
                      {savingNote ? 'Saving...' : 'Add Note'}
                    </Button>
                  </div>
                </div>

                {/* Notes List */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Saved Notes for this Course ({studentNotes.length})
                  </h4>

                  {studentNotes.length === 0 ? (
                    <div className="p-8 text-center bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl space-y-2">
                      <FileText className="w-8 h-8 text-slate-600 mx-auto" />
                      <p className="text-xs text-slate-400 font-medium">No notes recorded yet for this course.</p>
                      <p className="text-[11px] text-slate-500">Capture important ideas above with clickable timestamps.</p>
                    </div>
                  ) : (
                    studentNotes.map((note) => (
                      <div
                        key={note.id}
                        className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2 hover:border-slate-700 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <button
                            onClick={() => handleSeekTo(note.timestamp_seconds || 0)}
                            className="px-2.5 py-1 bg-primary-500/15 text-primary-400 hover:bg-primary-500/25 border border-primary-500/30 rounded-lg text-xs font-mono font-bold flex items-center space-x-1 transition-colors"
                            title="Jump video to this timestamp"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            <span>{formatTime(note.timestamp_seconds || 0)}</span>
                          </button>

                          <button
                            onClick={() => handleDeleteNote(note.id)}
                            className="text-slate-500 hover:text-rose-400 p-1 rounded transition-colors"
                            title="Delete note"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
                          {note.content}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* 3. LESSON QUIZ TAB (FEATURE 2) */}
            {activeTab === 'quiz' && (
              <div className="space-y-6">
                {!quizData ? (
                  <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
                    <CheckCircle className="w-8 h-8 text-primary-400 mx-auto" />
                    <h4 className="text-sm font-bold text-white">No Quiz Required for this Lesson</h4>
                    <p className="text-xs text-slate-400">
                      Proceed to the next lecture or practice related challenges in CodeLab.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-bold rounded-full uppercase">
                          Assessment Check
                        </span>
                        <span className="text-xs text-slate-400">Passing threshold: {quizData.passing_score || 70}%</span>
                      </div>
                      <h3 className="text-base font-bold text-white">{quizData.title}</h3>
                      <p className="text-xs text-slate-400">
                        Answer all questions to confirm mastery of the concepts introduced in this lecture.
                      </p>
                    </div>

                    {/* Quiz Questions */}
                    <div className="space-y-4">
                      {(quizData.questions || []).map((q, qIdx) => (
                        <div key={q.id || qIdx} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                          <p className="text-xs font-bold text-white">
                            {qIdx + 1}. {q.question}
                          </p>

                          <div className="space-y-2">
                            {(q.options || []).map((opt, optIdx) => {
                              const isSelected = quizAnswers[qIdx] === optIdx;
                              const isCorrectOption = optIdx === q.correct_index;

                              let optionStyle = 'border-slate-800 hover:border-slate-700 bg-slate-950 text-slate-300';
                              if (isSelected && !quizSubmitted) {
                                optionStyle = 'border-primary-500 bg-primary-950/40 text-primary-200';
                              } else if (quizSubmitted) {
                                if (isCorrectOption) {
                                  optionStyle = 'border-emerald-500 bg-emerald-950/40 text-emerald-200';
                                } else if (isSelected && !isCorrectOption) {
                                  optionStyle = 'border-rose-500 bg-rose-950/40 text-rose-200';
                                }
                              }

                              return (
                                <button
                                  key={optIdx}
                                  type="button"
                                  disabled={quizSubmitted}
                                  onClick={() => setQuizAnswers(prev => ({ ...prev, [qIdx]: optIdx }))}
                                  className={`w-full text-left p-3 rounded-xl border text-xs flex items-center space-x-3 transition-colors ${optionStyle}`}
                                >
                                  <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                                    {String.fromCharCode(65 + optIdx)}
                                  </span>
                                  <span className="flex-1">{opt}</span>
                                </button>
                              );
                            })}
                          </div>

                          {/* Explanation after submit */}
                          {quizSubmitted && q.explanation && (
                            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs space-y-1">
                              <span className="font-bold text-primary-400">Explanation:</span>
                              <p className="text-slate-400">{q.explanation}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Quiz Action Bar */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
                      {quizSubmitted ? (
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            quizScore >= (quizData.passing_score || 70)
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          }`}>
                            Score: {quizScore}% {quizScore >= (quizData.passing_score || 70) ? '• PASSED 🎉' : '• RETRY'}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setQuizSubmitted(false);
                              setQuizAnswers({});
                              setQuizScore(null);
                            }}
                          >
                            Retake Quiz
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">
                          {Object.keys(quizAnswers).length} of {(quizData.questions || []).length} answered
                        </span>
                      )}

                      {!quizSubmitted && (
                        <Button
                          size="sm"
                          onClick={handleSubmitQuiz}
                          disabled={submittingQuiz || Object.keys(quizAnswers).length < (quizData.questions || []).length}
                        >
                          {submittingQuiz ? 'Evaluating...' : 'Submit Answers'}
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 4. RESOURCES TAB */}
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

            {/* 5. Q&A TAB */}
            {activeTab === 'qa' && (
              <div className="space-y-6">
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

                      {q.answers.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-3 pl-4 border-l-2 border-primary-500/50">
                          {q.answers.map((ans, aIdx) => (
                            <div key={aIdx} className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <span className="font-bold text-xs text-primary-400">{ans.author}</span>
                                <span className="text-[10px] text-slate-500">{ans.time}</span>
                              </div>
                              <p className="text-xs text-slate-300">{ans.content}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. REVIEWS TAB */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <form onSubmit={handleSubmitReview} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <h3 className="text-sm font-bold text-white">Leave Course Feedback</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-slate-400">Rating:</span>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setUserRating(star)}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star className={`w-4 h-4 ${star <= userRating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea
                    rows={3}
                    value={userReviewText}
                    onChange={(e) => setUserReviewText(e.target.value)}
                    placeholder="How did this course impact your technical skill set?"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-primary-500"
                  />
                  <div className="flex justify-end">
                    <Button type="submit" size="sm" disabled={submittingReview}>
                      {submittingReview ? 'Submitting...' : 'Submit Review'}
                    </Button>
                  </div>
                </form>

                <div className="space-y-3">
                  {reviews.map((rev, idx) => (
                    <div key={rev.id || idx} className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-white">
                          {rev.profiles?.display_name || 'Verified Student'}
                        </span>
                        <div className="flex items-center text-amber-400">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span className="ml-1 text-xs font-bold">{rev.rating || 5}.0</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-300">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>

        {/* 3. SYLLABUS SIDEBAR (WITH BOOKMARK FILTER) */}
        {sidebarOpen && (
          <aside className="w-full lg:w-96 bg-slate-900 border-l border-slate-800 flex flex-col fixed lg:absolute right-0 top-16 bottom-0 z-20 shadow-2xl overflow-hidden">
            {/* Syllabus Header */}
            <div className="p-4 border-b border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-white">Course Content</h3>
                  <p className="text-[11px] text-slate-400">
                    {completedCount} / {totalLessonsCount} completed ({overallPercentage}%)
                  </p>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors lg:hidden"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Playlist Filter: All vs Bookmarked */}
              <div className="flex items-center space-x-2 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px]">
                <button
                  onClick={() => setFilterBookmarked(false)}
                  className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
                    !filterBookmarked ? 'bg-primary-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All ({totalLessonsCount})
                </button>
                <button
                  onClick={() => setFilterBookmarked(true)}
                  className={`flex-1 py-1.5 rounded-lg font-bold flex items-center justify-center space-x-1 transition-all ${
                    filterBookmarked ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Bookmark className="w-3 h-3 fill-current" />
                  <span>Bookmarks ({bookmarks.size})</span>
                </button>
              </div>
            </div>

            {/* Sections Accordion */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-800">
              {(course.course_sections || []).map((section, sIdx) => {
                const isExpanded = expandedSections.has(section.id || `sec-${sIdx}`);
                let sectionLessons = section.course_lessons || [];
                if (filterBookmarked) {
                  sectionLessons = sectionLessons.filter(l => bookmarks.has(String(l.id)));
                }

                if (filterBookmarked && sectionLessons.length === 0) {
                  return null;
                }

                const secCompleted = sectionLessons.filter(l => completedLessons.has(String(l.id))).length;

                return (
                  <div key={section.id || sIdx} className="bg-slate-900">
                    <button
                      onClick={() => toggleSection(section.id || `sec-${sIdx}`)}
                      className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-slate-800/60 transition-colors"
                    >
                      <div className="space-y-0.5 pr-2">
                        <p className="text-xs font-bold text-white line-clamp-1">
                          Section {sIdx + 1}: {section.title}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {secCompleted}/{sectionLessons.length} lectures
                        </p>
                      </div>
                      <div className="text-slate-400 flex-shrink-0">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="bg-slate-950/60 divide-y divide-slate-900">
                        {sectionLessons.map((lesson) => {
                          const isCompleted = completedLessons.has(String(lesson.id));
                          const isActive = activeLesson?.id === lesson.id;
                          const isBookmarked = bookmarks.has(String(lesson.id));

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
                                  {isBookmarked && (
                                    <span className="text-amber-400 flex items-center space-x-0.5">
                                      <Bookmark className="w-2.5 h-2.5 fill-current" />
                                      <span>Saved</span>
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
