import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bookmark, Briefcase, MapPin, DollarSign, ArrowLeft, 
  ExternalLink, Trash2 
} from 'lucide-react';
import { jobService } from '../../services/job.service';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const SavedJobs = () => {
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBookmarks = async () => {
      try {
        const data = await jobService.getBookmarks();
        setSaved(data || []);
      } catch (err) {
        console.error('Failed to load saved jobs:', err);
      } finally {
        setLoading(false);
      }
    };
    loadBookmarks();
  }, []);

  const handleRemove = async (id) => {
    try {
      await jobService.toggleBookmark(id);
      setSaved(prev => prev.filter(j => j.id !== id));
    } catch (err) {
      console.error('Failed to remove bookmark:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <Link to="/jobs" className="hover:text-primary-600 transition-colors flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> Tech Jobs
            </Link>
            <span>/</span>
            <span className="text-slate-800 dark:text-slate-200 font-medium">Saved Bookmarks</span>
          </div>

          <Link to="/jobs">
            <Button size="sm">Browse More Jobs</Button>
          </Link>
        </div>

        {/* Hero Title */}
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <Bookmark className="w-8 h-8 text-primary-600" />
            Bookmarked Opportunities
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
            Keep track of open positions and internships you plan to apply to.
          </p>
        </div>

        {/* List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="h-32 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-pulse"></div>
            ))}
          </div>
        ) : saved.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
              <Bookmark className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No Saved Jobs Yet</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Click the bookmark ribbon on any job listing to save it here for later.
            </p>
            <Link to="/jobs">
              <Button>Explore Jobs</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {saved.map((job) => (
              <div
                key={job.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-primary-600">{job.company}</span>
                    <Badge variant="default" size="sm">{job.work_mode}</Badge>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {job.title}
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span>{job.location}</span>
                    <span className="text-emerald-600 font-semibold">{job.salary_range}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleRemove(job.id)}
                    className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <Link to={`/jobs/${job.slug}`}>
                    <Button variant="primary" size="sm">
                      Apply Now
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

export default SavedJobs;
