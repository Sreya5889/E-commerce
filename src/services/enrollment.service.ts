import { api } from '../lib/api';
import { supabase } from '../lib/supabase';

export const enrollmentService = {
  async getUserEnrollments(userId: string) {
    try {
      const res = await api.get('/enrollments');
      if (res.data?.success && Array.isArray(res.data.data)) {
        return res.data.data;
      }
    } catch (apiErr) {
      console.warn('[EnrollmentService] Backend API GET /enrollments failed, attempting Supabase fallback:', apiErr);
    }

    const { data, error } = await supabase
      .from('enrollments')
      .select('*, courses(*, teachers(*, profiles(*)))')
      .eq('user_id', userId)
      .order('last_accessed_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async isEnrolled(userId: string, courseId: string) {
    try {
      const res = await api.get(`/enrollments/check/${courseId}`);
      if (res.data?.success && typeof res.data.data?.isEnrolled === 'boolean') {
        return res.data.data.isEnrolled;
      }
    } catch (apiErr) {
      console.warn('[EnrollmentService] Backend API check enrollment failed, attempting Supabase fallback:', apiErr);
    }

    const { data, error } = await supabase
      .from('enrollments')
      .select('id')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .maybeSingle();

    if (error) throw error;
    return !!data;
  },

  async enrollFreeCourse(courseId: string) {
    try {
      const res = await api.post('/enrollments/free', { courseId });
      if (res.data?.success) {
        return res.data.data;
      }
    } catch (apiErr) {
      console.warn('[EnrollmentService] Backend API enroll free course failed:', apiErr);
      throw apiErr;
    }
  }
};
