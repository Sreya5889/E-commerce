import { api } from '../lib/api';
import { supabase } from '../lib/supabase';

export const authService = {
  async register(email: string, password: string, fullName: string, role = 'student') {
    // 1. Primary: Central API client -> Express Backend REST API
    try {
      const res = await api.post('/auth/register', { email, password, fullName, role });
      if (res.data?.success && res.data.data) {
        const session = res.data.data.session;
        if (session) {
          localStorage.setItem('eduacademy_auth_session', JSON.stringify(session));
          try {
            if (session.access_token && session.refresh_token) {
              await supabase.auth.setSession(session);
            }
          } catch {
            // Supabase offline
          }
        }
        return res.data.data;
      }
    } catch (apiErr: any) {
      const msg = apiErr.response?.data?.message || apiErr.message;
      if (msg && !msg.includes('Network Error') && !msg.includes('fetch failed')) {
        throw new Error(msg);
      }
      console.warn('[AuthService] Backend API register failed, attempting direct Supabase fallback:', msg);
    }

    // 2. Direct Supabase fallback
    const nameParts = fullName.trim().split(' ');
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          first_name: nameParts[0] || '',
          last_name: nameParts.slice(1).join(' ') || '',
          role
        }
      }
    });

    if (error) throw error;
    if (data?.session) {
      localStorage.setItem('eduacademy_auth_session', JSON.stringify(data.session));
    }
    return data;
  },

  async login(email: string, password: string) {
    // 1. Primary: Central API client -> Express Backend REST API
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data?.success && res.data.data) {
        const session = res.data.data.session;
        if (session) {
          localStorage.setItem('eduacademy_auth_session', JSON.stringify(session));
          try {
            if (session.access_token && session.refresh_token) {
              await supabase.auth.setSession(session);
            }
          } catch {
            // Supabase offline
          }
        }
        return res.data.data;
      }
    } catch (apiErr: any) {
      const msg = apiErr.response?.data?.message || apiErr.message;
      if (msg && !msg.includes('Network Error') && !msg.includes('fetch failed')) {
        throw new Error(msg);
      }
      console.warn('[AuthService] Backend API login failed, attempting Supabase fallback:', msg);
    }

    // 2. Direct Supabase fallback
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    if (data?.session) {
      localStorage.setItem('eduacademy_auth_session', JSON.stringify(data.session));
    }
    return data;
  },

  async loginWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
    if (error) throw error;
    return data;
  },

  async logout() {
    localStorage.removeItem('eduacademy_auth_session');
    try {
      await api.post('/auth/logout');
    } catch {
      // Non-critical
    }
    try {
      await supabase.auth.signOut();
    } catch {
      // Non-critical
    }
    return true;
  },

  async resetPassword(email: string) {
    try {
      const res = await api.post('/auth/forgot-password', { email });
      if (res.data?.success) {
        return res.data;
      }
    } catch {
      // Fallback
    }

    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    if (error) throw error;
    return data;
  },

  async updatePassword(password: string) {
    const { data, error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
    return data;
  },

  async getSession() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) return session;
    } catch {
      // Supabase offline
    }

    const saved = localStorage.getItem('eduacademy_auth_session');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  },

  async getUser() {
    const session = await this.getSession();
    return session?.user || null;
  }
};
