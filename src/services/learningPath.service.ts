import { api } from '../lib/api';
import { supabase } from '../lib/supabase';

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
      if (filters?.pageSize) params.limit = filters.pageSize;

      const res = await api.get('/learning-paths', { params });
      if (res.data?.success && Array.isArray(res.data.data)) {
        return {
          data: res.data.data,
          pagination: res.data.pagination
        };
      }
    } catch (apiErr) {
      console.warn('[LearningPathService] Backend API failed, falling back to Supabase:', apiErr);
    }

    // Fallback: Supabase direct query
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
      if (!error && data) {
        return { data, pagination: { total: data.length, page: 1, limit: data.length, totalPages: 1 } };
      }
    } catch (sbErr) {
      console.warn('[LearningPathService] Supabase fallback error:', sbErr);
    }

    return { data: [], pagination: { total: 0, page: 1, limit: 12, totalPages: 0 } };
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

    // Fallback: Supabase direct
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

    return null;
  },

  // Enroll logged-in user in a learning path
  async enrollInLearningPath(pathId: string): Promise<StudentLearningPath | null> {
    const res = await api.post(`/learning-paths/${pathId}/enroll`);
    return res.data?.data || null;
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
    const res = await api.patch(`/learning-paths/${pathId}/progress`, progressData);
    return res.data?.data || null;
  },

  // Fetch all learning paths the logged-in student has enrolled in
  async getMyLearningPaths(): Promise<StudentLearningPath[]> {
    try {
      const res = await api.get('/learning-paths/my/paths');
      if (res.data?.success && Array.isArray(res.data.data)) {
        return res.data.data;
      }
    } catch (err) {
      console.warn('[LearningPathService] Failed to load user paths:', err);
    }
    return [];
  },

  // Admin: Get all learning paths
  async adminGetAllPaths(): Promise<LearningPath[]> {
    try {
      const res = await api.get('/learning-paths/admin/all');
      if (res.data?.success && Array.isArray(res.data.data)) {
        return res.data.data;
      }
    } catch (err) {
      console.warn('[LearningPathService] Failed to get admin paths:', err);
    }
    return [];
  },

  // Admin: Create learning path
  async createPath(pathData: Partial<LearningPath>): Promise<LearningPath | null> {
    const res = await api.post('/learning-paths', pathData);
    return res.data?.data || null;
  },

  // Admin: Update learning path
  async updatePath(id: string, updates: Partial<LearningPath>): Promise<LearningPath | null> {
    const res = await api.patch(`/learning-paths/${id}`, updates);
    return res.data?.data || null;
  },

  // Admin: Delete learning path
  async deletePath(id: string): Promise<boolean> {
    const res = await api.delete(`/learning-paths/${id}`);
    return Boolean(res.data?.success);
  }
};
