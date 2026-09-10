import { api } from '../lib/api';
import { supabase } from '../lib/supabase';

export const certificateService = {
  async getUserCertificates(userId: string) {
    try {
      const res = await api.get('/certificates');
      if (res.data?.success && Array.isArray(res.data.data)) {
        return res.data.data;
      }
    } catch (apiErr) {
      console.warn('[CertificateService] Backend API GET /certificates failed, attempting Supabase fallback:', apiErr);
    }

    const { data, error } = await supabase
      .from('certificates')
      .select('*, courses(*, teachers(*, profiles(*)))')
      .eq('user_id', userId)
      .order('issued_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async generateCertificate(userId: string, courseId: string) {
    const { data, error } = await supabase.rpc('generate_certificate', {
      p_user_id: userId,
      p_course_id: courseId
    });

    if (error) throw error;
    return data[0];
  },

  async verifyCertificate(code: string) {
    try {
      const res = await api.get(`/certificates/verify/${code}`);
      if (res.data?.success && res.data.data) {
        return res.data.data;
      }
    } catch (apiErr) {
      console.warn('[CertificateService] Backend API verify certificate failed, attempting Supabase RPC fallback:', apiErr);
    }

    const { data, error } = await supabase.rpc('verify_certificate', {
      p_verification_code: code
    });

    if (error) throw error;
    return data[0];
  }
};
