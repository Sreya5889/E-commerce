import { api } from '../lib/api';
import { supabase } from '../lib/supabase';

export const cartService = {
  async getCart(userId: string, couponCode?: string) {
    try {
      const res = await api.get('/cart', { params: { couponCode } });
      if (res.data?.success && res.data.data?.items) {
        return res.data.data.items.map((item: any) => ({
          ...item,
          id: item.course_id || item.id,
          courses: {
            id: item.course_id || item.id,
            title: item.title,
            price: item.price,
            discount_price: item.discount_price,
            thumbnail_url: item.thumbnail_url,
            slug: item.slug,
            teachers: {
              profiles: item.instructor
            }
          }
        }));
      }
    } catch (apiErr) {
      console.warn('[CartService] Backend API /cart failed, attempting Supabase fallback:', apiErr);
    }

    const { data, error } = await supabase
      .from('cart')
      .select('*, courses(*, teachers(*, profiles(*)))')
      .eq('user_id', userId);

    if (error) throw error;
    return data;
  },

  async addToCart(userId: string, courseId: string) {
    try {
      const res = await api.post('/cart/items', { courseId });
      if (res.data?.success) {
        return res.data.data;
      }
    } catch (apiErr) {
      console.warn('[CartService] Backend API /cart/items failed, attempting Supabase fallback:', apiErr);
    }

    const { data, error } = await supabase
      .from('cart')
      .upsert({ user_id: userId, course_id: courseId, quantity: 1 }, { onConflict: 'user_id,course_id' })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async removeFromCart(userId: string, courseId: string) {
    try {
      const res = await api.delete(`/cart/items/${courseId}`);
      if (res.data?.success) {
        return true;
      }
    } catch (apiErr) {
      console.warn('[CartService] Backend API /cart/items/:id failed, attempting Supabase fallback:', apiErr);
    }

    const { error } = await supabase
      .from('cart')
      .delete()
      .eq('user_id', userId)
      .eq('course_id', courseId);

    if (error) throw error;
    return true;
  },

  async clearCart(userId: string) {
    try {
      const res = await api.delete('/cart');
      if (res.data?.success) {
        return true;
      }
    } catch (apiErr) {
      console.warn('[CartService] Backend API /cart failed, attempting Supabase fallback:', apiErr);
    }

    const { error } = await supabase
      .from('cart')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  }
};
