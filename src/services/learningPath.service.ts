import { api } from '../lib/api';
import { supabase } from '../lib/supabase';
import fallbackLearningPathsRaw from '../data/learningPaths.json';

const fallbackLearningPaths: LearningPath[] = fallbackLearningPathsRaw as unknown as LearningPath[];

export interface LearningPathCourse {
  course_id: string;
  title: string;
  slug?: string;
  thumbnail_url?: string;
  duration_hours?: number;
  level?: string;
  avg_rating?: number;
  price?: number;
  discount_price?: number;
}

export interface LearningPathStage {
  stage_number: number;
  stage_title: string;
  stage_description: string;
  is_milestone?: boolean;
  courses: LearningPathCourse[];
}

export interface LearningPath {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  duration_weeks: number;
  estimated_hours: number;
  total_courses: number;
  rating: number;
  enrolled_count: number;
  is_published: boolean;
  banner_url: string;
  key_skills: string[];
  tools_and_technologies: string[];
  career_outcomes: string[];
  prerequisites: string[];
  capstone_project?: {
    title: string;
    description: string;
  };
  stages: LearningPathStage[];
  is_enrolled?: boolean;
  enrollment?: StudentLearningPath | null;
  created_at?: string;
  updated_at?: string;
}

export interface StudentLearningPath {
  id: string;
  user_id: string;
  learning_path_id: string;
  progress_pct: number;
  completed_courses: string[];
  current_stage: number;
  last_accessed_course_id?: string;
  status: 'in_progress' | 'completed';
  created_at?: string;
  updated_at?: string;
  learning_paths?: LearningPath;
}

export interface LearningPathFilters {
  query?: string;
  category?: string;
  difficulty?: string;
  sortBy?: 'popular' | 'rating' | 'newest' | 'courses' | 'duration';
  page?: number;
  pageSize?: number;
}

const LOCAL_ENROLLMENTS_KEY = 'eduacademy_student_learning_paths';

const getLocalEnrollments = (): StudentLearningPath[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_ENROLLMENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveLocalEnrollments = (list: StudentLearningPath[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_ENROLLMENTS_KEY, JSON.stringify(list));
  } catch {}
};

