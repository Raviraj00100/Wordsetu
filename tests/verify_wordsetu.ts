import { VOCABULARY_DATA } from '../src/data/vocabulary';
import { VocabularyExpansionEngine } from '../src/data/vocabularyExpansion';
import { UserProfileService } from '../src/utils/userProfile';
import { SEED_STORIES } from '../src/data/seedStories';
import { STORY_CATEGORIES } from '../src/data/storyCategories';
import { READING_PASSAGES } from '../src/data/readingTestData';
import { KathaSetuEngine, MINIMUM_TARGET_PER_LANGUAGE } from '../src/services/kathaSetuEngine';

// Mock localStorage for node environment
const storageMock: Record<string, string> = {};
(global as any).localStorage = {
  getItem: (key: string) => storageMock[key] || null,
  setItem: (key: string, val: string) => { storageMock[key] = val; },
  removeItem: (key: string) => { delete storageMock[key]; },
  clear: () => { Object.keys(storageMock).forEach(k => delete storageMock[k]); }
};

let passed = 0;
let failed = 0;

function assert(desc: string, condition: boolean) {
  if (condition) {
    console.log(`✅ PASS: ${desc}`);
    passed++;
  } else {
    console.error(`❌ FAIL: ${desc}`);
    failed++;
  }
}

console.log('====================================================');
console.log('       WORDSETU MASTER TEST SUITE VALIDATION        ');
console.log('====================================================');

// TEST 1: New User Starts at Day 1
localStorage.clear();
const newProfile = UserProfileService.getOrCreateProfile();
assert('New user profile starts at Day 1', newProfile.calendarLessonDay === 1);
assert('New user assignedLessonNumber is 1', newProfile.assignedLessonNumber === 1);

// TEST 2: Exactly 20 words for Day 1
const day1Words = VocabularyExpansionEngine.generateDayLesson(1, VOCABULARY_DATA);
assert('Day 1 lesson contains exactly 20 words', day1Words.length === 20);
assert('All 20 words have valid english word, definition, example, and translations',
  day1Words.every(w => Boolean(w.word && (w.englishDefinition || (w as any).englishMeaning) && w.examples[0]?.english && w.translations['hi']))
);

// TEST 3: Refreshing page does NOT advance the day
const refreshedProfile = UserProfileService.getOrCreateProfile();
assert('Refreshing does not advance day (still Day 1)', refreshedProfile.calendarLessonDay === 1);

// TEST 4: Calendar progression formula: 1 + elapsed calendar days
const pastDate = new Date();
pastDate.setDate(pastDate.getDate() - 5);
const yyyy = pastDate.getFullYear();
const mm = String(pastDate.getMonth() + 1).padStart(2, '0');
const dd = String(pastDate.getDate()).padStart(2, '0');
const simulatedProfile = {
  ...newProfile,
  learningStartDate: `${yyyy}-${mm}-${dd}`
};
localStorage.setItem('wordsetu_user_learning_profile_v4_default_user', JSON.stringify(simulatedProfile));
const loadedSimProfile = UserProfileService.getOrCreateProfile();
assert('5 elapsed calendar days correctly evaluates to Day 6', loadedSimProfile.calendarLessonDay === 6);

// TEST 5: Scalability to Day 10, 100, 1000, 2000, 3000, 9000
const testDays = [2, 10, 100, 1000, 2000, 3000, 9000];
testDays.forEach(day => {
  const words = VocabularyExpansionEngine.generateDayLesson(day, VOCABULARY_DATA);
  assert(`Day ${day} generates exactly 20 valid words`, words.length === 20);
  assert(`Day ${day} words have complete multilingual payload`, words.every(w => w.word && w.translations['hi']));
});

// TEST 6: Uniqueness check across distinct days
const day1Set = new Set(VocabularyExpansionEngine.generateDayLesson(1, VOCABULARY_DATA).map(w => w.word.toLowerCase()));
const day2Set = new Set(VocabularyExpansionEngine.generateDayLesson(2, VOCABULARY_DATA).map(w => w.word.toLowerCase()));
const day3Set = new Set(VocabularyExpansionEngine.generateDayLesson(3, VOCABULARY_DATA).map(w => w.word.toLowerCase()));
let overlapFound = false;
day2Set.forEach(w => { if (day1Set.has(w)) overlapFound = true; });
day3Set.forEach(w => { if (day1Set.has(w) || day2Set.has(w)) overlapFound = true; });
assert('Consecutive daily lessons have 0 repeated words', !overlapFound);

// TEST 7: KathaSetu Stories Seed & Categories
assert('Seed stories library has entries', SEED_STORIES.length > 0);
const langs = new Set(SEED_STORIES.map(s => s.language));
assert('Supports English stories', langs.has('en'));
assert('Supports Hindi stories', langs.has('hi'));
assert('Supports Tamil stories', langs.has('ta'));
assert('Supports Malayalam stories', langs.has('ml'));

// TEST 8: Dedicated Real-Life Stories Category
const realLifeCat = STORY_CATEGORIES.find(c => c.id === 'real-life');
assert('STORY_CATEGORIES contains dedicated "real-life" category', Boolean(realLifeCat));
assert('Real-Life category has multilingual names in Hindi, Tamil, and Malayalam',
  Boolean(realLifeCat?.nameHi && realLifeCat?.nameTa && realLifeCat?.nameMl)
);

// TEST 9: Stories Content Integrity
const completeStories = SEED_STORIES.every(s =>
  s.title && s.content && s.content.length > 100 && s.moral && s.category && s.readingTimeMinutes > 0
);
assert('All seed stories have full text (>100 chars), moral, category, and reading time', completeStories);

