import React, { createContext, useContext, useState, useEffect } from 'react';
import { calculateXpEarned, calculateLevelInfo, updateStreak, evaluateBadges, getTodayDateString } from '../services/gamification.js';
import { BADGES } from '../data/badges.js';
import { getProblemById } from '../data/problems/index.js';

const AppContext = createContext();

const STORAGE_KEY = 'sql_play_user_data_v2';
const TOKEN_KEY = 'sql_play_jwt_token';
const API_BASE = 'http://localhost:5000/api';

const DEFAULT_USER_STATE = {
  username: 'Guest Explorer',
  avatar: '👨‍💻',
  totalXp: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastSolvedDate: null,
  streakFreezeCount: 1,
  unlockedBadges: [],
  solvedProblems: [],
  submissionsHistory: []
};

function sanitizeUserState(rawUser) {
  if (!rawUser || typeof rawUser !== 'object') return DEFAULT_USER_STATE;
  return {
    ...DEFAULT_USER_STATE,
    ...rawUser,
    username: rawUser.username || DEFAULT_USER_STATE.username,
    avatar: rawUser.avatar || DEFAULT_USER_STATE.avatar,
    totalXp: typeof rawUser.totalXp === 'number' ? rawUser.totalXp : 0,
    currentStreak: typeof rawUser.currentStreak === 'number' ? rawUser.currentStreak : 0,
    longestStreak: typeof rawUser.longestStreak === 'number' ? rawUser.longestStreak : 0,
    streakFreezeCount: typeof rawUser.streakFreezeCount === 'number' ? rawUser.streakFreezeCount : 1,
    unlockedBadges: Array.isArray(rawUser.unlockedBadges) ? rawUser.unlockedBadges : [],
    solvedProblems: Array.isArray(rawUser.solvedProblems) ? rawUser.solvedProblems : [],
    submissionsHistory: Array.isArray(rawUser.submissionsHistory) ? rawUser.submissionsHistory : [],
  };
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return sanitizeUserState(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load local state", e);
    }
    return DEFAULT_USER_STATE;
  });

  const [authToken, setAuthToken] = useState(() => localStorage.getItem(TOKEN_KEY) || null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedProblemId, setSelectedProblemId] = useState('easy-1');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [successModalData, setSuccessModalData] = useState(null);
  const [deploymentModalOpen, setDeploymentModalOpen] = useState(false);

  // Sync state & session with server if token exists
  useEffect(() => {
    if (authToken && authToken !== 'offline-token') {
      fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${authToken}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(prev => sanitizeUserState({
            ...prev,
            ...data.user
          }));
        }
      })
      .catch(err => console.log("Offline mode or backend unreachable"));
    }
  }, [authToken]);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      if (authToken) localStorage.setItem(TOKEN_KEY, authToken);
      else localStorage.removeItem(TOKEN_KEY);
    } catch (e) {
      console.error("Failed to save state", e);
    }
  }, [user, authToken]);

  const levelInfo = calculateLevelInfo(user?.totalXp || 0);
  const solvedList = Array.isArray(user?.solvedProblems) ? user.solvedProblems : [];
  const solvedSet = new Set(solvedList.map(p => p.problemId));

  const openProblem = (problemId) => {
    setSelectedProblemId(problemId);
    setActiveTab('solve');
  };

  const handleLoginSuccess = (userData, token) => {
    setUser(sanitizeUserState(userData));
    setAuthToken(token);
    setAuthModalOpen(false);
  };

  const handleLogout = () => {
    setUser(DEFAULT_USER_STATE);
    setAuthToken(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleSolveSuccess = (problemId, attemptCount, usedHint) => {
    const problem = getProblemById(problemId);
    const isAlreadySolved = solvedSet.has(problemId);

    const xpResult = calculateXpEarned(problem.difficulty, attemptCount, usedHint);
    const xpToAdd = isAlreadySolved ? Math.round(xpResult.totalXp * 0.2) : xpResult.totalXp;

    const updatedStreakState = updateStreak({
      currentStreak: user?.currentStreak || 0,
      longestStreak: user?.longestStreak || 0,
      lastSolvedDate: user?.lastSolvedDate || null,
      streakFreezeCount: user?.streakFreezeCount || 0
    });

    const currentSolved = Array.isArray(user?.solvedProblems) ? user.solvedProblems : [];
    const currentSubmissions = Array.isArray(user?.submissionsHistory) ? user.submissionsHistory : [];
    const newTotalXp = (user?.totalXp || 0) + xpToAdd;

    const newSolvedProblems = isAlreadySolved 
      ? currentSolved 
      : [...currentSolved, {
          problemId,
          solvedAt: new Date().toISOString(),
          pointsAwarded: xpToAdd,
          attemptCount,
          usedHint,
          difficulty: problem.difficulty,
          category: problem.category
        }];

    const badgeCheck = evaluateBadges({
      ...user,
      totalXp: newTotalXp,
      currentStreak: updatedStreakState.currentStreak,
      solvedProblems: newSolvedProblems
    }, BADGES);

    // Save Updated User State
    const updatedUser = sanitizeUserState({
      ...user,
      totalXp: newTotalXp,
      currentStreak: updatedStreakState.currentStreak,
      longestStreak: updatedStreakState.longestStreak,
      lastSolvedDate: updatedStreakState.lastSolvedDate,
      streakFreezeCount: updatedStreakState.streakFreezeCount,
      unlockedBadges: badgeCheck.unlockedBadgeIds,
      solvedProblems: newSolvedProblems,
      submissionsHistory: [
        { problemId, isCorrect: true, submittedAt: new Date().toISOString() },
        ...currentSubmissions.slice(0, 49)
      ]
    });

    setUser(updatedUser);

    // Record submission to Express REST API backend if logged in
    if (authToken && authToken !== 'offline-token') {
      fetch(`${API_BASE}/submissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          problemId,
          query: problem.expected_query,
          xpEarned: xpToAdd,
          newStreak: updatedStreakState.currentStreak,
          longestStreak: updatedStreakState.longestStreak,
          todayStr: updatedStreakState.lastSolvedDate,
          badgeIds: badgeCheck.newlyUnlocked.map(b => b.id)
        })
      }).catch(err => console.log("Backend record async fallback"));
    }

    // Trigger Victory Celebration Modal
    setSuccessModalData({
      problem,
      xpEarned: xpToAdd,
      isFirstTry: attemptCount === 1,
      noHintUsed: !usedHint,
      isNewStreakDay: updatedStreakState.isNewStreakDay,
      newStreak: updatedStreakState.currentStreak,
      newlyUnlockedBadges: badgeCheck.newlyUnlocked,
      isAlreadySolved
    });
  };

  const buyStreakFreeze = () => {
    const COST = 100;
    if (user.totalXp < COST) {
      alert("You need 100 XP to purchase a Streak Freeze!");
      return false;
    }
    setUser(prev => ({
      ...prev,
      totalXp: prev.totalXp - COST,
      streakFreezeCount: prev.streakFreezeCount + 1
    }));
    return true;
  };

  const updateProfile = (name, avatar) => {
    setUser(prev => ({
      ...prev,
      username: name || prev.username,
      avatar: avatar || prev.avatar
    }));
  };

  const resetAllProgress = () => {
    if (window.confirm("Are you sure you want to reset your progress?")) {
      setUser(DEFAULT_USER_STATE);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return (
    <AppContext.Provider value={{
      user,
      levelInfo,
      solvedSet,
      authToken,
      authModalOpen,
      setAuthModalOpen,
      handleLoginSuccess,
      handleLogout,
      activeTab,
      setActiveTab,
      selectedProblemId,
      setSelectedProblemId,
      openProblem,
      handleSolveSuccess,
      soundEnabled,
      setSoundEnabled,
      successModalData,
      setSuccessModalData,
      buyStreakFreeze,
      updateProfile,
      resetAllProgress,
      deploymentModalOpen,
      setDeploymentModalOpen
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
