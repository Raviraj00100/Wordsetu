import React, { useState } from 'react';
import { Volume2, Bookmark, Check, X, Sparkles, BookOpen } from 'lucide-react';
import { audioService } from '../../utils/audio';
import { kathaSetuDb } from '../../services/db';
import { DictionaryService } from '../../utils/dictionaryService';

interface WordInspectorModalProps {
  word: string;
  contextSentence: string;
  storyId: string;
  storyTitle: string;
  onClose: () => void;
  onWordSaved?: () => void;
}

export const WordInspectorModal: React.FC<WordInspectorModalProps> = ({
  word,
  contextSentence,
  storyId,
  storyTitle,
  onClose,
  onWordSaved
}) => {
  const [isSaved, setIsSaved] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const cleanWord = word.trim().replace(/[.,!?;:"'()\[\]{}—]/g, '');

  const handlePlayAudio = () => {
    setIsPlayingAudio(true);
    audioService.speak(cleanWord, {
      onEnd: () => setIsPlayingAudio(false),
      onError: () => setIsPlayingAudio(false)
    });
  };

  const handleSaveToVocabulary = async () => {
    try {
      await kathaSetuDb.saveStoryWord({
        id: `sword-${Date.now()}-${cleanWord.toLowerCase()}`,
        word: cleanWord,
        storyId,
        storyTitle,
        contextSentence,
        language: 'en',
        savedAt: Date.now()
      });
      setIsSaved(true);
      onWordSaved?.();
    } catch (e) {
      console.warn('Error saving story word:', e);
    }
  };

  return (
    <div
      className="modal-overlay"
      style={{ alignItems: 'flex-end', padding: 0 }}
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="word-inspector-sheet"
        style={{
          background: '#ffffff',
          width: '100%',
          maxWidth: '540px',
          margin: '0 auto',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
          boxShadow: '0 -10px 40px rgba(15, 23, 42, 0.18)',
          border: '1px solid #e2e8f0',
          padding: '24px',
          animation: 'slideUp 260ms cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Header Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <div style={{ width: '48px', height: '5px', borderRadius: '9999px', background: '#cbd5e1' }} />
        </div>

        {/* Word Title & Action Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '24px',
              fontWeight: 800,
              color: '#0f172a',
              letterSpacing: '-0.3px'
            }}>
              {cleanWord}
            </h3>
            <button
              onClick={handlePlayAudio}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: isPlayingAudio ? '#2563eb' : '#eff6ff',
                color: isPlayingAudio ? '#ffffff' : '#2563eb',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              title="Pronounce Word"
            >
              <Volume2 size={18} />
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={handleSaveToVocabulary}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '9999px',
                border: '1px solid',
                borderColor: isSaved ? '#10b981' : '#bfdbfe',
                background: isSaved ? '#ecfdf5' : '#eff6ff',
                color: isSaved ? '#059669' : '#2563eb',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {isSaved ? (
                <>
                  <Check size={16} />
                  <span>Saved</span>
                </>
              ) : (
                <>
                  <Bookmark size={16} />
                  <span>Save to Vocabulary</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: '#f1f5f9',
                border: 'none',
                color: '#64748b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Story Context Sentence */}
        {contextSentence && (
          <div style={{
            background: '#f8fafc',
            borderLeft: '4px solid #2563eb',
            padding: '10px 14px',
            borderRadius: '8px',
            fontSize: '13px',
            color: '#334155',
            fontStyle: 'italic',
            marginBottom: '18px'
          }}>
            "{contextSentence}"
            <div style={{ fontSize: '11px', color: '#94a3b8', fontStyle: 'normal', marginTop: '4px' }}>
              From: {storyTitle}
            </div>
          </div>
        )}

        {/* Multilingual Meanings Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
          <div style={{
            padding: '12px',
            borderRadius: '12px',
            background: '#f0fdf4',
            border: '1px solid #bbf7d0'
          }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#16a34a', textTransform: 'uppercase' }}>
              हिंदी (Hindi)
            </div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#14532d', marginTop: '2px' }}>
              अर्थ / अर्थबोध
            </div>
          </div>

          <div style={{
            padding: '12px',
            borderRadius: '12px',
            background: '#eff6ff',
            border: '1px solid #bfdbfe'
          }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase' }}>
              தமிழ் (Tamil)
            </div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#1e3a8a', marginTop: '2px' }}>
              பொருள் / விளக்கம்
            </div>
          </div>

          <div style={{
            padding: '12px',
            borderRadius: '12px',
            background: '#fdf4ff',
            border: '1px solid #f0abfc'
          }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#c026d3', textTransform: 'uppercase' }}>
              മലയാളം (Malayalam)
            </div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#701a75', marginTop: '2px' }}>
              അർത്ഥം / വിവരണം
            </div>
          </div>

          <div style={{
            padding: '12px',
            borderRadius: '12px',
            background: '#fffbeb',
            border: '1px solid #fde68a'
          }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#d97706', textTransform: 'uppercase' }}>
              English Definition
            </div>
            <div style={{ fontSize: '13px', fontWeight: 500, color: '#78350f', marginTop: '2px' }}>
              Active contextual vocabulary
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', fontSize: '12px', color: '#94a3b8' }}>
          Tap anywhere outside or close to resume reading seamlessly.
        </div>
      </div>
    </div>
  );
};
