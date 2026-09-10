import { api } from '../lib/api';
import { supabase } from '../lib/supabase';
import { INSTRUCTORS } from '../constants/mockData';

const MOCK_TEACHERS_FORMATTED = INSTRUCTORS.map(t => ({
  id: t.id,
  user_id: t.id,
  expertise_areas: t.skills,
  years_of_experience: parseInt(t.experience) || 10,
  avg_rating: t.rating,
  total_students: t.students,
  total_courses: t.totalCourses,
  verification_badge: t.isVerified,
  verification_status: 'approved',
  profiles: {
    display_name: t.name,
    first_name: t.name.split(' ')[0],
    last_name: t.name.split(' ').slice(1).join(' '),
    avatar_url: t.avatar,
    bio: t.biography,
    website: t.website
  }
}));

export const teacherService = {
  async getTeachers() {
    try {
      const res = await api.get('/teachers');
      if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
        return res.data.data;
      }
    } catch (apiErr) {
      console.warn('[TeacherService] Backend API GET /teachers failed, attempting Supabase fallback:', apiErr);
    }

    try {
      const { data, error } = await supabase
        .from('teachers')
        .select('*, profiles(*)')
        .eq('verification_status', 'approved')
        .order('total_students', { ascending: false });

      if (!error && data && data.length > 0) return data;
    } catch (err) {
      console.warn('Supabase teachers offline or empty, using catalog data:', err);
    }
    return MOCK_TEACHERS_FORMATTED;
  },

  async getTeacherById(id: string) {
    try {
      const res = await api.get(`/teachers/${id}`);
      if (res.data?.success && res.data.data) {
        return res.data.data;
      }
    } catch (apiErr) {
      console.warn('[TeacherService] Backend API GET /teachers/:id failed, attempting Supabase fallback:', apiErr);
    }

    try {
      const { data, error } = await supabase
        .from('teachers')
        .select('*, profiles(*), courses(*)')
        .eq('id', id)
        .single();

      if (!error && data) return data;
    } catch (err) {
      console.warn('Supabase teacher by id offline, using catalog data:', err);
    }
    return MOCK_TEACHERS_FORMATTED.find(t => t.id === id) || MOCK_TEACHERS_FORMATTED[0];
  },

  async getTeacherByUserId(userId: string) {
    try {
      const { data, error } = await supabase
        .from('teachers')
        .select('*, profiles(*)')
        .eq('user_id', userId)
        .maybeSingle();

      if (!error && data) return data;
    } catch (err) {
      console.warn('Supabase teacher by user_id offline, using catalog data:', err);
    }
    return MOCK_TEACHERS_FORMATTED.find(t => t.user_id === userId) || null;
  },

  async requestVerification(userId: string, teacherData: any) {
    const { data, error } = await supabase
      .from('teachers')
      .upsert({
        user_id: userId,
        ...teacherData,
        verification_status: 'pending'
      }, { onConflict: 'user_id' })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
