import { api } from '../lib/api';
import { supabase } from '../lib/supabase';
import { FAQS } from '../constants/mockData';

const MOCK_FAQS_FORMATTED = FAQS.map((f, i) => ({
  id: `faq-${i + 1}`,
  question: f.question,
  answer: f.answer,
  category: 'General',
  is_published: true,
  sort_order: i + 1
}));

export const faqService = {
  async getFAQs() {
    try {
      const res = await api.get('/support/faq');
      if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
        return res.data.data;
      }
    } catch (apiErr) {
      console.warn('[FAQService] Backend API GET /support/faq failed, attempting Supabase fallback:', apiErr);
    }

    try {
      const { data, error } = await supabase
        .from('faq')
        .select('*')
        .eq('is_published', true)
        .order('sort_order', { ascending: true });

      if (!error && data && data.length > 0) return data;
    } catch (err) {
      console.warn('Supabase FAQs offline or empty, using catalog data:', err);
    }
    return MOCK_FAQS_FORMATTED;
  },

  async getAllFAQs() {
    try {
      const res = await api.get('/support/faq/all');
      if (res.data?.success && Array.isArray(res.data.data)) {
        return res.data.data;
      }
    } catch (apiErr) {
      console.warn('[FAQService] Backend API GET /support/faq/all failed, attempting Supabase fallback:', apiErr);
    }

    try {
      const { data, error } = await supabase
        .from('faq')
        .select('*')
        .order('sort_order', { ascending: true });

      if (!error && data && data.length > 0) return data;
    } catch (err) {
      console.warn('Supabase all FAQs offline or empty, using catalog data:', err);
    }
    return MOCK_FAQS_FORMATTED;
  },

  async createFAQ(question: string, answer: string, category?: string) {
    try {
      const res = await api.post('/support/faq', {
        question,
        answer,
        category: category || 'General'
      });
      if (res.data?.success && res.data.data) {
        return res.data.data;
      }
    } catch (apiErr) {
      console.warn('[FAQService] Backend API POST /support/faq failed, attempting Supabase fallback:', apiErr);
    }

    const { data, error } = await supabase
      .from('faq')
      .insert({ question, answer, category: category || 'General', is_published: true })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteFAQ(id: string) {
    try {
      const res = await api.delete(`/support/faq/${id}`);
      if (res.data?.success) {
        return true;
      }
    } catch (apiErr) {
      console.warn('[FAQService] Backend API DELETE /support/faq failed, attempting Supabase fallback:', apiErr);
    }

    const { error } = await supabase.from('faq').delete().eq('id', id);
    if (error) throw error;
    return true;
  },

  async updateFAQ(id: string, updates: { question?: string; answer?: string; is_published?: boolean }) {
    const { data, error } = await supabase
      .from('faq')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