export const learningPathService = {
  // Fetch all learning paths with filters
  async getLearningPaths(filters?: LearningPathFilters): Promise<{ data: LearningPath[]; pagination?: any }> {
    try {
      const params: Record<string, any> = {};
      if (filters?.query) params.search = filters.query;
      if (filters?.category && filters.category !== 'all') params.category = filters.category;
      if (filters?.difficulty && filters.difficulty !== 'all') params.difficulty = filters.difficulty;
      if (filters?.sortBy) params.sort = filters.sortBy;
      if (filters?.page) params.page = filters.page;
      params.limit = filters?.pageSize || 50;

      const res = await api.get('/learning-paths', { params });
      if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
        return {
          data: res.data.data,
          pagination: res.data.pagination
        };
      }
    } catch (apiErr) {
      console.warn('[LearningPathService] Backend API failed, falling back to Supabase/local fallback:', apiErr);
    }

    // Fallback 1: Supabase direct query
    try {
      let query = supabase
        .from('learning_paths')
        .select('*')
        .eq('is_published', true);

      if (filters?.query) {
        query = query.ilike('title', `%${filters.query}%`);
      }
      if (filters?.category && filters.category !== 'all') {
        query = query.eq('category', filters.category);
      }
      if (filters?.difficulty && filters.difficulty !== 'all') {
        query = query.eq('difficulty', filters.difficulty);
      }

      const { data, error } = await query.order('enrolled_count', { ascending: false });
      if (!error && Array.isArray(data) && data.length > 0) {
        return { data, pagination: { total: data.length, page: 1, limit: data.length, totalPages: 1 } };
      }
    } catch (sbErr) {
      console.warn('[LearningPathService] Supabase fallback error:', sbErr);
    }

    // Fallback 2: Local curated dataset (Guarantees all 20 paths always display)
    let list = [...fallbackLearningPaths];

    if (filters?.query && filters.query.trim()) {
      const q = filters.query.trim().toLowerCase();
      list = list.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.key_skills?.some(s => s.toLowerCase().includes(q))
      );
    }

    if (filters?.category && filters.category !== 'all') {
      const catNorm = filters.category.toLowerCase().trim();
      list = list.filter(p => (p.category || '').toLowerCase().trim().includes(catNorm));
    }

    if (filters?.difficulty && filters.difficulty !== 'all') {
      const diffNorm = filters.difficulty.toLowerCase().trim();
      list = list.filter(p => (p.difficulty || '').toLowerCase().trim() === diffNorm);
    }

    if (filters?.sortBy === 'rating') {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (filters?.sortBy === 'courses') {
      list.sort((a, b) => (b.total_courses || 0) - (a.total_courses || 0));
    } else if (filters?.sortBy === 'duration') {
      list.sort((a, b) => (b.duration_weeks || 0) - (a.duration_weeks || 0));
    } else {
      list.sort((a, b) => (b.enrolled_count || 0) - (a.enrolled_count || 0));
    }

    return {
      data: list,
      pagination: { total: list.length, page: 1, limit: list.length, totalPages: 1 }
    };
  },

  // Fetch a single learning path with stages & enrollment status
  async getLearningPathBySlug(slug: string): Promise<LearningPath | null> {
    try {
      const res = await api.get(`/learning-paths/${slug}`);
      if (res.data?.success && res.data.data) {
        return res.data.data;
      }
    } catch (apiErr) {
      console.warn(`[LearningPathService] Backend API failed for slug ${slug}:`, apiErr);
    }

    // Fallback 1: Supabase direct
    try {
      const { data, error } = await supabase
        .from('learning_paths')
        .select('*')
        .or(`slug.eq.${slug},id.eq.${slug}`)
        .single();

      if (!error && data) {
        return data;
      }
    } catch (sbErr) {
      console.warn('[LearningPathService] Supabase fallback single path error:', sbErr);
    }

    // Fallback 2: Local curated dataset
    const found = fallbackLearningPaths.find(p => p.slug === slug || p.id === slug);
    if (found) {
      const enrollments = getLocalEnrollments();
      const enrollment = enrollments.find(e => e.learning_path_id === found.id) || null;
      return {
        ...found,
        is_enrolled: Boolean(enrollment),
        enrollment
      };
    }

    return null;
  },

  // Enroll logged-in user in a learning path
  async enrollInLearningPath(pathId: string): Promise<StudentLearningPath | null> {
    try {
      const res = await api.post(`/learning-paths/${pathId}/enroll`);
      if (res.data?.data) {
        return res.data.data;
      }
    } catch (err) {
      console.warn('[LearningPathService] API enroll failed, saving to local store:', err);
    }

    // LocalStorage fallback
    const pathItem = fallbackLearningPaths.find(p => p.id === pathId || p.slug === pathId);
    const enrollments = getLocalEnrollments();
    const existing = enrollments.find(e => e.learning_path_id === (pathItem?.id || pathId));
    if (existing) return existing;

    const newEnrollment: StudentLearningPath = {
      id: `local-slp-${Date.now()}`,
      user_id: 'current-user',
      learning_path_id: pathItem?.id || pathId,
      progress_pct: 0,
      completed_courses: [],
      current_stage: 1,
      last_accessed_course_id: pathItem?.stages?.[0]?.courses?.[0]?.course_id,
      status: 'in_progress',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      learning_paths: pathItem
    };

    enrollments.unshift(newEnrollment);
    saveLocalEnrollments(enrollments);
    return newEnrollment;
  },

  // Update progress for enrolled student
  async updateStudentProgress(
    pathId: string,
    progressData: {
      completed_courses?: string[];
      last_accessed_course_id?: string;
      current_stage?: number;
    }
  ): Promise<StudentLearningPath | null> {
    try {
      const res = await api.patch(`/learning-paths/${pathId}/progress`, progressData);
      if (res.data?.data) {
        return res.data.data;
      }
    } catch (err) {
      console.warn('[LearningPathService] API progress update failed, saving locally:', err);
    }

    // LocalStorage fallback
    const pathItem = fallbackLearningPaths.find(p => p.id === pathId || p.slug === pathId);
    const enrollments = getLocalEnrollments();
    const idx = enrollments.findIndex(e => e.learning_path_id === (pathItem?.id || pathId));
    if (idx === -1) return null;

    const current = enrollments[idx];
    const completed = progressData.completed_courses !== undefined ? progressData.completed_courses : current.completed_courses;
    const totalCourses = pathItem?.total_courses || 3;
    const progress_pct = Math.min(100, Math.round((completed.length / totalCourses) * 100));

    enrollments[idx] = {
      ...current,
      completed_courses: completed,
      progress_pct,
      status: progress_pct >= 100 ? 'completed' : 'in_progress',
      current_stage: progressData.current_stage !== undefined ? progressData.current_stage : current.current_stage,
      last_accessed_course_id: progressData.last_accessed_course_id || current.last_accessed_course_id,
      updated_at: new Date().toISOString(),
      learning_paths: pathItem
    };

    saveLocalEnrollments(enrollments);
    return enrollments[idx];
  },

  // Fetch all learning paths the logged-in student has enrolled in
  async getMyLearningPaths(): Promise<StudentLearningPath[]> {
    try {
      const res = await api.get('/learning-paths/my/paths');
      if (res.data?.success && Array.isArray(res.data.data)) {
        return res.data.data;
      }
    } catch (err) {
      console.warn('[LearningPathService] Failed to load user paths from API, checking local storage:', err);
    }

    // Fallback: LocalStorage enrollments
    const localEnrollments = getLocalEnrollments();
    return localEnrollments.map(e => {
      const pathItem = fallbackLearningPaths.find(p => p.id === e.learning_path_id);
      return {
        ...e,
        learning_paths: pathItem || e.learning_paths
      };
    });
  },

  // Admin: Get all learning paths
  async adminGetAllPaths(): Promise<LearningPath[]> {
    try {
      const res = await api.get('/learning-paths/admin/all');
      if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
        return res.data.data;
      }
    } catch (err) {
      console.warn('[LearningPathService] Failed to get admin paths from API:', err);
    }
    return fallbackLearningPaths;
  },

  // Admin: Create learning path
  async createPath(pathData: Partial<LearningPath>): Promise<LearningPath | null> {
    try {
      const res = await api.post('/learning-paths', pathData);
      return res.data?.data || null;
    } catch (err) {
      console.error('[LearningPathService] Admin createPath error:', err);
      return null;
    }
  },

  // Admin: Update learning path
  async updatePath(id: string, updates: Partial<LearningPath>): Promise<LearningPath | null> {
    try {
      const res = await api.patch(`/learning-paths/${id}`, updates);
      return res.data?.data || null;
    } catch (err) {
      console.error('[LearningPathService] Admin updatePath error:', err);
      return null;
    }
  },

  // Admin: Delete learning path
  async deletePath(id: string): Promise<boolean> {
    try {
      const res = await api.delete(`/learning-paths/${id}`);
      return Boolean(res.data?.success);
    } catch (err) {
      console.error('[LearningPathService] Admin deletePath error:', err);
      return false;
    }
  }
};
