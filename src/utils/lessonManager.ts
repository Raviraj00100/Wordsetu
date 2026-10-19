import { VocabularyWord } from '../data/vocabulary';
import { normalizeHeadword } from './wordIdentity';
import { VocabularyExpansionEngine } from '../data/vocabularyExpansion';
import { UserProfileService, UserLearningProfile } from './userProfile';

const STORAGE_KEYS = {
  ACTIVE_LESSON_V4: 'wordsetu_active_lesson_v4',
  LIFETIME_ASSIGNED_IDS: 'wordsetu_lifetime_assigned_ids_v4',
  LIFETIME_ASSIGNED_NORMALIZED: 'wordsetu_lifetime_assigned_normalized_v4',
  LEARNING_STREAK: 'wordsetu_learning_streak',
  LAST_LEARN_DATE: 'wordsetu_last_learn_date'
};

export const WORDS_PER_LESSON = 20;

export interface LessonState {
  lessonNumber: number; // The lesson number currently active/displayed
  calendarLessonDay: number; // 1 + elapsed calendar days since user's start date
  words: VocabularyWord[];
  startTime: number;
  remainingMs: number;
  isPoolLow: boolean;
  isPoolExhausted: boolean;
  totalPoolSize: number;
  lifetimeAssignedCount: number;
  streakDays: number;
  completedLessonNumbers: number[];
  learningStartDate: string;
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

  getStreakDays(): number {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.LEARNING_STREAK);
      return stored ? parseInt(stored, 10) : 1;
    } catch {
      return 1;
    }
  },

  updateStreak(): number {
    try {
      const today = new Date().toDateString();
      const lastDate = localStorage.getItem(STORAGE_KEYS.LAST_LEARN_DATE);
      let streak = this.getStreakDays();

      if (lastDate !== today) {
        streak += 1;
        localStorage.setItem(STORAGE_KEYS.LEARNING_STREAK, streak.toString());
        localStorage.setItem(STORAGE_KEYS.LAST_LEARN_DATE, today);
      }
      return streak;
    } catch {
      return 1;
    }
  },

  /**
   * Retrieve active date-based lesson state.
   * New users ALWAYS start at Day 1.
   * Day number increases by 1 for each local calendar day elapsed since the user's start date.
   * Refreshing the page does NOT advance the day.
   */
  getActiveLessonState(allWords: VocabularyWord[], specificLessonNumber?: number): LessonState {
    const profile = UserProfileService.getOrCreateProfile();
    const streak = this.getStreakDays();
    const lifetimeIds = this.getLifetimeAssignedIds();

    // Determine the lesson day to display
    const activeLessonNum = specificLessonNumber || profile.assignedLessonNumber || profile.calendarLessonDay || 1;

    // Fetch the 20 words for this specific day
    const dayWords = VocabularyExpansionEngine.generateDayLesson(activeLessonNum, allWords);

    // Register assigned words so they are tracked
    this.markWordsAsAssigned(dayWords);

    // Calculate time until midnight for local 24-hr countdown
    const now = new Date();
    const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const remainingMs = Math.max(0, midnight.getTime() - now.getTime());

    return {
      lessonNumber: activeLessonNum,
      calendarLessonDay: profile.calendarLessonDay,
      words: dayWords,
      startTime: profile.learningStartTimeMs,
      remainingMs,
      isPoolLow: false,
      isPoolExhausted: false,
      totalPoolSize: 180000, // 9,000+ days capacity
      lifetimeAssignedCount: lifetimeIds.size,
      streakDays: streak,
      completedLessonNumbers: profile.completedLessonNumbers,
      learningStartDate: profile.learningStartDate
    };
  },

  /**
   * Navigate to a past lesson or missed lesson for revision.
   */
  selectLessonDay(dayNumber: number, allWords: VocabularyWord[]): LessonState {
    const profile = UserProfileService.getOrCreateProfile();
    UserProfileService.setActiveLessonNumber(profile, dayNumber);
    return this.getActiveLessonState(allWords, dayNumber);
  },

  /**
   * Mark current lesson completed.
   */
  markCurrentLessonCompleted(dayNumber: number): void {
    const profile = UserProfileService.getOrCreateProfile();
    UserProfileService.markLessonCompleted(profile, dayNumber);
  },

  /**
   * Advance to next lesson day manually (e.g. for testing or when completed).
   */
  advanceToNextLesson(allWords: VocabularyWord[]): LessonState {
    const profile = UserProfileService.getOrCreateProfile();
    const nextDay = (profile.assignedLessonNumber || 1) + 1;
    UserProfileService.setActiveLessonNumber(profile, nextDay);
    return this.getActiveLessonState(allWords, nextDay);
  }
};
