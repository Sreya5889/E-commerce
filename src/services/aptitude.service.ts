import { api } from '../lib/api';
import fallbackAptitudeData from '../data/aptitude.json';

export interface AptitudeOption {
  key: string;
  text: string;
}

export interface AptitudeQuestion {
  id: string;
  category_id: string;
  topic_id: string;
  topic_name?: string;
  category_name?: string;
  question_text: string;
  difficulty: 'easy' | 'medium' | 'hard';
  options: AptitudeOption[];
  correct_option?: string;
  explanation?: string;
  tags?: string[];
  image_url?: string;
}

export interface AptitudeCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  display_order: number;
  topic_count?: number;
  question_count?: number;
  topics?: AptitudeTopic[];
}

export interface AptitudeTopic {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  display_order: number;
  question_count?: number;
}

export interface AptitudeMockTest {
  id: string;
  title: string;
  slug: string;
  description: string;
  category_id?: string | null;
  difficulty: string;
  duration_minutes: number;
  question_count: number;
  questions?: AptitudeQuestion[];
}

export interface AptitudeDailyChallenge {
  id: string;
  challenge_date: string;
  title: string;
  duration_minutes: number;
  questions: AptitudeQuestion[];
  question_count: number;
}

export interface AptitudeAchievement {
  id: string;
  name: string;
  description: string;
  badge_icon: string;
  points: number;
  unlocked?: boolean;
  unlocked_at?: string | null;
}

export interface AttemptAnswerInput {
  questionId: string;
  selectedOption: string | null;
  timeSpentSeconds?: number;
}

export interface AptitudeAttempt {
  id: string;
  student_id: string;
  mode: 'practice' | 'timed' | 'mock_test' | 'daily_challenge';
  test_id?: string | null;
  category_id?: string | null;
  topic_id?: string | null;
  total_questions: number;
  duration_minutes?: number;
  score: number;
  accuracy: number;
  correct_count: number;
  incorrect_count: number;
  unanswered_count: number;
  time_spent_seconds: number;
  average_time_seconds: number;
  status: string;
  answers?: Array<{
    question_id: string;
    question_text?: string;
    options?: AptitudeOption[];
    difficulty?: string;
    selected_option: string | null;
    correct_option: string;
    is_correct: boolean;
    explanation: string;
    time_spent_seconds: number;
    topic_id?: string;
    category_id?: string;
  }>;
  topic_performance?: Array<{
    topic_id: string;
    topic_name: string;
    total: number;
    correct: number;
    accuracy: number;
  }>;
  weak_topics?: Array<{
    topic_id: string;
    topic_name: string;
    accuracy: number;
    correct?: number;
    total?: number;
    recommendation: string;
  }>;
  created_at?: string;
  completed_at?: string | null;
}

export interface AptitudeAnalytics {
  total_attempts: number;
  total_questions_solved: number;
  total_correct: number;
  overall_accuracy: number;
  total_time_spent_seconds: number;
  average_time_per_question: number;
  weak_topics: Array<{
    topic_id: string;
    topic_name: string;
    accuracy: number;
    total: number;
    correct: number;
  }>;
  strong_topics: Array<{
    topic_id: string;
    topic_name: string;
    accuracy: number;
    total: number;
    correct: number;
  }>;
  category_mastery: Array<{
    id: string;
    name: string;
    slug: string;
    icon: string;
    total_attempted: number;
    accuracy: number;
  }>;
  trend: Array<{
    attempt_number: number;
    date: string;
    accuracy: number;
    score: number;
    mode: string;
  }>;
}

