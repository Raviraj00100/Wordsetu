import React, { useState } from 'react';
import {
  Volume2,
  Bookmark,
  BookmarkCheck,
  Sparkles,
  BookOpen,
  ArrowLeft,
  XCircle,
  HelpCircle,
  Share2
} from 'lucide-react';
import { DictionaryEntry } from '../data/dictionaryDatabase';
import { Language } from '../data/languages';
import { audioService } from '../utils/audio';

interface SearchResultCardProps {
  entry: DictionaryEntry | null;
  errorMessage?: string;
  isNotFound?: boolean;
  searchedQuery: string;
  selectedLanguage: Language;
  isSaved: boolean;
  onToggleSave: (entry: DictionaryEntry) => void;
  onClose: () => void;
  onQuickSearch: (word: string) => void;
}

export const SearchResultCard: React.FC<SearchResultCardProps> = ({
  entry,
  errorMessage,
  isNotFound = false,
  searchedQuery,
  selectedLanguage,
  isSaved,
  onToggleSave,
  onClose,
  onQuickSearch
}) => {
  const [speakingTarget, setSpeakingTarget] = useState<string | null>(null);

  const handlePlayWordAudio = (word: string) => {
    if (speakingTarget === 'word') {
      audioService.stop();
      setSpeakingTarget(null);
      return;
    }
    setSpeakingTarget('word');
    audioService.speak(word, {
      rate: 0.88,
      onEnd: () => setSpeakingTarget(null),
      onError: () => setSpeakingTarget(null)
    });
  };

  const handlePlaySentenceAudio = (sentence: string, index: number) => {
    const targetId = `sent-${index}`;
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

  // If word not found or network error
  if (!entry) {
    return (
      <div className="search-error-card">
        <div className="search-error-icon-box">
          {isNotFound ? <HelpCircle size={32} color="#2563eb" /> : <XCircle size={32} color="#e11d48" />}
        </div>
        <h3 className="search-error-title">
          {isNotFound ? `Word Not Found: "${searchedQuery}"` : 'Dictionary Search Notice'}
        </h3>
        <p className="search-error-desc">
          {errorMessage || `We couldn't find a definition for "${searchedQuery}". Please verify the spelling or try searching one of our verified vocabulary entries below.`}
        </p>

        <div style={{ marginTop: '20px' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#475569', marginBottom: '10px' }}>
            Popular verified words you can explore:
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {['Beautiful', 'Courage', 'Wisdom', 'Patience', 'Honest', 'Freedom', 'Gratitude'].map((w, idx) => (
              <button
                key={idx}
                type="button"
                className="search-history-chip"
                onClick={() => onQuickSearch(w)}
              >
                {w}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="btn-secondary"
          style={{ marginTop: '24px' }}
          onClick={onClose}
        >
          <ArrowLeft size={16} />
          <span>Back to Overview</span>
        </button>
      </div>
    );
  }

  const translatedMeaning =
    entry.translations[selectedLanguage.code] ||
    entry.translations['hi'] ||
    entry.translations['en'] ||
    entry.word;

  return (
    <div className="search-result-wrapper">
      {/* Top Banner Navigation */}
      <div className="search-result-topbar">
        <button
          type="button"
          className="btn-secondary"
          style={{ padding: '8px 18px', fontSize: '13.5px' }}
          onClick={onClose}
        >
          <ArrowLeft size={16} />
          <span>Close Search Result</span>
        </button>

        <div className="search-source-badge">
          {entry.source === 'curated' ? (
            <span style={{ color: '#059669', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Sparkles size={13} />
              <span>WordSetu Verified Dictionary Entry</span>
            </span>
          ) : (
            <span style={{ color: '#2563eb', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <BookOpen size={13} />
              <span>English Lexicon Database</span>
            </span>
          )}
        </div>
      </div>

      {/* Main Vocabulary Result Card */}
      <div className="vocab-main-card search-card-highlight">
        {/* Header Row */}
        <div className="vocab-header-row">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <span className={`word-pos-tag ${entry.partOfSpeech.toLowerCase()}`}>
                {entry.partOfSpeech}
              </span>
              <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>
                English Dictionary
              </span>
            </div>

            <h2 className="vocab-word-large">{entry.word}</h2>

            <div className="vocab-pronunciation-row">
              <span className="vocab-phonetic-badge">{entry.phonetic}</span>
              <button
                type="button"
                className={`audio-btn-large ${speakingTarget === 'word' ? 'speaking' : ''}`}
                onClick={() => handlePlayWordAudio(entry.word)}
                aria-label={`Pronounce ${entry.word}`}
              >
                <Volume2 size={16} />
                <span>{speakingTarget === 'word' ? 'Speaking...' : 'Listen Pronunciation'}</span>
              </button>
            </div>
          </div>

          <div className="card-actions-top">
            <button
              type="button"
              className={`btn-icon-toggle ${isSaved ? 'active' : ''}`}
              onClick={() => onToggleSave(entry)}
              title={isSaved ? 'Word is saved in library' : 'Save word to your library'}
              aria-label={isSaved ? 'Saved in library' : 'Save word'}
            >
              {isSaved ? <BookmarkCheck size={20} color="#db2777" /> : <Bookmark size={20} />}
            </button>
          </div>
        </div>

        {/* English Definition */}
        <div className="vocab-def-box">
          <div className="vocab-def-label">English Definition</div>
          <div className="vocab-def-text">{entry.englishDefinition}</div>
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

        {/* Two Contextual Example Sentences */}
        <div className="examples-container">
          <h3 className="examples-title">
            <BookOpen size={18} color="#2563eb" />
            <span>Example Sentences</span>
          </h3>

          {entry.examples.map((example, idx) => {
            const sentenceTargetId = `sent-${idx}`;
            const isSpeakingThis = speakingTarget === sentenceTargetId;
            const sentenceTranslation =
              example.translations[selectedLanguage.code] ||
              example.translations['hi'] ||
              '';

            return (
              <div key={idx} className="example-card-item">
                <div className="example-english-row">
                  <div className="example-english-text">
                    <strong>Example {idx + 1}:</strong> "{example.english}"
                  </div>
                  <button
                    type="button"
                    className={`audio-btn-sm ${isSpeakingThis ? 'speaking' : ''}`}
                    onClick={() => handlePlaySentenceAudio(example.english, idx)}
                    title="Listen to this example sentence"
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

        {/* Synonyms & Antonyms */}
        {(entry.synonyms.length > 0 || entry.antonyms.length > 0) && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px' }}>
            {entry.synonyms.length > 0 && (
              <div className="meta-chips-row" style={{ margin: 0 }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>Synonyms:</span>
                {entry.synonyms.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="meta-chip"
                    onClick={() => onQuickSearch(s)}
                    style={{ cursor: 'pointer' }}
                    title={`Search "${s}"`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {entry.antonyms.length > 0 && (
              <div className="meta-chips-row" style={{ margin: 0 }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#e11d48' }}>Antonyms:</span>
                {entry.antonyms.map((a, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="meta-chip"
                    onClick={() => onQuickSearch(a)}
                    style={{ cursor: 'pointer', background: '#fff1f2', color: '#be123c', border: '1px solid #fecdd3' }}
                    title={`Search "${a}"`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Save Word Banner Action */}
        <div style={{
          marginTop: '28px',
          paddingTop: '20px',
          borderTop: '1px solid #f1f5f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ fontSize: '13px', color: '#64748b' }}>
            💡 Save this word to review it anytime from your <strong>Saved Words</strong> library.
          </div>
          <button
            type="button"
            className={`btn-primary ${isSaved ? 'learned-done' : ''}`}
            onClick={() => onToggleSave(entry)}
            style={{
              padding: '10px 22px',
              fontSize: '13.5px',
              background: isSaved ? '#fdf2f8' : undefined,
              color: isSaved ? '#db2777' : undefined,
              border: isSaved ? '1.5px solid #f472b6' : undefined,
              boxShadow: isSaved ? 'none' : undefined
            }}
          >
            {isSaved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
            <span>{isSaved ? 'Saved in Your Library ✓' : 'Save This Word'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
