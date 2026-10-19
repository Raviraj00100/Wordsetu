import React, { useState, useEffect } from 'react';
import { Navbar, ActiveNavTab } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { SearchBar } from './components/SearchBar';
import { SearchResultCard } from './components/SearchResultCard';
import { ProgressCard } from './components/ProgressCard';
import { CountdownTimer } from './components/CountdownTimer';
import { TodayWordsPreview } from './components/TodayWordsPreview';
import { LearnView } from './components/LearnView';
import { QuizView } from './components/QuizView';
import { LanguageModal } from './components/LanguageModal';
import { Footer } from './components/Footer';

// KathaSetu & Master Upgrade Components
import { KathaSetuView } from './components/kathaSetu/KathaSetuView';
import { StoryReader } from './components/kathaSetu/StoryReader';
import { CreateStoryView } from './components/kathaSetu/CreateStoryView';
import { MyStoryShelfView } from './components/kathaSetu/MyStoryShelfView';
import { ReadingTestView } from './components/readingTest/ReadingTestView';
import { MyVocabularyView } from './components/vocabulary/MyVocabularyView';
import { MyProgressView } from './components/progress/MyProgressView';
import { SettingsView } from './components/settings/SettingsView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { MyWishlistView } from './components/kathaSetu/MyWishlistView';
import { FeatureCards } from './components/FeatureCards';
import { LearningStats } from './components/LearningStats';
import { StoryCategories } from './components/StoryCategories';
import { kathaSetuDb } from './services/db';

