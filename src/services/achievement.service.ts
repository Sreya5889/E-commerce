import { supabase } from '../lib/supabase';

export const achievementService = {
  async getAchievements() {
    const { data, error } = await supabase.from('achievements').select('*');
    if (error) throw error;
    return data;
  },

  async getUserAchievements(userId: string) {
    const { data, error } = await supabase
      .from('user_achievements')
      .select('*, achievements(*)')
      .eq('user_id', userId);

    if (error) throw error;
    return data;
  }
};
