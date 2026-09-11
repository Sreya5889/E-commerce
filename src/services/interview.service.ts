import { api } from '../lib/api';
import fallbackInterviewRaw from '../data/interview.json';

export interface InterviewCategory {
  id: string;
  name: string;
  type: 'technical' | 'hr';
  count: number;
}

export interface InterviewQuestion {
  id: string;
  category_id: string;
  category_name: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'intermediate';
  suggested_answer: string;
  key_points: string[];
  common_mistakes: string[];
  follow_up_questions: string[];
}

export interface InterviewPlan {
  id: string;
  title: string;
  duration_days: number;
  questions_count: number;
  category: string;
}

export const interviewService = {
  async getCategories(): Promise<InterviewCategory[]> {
    try {
      const res = await api.get('/interview/categories');
      if (res.data?.success && Array.isArray(res.data.data)) return res.data.data;
    } catch {}
    return fallbackInterviewRaw.categories as InterviewCategory[];
  },

  async getQuestions(filters?: { category?: string; difficulty?: string; search?: string }): Promise<InterviewQuestion[]> {
    try {
      const res = await api.get('/interview/questions', { params: filters });
      if (res.data?.success && Array.isArray(res.data.data)) return res.data.data;
    } catch {}
    let list = fallbackInterviewRaw.questions as unknown as InterviewQuestion[];
    if (filters?.category && filters.category !== 'all') list = list.filter(q => q.category_id === filters.category);
    if (filters?.difficulty && filters.difficulty !== 'all') list = list.filter(q => q.difficulty === filters.difficulty);
    if (filters?.search) {
      const s = filters.search.toLowerCase();
      list = list.filter(q => q.title.toLowerCase().includes(s) || q.key_points?.some(k => k.toLowerCase().includes(s)));
    }
    return list;
  },

  async getQuestionById(id: string): Promise<InterviewQuestion | null> {
    try {
      const res = await api.get(`/interview/questions/${id}`);
      if (res.data?.success && res.data.data) return res.data.data;
    } catch {}
    const found = (fallbackInterviewRaw.questions as unknown as InterviewQuestion[]).find(q => q.id === id);
    return found || null;
  },

  async getPlans(): Promise<InterviewPlan[]> {
    try {
      const res = await api.get('/interview/plans');
      if (res.data?.success && Array.isArray(res.data.data)) return res.data.data;
    } catch {}
    return fallbackInterviewRaw.plans as InterviewPlan[];
  }
};
