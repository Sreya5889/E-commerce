import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, FolderGit2, Github, Globe, ExternalLink, 
  ArrowLeft, CheckCircle2, Clock, Sparkles 
} from 'lucide-react';
import { projectService } from '../../services/project.service';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const ProjectPortfolio = () => {
  const [userProjects, setUserProjects] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [ups, projs] = await Promise.all([
          projectService.getUserProjects(),
          projectService.getAll()
        ]);
        setUserProjects(ups || []);
        setAllProjects(projs || []);
      } catch (err) {
        console.error('Failed to load portfolio:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

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
            <span className="text-slate-800 dark:text-slate-200 font-medium">My Portfolio Showcase</span>
          </div>

          <Link to="/projects">
            <Button size="sm" icon={FolderGit2}>
              Browse Blueprints
            </Button>
          </Link>
        </div>

        {/* Hero Title */}
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <Briefcase className="w-8 h-8 text-primary-600" />
            Verified Project Portfolio
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
            Showcase your completed engineering builds, live demos, and GitHub source code to employers.
          </p>
        </div>

        {/* Portfolio Cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map(i => (
              <div key={i} className="h-64 rounded-2xl bg-white dark:bg-slate-900 animate-pulse border border-slate-200 dark:border-slate-800"></div>
            ))}
          </div>
        ) : userProjects.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
              <FolderGit2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No Projects in Portfolio Yet</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Pick an industry-grade blueprint from the Projects Hub, follow the implementation milestones, and link your code.
            </p>
            <Link to="/projects">
              <Button>Explore Blueprints</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {userProjects.map((up) => {
              const proj = allProjects.find(p => p.id === up.project_id) || up.project;
              return (
                <div
                  key={up.id || up.project_id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant={up.status === 'completed' ? 'success' : 'accent'}>
                        {up.status === 'completed' ? 'Completed' : 'In Progress'}
                      </Badge>
                      <span className="text-xs font-semibold text-slate-400">
                        {up.progress_pct ?? 0}% Complete
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {proj?.title || 'Engineered System'}
                    </h3>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                      {proj?.description}
                    </p>

                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full transition-all duration-300"
                        style={{ width: `${up.progress_pct ?? 0}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      {up.github_url && (
                        <a
                          href={up.github_url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white transition-colors"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                      {up.live_demo_url && (
                        <a
                          href={up.live_demo_url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-primary-600 transition-colors"
                        >
                          <Globe className="w-4 h-4" />
                        </a>
                      )}
                    </div>

                    {proj?.slug && (
                      <Link to={`/projects/${proj.slug}`}>
                        <Button variant="outline" size="sm">
                          Continue Blueprint
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectPortfolio;
