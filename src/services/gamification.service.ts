import { api } from '../lib/api';
import fallbackGamificationRaw from '../data/gamification.json';

export interface GamificationProfile {
  total_xp: number;
  current_level: number;
  level_title: string;
  current_streak: number;
  best_streak: number;
  unlocked_achievements: string[];
  levels: Array<{ level: number; title: string; min_xp: number; max_xp: number; badge_icon: string }>;
  achievements: Array<{ id: string; code: string; name: string; description: string; xp_reward: number; icon: string }>;
}

export const gamificationService = {
  async getProfile(): Promise<GamificationProfile> {
    try {
      const res = await api.get('/gamification/profile');
      if (res.data?.success && res.data.data) return res.data.data;
    } catch {}
    return {
      total_xp: 650,
      current_level: 3,
      level_title: 'Learner',
      current_streak: 4,
      best_streak: 12,
      unlocked_achievements: ['ach-001', 'ach-002', 'ach-003'],
      levels: fallbackGamificationRaw.levels as any,
      achievements: fallbackGamificationRaw.achievements as any
    };
  },

  async awardXp(amount: number, reason: string) {
    try {
      const res = await api.post('/gamification/xp', { amount, reason });
      return res.data?.data;
    } catch {
      return null;
    }
  },

  async awardXP(reason: string, details?: any) {
    const xpMap: Record<string, number> = {
      codelab_solved: 50,
      daily_challenge: 100,
      project_completed: 250,
      interview_mastered: 25,
      mock_interview_completed: 150,
      aptitude_passed: 40
    };
    const amount = xpMap[reason] || 30;
    return this.awardXp(amount, reason);
  },

  async getUserStreak() {
    const profile = await this.getProfile();
    return {
      currentStreak: profile.current_streak || 3,
      highestStreak: profile.best_streak || 7
    };
  }
};

