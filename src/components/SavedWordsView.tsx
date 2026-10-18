import React, { useState } from 'react';
import { Search, Volume2, Trash2, BookmarkPlus, ArrowRight, BookOpen } from 'lucide-react';
import { VocabularyWord } from '../data/vocabulary';
import { DictionaryEntry } from '../data/dictionaryDatabase';
import { Language } from '../data/languages';
import { audioService } from '../utils/audio';

type UnifiedSavedItem = {
  id: string;
  word: string;
  phonetic: string;
  partOfSpeech: string;
  englishDefinition: string;
  translations: Record<string, string>;
  isCustom?: boolean;
};

interface SavedWordsViewProps {
  allWords: VocabularyWord[];
  savedWordIds: string[];
  customSavedEntries: DictionaryEntry[];
  learnedWordIds: string[];
  selectedLanguage: Language;
  onRemoveSavedId: (id: string) => void;
  onRemoveCustomSaved: (id: string) => void;
  onToggleLearned: (id: string) => void;
  onGoToLearnWord: (wordId: string) => void;
  onViewCustomWord: (entry: DictionaryEntry) => void;
  onBrowseWords: () => void;
}

export const SavedWordsView: React.FC<SavedWordsViewProps> = ({
  allWords,
  savedWordIds,
  customSavedEntries,
  learnedWordIds,
  selectedLanguage,
  onRemoveSavedId,
  onRemoveCustomSaved,
  onToggleLearned,
  onGoToLearnWord,
  onViewCustomWord,
  onBrowseWords
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'learned' | 'unlearned'>('all');
  const [speakingWordId, setSpeakingWordId] = useState<string | null>(null);

  // Combine daily saved words and custom dictionary entries
  const dailySaved: UnifiedSavedItem[] = allWords
    .filter(w => savedWordIds.includes(w.id))
    .map(w => ({
      id: w.id,
      word: w.word,
      phonetic: w.phonetic,
      partOfSpeech: w.partOfSpeech,
      englishDefinition: w.englishDefinition,
      translations: w.translations,
      isCustom: false
    }));

  const customSaved: UnifiedSavedItem[] = customSavedEntries.map(e => ({
    id: e.id,
    word: e.word,
    phonetic: e.phonetic,
    partOfSpeech: e.partOfSpeech,
    englishDefinition: e.englishDefinition,
    translations: e.translations,
    isCustom: true
  }));

  const allSavedItems: UnifiedSavedItem[] = [...customSaved, ...dailySaved];

  const filteredWords = allSavedItems.filter(item => {
    const isLearned = learnedWordIds.includes(item.id);
    if (filterMode === 'learned' && !isLearned) return false;
    if (filterMode === 'unlearned' && isLearned) return false;

    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;

    const nativeMeaning = (item.translations[selectedLanguage.code] || '').toLowerCase();
    return (
      item.word.toLowerCase().includes(q) ||
      item.englishDefinition.toLowerCase().includes(q) ||
      nativeMeaning.includes(q)
    );
  });

  const handlePlayAudio = (e: React.MouseEvent, word: string, id: string) => {
    e.stopPropagation();
    if (speakingWordId === id) {
      audioService.stop();
      setSpeakingWordId(null);
      return;
    }
    setSpeakingWordId(id);
    audioService.speak(word, {
      onEnd: () => setSpeakingWordId(null),
      onError: () => setSpeakingWordId(null)
    });
  };

  const handleRemove = (item: UnifiedSavedItem) => {
    if (item.isCustom) {
      onRemoveCustomSaved(item.id);
    } else {
      onRemoveSavedId(item.id);
    }
  };

  const handleOpenFull = (item: UnifiedSavedItem) => {
    if (item.isCustom) {
      const match = customSavedEntries.find(e => e.id === item.id);
      if (match) onViewCustomWord(match);
    } else {
      onGoToLearnWord(item.id);
    }
  };

  return (
    <div className="saved-view-wrapper">
      {/* Header & Search */}
      <div className="saved-header">
        <div>
          <h2 className="section-title">Saved Vocabulary Library</h2>
          <p style={{ fontSize: '14px', color: '#64748b' }}>
            Review, practice, and listen to your personal collection of bookmarked words from daily lessons and dictionary searches.
          </p>
        </div>

        {allSavedItems.length > 0 && (
          <div className="search-input-wrapper">
            <Search size={18} className="search-icon-pos" />
            <input
              type="text"
              className="search-input"
              placeholder="Search saved words or meanings..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Filter Tabs if items exist */}
      {allSavedItems.length > 0 && (
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setFilterMode('all')}
            style={{
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '13px',
              fontWeight: 600,
              background: filterMode === 'all' ? '#2563eb' : '#ffffff',
              color: filterMode === 'all' ? '#ffffff' : '#475569',
              border: '1px solid #cbd5e1'
            }}
          >
            All Saved ({allSavedItems.length})
          </button>
          <button
            onClick={() => setFilterMode('learned')}
            style={{
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '13px',
              fontWeight: 600,
              background: filterMode === 'learned' ? '#059669' : '#ffffff',
              color: filterMode === 'learned' ? '#ffffff' : '#475569',
              border: '1px solid #cbd5e1'
            }}
          >
            Learned ({allSavedItems.filter(w => learnedWordIds.includes(w.id)).length})
          </button>
          <button
            onClick={() => setFilterMode('unlearned')}
            style={{
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '13px',
              fontWeight: 600,
              background: filterMode === 'unlearned' ? '#d97706' : '#ffffff',
              color: filterMode === 'unlearned' ? '#ffffff' : '#475569',
              border: '1px solid #cbd5e1'
            }}
          >
            Need Review ({allSavedItems.filter(w => !learnedWordIds.includes(w.id)).length})
          </button>
        </div>
      )}

      {/* List or Empty State */}
      {allSavedItems.length === 0 ? (
        <div className="empty-saved-card">
          <img
            src="/assets/empty-bookmark.jpg"
            alt="Bookmark your vocabulary words"
            className="empty-state-img"
          />
          <h3 className="empty-state-title">No Saved Words Yet</h3>
          <p className="empty-state-desc">
            As you learn new words or search the dictionary, click the bookmark icon on any vocabulary card to save words here for quick revision.
          </p>
          <button className="btn-primary" onClick={onBrowseWords}>
            <BookmarkPlus size={18} />
            <span>Explore Today’s Words</span>
          </button>
        </div>
      ) : filteredWords.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 0', color: '#64748b' }}>
          No saved words matched "{searchQuery}".
        </div>
      ) : (
        <div className="saved-list-container">
          {filteredWords.map(item => {
            const isLearned = learnedWordIds.includes(item.id);
            const isSpeaking = speakingWordId === item.id;
            const nativeMeaning = item.translations[selectedLanguage.code] || item.translations['hi'] || '';

            return (
              <div key={item.id} className="saved-word-row">
                <div className="saved-word-info">
                  <div className="saved-word-name">
                    <span>{item.word}</span>
                    <span className="word-preview-phonetic" style={{ margin: 0 }}>{item.phonetic}</span>
                    <span className={`word-pos-tag ${item.partOfSpeech.toLowerCase()}`}>{item.partOfSpeech}</span>
                    {item.isCustom && (
                      <span style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        color: '#2563eb',
                        background: '#eff6ff',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        border: '1px solid #bfdbfe'
                      }}>
                        Dictionary
                      </span>
                    )}
                    {isLearned && (
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        color: '#059669',
                        background: '#d1fae5',
                        padding: '2px 8px',
                        borderRadius: '4px'
                      }}>
                        ✓ Learned
                      </span>
                    )}
                  </div>
                  {nativeMeaning && <div className="saved-word-meaning">{nativeMeaning}</div>}
                  <div className="saved-word-def">{item.englishDefinition}</div>
                </div>

                <div className="saved-word-actions">
                  <button
                    className={`audio-btn-sm ${isSpeaking ? 'speaking' : ''}`}
                    onClick={e => handlePlayAudio(e, item.word, item.id)}
                    title={`Pronounce ${item.word}`}
                  >
                    <Volume2 size={16} />
                  </button>

                  {!item.isCustom && (
                    <button
                      onClick={() => onToggleLearned(item.id)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: 700,
                        background: isLearned ? '#ecfdf5' : '#f8fafc',
                        color: isLearned ? '#047857' : '#475569',
                        border: '1px solid #cbd5e1'
                      }}
                      title={isLearned ? 'Mark as unlearned' : 'Mark as learned'}
                    >
                      {isLearned ? 'Learned ✓' : 'Mark Learned'}
                    </button>
                  )}

                  <button
                    onClick={() => handleOpenFull(item)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 700,
                      background: '#eff6ff',
                      color: '#1d4ed8',
                      border: '1px solid #bfdbfe',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <span>Full Card</span>
                    <ArrowRight size={14} />
                  </button>

                  <button
                    onClick={() => handleRemove(item)}
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '8px',
                      background: '#fff1f2',
                      color: '#e11d48',
                      border: '1px solid #fecdd3',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="Remove from saved words"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
