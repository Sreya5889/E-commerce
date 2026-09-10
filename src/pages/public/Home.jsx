import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  ChevronRight,
  Award,
  Users,
  BookOpen,
  Star,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  Code,
  Cpu,
  Palette,
  Smartphone,
  Cloud,
  Shield,
  Database,
  TrendingUp,
  Clock,
  Zap,
  Globe,
  MessageSquare,
  PlayCircle,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { courseService } from '../../services/course.service';
import { categoryService } from '../../services/category.service';
import { teacherService } from '../../services/teacher.service';
import { faqService } from '../../services/faq.service';
import { PageTransition } from '../../components/layout/PageTransition';
import { CourseCard } from '../../components/ui/CourseCard';
import { CourseCardSkeleton } from '../../components/ui/Skeleton';
import { Button } from '../../components/ui/Button';

// Category icon mapper
const getCategoryIcon = (iconName) => {
  switch (iconName?.toLowerCase()) {
    case 'code':
    case 'web-development':
      return <Code className="w-6 h-6" />;
    case 'cpu':
    case 'artificial-intelligence':
      return <Cpu className="w-6 h-6" />;
    case 'palette':
    case 'figma':
    case 'ui-ux-design':
      return <Palette className="w-6 h-6" />;
    case 'smartphone':
    case 'mobile-development':
      return <Smartphone className="w-6 h-6" />;
    case 'cloud':
    case 'cloud-computing':
      return <Cloud className="w-6 h-6" />;
    case 'shield':
    case 'cybersecurity':
      return <Shield className="w-6 h-6" />;
    case 'database':
    case 'data-science':
      return <Database className="w-6 h-6" />;
    default:
      return <BookOpen className="w-6 h-6" />;
  }
};

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Marcus Vance',
    role: 'Frontend Engineer @ Vercel',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    rating: 5,
    quote: 'The React & System Design bootcamp gave me the architecture foundations I needed to transition from junior to senior engineer in under 9 months.',
  },
  {
    id: 2,
    name: 'Aisha Patel',
    role: 'Product Designer @ Figma',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    rating: 5,
    quote: 'Sarah Chen’s UI/UX course is hands-down the best design curriculum online. The component systems and token workflows are directly usable in real products.',
  },
  {
    id: 3,
    name: 'David Zhao',
    role: 'ML Engineer @ Anthropic',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    rating: 5,
    quote: 'Clear mathematical derivations coupled with practical PyTorch implementations. No hand-waving. EduAcademy instructors are top-tier domain experts.',
  }
];

