import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { supabase } from './supabase';

const normalizeApiUrl = (url: string): string => {
  const trimmed = url.trim().replace(/\/+$/, '');
  return trimmed.endsWith('/api/v1') ? trimmed : `${trimmed}/api/v1`;
};

const resolveDefaultApiUrl = (): string => {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') {
      return 'http://localhost:5000/api/v1';
    }
    if (host === 'mycourse.test' || host.endsWith('.mycourse.test')) {
      const isPort80OrEmpty = !window.location.port || window.location.port === '80';
      return isPort80OrEmpty ? 'http://api.mycourse.test/api/v1' : 'http://api.mycourse.test:5000/api/v1';
    }
  }
  if (import.meta.env.VITE_API_URL) {
    return normalizeApiUrl(import.meta.env.VITE_API_URL);
  }
  return 'http://localhost:5000/api/v1';
};

const API_BASE_URL = resolveDefaultApiUrl();

/**
 * Centralized Axios API Client
 * Automatically attaches Supabase JWT session token to all outgoing requests.
 */
export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
  withCredentials: true,
});

// Request Interceptor: Attach Supabase JWT
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      let token = null;
      try {
        const { data: { session } } = await supabase.auth.getSession();
        token = session?.access_token;
      } catch {
        // Supabase offline
      }

      if (!token && typeof window !== 'undefined') {
        const saved = localStorage.getItem('eduacademy_auth_session');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            token = parsed?.access_token;
          } catch {}
        }
      }

      if (token) {
        config.headers.set('Authorization', `Bearer ${token}`);
      }
    } catch (err) {
      console.warn('[API Client] Could not retrieve session for request:', err);
    }

    if (import.meta.env.DEV) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Unified error handling and response unwrapping
api.interceptors.response.use(
  (response: AxiosResponse) => {
    if (import.meta.env.DEV) {
      console.log(`[API Response] ${response.status} ${response.config.url}`);
    }
    return response;
  },
  async (error) => {
    const status = error.response?.status;
    const url = error.config?.url;
    const serverMessage = error.response?.data?.message || error.response?.data?.error;
    const errorCode = error.response?.data?.errorCode;

    if (import.meta.env.DEV) {
      console.error(`[API Error] status: ${status}, endpoint: ${url}, message: ${serverMessage || error.message}`);
    }

    if (status === 401) {
      console.warn('[API Client] Unauthorized request (401) on:', url);
    }

    const enhancedError = new Error(serverMessage || error.message || 'Network request failed');
    (enhancedError as any).status = status;
    (enhancedError as any).errorCode = errorCode;
    (enhancedError as any).response = error.response;

    return Promise.reject(enhancedError);
  }
);

export default api;
