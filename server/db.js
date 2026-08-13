import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'database.json');

const INITIAL_DATA = {
  users: [],
  submissions: [],
  comments: []
};

function loadDb() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      saveDb(INITIAL_DATA);
      return INITIAL_DATA;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (!parsed.comments) parsed.comments = [];
    return parsed;
  } catch (e) {
    console.error("Error reading database.json, initializing fresh db", e);
    saveDb(INITIAL_DATA);
    return INITIAL_DATA;
  }
}

function saveDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error("Error saving database.json", e);
  }
}

export const dbService = {
  getUsers: () => loadDb().users,
  
  findUserByEmailOrUsername: (identifier) => {
    if (!identifier) return null;
    const users = loadDb().users;
    const lower = identifier.toLowerCase();
    return users.find(u => (u.email && u.email.toLowerCase() === lower) || (u.username && u.username.toLowerCase() === lower));
  },

  findUserByEmail: (email) => {
    if (!email) return null;
    const users = loadDb().users;
    return users.find(u => u.email && u.email.toLowerCase() === email.toLowerCase());
  },

  findUserByUsername: (username) => {
    if (!username) return null;
    const users = loadDb().users;
    return users.find(u => u.username && u.username.toLowerCase() === username.toLowerCase());
  },

  findUserById: (id) => {
    const users = loadDb().users;
    return users.find(u => u.id === Number(id));
  },

  createUser: ({ username, email, password, firstName = '', lastName = '', age = '', avatar = '👨‍💻', role = 'Developer' }) => {
    const dbData = loadDb();
    const newId = dbData.users.length > 0 ? Math.max(...dbData.users.map(u => u.id)) + 1 : 1;
    const passwordHash = bcrypt.hashSync(password, 10);

    const newUser = {
      id: newId,
      username,
      email,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      age: age ? Number(age) : null,
      role: role || 'Developer',
      passwordHash,
      avatar,
      country: '🌐',
      totalXp: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastSolvedDate: null,
      streakFreezeCount: 1,
      solvedProblems: [],
      unlockedBadges: []
    };

    dbData.users.push(newUser);
    saveDb(dbData);
    return newUser;
  },

  recordSubmission: (userId, { problemId, query, xpEarned, newStreak, longestStreak, todayStr, badgeIds }) => {
    const dbData = loadDb();
    const user = dbData.users.find(u => u.id === Number(userId));
    if (!user) return null;

    user.totalXp += xpEarned;
    user.currentStreak = newStreak;
    user.longestStreak = Math.max(user.longestStreak, longestStreak);
    user.lastSolvedDate = todayStr;

    if (!user.solvedProblems.some(p => p.problemId === problemId)) {
      user.solvedProblems.push({
        problemId,
        pointsAwarded: xpEarned,
        solvedAt: new Date().toISOString()
      });
    }

    if (badgeIds && Array.isArray(badgeIds)) {
      badgeIds.forEach(bId => {
        if (!user.unlockedBadges.includes(bId)) {
          user.unlockedBadges.push(bId);
        }
      });
    }

    dbData.submissions.push({
      id: dbData.submissions.length + 1,
      userId,
      problemId,
      query,
      pointsAwarded: xpEarned,
      submittedAt: new Date().toISOString()
    });

    saveDb(dbData);
    return user;
  },

  getLeaderboard: () => {
    const users = loadDb().users;
    const sorted = [...users].sort((a, b) => b.totalXp - a.totalXp);
    return sorted.map((u, idx) => ({
      rank: idx + 1,
      username: u.username,
      avatar: u.avatar || '👨‍💻',
      points: u.totalXp,
      solved: u.solvedProblems ? u.solvedProblems.length : 0,
      streak: u.currentStreak || 0,
      level: Math.floor(Math.sqrt(u.totalXp / 20)) + 1,
      country: u.country || '🌐'
    }));
  },

  // -------------------------------------------------------------
  // PROBLEM COMMENTS & SOLUTIONS
  // -------------------------------------------------------------
  getCommentsForProblem: (problemId) => {
    const comments = loadDb().comments || [];
    return comments
      .filter(c => c.problemId === problemId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  addComment: ({ problemId, userId, username, avatar, content }) => {
    const dbData = loadDb();
    if (!dbData.comments) dbData.comments = [];

    const newComment = {
      id: dbData.comments.length + 1,
      problemId,
      userId,
      username,
      avatar: avatar || '👨‍💻',
      content,
      upvotes: 0,
      upvotedBy: [],
      createdAt: new Date().toISOString()
    };

    dbData.comments.push(newComment);
    saveDb(dbData);
    return newComment;
  },

  upvoteComment: (commentId, userId) => {
    const dbData = loadDb();
    if (!dbData.comments) return null;

    const comment = dbData.comments.find(c => c.id === Number(commentId));
    if (!comment) return null;

    if (!comment.upvotedBy) comment.upvotedBy = [];
    if (!comment.upvotedBy.includes(userId)) {
      comment.upvotedBy.push(userId);
      comment.upvotes += 1;
      saveDb(dbData);
    }
    return comment;
  }
};
