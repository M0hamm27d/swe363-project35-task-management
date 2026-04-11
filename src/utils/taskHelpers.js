/**
 * Helper to extract unique tags from a list of tasks.
 * @param {Array} tasks - List of task objects.
 * @returns {Array} List of unique tag objects { name, color }.
 */
export function extractTags(tasks) {
  const seen = new Set();
  return tasks
    .filter((t) => t.tag && !seen.has(t.tag.name) && seen.add(t.tag.name))
    .map((t) => ({ name: t.tag.name, color: t.tag.color }));
}

/**
 * Filter tasks by a selected view (inbox, day, week).
 * @param {Array} tasks - List of task objects.
 * @param {string} view - The view mode ('inbox', 'day', 'week').
 * @returns {Array} Filtered list of tasks.
 */
export function filterByView(tasks, view) {
  if (view === 'inbox') return tasks;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (view === 'day') {
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tasks.filter((t) => {
      const d = new Date(t.deadline);
      return d >= today && d < tomorrow;
    });
  }
  if (view === 'week') {
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    return tasks.filter((t) => {
      const d = new Date(t.deadline);
      return d >= today && d < nextWeek;
    });
  }
  return tasks;
}

/**
 * Calendar-specific helpers for date management.
 */
export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

export function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay(); // 0 (Sun) to 6 (Sat)
}

export function getStartOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  return d;
}

/**
 * Counts words in a string, trimming whitespace and splitting by non-word boundaries.
 * @param {string} text - The text to count words in.
 * @returns {number} The word count.
 */
export function countWords(text) {
  if (!text) return 0;
  const words = text.trim().split(/\s+/);
  return words[0] === '' ? 0 : words.length;
}
