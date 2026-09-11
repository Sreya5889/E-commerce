import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Send, Briefcase, Clock, CheckCircle2, ArrowLeft, 
  Building2, ExternalLink 
} from 'lucide-react';
import { jobService } from '../../services/job.service';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const JobApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadApps = async () => {
      try {
        const data = await jobService.getApplications();
        setApplications(data || []);
      } catch (err) {
        console.error('Failed to load job applications:', err);
      } finally {
        setLoading(false);
      }
    };
    loadApps();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'offered':
        return <Badge variant="success">Offer Extended</Badge>;
      case 'interviewing':
        return <Badge variant="accent">Interviewing</Badge>;
      case 'under_review':
        return <Badge variant="primary">Under Review</Badge>;
      default:
        return <Badge variant="default">Submitted</Badge>;
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
            <span className="text-slate-800 dark:text-slate-200 font-medium">Application Tracker</span>
          </div>

          <Link to="/jobs">
            <Button size="sm">Browse More Jobs</Button>
          </Link>
        </div>

        {/* Hero Title */}
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <Send className="w-8 h-8 text-primary-600" />
            My Job Applications Tracker
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
            Monitor the status of your applications submitted through EduAcademy Easy Apply.
          </p>
        </div>

        {/* Table / List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="h-20 rounded-2xl bg-white dark:bg-slate-900 animate-pulse border border-slate-200 dark:border-slate-800"></div>
            ))}
          </div>
        ) : applications.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
              <Briefcase className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No Applications Submitted</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              When you apply to jobs and internships through EduAcademy, track recruiter responses here.
            </p>
            <Link to="/jobs">
              <Button>Find Opportunities</Button>
            </Link>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 font-semibold">
                  <tr>
                    <th className="py-4 px-6">Role</th>
                    <th className="py-4 px-6">Company</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6">Applied Date</th>
                    <th className="py-4 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">
                        {app.job?.title || 'Software Engineer'}
                      </td>
                      <td className="py-4 px-6">
                        {app.job?.company || 'Partner Company'}
                      </td>
                      <td className="py-4 px-6">
                        {getStatusBadge(app.status)}
                      </td>
                      <td className="py-4 px-6 text-xs text-slate-400">
                        {new Date(app.created_at || Date.now()).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6 text-right">
                        {app.job?.slug && (
                          <Link to={`/jobs/${app.job.slug}`} className="text-xs font-semibold text-primary-600 hover:underline">
                            View Posting
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobApplications;
