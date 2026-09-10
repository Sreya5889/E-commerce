import { supabase } from '../lib/supabase';

export const analyticsService = {
  async logEvent(eventType: string, metadata: Record<string, any> = {}, courseId?: string, instructorId?: string) {
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from('analytics_events').insert({
      event_type: eventType as any,
      user_id: user?.id || null,
      course_id: courseId || null,
      instructor_id: instructorId || null,
      metadata
    });

    if (error) console.warn('Analytics event logging non-critical error:', error);
  }
};
