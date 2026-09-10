import { api } from '../lib/api';
import { supabase } from '../lib/supabase';

export const couponService = {
  async validateCoupon(code: string, cartSubtotal = 0) {
    try {
      const res = await api.post('/coupons/validate', {
        code: code.trim().toUpperCase(),
        cartSubtotal
      });
      if (res.data?.success && res.data.data) {
        return {
          ...res.data.data,
          discount_percent: res.data.data.discountValue || res.data.data.discount_percent,
          discountPercent: res.data.data.discountValue || res.data.data.discountPercent
        };
      }
    } catch (apiErr) {
      console.warn('[CouponService] Backend API POST /coupons/validate failed, attempting Supabase fallback:', apiErr);
    }

    // Direct DB validation fallback
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .maybeSingle();

    if (error) throw error;
    if (!data) throw new Error('Invalid or expired coupon code');

    const now = new Date();
    if (data.expires_at && new Date(data.expires_at) < now) {
      throw new Error('This coupon has expired');
    }
    if (data.min_order_amount && cartSubtotal < Number(data.min_order_amount)) {
      throw new Error(`Minimum order amount of $${data.min_order_amount} required`);
    }

    return {
      ...data,
      discount_percent: data.discount_value,
      discountPercent: data.discount_value
    };
  },

  async getActiveCoupons() {
    try {
      const res = await api.get('/coupons');
      if (res.data?.success && Array.isArray(res.data.data)) {
        return res.data.data;
      }
    } catch (apiErr) {
      console.warn('[CouponService] Backend API GET /coupons failed, attempting Supabase fallback:', apiErr);
    }

    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async createCoupon(couponData: {
    code: string;
    discount_type: 'percentage' | 'fixed';
    discount_value: number;
    min_order_amount?: number;
    max_uses?: number;
    expires_at?: string;
  }) {
    try {
      const res = await api.post('/coupons', {
        code: couponData.code.toUpperCase(),
        discountType: couponData.discount_type,
        discountValue: couponData.discount_value,
        minimumOrderAmount: couponData.min_order_amount,
        usageLimit: couponData.max_uses,
        expiresAt: couponData.expires_at
      });
      if (res.data?.success && res.data.data) {
        return res.data.data;
      }
    } catch (apiErr) {
      console.warn('[CouponService] Backend API POST /coupons failed, attempting Supabase fallback:', apiErr);
    }

    const { data, error } = await supabase
      .from('coupons')
      .insert({ ...couponData, code: couponData.code.toUpperCase(), is_active: true })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteCoupon(id: string) {
    try {
      const res = await api.delete(`/coupons/${id}`);
      if (res.data?.success) {
        return true;
      }
    } catch (apiErr) {
      console.warn('[CouponService] Backend API DELETE /coupons failed, attempting Supabase fallback:', apiErr);
    }

    const { error } = await supabase.from('coupons').delete().eq('id', id);
    if (error) throw error;
    return true;
  },

  async toggleCoupon(id: string, isActive: boolean) {
    const { data, error } = await supabase
      .from('coupons')
      .update({ is_active: isActive })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
