/**
 * User Learning Profile & Date-Based Progression Service for WordSetu
 * 
 * Implements strict requirements:
 * 1. Every new user starts on Day 1.
 * 2. Progression is strictly calendar date-based from the user's own start date:
 *    Lesson Day = 1 + number of calendar days elapsed since user's learning start date.
 * 3. Supports Day 1, Day 10, Day 100, Day 1000, Day 2000, Day 3000, Day 9000+ without limits.
 * 4. Page refresh does NOT advance the lesson number.
 * 5. Handles timezones consistently.
 * 6. Preserves previously assigned words, completed lessons, and missed lessons for revision.
 */

export interface UserLearningProfile {
  userId: string;
  learningStartDate: string; // 'YYYY-MM-DD' in user's local timezone
  learningStartTimeMs: number;
  timezone: string;
  calendarLessonDay: number; // 1 + elapsed calendar days
  assignedLessonNumber: number; // Current lesson user is actively studying
  completedLessonNumbers: number[];
  wordsMasteredIds: string[];
  revisionProgress: Record<string, number>;
  lastAssignedDate: string; // 'YYYY-MM-DD'
  lastLoginDate: string;
}

const PROFILE_STORAGE_KEY = 'wordsetu_user_learning_profile_v4';

function getLocalDateString(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseLocalDateToUtc(dateStr: string): number {
  const [year, month, day] = dateStr.split('-').map(Number);
  return Date.UTC(year, month - 1, day);
}

/**
 * Calculates calendar days elapsed between two 'YYYY-MM-DD' strings.
 */
export function calculateElapsedCalendarDays(startDateStr: string, currentDateStr: string): number {
  const startUtc = parseLocalDateToUtc(startDateStr);
  const currentUtc = parseLocalDateToUtc(currentDateStr);
  const diffMs = currentUtc - startUtc;
  return Math.max(0, Math.floor(diffMs / (24 * 60 * 60 * 1000)));
}

export const UserProfileService = {
  /**
   * Retrieves the current user's profile, or initializes a brand-new Day 1 profile if first visit.
   */
  getOrCreateProfile(userId: string = 'default_user'): UserLearningProfile {
    const todayStr = getLocalDateString();
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';

    try {
      const stored = localStorage.getItem(`${PROFILE_STORAGE_KEY}_${userId}`);
      if (stored) {
        const profile: UserLearningProfile = JSON.parse(stored);
        
        // Calculate date-based calendar lesson day
        const elapsedDays = calculateElapsedCalendarDays(profile.learningStartDate, todayStr);
        const calculatedCalendarDay = 1 + elapsedDays;
        
        // Update profile with current calendar day without overwriting user's active browsing lesson
        profile.calendarLessonDay = calculatedCalendarDay;
        profile.timezone = tz;
        profile.lastLoginDate = todayStr;

        // If today is a new calendar day and assigned was on previous calendar day, advance assigned
        if (profile.lastAssignedDate !== todayStr && profile.assignedLessonNumber < calculatedCalendarDay) {
          profile.assignedLessonNumber = calculatedCalendarDay;
          profile.lastAssignedDate = todayStr;
        }

        this.saveProfile(profile);
        return profile;
      }
    } catch (e) {
      console.warn('Error reading user profile:', e);
    }

    // Brand New User: Set Start Date to TODAY -> Guaranteed Day 1!
    const newProfile: UserLearningProfile = {
      userId,
      learningStartDate: todayStr,
      learningStartTimeMs: Date.now(),
      timezone: tz,
      calendarLessonDay: 1,
      assignedLessonNumber: 1,
      completedLessonNumbers: [],
      wordsMasteredIds: [],
      revisionProgress: {},
      lastAssignedDate: todayStr,
      lastLoginDate: todayStr
    };

    this.saveProfile(newProfile);
    return newProfile;
  },

  saveProfile(profile: UserLearningProfile): void {
    try {
      localStorage.setItem(`${PROFILE_STORAGE_KEY}_${profile.userId}`, JSON.stringify(profile));
    } catch (e) {
      console.warn('Error saving user profile:', e);
    }
  },

  /**
   * Set user's actively viewed lesson (for studying past or missed lessons).
   */
  setActiveLessonNumber(profile: UserLearningProfile, lessonNum: number): UserLearningProfile {
    profile.assignedLessonNumber = Math.max(1, lessonNum);
    this.saveProfile(profile);
    return profile;
  },

  /**
   * Mark a lesson as completed.
   */
  markLessonCompleted(profile: UserLearningProfile, lessonNum: number): UserLearningProfile {
    if (!profile.completedLessonNumbers.includes(lessonNum)) {
      profile.completedLessonNumbers.push(lessonNum);
      this.saveProfile(profile);
    }
    return profile;
  },

  /**
   * Helper to simulate a user who started N days ago (for testing Day 10, Day 100, Day 1,000, Day 2,000, Day 9,000).
   */
  simulateStartDateOffset(profile: UserLearningProfile, daysAgo: number): UserLearningProfile {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    profile.learningStartDate = getLocalDateString(d);
    profile.learningStartTimeMs = d.getTime();
    
    const todayStr = getLocalDateString();
    const elapsed = calculateElapsedCalendarDays(profile.learningStartDate, todayStr);
    profile.calendarLessonDay = 1 + elapsed;
    profile.assignedLessonNumber = profile.calendarLessonDay;
    profile.lastAssignedDate = todayStr;
    
    this.saveProfile(profile);
    return profile;
  }
};
