import { api } from '../lib/api';
import { supabase } from '../lib/supabase';
import { COURSES, INSTRUCTORS, CATEGORIES } from '../constants/mockData';

export interface CourseSearchFilters {
  query?: string;
  categoryId?: string;
  subcategoryId?: string;
  instructorId?: string;
  minPrice?: number;
  maxPrice?: number;
  level?: string;
  language?: string;
  minRating?: number;
  sortBy?: 'latest' | 'popular' | 'rating' | 'price_low' | 'price_high';
  page?: number;
  pageSize?: number;
}

const formatMockCourse = (c: any) => {
  const teacher = INSTRUCTORS.find(t => t.id === c.teacherId) || INSTRUCTORS[0];
  const cat = CATEGORIES.find(k => k.name === c.category || k.slug === c.category) || CATEGORIES[0];
  return {
    ...c,
    id: c.id,
    title: c.title,
    slug: c.id,
    subtitle: c.subtitle,
    description: c.description,
    thumbnail_url: c.thumbnail,
    banner_url: c.banner,
    price: c.price,
    discount_price: c.discountPrice,
    avg_rating: c.rating,
    student_count: c.studentCount,
    duration_hours: c.durationHours,
    level: c.level,
    language: c.language,
    is_bestseller: c.badge === 'Bestseller',
    badge: c.badge,
    categories: { id: cat.id, name: cat.name, slug: cat.slug },
    teachers: {
      id: teacher.id,
      expertise_areas: teacher.skills,
      avg_rating: teacher.rating,
      total_students: teacher.students,
      total_courses: teacher.totalCourses,
      verification_badge: teacher.isVerified,
      profiles: {
        display_name: teacher.name,
        first_name: teacher.name.split(' ')[0],
        last_name: teacher.name.split(' ').slice(1).join(' '),
        avatar_url: teacher.avatar,
        bio: teacher.biography,
        website: teacher.website
      }
    },
    course_sections: (c.curriculum || []).map((sec: any, sIdx: number) => ({
      id: `sec-${sIdx + 1}`,
      title: sec.title,
      course_lessons: (sec.lessons || []).map((les: any) => ({
        id: les.id,
        title: les.title,
        duration_minutes: les.duration,
        video_url: les.videoUrl,
        is_preview: les.isPreview
      }))
    }))
  };
};

const MOCK_COURSES_FORMATTED = COURSES.map(formatMockCourse);

