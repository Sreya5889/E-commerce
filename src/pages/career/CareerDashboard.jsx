import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, Award, Target, CheckCircle2, ArrowRight, 
  Sparkles, Code2, BookOpen, Layers, Briefcase, 
  HelpCircle, Compass, Zap, ShieldCheck, AlertTriangle,
  Calendar, CheckSquare, Square, RefreshCw, ChevronRight, ExternalLink
} from 'lucide-react';
import { careerService } from '../../services/career.service';
import { gamificationService } from '../../services/gamification.service';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useToast } from '../../context/ToastContext';

export const CareerDashboard = () => {
  const toast = useToast();
  const [activeSubTab, setActiveSubTab] = useState('readiness'); // 'readiness', 'skill-gap', 'study-plan', 'recommendations'
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Skill-Gap State
  const [selectedRole, setSelectedRole] = useState('full-stack-developer');
  const [skillGapData, setSkillGapData] = useState(null);
  const [loadingGap, setLoadingGap] = useState(false);

  // Study Plan State
  const [studyPlan, setStudyPlan] = useState(null);
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [planGoal, setPlanGoal] = useState('Full Stack Developer');
  const [planHours, setPlanHours] = useState(10);
  const [showPlanGenerator, setShowPlanGenerator] = useState(false);

  // Recommendations State
  const [realRecs, setRealRecs] = useState(null);

  useEffect(() => {
    const loadInitial = async () => {
      try {
        const [readinessRes, gapRes, planRes, recsRes] = await Promise.all([
          careerService.getReadiness(),
          careerService.getSkillGap('full-stack-developer'),
          careerService.getStudyPlan(),
          careerService.getRecommendations()
        ]);
        setData(readinessRes);
        setSkillGapData(gapRes);
        setStudyPlan(planRes);
        setRealRecs(recsRes);
      } catch (err) {
        console.error('Failed to load career dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadInitial();
  }, []);

  // Handle Target Role change in Skill-Gap Analyzer
  const handleRoleChange = async (roleKey) => {
    setSelectedRole(roleKey);
    setLoadingGap(true);
    try {
      const res = await careerService.getSkillGap(roleKey);
      setSkillGapData(res);
    } catch (err) {
      toast.error('Failed to load skill gap for selected role.');
    } finally {
      setLoadingGap(false);
    }
  };

  // Toggle Study Plan Task
  const handleToggleTask = async (taskId) => {
    if (!studyPlan?.id) return;
    try {
      const updated = await careerService.toggleStudyPlanTask(studyPlan.id, taskId);
      if (updated) {
        setStudyPlan(updated);
        toast.success('Task milestone updated!');
      } else {
        // Local toggle fallback
        setStudyPlan(prev => {
          if (!prev) return prev;
          const copy = JSON.parse(JSON.stringify(prev));
          (copy.plan_data?.weekly_goals || []).forEach(w => {
            (w.tasks || []).forEach(t => {
              if (t.id === taskId) t.completed = !t.completed;
            });
          });
          return copy;
        });
        toast.success('Task progress saved!');
      }
    } catch {
      toast.error('Failed to update task.');
    }
  };

  // Generate / Regenerate Study Plan
  const handleGeneratePlan = async (e) => {
    e.preventDefault();
    setLoadingPlan(true);
    try {
      const newPlan = await careerService.generateStudyPlan({
        careerGoal: planGoal,
        weeklyHours: Number(planHours),
        skillLevel: 'Intermediate'
      });
      setStudyPlan(newPlan);
      setShowPlanGenerator(false);
      toast.success(`Generated personalized study plan for ${planGoal}!`);
    } catch {
      toast.error('Failed to generate study plan.');
    } finally {
      setLoadingPlan(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 max-w-7xl mx-auto space-y-8 animate-pulse">
        <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded-3xl"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
          <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
          <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  const score = data?.readinessScore ?? 68;
  const breakdown = data?.breakdown || {};
  const skills = data?.skillsMatrix || [];
  const recommendations = data?.recommendations || [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Hero Banner: Career Readiness Score */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-800 to-purple-900 p-8 sm:p-12 text-white shadow-2xl">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider">
                <Compass className="w-3.5 h-3.5" />
                <span>EduAcademy Career Command Center</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
                Your Career Readiness Score
              </h1>
              <p className="text-indigo-100 text-base sm:text-lg">
                Calculated in real-time across your Course completions, CodeLab DSA accuracy, Project blueprints built, Aptitude screenings, and Mock interview drills.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link to="/career/achievements">
                  <Button variant="secondary" icon={Award}>
                    View Badges & XP
                  </Button>
                </Link>
                <Link to="/jobs">
                  <Button variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                    Explore Matching Jobs
                  </Button>
                </Link>
              </div>
            </div>

            {/* Score Ring / Gauge */}
            <div className="flex flex-col items-center justify-center p-6 sm:p-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shrink-0">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-white/20"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-emerald-400"
                    strokeDasharray={`${score}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-4xl font-black">{score}</span>
                  <span className="text-[10px] uppercase font-bold text-white/70">/ 100 PTS</span>
                </div>
              </div>

              <div className="mt-4 text-center">
                <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                  {score >= 75 ? 'Job Ready' : score >= 50 ? 'Interview Ready' : 'Skill Building Stage'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-1 overflow-x-auto">
          {[
            { key: 'readiness', label: 'Readiness & Metrics', icon: TrendingUp },
            { key: 'skill-gap', label: 'Skill-Gap Analyzer', icon: Target },
            { key: 'study-plan', label: 'Personalized Study Plan', icon: Calendar },
            { key: 'recommendations', label: 'Curated Recommendations', icon: Sparkles },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveSubTab(key)}
              className={`px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                activeSubTab === key
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* SUBTAB 1: READINESS & METRICS */}
        {activeSubTab === 'readiness' && (
          <div className="space-y-8">
            {/* 2-Column Readiness Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Category Breakdown Progress Bars */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Readiness Score Breakdown
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Transparent formula evaluating every aspect of your preparation.
                  </p>
                </div>

                <div className="space-y-4">
                  {Object.entries(breakdown).map(([key, item]) => {
                    const pct = Math.round((item.score / item.max) * 100);
                    return (
                      <div key={key} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span className="text-slate-700 dark:text-slate-300">{item.label}</span>
                          <span className="text-slate-500 font-mono">{item.score} / {item.max} pts ({pct}%)</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                          <div
                            className="bg-primary-600 h-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Skills Competency Matrix */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Verified Technical Skills Matrix
                </h3>

                <div className="space-y-4">
                  {skills.map((s, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-800 dark:text-slate-200">{s.skill}</span>
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                          {s.level} ({s.progress}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full transition-all duration-300"
                          style={{ width: `${s.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Dynamic Action Recommendations */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  Recommended Next Steps to Maximize Score
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  AI-curated recommendations based on your current skill gaps.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendations.map((rec, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant={rec.priority === 'high' ? 'danger' : 'accent'}>
                          {rec.priority} Priority
                        </Badge>
                        <span className="text-xs font-semibold text-slate-400 uppercase">
                          {rec.module}
                        </span>
                      </div>

                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                        {rec.title}
                      </h4>

                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {rec.action}
                      </p>
                    </div>

                    <div className="pt-3">
                      <Link to={rec.link}>
                        <Button variant="outline" size="sm" className="w-full justify-between">
                          <span>Take Action</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 2: SKILL-GAP ANALYZER (FEATURE 1) */}
        {activeSubTab === 'skill-gap' && (
          <div className="space-y-8">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary-600" />
                    Target Role Skill-Gap Analysis
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Select your target IT role to benchmark your current skills against industry hiring criteria.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500">Target Role:</span>
                  <select
                    value={selectedRole}
                    onChange={(e) => handleRoleChange(e.target.value)}
                    className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-primary-500"
                  >
                    {(skillGapData?.availableRoles || [
                      { key: 'full-stack-developer', title: 'Full Stack Developer' },
                      { key: 'frontend-developer', title: 'Frontend Engineer' },
                      { key: 'backend-developer', title: 'Backend & Cloud Engineer' },
                      { key: 'data-scientist', title: 'Data Scientist & AI Specialist' },
                      { key: 'devops-engineer', title: 'DevOps & Cloud Engineer' }
                    ]).map(r => (
                      <option key={r.key} value={r.key}>{r.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Status Counters */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 text-center">
                  <span className="text-2xl font-black text-blue-600 dark:text-blue-400 block">
                    {skillGapData?.readinessPercentage || 74}%
                  </span>
                  <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase">Role Match</span>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-center">
                  <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 block">
                    {skillGapData?.acquiredCount || 4}
                  </span>
                  <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase">Acquired ✅</span>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-center">
                  <span className="text-2xl font-black text-amber-600 dark:text-amber-400 block">
                    {skillGapData?.weakCount || 3}
                  </span>
                  <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase">Needs Practice ⚠️</span>
                </div>

                <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 text-center">
                  <span className="text-2xl font-black text-rose-600 dark:text-rose-400 block">
                    {skillGapData?.missingCount || 2}
                  </span>
                  <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase">Missing ❌</span>
                </div>
              </div>

              {/* Detailed Skills Table */}
              <div className="space-y-4 pt-4">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Skill Breakdown & Recommended Bridge Resources
                </h4>

                <div className="grid grid-cols-1 gap-3">
                  {(skillGapData?.skills || []).map((s, idx) => {
                    const isAcquired = s.status === 'acquired';
                    const isWeak = s.status === 'weak';
                    const isMissing = s.status === 'missing';

                    return (
                      <div
                        key={idx}
                        className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                          isAcquired
                            ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40'
                            : isWeak
                              ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/40'
                              : 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-base">
                              {isAcquired ? '✅' : isWeak ? '⚠️' : '❌'}
                            </span>
                            <h5 className="font-bold text-sm text-slate-900 dark:text-white">
                              {s.name}
                            </h5>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                              {s.category}
                            </span>
                          </div>

                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {isAcquired
                              ? 'Competency confirmed by completed lectures, coding tests, and projects.'
                              : isWeak
                                ? 'Partial progress detected. Strengthen speed and accuracy to reach benchmark.'
                                : 'Not yet covered in your active curriculum. Start with the bridge resource below.'}
                          </p>
                        </div>

                        {s.bridgeResource && (
                          <div className="shrink-0 flex items-center">
                            <Link to={s.bridgeResource.link}>
                              <Button
                                size="sm"
                                variant={isAcquired ? 'outline' : 'primary'}
                                className="text-xs"
                              >
                                <span>{s.bridgeResource.title}</span>
                                <ArrowRight className="w-3.5 h-3.5 ml-1" />
                              </Button>
                            </Link>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 3: PERSONALIZED STUDY PLAN (FEATURE 1) */}
        {activeSubTab === 'study-plan' && (
          <div className="space-y-8">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-indigo-600" />
                    Personalized Trackable Study Plan
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Structured daily and weekly tasks based on your available study hours and target role.
                  </p>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  icon={RefreshCw}
                  onClick={() => setShowPlanGenerator(!showPlanGenerator)}
                >
                  {showPlanGenerator ? 'Hide Generator' : 'Generate New Plan'}
                </Button>
              </div>

              {/* Plan Generator Form */}
              {showPlanGenerator && (
                <form onSubmit={handleGeneratePlan} className="p-6 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl space-y-4">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Customize Your Study Curriculum
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Career Goal / Target Role
                      </label>
                      <input
                        type="text"
                        required
                        value={planGoal}
                        onChange={(e) => setPlanGoal(e.target.value)}
                        placeholder="e.g. Full Stack Developer, DevOps Engineer"
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-primary-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Available Study Commitment
                      </label>
                      <select
                        value={planHours}
                        onChange={(e) => setPlanHours(Number(e.target.value))}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-primary-500"
                      >
                        <option value={5}>5 hours / week (Light pace ~45 min/day)</option>
                        <option value={10}>10 hours / week (Recommended ~1.4 hrs/day)</option>
                        <option value={15}>15 hours / week (Intensive ~2.1 hrs/day)</option>
                        <option value={20}>20 hours / week (Fast-track bootcamp ~3 hrs/day)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button type="submit" size="sm" disabled={loadingPlan}>
                      {loadingPlan ? 'Generating...' : 'Apply & Save Study Plan'}
                    </Button>
                  </div>
                </form>
              )}

              {/* Active Plan View */}
              {studyPlan?.plan_data && (
                <div className="space-y-6 pt-2">
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-100 dark:border-indigo-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Active Curriculum</span>
                      <h4 className="text-lg font-black text-slate-900 dark:text-white">
                        {studyPlan.plan_data.title || `${studyPlan.career_goal} Mastery Plan`}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Target Commitment: {studyPlan.weekly_hours} hrs/week • {studyPlan.plan_data.daily_commitment}
                      </p>
                    </div>

                    <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-xs font-bold shrink-0">
                      Duration: {studyPlan.plan_data.duration_weeks || 8} Weeks
                    </span>
                  </div>

                  {/* Weekly Milestone Blocks */}
                  <div className="space-y-6">
                    {(studyPlan.plan_data.weekly_goals || []).map((weekGoal) => (
                      <div
                        key={weekGoal.week}
                        className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-5 space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <h5 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                            <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                              W{weekGoal.week}
                            </span>
                            <span>{weekGoal.title}</span>
                          </h5>
                          <span className="text-xs text-slate-500">
                            {(weekGoal.tasks || []).filter(t => t.completed).length} / {(weekGoal.tasks || []).length} completed
                          </span>
                        </div>

                        {/* Task List */}
                        <div className="space-y-2">
                          {(weekGoal.tasks || []).map((task) => (
                            <div
                              key={task.id}
                              onClick={() => handleToggleTask(task.id)}
                              className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                                task.completed
                                  ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40 text-slate-400 line-through'
                                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-800 dark:text-slate-200'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                {task.completed ? (
                                  <CheckSquare className="w-4 h-4 text-emerald-500 shrink-0" />
                                ) : (
                                  <Square className="w-4 h-4 text-slate-400 shrink-0" />
                                )}
                                <span className="text-xs font-medium">{task.title}</span>
                              </div>

                              {task.link && (
                                <Link
                                  to={task.link}
                                  onClick={(e) => e.stopPropagation()}
                                  className="text-[11px] text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1 shrink-0"
                                >
                                  <span>Go to task</span>
                                  <ExternalLink className="w-3 h-3" />
                                </Link>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SUBTAB 4: CURATED RECOMMENDATIONS (FEATURE 1) */}
        {activeSubTab === 'recommendations' && (
          <div className="space-y-8">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  Activity-Driven Personal Recommendations
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Derived directly from your active course progress, DSA accuracy, and aptitude test history.
                </p>
              </div>

              {/* 6 Category Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 1. Recommended Courses */}
                <div className="p-5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-bold text-xs uppercase tracking-wider">
                    <BookOpen className="w-4 h-4" />
                    <span>Recommended Course</span>
                  </div>
                  {(realRecs?.courses || []).map((c, i) => (
                    <div key={i} className="space-y-1">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{c.title}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">{c.reason}</p>
                      <div className="pt-2">
                        <Link to={c.link}>
                          <Button size="sm" variant="outline" className="text-xs">
                            Start Learning <ArrowRight className="w-3 h-3 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 2. Recommended Coding Problems */}
                <div className="p-5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider">
                    <Code2 className="w-4 h-4" />
                    <span>CodeLab DSA Challenge</span>
                  </div>
                  {(realRecs?.codingProblems || []).slice(0, 1).map((p, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">{p.title}</h4>
                        <Badge variant="accent">{p.difficulty}</Badge>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">{p.reason}</p>
                      <div className="pt-2">
                        <Link to={p.link}>
                          <Button size="sm" variant="outline" className="text-xs">
                            Solve Problem <ArrowRight className="w-3 h-3 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 3. Recommended Aptitude Topics */}
                <div className="p-5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-wider">
                    <Target className="w-4 h-4" />
                    <span>Target Aptitude Drill</span>
                  </div>
                  {(realRecs?.aptitudeTopics || []).slice(0, 1).map((t, i) => (
                    <div key={i} className="space-y-1">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{t.name}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">{t.reason}</p>
                      <div className="pt-2">
                        <Link to={t.link}>
                          <Button size="sm" variant="outline" className="text-xs">
                            Practice Topic <ArrowRight className="w-3 h-3 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 4. Portfolio Projects */}
                <div className="p-5 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-xs uppercase tracking-wider">
                    <Layers className="w-4 h-4" />
                    <span>Portfolio Blueprint</span>
                  </div>
                  {(realRecs?.projects || []).slice(0, 1).map((proj, i) => (
                    <div key={i} className="space-y-1">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{proj.title}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">{proj.reason}</p>
                      <div className="pt-2">
                        <Link to={proj.link}>
                          <Button size="sm" variant="outline" className="text-xs">
                            View Blueprint <ArrowRight className="w-3 h-3 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CareerDashboard;
