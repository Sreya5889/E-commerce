import { api } from '../lib/api';
import { supabase } from '../lib/supabase';
import { CATEGORIES } from '../constants/mockData';

const MOCK_CATEGORIES_FORMATTED = CATEGORIES.map(c => ({
  id: c.id,
  name: c.name,
  slug: c.slug,
  icon: c.icon,
  course_count: c.count,
  is_active: true
}));

export const categoryService = {
  async getCategories() {
    try {
      const res = await api.get('/categories');
      if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
        return res.data.data;
      }
    } catch (apiErr) {
      console.warn('[CategoryService] Backend API GET /categories failed, attempting Supabase fallback:', apiErr);
    }

    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*, subcategories(*)')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (!error && data && data.length > 0) return data;
    } catch (err) {
      console.warn('Supabase categories offline or empty, using catalog data:', err);
    }
    return MOCK_CATEGORIES_FORMATTED;
  },

  async getCategoryBySlug(slug: string) {
    try {
      const res = await api.get(`/categories/${slug}`);
      if (res.data?.success && res.data.data) {
        return res.data.data;
      }
    } catch (apiErr) {
      console.warn('[CategoryService] Backend API GET /categories/:slug failed, attempting Supabase fallback:', apiErr);
    }

    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*, subcategories(*)')
        .eq('slug', slug)
        .single();

      if (!error && data) return data;
    } catch (err) {
      console.warn('Supabase category by slug offline or not found, using catalog data:', err);
    }
    return MOCK_CATEGORIES_FORMATTED.find(c => c.slug === slug) || MOCK_CATEGORIES_FORMATTED[0];
  }
};
