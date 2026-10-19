/**
 * IndexedDB Database Service for WordSetu & KathaSetu
 * Provides fast, high-capacity, persistent local storage for thousands of complete stories,
 * reading progress, user bookmarks, quizzes, and vocabulary decks.
 */

import { Story, ReadingProgressRecord, StoryBookmarkRecord, SavedStoryWord, BatchImportJob, StoryWishlistRecord } from '../types/story';

const DB_NAME = 'WordSetu360_DB';
const DB_VERSION = 3;

export const STORES = {
  STORIES: 'stories',
  READING_PROGRESS: 'reading_progress',
  BOOKMARKS: 'bookmarks',
  WISHLIST: 'wishlist',
  QUIZ_RESULTS: 'quiz_results',
  IMPORT_JOBS: 'import_jobs',
  SAVED_STORY_WORDS: 'saved_story_words',
  USER_STORIES: 'user_stories',
  READING_TESTS: 'reading_tests'
} as const;

class KathaSetuDatabase {
  private dbPromise: Promise<IDBDatabase> | null = null;

  private getDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        reject(new Error('IndexedDB is not supported in this environment'));
        return;
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Stories Store
        if (!db.objectStoreNames.contains(STORES.STORIES)) {
          const storyStore = db.createObjectStore(STORES.STORIES, { keyPath: 'id' });
          storyStore.createIndex('language', 'language', { unique: false });
          storyStore.createIndex('category', 'category', { unique: false });
          storyStore.createIndex('difficulty', 'difficulty', { unique: false });
          storyStore.createIndex('status', 'status', { unique: false });
          storyStore.createIndex('storyFamilyId', 'storyFamilyId', { unique: false });
          storyStore.createIndex('normalizedTitle', 'normalizedTitle', { unique: false });
          storyStore.createIndex('createdAt', 'createdAt', { unique: false });
        }

        // Reading Progress
        if (!db.objectStoreNames.contains(STORES.READING_PROGRESS)) {
          const progressStore = db.createObjectStore(STORES.READING_PROGRESS, { keyPath: 'storyId' });
          progressStore.createIndex('lastReadAt', 'lastReadAt', { unique: false });
          progressStore.createIndex('completed', 'completed', { unique: false });
        }

        // Bookmarks
        if (!db.objectStoreNames.contains(STORES.BOOKMARKS)) {
          const bookmarkStore = db.createObjectStore(STORES.BOOKMARKS, { keyPath: 'storyId' });
          bookmarkStore.createIndex('savedAt', 'savedAt', { unique: false });
        }

        // Quiz Results
        if (!db.objectStoreNames.contains(STORES.QUIZ_RESULTS)) {
          const quizStore = db.createObjectStore(STORES.QUIZ_RESULTS, { keyPath: 'id', autoIncrement: true });
          quizStore.createIndex('storyId', 'storyId', { unique: false });
          quizStore.createIndex('completedAt', 'completedAt', { unique: false });
        }

        // Import Jobs
        if (!db.objectStoreNames.contains(STORES.IMPORT_JOBS)) {
          db.createObjectStore(STORES.IMPORT_JOBS, { keyPath: 'id' });
        }

        // Saved Story Words
        if (!db.objectStoreNames.contains(STORES.SAVED_STORY_WORDS)) {
          const wordStore = db.createObjectStore(STORES.SAVED_STORY_WORDS, { keyPath: 'id' });
          wordStore.createIndex('storyId', 'storyId', { unique: false });
          wordStore.createIndex('savedAt', 'savedAt', { unique: false });
        }

        // User Stories (drafts / authored)
        if (!db.objectStoreNames.contains(STORES.USER_STORIES)) {
          const userStore = db.createObjectStore(STORES.USER_STORIES, { keyPath: 'id' });
          userStore.createIndex('createdAt', 'createdAt', { unique: false });
        }

