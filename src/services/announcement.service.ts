import { supabase } from '../lib/supabase';

export const announcementService = {
  async getAnnouncements(audience = 'all') {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .eq('published', true)
      .in('target_audience', ['all', audience])
      .order('published_at', { ascending: false });

    if (error) throw error;
    return data;
  }
};
