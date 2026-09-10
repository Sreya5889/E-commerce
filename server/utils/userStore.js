import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data');
const USERS_FILE = path.resolve(DATA_DIR, 'users.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Ensure users file exists
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([]), 'utf8');
}

export const userStore = {
  getAll() {
    try {
      const content = fs.readFileSync(USERS_FILE, 'utf8');
      return JSON.parse(content || '[]');
    } catch {
      return [];
    }
  },

  findByEmail(email) {
    const users = this.getAll();
    return users.find(u => u.email.toLowerCase() === (email || '').toLowerCase().trim()) || null;
  },

  findById(id) {
    const users = this.getAll();
    return users.find(u => u.id === id) || null;
  },

  create(userData) {
    const users = this.getAll();
    const existing = users.find(u => u.email.toLowerCase() === userData.email.toLowerCase().trim());
    if (existing) {
      throw new Error('User with this email already exists');
    }
    users.push(userData);
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
    return userData;
  },

  update(id, updates) {
    const users = this.getAll();
    const idx = users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    users[idx] = { ...users[idx], ...updates, updated_at: new Date().toISOString() };
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
    return users[idx];
  }
};
