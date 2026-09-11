import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FolderGit2, Search, Filter, Clock, ArrowRight, ExternalLink, 
  Layers, CheckCircle2, Sparkles, Code2, Briefcase, Star 
} from 'lucide-react';
import { projectService } from '../../services/project.service';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const ProjectsHome = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  const categories = [
    { id: 'all', name: 'All Domains' },
    { id: 'full stack', name: 'Full Stack' },
    { id: 'frontend', name: 'Frontend' },
    { id: 'backend', name: 'Backend & Cloud' },
    { id: 'ai', name: 'AI & Data' },
    { id: 'devops', name: 'DevOps & Infra' },
  ];

  const difficulties = [
    { id: 'all', name: 'All Levels' },
    { id: 'beginner', name: 'Beginner' },
    { id: 'intermediate', name: 'Intermediate' },
    { id: 'advanced', name: 'Advanced' },
  ];

  useEffect(() => {
    const loadProjects = async () => {
      setLoading(true);
      try {
        const data = await projectService.getAll({
          category: selectedCategory,
          difficulty: selectedDifficulty,
          search: searchQuery
        });
        setProjects(data || []);
      } catch (err) {
        console.error('Failed to load projects:', err);
      } finally {
        setLoading(false);
      }
    };
    loadProjects();
  }, [selectedCategory, selectedDifficulty, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Hero Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-700 to-indigo-800 p-8 sm:p-12 text-white shadow-2xl">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider">
              <FolderGit2 className="w-3.5 h-3.5" />
              <span>EduAcademy Projects Hub</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
              Real-World Project Blueprints
            </h1>
            <p className="text-emerald-100 text-base sm:text-lg">
              Don't just watch tutorials. Build industry-grade systems from database schemas to CI/CD deployments. Showcase your portfolio directly to hiring partners.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link to="/projects/portfolio">
                <Button variant="secondary" icon={Briefcase}>
                  My Project Portfolio
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="absolute right-6 bottom-0 opacity-10 pointer-events-none hidden md:block">
            <Layers className="w-96 h-96 text-white" />
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search projects by title, stack (e.g. React, PostgreSQL), or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-white"
              />
            </div>

            {/* Difficulty Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
              {difficulties.map((diff) => (
                <button
                  key={diff.id}
                  onClick={() => setSelectedDifficulty(diff.id)}
                  className={`px-3 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
                    selectedDifficulty === diff.id
                      ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {diff.name}
                </button>
              ))}
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100 dark:border-slate-800">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-96 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-pulse"></div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
              <FolderGit2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No Projects Found</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Try adjusting your search criteria or category filter to discover other real-world blueprints.
            </p>
            <Button onClick={() => { setSearchQuery(''); setSelectedCategory('all'); setSelectedDifficulty('all'); }}>
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Thumbnail Banner */}
                  <div className="relative h-44 w-full bg-slate-800 overflow-hidden">
                    <img
                      src={proj.banner_url || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800'}
                      alt={proj.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                    <div className="absolute top-3 left-3 flex gap-2">
                      <Badge variant={proj.difficulty === 'beginner' ? 'success' : proj.difficulty === 'intermediate' ? 'accent' : 'danger'}>
                        {proj.difficulty}
                      </Badge>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                      <span className="font-medium bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm">
                        {proj.category}
                      </span>
                      <span className="flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        ~{proj.estimated_hours}h
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 space-y-3">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary-600 transition-colors line-clamp-1">
                      {proj.title}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {proj.description}
                    </p>

                    {/* Tech Stack Badges */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {proj.technologies?.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono text-[11px]"
                        >
                          {tech}
                        </span>
                      ))}
                      {proj.technologies?.length > 4 && (
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-400 text-[11px]">
                          +{proj.technologies.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="p-5 pt-0 border-t border-slate-100 dark:border-slate-800/80 mt-4">
                  <Link to={`/projects/${proj.slug}`} className="block w-full pt-4">
                    <Button variant="outline" className="w-full justify-between group-hover:bg-primary-600 group-hover:text-white group-hover:border-primary-600 transition-all">
                      <span>View Blueprint</span>
                      <ArrowRight className="w-4 h-4" />
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

export default ProjectsHome;
