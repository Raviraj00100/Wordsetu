import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { SearchBar } from './components/SearchBar';
import { SearchResultCard } from './components/SearchResultCard';
import { ProgressCard } from './components/ProgressCard';
import { CountdownTimer } from './components/CountdownTimer';
import { TodayWordsPreview } from './components/TodayWordsPreview';
import { LearnView } from './components/LearnView';
import { QuizView } from './components/QuizView';
import { SavedWordsView } from './components/SavedWordsView';
import { LanguageModal } from './components/LanguageModal';
import { Footer } from './components/Footer';
import { VOCABULARY_DATA, TOTAL_DAILY_WORDS } from './data/vocabulary';
import { DictionaryEntry } from './data/dictionaryDatabase';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, Language } from './data/languages';
import { StorageService } from './utils/storage';
import { DictionaryService } from './utils/dictionaryService';
import { LessonManager, LessonState } from './utils/lessonManager';
import { Sparkles, CheckCircle2, BookmarkCheck, ArrowRight } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'learn' | 'quiz' | 'saved'>('home');
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

  // Active 24-hr lesson state managed with strict exclusion of previously learned words
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

  // Today's words from active lesson
  const todayWords = lessonState.words;

  const handleSelectLanguage = (lang: Language) => {
    setSelectedLanguage(lang);
    StorageService.setLanguage(lang.code);

    // If a searched external word is currently shown without translations in the newly selected language, fetch them
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
    // Check if it's a daily word ID
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

  const handleGoToLearnWord = (wordId: string) => {
    const foundIdx = todayWords.findIndex(w => w.id === wordId);
    if (foundIdx !== -1) {
      setCurrentLearnIndex(foundIdx);
      setActiveTab('learn');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // If it's a word from another daily lesson, display its details via dictionary view so user can revise anytime without affecting daily lesson
      const vocabEntry = VOCABULARY_DATA.find(w => w.id === wordId);
      if (vocabEntry) {
        const dictEntry: DictionaryEntry = {
          id: vocabEntry.id,
          word: vocabEntry.word,
          phonetic: vocabEntry.phonetic,
          partOfSpeech: vocabEntry.partOfSpeech,
          englishDefinition: vocabEntry.englishDefinition,
          translations: vocabEntry.translations,
          examples: vocabEntry.examples,
          source: 'vocabulary_pool'
        };
        setSearchResult(dictEntry);
        setSearchedQuery(vocabEntry.word);
        setIsNotFound(false);
        setSearchError(null);
        setIsSearchResultOpen(true);
        setActiveTab('home');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleViewCustomSavedWord = (entry: DictionaryEntry) => {
    setSearchResult(entry);
    setSearchedQuery(entry.word);
    setIsNotFound(false);
    setSearchError(null);
    setIsSearchResultOpen(true);
    setActiveTab('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalSavedCount = savedWordIds.length + customSavedEntries.length;

  return (
    <>
      <Navbar
        activeTab={activeTab}
        setActiveTab={tab => {
          setActiveTab(tab);
          if (tab !== 'home') setIsSearchResultOpen(false);
        }}
        selectedLanguage={selectedLanguage}
        onOpenLanguageModal={() => setIsLangModalOpen(true)}
        savedWordsCount={totalSavedCount}
        learnedWordsCount={learnedWordIds.filter(id => todayWords.some(w => w.id === id)).length}
      />

      <main className="container" style={{ flex: 1 }}>
        {activeTab === 'home' && (
          <>
            {/* Hero Section */}
            <HeroSection
              onStartLearning={() => {
                setActiveTab('learn');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onStartQuiz={() => {
                setActiveTab('quiz');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              selectedLanguage={selectedLanguage}
              lessonNumber={lessonState.lessonNumber}
              wordsCount={todayWords.length}
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

            {/* Active Search Meaning Result Card */}
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

            {/* Daily Dashboard Row: Real Progress & Persistent 24h Countdown */}
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

            {/* Quick Access Cards */}
            <section className="quick-access-section">
              <div className="section-header">
                <div>
                  <h2 className="section-title">Quick Learning Hub</h2>
                  <p style={{ fontSize: '14px', color: '#64748b' }}>
                    Jump directly into your daily routine or review your saved vocabulary.
                  </p>
                </div>
              </div>

              <div className="quick-cards-grid">
                {/* Learn Card */}
                <div
                  className="quick-card learn"
                  onClick={() => {
                    setActiveTab('learn');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <div>
                    <div className="quick-card-icon">
                      <Sparkles size={26} />
                    </div>
                    <h3 className="quick-card-title">Daily 10 Words</h3>
                    <p className="quick-card-desc">
                      Explore detailed pronunciation, definitions, two contextual examples, and audio for today's words.
                    </p>
                  </div>
                  <div className="quick-card-action">
                    <span>Study Lesson</span>
                    <ArrowRight size={16} />
                  </div>
                </div>

                {/* Practice Card */}
                <div
                  className="quick-card practice"
                  onClick={() => {
                    setActiveTab('quiz');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <div>
                    <div className="quick-card-icon">
                      <CheckCircle2 size={26} />
                    </div>
                    <h3 className="quick-card-title">Practice Quiz</h3>
                    <p className="quick-card-desc">
                      Reinforce your retention with an interactive 10-question quiz translated into {selectedLanguage.name}.
                    </p>
                  </div>
                  <div className="quick-card-action">
                    <span>Start Quiz</span>
                    <ArrowRight size={16} />
                  </div>
                </div>

                {/* Saved Words Card */}
                <div
                  className="quick-card saved"
                  onClick={() => {
                    setActiveTab('saved');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <div>
                    <div className="quick-card-icon">
                      <BookmarkCheck size={26} />
                    </div>
                    <h3 className="quick-card-title">Saved Words ({totalSavedCount})</h3>
                    <p className="quick-card-desc">
                      Revisit words you bookmarked from lessons and dictionary searches with search and pronunciation audio.
                    </p>
                  </div>
                  <div className="quick-card-action" style={{ color: '#db2777' }}>
                    <span>Open Library</span>
                    <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            </section>

            {/* Today's Words Interactive Preview */}
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
            />
          </>
        )}

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

        {activeTab === 'saved' && (
          <SavedWordsView
            allWords={VOCABULARY_DATA}
            savedWordIds={savedWordIds}
            customSavedEntries={customSavedEntries}
            learnedWordIds={learnedWordIds}
            selectedLanguage={selectedLanguage}
            onRemoveSavedId={handleToggleDailySaved}
            onRemoveCustomSaved={id => {
              StorageService.removeCustomEntry(id);
              setCustomSavedEntries(prev => prev.filter(e => e.id !== id));
            }}
            onToggleLearned={handleToggleLearned}
            onGoToLearnWord={handleGoToLearnWord}
            onViewCustomWord={handleViewCustomSavedWord}
            onBrowseWords={() => {
              setActiveTab('learn');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      <Footer
        onSelectLanguage={handleSelectLanguage}
        onNavigate={tab => {
          setActiveTab(tab);
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
