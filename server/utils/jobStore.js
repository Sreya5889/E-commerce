import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.resolve(__dirname, '../data/jobs.json');
const BOOKMARKS_FILE = path.resolve(__dirname, '../data/jobBookmarks.json');
const APPLICATIONS_FILE = path.resolve(__dirname, '../data/jobApplications.json');

if (!fs.existsSync(BOOKMARKS_FILE)) fs.writeFileSync(BOOKMARKS_FILE, JSON.stringify([]), 'utf8');
if (!fs.existsSync(APPLICATIONS_FILE)) fs.writeFileSync(APPLICATIONS_FILE, JSON.stringify([]), 'utf8');

export const jobStore = {
  getData() {
    try {
      return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    } catch {
      return { jobs: [] };
    }
  },

  getBookmarks() {
    try { return JSON.parse(fs.readFileSync(BOOKMARKS_FILE, 'utf8')); } catch { return []; }
  },

  saveBookmarks(list) {
    fs.writeFileSync(BOOKMARKS_FILE, JSON.stringify(list, null, 2), 'utf8');
  },

  getApplications() {
    try { return JSON.parse(fs.readFileSync(APPLICATIONS_FILE, 'utf8')); } catch { return []; }
  },

  saveApplications(list) {
    fs.writeFileSync(APPLICATIONS_FILE, JSON.stringify(list, null, 2), 'utf8');
  },

  getAll(filters = {}) {
    let list = this.getData().jobs || [];
    if (filters.category && filters.category !== 'all') {
      list = list.filter(j => j.category.toLowerCase().includes(filters.category.toLowerCase()));
    }
    if (filters.workMode && filters.workMode !== 'all') {
      list = list.filter(j => j.work_mode.toLowerCase() === filters.workMode.toLowerCase());
    }
    if (filters.employmentType && filters.employmentType !== 'all') {
      list = list.filter(j => j.employment_type.toLowerCase() === filters.employmentType.toLowerCase());
    }
    if (filters.search) {
      const s = filters.search.toLowerCase();
      list = list.filter(j => j.title.toLowerCase().includes(s) || j.company.toLowerCase().includes(s) || j.skills?.some(sk => sk.toLowerCase().includes(s)));
    }
    return list;
  },

  getBySlug(slug) {
    const list = this.getData().jobs || [];
    return list.find(j => j.slug === slug || j.id === slug) || null;
  },

  toggleBookmark(userId, jobId) {
    let bms = this.getBookmarks();
    const exists = bms.find(b => b.user_id === userId && b.job_id === jobId);
    if (exists) {
      bms = bms.filter(b => !(b.user_id === userId && b.job_id === jobId));
      this.saveBookmarks(bms);
      return { bookmarked: false };
    } else {
      bms.push({ id: `bm-${Date.now()}`, user_id: userId, job_id: jobId, created_at: new Date().toISOString() });
      this.saveBookmarks(bms);
      return { bookmarked: true };
    }
  },

  getUserBookmarks(userId) {
    const bms = this.getBookmarks().filter(b => b.user_id === userId);
    const all = this.getAll();
    return bms.map(b => all.find(j => j.id === b.job_id)).filter(Boolean);
  },

  applyJob(userId, jobId, notes = '') {
    const apps = this.getApplications();
    const existing = apps.find(a => a.user_id === userId && a.job_id === jobId);
    if (existing) return existing;

    const newApp = {
      id: `app-${Date.now()}`,
      user_id: userId,
      job_id: jobId,
      status: 'applied',
      notes,
      applied_at: new Date().toISOString()
    };
    apps.unshift(newApp);
    this.saveApplications(apps);
    return newApp;
  },

  getUserApplications(userId) {
    const apps = this.getApplications().filter(a => a.user_id === userId);
    const all = this.getAll();
    return apps.map(a => ({
      ...a,
      job: all.find(j => j.id === a.job_id) || null
    }));
  }
};
