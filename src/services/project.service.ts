import { api } from '../lib/api';
import fallbackProjectsRaw from '../data/projects.json';

export interface ProjectStep {
  step_number: number;
  title: string;
  description: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimated_hours: number;
  banner_url: string;
  description: string;
  real_world_use_case: string;
  learning_objectives: string[];
  prerequisites: string[];
  technologies: string[];
  features: string[];
  steps?: ProjectStep[];
  database_requirements?: string;
  api_requirements?: string;
  ui_requirements?: string;
  deployment_requirements?: string;
}

export interface StudentProject {
  id: string;
  user_id: string;
  project_id: string;
  status: 'started' | 'in_progress' | 'completed';
  progress_pct: number;
  completed_steps: number[];
  github_url?: string;
  live_demo_url?: string;
  notes?: string;
  completed_at?: string;
  created_at?: string;
  updated_at?: string;
  project?: Project | null;
}

export const projectService = {
  async getAll(filters?: { category?: string; difficulty?: string; search?: string }): Promise<Project[]> {
    try {
      const res = await api.get('/projects', { params: filters });
      if (res.data?.success && Array.isArray(res.data.data)) return res.data.data;
    } catch {}
    let list = fallbackProjectsRaw.projects as unknown as Project[];
    if (filters?.category && filters.category !== 'all') {
      list = list.filter(p => p.category.toLowerCase().includes(filters.category!.toLowerCase()));
    }
    if (filters?.difficulty && filters.difficulty !== 'all') {
      list = list.filter(p => p.difficulty === filters.difficulty);
    }
    if (filters?.search) {
      const s = filters.search.toLowerCase();
      list = list.filter(p => p.title.toLowerCase().includes(s) || p.description.toLowerCase().includes(s));
    }
    return list;
  },

  async getBySlug(slug: string): Promise<Project | null> {
    try {
      const res = await api.get(`/projects/${slug}`);
      if (res.data?.success && res.data.data) return res.data.data;
    } catch {}
    const found = (fallbackProjectsRaw.projects as unknown as Project[]).find(p => p.slug === slug || p.id === slug);
    return found || null;
  },

  async getUserProjects(): Promise<StudentProject[]> {
    try {
      const res = await api.get('/projects/my/projects');
      if (res.data?.success && Array.isArray(res.data.data)) return res.data.data;
    } catch {}
    return [];
  },

  async updateProgress(projectId: string, payload: Partial<StudentProject>): Promise<StudentProject | null> {
    try {
      const res = await api.patch(`/projects/${projectId}/progress`, payload);
      if (res.data?.success && res.data.data) return res.data.data;
    } catch {}
    return null;
  }
};
