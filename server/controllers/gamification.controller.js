import { gamificationStore } from '../utils/gamificationStore.js';

export const gamificationController = {
  getProfile(req, res) {
    const userId = req.user?.id || 'demo-student-id';
    const profile = gamificationStore.getUserProfile(userId);
    const levels = gamificationStore.getLevels();
    const achievements = gamificationStore.getAchievements();
    res.json({
      success: true,
      data: {
        ...profile,
        levels,
        achievements
      }
    });
  },

  getAchievements(req, res) {
    const data = gamificationStore.getAchievements();
    res.json({ success: true, data });
  },

  awardXp(req, res) {
    const userId = req.user?.id || 'demo-student-id';
    const { amount, reason } = req.body;
    const updated = gamificationStore.awardXp(userId, parseInt(amount, 10) || 10, reason || 'Action');
    res.json({ success: true, data: updated });
  }
};
