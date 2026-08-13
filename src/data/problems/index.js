import { easyProblems } from './easyProblems.js';
import { mediumProblems } from './mediumProblems.js';
import { hardProblems } from './hardProblems.js';

export const allProblems = [
  ...easyProblems,
  ...mediumProblems,
  ...hardProblems
];

export const problemsMap = new Map(allProblems.map(p => [p.id, p]));

export function getProblemById(id) {
  return problemsMap.get(id) || allProblems[0];
}

export function filterProblems({ difficulty = 'all', category = 'all', status = 'all', searchQuery = '', solvedProblemIds = new Set() }) {
  return allProblems.filter(p => {
    // Difficulty filter
    if (difficulty !== 'all' && p.difficulty !== difficulty) {
      return false;
    }
    // Category filter
    if (category !== 'all' && p.category !== category) {
      return false;
    }
    // Status filter
    const isSolved = solvedProblemIds.has(p.id);
    if (status === 'solved' && !isSolved) return false;
    if (status === 'unsolved' && isSolved) return false;

    // Search query
    if (searchQuery && searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = (p.title || '').toLowerCase().includes(q);
      const matchCategory = (p.category || '').toLowerCase().includes(q);
      const tagsList = Array.isArray(p.tags) ? p.tags : (Array.isArray(p.tag) ? p.tag : []);
      const matchTags = tagsList.some(t => String(t).toLowerCase().includes(q));
      if (!matchTitle && !matchCategory && !matchTags) return false;
    }

    return true;
  });
}

export function getAllCategories() {
  const categories = new Set(allProblems.map(p => p.category));
  return Array.from(categories);
}

export function getAllTags() {
  const tags = new Set();
  allProblems.forEach(p => {
    const tagsList = Array.isArray(p.tags) ? p.tags : (Array.isArray(p.tag) ? p.tag : []);
    tagsList.forEach(t => tags.add(t));
  });
  return Array.from(tags);
}
