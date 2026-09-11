import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  FolderGit2, Clock, CheckCircle2, ArrowLeft, ExternalLink, 
  Github, Globe, Layers, Database, Layout, Server, Sparkles, 
  ShieldCheck, HelpCircle, Save 
} from 'lucide-react';
import { projectService } from '../../services/project.service';
import { gamificationService } from '../../services/gamification.service';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const ProjectDetail = () => {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('blueprint');
  
  // Student Progress State
  const [completedSteps, setCompletedSteps] = useState([]);
  const [githubUrl, setGithubUrl] = useState('');
  const [liveDemoUrl, setLiveDemoUrl] = useState('');
  const [savingProgress, setSavingProgress] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const loadProject = async () => {
      try {
        const data = await projectService.getBySlug(slug);
        setProject(data);
        // Load existing student progress if logged in
        const userProjects = await projectService.getUserProjects();
        const existing = userProjects.find(p => p.project_id === data?.id);
        if (existing) {
          setCompletedSteps(existing.completed_steps || []);
          setGithubUrl(existing.github_url || '');
          setLiveDemoUrl(existing.live_demo_url || '');
        }
      } catch (err) {
        console.error('Failed to load project details:', err);
      } finally {
        setLoading(false);
      }
    };
    loadProject();
  }, [slug]);

  const toggleStep = (stepNumber) => {
    setCompletedSteps(prev => 
      prev.includes(stepNumber) 
        ? prev.filter(s => s !== stepNumber) 
        : [...prev, stepNumber]
    );
  };

  const handleSaveProgress = async () => {
    if (!project) return;
    setSavingProgress(true);
    try {
      const totalSteps = project.steps?.length || 1;
      const progressPct = Math.round((completedSteps.length / totalSteps) * 100);
      const isComplete = progressPct === 100;

      await projectService.updateProgress(project.id, {
        completed_steps: completedSteps,
        progress_pct: progressPct,
        github_url: githubUrl,
        live_demo_url: liveDemoUrl,
        status: isComplete ? 'completed' : 'in_progress'
      });

      if (isComplete) {
        await gamificationService.awardXP('project_completed', {
          projectId: project.id,
          projectTitle: project.title
        }).catch(() => {});
      }

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save project progress:', err);
    } finally {
      setSavingProgress(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 max-w-5xl mx-auto space-y-6">
        <div className="h-10 w-48 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse"></div>
        <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-3xl animate-pulse"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16 px-4 text-center">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Project Not Found</h2>
        <Link to="/projects" className="text-primary-600 font-semibold mt-4 inline-block">
          Return to Projects Hub
        </Link>
      </div>
    );
  }

  const totalSteps = project.steps?.length || 0;
  const progressPct = totalSteps > 0 ? Math.round((completedSteps.length / totalSteps) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <Link to="/projects" className="hover:text-primary-600 transition-colors flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> Projects Hub
            </Link>
            <span>/</span>
            <span className="text-slate-800 dark:text-slate-200 font-medium truncate max-w-xs">{project.title}</span>
          </div>

          <Link to="/projects/portfolio">
            <Button variant="outline" size="sm" icon={ExternalLink}>
              View Portfolio
            </Button>
          </Link>
        </div>

        {/* Hero Banner Header */}
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 text-white p-6 sm:p-10 shadow-xl">
          <div className="relative z-10 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={project.difficulty === 'beginner' ? 'success' : project.difficulty === 'intermediate' ? 'accent' : 'danger'}>
                {project.difficulty}
              </Badge>
              <span className="text-xs px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-sm text-slate-300">
                {project.category}
              </span>
              <span className="text-xs flex items-center gap-1 text-slate-300">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                ~{project.estimated_hours} Hours Blueprint
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              {project.title}
            </h1>

            <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
              {project.description}
            </p>

            {/* Tech Stack Badges */}
            <div className="flex flex-wrap gap-2 pt-2">
              {project.technologies?.map((tech) => (
                <span key={tech} className="px-3 py-1 rounded-lg bg-slate-800 text-xs font-mono font-medium text-primary-400 border border-slate-700">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6">
          <button
            onClick={() => setActiveTab('blueprint')}
            className={`pb-3 text-sm font-bold border-b-2 transition-all ${
              activeTab === 'blueprint'
                ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            System Blueprint & Specs
          </button>
          <button
            onClick={() => setActiveTab('steps')}
            className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'steps'
                ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>Step-by-Step Build Guide</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-primary-100 dark:bg-primary-950 text-primary-600">
              {completedSteps.length}/{totalSteps}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('submission')}
            className={`pb-3 text-sm font-bold border-b-2 transition-all ${
              activeTab === 'submission'
                ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Portfolio Showcase & Links
          </button>
        </div>

        {/* TAB 1: Blueprint & Specs */}
        {activeTab === 'blueprint' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Real World Use Case */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  Real-World Use Case & Industry Context
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {project.real_world_use_case || project.description}
                </p>
              </div>

              {/* Core Features */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  Key System Features to Implement
                </h3>
                <ul className="space-y-2.5">
                  {project.features?.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 shrink-0"></span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Technical Specifications */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-primary-500" />
                  Architecture & Specifications
                </h3>

                {project.database_requirements && (
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                      <Database className="w-4 h-4 text-indigo-500" />
                      Database & Data Modeling
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
                      {project.database_requirements}
                    </p>
                  </div>
                )}

                {project.api_requirements && (
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                      <Server className="w-4 h-4 text-emerald-500" />
                      API Endpoints & Architecture
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
                      {project.api_requirements}
                    </p>
                  </div>
                )}

                {project.ui_requirements && (
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                      <Layout className="w-4 h-4 text-purple-500" />
                      Frontend & User Experience
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
                      {project.ui_requirements}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar Prerequisites & Objectives */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Prerequisites
                </h4>
                <div className="space-y-2">
                  {project.prerequisites?.map((prereq, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary-500 shrink-0" />
                      <span>{prereq}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Learning Objectives
                </h4>
                <div className="space-y-2">
                  {project.learning_objectives?.map((obj, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                      <span>{obj}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-primary-600 to-indigo-700 rounded-2xl p-6 text-white shadow-md space-y-3">
                <h4 className="font-bold text-sm">Ready to build?</h4>
                <p className="text-xs text-primary-100 leading-relaxed">
                  Switch to the Step-by-Step Guide tab to check off implementation phases as you build and submit your repo.
                </p>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="w-full"
                  onClick={() => setActiveTab('steps')}
                >
                  Start Build Guide
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Step-by-Step Guide */}
        {activeTab === 'steps' && (
          <div className="space-y-6">
            {/* Progress Bar Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Blueprint Implementation Progress
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {completedSteps.length} of {totalSteps} milestone steps completed ({progressPct}%)
                </p>
              </div>

              <div className="w-full sm:w-64 space-y-1.5">
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-primary-600 h-full transition-all duration-500"
                    style={{ width: `${progressPct}%` }}
                  ></div>
                </div>
              </div>

              <Button
                onClick={handleSaveProgress}
                loading={savingProgress}
                icon={Save}
                size="sm"
              >
                {savedSuccess ? 'Progress Saved!' : 'Save Progress'}
              </Button>
            </div>

            {/* Steps List */}
            <div className="space-y-4">
              {project.steps?.map((step) => {
                const isChecked = completedSteps.includes(step.step_number);
                return (
                  <div
                    key={step.step_number}
                    onClick={() => toggleStep(step.step_number)}
                    className={`cursor-pointer border rounded-2xl p-6 transition-all duration-200 ${
                      isChecked
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/60'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                        isChecked
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}>
                        {isChecked ? <CheckCircle2 className="w-4 h-4" /> : step.step_number}
                      </div>

                      <div className="space-y-1.5 flex-1">
                        <h4 className={`font-bold text-sm ${
                          isChecked ? 'text-emerald-900 dark:text-emerald-300' : 'text-slate-900 dark:text-white'
                        }`}>
                          {step.title}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: Submission & Showcase */}
        {activeTab === 'submission' && (
          <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm space-y-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Submit Your Project to Portfolio
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Link your GitHub repository and live deployment URL to show recruiters and earn your milestone certificate.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                  <Github className="w-4 h-4 text-slate-500" />
                  GitHub Repository URL
                </label>
                <input
                  type="url"
                  placeholder="https://github.com/your-username/my-project"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-slate-500" />
                  Live Demo URL (Vercel / Render / AWS)
                </label>
                <input
                  type="url"
                  placeholder="https://my-live-project.vercel.app"
                  value={liveDemoUrl}
                  onChange={(e) => setLiveDemoUrl(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
              </div>

              <Button
                onClick={handleSaveProgress}
                loading={savingProgress}
                className="w-full"
                size="lg"
              >
                {savedSuccess ? 'Portfolio Updated Successfully!' : 'Save & Publish to Portfolio'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;
