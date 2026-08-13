export const BADGES = [
  {
    id: 'first-query',
    title: 'First Query',
    description: 'Solved your very first SQL problem on SQL Play!',
    icon: 'Sparkles',
    color: 'from-amber-500 to-orange-500',
    conditionType: 'FIRST_SOLVE',
    conditionTarget: 1
  },
  {
    id: 'sql-apprentice',
    title: 'SQL Apprentice',
    description: 'Solved 5 SQL problems.',
    icon: 'Award',
    color: 'from-blue-500 to-cyan-500',
    conditionType: 'SOLVE_COUNT',
    conditionTarget: 5
  },
  {
    id: 'query-master',
    title: 'Query Master',
    description: 'Solved 25 SQL problems.',
    icon: 'ShieldCheck',
    color: 'from-indigo-500 to-purple-500',
    conditionType: 'SOLVE_COUNT',
    conditionTarget: 25
  },
  {
    id: 'half-century',
    title: 'Half Century',
    description: 'Solved 50 SQL problems.',
    icon: 'Trophy',
    color: 'from-emerald-500 to-teal-500',
    conditionType: 'SOLVE_COUNT',
    conditionTarget: 50
  },
  {
    id: 'century-club',
    title: 'Century Club',
    description: 'Solved 100 SQL problems!',
    icon: 'Crown',
    color: 'from-yellow-400 to-amber-600',
    conditionType: 'SOLVE_COUNT',
    conditionTarget: 100
  },
  {
    id: 'hardcore-solver',
    title: 'Hardcore Solver',
    description: 'Solved 10 Hard-level SQL challenges.',
    icon: 'Flame',
    color: 'from-rose-500 to-red-600',
    conditionType: 'HARD_SOLVE_COUNT',
    conditionTarget: 10
  },
  {
    id: 'streak-3',
    title: '3-Day On Fire',
    description: 'Maintained a 3-day daily solving streak.',
    icon: 'Zap',
    color: 'from-orange-500 to-amber-500',
    conditionType: 'STREAK_DAYS',
    conditionTarget: 3
  },
  {
    id: 'streak-7',
    title: '7-Day Unstoppable',
    description: 'Maintained a 7-day daily solving streak.',
    icon: 'Flame',
    color: 'from-orange-600 to-red-500',
    conditionType: 'STREAK_DAYS',
    conditionTarget: 7
  },
  {
    id: 'streak-30',
    title: 'Monthly Legend',
    description: 'Maintained a 30-day daily solving streak!',
    icon: 'Star',
    color: 'from-purple-600 to-pink-600',
    conditionType: 'STREAK_DAYS',
    conditionTarget: 30
  },
  {
    id: 'xp-1000',
    title: '1,000 XP Milestone',
    description: 'Accumulated 1,000 total XP points.',
    icon: 'Gem',
    color: 'from-cyan-400 to-blue-600',
    conditionType: 'TOTAL_XP',
    conditionTarget: 1000
  }
];
