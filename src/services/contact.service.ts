import { api } from '../lib/api';
import { supabase } from '../lib/supabase';

export const contactService = {
  async submitContactForm(name: string, email: string, subject: string, message: string, phone?: string) {
    try {
      const res = await api.post('/support/contact', {
        name,
        email,
        subject,
        message,
        phone: phone || null
      });
      if (res.data?.success && res.data.data) {
        return res.data.data;
      }
    } catch (apiErr) {
      console.warn('[ContactService] Backend API POST /support/contact failed, attempting Supabase fallback:', apiErr);
    }

    const { data, error } = await supabase
      .from('contact_messages')
      .insert({
        name,
        email,
        subject,
        message,
        phone: phone || null
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getContactMessages() {
    try {
      const res = await api.get('/support/contact');
      if (res.data?.success && Array.isArray(res.data.data)) {
        return res.data.data;
      }
    } catch (apiErr) {
      console.warn('[ContactService] Backend API GET /support/contact failed, attempting Supabase fallback:', apiErr);
    }

    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async resolveContactMessage(id: string) {
    try {
      const res = await api.patch(`/support/contact/${id}/resolve`);
      if (res.data?.success && res.data.data) {
        return res.data.data;
      }
    } catch (apiErr) {
      console.warn('[ContactService] Backend API PATCH /support/contact/:id/resolve failed, attempting Supabase fallback:', apiErr);
    }

    const { data, error } = await supabase
      .from('contact_messages')
      .update({ is_resolved: true, resolved_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteContactMessage(id: string) {
    const { error } = await supabase.from('contact_messages').delete().eq('id', id);
    if (error) throw error;
    return true;
  }
};
