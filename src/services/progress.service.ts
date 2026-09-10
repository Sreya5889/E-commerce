import { api } from '../lib/api';
import { supabase } from '../lib/supabase';

export const progressService = {
  async getLessonProgress(userId: string, courseId: string) {
    try {
      const res = await api.get(`/progress/${courseId}`);
      if (res.data?.success && res.data.data) {
        return res.data.data.lessons || res.data.data;
      }
    } catch (apiErr) {
      console.warn('[ProgressService] Backend API GET /progress/:id failed, attempting Supabase fallback:', apiErr);
    }

    const { data, error } = await supabase
      .from('lesson_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('course_id', courseId);

    if (error) throw error;
    return data;
  },

  async updateLessonProgress(
    userId: string,
    courseId: string,
    lessonId: string,
    completed: boolean,
    watchedSeconds = 0,
    lastPosition = 0
  ) {
    try {
      const res = await api.post(`/progress/${lessonId}`, {
        completed,
        watchedSeconds
      });
      if (res.data?.success && res.data.data) {
        return res.data.data.progressPercentage ?? 100;
      }
    } catch (apiErr) {
      console.warn('[ProgressService] Backend API POST /progress/:id failed, attempting Supabase fallback:', apiErr);
    }

    const { error: pErr } = await supabase
      .from('lesson_progress')
      .upsert({
        user_id: userId,
        course_id: courseId,
        lesson_id: lessonId,
        completed,
        watched_seconds: watchedSeconds,
        last_position_seconds: lastPosition,
        completed_at: completed ? new Date().toISOString() : null
      }, { onConflict: 'user_id,lesson_id' });

    if (pErr) throw pErr;

    const { data: progressPercentage, error: rpcErr } = await supabase.rpc('calculate_course_progress', {
      p_user_id: userId,
      p_course_id: courseId
    });

    if (rpcErr) throw rpcErr;
    return progressPercentage;
  }
};
