import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ChevronRight, Award, Users, BookOpen, Star, HelpCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { CATEGORIES, COURSES, INSTRUCTORS, FAQS } from '../../constants/mockData';
import { PageTransition } from '../../components/layout/PageTransition';

export const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFaq, setActiveFaq] = useState(null);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <PageTransition>
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32 bg-slate-50 dark:bg-slate-900/50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(37,99,235,0.1),transparent_50%)]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400 border border-primary-100 dark:border-primary-900/50">
                <span>🔥 Learning Reimagined</span>
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                Unlock Your Tech Potential with{' '}
                <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                  EduAcademy
                </span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto lg:mx-0">
                Join over 1.2M+ students master HTML, React, UI/UX design, Machine Learning, and Cloud Computing from leading industry experts.
              </p>

              {/* Glassmorphism search input */}
              <form onSubmit={handleSearchSubmit} className="max-w-md mx-auto lg:mx-0 relative p-2 rounded-premium glass shadow-lg flex items-center">
                <input
                  type="text"
                  placeholder="What do you want to learn today?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/70 dark:bg-slate-800/70 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-800 dark:text-slate-200 border-none placeholder-slate-400"
                />
                <Search className="absolute left-5 top-6 w-5 h-5 text-slate-400" />
                <button
                  type="submit"
                  className="absolute right-3 top-3 px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-semibold shadow-md transition-colors"
                >
                  Search
                </button>
              </form>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-2">
                <Link
                  to="/courses"
                  className="px-6 py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-premium font-semibold text-sm shadow-lg shadow-primary-500/25 transition-all duration-200"
                >
                  Explore Courses
                </Link>
                <Link
                  to="/pricing"
                  className="px-6 py-3.5 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-premium font-semibold text-sm transition-colors text-slate-700 dark:text-slate-200"
                >
                  View Pricing Plans
                </Link>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-200 dark:border-slate-800 max-w-lg mx-auto lg:mx-0">
                <div>
                  <h4 className="text-2xl font-bold text-slate-900 dark:text-white">1.2M+</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Active Students</p>
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-slate-900 dark:text-white">120+</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">High-End Courses</p>
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-slate-900 dark:text-white">4.8★</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Average Rating</p>
                </div>
              </div>
            </div>

            {/* Right Card / Graphic */}
            <div className="lg:col-span-5 relative hidden lg:block">
              <div className="relative mx-auto w-full max-w-sm rounded-premium overflow-hidden bg-white dark:bg-slate-900 p-3 shadow-2xl border border-slate-100 dark:border-slate-800">
                <img
                  src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=80"
                  alt="Student studying coding"
                  className="w-full h-56 rounded-xl object-cover"
                />
                <div className="p-4 space-y-3">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-accent-100 text-accent-700 uppercase tracking-wider">
                    POPULAR COURSE
                  </span>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                    Mastering React v19 & System Design
                  </h3>
                  <div className="flex items-center space-x-2 text-xs text-slate-500">
                    <img
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop"
                      alt="Instructor"
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span>Dr. Angela Steele</span>
                  </div>
                  <div className="border-t border-slate-100 dark:border-slate-800 my-2"></div>
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-lg text-primary-600 dark:text-primary-400">$19.99</span>
                    <span className="text-xs text-slate-400 line-through">$99.99</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Trusted Companies Logos */}
      <section className="py-10 bg-white dark:bg-slate-900/30 border-y border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6">
            TRUSTED BY THE WORLDS BEST TEAMS
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 dark:opacity-40">
            <span className="text-lg font-bold tracking-tight text-slate-700 dark:text-slate-300">GOOGLE</span>
            <span className="text-lg font-bold tracking-tight text-slate-700 dark:text-slate-300">META</span>
            <span className="text-lg font-bold tracking-tight text-slate-700 dark:text-slate-300">MICROSOFT</span>
            <span className="text-lg font-bold tracking-tight text-slate-700 dark:text-slate-300">NETFLIX</span>
            <span className="text-lg font-bold tracking-tight text-slate-700 dark:text-slate-300">AMAZON</span>
          </div>
        </div>
      </section>

      {/* 3. Featured Categories */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Explore Top Categories</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Discover popular skills and choose your learning trajectory.</p>
          </div>
          <Link to="/courses" className="mt-4 md:mt-0 text-sm font-semibold text-primary-600 dark:text-primary-400 flex items-center hover:underline">
            <span>Browse All Courses</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat, idx) => (
            <Link
              key={cat.id}
              to={`/courses?category=${cat.slug}`}
              className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-premium hover:shadow-premium hover:-translate-y-1 transition-all duration-200 group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400 flex items-center justify-center mb-5 group-hover:bg-primary-600 group-hover:text-white transition-all">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1">{cat.name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{cat.count} Courses available</p>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Trending Courses */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Trending Courses</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Get started with our highly-rated, bestseller courses.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {COURSES.map((course) => {
              const teacher = INSTRUCTORS.find(t => t.id === course.teacherId);
              return (
                <div
                  key={course.id}
                  className="bg-white dark:bg-slate-900 rounded-premium overflow-hidden border border-slate-100 dark:border-slate-800 hover:shadow-premium-hover transition-all duration-300 group flex flex-col h-full"
                >
                  <Link to={`/course/${course.id}`} className="relative block overflow-hidden aspect-video">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {course.badge && (
                      <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold text-white shadow-sm uppercase ${
                        course.badge === 'Bestseller' ? 'bg-amber-500' :
                        course.badge === 'Trending' ? 'bg-indigo-500' : 'bg-primary-600'
                      }`}>
                        {course.badge}
                      </span>
                    )}
                  </Link>
                  <div className="p-6 flex flex-col flex-grow">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400 mb-2">
                      {course.category}
                    </span>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white line-clamp-2 leading-snug mb-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                      <Link to={`/course/${course.id}`}>{course.title}</Link>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">
                      {course.subtitle}
                    </p>

                    <div className="flex items-center space-x-2 text-xs text-slate-500 mb-4">
                      <img src={teacher?.avatar} alt={teacher?.name} className="w-5 h-5 rounded-full object-cover" />
                      <span className="font-medium text-slate-700 dark:text-slate-300">{teacher?.name}</span>
                    </div>

                    <div className="flex items-center space-x-1.5 mb-4 text-xs">
                      <div className="flex items-center text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="ml-1 text-slate-900 dark:text-white">{course.rating}</span>
                      </div>
                      <span className="text-slate-400">({course.studentCount.toLocaleString()} students)</span>
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-800 pt-4 mt-auto flex items-center justify-between">
                      <div className="flex items-baseline space-x-1.5">
                        <span className="text-lg font-extrabold text-slate-900 dark:text-white">
                          ${course.discountPrice || course.price}
                        </span>
                        {course.discountPrice && (
                          <span className="text-xs text-slate-400 line-through">
                            ${course.price}
                          </span>
                        )}
                      </div>
                      <Link
                        to={`/course/${course.id}`}
                        className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 flex items-center space-x-1"
                      >
                        <span>Learn More</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Top Instructors */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Learn from the Best Instructors</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Our instructors are active industry leaders designing high-end curricula.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {INSTRUCTORS.map((teacher) => (
            <div
              key={teacher.id}
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-premium p-6 text-center shadow-sm hover:shadow-premium hover:-translate-y-1 transition-all duration-200"
            >
              <img
                src={teacher.avatar}
                alt={teacher.name}
                className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-slate-50 dark:border-slate-800 mb-4"
              />
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-0.5">{teacher.name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-3">{teacher.designation}</p>
              <div className="flex items-center justify-center space-x-2 text-xs mb-4">
                <span className="text-amber-500 font-bold flex items-center">
                  <Star className="w-3.5 h-3.5 fill-current mr-0.5" />
                  {teacher.rating}
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-500 dark:text-slate-400 font-medium">{teacher.students.toLocaleString()} Students</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 mb-6 px-2">
                {teacher.biography}
              </p>
              <Link
                to="/teachers"
                className="inline-flex items-center text-xs font-semibold px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-premium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                View Profile
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Success Stories / Testimonials */}
      <section className="py-20 bg-primary-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.1),transparent_40%)]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-semibold uppercase tracking-wider">
              🎓 STUDENT SUCCESS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Real Stories. Real Career Achievements.
            </h2>
            <p className="text-primary-100 text-sm">
              Read how thousands of self-taught developers, designers, and data scientists transformed their careers using EduAcademy.
            </p>
            <div className="space-y-3.5 pt-2">
              <div className="flex items-center space-x-2.5 text-sm font-medium">
                <CheckCircle2 className="w-5 h-5 text-accent-400" />
                <span>87% of graduates reports salary hikes or promotions</span>
              </div>
              <div className="flex items-center space-x-2.5 text-sm font-medium">
                <CheckCircle2 className="w-5 h-5 text-accent-400" />
                <span>Access verified certificates immediately upon completion</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-white/10 backdrop-blur-md border border-white/10 p-8 rounded-premium space-y-6">
              <div className="flex items-center space-x-1.5 text-accent-400">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-base font-medium italic text-slate-100">
                "I went from knowing zero coding to building full-stack platforms within 6 months. Dr. Angela's Web Dev Bootcamp is easily the best investment I have made in my tech career. Highly recommended!"
              </p>
              <div className="flex items-center space-x-3.5">
                <img
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop"
                  alt="Student"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-sm font-bold text-white">Jane Doe</h4>
                  <p className="text-xs text-primary-200">Software Engineer at Meta</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAQs */}
      <section className="py-20 max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Frequently Asked Questions</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Get answers to standard questions about our learning process.</p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, index) => (
            <div
              key={index}
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-premium overflow-hidden transition-all duration-200"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full px-6 py-5 text-left font-semibold text-sm flex items-center justify-between text-slate-800 dark:text-slate-200 focus:outline-none"
              >
                <span>{faq.question}</span>
                <HelpCircle className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${activeFaq === index ? 'rotate-180' : ''}`} />
              </button>
              {activeFaq === index && (
                <div className="px-6 pb-5 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-50 dark:border-slate-800/50 pt-3 animate-fade-in leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 8. Newsletter Signup CTA */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Ready to start your learning journey?</h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-2 mb-8">
            Create a free account or choose a subscription plan to unlock unlimited access.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/register"
              className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-premium text-sm font-semibold shadow-md transition-colors"
            >
              Get Started Free
            </Link>
            <Link
              to="/courses"
              className="px-6 py-3 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-premium text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Browse Courses
            </Link>
          </div>
        </div>
      </section>

    </PageTransition>
  );
};