export const aptitudeService = {
  // Categories
  async getCategories(): Promise<AptitudeCategory[]> {
    try {
      const res = await api.get('/aptitude/categories');
      if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
        return res.data.data;
      }
    } catch (err) {
      console.warn('[AptitudeService] API getCategories failed, using fallback:', err);
    }
    return (fallbackAptitudeData.categories as any) || [];
  },

  async getCategoryBySlug(slug: string): Promise<AptitudeCategory | null> {
    try {
      const res = await api.get(`/aptitude/categories/${slug}`);
      if (res.data?.success && res.data.data) {
        return res.data.data;
      }
    } catch (err) {
      console.warn('[AptitudeService] API getCategoryBySlug failed, using fallback:', err);
    }
    const cat = fallbackAptitudeData.categories?.find((c: any) => c.slug === slug || c.id === slug);
    return (cat as any) || null;
  },

  // Topics
  async getTopics(categoryId?: string): Promise<AptitudeTopic[]> {
    try {
      const params: Record<string, any> = {};
      if (categoryId) params.category_id = categoryId;
      const res = await api.get('/aptitude/topics', { params });
      if (res.data?.success && Array.isArray(res.data.data)) {
        return res.data.data;
      }
    } catch (err) {
      console.warn('[AptitudeService] API getTopics failed, using fallback:', err);
    }
    let list = fallbackAptitudeData.topics || [];
    if (categoryId) list = list.filter((t: any) => t.category_id === categoryId);
    return list as any;
  },

  // Questions
  async getQuestions(filters?: {
    categoryId?: string;
    topicId?: string;
    difficulty?: string;
    search?: string;
    limit?: number;
    offset?: number;
    shuffle?: boolean;
    mode?: string;
  }): Promise<{ questions: AptitudeQuestion[]; total: number; hasMore: boolean }> {
    try {
      const params: Record<string, any> = {};
      if (filters?.categoryId) params.category_id = filters.categoryId;
      if (filters?.topicId) params.topic_id = filters.topicId;
      if (filters?.difficulty && filters.difficulty !== 'all') params.difficulty = filters.difficulty;
      if (filters?.search) params.search = filters.search;
      if (filters?.limit) params.limit = filters.limit;
      if (filters?.offset) params.offset = filters.offset;
      if (filters?.shuffle) params.shuffle = filters.shuffle;
      if (filters?.mode) params.mode = filters.mode;

      const res = await api.get('/aptitude/questions', { params });
      if (res.data?.success && Array.isArray(res.data.data)) {
        return {
          questions: res.data.data,
          total: res.data.total || res.data.data.length,
          hasMore: Boolean(res.data.hasMore)
        };
      }
    } catch (err) {
      console.warn('[AptitudeService] API getQuestions failed, using fallback:', err);
    }

    let list = [...(fallbackAptitudeData.questions || [])];
    if (filters?.categoryId) list = list.filter((q: any) => q.category_id === filters.categoryId);
    if (filters?.topicId) list = list.filter((q: any) => q.topic_id === filters.topicId);
    if (filters?.difficulty && filters.difficulty !== 'all') list = list.filter((q: any) => q.difficulty === filters.difficulty);
    if (filters?.search) {
      const s = filters.search.toLowerCase();
      list = list.filter((q: any) => q.question_text?.toLowerCase().includes(s));
    }
    const limit = filters?.limit || 20;
    const offset = filters?.offset || 0;
    const paginated = list.slice(offset, offset + limit);

    return {
      questions: paginated as any,
      total: list.length,
      hasMore: offset + limit < list.length
    };
  },

  async getQuestionById(id: string, mode: string = 'practice'): Promise<AptitudeQuestion | null> {
    try {
      const res = await api.get(`/aptitude/questions/${id}`, { params: { mode } });
      if (res.data?.data) return res.data.data;
    } catch (err) {
      console.warn('[AptitudeService] API getQuestionById failed, using fallback:', err);
    }
    const q = fallbackAptitudeData.questions?.find((item: any) => item.id === id);
    return (q as any) || null;
  },

  // Mock Tests
  async getMockTests(): Promise<AptitudeMockTest[]> {
    try {
      const res = await api.get('/aptitude/mock-tests');
      if (res.data?.success && Array.isArray(res.data.data)) {
        return res.data.data;
      }
    } catch (err) {
      console.warn('[AptitudeService] API getMockTests failed, using fallback:', err);
    }
    return (fallbackAptitudeData.mock_tests as any) || [];
  },

  async getMockTestBySlug(slug: string): Promise<AptitudeMockTest | null> {
    try {
      const res = await api.get(`/aptitude/mock-tests/${slug}`);
      if (res.data?.data) return res.data.data;
    } catch (err) {
      console.warn('[AptitudeService] API getMockTestBySlug failed, using fallback:', err);
    }
    const t = fallbackAptitudeData.mock_tests?.find((item: any) => item.slug === slug || item.id === slug);
    return (t as any) || null;
  },

  // Daily Challenge
  async getDailyChallenge(date?: string): Promise<AptitudeDailyChallenge | null> {
    try {
      const params: Record<string, any> = {};
      if (date) params.date = date;
      const res = await api.get('/aptitude/daily-challenge', { params });
      if (res.data?.data) return res.data.data;
    } catch (err) {
      console.warn('[AptitudeService] API getDailyChallenge failed, using fallback:', err);
    }
    return (fallbackAptitudeData.daily_challenges?.[0] as any) || null;
  },

  // Achievements
  async getAchievements(): Promise<AptitudeAchievement[]> {
    try {
      const res = await api.get('/aptitude/achievements');
      if (res.data?.success && Array.isArray(res.data.data)) {
        return res.data.data;
      }
    } catch (err) {
      console.warn('[AptitudeService] API getAchievements failed, using fallback:', err);
    }
    return (fallbackAptitudeData.achievements as any) || [];
  },

  // Attempts
  async startAttempt(payload: {
    mode: 'practice' | 'timed' | 'mock_test' | 'daily_challenge';
    test_id?: string | null;
    category_id?: string | null;
    topic_id?: string | null;
    total_questions?: number;
    duration_minutes?: number;
  }): Promise<AptitudeAttempt> {
    const res = await api.post('/aptitude/attempts', payload);
    return res.data?.data;
  },

  async submitAttempt(
    attemptId: string,
    payload: {
      answers: AttemptAnswerInput[];
      time_spent_seconds: number;
    }
  ): Promise<AptitudeAttempt> {
    const res = await api.post(`/aptitude/attempts/${attemptId}/submit`, payload);
    return res.data?.data;
  },

  async getAttemptById(id: string): Promise<AptitudeAttempt | null> {
    const res = await api.get(`/aptitude/attempts/${id}`);
    return res.data?.data || null;
  },

  // History & Analytics
  async getHistory(filters?: {
    mode?: string;
    categoryId?: string;
    page?: number;
    limit?: number;
  }): Promise<{ attempts: AptitudeAttempt[]; pagination: any }> {
    const params: Record<string, any> = {};
    if (filters?.mode) params.mode = filters.mode;
    if (filters?.categoryId) params.category_id = filters.categoryId;
    if (filters?.page) params.page = filters.page;
    if (filters?.limit) params.limit = filters.limit;

    const res = await api.get('/aptitude/history', { params });
    return {
      attempts: res.data?.data || [],
      pagination: res.data?.pagination || { total: 0, page: 1, limit: 10, totalPages: 0 }
    };
  },

  async getAnalytics(): Promise<AptitudeAnalytics> {
    const res = await api.get('/aptitude/analytics');
    return res.data?.data || {
      total_attempts: 0,
      total_questions_solved: 0,
      total_correct: 0,
      overall_accuracy: 0,
      total_time_spent_seconds: 0,
      average_time_per_question: 0,
      weak_topics: [],
      strong_topics: [],
      category_mastery: [],
      trend: []
    };
  }
};
