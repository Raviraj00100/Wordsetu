import React, { useState, useEffect } from 'react';
import {
  Volume2,
  Bookmark,
  BookmarkCheck,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  BookOpen,
  Info,
  Calendar,
  RotateCcw
} from 'lucide-react';
import { VocabularyWord } from '../data/vocabulary';
import { Language } from '../data/languages';
import { audioService } from '../utils/audio';
import { SearchBar } from './SearchBar';

interface LearnViewProps {
  words: VocabularyWord[];
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  selectedLanguage: Language;
  learnedWordIds: string[];
  savedWordIds: string[];
  onToggleLearned: (id: string) => void;
  onToggleSaved: (id: string) => void;
  onBackToHome: () => void;
  onStartQuiz: () => void;
  onSearchWord: (word: string) => void;
  isSearchLoading?: boolean;
  lessonNumber?: number;
  calendarLessonDay?: number;
  onSelectDay?: (day: number) => void;
}

export const LearnView: React.FC<LearnViewProps> = ({
  words,
  currentIndex,
  setCurrentIndex,
  selectedLanguage,
  learnedWordIds,
  savedWordIds,
  onToggleLearned,
  onToggleSaved,
  onBackToHome,
  onStartQuiz,
  onSearchWord,
  isSearchLoading = false,
  lessonNumber = 1,
  calendarLessonDay = 1,
  onSelectDay
}) => {
  const [dayInput, setDayInput] = useState(lessonNumber.toString());

  useEffect(() => {
    setDayInput(lessonNumber.toString());
  }, [lessonNumber]);

  if (!words || words.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📚</div>
        <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
          No Words In Active Lesson
        </h2>
        <p style={{ fontSize: '15px', color: '#64748b', maxWidth: '500px', margin: '0 auto 24px' }}>
          Explore words from other days or use the search bar above.
        </p>
        <button className="btn-primary" onClick={onBackToHome}>
          Back to Home
        </button>
      </div>
    );
  }

  const currentWord = words[currentIndex] || words[0];
  const isLearned = learnedWordIds.includes(currentWord.id);
  const isSaved = savedWordIds.includes(currentWord.id);

  const [speakingTarget, setSpeakingTarget] = useState<string | null>(null);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && currentIndex < words.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, words.length, setCurrentIndex]);

  const handlePlayWordAudio = () => {
    if (speakingTarget === 'word') {
      audioService.stop();
      setSpeakingTarget(null);
      return;
    }
    setSpeakingTarget('word');
    audioService.speak(currentWord.word, {
      rate: 0.88,
      onEnd: () => setSpeakingTarget(null),
      onError: () => setSpeakingTarget(null)
    });
  };

  const handlePlaySentenceAudio = (sentence: string, index: number) => {
    const targetId = `sentence-${index}`;
    if (speakingTarget === targetId) {
      audioService.stop();
      setSpeakingTarget(null);
      return;
    }
    setSpeakingTarget(targetId);
    audioService.speak(sentence, {
      rate: 0.92,
      onEnd: () => setSpeakingTarget(null),
      onError: () => setSpeakingTarget(null)
    });
  };

  const handleDayJump = (e: React.FormEvent) => {
    e.preventDefault();
    const d = parseInt(dayInput, 10);
    if (!isNaN(d) && d >= 1) {
      onSelectDay?.(d);
      setCurrentIndex(0);
    }
  };

  const translatedMeaning = currentWord.translations[selectedLanguage.code] || currentWord.translations['hi'] || currentWord.word;
  const completedTodayCount = words.filter(w => learnedWordIds.includes(w.id)).length;

  return (
    <div className="learn-view-wrapper">
      {/* Prominent Search Bar on Learn Page */}
      <div style={{ marginBottom: '20px' }}>
        <SearchBar
          onSearch={onSearchWord}
          isLoading={isSearchLoading}
        />
      </div>

      {/* Lesson Navigation Header with Day Selector */}
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: '#eff6ff',
            color: '#1d4ed8',
            padding: '6px 14px',
            borderRadius: '9999px',
            fontWeight: 800,
            fontSize: '14px'
          }}>
            <Calendar size={16} />
            <span>Day {lessonNumber} Lesson</span>
          </div>

          {calendarLessonDay > lessonNumber && (
            <span style={{ fontSize: '12px', color: '#64748b' }}>
              (Current Day: {calendarLessonDay})
            </span>
          )}
        </div>

        {/* Day Selector & Jump Form */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {lessonNumber > 1 && (
            <button
              onClick={() => {
                onSelectDay?.(lessonNumber - 1);
                setCurrentIndex(0);
              }}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                color: '#334155',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
              title="Previous Day's Lesson"
            >
              ← Previous Day
            </button>
          )}

          <form onSubmit={handleDayJump} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '12px', color: '#64748b' }}>Go to Day:</span>
            <input
              type="number"
              min="1"
              value={dayInput}
              onChange={e => setDayInput(e.target.value)}
              style={{
                width: '64px',
                padding: '4px 8px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '12px',
                textAlign: 'center'
              }}
            />
            <button
              type="submit"
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                background: '#2563eb',
                color: '#ffffff',
                border: 'none',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Go
            </button>
          </form>

          {lessonNumber < calendarLessonDay && (
            <button
              onClick={() => {
                onSelectDay?.(calendarLessonDay);
                setCurrentIndex(0);
              }}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                background: '#ecfdf5',
                color: '#047857',
                border: '1px solid #a7f3d0',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Today's Words →
            </button>
          )}
        </div>
      </div>

      {/* Top Bar with Step Indicators */}
      <div className="learn-top-bar">
        <button
          onClick={onBackToHome}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            fontWeight: 700,
            color: '#475569',
            background: '#ffffff',
            padding: '8px 16px',
            borderRadius: '9999px',
            border: '1px solid #cbd5e1'
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Overview</span>
        </button>

        <div className="step-indicator">
          <span>Word {currentIndex + 1} of {words.length} ({completedTodayCount}/20 Mastered)</span>
          <div className="step-pills">
            {words.map((w, idx) => {
              const done = learnedWordIds.includes(w.id);
              const active = idx === currentIndex;
              return (
                <div
                  key={w.id}
                  className={`step-dot ${active ? 'active' : ''} ${done ? 'completed' : ''}`}
                  onClick={() => setCurrentIndex(idx)}
                  title={`Word ${idx + 1}: ${w.word} ${done ? '(Learned)' : ''}`}
                />
              );
            })}
          </div>
        </div>

        <button
          onClick={onStartQuiz}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            fontWeight: 700,
            color: '#2563eb',
            background: '#eff6ff',
            padding: '8px 14px',
            borderRadius: '9999px',
            border: '1px solid #bfdbfe'
          }}
        >
          <span>Practice Quiz</span>
          <Sparkles size={15} />
        </button>
      </div>

      {/* Main Flashcard Card */}
      <div className="vocab-main-card">
        {/* Card Header: Level, Word Index, Actions */}
        <div className="vocab-card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="vocab-pos-pill">{currentWord.partOfSpeech.toUpperCase()}</span>
            <span className="vocab-pos-pill" style={{ background: '#f8fafc', color: '#64748b' }}>
              WORD {currentIndex + 1} OF {words.length}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              className={`action-icon-btn ${isSaved ? 'active-saved' : ''}`}
              onClick={() => onToggleSaved(currentWord.id)}
              title={isSaved ? 'Remove from Saved' : 'Save Word'}
              aria-label={isSaved ? 'Saved to library' : 'Bookmark this word'}
            >
              {isSaved ? <BookmarkCheck size={20} color="#db2777" /> : <Bookmark size={20} />}
            </button>
          </div>
        </div>

        {/* Headword & Audio Button */}
        <div className="vocab-word-row">
          <div>
            <h1 className="vocab-word-large">{currentWord.word}</h1>
            <div className="vocab-phonetic-text">{currentWord.phonetic}</div>
          </div>

          <button
            className={`audio-large-btn ${speakingTarget === 'word' ? 'playing' : ''}`}
            onClick={handlePlayWordAudio}
            title="Listen to pronunciation"
            aria-label={`Pronounce ${currentWord.word}`}
          >
            <Volume2 size={24} />
          </button>
        </div>

        {/* English Definition */}
        <div className="vocab-def-box">
          <div className="vocab-def-label">Definition:</div>
          <p className="vocab-def-text">{currentWord.englishDefinition}</p>
        </div>

        {/* Native Language Meaning Hero */}
        <div className="translation-hero-card">
          <div>
            <span className="translation-hero-badge">
              Meaning in {selectedLanguage.name} ({selectedLanguage.nativeName})
            </span>
            <div className="translation-hero-text">
              {translatedMeaning}
            </div>
          </div>
        </div>

        {/* Two Contextual Example Sentences with Audio */}
        <div className="examples-section">
          <div className="examples-section-title">
            <BookOpen size={16} color="#2563eb" />
            <span>Contextual Examples</span>
          </div>

          {currentWord.examples.map((example, idx) => {
            const sentenceTranslation = example.translations[selectedLanguage.code] || example.translations['hi'] || '';
            const isPlayingThis = speakingTarget === `sentence-${idx}`;

            return (
              <div key={idx} className="example-item">
                <div className="example-en-row">
                  <p className="example-en-text">"{example.english}"</p>
                  <button
                    className={`audio-mini-btn ${isPlayingThis ? 'playing' : ''}`}
                    onClick={() => handlePlaySentenceAudio(example.english, idx)}
                    title="Listen to this sentence"
                    aria-label={`Listen to example ${idx + 1}`}
                  >
                    <Volume2 size={15} />
                  </button>
                </div>
                {sentenceTranslation && (
                  <div className="example-native-text">
                    ↳ {sentenceTranslation}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Synonyms & Memory Tip */}
        <div className="meta-chips-row">
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b' }}>Synonyms:</span>
          {currentWord.synonyms.map((s, idx) => (
            <span key={idx} className="meta-chip">{s}</span>
          ))}
          {currentWord.contextNote && (
            <span className="meta-chip highlight" style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Info size={12} />
              <span>{currentWord.contextNote}</span>
            </span>
          )}
        </div>
      </div>

      {/* Navigation & Mark Learned Controls */}
      <div className="learn-navigation-bar">
        <button
          className="btn-nav"
          onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
          disabled={currentIndex === 0}
        >
          <ArrowLeft size={16} />
          <span>Previous Word</span>
        </button>

        <button
          className={`btn-mark-learned ${isLearned ? 'learned-done' : ''}`}
          onClick={() => onToggleLearned(currentWord.id)}
        >
          <CheckCircle size={18} />
          <span>{isLearned ? 'Marked as Learned ✓' : 'Mark as Learned'}</span>
        </button>

        <button
          className="btn-nav"
          onClick={() => {
            if (currentIndex < words.length - 1) {
              setCurrentIndex(currentIndex + 1);
            } else {
              onStartQuiz();
            }
          }}
        >
          <span>{currentIndex === words.length - 1 ? 'Start Quiz' : 'Next Word'}</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};