        // Wishlist Store
        if (!db.objectStoreNames.contains(STORES.WISHLIST)) {
          const wishlistStore = db.createObjectStore(STORES.WISHLIST, { keyPath: 'id' });
          wishlistStore.createIndex('userId', 'userId', { unique: false });
          wishlistStore.createIndex('storyId', 'storyId', { unique: false });
          wishlistStore.createIndex('savedAt', 'savedAt', { unique: false });
        }

        // Reading Tests
        if (!db.objectStoreNames.contains(STORES.READING_TESTS)) {
          const testStore = db.createObjectStore(STORES.READING_TESTS, { keyPath: 'id', autoIncrement: true });
          testStore.createIndex('completedAt', 'completedAt', { unique: false });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    return this.dbPromise;
  }

  // --- Story Operations ---

  async upsertStory(story: Story): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.STORIES, 'readwrite');
      const store = tx.objectStore(STORES.STORIES);
      const req = store.put(story);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  async upsertStoriesBatch(stories: Story[]): Promise<{ added: number; updated: number }> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.STORIES, 'readwrite');
      const store = tx.objectStore(STORES.STORIES);
      let added = 0;
      let updated = 0;

      stories.forEach((story) => {
        store.put(story);
        added++;
      });

      tx.oncomplete = () => resolve({ added, updated });
      tx.onerror = () => reject(tx.error);
    });
  }

  async getStoryById(id: string): Promise<Story | null> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.STORIES, 'readonly');
      const store = tx.objectStore(STORES.STORIES);
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  }

  async getAllStories(language?: string): Promise<Story[]> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.STORIES, 'readonly');
      const store = tx.objectStore(STORES.STORIES);
      let req: IDBRequest;

      if (language && language !== 'all') {
        const index = store.index('language');
        req = index.getAll(language);
      } else {
        req = store.getAll();
      }

      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  async getStoriesCountByLanguage(): Promise<{ en: number; hi: number; ta: number; ml: number; total: number; drafts: number }> {
    const stories = await this.getAllStories();
    const counts = { en: 0, hi: 0, ta: 0, ml: 0, total: 0, drafts: 0 };

    stories.forEach((s) => {
      if (s.status === 'published') {
        counts.total++;
        if (s.language === 'en') counts.en++;
        else if (s.language === 'hi') counts.hi++;
        else if (s.language === 'ta') counts.ta++;
        else if (s.language === 'ml') counts.ml++;
      } else if (s.status === 'draft' || s.status === 'under_review') {
        counts.drafts++;
      }
    });

    return counts;
  }

  async deleteStory(id: string): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.STORIES, 'readwrite');
      const store = tx.objectStore(STORES.STORIES);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  // --- Reading Progress Operations ---

  async saveReadingProgress(record: ReadingProgressRecord): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.READING_PROGRESS, 'readwrite');
      const store = tx.objectStore(STORES.READING_PROGRESS);
      const req = store.put(record);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  async getReadingProgress(storyId: string): Promise<ReadingProgressRecord | null> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.READING_PROGRESS, 'readonly');
      const store = tx.objectStore(STORES.READING_PROGRESS);
      const req = store.get(storyId);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  }

  async getAllReadingProgress(): Promise<ReadingProgressRecord[]> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.READING_PROGRESS, 'readonly');
      const store = tx.objectStore(STORES.READING_PROGRESS);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  // --- Bookmark Operations ---

  async toggleBookmark(storyId: string, note?: string): Promise<boolean> {
    const db = await this.getDB();
    const existing = await this.isBookmarked(storyId);

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.BOOKMARKS, 'readwrite');
      const store = tx.objectStore(STORES.BOOKMARKS);

      if (existing) {
        const req = store.delete(storyId);
        req.onsuccess = () => resolve(false);
        req.onerror = () => reject(req.error);
      } else {
        const req = store.put({ storyId, savedAt: Date.now(), note });
        req.onsuccess = () => resolve(true);
        req.onerror = () => reject(req.error);
      }
    });
  }

  async isBookmarked(storyId: string): Promise<boolean> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.BOOKMARKS, 'readonly');
      const store = tx.objectStore(STORES.BOOKMARKS);
      const req = store.get(storyId);
      req.onsuccess = () => resolve(Boolean(req.result));
      req.onerror = () => reject(req.error);
    });
  }

  async getAllBookmarks(): Promise<StoryBookmarkRecord[]> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.BOOKMARKS, 'readonly');
      const store = tx.objectStore(STORES.BOOKMARKS);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  // --- Story Wishlist Operations ---

  async toggleWishlist(storyId: string, userId: string = 'default_user'): Promise<boolean> {
    const db = await this.getDB();
    const id = `${userId}:${storyId}`;
    const existing = await this.isWishlisted(storyId, userId);

    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.WISHLIST, 'readwrite');
      const store = tx.objectStore(STORES.WISHLIST);

      if (existing) {
        const req = store.delete(id);
        req.onsuccess = () => {
          this.syncLocalWishlistCache(userId, storyId, false);
          resolve(false);
        };
        req.onerror = () => reject(req.error);
      } else {
        const record: StoryWishlistRecord = { id, userId, storyId, savedAt: Date.now() };
        const req = store.put(record);
        req.onsuccess = () => {
          this.syncLocalWishlistCache(userId, storyId, true);
          resolve(true);
        };
        req.onerror = () => reject(req.error);
      }
    });
  }

  async isWishlisted(storyId: string, userId: string = 'default_user'): Promise<boolean> {
    // Check synchronous cache first for instant feedback
    const cached = this.getLocalWishlistSet(userId);
    if (cached.has(storyId)) return true;

    try {
      const db = await this.getDB();
      const id = `${userId}:${storyId}`;
      return new Promise((resolve) => {
        const tx = db.transaction(STORES.WISHLIST, 'readonly');
        const store = tx.objectStore(STORES.WISHLIST);
        const req = store.get(id);
        req.onsuccess = () => {
          const exists = Boolean(req.result);
          if (exists) this.syncLocalWishlistCache(userId, storyId, true);
          resolve(exists);
        };
        req.onerror = () => resolve(false);
      });
    } catch {
      return false;
    }
  }

  async removeFromWishlist(storyId: string, userId: string = 'default_user'): Promise<void> {
    const db = await this.getDB();
    const id = `${userId}:${storyId}`;
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.WISHLIST, 'readwrite');
      const store = tx.objectStore(STORES.WISHLIST);
      const req = store.delete(id);
      req.onsuccess = () => {
        this.syncLocalWishlistCache(userId, storyId, false);
        resolve();
      };
      req.onerror = () => reject(req.error);
    });
  }

  async getUserWishlistRecords(userId: string = 'default_user'): Promise<StoryWishlistRecord[]> {
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORES.WISHLIST, 'readonly');
        const store = tx.objectStore(STORES.WISHLIST);
        const index = store.index('userId');
        const req = index.getAll(userId);
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => reject(req.error);
      });
    } catch {
      return [];
    }
  }

  async getUserWishlistStories(userId: string = 'default_user'): Promise<Story[]> {
    const records = await this.getUserWishlistRecords(userId);
    const storyIds = new Set(records.map(r => r.storyId));
    this.getLocalWishlistSet(userId).forEach(id => storyIds.add(id));

    if (storyIds.size === 0) return [];

    const allStories = await this.getAllStories();
    const map = new Map(allStories.map(s => [s.id, s]));
    return Array.from(storyIds)
      .map(id => map.get(id))
      .filter((s): s is Story => Boolean(s));
  }

  getLocalWishlistSet(userId: string = 'default_user'): Set<string> {
    try {
      const raw = localStorage.getItem(`wordsetu_wishlist_${userId}`);
      return new Set(raw ? JSON.parse(raw) : []);
    } catch {
      return new Set();
    }
  }

  private syncLocalWishlistCache(userId: string, storyId: string, add: boolean): void {
    try {
      const set = this.getLocalWishlistSet(userId);
      if (add) set.add(storyId);
      else set.delete(storyId);
      localStorage.setItem(`wordsetu_wishlist_${userId}`, JSON.stringify(Array.from(set)));
      // Dispatch custom event so listeners know wishlist updated
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('wordsetu_wishlist_updated', { detail: { storyId, add } }));
      }
    } catch (e) {
      console.warn(e);
    }
  }

  // --- Saved Story Words ---

  async saveStoryWord(word: SavedStoryWord): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.SAVED_STORY_WORDS, 'readwrite');
      const store = tx.objectStore(STORES.SAVED_STORY_WORDS);
      const req = store.put(word);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  async getAllSavedStoryWords(): Promise<SavedStoryWord[]> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.SAVED_STORY_WORDS, 'readonly');
      const store = tx.objectStore(STORES.SAVED_STORY_WORDS);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  async removeSavedStoryWord(id: string): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.SAVED_STORY_WORDS, 'readwrite');
      const store = tx.objectStore(STORES.SAVED_STORY_WORDS);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  // --- Story Quiz Results ---

  async saveStoryQuizResult(result: { storyId: string; score: number; total: number; completedAt: number }): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.QUIZ_RESULTS, 'readwrite');
      const store = tx.objectStore(STORES.QUIZ_RESULTS);
      const req = store.add(result);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  async getAllStoryQuizResults(): Promise<Array<{ storyId: string; score: number; total: number; completedAt: number }>> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.QUIZ_RESULTS, 'readonly');
      const store = tx.objectStore(STORES.QUIZ_RESULTS);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  // --- Reading Test Results ---

  async saveReadingTestResult(result: { passageId: string; passageTitle: string; difficulty: string; wpm: number; score: number; total: number; completedAt: number }): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.READING_TESTS, 'readwrite');
      const store = tx.objectStore(STORES.READING_TESTS);
      const req = store.add(result);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  async getAllReadingTestResults(): Promise<Array<{ passageId: string; passageTitle: string; difficulty: string; wpm: number; score: number; total: number; completedAt: number }>> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.READING_TESTS, 'readonly');
      const store = tx.objectStore(STORES.READING_TESTS);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  // --- User Created Stories ---

  async saveUserStory(story: Story): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.USER_STORIES, 'readwrite');
      const store = tx.objectStore(STORES.USER_STORIES);
      const req = store.put(story);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  async getUserStories(): Promise<Story[]> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORES.USER_STORIES, 'readonly');
      const store = tx.objectStore(STORES.USER_STORIES);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  // --- Database Export and Import for Backups ---

  async exportFullDatabase(): Promise<string> {
    const stories = await this.getAllStories();
    const progress = await this.getAllReadingProgress();
    const bookmarks = await this.getAllBookmarks();
    const savedWords = await this.getAllSavedStoryWords();
    const userStories = await this.getUserStories();
    const quizResults = await this.getAllStoryQuizResults();
    const testResults = await this.getAllReadingTestResults();

    const backup = {
      version: DB_VERSION,
      exportedAt: new Date().toISOString(),
      stories,
      progress,
      bookmarks,
      savedWords,
      userStories,
      quizResults,
      testResults
    };

    return JSON.stringify(backup, null, 2);
  }

  async importDatabaseBackup(jsonString: string): Promise<{ importedCount: number }> {
    const data = JSON.parse(jsonString);
    if (!data.stories || !Array.isArray(data.stories)) {
      throw new Error('Invalid backup file format: missing stories array');
    }

    await this.upsertStoriesBatch(data.stories);
    return { importedCount: data.stories.length };
  }
}

export const kathaSetuDb = new KathaSetuDatabase();
