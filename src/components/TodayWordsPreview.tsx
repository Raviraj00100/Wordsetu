import React, { useState } from 'react';
import { Volume2, VolumeX, ArrowRight } from 'lucide-react';
import { VocabularyWord } from '../data/vocabulary';
import { Language } from '../data/languages';
import { audioService } from '../utils/audio';

interface TodayWordsPreviewProps {
  words: VocabularyWord[];
  selectedLanguage: Language;
  learnedWordIds: string[];
  lessonNumber?: number;
  isPoolLow?: boolean;
  isPoolExhausted?: boolean;
  remainingEligibleCount?: number;
  onSelectWord: (index: number) => void;
  onViewAll: () => void;
  onSearchFocus?: () => void;
}

export const TodayWordsPreview: React.FC<TodayWordsPreviewProps> = ({
  words,
  selectedLanguage,
  learnedWordIds,
  lessonNumber = 1,
  isPoolLow = false,
  isPoolExhausted = false,
  remainingEligibleCount = 0,
  onSelectWord,
  onViewAll,
  onSearchFocus
}) => {
  const [speakingWordId, setSpeakingWordId] = useState<string | null>(null);

  const handlePlayAudio = (e: React.MouseEvent, word: VocabularyWord) => {
    e.stopPropagation();
    if (speakingWordId === word.id) {
      audioService.stop();
      setSpeakingWordId(null);
      return;
    }

    setSpeakingWordId(word.id);
    audioService.speak(word.word, {
      onEnd: () => setSpeakingWordId(null),
      onError: () => setSpeakingWordId(null)
    });
  };

  return (
    <section style={{ marginBottom: '56px' }}>
      {/* Low Pool Warning Banner */}
      {isPoolLow && !isPoolExhausted && (
        <div style={{
          padding: '12px 18px',
          background: '#fffbeb',
          border: '1px solid #fde68a',
          borderRadius: '12px',
          color: '#92400e',
          fontSize: '13.5px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span style={{ fontSize: '18px' }}>⚠️</span>
          <div>
            <strong>Vocabulary Pool Running Low:</strong> Only {remainingEligibleCount} unassigned words remain in the curriculum pool. After these, no new daily words will be assigned until fresh vocabulary is added.
          </div>
        </div>
      )}

      {/* Pool Exhausted Banner & Card */}
      {isPoolExhausted && (
        <div style={{
          padding: '24px',
          background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
          border: '1px solid #a7f3d0',
          borderRadius: '16px',
          textAlign: 'center',
          marginBottom: '24px'
        }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>🎓</div>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#065f46', marginBottom: '6px' }}>
            All Daily Vocabulary Completed!
          </h3>
          <p style={{ fontSize: '14px', color: '#047857', maxWidth: '540px', margin: '0 auto 16px', lineHeight: 1.5 }}>
            You have covered all available daily words without repeating any. Never stop learning—use our <strong>English Dictionary Search</strong> above to look up any word, or revise your bookmarked words in your Saved Library!
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            {onSearchFocus && (
              <button
                onClick={onSearchFocus}
                className="btn-primary"
                style={{ fontSize: '13px', padding: '8px 16px' }}
              >
                Search Any Word
              </button>
            )}
            <button
              onClick={onViewAll}
              className="btn-secondary"
              style={{ fontSize: '13px', padding: '8px 16px' }}
            >
              Review Completed Words
            </button>
          </div>
        </div>
      )}

      <div className="section-header">
        <div>
          <h2 className="section-title">
            {words.length > 0 ? `Today’s ${words.length} English Words` : 'Today’s English Words'}
          </h2>
          <p style={{ fontSize: '14px', color: '#64748b' }}>
            Day {lessonNumber} • Meanings shown in <strong>{selectedLanguage.name} ({selectedLanguage.nativeName})</strong>. Click any card to study in detail.
          </p>
        </div>
        {words.length > 0 && (
          <button
            onClick={onViewAll}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#2563eb',
              fontWeight: 700,
              fontSize: '14px'
            }}
          >
            <span>Start Full Lesson</span>
            <ArrowRight size={16} />
          </button>
        )}
      </div>

      <div className="today-preview-grid">
        {words.map((item, index) => {
          const isLearned = learnedWordIds.includes(item.id);
          const isSpeaking = speakingWordId === item.id;
          const translatedMeaning = item.translations[selectedLanguage.code] || item.translations['hi'];

          return (
            <div
              key={item.id}
              className="word-preview-card"
              onClick={() => onSelectWord(index)}
              role="button"
              tabIndex={0}
              style={{
                borderColor: isLearned ? '#a7f3d0' : undefined,
                background: isLearned ? 'linear-gradient(180deg, #ffffff 0%, #f0fdf4 100%)' : undefined
              }}
            >
              <div>
                <div className="word-preview-top">
                  <span className={`word-pos-tag ${item.partOfSpeech}`}>{item.partOfSpeech}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {isLearned && (
                      <span style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        color: '#059669',
                        background: '#d1fae5',
                        padding: '1px 6px',
                        borderRadius: '4px'
                      }}>
                        Learned
                      </span>
                    )}
                    <button
                      className={`audio-btn-sm ${isSpeaking ? 'speaking' : ''}`}
                      onClick={e => handlePlayAudio(e, item)}
                      title={`Listen to ${item.word}`}
                      aria-label={`Pronounce ${item.word}`}
                    >
                      {isSpeaking ? <Volume2 size={15} /> : <Volume2 size={14} />}
                    </button>
                  </div>
                </div>

                <div className="word-preview-title">{item.word}</div>
                <div className="word-preview-phonetic">{item.phonetic}</div>
              </div>

              <div className="word-preview-meaning">
                {translatedMeaning}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
