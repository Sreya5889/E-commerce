import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const DATA_FILE = path.resolve('server/data/notifications.json');

export const notificationStore = {
  getData() {
    try {
      if (!fs.existsSync(DATA_FILE)) {
        const initial = this.getInitialNotifications();
        fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2), 'utf8');
        return initial;
      }
      return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    } catch (e) {
      return this.getInitialNotifications();
    }
  },

  saveData(data) {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
    } catch (e) {
      console.warn('Failed to persist notifications store:', e);
    }
  },

  getInitialNotifications() {
    return [
      {
        id: 'notif-1',
        user_id: 'demo-student-id',
        title: 'Continue Your Learning',
        message: 'Resume your course "Complete React JS Development". You were on Lesson 1: Introduction & State Management.',
        type: 'learning_reminder',
        category: 'course',
        action_url: '/learn/c001-react-complete',
        is_read: false,
        created_at: new Date(Date.now() - 3600000 * 2).toISOString()
      },
      {
        id: 'notif-2',
        user_id: 'demo-student-id',
        title: 'Daily Coding Challenge Live! ⚡',
        message: 'Solve today\'s Two-Sum algorithmic problem to earn +30 bonus XP and keep your streak alive.',
        type: 'coding_streak',
        category: 'codelab',
        action_url: '/codelab/daily',
        is_read: false,
        created_at: new Date(Date.now() - 3600000 * 5).toISOString()
      },
      {
        id: 'notif-3',
        user_id: 'demo-student-id',
        title: 'Daily Aptitude Sprint Ready 🎯',
        message: '5 quick quantitative and logical reasoning questions ready to test your placement readiness.',
        type: 'aptitude_challenge',
        category: 'aptitude',
        action_url: '/aptitude/daily-challenge',
        is_read: false,
        created_at: new Date(Date.now() - 3600000 * 12).toISOString()
      },
      {
        id: 'notif-4',
        user_id: 'demo-student-id',
        title: '5-Day Learning Streak Active! 🔥',
        message: 'Amazing dedication! You have maintained a 5-day consistent study rhythm. 2 days left to hit the 7-day milestone.',
        type: 'streak_milestone',
        category: 'streak',
        action_url: '/dashboard',
        is_read: true,
        created_at: new Date(Date.now() - 3600000 * 24).toISOString()
      },
      {
        id: 'notif-5',
        user_id: 'demo-student-id',
        title: 'New Milestone Unlocked 🏆',
        message: 'Congratulations! You unlocked the "Algorithm Apprentice" badge for passing your first CodeLab evaluation.',
        type: 'achievement_unlock',
        category: 'gamification',
        action_url: '/career/achievements',
        is_read: true,
        created_at: new Date(Date.now() - 3600000 * 48).toISOString()
      },
      {
        id: 'notif-6',
        user_id: 'demo-student-id',
        title: 'Career Benchmark Analysis Updated 🚀',
        message: 'Your readiness for Full Stack Developer is now 75%. Review your missing competencies and recommended next steps.',
        type: 'career_recommendation',
        category: 'career',
        action_url: '/career',
        is_read: true,
        created_at: new Date(Date.now() - 3600000 * 72).toISOString()
      }
    ];
  },

  getUserNotifications(userId) {
    const list = this.getData();
    const uid = userId || 'demo-student-id';
    return list.filter(n => n.user_id === uid || n.user_id === 'demo-student-id');
  },

  markAsRead(userId, notificationId) {
    const list = this.getData();
    const notif = list.find(n => n.id === notificationId);
    if (notif) {
      notif.is_read = true;
      notif.read_at = new Date().toISOString();
      this.saveData(list);
    }
    return notif;
  },

  markAllAsRead(userId) {
    const list = this.getData();
    const uid = userId || 'demo-student-id';
    list.forEach(n => {
      if (n.user_id === uid || uid === 'demo-student-id') {
        n.is_read = true;
        n.read_at = new Date().toISOString();
      }
    });
    this.saveData(list);
    return true;
  },

  createNotification({ userId, title, message, type = 'general', category = 'general', action_url = null }) {
    const list = this.getData();
    const newNotif = {
      id: `notif-${crypto.randomUUID()}`,
      user_id: userId || 'demo-student-id',
      title,
      message,
      type,
      category,
      action_url,
      is_read: false,
      created_at: new Date().toISOString()
    };
    list.unshift(newNotif);
    this.saveData(list);
    return newNotif;
  }
};
