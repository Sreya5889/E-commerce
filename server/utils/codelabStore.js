import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.resolve(__dirname, '../data/codelab.json');
const SUBMISSIONS_FILE = path.resolve(__dirname, '../data/codingSubmissions.json');

if (!fs.existsSync(SUBMISSIONS_FILE)) {
  fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify([]), 'utf8');
}

export const codelabStore = {
  getData() {
    try {
      return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    } catch {
      return { languages: [], categories: [], problems: [] };
    }
  },

  getSubmissions() {
    try {
      return JSON.parse(fs.readFileSync(SUBMISSIONS_FILE, 'utf8'));
    } catch {
      return [];
    }
  },

  saveSubmissions(list) {
    fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(list, null, 2), 'utf8');
  },

  getLanguages() {
    return this.getData().languages || [];
  },

  getCategories() {
    return this.getData().categories || [];
  },

  getProblems(filters = {}) {
    let list = this.getData().problems || [];
    if (filters.category && filters.category !== 'all') {
      list = list.filter(p => p.category === filters.category || p.category_name?.toLowerCase().includes(filters.category.toLowerCase()));
    }
    if (filters.difficulty && filters.difficulty !== 'all') {
      list = list.filter(p => p.difficulty === filters.difficulty);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      list = list.filter(p => p.title.toLowerCase().includes(q) || p.tags?.some(t => t.toLowerCase().includes(q)));
    }
    return list;
  },

  getProblemById(id) {
    const list = this.getData().problems || [];
    return list.find(p => p.id === id || p.slug === id || p.aliases?.includes(id)) || null;
  },

  getProblemBySlug(slug) {
    const list = this.getData().problems || [];
    return list.find(p => p.slug === slug || p.id === slug || p.aliases?.includes(slug) || (slug === 'two-sum-dsa' && p.slug === 'two-sum') || (slug === 'two-sum' && p.slug === 'two-sum-dsa')) || null;
  },

  getDailyChallenge() {
    const list = this.getData().problems || [];
    // Consistent problem for current date
    const today = new Date().toISOString().slice(0, 10);
    const hash = today.split('-').reduce((acc, part) => acc + parseInt(part, 10), 0);
    const index = hash % (list.length || 1);
    return {
      challenge_date: today,
      bonus_xp: 30,
      problem: list[index] || list[0]
    };
  },

  addSubmission(subData) {
    const subs = this.getSubmissions();
    const newSub = {
      id: `sub-${crypto.randomUUID()}`,
      user_id: subData.userId || 'guest-user',
      problem_id: subData.problemId,
      problem_title: subData.problemTitle,
      problem_slug: subData.problemSlug,
      language: subData.language,
      code: subData.code,
      status: subData.status,
      runtime_ms: subData.runtimeMs || 0,
      memory_kb: subData.memoryKb || 0,
      test_cases_passed: subData.passedCount || 0,
      total_test_cases: subData.totalCount || 0,
      created_at: new Date().toISOString()
    };
    subs.unshift(newSub);
    this.saveSubmissions(subs);
    return newSub;
  },

  getUserSubmissions(userId) {
    const subs = this.getSubmissions();
    if (!userId) return subs.slice(0, 20);
    return subs.filter(s => s.user_id === userId);
  },

  getLeaderboard(timeframe = 'weekly') {
    return [
      { rank: 1, name: 'Alex Rivera', solved: 48, xp: 2450, accuracy: 96, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' },
      { rank: 2, name: 'Priya Sharma', solved: 44, xp: 2180, accuracy: 92, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
      { rank: 3, name: 'David Chen', solved: 41, xp: 1950, accuracy: 89, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
      { rank: 4, name: 'Rahul Verma', solved: 37, xp: 1720, accuracy: 91, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100' },
      { rank: 5, name: 'Sara Miller', solved: 35, xp: 1600, accuracy: 88, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100' }
    ];
  }
};
