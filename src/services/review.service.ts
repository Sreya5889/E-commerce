import { api } from '../lib/api';
import { supabase } from '../lib/supabase';
import { REVIEWS } from '../constants/mockData';

export const reviewService = {
  async getCourseReviews(courseId: string) {
    try {
      const res = await api.get(`/reviews/${courseId}`);
      if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
        return res.data.data;
      }
    } catch (apiErr) {
      console.warn('[ReviewService] Backend API GET /reviews/:id failed, attempting Supabase fallback:', apiErr);
    }

    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*, profiles(display_name, first_name, last_name, avatar_url)')
        .eq('course_id', courseId)
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) return data;
    } catch (err) {
      console.warn('Supabase reviews offline or empty, using catalog data:', err);
    }

    return REVIEWS.filter(r => !courseId || r.courseId === courseId || r.courseId === 'course-1').map(r => ({
      id: r.id,
      course_id: r.courseId,
      rating: r.rating,
      review: r.comment,
      instructor_reply: r.replyComment,
      is_verified_purchase: r.isVerifiedPurchase,
      created_at: r.createdAt,
      profiles: {
        display_name: r.userName,
        first_name: r.userName.split(' ')[0],
        last_name: r.userName.split(' ').slice(1).join(' '),
        avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(r.userName)}&background=random`
      }
    }));
  },

  async addReview(userId: string, courseId: string, rating: number, reviewText: string) {
    try {
      const res = await api.post(`/reviews/${courseId}`, {
        rating,
        review: reviewText
      });
      if (res.data?.success && res.data.data) {
        return res.data.data;
      }
    } catch (apiErr) {
      console.warn('[ReviewService] Backend API POST /reviews/:id failed, attempting Supabase fallback:', apiErr);
    }

    const { data: isEnrolled } = await supabase
      .from('enrollments')
      .select('id')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .maybeSingle();

    const { data, error } = await supabase
      .from('reviews')
      .upsert({
        user_id: userId,
        course_id: courseId,
        rating,
        review: reviewText,
        is_verified_purchase: !!isEnrolled,
        is_approved: true
      }, { onConflict: 'user_id,course_id' })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async replyToReview(reviewId: string, replyText: string) {
    try {
      const res = await api.post(`/reviews/${reviewId}/reply`, { reply: replyText });
      if (res.data?.success && res.data.data) {
        return res.data.data;
      }
    } catch (apiErr) {
      console.warn('[ReviewService] Backend API reply to review failed:', apiErr);
    }

    const { data, error } = await supabase
      .from('reviews')
      .update({
        instructor_reply: replyText,
        replied_at: new Date().toISOString()
      })
      .eq('id', reviewId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
