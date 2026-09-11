import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, Search, MapPin, DollarSign, Bookmark, 
  ExternalLink, Building2, Clock, CheckCircle2, ArrowRight, 
  Filter, Sparkles 
} from 'lucide-react';
import { jobService } from '../../services/job.service';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const JobsHome = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [workMode, setWorkMode] = useState('all');
  const [employmentType, setEmploymentType] = useState('all');
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());

  useEffect(() => {
    const loadJobs = async () => {
      setLoading(true);
      try {
        const [data, bookmarks] = await Promise.all([
          jobService.getAll({
            category: selectedCategory,
            workMode,
            employmentType,
            search: searchQuery
          }),
          jobService.getBookmarks().catch(() => [])
        ]);
        setJobs(data || []);
        setBookmarkedIds(new Set((bookmarks || []).map(b => b.id)));
      } catch (err) {
        console.error('Failed to load jobs:', err);
      } finally {
        setLoading(false);
      }
    };
    loadJobs();
  }, [selectedCategory, workMode, employmentType, searchQuery]);

  const handleBookmark = async (e, jobId) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await jobService.toggleBookmark(jobId);
      setBookmarkedIds(prev => {
        const next = new Set(prev);
        if (next.has(jobId)) next.delete(jobId);
        else next.add(jobId);
        return next;
      });
    } catch (err) {
      console.error('Failed to toggle bookmark:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Hero Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-sky-700 to-indigo-900 p-8 sm:p-12 text-white shadow-2xl">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider">
              <Briefcase className="w-3.5 h-3.5" />
              <span>EduAcademy Career Opportunities</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
              Curated Tech Jobs & Internships
            </h1>
            <p className="text-sky-100 text-base sm:text-lg">
              Direct openings with hiring partners who value EduAcademy certified skills, CodeLab problem solving, and verified project blueprints.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link to="/jobs/saved">
                <Button variant="secondary" icon={Bookmark}>
                  Saved Jobs
                </Button>
              </Link>
              <Link to="/jobs/applications">
                <Button variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                  My Applications
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="absolute right-6 bottom-0 opacity-10 pointer-events-none hidden md:block">
            <Building2 className="w-96 h-96 text-white" />
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by job title, company, or required skills (React, Node, Python, SQL)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
              {['all', 'Remote', 'Hybrid', 'On-site'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setWorkMode(mode)}
                  className={`px-3 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
                    workMode === mode
                      ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {mode === 'all' ? 'All Modes' : mode}
                </button>
              ))}

              {['all', 'Full-time', 'Internship'].map((type) => (
                <button
                  key={type}
                  onClick={() => setEmploymentType(type)}
                  className={`px-3 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
                    employmentType === type
                      ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {type === 'all' ? 'All Types' : type}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Jobs List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-36 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-pulse"></div>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
              <Briefcase className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No Job Openings Found</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Try broadening your search or resetting filters to view all active openings.
            </p>
            <Button onClick={() => { setSearchQuery(''); setSelectedCategory('all'); setWorkMode('all'); setEmploymentType('all'); }}>
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="flex items-start gap-4">
                  {/* Company Logo */}
                  <img
                    src={job.company_logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company)}&background=2563eb&color=fff`}
                    alt={job.company}
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-200 dark:border-slate-800 shrink-0"
                  />

                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold text-primary-600 dark:text-primary-400">
                        {job.company}
                      </span>
                      <Badge variant="default" size="sm">
                        {job.work_mode}
                      </Badge>
                      <Badge variant="primary" size="sm">
                        {job.employment_type}
                      </Badge>
                    </div>

                    <Link to={`/jobs/${job.slug}`} className="hover:text-primary-600 transition-colors">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        {job.title}
                      </h3>
                    </Link>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                        <DollarSign className="w-3.5 h-3.5" />
                        {job.salary_range}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {job.experience_level}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {job.skills?.slice(0, 5).map((sk) => (
                        <span key={sk} className="text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-md">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                  <button
                    onClick={(e) => handleBookmark(e, job.id)}
                    className={`p-2.5 rounded-xl border transition-colors ${
                      bookmarkedIds.has(job.id)
                        ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 border-amber-200 dark:border-amber-800'
                        : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>

                  <Link to={`/jobs/${job.slug}`}>
                    <Button variant="primary" size="md">
                      View Details & Apply
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobsHome;
