import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.resolve(__dirname, '../data/projects.json');
const STUDENT_PROJECTS_FILE = path.resolve(__dirname, '../data/studentProjects.json');

if (!fs.existsSync(STUDENT_PROJECTS_FILE)) {
  fs.writeFileSync(STUDENT_PROJECTS_FILE, JSON.stringify([]), 'utf8');
}

export const projectStore = {
  getData() {
    try {
      return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    } catch {
      return { categories: [], projects: [] };
    }
  },

  getStudentProjects() {
    try {
      return JSON.parse(fs.readFileSync(STUDENT_PROJECTS_FILE, 'utf8'));
    } catch {
      return [];
    }
  },

  saveStudentProjects(list) {
    fs.writeFileSync(STUDENT_PROJECTS_FILE, JSON.stringify(list, null, 2), 'utf8');
  },

  getAll(filters = {}) {
    let list = this.getData().projects || [];
    if (filters.category && filters.category !== 'all') {
      const c = filters.category.toLowerCase();
      list = list.filter(p => p.category.toLowerCase().includes(c));
    }
    if (filters.difficulty && filters.difficulty !== 'all') {
      list = list.filter(p => p.difficulty === filters.difficulty);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(p => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.technologies?.some(t => t.toLowerCase().includes(q)));
    }
    return list;
  },

  findBySlug(slug) {
    const list = this.getData().projects || [];
    return list.find(p => p.slug === slug || p.id === slug) || null;
  },

  getUserProjects(userId) {
    const list = this.getStudentProjects();
    const all = this.getAll();
    return list.filter(p => p.user_id === userId).map(p => ({
      ...p,
      project: all.find(item => item.id === p.project_id) || null
    }));
  },

  updateUserProject(userId, projectId, payload) {
    const list = this.getStudentProjects();
    const idx = list.findIndex(p => p.user_id === userId && p.project_id === projectId);
    const now = new Date().toISOString();

    if (idx >= 0) {
      list[idx] = {
        ...list[idx],
        ...payload,
        updated_at: now
      };
      if (payload.status === 'completed' && !list[idx].completed_at) {
        list[idx].completed_at = now;
      }
      this.saveStudentProjects(list);
      return list[idx];
    } else {
      const newItem = {
        id: `sp-${Date.now()}`,
        user_id: userId,
        project_id: projectId,
        status: payload.status || 'started',
        progress_pct: payload.progress_pct || 10,
        completed_steps: payload.completed_steps || [],
        github_url: payload.github_url || null,
        live_demo_url: payload.live_demo_url || null,
        created_at: now,
        updated_at: now
      };
      list.unshift(newItem);
      this.saveStudentProjects(list);
      return newItem;
    }
  }
};