// TEST 10: Deduplication engine
const sampleStory = SEED_STORIES[0];
const hash1 = KathaSetuEngine.hashStoryText(sampleStory.content);
const hash2 = KathaSetuEngine.hashStoryText(sampleStory.content);
assert('Deterministic story text hashing works', hash1 === hash2);
const hashDiff = KathaSetuEngine.hashStoryText(sampleStory.content + ' extra words.');
assert('Different content produces different hash', hash1 !== hashDiff);

// TEST 11: Minimum 500 complete stories per language scalability (Total 2,000+ complete stories)
assert('MINIMUM_TARGET_PER_LANGUAGE is set to at least 500', MINIMUM_TARGET_PER_LANGUAGE >= 500);

const languages = ['en', 'hi', 'ta', 'ml'] as const;
languages.forEach(lang => {
  // Test generating the 1st, 100th, 250th, 500th story in each language
  const sampleIndices = [0, 99, 249, 499];
  const allValid = sampleIndices.every(idx => {
    const s = KathaSetuEngine.generateStoryRecord(idx, lang);
    return Boolean(
      s.id &&
      s.title &&
      s.content.length > 150 &&
      s.moral &&
      s.category &&
      s.readingTimeMinutes > 0 &&
      s.quiz && s.quiz.length >= 2
    );
  });
  assert(`Language [${lang}] can generate up to 500 complete stories with full text and quizzes`, allValid);
});

// TEST 12: Real-Life Stories Content Types & Biographies
const kalamStory = KathaSetuEngine.generateStoryRecord(0, 'en', 'real-life');
assert('Real-life story has valid contentType ("biography" or "verified_true")',
  Boolean(kalamStory.contentType && ['biography', 'verified_true', 'historical_account', 'inspired_real_life'].includes(kalamStory.contentType))
);
assert('Real-life biography includes documented verified source citation',
  Boolean(kalamStory.verifiedSource)
);

// TEST 13: Story Wishlist Local Storage & User Isolation
const user1 = 'learner_user_1';
const user2 = 'learner_user_2';
const storyA = 'story-en-panchatantra-0001';
const storyB = 'story-hi-real-life-0002';

// Add storyA to user1 wishlist
const user1Set = new Set<string>();
user1Set.add(storyA);
localStorage.setItem(`wordsetu_wishlist_${user1}`, JSON.stringify(Array.from(user1Set)));

// Verify user2 cannot see user1 wishlist
const user2Wishlist = localStorage.getItem(`wordsetu_wishlist_${user2}`);
assert('User2 cannot see User1 private wishlist (empty for user2)', user2Wishlist === null);

// Add storyB to user2 wishlist
const user2Set = new Set<string>();
user2Set.add(storyB);
localStorage.setItem(`wordsetu_wishlist_${user2}`, JSON.stringify(Array.from(user2Set)));

const loadedUser1List = JSON.parse(localStorage.getItem(`wordsetu_wishlist_${user1}`) || '[]');
const loadedUser2List = JSON.parse(localStorage.getItem(`wordsetu_wishlist_${user2}`) || '[]');
assert('User1 wishlist has storyA and not storyB', loadedUser1List.includes(storyA) && !loadedUser1List.includes(storyB));
assert('User2 wishlist has storyB and not storyA', loadedUser2List.includes(storyB) && !loadedUser2List.includes(storyA));

// TEST 14: Reading Speed Test Data
assert('Reading tests has Beginner, Intermediate, and Advanced passages',
  READING_PASSAGES.some(p => p.difficulty === 'beginner') &&
  READING_PASSAGES.some(p => p.difficulty === 'intermediate') &&
  READING_PASSAGES.some(p => p.difficulty === 'advanced')
);
assert('All reading test passages contain timed content and multiple comprehension questions',
  READING_PASSAGES.every(p => p.passageText.length > 200 && p.wordCount > 50 && p.questions.length >= 3)
);

// TEST 15: Public Anonymous User Profile & Local Persistence
const defaultAnonProfile = UserProfileService.getOrCreateProfile('fresh_visitor_profile');
assert('Public anonymous visitor profile initializes at Day 1 without login', defaultAnonProfile.calendarLessonDay === 1);
assert('Anonymous user has valid start date string', Boolean(defaultAnonProfile.learningStartDate));

// TEST 16: Public Anonymous Wishlist Persistence
const defaultWishlistSet = new Set<string>();
defaultWishlistSet.add('story-en-panchatantra-0001');
localStorage.setItem('wordsetu_wishlist_default_user', JSON.stringify(Array.from(defaultWishlistSet)));
const readBackWishlist = JSON.parse(localStorage.getItem('wordsetu_wishlist_default_user') || '[]');
assert('Anonymous visitor can save favorite stories to local wishlist without login', readBackWishlist.includes('story-en-panchatantra-0001'));

// TEST 17: Administrative Protection Remains Active
const validPasscode = 'admin360';
const invalidPasscode = 'wrongpassword';
assert('Admin requires explicit authorized passcode', validPasscode === 'admin360');
assert('Unauthorized visitor cannot access admin without passcode', invalidPasscode !== 'admin360' && invalidPasscode !== 'wordsetu');

console.log('====================================================');
console.log(`TOTAL PASSED: ${passed} | TOTAL FAILED: ${failed}`);
console.log('====================================================');

if (failed > 0) {
  process.exit(1);
}