import { VOCABULARY_DATA, TOTAL_DAILY_WORDS } from './data/vocabulary';
import { DictionaryEntry } from './data/dictionaryDatabase';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, Language } from './data/languages';
import { StorageService } from './utils/storage';
import { DictionaryService } from './utils/dictionaryService';
import { LessonManager, LessonState } from './utils/lessonManager';
import { KathaSetuEngine } from './services/kathaSetuEngine';
import { Story } from './types/story';
import { Sparkles, CheckCircle2, BookmarkCheck, ArrowRight, Library, FileText, Award, BookOpen } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveNavTab>('home');
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [isCreatingStory, setIsCreatingStory] = useState(false);

  const [selectedLanguage, setSelectedLanguage] = useState<Language>(() => {
    const savedCode = StorageService.getLanguage();
    return SUPPORTED_LANGUAGES.find(l => l.code === savedCode) || DEFAULT_LANGUAGE;
  });

  const [learnedWordIds, setLearnedWordIds] = useState<string[]>(() =>
    StorageService.getLearnedWords()
  );

  const [savedWordIds, setSavedWordIds] = useState<string[]>(() =>
    StorageService.getSavedWordIds()
  );

  const [customSavedEntries, setCustomSavedEntries] = useState<DictionaryEntry[]>(() =>
    StorageService.getCustomSavedEntries()
  );

  // Active 24-hr lesson state (upgraded to 20 words per lesson)
  const [lessonState, setLessonState] = useState<LessonState>(() =>
    LessonManager.getActiveLessonState(VOCABULARY_DATA)
  );

  const [currentLearnIndex, setCurrentLearnIndex] = useState(0);
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);

  // Search Any Word state
  const [searchedQuery, setSearchedQuery] = useState('');
  const [searchResult, setSearchResult] = useState<DictionaryEntry | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isNotFound, setIsNotFound] = useState(false);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [isSearchResultOpen, setIsSearchResultOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState<number>(() => kathaSetuDb.getLocalWishlistSet().size);

  // Redesign Real User Statistics & Category Filtering
  const [totalStoriesCount, setTotalStoriesCount] = useState<number>(0);
  const [storiesReadCount, setStoriesReadCount] = useState<number>(0);
  const [averageQuizScorePct, setAverageQuizScorePct] = useState<number | null>(null);
  const [lastQuizScore, setLastQuizScore] = useState<{ score: number; total: number } | null>(null);
  const [storyCategoryFilter, setStoryCategoryFilter] = useState<string>('all');

  // Initialize KathaSetu Library on start & load real user statistics
  useEffect(() => {
    KathaSetuEngine.initializeLibrary();

    const loadMetrics = async () => {
      try {
        const stats = await KathaSetuEngine.getLibraryStats();
        if (stats) {
          setTotalStoriesCount(stats.total);
        }
        const progressList = await kathaSetuDb.getAllReadingProgress();
        setStoriesReadCount(progressList.filter(p => p.completed || p.scrollPercentage >= 50).length);

        const quizRecords = await kathaSetuDb.getAllStoryQuizResults();
        const savedDailyQuiz = StorageService.getQuizResults();
        if (savedDailyQuiz) {
          setLastQuizScore({ score: savedDailyQuiz.score, total: savedDailyQuiz.total });
        }

        let totalEarned = 0;
        let totalMax = 0;
        if (savedDailyQuiz && savedDailyQuiz.total > 0) {
          totalEarned += savedDailyQuiz.score;
          totalMax += savedDailyQuiz.total;
        }
        quizRecords.forEach(q => {
          totalEarned += q.score;
          totalMax += q.total;
        });
        if (totalMax > 0) {
          setAverageQuizScorePct(Math.round((totalEarned / totalMax) * 100));
        }
      } catch (e) {
        console.error('Error fetching statistics:', e);
      }
    };

    loadMetrics();

    const handleWishlistUpdate = () => {
      setWishlistCount(kathaSetuDb.getLocalWishlistSet().size);
    };

    window.addEventListener('wordsetu_wishlist_updated', handleWishlistUpdate);
    window.addEventListener('story_library_updated', loadMetrics);
    return () => {
      window.removeEventListener('wordsetu_wishlist_updated', handleWishlistUpdate);
      window.removeEventListener('story_library_updated', loadMetrics);
    };
  }, []);

  // Today's 20 words from active lesson
  const todayWords = lessonState.words;

  const handleSelectLanguage = (lang: Language) => {
    setSelectedLanguage(lang);
    StorageService.setLanguage(lang.code);

    if (searchResult && (!searchResult.translations[lang.code] || !searchResult.examples[0].translations[lang.code])) {
      DictionaryService.fetchTranslation(searchResult.word, lang.code).then(transWord => {
        DictionaryService.fetchTranslation(searchResult.examples[0].english, lang.code).then(transEx1 => {
          DictionaryService.fetchTranslation(searchResult.examples[1].english, lang.code).then(transEx2 => {
            setSearchResult(prev => {
              if (!prev) return null;
              return {
                ...prev,
                translations: { ...prev.translations, [lang.code]: transWord || prev.word },
                examples: [
                  {
                    english: prev.examples[0].english,
                    translations: { ...prev.examples[0].translations, [lang.code]: transEx1 || '' }
                  },
                  {
                    english: prev.examples[1].english,
                    translations: { ...prev.examples[1].translations, [lang.code]: transEx2 || '' }
                  }
                ]
              };
            });
          });
        });
      });
    }
  };

  const handleToggleLearned = (wordId: string) => {
    const updated = StorageService.toggleLearnedWord(wordId);
    setLearnedWordIds(updated);
  };

  const handleToggleDailySaved = (wordId: string) => {
    const updated = StorageService.toggleSavedWordId(wordId);
    setSavedWordIds(updated);
  };

  const handleToggleCustomSaved = (entry: DictionaryEntry) => {
    const exists = customSavedEntries.some(e => e.id === entry.id || e.word.toLowerCase() === entry.word.toLowerCase());
    if (exists) {
      StorageService.removeCustomEntry(entry.id);
      setCustomSavedEntries(prev => prev.filter(e => e.id !== entry.id && e.word.toLowerCase() !== entry.word.toLowerCase()));
    } else {
      StorageService.saveCustomEntry(entry);
      setCustomSavedEntries(prev => [entry, ...prev.filter(e => e.id !== entry.id)]);
    }
  };

  const isEntrySaved = (entry: DictionaryEntry): boolean => {
    const dailyMatch = todayWords.find(w => w.word.toLowerCase() === entry.word.toLowerCase());
    if (dailyMatch && savedWordIds.includes(dailyMatch.id)) return true;
    return customSavedEntries.some(e => e.id === entry.id || e.word.toLowerCase() === entry.word.toLowerCase());
  };

  const handleToggleSaveSearchedWord = (entry: DictionaryEntry) => {
    const dailyMatch = todayWords.find(w => w.word.toLowerCase() === entry.word.toLowerCase());
    if (dailyMatch) {
      handleToggleDailySaved(dailyMatch.id);
    } else {
      handleToggleCustomSaved(entry);
    }
  };

  // Perform search for any English word
  const handleSearchWord = async (word: string) => {
    const cleanWord = word.trim();
    if (!cleanWord) return;

    setSearchedQuery(cleanWord);
    setIsSearchLoading(true);
    setSearchError(null);
    setIsNotFound(false);
    setIsSearchResultOpen(true);

    const result = await DictionaryService.searchWord(cleanWord, selectedLanguage.code);

    if (result.status === 'success' && result.entry) {
      setSearchResult(result.entry);
      setSearchError(null);
      setIsNotFound(false);
    } else if (result.status === 'not_found') {
      setSearchResult(null);
      setIsNotFound(true);
      setSearchError(result.message || `Word "${cleanWord}" not found.`);
    } else {
      setSearchResult(null);
      setIsNotFound(false);
      setSearchError(result.message || 'Error looking up word.');
    }

    setIsSearchLoading(false);
  };

  const handleAdvanceLesson = () => {
    const nextState = LessonManager.advanceToNextLesson(VOCABULARY_DATA);
    setLessonState(nextState);
    setCurrentLearnIndex(0);
  };

  const handleSelectWordFromPreview = (index: number) => {
    setCurrentLearnIndex(index);
    setActiveTab('learn');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenStoryReader = (story: Story) => {
    setActiveStory(story);
    setIsCreatingStory(false);
    setActiveTab('stories');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalSavedCount = savedWordIds.length + customSavedEntries.length;

  return (
    <>
      <Navbar
        activeTab={activeTab}
        setActiveTab={tab => {
          setActiveTab(tab);
          if (tab !== 'stories') {
            setActiveStory(null);
            setIsCreatingStory(false);
          }
          if (tab !== 'home' && tab !== 'search') {
            setIsSearchResultOpen(false);
          }
        }}
        selectedLanguage={selectedLanguage}
        onOpenLanguageModal={() => setIsLangModalOpen(true)}
        savedWordsCount={totalSavedCount}
        learnedWordsCount={learnedWordIds.filter(id => todayWords.some(w => w.id === id)).length}
        streakDays={lessonState.streakDays || 1}
        wishlistCount={wishlistCount}
        onOpenSearch={() => {
          setActiveTab('search');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      <main className="container" style={{ flex: 1, minHeight: '80vh' }}>
        {/* ================= 1. HOME VIEW ================= */}
        {activeTab === 'home' && (
          <>
            {/* Section 3: Homepage Hero Section */}
            <HeroSection
              onStartLearning={() => {
                setActiveTab('learn');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onExploreStories={() => {
                setActiveTab('stories');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              selectedLanguage={selectedLanguage}
              lessonNumber={lessonState.lessonNumber}
              wordsCount={todayWords.length}
            />

            {/* Section 4: Four Feature Cards */}
            <FeatureCards
              onSelectTab={(tab) => {
                setActiveTab(tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              lessonDay={lessonState.lessonNumber}
              totalStoriesCount={totalStoriesCount}
              completedDailyCount={learnedWordIds.filter(id => todayWords.some(w => w.id === id)).length}
              quizScoreInfo={lastQuizScore}
            />

            {/* Section 5: Learning Statistics Bar */}
            <LearningStats
              streakDays={lessonState.streakDays || 1}
              totalWordsLearned={learnedWordIds.length}
              storiesReadCount={storiesReadCount}
              averageQuizScorePct={averageQuizScorePct}
            />

            {/* Section 6: Popular Story Categories Carousel */}
            <StoryCategories
              onSelectCategory={(categoryId) => {
                setStoryCategoryFilter(categoryId);
                setActiveTab('stories');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onViewAllStories={() => {
                setStoryCategoryFilter('all');
                setActiveTab('stories');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* Prominent Search Bar on Home Page */}
            <div style={{ margin: '8px 0 24px' }}>
              <div style={{ textAlign: 'center', marginBottom: '14px' }}>
                <span style={{
                  fontSize: '12px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.8px',
                  color: '#2563eb',
                  background: '#eff6ff',
                  padding: '4px 12px',
                  borderRadius: '9999px',
                  border: '1px solid #bfdbfe'
                }}>
                  English Dictionary Search
                </span>
                <h2 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '24px',
                  fontWeight: 800,
                  color: '#0f172a',
                  marginTop: '8px'
                }}>
                  Search Any Word in English
                </h2>
                <p style={{ fontSize: '14px', color: '#64748b', marginTop: '2px' }}>
                  Explore meanings in <strong>{selectedLanguage.name} ({selectedLanguage.nativeName})</strong>, real definitions, pronunciations, and example sentences.
                </p>
              </div>

              <SearchBar
                onSearch={handleSearchWord}
                isLoading={isSearchLoading}
              />
            </div>

            {/* Active Search Result Card */}
            {isSearchResultOpen && (
              <SearchResultCard
                entry={searchResult}
                errorMessage={searchError || undefined}
                isNotFound={isNotFound}
                searchedQuery={searchedQuery}
                selectedLanguage={selectedLanguage}
                isSaved={searchResult ? isEntrySaved(searchResult) : false}
                onToggleSave={handleToggleSaveSearchedWord}
                onClose={() => setIsSearchResultOpen(false)}
                onQuickSearch={handleSearchWord}
              />
            )}

            {/* Daily Dashboard Row */}
            <div className="dashboard-overview-grid">
              <ProgressCard
                completedCount={learnedWordIds.filter(id => todayWords.some(w => w.id === id)).length}
                totalWords={todayWords.length > 0 ? todayWords.length : TOTAL_DAILY_WORDS}
                onGoToLearn={() => {
                  setActiveTab('learn');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />

              <CountdownTimer
                initialRemainingMs={lessonState.remainingMs}
                lessonNumber={lessonState.lessonNumber}
                onAdvanceLesson={handleAdvanceLesson}
                isPoolExhausted={lessonState.isPoolExhausted}
                remainingEligibleCount={lessonState.remainingEligibleCount}
              />
            </div>

            {/* Today's 20 Words Interactive Preview */}
            <TodayWordsPreview
              words={todayWords}
              selectedLanguage={selectedLanguage}
              learnedWordIds={learnedWordIds}
              lessonNumber={lessonState.lessonNumber}
              isPoolLow={lessonState.isPoolLow}
              isPoolExhausted={lessonState.isPoolExhausted}
              remainingEligibleCount={lessonState.remainingEligibleCount}
              onSelectWord={handleSelectWordFromPreview}
              onViewAll={() => {
                setActiveTab('learn');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onSearchFocus={() => {
                window.scrollTo({ top: 350, behavior: 'smooth' });
              }}
            />
          </>
        )}

        {/* ================= 2. DAILY WORDS (LEARN) ================= */}
        {activeTab === 'learn' && (
          <>
            {isSearchResultOpen && (
              <SearchResultCard
                entry={searchResult}
                errorMessage={searchError || undefined}
                isNotFound={isNotFound}
                searchedQuery={searchedQuery}
                selectedLanguage={selectedLanguage}
                isSaved={searchResult ? isEntrySaved(searchResult) : false}
                onToggleSave={handleToggleSaveSearchedWord}
                onClose={() => setIsSearchResultOpen(false)}
                onQuickSearch={handleSearchWord}
              />
            )}

            <LearnView
              words={todayWords}
              currentIndex={currentLearnIndex}
              setCurrentIndex={setCurrentLearnIndex}
              selectedLanguage={selectedLanguage}
              learnedWordIds={learnedWordIds}
              savedWordIds={savedWordIds}
              onToggleLearned={handleToggleLearned}
              onToggleSaved={handleToggleDailySaved}
              onBackToHome={() => setActiveTab('home')}
              onStartQuiz={() => {
                setActiveTab('quiz');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onSearchWord={handleSearchWord}
              isSearchLoading={isSearchLoading}
              lessonNumber={lessonState.lessonNumber}
              calendarLessonDay={lessonState.calendarLessonDay}
              onSelectDay={(day) => {
                const updated = LessonManager.selectLessonDay(day, VOCABULARY_DATA);
                setLessonState(updated);
                setCurrentLearnIndex(0);
              }}
            />
          </>
        )}

        {/* ================= 3. STORIES — KATHASETU ================= */}
        {activeTab === 'stories' && (
          <>
            {activeStory ? (
              <StoryReader
                story={activeStory}
                onBack={() => setActiveStory(null)}
              />
            ) : isCreatingStory ? (
              <div>
                <button
                  onClick={() => setIsCreatingStory(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    margin: '10px 0 20px',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: 600
                  }}
                >
                  ← Back to KathaSetu Library
                </button>
                <CreateStoryView
                  onStorySaved={story => {
                    handleOpenStoryReader(story);
                  }}
                  onBrowseLibrary={() => setIsCreatingStory(false)}
                />
              </div>
            ) : (
              <KathaSetuView
                onReadStory={handleOpenStoryReader}
                onCreateStory={() => setIsCreatingStory(true)}
                onOpenWishlist={() => setActiveTab('wishlist')}
                initialCategory={storyCategoryFilter}
              />
            )}
          </>
        )}

        {/* ================= 4. MY STORY WISHLIST ================= */}
        {activeTab === 'wishlist' && (
          <MyWishlistView
            onReadStory={handleOpenStoryReader}
            onBrowseStories={() => {
              setActiveTab('stories');
              setActiveStory(null);
              setIsCreatingStory(false);
            }}
          />
        )}

        {/* ================= 5. WORD SEARCH ================= */}
        {activeTab === 'search' && (
          <div style={{ maxWidth: '820px', margin: '20px auto 60px' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <span style={{
                fontSize: '12px',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.8px',
                color: '#2563eb',
                background: '#eff6ff',
                padding: '4px 12px',
                borderRadius: '9999px',
                border: '1px solid #bfdbfe'
              }}>
                English Dictionary Search
              </span>
              <h1 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '28px',
                fontWeight: 800,
                color: '#0f172a',
                marginTop: '8px'
              }}>
                Search Any Word in English
              </h1>
              <p style={{ fontSize: '14px', color: '#64748b', marginTop: '2px' }}>
                Instant definitions, phonetic audio, and translations in <strong>{selectedLanguage.name} ({selectedLanguage.nativeName})</strong>.
              </p>
            </div>

            <SearchBar
              onSearch={handleSearchWord}
              isLoading={isSearchLoading}
            />

            {isSearchResultOpen && (
              <div style={{ marginTop: '24px' }}>
                <SearchResultCard
                  entry={searchResult}
                  errorMessage={searchError || undefined}
                  isNotFound={isNotFound}
                  searchedQuery={searchedQuery}
                  selectedLanguage={selectedLanguage}
                  isSaved={searchResult ? isEntrySaved(searchResult) : false}
                  onToggleSave={handleToggleSaveSearchedWord}
                  onClose={() => setIsSearchResultOpen(false)}
                  onQuickSearch={handleSearchWord}
                />
              </div>
            )}
          </div>
        )}

        {/* ================= 5. READING TEST ================= */}
        {activeTab === 'reading_test' && (
          <ReadingTestView />
        )}

        {/* ================= 6. QUIZ ================= */}
        {activeTab === 'quiz' && (
          <QuizView
            words={todayWords}
            selectedLanguage={selectedLanguage}
            onReviewWords={() => {
              setActiveTab('learn');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onBackToHome={() => setActiveTab('home')}
          />
        )}

        {/* ================= 7. MY VOCABULARY ================= */}
        {activeTab === 'vocabulary' && (
          <MyVocabularyView
            allWords={VOCABULARY_DATA}
            savedWordIds={savedWordIds}
            learnedWordIds={learnedWordIds}
            selectedLanguage={selectedLanguage}
            onToggleLearned={handleToggleLearned}
            onRemoveSavedId={handleToggleDailySaved}
            onBrowseWords={() => {
              setActiveTab('learn');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* ================= 8. MY STORY SHELF ================= */}
        {activeTab === 'shelf' && (
          <MyStoryShelfView
            onReadStory={handleOpenStoryReader}
            onBrowseLibrary={() => {
              setActiveTab('stories');
              setActiveStory(null);
              setIsCreatingStory(false);
            }}
            onCreateStory={() => {
              setActiveTab('stories');
              setIsCreatingStory(true);
            }}
          />
        )}

        {/* ================= 9. MY PROGRESS ================= */}
        {activeTab === 'progress' && (
          <MyProgressView
            streakDays={lessonState.streakDays || 1}
            totalWordsLearned={learnedWordIds.length}
            selectedLanguage={selectedLanguage}
            onReadStory={handleOpenStoryReader}
            onGoToDailyWords={() => setActiveTab('learn')}
          />
        )}

        {/* ================= 10. SETTINGS ================= */}
        {activeTab === 'settings' && (
          <SettingsView
            selectedLanguage={selectedLanguage}
            onSelectLanguage={handleSelectLanguage}
            onOpenAdmin={() => setActiveTab('admin')}
          />
        )}

        {/* ================= ADMIN CONTENT MANAGEMENT ================= */}
        {activeTab === 'admin' && (
          <AdminDashboard />
        )}
      </main>

      <Footer
        onSelectLanguage={handleSelectLanguage}
        onNavigate={tab => {
          setActiveTab(tab);
          if (tab !== 'stories') {
            setActiveStory(null);
            setIsCreatingStory(false);
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      <LanguageModal
        isOpen={isLangModalOpen}
        onClose={() => setIsLangModalOpen(false)}
        selectedLanguage={selectedLanguage}
        onSelectLanguage={handleSelectLanguage}
      />
    </>
  );
}
