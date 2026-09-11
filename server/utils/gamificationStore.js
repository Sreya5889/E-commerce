import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.resolve(__dirname, '../data/gamification.json');
const USER_PROFILES_FILE = path.resolve(__dirname, '../data/userGamification.json');

if (!fs.existsSync(USER_PROFILES_FILE)) {
  fs.writeFileSync(USER_PROFILES_FILE, JSON.stringify({}), 'utf8');
}

export const gamificationStore = {
  getData() {
    try {
      return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    } catch {
      return { levels: [], achievements: [], user_stats: {} };
    }
  },

  getProfiles() {
    try {
      return JSON.parse(fs.readFileSync(USER_PROFILES_FILE, 'utf8'));
    } catch {
      return {};
    }
  },

  saveProfiles(profiles) {
    fs.writeFileSync(USER_PROFILES_FILE, JSON.stringify(profiles, null, 2), 'utf8');
  },

  getUserProfile(userId) {
    const profiles = this.getProfiles();
    const fallbackStats = this.getData().user_stats || {};
    if (!profiles[userId]) {
      profiles[userId] = {
        total_xp: fallbackStats.total_xp || 350,
        current_level: 2,
        level_title: 'Explorer',
        current_streak: 3,
        best_streak: 7,
        unlocked_achievements: ['ach-001', 'ach-003'],
        updated_at: new Date().toISOString()
      };
      this.saveProfiles(profiles);
    }
    return profiles[userId];
  },

  awardXp(userId, amount, reason) {
    const profiles = this.getProfiles();
    const prof = this.getUserProfile(userId);
    prof.total_xp += amount;

    // Recalculate level
    const levels = this.getData().levels || [];
    for (const lvl of levels) {
      if (prof.total_xp >= lvl.min_xp && prof.total_xp <= lvl.max_xp) {
        prof.current_level = lvl.level;
        prof.level_title = lvl.title;
        break;
      }
    }
    profiles[userId] = prof;
    this.saveProfiles(profiles);
    return prof;
  },

  getAchievements() {
    return this.getData().achievements || [];
  },

  getLevels() {
    return this.getData().levels || [];
  }
};
