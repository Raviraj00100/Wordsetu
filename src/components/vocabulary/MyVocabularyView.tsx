import React, { useState, useEffect } from 'react';
import {
  Bookmark, Sparkles, Volume2, Search, CheckCircle2,
  RotateCcw, BookOpen, Layers, Star, Trash2
} from 'lucide-react';
import { VocabularyWord } from '../../data/vocabulary';
import { Language } from '../../data/languages';
import { SavedStoryWord } from '../../types/story';
import { kathaSetuDb } from '../../services/db';
import { audioService } from '../../utils/audio';

interface MyVocabularyViewProps {
  allWords: VocabularyWord[];
  savedWordIds: string[];
  learnedWordIds: string[];
  selectedLanguage: Language;
  onToggleLearned: (id: string) => void;
  onRemoveSavedId: (id: string) => void;
  onBrowseWords: () => void;
}

export const MyVocabularyView: React.FC<MyVocabularyViewProps> = ({
  allWords,
  savedWordIds,
  learnedWordIds,
  selectedLanguage,
  onToggleLearned,
  onRemoveSavedId,
  onBrowseWords
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'daily' | 'stories' | 'revision' | 'mastered'>('all');
  const [storyWords, setStoryWords] = useState<SavedStoryWord[]>([]);
  const [searchFilter, setSearchFilter] = useState('');
  const [revisionIndex, setRevisionIndex] = useState(0);
  const [showFlashcardMeaning, setShowFlashcardMeaning] = useState(false);

  useEffect(() => {
    kathaSetuDb.getAllSavedStoryWords().then(setStoryWords);
  }, []);

  const savedDailyWords = allWords.filter(w => savedWordIds.includes(w.id));
  const masteredWords = allWords.filter(w => learnedWordIds.includes(w.id));

  // Revision deck (saved words + mastered words for spaced repetition)
  const revisionDeck = [...savedDailyWords, ...masteredWords].slice(0, 20);

  const handleSpeak = (text: string) => {
    audioService.speak(text);
  };

  const handleRemoveStoryWord = async (id: string) => {
    await kathaSetuDb.removeSavedStoryWord(id);
    setStoryWords(prev => prev.filter(w => w.id !== id));
  };

  const totalWordsCount = savedDailyWords.length + storyWords.length;

  return (
    <div className="container" style={{ maxWidth: '960px', margin: '20px auto 60px' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
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
          Personal Word Bank
        </span>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '30px',
          fontWeight: 800,
          color: '#0f172a',
          marginTop: '8px'
        }}>
          My Vocabulary & Spaced Revision
        </h1>
        <p style={{ fontSize: '14px', color: '#64748b', marginTop: '2px' }}>
          Reinforce your vocabulary through daily flashcard spaced repetition, review saved words from daily lessons, and practice words collected from KathaSetu stories.
        </p>
      </div>

      {/* Vocabulary Statistics Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '14px',
        marginBottom: '28px'
      }}>
        <div style={{ background: '#ffffff', padding: '16px', borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase' }}>Daily Words</div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#1e3a8a', marginTop: '4px' }}>{savedDailyWords.length}</div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>From 20-word lessons</div>
        </div>

        <div style={{ background: '#ffffff', padding: '16px', borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase' }}>Story Words</div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#5b21b6', marginTop: '4px' }}>{storyWords.length}</div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>Saved while reading</div>
        </div>

        <div style={{ background: '#ffffff', padding: '16px', borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#059669', textTransform: 'uppercase' }}>Words Mastered</div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#064e3b', marginTop: '4px' }}>{masteredWords.length}</div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>Completed in quizzes</div>
        </div>

        <div style={{ background: '#ffffff', padding: '16px', borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#d97706', textTransform: 'uppercase' }}>Due for Revision</div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#78350f', marginTop: '4px' }}>{revisionDeck.length}</div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>Spaced repetition</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        paddingBottom: '10px',
        marginBottom: '20px',
        borderBottom: '1px solid #e2e8f0'
      }}>
        {[
          { id: 'all', label: `All Saved Words (${totalWordsCount})` },
          { id: 'daily', label: `Daily Lesson Words (${savedDailyWords.length})` },
          { id: 'stories', label: `From KathaSetu Stories (${storyWords.length})` },
          { id: 'revision', label: `Spaced Revision (${revisionDeck.length})` },
          { id: 'mastered', label: `Mastered (${masteredWords.length})` }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            style={{
              padding: '9px 16px',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === tab.id ? '#2563eb' : '#f1f5f9',
              color: activeTab === tab.id ? '#ffffff' : '#475569',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search Input for Vocabulary */}
      {activeTab !== 'revision' && (
        <div style={{ position: 'relative', marginBottom: '20px' }}>
          <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search saved vocabulary words..."
            value={searchFilter}
            onChange={e => setSearchFilter(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px 10px 40px',
              borderRadius: '10px',
              border: '1px solid #cbd5e1',
              fontSize: '14px'
            }}
          />
        </div>
      )}

      {/* Revision Mode: Interactive Flashcard Spaced Repetition */}
      {activeTab === 'revision' && (
        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          border: '1px solid #e2e8f0',
          padding: '36px',
          textAlign: 'center',
          boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
        }}>
          {revisionDeck.length > 0 ? (
            <div>
              <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
                Card {revisionIndex + 1} of {revisionDeck.length}
              </div>

              {/* Flashcard Box */}
              <div
                onClick={() => setShowFlashcardMeaning(prev => !prev)}
                style={{
                  background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)',
                  borderRadius: '16px',
                  border: '2px solid #bfdbfe',
                  padding: '48px 24px',
                  cursor: 'pointer',
                  maxWidth: '520px',
                  margin: '0 auto 24px',
                  boxShadow: '0 8px 20px rgba(37, 99, 235, 0.08)',
                  transition: 'transform 0.15s ease'
                }}
              >
                <h2 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '32px',
                  fontWeight: 800,
                  color: '#0f172a',
                  marginBottom: '8px'
                }}>
                  {revisionDeck[revisionIndex].word}
                </h2>
                <div style={{ fontSize: '15px', color: '#64748b', marginBottom: '16px' }}>
                  {revisionDeck[revisionIndex].phonetic} • {revisionDeck[revisionIndex].partOfSpeech}
                </div>

                {!showFlashcardMeaning ? (
                  <div style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#2563eb',
                    background: '#ffffff',
                    padding: '8px 16px',
                    borderRadius: '9999px',
                    display: 'inline-block',
                    border: '1px solid #bfdbfe'
                  }}>
                    Tap to Flip & Reveal Meaning
                  </div>
                ) : (
                  <div style={{ animation: 'fadeIn 0.2s ease' }}>
                    <div style={{
                      fontSize: '18px',
                      fontWeight: 700,
                      color: '#1d4ed8',
                      marginBottom: '8px'
                    }}>
                      {revisionDeck[revisionIndex].translations[selectedLanguage.code] || revisionDeck[revisionIndex].word}
                    </div>
                    <p style={{ fontSize: '14px', color: '#334155', maxWidth: '400px', margin: '0 auto' }}>
                      {revisionDeck[revisionIndex].englishDefinition}
                    </p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button
                  onClick={() => handleSpeak(revisionDeck[revisionIndex].word)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '10px 18px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    color: '#334155',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <Volume2 size={16} />
                  <span>Pronounce</span>
                </button>
                <button
                  onClick={() => {
                    setShowFlashcardMeaning(false);
                    setRevisionIndex((revisionIndex + 1) % revisionDeck.length);
                  }}
                  style={{
                    padding: '10px 24px',
                    borderRadius: '10px',
                    background: '#2563eb',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Next Word
                </button>
              </div>
            </div>
          ) : (
            <div>
              <Sparkles size={40} color="#94a3b8" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                No Words Scheduled for Revision
              </h3>
              <p style={{ fontSize: '14px', color: '#64748b' }}>
                Save words from your daily lessons or while reading stories to start your spaced repetition deck.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab: Words Grid */}
      {activeTab !== 'revision' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {/* Daily Words */}
          {(activeTab === 'all' || activeTab === 'daily') &&
            savedDailyWords
              .filter(w => !searchFilter || w.word.toLowerCase().includes(searchFilter.toLowerCase()))
              .map(word => (
                <div
                  key={word.id}
                  style={{
                    background: '#ffffff',
                    borderRadius: '14px',
                    border: '1px solid #e2e8f0',
                    padding: '18px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>{word.word}</span>
                      <button
                        onClick={() => handleSpeak(word.word)}
                        style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer' }}
                      >
                        <Volume2 size={16} />
                      </button>
                    </div>
                    <button
                      onClick={() => onRemoveSavedId(word.id)}
                      style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                      title="Remove"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#2563eb', marginBottom: '4px' }}>
                    {word.translations[selectedLanguage.code] || word.word}
                  </div>
                  <div style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.4 }}>
                    {word.englishDefinition}
                  </div>
                </div>
              ))}

          {/* Story Words */}
          {(activeTab === 'all' || activeTab === 'stories') &&
            storyWords
              .filter(sw => !searchFilter || sw.word.toLowerCase().includes(searchFilter.toLowerCase()))
              .map(sw => (
                <div
                  key={sw.id}
                  style={{
                    background: '#ffffff',
                    borderRadius: '14px',
                    border: '1px solid #e2e8f0',
                    padding: '18px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>{sw.word}</span>
                      <button
                        onClick={() => handleSpeak(sw.word)}
                        style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer' }}
                      >
                        <Volume2 size={16} />
                      </button>
                    </div>
                    <button
                      onClick={() => handleRemoveStoryWord(sw.id)}
                      style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  {sw.contextSentence && (
                    <div style={{ fontSize: '12px', color: '#475569', fontStyle: 'italic', background: '#f8fafc', padding: '6px 8px', borderRadius: '6px', marginBottom: '6px' }}>
                      "{sw.contextSentence}"
                    </div>
                  )}
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                    From: {sw.storyTitle}
                  </div>
                </div>
              ))}
        </div>
      )}
    </div>
  );
};
