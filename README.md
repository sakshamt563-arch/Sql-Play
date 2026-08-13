# SQL Play — Interactive SQL Learning & Practice Platform 🚀

**SQL Play** is a full-featured, gamified web application for practicing and mastering SQL directly in the browser. Powered by client-side WebAssembly SQLite (`sql.js`), it provides instant sandbox execution, real database output comparison, XP leveling, daily streak tracking, achievement badges, and a global leaderboard.

![SQL Play Banner](https://img.shields.io/badge/SQL%20Play-Gamified%20SQL%20Platform-6366f1?style=for-the-badge)

---

## ✨ Features

- 🧠 **300 SQL Problems**: 100 Easy, 100 Medium, and 100 Hard SQL problems covering SELECT, WHERE, Aggregations, GROUP BY, HAVING, INNER/LEFT JOINs, Subqueries, CTEs, and Window Functions.
- ⚡ **In-Browser WASM SQL Engine**: Runs SQLite WebAssembly locally in your browser — zero latency, zero backend database costs, and 100% private sandbox safety.
- 🏆 **Gamification & Rewards**: Earn XP points for every solved challenge, unlock level progression (Level 1–20+), collect achievement badges, and trigger celebratory confetti explosions!
- 🔥 **Daily Streak System**: Track your daily coding streak with flame counters and optional Streak Freeze protection.
- 📊 **Interactive Database Inspector**: View table schemas, column types, and preview seed data rows right inside the workspace IDE.
- 🌐 **Global Leaderboard**: Compete against top SQL learners, filter rankings by timeframe, and see your exact rank highlighted.
- 📚 **SQL Tutorial Hub**: Bite-sized lessons with interactive concepts and direct practice triggers.
- 🚀 **Deploy Anywhere**: Ready for instant 1-click deployment to Vercel, Netlify, or GitHub Pages.

---

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS + Custom Dark Theme Glassmorphism Design
- **Code Editor**: CodeMirror with SQL Syntax Highlighting & Autocompletion
- **SQL Execution**: `sql.js` (WebAssembly SQLite)
- **Visual FX**: `canvas-confetti`
- **Icons**: Lucide React

---

## 🚀 Quick Start (Local Development)

```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev

# 3. Open browser at http://localhost:3000
```

---

## 🌐 How to Publish Online for Public Access

### Option 1: Deploy to Vercel (Recommended)
```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Deploy with single command
vercel
```

### Option 2: Build Static Assets for Netlify or GitHub Pages
```bash
# Generate production bundle in dist/ directory
npm run build
```

---

## 📄 License
MIT License. Built with ❤️ for SQL learners everywhere!
