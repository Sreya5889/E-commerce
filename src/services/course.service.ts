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
  const teacher = c.teachers || (() => {
    const found = INSTRUCTORS.find(t => t.id === (c.teacherId || c.instructor_id)) || INSTRUCTORS[0];
    return {
      id: found.id,
      expertise_areas: found.skills,
      avg_rating: found.rating,
      total_students: found.students,
      total_courses: found.totalCourses,
      verification_badge: found.isVerified,
      profiles: {
        display_name: found.name,
        first_name: found.name.split(' ')[0],
        last_name: found.name.split(' ').slice(1).join(' '),
        avatar_url: found.avatar,
        bio: found.biography,
        website: found.website
      }
    };
  })();

  const cat = c.categories || (() => {
    const found = CATEGORIES.find(k => k.name === c.category || k.slug === c.category) || CATEGORIES[0];
    return { id: found.id, name: found.name, slug: found.slug };
  })();

  const courseSections = c.course_sections || (c.curriculum || []).map((sec: any, sIdx: number) => ({
    id: `sec-${sIdx + 1}`,
    title: sec.title,
    course_lessons: (sec.lessons || []).map((les: any) => ({
      id: les.id,
      title: les.title,
      duration_minutes: les.duration || les.duration_minutes || 10,
      video_url: les.videoUrl || les.video_url,
      is_preview: Boolean(les.isPreview ?? les.is_preview)
    }))
  }));

  return {
    ...c,
    id: c.id,
    title: c.title,
    slug: c.slug || c.id,
    subtitle: c.subtitle || '',
    description: c.description || '',
    thumbnail_url: c.thumbnail_url || c.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
    thumbnail: c.thumbnail_url || c.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
    banner_url: c.banner_url || c.banner || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1600',
    banner: c.banner_url || c.banner || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1600',
    price: Number(c.price ?? 0),
    discount_price: c.discount_price !== undefined ? (c.discount_price === null ? null : Number(c.discount_price)) : (c.discountPrice !== undefined ? (c.discountPrice === null ? null : Number(c.discountPrice)) : null),
    discountPrice: c.discount_price !== undefined ? (c.discount_price === null ? null : Number(c.discount_price)) : (c.discountPrice !== undefined ? (c.discountPrice === null ? null : Number(c.discountPrice)) : null),
    avg_rating: Number(c.avg_rating ?? c.rating ?? 4.8),
    rating: Number(c.avg_rating ?? c.rating ?? 4.8),
    student_count: Number(c.student_count ?? c.studentCount ?? 0),
    studentCount: Number(c.student_count ?? c.studentCount ?? 0),
    duration_hours: Number(c.duration_hours ?? c.durationHours ?? 10),
    durationHours: Number(c.duration_hours ?? c.durationHours ?? 10),
    level: c.level || 'all_levels',
    language: c.language || 'English',
    is_bestseller: c.badge === 'bestseller' || c.badge === 'Bestseller' || Boolean(c.is_bestseller),
    badge: c.badge,
    category: cat.name,
    categories: cat,
    teachers: teacher,
    course_sections: courseSections,
    tags: Array.isArray(c.tags) ? c.tags : [],
    what_you_will_learn: Array.isArray(c.what_you_will_learn) ? c.what_you_will_learn : (Array.isArray(c.learning_objectives) ? c.learning_objectives : [])
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
      const q = filters.query.toLowerCase().trim();
      list = list.filter(c =>
        c.title?.toLowerCase().includes(q) ||
        c.subtitle?.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q) ||
        c.categories?.name?.toLowerCase().includes(q) ||
        c.categories?.slug?.toLowerCase().includes(q) ||
        c.category?.toLowerCase().includes(q) ||
        c.teachers?.profiles?.display_name?.toLowerCase().includes(q) ||
        (Array.isArray(c.tags) && c.tags.some((t: string) => t.toLowerCase().includes(q))) ||
        (Array.isArray(c.what_you_will_learn) && c.what_you_will_learn.some((item: string) => item.toLowerCase().includes(q)))
      );
    }
    if (filters?.categoryId && filters.categoryId !== 'all') {
      const catNorm = filters.categoryId.toLowerCase().trim();
      list = list.filter(c =>
        c.categories?.slug === catNorm ||
        c.categories?.name?.toLowerCase().replace(/\s+/g, '-') === catNorm ||
        c.category?.toLowerCase().replace(/\s+/g, '-') === catNorm ||
        c.category?.toLowerCase() === catNorm
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
