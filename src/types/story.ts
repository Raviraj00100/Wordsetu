export type StoryLanguage = 'en' | 'hi' | 'ta' | 'ml';

export type StoryDifficulty = 'beginner' | 'intermediate' | 'advanced';

export type StoryStatus = 'published' | 'draft' | 'under_review';

export type StoryContentType =
  | 'verified_true'
  | 'historical_account'
  | 'biography'
  | 'inspired_real_life'
  | 'original_fiction'
  | 'traditional_folklore';

export interface StoryQuizQuestion {
  id: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
}

export interface StoryChapter {
  chapterNumber: number;
  title: string;
  content: string;
}

export interface Story {
  id: string;
  title: string;
  normalizedTitle: string;
  language: StoryLanguage;
  category: string;
  shortDescription: string;
  content: string; // Full story text or primary text
  chapters?: StoryChapter[];
  author: string;
  source: string;
  difficulty: StoryDifficulty;
  readingTimeMinutes: number;
  coverImage?: string;
  coverColor?: string;
  status: StoryStatus;
  createdAt: number;
  updatedAt: number;
  storyFamilyId?: string; // Links translations of the same story across languages
  isAiGenerated?: boolean;
  region?: string;
  moral?: string;
  characters?: string[];
  viewsCount?: number;
  likesCount?: number;
  quiz?: StoryQuizQuestion[];
  contentType?: StoryContentType;
  isWishlisted?: boolean;
  wishlistCount?: number;
  verifiedSource?: string;
}

export interface ReadingProgressRecord {
  storyId: string;
  scrollPercentage: number;
  currentChapter?: number;
  completed: boolean;
  lastReadAt: number;
  timeSpentSeconds: number;
}

export interface StoryBookmarkRecord {
  storyId: string;
  savedAt: number;
  note?: string;
}

export interface StoryWishlistRecord {
  id: string; // `${userId}:${storyId}`
  userId: string;
  storyId: string;
  savedAt: number;
  notes?: string;
}

export interface SavedStoryWord {
  id: string;
  word: string;
  storyId: string;
  storyTitle: string;
  contextSentence: string;
  language: StoryLanguage;
  savedAt: number;
  meaningEn?: string;
  meaningHi?: string;
  meaningTa?: string;
  meaningMl?: string;
}

export interface BatchImportJob {
  id: string;
  language: StoryLanguage | 'all';
  targetCount: number;
  currentCount: number;
  status: 'idle' | 'running' | 'paused' | 'completed' | 'failed';
  startedAt: number;
  completedAt?: number;
  logs: string[];
  duplicateCount: number;
  successCount: number;
  failureCount: number;
}

export interface LanguageStoryStats {
  en: number;
  hi: number;
  ta: number;
  ml: number;
  targetPerLanguage: number;
  totalPublished: number;
  draftsCount: number;
  reviewCount: number;
  duplicatesRejected: number;
}
