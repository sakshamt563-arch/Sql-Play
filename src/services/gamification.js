/**
 * Calculates XP earned for solving a problem based on difficulty, attempt count, and hints used.
 */
export function calculateXpEarned(difficulty, attemptCount = 1, usedHint = false) {
  let basePoints = 10;
  if (difficulty === 'medium') basePoints = 25;
  if (difficulty === 'hard') basePoints = 50;

  let bonusXp = 0;
  if (attemptCount === 1) bonusXp += 5; // First try bonus
  if (!usedHint) bonusXp += 5; // No hints used bonus

  return {
    basePoints,
    bonusXp,
    totalXp: basePoints + bonusXp,
    isFirstTry: attemptCount === 1,
    noHintUsed: !usedHint
  };
}

/**
 * Calculates current level from total XP.
 * Level = floor(sqrt(XP / 20)) + 1
 */
export function calculateLevelInfo(totalXp = 0) {
  const level = Math.floor(Math.sqrt(totalXp / 20)) + 1;
  const prevLevelXp = 20 * Math.pow(level - 1, 2);
  const nextLevelXp = 20 * Math.pow(level, 2);
  
  const xpInCurrentLevel = totalXp - prevLevelXp;
  const xpNeededForLevel = nextLevelXp - prevLevelXp;
  const progressPercent = Math.min(100, Math.max(0, Math.round((xpInCurrentLevel / xpNeededForLevel) * 100)));

  return {
    level,
    prevLevelXp,
    nextLevelXp,
    xpInCurrentLevel,
    xpNeededForLevel,
    xpToNextLevel: nextLevelXp - totalXp,
    progressPercent
  };
}

/**
 * Updates user streak status when a problem is successfully solved.
 */
export function updateStreak(currentStreakState, todayStr = getTodayDateString()) {
  const { currentStreak = 0, longestStreak = 0, lastSolvedDate = null, streakFreezeCount = 0 } = currentStreakState;

  if (lastSolvedDate === todayStr) {
    // Already solved a problem today, streak stays intact
    return {
      currentStreak,
      longestStreak: Math.max(currentStreak, longestStreak),
      lastSolvedDate: todayStr,
      streakFreezeCount,
      streakSavedByFreeze: false,
      isNewStreakDay: false
    };
  }

  const yesterdayStr = getYesterdayDateString();

  if (lastSolvedDate === yesterdayStr) {
    // Consecutive day solve!
    const newStreak = currentStreak + 1;
    return {
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, longestStreak),
      lastSolvedDate: todayStr,
      streakFreezeCount,
      streakSavedByFreeze: false,
      isNewStreakDay: true
    };
  }

  // Missed 1 or more days
  if (lastSolvedDate && currentStreak > 0 && streakFreezeCount > 0) {
    // Protected by streak freeze power-up!
    const newStreak = currentStreak + 1;
    return {
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, longestStreak),
      lastSolvedDate: todayStr,
      streakFreezeCount: streakFreezeCount - 1,
      streakSavedByFreeze: true,
      isNewStreakDay: true
    };
  }

  // Streak reset
  const newStreak = 1;
  return {
    currentStreak: newStreak,
    longestStreak: Math.max(newStreak, longestStreak),
    lastSolvedDate: todayStr,
    streakFreezeCount,
    streakSavedByFreeze: false,
    isNewStreakDay: true
  };
}

export function getTodayDateString() {
  return new Date().toISOString().split('T')[0];
}

export function getYesterdayDateString() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

/**
 * Checks unlocked badges based on user stats.
 */
export function evaluateBadges(userState, allBadges) {
  const unlockedBadgeIds = new Set(userState.unlockedBadges || []);
  const newlyUnlocked = [];

  const solvedCount = userState.solvedProblems?.length || 0;
  const hardSolvedCount = (userState.solvedProblems || []).filter(p => p.difficulty === 'hard').length;
  const streak = userState.currentStreak || 0;
  const xp = userState.totalXp || 0;

  for (const badge of allBadges) {
    if (unlockedBadgeIds.has(badge.id)) continue;

    let conditionMet = false;
    switch (badge.conditionType) {
      case 'SOLVE_COUNT':
        conditionMet = solvedCount >= badge.conditionTarget;
        break;
      case 'HARD_SOLVE_COUNT':
        conditionMet = hardSolvedCount >= badge.conditionTarget;
        break;
      case 'STREAK_DAYS':
        conditionMet = streak >= badge.conditionTarget;
        break;
      case 'TOTAL_XP':
        conditionMet = xp >= badge.conditionTarget;
        break;
      case 'FIRST_SOLVE':
        conditionMet = solvedCount >= 1;
        break;
      default:
        break;
    }

    if (conditionMet) {
      unlockedBadgeIds.add(badge.id);
      newlyUnlocked.push(badge);
    }
  }

  return {
    unlockedBadgeIds: Array.from(unlockedBadgeIds),
    newlyUnlocked
  };
}

/**
 * Motivational victory messages based on performance.
 */
export function getRandomVictoryMessage(isFirstTry, difficulty) {
  const firstTryMessages = [
    "🔥 Flawless victory! Solved on your very first try!",
    "⚡ Lightning fast! You nailed it in 1 attempt!",
    "🎯 Bullseye! Pure SQL elegance on the first attempt!",
    "🌟 Outstanding! First-try solve, total mastery!"
  ];

  const hardMessages = [
    "🧠 Impressive! You just cracked a Hard-level SQL challenge!",
    "🏆 Grandmaster moves! Hard problem defeated!",
    "💪 Elite analytical skill! That was a tough query!"
  ];

  const generalMessages = [
    "🎉 Great job! Test cases passed!",
    "🚀 Clean execution! You're making serious progress!",
    "✨ Outstanding work! Keep building that momentum!",
    "🙌 You conquered this challenge!"
  ];

  if (isFirstTry) {
    return firstTryMessages[Math.floor(Math.random() * firstTryMessages.length)];
  }
  if (difficulty === 'hard') {
    return hardMessages[Math.floor(Math.random() * hardMessages.length)];
  }
  return generalMessages[Math.floor(Math.random() * generalMessages.length)];
}
