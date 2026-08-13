import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { dbService } from './db.js';
import { validateRealEmail, sendWelcomeEmail } from './emailService.js';

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'sqlplay_jwt_secret_key_2026_super_secret';

// Middleware
app.use(cors());
app.use(express.json());

// Root API Status route
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>SQL Play Backend REST API</title>
        <style>
          body { background: #07090e; color: #f8fafc; font-family: monospace; padding: 3rem; text-align: center; }
          .card { background: #0f172a; border: 1px solid #334155; padding: 2rem; border-radius: 1rem; max-width: 600px; margin: 0 auto; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
          h1 { color: #818cf8; margin-bottom: 0.5rem; }
          p { color: #94a3b8; font-size: 0.9rem; }
          a { display: inline-block; margin-top: 1.5rem; padding: 0.75rem 1.5rem; background: #6366f1; color: white; border-radius: 0.5rem; text-decoration: none; font-weight: bold; }
          a:hover { background: #4f46e5; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>🚀 SQL Play Backend REST API is Live!</h1>
          <p>This port (5000) serves the REST API endpoints for user authentication, email verification, live leaderboards, and database persistence.</p>
          <p style="color: #34d399; margin-top: 1rem;">Status: ONLINE & READY</p>
          <a href="http://localhost:3000">Open Web Application UI (localhost:3000) &rarr;</a>
        </div>
      </body>
    </html>
  `);
});

// Auth Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Authentication token required.' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token.' });
    req.user = user;
    next();
  });
}

// -------------------------------------------------------------
// AUTH ENDPOINTS
// -------------------------------------------------------------

// 1. User Registration with Real Email Validation & Confirmation Email
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password, firstName = '', lastName = '', age = '', role = 'Developer', avatar = '👨‍💻' } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    // STRICT REAL EMAIL VALIDATION
    const emailValidation = validateRealEmail(email);
    if (!emailValidation.valid) {
      return res.status(400).json({ error: emailValidation.reason });
    }

    const cleanEmail = emailValidation.email;

    // DUPLICATE EMAIL CHECK: Cannot register again with the same email address
    const existingEmailUser = dbService.findUserByEmail(cleanEmail);
    if (existingEmailUser) {
      return res.status(400).json({ 
        error: `The email address "${cleanEmail}" is already registered. You cannot register again with the same email. Please sign in instead.` 
      });
    }

    // DUPLICATE USERNAME CHECK
    const existingUsernameUser = dbService.findUserByUsername(username);
    if (existingUsernameUser) {
      return res.status(400).json({ 
        error: `The username "${username}" is already taken. Please choose a different username.` 
      });
    }

    const newUser = dbService.createUser({ username, email: cleanEmail, password, firstName, lastName, age, role, avatar });
    const token = jwt.sign({ id: newUser.id, username: newUser.username, email: newUser.email }, JWT_SECRET, { expiresIn: '30d' });

    // Send Welcome & Confirmation Email to Real Email
    const emailResult = await sendWelcomeEmail(cleanEmail, username);

    return res.status(201).json({
      message: emailResult.success 
        ? `Account created! Confirmation email sent to ${cleanEmail}.` 
        : `Account created successfully!`,
      token,
      emailSent: emailResult.success,
      emailPreviewUrl: emailResult.previewUrl,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        age: newUser.age,
        role: newUser.role,
        avatar: newUser.avatar,
        totalXp: newUser.totalXp,
        currentStreak: newUser.currentStreak,
        longestStreak: newUser.longestStreak,
        lastSolvedDate: newUser.lastSolvedDate,
        streakFreezeCount: newUser.streakFreezeCount,
        solvedProblems: [],
        unlockedBadges: []
      }
    });
  } catch (err) {
    console.error("Register Error:", err);
    return res.status(500).json({ error: 'Internal server error during registration.' });
  }
});

// 2. User Login
app.post('/api/auth/login', (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;

    if (!emailOrUsername || !password) {
      return res.status(400).json({ error: 'Please enter your username/email and password.' });
    }

    const user = dbService.findUserByEmailOrUsername(emailOrUsername);
    if (!user) {
      return res.status(401).json({ error: 'Invalid username/email or password.' });
    }

    const isMatch = bcrypt.compareSync(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid username/email or password.' });
    }

    const token = jwt.sign({ id: user.id, username: user.username, email: user.email }, JWT_SECRET, { expiresIn: '30d' });

    return res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        age: user.age || null,
        role: user.role || 'Developer',
        avatar: user.avatar,
        totalXp: user.totalXp,
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak,
        lastSolvedDate: user.lastSolvedDate,
        streakFreezeCount: user.streakFreezeCount,
        solvedProblems: user.solvedProblems || [],
        unlockedBadges: user.unlockedBadges || []
      }
    });
  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json({ error: 'Internal server error during login.' });
  }
});

// 3. Fetch Authenticated User Profile
app.get('/api/auth/me', authenticateToken, (req, res) => {
  try {
    const user = dbService.findUserById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });

    return res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        age: user.age || null,
        role: user.role || 'Developer',
        avatar: user.avatar,
        totalXp: user.totalXp,
        currentStreak: user.currentStreak,
        longestStreak: user.longestStreak,
        lastSolvedDate: user.lastSolvedDate,
        streakFreezeCount: user.streakFreezeCount,
        solvedProblems: user.solvedProblems || [],
        unlockedBadges: user.unlockedBadges || []
      }
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch user session.' });
  }
});

// 4. Submissions Endpoint
app.post('/api/submissions', authenticateToken, (req, res) => {
  try {
    const { problemId, query, xpEarned, newStreak, longestStreak, todayStr, badgeIds } = req.body;
    const updatedUser = dbService.recordSubmission(req.user.id, {
      problemId, query, xpEarned, newStreak, longestStreak, todayStr, badgeIds
    });

    return res.json({ success: true, message: 'Submission recorded!', user: updatedUser });
  } catch (err) {
    console.error("Submission Error:", err);
    return res.status(500).json({ error: 'Failed to record submission.' });
  }
});

// 5. Global Leaderboard Endpoint
app.get('/api/leaderboard', (req, res) => {
  try {
    const leaderboard = dbService.getLeaderboard();
    return res.json({ leaderboard });
  } catch (err) {
    console.error("Leaderboard Error:", err);
    return res.status(500).json({ error: 'Failed to fetch leaderboard.' });
  }
});

// -------------------------------------------------------------
// COMMUNITY DISCUSSIONS & SOLUTION TIPS ENDPOINTS
// -------------------------------------------------------------

// 1. Fetch comments for a problem
app.get('/api/problems/:problemId/comments', (req, res) => {
  try {
    const { problemId } = req.params;
    const comments = dbService.getCommentsForProblem(problemId);
    return res.json({ comments });
  } catch (err) {
    console.error("Fetch Comments Error:", err);
    return res.status(500).json({ error: 'Failed to fetch problem comments.' });
  }
});

// 2. Post a comment / solution tip
app.post('/api/problems/:problemId/comments', authenticateToken, (req, res) => {
  try {
    const { problemId } = req.params;
    const { content } = req.body;
    const user = dbService.findUserById(req.user.id);

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Comment content cannot be empty.' });
    }

    const comment = dbService.addComment({
      problemId,
      userId: user.id,
      username: user.username,
      avatar: user.avatar,
      content: content.trim()
    });

    return res.status(201).json({ success: true, comment });
  } catch (err) {
    console.error("Post Comment Error:", err);
    return res.status(500).json({ error: 'Failed to post comment.' });
  }
});

// 3. Upvote a comment
app.post('/api/comments/:commentId/upvote', authenticateToken, (req, res) => {
  try {
    const { commentId } = req.params;
    const updated = dbService.upvoteComment(commentId, req.user.id);
    return res.json({ success: true, comment: updated });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to upvote comment.' });
  }
});

// Start Express REST API Server
app.listen(PORT, () => {
  console.log(`🚀 SQL Play Backend REST API server running on http://localhost:${PORT}`);
});
