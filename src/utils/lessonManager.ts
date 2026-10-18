import { VocabularyWord } from '../data/vocabulary';
import { normalizeHeadword } from './wordIdentity';

const STORAGE_KEYS = {
  ACTIVE_LESSON: 'wordsetu_active_lesson_v2',
  LIFETIME_ASSIGNED_IDS: 'wordsetu_lifetime_assigned_ids_v2',
  LIFETIME_ASSIGNED_NORMALIZED: 'wordsetu_lifetime_assigned_normalized_v2'
};

const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;
const WORDS_PER_LESSON = 10;

export interface ActiveLessonRecord {
  lessonNumber: number;
  startTime: number;
  assignedWordIds: string[];
  cycleDurationMs: number;
}

export interface LessonState {
  lessonNumber: number;
  words: VocabularyWord[];
  startTime: number;
  nextLessonTime: number;
  remainingMs: number;
  isPoolLow: boolean;
  isPoolExhausted: boolean;
  remainingEligibleCount: number;
  totalPoolSize: number;
  lifetimeAssignedCount: number;
}

export const LessonManager = {
  /**
   * Get all word IDs that have ever been assigned to this learner as daily new words.
   */
  getLifetimeAssignedIds(): Set<string> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LIFETIME_ASSIGNED_IDS);
      return new Set(data ? JSON.parse(data) : []);
    } catch {
      return new Set();
    }
  },

  /**
   * Get all normalized headwords that have ever been assigned.
   */
  getLifetimeAssignedNormalized(): Set<string> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LIFETIME_ASSIGNED_NORMALIZED);
      return new Set(data ? JSON.parse(data) : []);
    } catch {
      return new Set();
    }
  },

  /**
   * Persist newly assigned words into lifetime history so they are never assigned again.
   */
  markWordsAsAssigned(words: VocabularyWord[]): void {
    const idSet = this.getLifetimeAssignedIds();
    const normSet = this.getLifetimeAssignedNormalized();

    words.forEach(w => {
      idSet.add(w.id);
      normSet.add(w.normalized || normalizeHeadword(w.word));
    });

    try {
      localStorage.setItem(STORAGE_KEYS.LIFETIME_ASSIGNED_IDS, JSON.stringify(Array.from(idSet)));
      localStorage.setItem(STORAGE_KEYS.LIFETIME_ASSIGNED_NORMALIZED, JSON.stringify(Array.from(normSet)));
    } catch (e) {
      console.warn('LocalStorage error while persisting assigned history:', e);
    }
  },

  /**
   * Retrieve or create the deterministic active 24-hour lesson.
   * Ensures that words are locked for 24 hours, and when 24 hours elapse,
   * picks the next 10 eligible unused words without repeating any previously assigned words.
   */
  getActiveLessonState(allWords: VocabularyWord[]): LessonState {
    const now = Date.now();
    let record: ActiveLessonRecord | null = null;

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ACTIVE_LESSON);
      if (stored) {
        record = JSON.parse(stored);
      }
    } catch (e) {
      console.warn('LocalStorage parse error for active lesson:', e);
    }

    const lifetimeIds = this.getLifetimeAssignedIds();
    const lifetimeNorms = this.getLifetimeAssignedNormalized();

    // Check if an existing lesson is still active (within 24 hours)
    if (record && now < record.startTime + record.cycleDurationMs) {
      // Find the corresponding words in the master pool
      const activeWords = record.assignedWordIds
        .map(id => allWords.find(w => w.id === id))
        .filter((w): w is VocabularyWord => Boolean(w));

      // Calculate remaining unused words excluding already assigned ones
      const remainingUnused = allWords.filter(
        w => !lifetimeIds.has(w.id) && !lifetimeNorms.has(w.normalized)
      );

      const nextLessonTime = record.startTime + record.cycleDurationMs;
      const remainingMs = Math.max(0, nextLessonTime - now);

      return {
        lessonNumber: record.lessonNumber,
        words: activeWords,
        startTime: record.startTime,
        nextLessonTime,
        remainingMs,
        isPoolLow: remainingUnused.length > 0 && remainingUnused.length < WORDS_PER_LESSON,
        isPoolExhausted: activeWords.length === 0,
        remainingEligibleCount: remainingUnused.length,
        totalPoolSize: allWords.length,
        lifetimeAssignedCount: lifetimeIds.size
      };
    }

    // A new lesson must be assigned (either first visit or 24-hr cycle expired)
    const nextLessonNumber = record ? record.lessonNumber + 1 : 1;

    // Filter eligible words: Must NOT be in lifetime assigned IDs or normalized words
    const eligiblePool = allWords.filter(
      w => !lifetimeIds.has(w.id) && !lifetimeNorms.has(w.normalized || normalizeHeadword(w.word))
    );

    let selectedWords: VocabularyWord[] = [];
    let isPoolLow = false;
    let isPoolExhausted = false;

    if (eligiblePool.length === 0) {
      // Pool is completely exhausted!
      isPoolExhausted = true;
      selectedWords = [];
    } else if (eligiblePool.length < WORDS_PER_LESSON) {
      // Pool has fewer than 10 words remaining
      isPoolLow = true;
      selectedWords = [...eligiblePool];
    } else {
      // Select the first 10 eligible words deterministically
      selectedWords = eligiblePool.slice(0, WORDS_PER_LESSON);
    }

    // If we have selected words, permanently register them in lifetime history
    if (selectedWords.length > 0) {
      this.markWordsAsAssigned(selectedWords);
    }

    // Set new active lesson start time
    const newRecord: ActiveLessonRecord = {
      lessonNumber: nextLessonNumber,
      startTime: now,
      assignedWordIds: selectedWords.map(w => w.id),
      cycleDurationMs: TWENTY_FOUR_HOURS_MS
    };

    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_LESSON, JSON.stringify(newRecord));
    } catch (e) {
      console.warn('LocalStorage error while saving new active lesson:', e);
    }

    const nextLessonTime = now + TWENTY_FOUR_HOURS_MS;
    const remainingEligibleCount = Math.max(0, eligiblePool.length - selectedWords.length);

    return {
      lessonNumber: nextLessonNumber,
      words: selectedWords,
      startTime: now,
      nextLessonTime,
      remainingMs: TWENTY_FOUR_HOURS_MS,
      isPoolLow,
      isPoolExhausted,
      remainingEligibleCount,
      totalPoolSize: allWords.length,
      lifetimeAssignedCount: this.getLifetimeAssignedIds().size
    };
  },

  /**
   * Testing helper to advance to the next daily lesson immediately,
   * demonstrating that previous words are never recycled!
   */
  advanceToNextLesson(allWords: VocabularyWord[]): LessonState {
    const now = Date.now();
    let currentLessonNumber = 1;

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ACTIVE_LESSON);
      if (stored) {
        const parsed = JSON.parse(stored);
        currentLessonNumber = parsed.lessonNumber;
      }
    } catch (e) {
      console.warn(e);
    }

    // Expire the current lesson record by setting startTime back in time
    const expiredRecord: ActiveLessonRecord = {
      lessonNumber: currentLessonNumber,
      startTime: now - TWENTY_FOUR_HOURS_MS - 1000,
      assignedWordIds: [],
      cycleDurationMs: TWENTY_FOUR_HOURS_MS
    };

    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_LESSON, JSON.stringify(expiredRecord));
    } catch (e) {
      console.warn(e);
    }

    return this.getActiveLessonState(allWords);
  },

  /**
   * Reset vocabulary history (for user or testing if explicitly requested)
   */
  resetHistory(allWords: VocabularyWord[] = []): LessonState {
    try {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_LESSON);
      localStorage.removeItem(STORAGE_KEYS.LIFETIME_ASSIGNED_IDS);
      localStorage.removeItem(STORAGE_KEYS.LIFETIME_ASSIGNED_NORMALIZED);
    } catch (e) {
      console.warn(e);
    }
    return this.getActiveLessonState(allWords);
  }
};