export const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFaq, setActiveFaq] = useState(null);
  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategoryTab, setActiveCategoryTab] = useState('all');

  useEffect(() => {
    const loadHomeData = async () => {
      setLoading(true);
      try {
        const [cats, crs, teachers, faqData] = await Promise.all([
          categoryService.getCategories(),
          courseService.getCourses(),
          teacherService.getTeachers(),
          faqService.getFAQs(),
        ]);
        setCategories(cats || []);
        setCourses(crs || []);
        setInstructors(teachers || []);
        setFaqs(faqData || []);
      } catch (err) {
        console.error('Failed to load home page data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadHomeData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const filteredCourses = activeCategoryTab === 'all'
    ? courses
    : courses.filter(c => c.categories?.slug === activeCategoryTab || c.categories?.name?.toLowerCase().includes(activeCategoryTab));

  return (
    <PageTransition>
      <div className="w-full overflow-hidden">
        
        {/* ====================================================
            SECTION 1: HERO SECTION
            ==================================================== */}
        <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 bg-gradient-to-b from-slate-50 via-white to-slate-50/50 dark:from-slate-900 dark:via-slate-900/80 dark:to-slate-950 border-b border-slate-100 dark:border-slate-800/80">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(37,99,235,0.12),transparent_50%)] pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Column Content */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                
                {/* Badge */}
                <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-900/60 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Learning Reimagined for Modern Tech Careers</span>
                </div>

                {/* Main Heading */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15]">
                  Unlock Your Tech Potential with{' '}
                  <span className="bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">
                    EduAcademy
                  </span>
                </h1>

                {/* Subtitle */}
                <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  Master high-income software engineering, artificial intelligence, UI/UX architecture, and cloud systems with project-based courses taught by industry veterans.
                </p>

                {/* Search Box */}
                <form onSubmit={handleSearchSubmit} className="max-w-lg mx-auto lg:mx-0 relative p-2 bg-white dark:bg-slate-850 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-700/80 flex items-center">
                  <Search className="absolute left-5 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="What do you want to learn today?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-24 py-3 bg-transparent text-sm focus:outline-none text-slate-900 dark:text-slate-100 placeholder-slate-400 font-medium"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold shadow-md shadow-primary-500/30 transition-all hover:scale-105 active:scale-95"
                  >
                    Search
                  </button>
                </form>

                {/* Quick Discovery Tags */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1 text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Popular:</span>
                  {['React v19', 'Figma UI/UX', 'Python AI', 'Next.js', 'System Design'].map(tag => (
                    <button
                      key={tag}
                      onClick={() => navigate(`/courses?search=${encodeURIComponent(tag)}`)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-primary-50 hover:text-primary-600 dark:hover:bg-primary-950/40 dark:hover:text-primary-400 transition-colors font-medium text-[11px]"
                    >
                      {tag}
                    </button>
                  ))}
                </div>

                {/* Action CTAs */}
                <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-3">
                  <Link to="/courses">
                    <Button size="lg" icon={BookOpen}>Explore Courses</Button>
                  </Link>
                  <Link to="/pricing">
                    <Button variant="outline" size="lg">View Pricing Plans</Button>
                  </Link>
                </div>
              </div>

              {/* Right Column Preview Card */}
              <div className="lg:col-span-5 relative hidden lg:block">
                <div className="relative mx-auto w-full max-w-md rounded-3xl overflow-hidden bg-white dark:bg-slate-850 p-4 shadow-2xl border border-slate-100 dark:border-slate-800 group hover:shadow-primary-500/10 transition-all duration-300">
                  <div className="relative aspect-video rounded-2xl overflow-hidden mb-4 bg-slate-900">
                    <img
                      src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=700&auto=format&fit=crop&q=80"
                      alt="Featured Course Preview"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                      <div className="flex items-center space-x-2 text-white text-xs font-semibold">
                        <PlayCircle className="w-6 h-6 text-primary-400" />
                        <span>Featured Interactive Course</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 px-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-500 text-white uppercase">
                        BESTSELLER
                      </span>
                      <div className="flex items-center space-x-1 text-amber-500 font-bold text-xs">
                        <Star className="w-4 h-4 fill-current" />
                        <span>4.9 (12,480)</span>
                      </div>
                    </div>

                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white leading-snug">
                      Full-Stack Web Development: From Zero to Production
                    </h3>

                    <div className="flex items-center space-x-3 text-xs text-slate-500 dark:text-slate-400 pt-1">
                      <img
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop"
                        alt="Instructor Dr. Angela Steele"
                        className="w-7 h-7 rounded-full object-cover"
                      />
                      <span className="font-medium text-slate-700 dark:text-slate-300">Dr. Angela Steele</span>
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex items-center justify-between">
                      <div className="flex items-baseline space-x-2">
                        <span className="text-xl font-black text-primary-600 dark:text-primary-400">$19.99</span>
                        <span className="text-xs text-slate-400 line-through">$99.99</span>
                      </div>
                      <Link to="/courses">
                        <span className="text-xs font-bold text-primary-600 dark:text-primary-400 flex items-center hover:underline">
                          Start Learning <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ====================================================
            SECTION 2: PLATFORM STATISTICS
            ==================================================== */}
        <section className="py-12 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="space-y-1">
                <p className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">1.2M+</p>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Active Students</p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl sm:text-4xl font-black text-primary-600 dark:text-primary-400">500+</p>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Curated Courses</p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">200+</p>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Expert Instructors</p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl sm:text-4xl font-black text-indigo-600 dark:text-indigo-400">50+</p>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Learning Tracks</p>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================
            SECTION 3: POPULAR COURSES
            ==================================================== */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider">
                Industry-Ready Curricula
              </span>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
                Trending & Popular Courses
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
                Highest-rated masterclasses to help you acquire production-grade skills.
              </p>
            </div>
            
            <Link to="/courses" className="inline-flex items-center text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline">
              <span>Browse All {courses.length || '500+'} Courses</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setActiveCategoryTab('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeCategoryTab === 'all'
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-500/25'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              All Topics
            </button>
            {categories.slice(0, 5).map(cat => (
              <button
                key={cat.id || cat.slug}
                onClick={() => setActiveCategoryTab(cat.slug)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeCategoryTab === cat.slug
                    ? 'bg-primary-600 text-white shadow-md shadow-primary-500/25'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Courses Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(n => <CourseCardSkeleton key={n} />)}
            </div>
          ) : filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.slice(0, 6).map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-8">
              <p className="text-sm text-slate-500">No courses found in this category.</p>
            </div>
          )}
        </section>

        {/* ====================================================
            SECTION 4: CATEGORIES
            ==================================================== */}
        <section className="py-20 bg-slate-50/70 dark:bg-slate-900/40 border-y border-slate-100 dark:border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
              <span className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider">
                Skill Tracks
              </span>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Explore Top Categories
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
                Discover dedicated learning paths designed to take you from foundational basics to advanced mastery.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((cat) => (
                <Link
                  key={cat.id || cat.slug}
                  to={`/courses?category=${cat.slug}`}
                  className="group p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-premium-hover transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400 flex items-center justify-center mb-4 group-hover:bg-primary-600 group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-sm">
                    {getCategoryIcon(cat.slug || cat.icon)}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors mb-1">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                      {cat.course_count ?? 40}+ Courses Available
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ====================================================
            SECTION 5: FEATURED INSTRUCTORS
            ==================================================== */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider">
                World-Class Mentors
              </span>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
                Learn from Industry Leaders
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
                Our instructors lead teams at Google, Meta, Amazon, Netflix, and world-class universities.
              </p>
            </div>
            <Link to="/teachers" className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline flex items-center">
              <span>View All Instructors</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {instructors.slice(0, 3).map((teacher) => {
              const name = teacher.profiles?.display_name ||
                `${teacher.profiles?.first_name || ''} ${teacher.profiles?.last_name || ''}`.trim() ||
                'Educator';
              const avatar = teacher.profiles?.avatar_url ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=160&background=2563eb&color=fff`;

              return (
                <div
                  key={teacher.id}
                  className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-premium-hover transition-all duration-300 hover:-translate-y-1 text-center space-y-4"
                >
                  <img
                    src={avatar}
                    alt={name}
                    className="w-24 h-24 rounded-full object-cover mx-auto ring-4 ring-primary-50 dark:ring-primary-950/40 shadow-md"
                  />
                  <div className="space-y-1">
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">{name}</h3>
                    <p className="text-xs text-primary-600 dark:text-primary-400 font-semibold">
                      {teacher.expertise_areas?.[0] || 'Senior Engineering Leader'}
                    </p>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {teacher.profiles?.bio || 'Teaching practical engineering and software architecture to learners globally.'}
                  </p>
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
                    <div>
                      <p className="font-black text-slate-900 dark:text-white">{teacher.total_students?.toLocaleString() || '120K+'}</p>
                      <p className="text-[10px] text-slate-400">Students</p>
                    </div>
                    <div>
                      <p className="font-black text-slate-900 dark:text-white flex items-center justify-center text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-current mr-0.5" />
                        <span>{Number(teacher.avg_rating ?? 4.9).toFixed(1)}</span>
                      </p>
                      <p className="text-[10px] text-slate-400">Rating</p>
                    </div>
                  </div>
                  <div className="pt-2">
                    <Link
                      to={`/teachers`}
                      className="w-full inline-flex items-center justify-center py-2 px-3 bg-slate-50 dark:bg-slate-800 hover:bg-primary-50 dark:hover:bg-primary-950/30 hover:text-primary-600 dark:hover:text-primary-400 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-colors"
                    >
                      View Profile & Courses
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ====================================================
            SECTION 6: WHY EDUACADEMY
            ==================================================== */}
        <section className="py-20 bg-slate-50/70 dark:bg-slate-900/40 border-y border-slate-100 dark:border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
              <span className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider">
                The EduAcademy Advantage
              </span>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Why Learn with EduAcademy?
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
                Built from the ground up for career switchers, working software professionals, and ambitious engineers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: Users, title: 'Learn from Industry Experts', desc: 'Lessons recorded and reviewed by practicing software leads, architects, and designers.' },
                { icon: Code, title: 'Practical Project-Based Learning', desc: 'Build production-ready GitHub repositories and complete portfolios, not just toy examples.' },
                { icon: Clock, title: 'Learn at Your Own Pace', desc: 'Lifetime on-demand access on desktop, tablet, and mobile. Study whenever your schedule allows.' },
                { icon: Award, title: 'Verified Certificates', desc: 'Earn verifiable digital certificates upon curriculum completion to share on LinkedIn.' },
                { icon: Zap, title: 'Lifetime Course Access', desc: 'All future curriculum updates, new lessons, and revised projects are included forever.' },
                { icon: MessageSquare, title: 'Active Community Support', desc: 'Ask questions, review assignments, and network with 1.2M+ tech students across the world.' }
              ].map((benefit, idx) => (
                <div key={idx} className="p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-premium-hover transition-all duration-300 space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 flex items-center justify-center shadow-inner">
                    <benefit.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">{benefit.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ====================================================
            SECTION 7: LEARNING EXPERIENCE (HOW IT WORKS)
            ==================================================== */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider">
              Your Learning Journey
            </span>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              How EduAcademy Works
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
              A clear, proven five-step trajectory from curious beginner to verified specialist.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 relative">
            {[
              { step: '01', title: 'Find Your Course', desc: 'Search 500+ masterclasses across engineering, AI, and design.' },
              { step: '02', title: 'Instant Enrollment', desc: 'One-click checkout or access with your Pro membership.' },
              { step: '03', title: 'Self-Paced Study', desc: 'Watch concise, high-definition video lessons with downloadable code.' },
              { step: '04', title: 'Build Projects', desc: 'Implement real systems, submit exercises, and build a resume portfolio.' },
              { step: '05', title: 'Earn Certificate', desc: 'Receive your verified certificate to demonstrate your new skills.' }
            ].map((st, i) => (
              <div key={i} className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-center space-y-3 shadow-sm hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-full bg-primary-600 text-white font-black text-xs flex items-center justify-center mx-auto shadow-md shadow-primary-500/20">
                  {st.step}
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">{st.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ====================================================
            SECTION 8: STUDENT TESTIMONIALS
            ==================================================== */}
        <section className="py-20 bg-slate-50/70 dark:bg-slate-900/40 border-y border-slate-100 dark:border-slate-800/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
              <span className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider">
                Proven Outcomes
              </span>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Trusted by 1.2M+ Engineers & Creators
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
                Read how EduAcademy graduates transformed their careers and landed dream roles.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {TESTIMONIALS.map((t) => (
                <div
                  key={t.id}
                  className="p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-premium-hover transition-all duration-300 flex flex-col justify-between space-y-6"
                >
                  <div className="space-y-4">
                    <div className="flex items-center space-x-1 text-amber-500">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
                      "{t.quote}"
                    </p>
                  </div>
                  <div className="flex items-center space-x-3 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                    <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white">{t.name}</h4>
                      <p className="text-[11px] text-slate-400">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ====================================================
            SECTION 9: PRICING & MEMBERSHIP
            ==================================================== */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider">
              Flexible Investment
            </span>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Simple, Transparent Pricing
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
              Purchase courses individually with lifetime access, or subscribe to unlock all tracks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            
            {/* Tier 1: Pay As You Go */}
            <div className="p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex flex-col justify-between shadow-sm space-y-6">
              <div className="space-y-4">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase">
                  Individual
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Pay As You Go</h3>
                <div className="flex items-baseline space-x-1">
                  <span className="text-3xl font-black text-slate-900 dark:text-white">$14.99</span>
                  <span className="text-xs text-slate-400">/ avg. course</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Ideal for mastering single specialized topics.</p>
                <div className="border-t border-slate-100 dark:border-slate-800 my-4" />
                <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                  <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" /><span>Lifetime access to purchased course</span></li>
                  <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" /><span>Verified certificate of completion</span></li>
                  <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" /><span>Downloadable exercise source code</span></li>
                  <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" /><span>30-day money-back guarantee</span></li>
                </ul>
              </div>
              <Link to="/courses" className="w-full">
                <Button variant="outline" className="w-full">Browse Courses</Button>
              </Link>
            </div>

            {/* Tier 2: Annual Pro Membership (Featured) */}
            <div className="relative p-8 bg-white dark:bg-slate-900 border-2 border-primary-600 rounded-2xl flex flex-col justify-between shadow-xl shadow-primary-500/10 space-y-6">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-black bg-primary-600 text-white uppercase shadow-sm">
                RECOMMENDED
              </span>
              <div className="space-y-4">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-primary-50 dark:bg-primary-950/40 text-primary-600 uppercase">
                  Pro All-Access
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Annual Pro Membership</h3>
                <div className="flex items-baseline space-x-1">
                  <span className="text-3xl font-black text-slate-900 dark:text-white">$19</span>
                  <span className="text-xs text-slate-400">/ month, billed annually</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Unlimited access to all 500+ masterclasses.</p>
                <div className="border-t border-slate-100 dark:border-slate-800 my-4" />
                <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                  <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" /><span>Unlimited access to all 500+ courses</span></li>
                  <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" /><span>All newly released courses included</span></li>
                  <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" /><span>Interactive coding assessments & quizzes</span></li>
                  <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" /><span>Priority instructor Q&A assistance</span></li>
                </ul>
              </div>
              <Link to="/pricing" className="w-full">
                <Button variant="primary" className="w-full">Start 7-Day Free Trial</Button>
              </Link>
            </div>

            {/* Tier 3: Teams & Enterprise */}
            <div className="p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex flex-col justify-between shadow-sm space-y-6">
              <div className="space-y-4">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase">
                  Enterprise
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Teams & Startups</h3>
                <div className="flex items-baseline space-x-1">
                  <span className="text-3xl font-black text-slate-900 dark:text-white">Custom</span>
                  <span className="text-xs text-slate-400">/ team tier</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Empower your development organization.</p>
                <div className="border-t border-slate-100 dark:border-slate-800 my-4" />
                <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                  <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" /><span>Centralized billing & license allocation</span></li>
                  <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" /><span>Team completion analytics dashboard</span></li>
                  <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" /><span>Custom learning tracks & paths</span></li>
                  <li className="flex items-center space-x-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" /><span>Dedicated account manager</span></li>
                </ul>
              </div>
              <Link to="/contact" className="w-full">
                <Button variant="outline" className="w-full">Contact Sales</Button>
              </Link>
            </div>

          </div>
        </section>

        {/* ====================================================
            SECTION 10: FAQ ACCORDION
            ==================================================== */}
        <section id="faq" className="py-20 bg-slate-50/70 dark:bg-slate-900/40 border-y border-slate-100 dark:border-slate-800/80">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14 space-y-2">
              <span className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider">
                Clear Answers
              </span>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Frequently Asked Questions
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
                Everything you need to know about the EduAcademy platform, courses, and certificates.
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => {
                const isOpen = activeFaq === index;
                return (
                  <div
                    key={faq.id || index}
                    className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm transition-all duration-200"
                  >
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full p-6 text-left flex items-center justify-between space-x-4 focus:outline-none"
                      aria-expanded={isOpen}
                    >
                      <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-primary-600' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-6 pb-6 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-4">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ====================================================
            SECTION 11: FINAL CALL TO ACTION
            ==================================================== */}
        <section className="py-20 relative overflow-hidden bg-gradient-to-r from-primary-600 via-indigo-600 to-primary-700 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.15),transparent_50%)] pointer-events-none" />
          
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Start learning something new today.
            </h2>
            <p className="text-primary-100 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Join 1.2M+ developers, designers, and systems engineers advancing their careers on EduAcademy.
            </p>
            <div className="flex flex-wrap gap-4 justify-center pt-2">
              <Link to="/courses">
                <button className="px-8 py-3.5 bg-white text-primary-600 font-extrabold rounded-xl shadow-lg hover:bg-slate-100 transition-all hover:scale-105 active:scale-95 text-sm">
                  Explore Courses
                </button>
              </Link>
              <Link to="/register">
                <button className="px-8 py-3.5 bg-primary-800/80 hover:bg-primary-900 text-white font-extrabold rounded-xl border border-primary-400/40 transition-all text-sm">
                  Create Free Account
                </button>
              </Link>
            </div>
          </div>
        </section>

      </div>
    </PageTransition>
  );
};
