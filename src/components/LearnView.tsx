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
  Info
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
  isSearchLoading = false
}) => {
  if (!words || words.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📚</div>
        <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
          No Words In Active Lesson
        </h2>
        <p style={{ fontSize: '15px', color: '#64748b', maxWidth: '500px', margin: '0 auto 24px' }}>
          All daily vocabulary in the pool has been completed! You can search any English word anytime or review your saved library.
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

  const translatedMeaning = currentWord.translations[selectedLanguage.code] || currentWord.translations['hi'];

  return (
    <div className="learn-view-wrapper">
      {/* Prominent Search Bar on Learn Page */}
      <div style={{ marginBottom: '24px' }}>
        <SearchBar
          onSearch={onSearchWord}
          isLoading={isSearchLoading}
        />
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
          <span>Word {currentIndex + 1} of {words.length}</span>
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

      {/* Main Vocabulary Card */}
      <div className="vocab-main-card">
        {/* Word Title, Pronunciation & Actions */}
        <div className="vocab-header-row">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span className={`word-pos-tag ${currentWord.partOfSpeech}`} style={{ fontSize: '11px', padding: '3px 8px' }}>
                {currentWord.partOfSpeech}
              </span>
              {isLearned && (
                <span style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#047857',
                  background: '#d1fae5',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <CheckCircle size={12} />
                  Learned
                </span>
              )}
            </div>

            <h2 className="vocab-word-large">{currentWord.word}</h2>

            <div className="vocab-pronunciation-row">
              <span className="vocab-phonetic-badge">{currentWord.phonetic}</span>
              <button
                className={`audio-btn-large ${speakingTarget === 'word' ? 'speaking' : ''}`}
                onClick={handlePlayWordAudio}
                aria-label={`Pronounce ${currentWord.word}`}
              >
                <Volume2 size={16} />
                <span>{speakingTarget === 'word' ? 'Playing Audio...' : 'Listen Pronunciation'}</span>
              </button>
            </div>
          </div>

          <div className="card-actions-top">
            <button
              className={`btn-icon-toggle ${isSaved ? 'active' : ''}`}
              onClick={() => onToggleSaved(currentWord.id)}
              title={isSaved ? 'Remove from Saved Words' : 'Save Word to Library'}
              aria-label={isSaved ? 'Saved in library' : 'Save word'}
            >
              {isSaved ? <BookmarkCheck size={20} color="#db2777" /> : <Bookmark size={20} />}
            </button>
          </div>
        </div>

        {/* English Definition */}
        <div className="vocab-def-box">
          <div className="vocab-def-label">English Definition</div>
          <div className="vocab-def-text">{currentWord.englishDefinition}</div>
        </div>

        {/* Selected-Language Translation Card */}
        <div className="translation-hero-card">
          <div className="translation-hero-content">
            <span className="translation-pill-tag">
              <Sparkles size={13} color="#2563eb" />
              <span>Meaning in {selectedLanguage.name}</span>
            </span>
            <div className="translation-native-large">
              {translatedMeaning}
            </div>
          </div>
          <div className="translation-accent-flag">
            {selectedLanguage.accentBadge}
          </div>
        </div>

        {/* Two Example Sentences with Translation and Audio */}
        <div className="examples-container">
          <h3 className="examples-title">
            <BookOpen size={18} color="#2563eb" />
            <span>Contextual Example Sentences</span>
          </h3>

          {currentWord.examples.map((example, idx) => {
            const sentenceTargetId = `sentence-${idx}`;
            const isSpeakingThis = speakingTarget === sentenceTargetId;
            const sentenceTranslation =
              example.translations[selectedLanguage.code] || example.translations['hi'];

            return (
              <div key={idx} className="example-card-item">
                <div className="example-english-row">
                  <div className="example-english-text">
                    "{example.english}"
                  </div>
                  <button
                    className={`audio-btn-sm ${isSpeakingThis ? 'speaking' : ''}`}
                    onClick={() => handlePlaySentenceAudio(example.english, idx)}
                    title="Listen to this sentence"
                    aria-label={`Listen to example ${idx + 1}`}
                  >
                    <Volume2 size={15} />
                  </button>
                </div>
                <div className="example-native-text">
                  ↳ {sentenceTranslation}
                </div>
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

      <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '12px', color: '#94a3b8' }}>
        Tip: You can use your keyboard Left (←) and Right (→) arrow keys to navigate between words.
      </div>
    </div>
  );
};
