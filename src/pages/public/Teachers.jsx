import React, { useEffect, useState } from 'react';
import { PageTransition } from '../../components/layout/PageTransition';
import { teacherService } from '../../services/teacher.service';
import { Star, Users, BookOpen, BadgeCheck, Linkedin, Github, Globe, Mail } from 'lucide-react';

export const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTeachers = async () => {
      try {
        const data = await teacherService.getTeachers();
        setTeachers(data || []);
      } catch (err) {
        console.error('Failed to load teachers:', err);
      } finally {
        setLoading(false);
      }
    };
    loadTeachers();
  }, []);

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 space-y-16">

        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-3">
          <span className="px-3 py-1 bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400 font-bold rounded-full text-xs uppercase tracking-wider">
            Meet the Team
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Learn from World-Class Instructors
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Our instructors are active industry leaders with decades of combined real-world experience. They design curriculum aligned with what modern tech companies actually need.
          </p>
        </div>

        {/* Instructor Cards */}
        <div className="space-y-10">
          {loading && (
            <div className="space-y-10 animate-pulse">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-64 bg-slate-200 dark:bg-slate-800 rounded-premium"></div>
              ))}
            </div>
          )}
          {!loading && teachers.map((teacher, idx) => (
            <div
              key={teacher.id}
              className={`flex flex-col ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-10 items-center bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-premium p-8 shadow-sm hover:shadow-premium transition-all duration-300`}
            >
              {/* Avatar Section */}
              <div className="flex-shrink-0 text-center space-y-4">
                <div className="relative inline-block">
                  <img
                    src={teacher.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent('Instructor')}&size=144`}
                    alt={teacher.profiles?.display_name || `${teacher.profiles?.first_name || ''} ${teacher.profiles?.last_name || ''}`.trim() || 'Instructor'}
                    className="w-36 h-36 rounded-premium object-cover border-4 border-slate-50 dark:border-slate-800 shadow-lg"
                  />
                  {teacher.verification_badge && (
                    <span className="absolute -bottom-2 -right-2 bg-primary-600 text-white text-[9px] font-bold px-2 py-1 rounded-full flex items-center space-x-1 shadow">
                      <BadgeCheck className="w-3 h-3" />
                      <span>Verified</span>
                    </span>
                  )}
                </div>

                {/* Social Links */}
                <div className="flex justify-center space-x-3">
                  <a
                    href={teacher.profiles?.website || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-primary-600 hover:text-white text-slate-500 dark:text-slate-400 rounded-lg transition-all"
                    title="Instructor Website"
                  >
                    <Globe className="w-4 h-4" />
                  </a>
                  <a
                    href={`https://linkedin.com/search/results/all/?keywords=${encodeURIComponent(teacher.profiles?.display_name || 'Instructor')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-primary-600 hover:text-white text-slate-500 dark:text-slate-400 rounded-lg transition-all"
                    title="LinkedIn Profile"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a
                    href="/contact"
                    className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-primary-600 hover:text-white text-slate-500 dark:text-slate-400 rounded-lg transition-all"
                    title="Contact Support regarding this Instructor"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl">
                    <p className="text-sm font-extrabold text-slate-900 dark:text-white">{Number(teacher.avg_rating ?? 4.5).toFixed(1)}</p>
                    <p className="text-[9px] text-slate-400">Rating</p>
                  </div>
                  <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl">
                    <p className="text-sm font-extrabold text-slate-900 dark:text-white">{Number(teacher.total_courses ?? 0)}</p>
                    <p className="text-[9px] text-slate-400">Courses</p>
                  </div>
                  <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl">
                    <p className="text-sm font-extrabold text-slate-900 dark:text-white">{(Number(teacher.total_students ?? 0) / 1000).toFixed(0)}K</p>
                    <p className="text-[9px] text-slate-400">Students</p>
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="flex-grow space-y-5">
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-1">{teacher.profiles?.display_name || `${teacher.profiles?.first_name || ''} ${teacher.profiles?.last_name || ''}`.trim() || 'Instructor'}</h2>
                  <p className="text-sm font-medium text-primary-600 dark:text-primary-400">{teacher.expertise_areas?.[0] || 'Instructor'}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{teacher.expertise_areas?.join(', ') || 'Expert'}</p>
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{teacher.profiles?.bio || 'Expert instructor.'}</p>

                {/* Skills Tags */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Expertise & Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {(teacher.expertise_areas || []).map((skill) => (
                      <span key={skill} className="px-3 py-1 bg-primary-50 dark:bg-primary-950/20 text-primary-700 dark:text-primary-300 text-[10px] font-semibold rounded-full border border-primary-100 dark:border-primary-900/30">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Achievements */}
                {teacher.achievements && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Achievements</h4>
                    <div className="flex flex-wrap gap-2">
                      {teacher.achievements.map((ach) => (
                        <span key={ach} className="px-3 py-1 bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 text-[10px] font-semibold rounded-full border border-amber-100 dark:border-amber-900/30 flex items-center space-x-1">
                          <Star className="w-3 h-3 fill-current" />
                          <span>{ach}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Experience */}
                <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center space-x-2 pt-1">
                  <Users className="w-4 h-4 text-slate-400" />
                  <span>{`${teacher.years_of_experience ?? 0}+ Years`}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Become an Instructor CTA */}
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-premium p-10 md:p-16 text-white text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold">Share Your Expertise with Thousands of Learners</h2>
          <p className="text-primary-100 text-sm max-w-xl mx-auto">
            Join our network of verified industry instructors. Publish your courses, build your personal brand, and earn competitive revenue shares.
          </p>
          <div className="flex justify-center space-x-4">
            <a href="/register" className="px-6 py-3 bg-white text-primary-600 hover:bg-slate-50 rounded-premium font-bold text-sm transition-colors shadow-lg">
              Apply to Teach
            </a>
            <a href="/contact" className="px-6 py-3 bg-white/10 backdrop-blur border border-white/20 hover:bg-white/20 rounded-premium font-bold text-sm transition-colors">
              Learn More
            </a>
          </div>
        </div>

      </div>
    </PageTransition>
  );
};
