import { api } from '../lib/api';
import fallbackJobsRaw from '../data/jobs.json';

export interface JobListing {
  id: string;
  slug: string;
  title: string;
  company: string;
  company_logo: string;
  location: string;
  work_mode: 'Remote' | 'Hybrid' | 'On-site';
  employment_type: 'Full-time' | 'Internship' | 'Contract';
  experience_level: string;
  salary_range: string;
  category: string;
  skills: string[];
  description: string;
  requirements: string[];
  benefits: string[];
  posted_date: string;
  application_deadline: string;
  external_apply_url?: string;
  is_bookmarked?: boolean;
}

export const jobService = {
  async getAll(filters?: { category?: string; workMode?: string; employmentType?: string; search?: string }): Promise<JobListing[]> {
    try {
      const res = await api.get('/jobs', { params: filters });
      if (res.data?.success && Array.isArray(res.data.data)) return res.data.data;
    } catch {}
    let list = fallbackJobsRaw.jobs as unknown as JobListing[];
    if (filters?.category && filters.category !== 'all') list = list.filter(j => j.category.toLowerCase().includes(filters.category!.toLowerCase()));
    if (filters?.workMode && filters.workMode !== 'all') list = list.filter(j => j.work_mode.toLowerCase() === filters.workMode!.toLowerCase());
    if (filters?.employmentType && filters.employmentType !== 'all') list = list.filter(j => j.employment_type.toLowerCase() === filters.employmentType!.toLowerCase());
    if (filters?.search) {
      const s = filters.search.toLowerCase();
      list = list.filter(j => j.title.toLowerCase().includes(s) || j.company.toLowerCase().includes(s) || j.skills.some(sk => sk.toLowerCase().includes(s)));
    }
    return list;
  },

  async getBySlug(slug: string): Promise<JobListing | null> {
    try {
      const res = await api.get(`/jobs/${slug}`);
      if (res.data?.success && res.data.data) return res.data.data;
    } catch {}
    const found = (fallbackJobsRaw.jobs as unknown as JobListing[]).find(j => j.slug === slug || j.id === slug);
    return found || null;
  },

  async toggleBookmark(jobId: string): Promise<{ bookmarked: boolean }> {
    try {
      const res = await api.post(`/jobs/${jobId}/bookmark`);
      if (res.data?.success) return res.data.data;
    } catch {}
    return { bookmarked: true };
  },

  async getBookmarks(): Promise<JobListing[]> {
    try {
      const res = await api.get('/jobs/bookmarks');
      if (res.data?.success && Array.isArray(res.data.data)) return res.data.data;
    } catch {}
    return [];
  },

  async apply(jobId: string, notes: string = ''): Promise<any> {
    try {
      const res = await api.post(`/jobs/${jobId}/apply`, { notes });
      return res.data?.data;
    } catch {
      return { status: 'applied' };
    }
  },

  async getApplications(): Promise<any[]> {
    try {
      const res = await api.get('/jobs/applications');
      if (res.data?.success && Array.isArray(res.data.data)) return res.data.data;
    } catch {}
    return [];
  }
};
