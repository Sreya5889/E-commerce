import { api } from '../lib/api';
import { supabase } from '../lib/supabase';

export const orderService = {
  async createOrderFromCart(userId: string, couponCode?: string) {
    try {
      const res = await api.post('/orders', { couponCode: couponCode || undefined });
      if (res.data?.success && res.data.data) {
        return {
          id: res.data.data.orderId || res.data.data.id,
          ...res.data.data
        };
      }
    } catch (apiErr) {
      console.warn('[OrderService] Backend API POST /orders failed, attempting Supabase RPC fallback:', apiErr);
    }

    const { data, error } = await supabase.rpc('create_order_from_cart', {
      p_user_id: userId,
      p_coupon_code: couponCode || null
    });

    if (error) throw error;
    return data?.[0] || data;
  },

  async getUserOrders(userId: string) {
    try {
      const res = await api.get('/orders');
      if (res.data?.success && Array.isArray(res.data.data)) {
        return res.data.data;
      }
    } catch (apiErr) {
      console.warn('[OrderService] Backend API GET /orders failed, attempting Supabase fallback:', apiErr);
    }

    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*, courses(*)), payments(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getOrderById(orderId: string) {
    try {
      const res = await api.get(`/orders/${orderId}`);
      if (res.data?.success && res.data.data) {
        return res.data.data;
      }
    } catch (apiErr) {
      console.warn('[OrderService] Backend API GET /orders/:id failed, attempting Supabase fallback:', apiErr);
    }

    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*, courses(*)), payments(*), profiles(*)')
      .eq('id', orderId)
      .single();

    if (error) throw error;
    return data;
  },

  async cancelOrder(orderId: string) {
    try {
      const res = await api.post(`/orders/${orderId}/cancel`);
      if (res.data?.success) {
        return res.data.data;
      }
    } catch (apiErr) {
      console.warn('[OrderService] Backend API cancel order failed:', apiErr);
      throw apiErr;
    }
  }
};
