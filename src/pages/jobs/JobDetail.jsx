import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Briefcase, MapPin, DollarSign, Clock, Building2, 
  CheckCircle2, ArrowLeft, Bookmark, ExternalLink, Send, 
  Sparkles, ShieldCheck 
} from 'lucide-react';
import { jobService } from '../../services/job.service';
import { gamificationService } from '../../services/gamification.service';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const JobDetail = () => {
  const { slug } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [applying, setApplying] = useState(false);
  const [appliedSuccess, setAppliedSuccess] = useState(false);
  const [notes, setNotes] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const loadJob = async () => {
      try {
        const j = await jobService.getBySlug(slug);
        setJob(j);
        const bookmarks = await jobService.getBookmarks().catch(() => []);
        if (bookmarks.some(b => b.id === j?.id)) setIsBookmarked(true);
      } catch (err) {
        console.error('Failed to load job details:', err);
      } finally {
        setLoading(false);
      }
    };
    loadJob();
  }, [slug]);

  const handleToggleBookmark = async () => {
    if (!job) return;
    try {
      await jobService.toggleBookmark(job.id);
      setIsBookmarked(!isBookmarked);
    } catch (err) {
      console.error('Failed to toggle bookmark:', err);
    }
  };

  const handleApply = async () => {
    if (!job) return;
    setApplying(true);
    try {
      await jobService.apply(job.id, notes);
      await gamificationService.awardXP('job_applied', { jobId: job.id }).catch(() => {});
      setAppliedSuccess(true);
      setTimeout(() => {
        setShowModal(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to apply:', err);
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 max-w-5xl mx-auto space-y-6 animate-pulse">
        <div className="h-40 bg-slate-200 dark:bg-slate-800 rounded-3xl"></div>
        <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-3xl"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16 px-4 text-center">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Job Not Found</h2>
        <Link to="/jobs" className="text-primary-600 font-semibold mt-4 inline-block">
          Return to Jobs Board
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <Link to="/jobs" className="hover:text-primary-600 transition-colors flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> Tech Jobs
            </Link>
            <span>/</span>
            <span className="text-slate-800 dark:text-slate-200 font-medium truncate max-w-xs">{job.title}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleBookmark}
              className={`p-2 rounded-xl border transition-colors ${
                isBookmarked
                  ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 border-amber-200 dark:border-amber-800'
                  : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600'
              }`}
            >
              <Bookmark className="w-4 h-4" />
            </button>
            <Button onClick={() => setShowModal(true)} icon={Send}>
              Easy Apply with EduAcademy
            </Button>
          </div>
        </div>

        {/* Job Header Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-start gap-4">
            <img
              src={job.company_logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company)}&background=2563eb&color=fff`}
              alt={job.company}
              className="w-16 h-16 rounded-2xl object-cover border border-slate-200 dark:border-slate-800"
            />
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {job.title}
              </h1>
              <p className="text-base font-semibold text-primary-600 dark:text-primary-400">
                {job.company}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div>
              <span className="text-slate-400 block mb-0.5">Location & Mode</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {job.location} ({job.work_mode})
              </span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Compensation</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5" />
                {job.salary_range}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Employment Type</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {job.employment_type}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Experience Level</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {job.experience_level}
              </span>
            </div>
          </div>
        </div>

        {/* Job Body & Requirements */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                About the Role
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {job.description}
              </p>
            </div>

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Qualifications & Requirements
                </h3>
                <ul className="space-y-2.5">
                  {job.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-primary-500 mt-1 shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Benefits */}
            {job.benefits && job.benefits.length > 0 && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Perks & Benefits
                </h3>
                <ul className="space-y-2.5">
                  {job.benefits.map((b, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                      <Sparkles className="w-4 h-4 text-amber-500 mt-1 shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar Skills & CTA */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Required Skills
              </h4>
              <div className="flex flex-wrap gap-2">
                {job.skills?.map((sk) => (
                  <span key={sk} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 rounded-xl">
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary-600 to-indigo-700 rounded-3xl p-6 text-white shadow-lg space-y-4">
              <h4 className="font-bold text-base">Ready to apply?</h4>
              <p className="text-xs text-primary-100 leading-relaxed">
                Submit your profile and verified EduAcademy credentials directly to {job.company}'s recruiting team.
              </p>
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => setShowModal(true)}
              >
                1-Click EduAcademy Apply
              </Button>
            </div>
          </div>
        </div>

        {/* Application Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Apply for {job.title}
                </h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
              </div>

              {appliedSuccess ? (
                <div className="text-center py-6 space-y-3">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">Application Submitted!</h4>
                  <p className="text-xs text-slate-500">Your profile and Career Readiness Score were shared with {job.company}.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                    <span className="font-bold block text-slate-900 dark:text-white">Profile Sharing Preview</span>
                    <span>Your EduAcademy Course Certificates, CodeLab rating, and Project Portfolio will be submitted.</span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Cover Note / Why you're a great fit (Optional)
                    </label>
                    <textarea
                      rows={4}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Hi recruiting team, I recently completed the Full Stack path and CodeLab challenges..."
                      className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button variant="outline" className="flex-1" onClick={() => setShowModal(false)}>
                      Cancel
                    </Button>
                    <Button loading={applying} className="flex-1" onClick={handleApply}>
                      Confirm & Submit
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetail;
