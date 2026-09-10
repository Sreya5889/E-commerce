import { api } from '../lib/api';
import { supabase } from '../lib/supabase';

export const wishlistService = {
  async getWishlist(userId: string) {
    try {
      const res = await api.get('/wishlist');
      if (res.data?.success && Array.isArray(res.data.data)) {
        return res.data.data.map((item: any) => ({
          ...item,
          courses: item.courses || item
        }));
      }
    } catch (apiErr) {
      console.warn('[WishlistService] Backend API /wishlist failed, attempting Supabase fallback:', apiErr);
    }

    const { data, error } = await supabase
      .from('wishlist')
      .select('*, courses(*, teachers(*, profiles(*)))')
      .eq('user_id', userId);

    if (error) throw error;
    return data;
  },

  async addToWishlist(userId: string, courseId: string) {
    try {
      const res = await api.post(`/wishlist/${courseId}`);
      if (res.data?.success) {
        return res.data.data;
      }
    } catch (apiErr) {
      console.warn('[WishlistService] Backend API POST /wishlist/:id failed, attempting Supabase fallback:', apiErr);
    }

    const { data, error } = await supabase
      .from('wishlist')
      .upsert({ user_id: userId, course_id: courseId }, { onConflict: 'user_id,course_id' })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async removeFromWishlist(userId: string, courseId: string) {
    try {
      const res = await api.delete(`/wishlist/${courseId}`);
      if (res.data?.success) {
        return true;
      }
    } catch (apiErr) {
      console.warn('[WishlistService] Backend API DELETE /wishlist/:id failed, attempting Supabase fallback:', apiErr);
    }

    const { error } = await supabase
      .from('wishlist')
      .delete()
      .eq('user_id', userId)
      .eq('course_id', courseId);

    if (error) throw error;
    return true;
  }
};
