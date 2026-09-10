import { api } from '../lib/api';
import { supabase } from '../lib/supabase';

export const adminService = {
  async getDashboardStats() {
    try {
      const res = await api.get('/admin/stats');
      if (res.data?.success && res.data.data) {
        return res.data.data;
      }
    } catch (apiErr) {
      console.warn('[AdminService] Backend API GET /admin/stats failed, attempting Supabase RPC fallback:', apiErr);
    }

    const { data, error } = await supabase.rpc('get_admin_dashboard_stats');
    if (error) throw error;
    return data;
  },

  async getUsers() {
    try {
      const res = await api.get('/admin/users');
      if (res.data?.success && Array.isArray(res.data.data)) {
        return res.data.data;
      }
    } catch (apiErr) {
      console.warn('[AdminService] Backend API GET /admin/users failed, attempting Supabase fallback:', apiErr);
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*, user_roles(roles(name))')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getTeachers() {
    try {
      const res = await api.get('/admin/teachers');
      if (res.data?.success && Array.isArray(res.data.data)) {
        return res.data.data;
      }
    } catch (apiErr) {
      console.warn('[AdminService] Backend API GET /admin/teachers failed, attempting Supabase fallback:', apiErr);
    }

    const { data, error } = await supabase
      .from('teachers')
      .select('*, profiles(*)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async updateTeacherVerification(teacherId: string, status: 'approved' | 'rejected' | 'suspended', verifiedBy: string) {
    try {
      const res = await api.patch(`/admin/teachers/${teacherId}/verify`, {
        status,
        rejectionReason: status === 'rejected' ? 'Application rejected by administration' : undefined
      });
      if (res.data?.success && res.data.data) {
        return res.data.data;
      }
    } catch (apiErr) {
      console.warn('[AdminService] Backend API PATCH /admin/teachers/:id/verify failed, attempting Supabase fallback:', apiErr);
    }

    const { data, error } = await supabase
      .from('teachers')
      .update({
        verification_status: status,
        verification_badge: status === 'approved',
        verified_at: status === 'approved' ? new Date().toISOString() : null,
        verified_by: verifiedBy
      })
      .eq('id', teacherId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getCourses() {
    try {
      const res = await api.get('/admin/courses');
      if (res.data?.success && Array.isArray(res.data.data)) {
        return res.data.data;
      }
    } catch (apiErr) {
      console.warn('[AdminService] Backend API GET /admin/courses failed, attempting Supabase fallback:', apiErr);
    }

    const { data, error } = await supabase
      .from('courses')
      .select('*, teachers(*, profiles(*)), categories(*)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async updateCourseStatus(courseId: string, status: 'draft' | 'under_review' | 'published' | 'unpublished' | 'archived') {
    try {
      const res = await api.patch(`/admin/courses/${courseId}/status`, { status });
      if (res.data?.success && res.data.data) {
        return res.data.data;
      }
    } catch (apiErr) {
      console.warn('[AdminService] Backend API PATCH /admin/courses/:id/status failed, attempting Supabase fallback:', apiErr);
    }

    const { data, error } = await supabase
      .from('courses')
      .update({
        status,
        published_at: status === 'published' ? new Date().toISOString() : null
      })
      .eq('id', courseId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getOrders() {
    const { data, error } = await supabase
      .from('orders')
      .select('*, profiles(*), payments(*)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getSettings() {
    const { data, error } = await supabase.from('platform_settings').select('*');
    if (error) throw error;
    return data;
  },

  async updateSetting(key: string, value: any, updatedBy: string) {
    const { data, error } = await supabase
      .from('platform_settings')
      .update({
        value,
        updated_by: updatedBy,
        updated_at: new Date().toISOString()
      })
      .eq('key', key)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
