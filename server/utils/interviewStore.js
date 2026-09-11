import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.resolve(__dirname, '../data/interview.json');

export const interviewStore = {
  getData() {
    try {
      return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    } catch {
      return { categories: [], questions: [], plans: [] };
    }
  },

  getCategories() {
    return this.getData().categories || [];
  },

  getQuestions(filters = {}) {
    let list = this.getData().questions || [];
    if (filters.category && filters.category !== 'all') {
      list = list.filter(q => q.category_id === filters.category);
    }
    if (filters.difficulty && filters.difficulty !== 'all') {
      list = list.filter(q => q.difficulty === filters.difficulty);
    }
    if (filters.search) {
      const s = filters.search.toLowerCase();
      list = list.filter(q => q.title.toLowerCase().includes(s) || q.key_points?.some(k => k.toLowerCase().includes(s)));
    }
    return list;
  },

  getQuestionById(id) {
    const list = this.getData().questions || [];
    return list.find(q => q.id === id) || null;
  },

  getPlans() {
    return this.getData().plans || [];
  }
};