export const courseService = {
  async getCourses(filters?: CourseSearchFilters) {
    // 1. Try Backend REST API first
    try {
      const params: Record<string, any> = {};
      if (filters?.query) params.search = filters.query;
      if (filters?.categoryId && filters.categoryId !== 'all') params.category = filters.categoryId;
      if (filters?.level && filters.level !== 'all') params.level = filters.level;
      if (filters?.minPrice !== undefined) params.minPrice = filters.minPrice;
      if (filters?.maxPrice !== undefined) params.maxPrice = filters.maxPrice;
      if (filters?.sortBy) params.sort = filters.sortBy;
      if (filters?.page) params.page = filters.page;
      if (filters?.pageSize) params.limit = filters.pageSize;

      const res = await api.get('/courses', { params });
      if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
        return res.data.data;
      }
    } catch (apiErr) {
      console.warn('[CourseService] Backend API GET /courses failed, attempting Supabase fallback:', apiErr);
    }

    // 2. Try Supabase direct
    try {
      if (filters?.query || filters?.categoryId || filters?.level || filters?.sortBy) {
        const { data, error } = await supabase.rpc('search_courses', {
          search_query: filters.query || null,
          p_category_id: filters.categoryId || null,
          p_subcategory_id: filters.subcategoryId || null,
          p_instructor_id: filters.instructorId || null,
          min_price: filters.minPrice || null,
          max_price: filters.maxPrice || null,
          p_level: filters.level || null,
          p_language: filters.language || null,
          min_rating: filters.minRating || null,
          sort_by: filters.sortBy || 'popular',
          page: filters.page || 1,
          page_size: filters.pageSize || 12
        });

        if (!error && data && data.length > 0) return data;
      } else {
        const { data, error } = await supabase
          .from('courses')
          .select('*, teachers(*, profiles(*)), categories(*)')
          .eq('status', 'published')
          .order('student_count', { ascending: false });

        if (!error && data && data.length > 0) return data;
      }
    } catch (err) {
      console.warn('[CourseService] Supabase courses offline or empty, using catalog data:', err);
    }

    // 3. Resilient catalog fallback
    let list = [...MOCK_COURSES_FORMATTED];
    if (filters?.query) {
      const q = filters.query.toLowerCase();
      list = list.filter(c =>
        c.title?.toLowerCase().includes(q) ||
        c.subtitle?.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q)
      );
    }
    if (filters?.categoryId && filters.categoryId !== 'all') {
      list = list.filter(c =>
        c.categories?.slug === filters.categoryId ||
        c.categories?.name?.toLowerCase().replace(/\s+/g, '-') === filters.categoryId
      );
    }
    if (filters?.level && filters.level !== 'all') {
      list = list.filter(c => c.level?.toLowerCase() === filters.level.toLowerCase());
    }
    return list;
  },

  async getCourseBySlug(slug: string) {
    return this.getCourseById(slug);
  },

  async getCourseById(id: string) {
    // 1. Try Backend REST API
    try {
      const res = await api.get(`/courses/${id}`);
      if (res.data?.success && res.data.data) {
        return res.data.data;
      }
    } catch (apiErr) {
      console.warn('[CourseService] Backend API GET /courses/:id failed, attempting Supabase fallback:', apiErr);
    }

    // 2. Try Supabase
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*, teachers(*, profiles(*)), categories(*), course_sections(*, course_lessons(*))')
        .eq('id', id)
        .single();

      if (!error && data) return data;
    } catch (err) {
      console.warn('[CourseService] Supabase course by id offline, using catalog data:', err);
    }

    const found = MOCK_COURSES_FORMATTED.find(c => c.id === id || c.slug === id);
    return found || MOCK_COURSES_FORMATTED[0];
  },

  async getRecommendedCourses(userId?: string, limit = 6) {
    try {
      const { data, error } = await supabase.rpc('get_recommended_courses', {
        p_user_id: userId || null,
        p_limit: limit
      });

      if (!error && data && data.length > 0) return data;
    } catch (err) {
      console.warn('Supabase recommended courses offline, using catalog data:', err);
    }

    return MOCK_COURSES_FORMATTED.slice(0, limit);
  },

  async recordCourseView(userId: string, courseId: string) {
    const { error } = await supabase.rpc('record_course_view', {
      p_user_id: userId,
      p_course_id: courseId
    });
    if (error) console.warn('Record course view non-critical error:', error);
  },

  async createCourse(teacherId: string, courseData: any) {
    try {
      const res = await api.post('/courses', courseData);
      if (res.data?.success && res.data.data) {
        return res.data.data;
      }
    } catch (apiErr) {
      console.warn('[CourseService] Backend API POST /courses failed, attempting Supabase fallback:', apiErr);
    }

    const { data, error } = await supabase
      .from('courses')
      .insert({ ...courseData, instructor_id: teacherId })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateCourse(id: string, courseData: any) {
    try {
      const res = await api.patch(`/courses/${id}`, courseData);
      if (res.data?.success && res.data.data) {
        return res.data.data;
      }
    } catch (apiErr) {
      console.warn('[CourseService] Backend API PATCH /courses/:id failed, attempting Supabase fallback:', apiErr);
    }

    const { data, error } = await supabase
      .from('courses')
      .update(courseData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteCourse(id: string) {
    try {
      const res = await api.delete(`/courses/${id}`);
      if (res.data?.success) {
        return true;
      }
    } catch (apiErr) {
      console.warn('[CourseService] Backend API DELETE /courses/:id failed, attempting Supabase fallback:', apiErr);
    }

    const { error } = await supabase.from('courses').delete().eq('id', id);
    if (error) throw error;
    return true;
  }
};
