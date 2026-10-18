import { DictionaryEntry } from '../data/dictionaryDatabase';

const STORAGE_KEYS = {
  LANGUAGE: 'wordsetu_language',
  LEARNED_WORDS: 'wordsetu_learned_words',
  SAVED_WORDS: 'wordsetu_saved_words',
  SAVED_CUSTOM_ENTRIES: 'wordsetu_saved_custom_entries',
  LESSON_CYCLE_START: 'wordsetu_lesson_cycle_start',
  QUIZ_RESULTS: 'wordsetu_quiz_results'
};

const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

export const StorageService = {
  getLanguage(): string {
    try {
      return localStorage.getItem(STORAGE_KEYS.LANGUAGE) || 'hi';
    } catch {
      return 'hi';
    }
  },

  setLanguage(langCode: string): void {
    try {
      localStorage.setItem(STORAGE_KEYS.LANGUAGE, langCode);
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  },

  getLearnedWords(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LEARNED_WORDS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  toggleLearnedWord(wordId: string): string[] {
    const current = this.getLearnedWords();
    const next = current.includes(wordId)
      ? current.filter(id => id !== wordId)
      : [...current, wordId];
    try {
      localStorage.setItem(STORAGE_KEYS.LEARNED_WORDS, JSON.stringify(next));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
    return next;
  },

  getSavedWordIds(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SAVED_WORDS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  toggleSavedWordId(wordId: string): string[] {
    const current = this.getSavedWordIds();
    const next = current.includes(wordId)
      ? current.filter(id => id !== wordId)
      : [...current, wordId];
    try {
      localStorage.setItem(STORAGE_KEYS.SAVED_WORDS, JSON.stringify(next));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
    return next;
  },

  getCustomSavedEntries(): DictionaryEntry[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SAVED_CUSTOM_ENTRIES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveCustomEntry(entry: DictionaryEntry): void {
    try {
      const current = this.getCustomSavedEntries().filter(item => item.id !== entry.id);
      current.unshift(entry);
      localStorage.setItem(STORAGE_KEYS.SAVED_CUSTOM_ENTRIES, JSON.stringify(current));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  },

  removeCustomEntry(id: string): void {
    try {
      const current = this.getCustomSavedEntries().filter(item => item.id !== id);
      localStorage.setItem(STORAGE_KEYS.SAVED_CUSTOM_ENTRIES, JSON.stringify(current));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  },

  /**
   * Initializes or gets the persistent 24-hour lesson countdown cycle.
   * If the 24 hours have fully expired, advances the cycle while retaining
   * accurate continuity across page refreshes.
   */
  getLessonCycle(): { cycleStart: number; nextLessonTime: number; remainingMs: number } {
    const now = Date.now();
    let startTime: number;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.LESSON_CYCLE_START);
      if (stored) {
        startTime = parseInt(stored, 10);
      } else {
        const todayMidnight = new Date();
        todayMidnight.setHours(0, 0, 0, 0);
        startTime = todayMidnight.getTime();
        localStorage.setItem(STORAGE_KEYS.LESSON_CYCLE_START, startTime.toString());
      }
    } catch {
      startTime = Date.now();
    }

    // Check if 24 hours cycle elapsed
    let nextLessonTime = startTime + TWENTY_FOUR_HOURS_MS;
    if (now >= nextLessonTime) {
      const cyclesPassed = Math.floor((now - startTime) / TWENTY_FOUR_HOURS_MS);
      startTime = startTime + (cyclesPassed * TWENTY_FOUR_HOURS_MS);
      nextLessonTime = startTime + TWENTY_FOUR_HOURS_MS;
      try {
        localStorage.setItem(STORAGE_KEYS.LESSON_CYCLE_START, startTime.toString());
      } catch (e) {
        console.warn('LocalStorage error:', e);
      }
    }

    const remainingMs = Math.max(0, nextLessonTime - now);
    return { cycleStart: startTime, nextLessonTime, remainingMs };
  },

  getQuizScore(): { lastScore: number; lastTotal: number; timestamp: number } | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.QUIZ_RESULTS);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  saveQuizScore(score: number, total: number): void {
    try {
      localStorage.setItem(
        STORAGE_KEYS.QUIZ_RESULTS,
        JSON.stringify({ score, total, timestamp: Date.now() })
      );
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }
};
