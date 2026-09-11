import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { learningPathService } from '../../services/learningPath.service';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  Route,
  Star,
  Clock,
  BookOpen,
  CheckCircle2,
  Circle,
  Briefcase,
  Trophy,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  Award,
  Layers,
  Code,
  Share2,
  Check,
  Lock,
  Play
} from 'lucide-react';
import { PageTransition } from '../../components/layout/PageTransition';
import { Button } from '../../components/ui/Button';

export const LearningPathDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const toast = useToast();

  const [path, setPath] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);
  const [enrollment, setEnrollment] = useState(null);
  const [enrolling, setEnrolling] = useState(false);
  const [updatingCourse, setUpdatingCourse] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchPath = async () => {
      setLoading(true);
      try {
        const data = await learningPathService.getLearningPathBySlug(slug);
        if (mounted && data) {
          setPath(data);
          if (data.is_enrolled || data.enrollment) {
            setEnrolled(true);
            setEnrollment(data.enrollment);
          }
        }
      } catch (err) {
        console.error('Failed to load learning path detail:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchPath();
    return () => { mounted = false; };
  }, [slug, isAuthenticated]);

  // Handle Enrollment
  const handleEnroll = async () => {
    if (!isAuthenticated) {
      toast.info('Please log in or create an account to start this learning path.');
      navigate(`/login?redirect=${encodeURIComponent(`/learning-paths/${slug}`)}`);
      return;
    }

    if (enrolled) {
      // Find the first uncompleted course
      const completedSet = new Set(enrollment?.completed_courses || []);
      for (const stage of path.stages || []) {
        for (const course of stage.courses || []) {
          if (!completedSet.has(course.course_id)) {
            navigate(`/course/${course.slug || course.course_id}`);
            return;
          }
        }
      }
      // If all completed, open first course
      const firstCourse = path.stages?.[0]?.courses?.[0];
      if (firstCourse) {
        navigate(`/course/${firstCourse.slug || firstCourse.course_id}`);
      }
      return;
    }

    setEnrolling(true);
    try {
      const result = await learningPathService.enrollInLearningPath(path.id);
      setEnrolled(true);
      setEnrollment(result);
      toast.success(`You have enrolled in ${path.title}!`);
    } catch (err) {
      toast.error('Could not enroll in learning path. Please try again.');
    } finally {
      setEnrolling(false);
    }
  };

  // Toggle Course Completion
  const handleToggleCourse = async (courseId) => {
    if (!enrolled) {
      await handleEnroll();
      return;
    }

    setUpdatingCourse(courseId);
    try {
      const currentCompleted = Array.isArray(enrollment?.completed_courses)
        ? [...enrollment.completed_courses]
        : [];

      let updatedList;
      if (currentCompleted.includes(courseId)) {
        updatedList = currentCompleted.filter(id => id !== courseId);
      } else {
        updatedList = [...currentCompleted, courseId];
      }

      const updated = await learningPathService.updateStudentProgress(path.id, {
        completed_courses: updatedList,
        last_accessed_course_id: courseId
      });

      if (updated) {
        setEnrollment(updated);
        if (updatedList.includes(courseId)) {
          toast.success('Course marked as completed!');
        } else {
          toast.info('Course marked as in-progress');
        }
      }
    } catch (err) {
      toast.error('Failed to update course progress.');
    } finally {
      setUpdatingCourse(null);
    }
  };

  const completedCoursesSet = new Set(enrollment?.completed_courses || []);
  const progressPct = enrollment?.progress_pct || 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Loading career roadmap...</p>
        </div>
      </div>
    );
  }

  if (!path) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 space-y-4">
        <Route className="w-16 h-16 text-slate-400" />
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Learning Path Not Found</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md">
          The requested career learning path could not be found or may have been retired.
        </p>
        <Link to="/learning-paths">
          <Button>Back to All Learning Paths</Button>
        </Link>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 pb-20">
        {/* 1. Header & Hero */}
        <div className="bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white py-12 lg:py-16 border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 mb-6">
              <Link to="/learning-paths" className="hover:text-white flex items-center space-x-1 transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>All Learning Paths</span>
              </Link>
              <span>/</span>
              <span className="text-primary-400">{path.category}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {/* Left 2 Cols: Info */}
              <div className="lg:col-span-2 space-y-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-primary-500/20 text-primary-300 text-xs font-bold border border-primary-500/30 uppercase tracking-wider">
                    {path.category}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/10 text-slate-200 text-xs font-semibold capitalize">
                    {path.difficulty?.replace('_', ' ') || 'All Levels'}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30 flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Industry Recognized</span>
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                  {path.title}
                </h1>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
                  {path.description}
                </p>

                {/* Rating & Stats row */}
                <div className="flex flex-wrap items-center gap-6 pt-2 text-xs sm:text-sm text-slate-300">
                  <div className="flex items-center space-x-1 font-bold">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="text-white text-sm">{Number(path.rating || 4.8).toFixed(1)}</span>
                    <span className="text-slate-400 font-normal">(Curated Specialist Path)</span>
                  </div>

                  <div className="flex items-center space-x-1">
                    <BookOpen className="w-4 h-4 text-primary-400" />
                    <span className="font-semibold text-white">{path.total_courses || 3} Courses</span>
                  </div>

                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4 text-indigo-400" />
                    <span className="font-semibold text-white">{path.duration_weeks || 12} Weeks</span>
                    <span className="text-slate-400">({path.estimated_hours || 60} hrs)</span>
                  </div>

                  <div className="text-slate-400">
                    <span className="font-semibold text-white">{(path.enrolled_count || 1200).toLocaleString()}</span> students enrolled
                  </div>
                </div>

                {/* Active Enrollment Bar (in hero for quick glance) */}
                {enrolled && (
                  <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2 max-w-xl">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-primary-300 flex items-center space-x-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Enrolled In This Path</span>
                      </span>
                      <span className="text-white">{progressPct}% Completed</span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-400 to-primary-400 rounded-full transition-all duration-500"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {completedCoursesSet.size} of {path.total_courses || 3} courses marked complete
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Hero Banner Preview */}
              <div className="hidden lg:block">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-700/80 group">
                  <img
                    src={path.banner_url || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800'}
                    alt={path.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-center">
                    <Button
                      size="lg"
                      onClick={handleEnroll}
                      disabled={enrolling}
                      className="w-full shadow-xl"
                    >
                      {enrolling ? 'Enrolling...' : enrolled ? 'Continue Learning' : 'Start Learning Path'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Main Body Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Columns: Stages Roadmap, Capstone, Skills, Outcomes */}
            <div className="lg:col-span-2 space-y-10">
              {/* Visual Roadmap Section */}
              <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
                      <Route className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                      <span>Career Path Roadmap</span>
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Ordered course sequence designed to build foundational understanding before advanced mastery.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-slate-400">
                    {path.stages?.length || 0} Stages
                  </span>
                </div>

                {/* Stages Timeline */}
                <div className="space-y-8 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                  {path.stages?.map((stage, sIdx) => {
                    const stageCourses = stage.courses || [];
                    const allStageCompleted = stageCourses.length > 0 && stageCourses.every(c => completedCoursesSet.has(c.course_id));

                    return (
                      <div key={sIdx} className="relative pl-12 space-y-4">
                        {/* Stage Number Node */}
                        <div
                          className={`absolute left-0 top-0 w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm transition-all duration-300 ${
                            allStageCompleted
                              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                              : 'bg-primary-600 text-white shadow-lg shadow-primary-500/30'
                          }`}
                        >
                          {allStageCompleted ? <Check className="w-5 h-5" /> : stage.stage_number || sIdx + 1}
                        </div>

                        {/* Stage Header */}
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="text-[11px] font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider">
                              Stage {stage.stage_number || sIdx + 1}
                            </span>
                            {stage.is_milestone && (
                              <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] font-bold flex items-center space-x-1">
                                <Sparkles className="w-3 h-3" />
                                <span>Milestone</span>
                              </span>
                            )}
                          </div>
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                            {stage.stage_title}
                          </h3>
                          {stage.stage_description && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                              {stage.stage_description}
                            </p>
                          )}
                        </div>

                        {/* Courses inside this stage */}
                        <div className="space-y-3">
                          {stageCourses.map((course, cIdx) => {
                            const isDone = completedCoursesSet.has(course.course_id);

                            return (
                              <div
                                key={course.course_id || cIdx}
                                className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                                  isDone
                                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40'
                                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-800 hover:border-primary-500/40'
                                }`}
                              >
                                <div className="flex items-center space-x-3.5 flex-1 min-w-0">
                                  {/* Course Thumbnail */}
                                  <Link
                                    to={`/course/${course.slug || course.course_id}`}
                                    className="w-16 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-slate-200 dark:bg-slate-700 relative group"
                                  >
                                    <img
                                      src={course.thumbnail_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300'}
                                      alt={course.title}
                                      className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                                    />
                                  </Link>

                                  {/* Course Title & Meta */}
                                  <div className="min-w-0 flex-1">
                                    <Link
                                      to={`/course/${course.slug || course.course_id}`}
                                      className="text-sm font-bold text-slate-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors line-clamp-1"
                                    >
                                      {course.title}
                                    </Link>
                                    <div className="flex items-center space-x-3 text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                                      <span className="capitalize">{course.level?.replace('_', ' ') || 'All Levels'}</span>
                                      <span>•</span>
                                      <span>{course.duration_hours || 10} hours</span>
                                      {course.avg_rating && (
                                        <>
                                          <span>•</span>
                                          <span className="flex items-center space-x-0.5 text-amber-500 font-semibold">
                                            <Star className="w-3 h-3 fill-amber-400" />
                                            <span>{Number(course.avg_rating).toFixed(1)}</span>
                                          </span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Actions: Mark Complete & View Course */}
                                <div className="flex items-center space-x-2 self-end sm:self-center">
                                  {enrolled && (
                                    <button
                                      type="button"
                                      onClick={() => handleToggleCourse(course.course_id)}
                                      disabled={updatingCourse === course.course_id}
                                      title={isDone ? 'Mark as incomplete' : 'Mark as complete'}
                                      className={`p-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer ${
                                        isDone
                                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300'
                                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/40'
                                      }`}
                                    >
                                      {isDone ? (
                                        <>
                                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                          <span className="hidden sm:inline">Completed</span>
                                        </>
                                      ) : (
                                        <>
                                          <Circle className="w-4 h-4 text-slate-400" />
                                          <span className="hidden sm:inline">Mark Done</span>
                                        </>
                                      )}
                                    </button>
                                  )}

                                  <Link
                                    to={`/course/${course.slug || course.course_id}`}
                                    className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-primary-600 hover:border-primary-500 transition-colors flex items-center space-x-1"
                                  >
                                    <span>View</span>
                                    <ExternalLink className="w-3 h-3" />
                                  </Link>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Capstone Project Card */}
              {path.capstone_project && (
                <section className="bg-gradient-to-br from-indigo-900/10 via-primary-900/10 to-transparent rounded-3xl p-6 sm:p-8 border border-indigo-200/80 dark:border-indigo-900/50 space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/25">
                      <Trophy className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                        Final Deliverable
                      </span>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white">
                        {path.capstone_project.title || 'Career Portfolio Capstone Project'}
                      </h3>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {path.capstone_project.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                      <div className="text-xs font-bold text-slate-900 dark:text-white">GitHub Ready</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Production-grade codebase with CI/CD</div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                      <div className="text-xs font-bold text-slate-900 dark:text-white">Live Deployment</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Host and link directly on your resume</div>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                      <div className="text-xs font-bold text-slate-900 dark:text-white">Interview Prep</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Case study walkthrough for hiring managers</div>
                    </div>
                  </div>
                </section>
              )}

              {/* Skills & Tools Section */}
              <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                  <Code className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  <span>Skills, Tools & Technologies Covered</span>
                </h3>

                <div className="space-y-4">
                  {Array.isArray(path.tools_and_technologies) && path.tools_and_technologies.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                        Tech Stack & Tools
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {path.tools_and_technologies.map((tool, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold border border-slate-200/80 dark:border-slate-700"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {Array.isArray(path.key_skills) && path.key_skills.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                        Core Competencies
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {path.key_skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1.5 rounded-xl bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-300 text-xs font-semibold border border-primary-200/60 dark:border-primary-900/60"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* Prerequisites & Career Outcomes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Prerequisites */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-primary-600" />
                    <span>Prerequisites</span>
                  </h4>
                  <ul className="space-y-2.5">
                    {(path.prerequisites?.length ? path.prerequisites : ['Basic computer literacy', 'A computer with internet access', 'Eagerness to learn']).map((pre, idx) => (
                      <li key={idx} className="flex items-start space-x-2.5 text-xs text-slate-600 dark:text-slate-300">
                        <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span>{pre}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Career Outcomes */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                    <Briefcase className="w-4 h-4 text-indigo-600" />
                    <span>Target Job Roles</span>
                  </h4>
                  <ul className="space-y-2.5">
                    {(path.career_outcomes?.length ? path.career_outcomes : [path.title, 'Software Specialist', 'Technical Consultant']).map((role, idx) => (
                      <li key={idx} className="flex items-start space-x-2.5 text-xs text-slate-600 dark:text-slate-300">
                        <Check className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
                        <span>{role}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Right Column: Sticky Enrollment & Summary Card */}
            <div className="space-y-6">
              <div className="sticky top-28 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
                {/* Header Info */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
                    Comprehensive Career Track
                  </span>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">
                    {path.title}
                  </h3>
                </div>

                {/* Progress if Enrolled */}
                {enrolled ? (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-700 dark:text-slate-300">Your Progress</span>
                      <span className="text-primary-600 dark:text-primary-400">{progressPct}%</span>
                    </div>
                    <div className="h-3 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary-600 to-indigo-600 rounded-full transition-all duration-500"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {completedCoursesSet.size} of {path.total_courses || 3} courses finished
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-primary-50 dark:bg-primary-950/30 border border-primary-100 dark:border-primary-900/40 text-xs text-primary-800 dark:text-primary-300">
                    ✨ Free access with your EduAcademy account. Track your progress across all courses in this specialization.
                  </div>
                )}

                {/* Primary CTA Button */}
                <Button
                  size="lg"
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="w-full py-3.5 shadow-lg shadow-primary-500/20"
                >
                  {enrolling ? (
                    'Enrolling...'
                  ) : enrolled ? (
                    <span className="flex items-center justify-center space-x-2">
                      <span>Continue Path</span>
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  ) : (
                    <span className="flex items-center justify-center space-x-2">
                      <Play className="w-4 h-4 fill-white" />
                      <span>Start Learning Path</span>
                    </span>
                  )}
                </Button>

                {/* Path Specs List */}
                <div className="space-y-3.5 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center space-x-2">
                      <BookOpen className="w-4 h-4 text-slate-400" />
                      <span>Curated Courses:</span>
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">{path.total_courses || 3}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span>Duration:</span>
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">{path.duration_weeks || 12} Weeks (~{path.estimated_hours || 60} hrs)</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center space-x-2">
                      <Layers className="w-4 h-4 text-slate-400" />
                      <span>Skill Level:</span>
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white capitalize">{path.difficulty?.replace('_', ' ') || 'All Levels'}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center space-x-2">
                      <Award className="w-4 h-4 text-slate-400" />
                      <span>Certificate:</span>
                    </span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">Included</span>
                  </div>
                </div>

                {/* Back to Paths link */}
                <div className="pt-2 text-center">
                  <Link
                    to="/learning-paths"
                    className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    Browse Other Learning Paths
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};
