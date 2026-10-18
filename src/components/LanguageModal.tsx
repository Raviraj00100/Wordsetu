import React, { useState } from 'react';
import { Search, X, Check, Globe } from 'lucide-react';
import { SUPPORTED_LANGUAGES, Language } from '../data/languages';

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLanguage: Language;
  onSelectLanguage: (lang: Language) => void;
}

export const LanguageModal: React.FC<LanguageModalProps> = ({
  isOpen,
  onClose,
  selectedLanguage,
  onSelectLanguage
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredLanguages = SUPPORTED_LANGUAGES.filter(lang => {
    const q = searchQuery.toLowerCase().trim();
    return (
      lang.name.toLowerCase().includes(q) ||
      lang.nativeName.toLowerCase().includes(q) ||
      lang.region.toLowerCase().includes(q)
    );
  });

  return (
    <div
      className="modal-overlay"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="language-modal-title"
    >
      <div className="lang-modal">
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: '#eff6ff',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Globe size={20} />
            </div>
            <div>
              <h2 id="language-modal-title" className="modal-title">
                Select Your Meaning Language
              </h2>
              <p style={{ fontSize: '13px', color: '#64748b' }}>
                Vocabulary translations will be displayed in your chosen Indian language.
              </p>
            </div>
          </div>
          <button
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close language selector modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search Input Box */}
        <div className="modal-search-box">
          <div style={{ position: 'relative' }}>
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#94a3b8'
              }}
            />
            <input
              type="text"
              className="search-input"
              placeholder="Search by language (e.g. Hindi, தமிழ், Bengali)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94a3b8',
                  background: 'none',
                  border: 'none'
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Language Cards Grid */}
        <div className="lang-list-grid">
          {filteredLanguages.length > 0 ? (
            filteredLanguages.map(lang => {
              const isSelected = lang.code === selectedLanguage.code;
              return (
                <button
                  key={lang.code}
                  className={`lang-choice-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => {
                    onSelectLanguage(lang);
                    onClose();
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                      <span className="lang-name-en">{lang.name}</span>
                      <span className="lang-name-native">({lang.nativeName})</span>
                    </div>
                    <div className="lang-card-region">{lang.region}</div>
                  </div>
                  {isSelected && (
                    <div style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      background: '#2563eb',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Check size={16} strokeWidth={3} />
                    </div>
                  )}
                </button>
              );
            })
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '32px 0', color: '#64748b' }}>
              No languages matched "{searchQuery}". Try typing in English or your native script.
            </div>
          )}
        </div>

        {/* Modal Footer Note */}
        <div style={{
          padding: '12px 28px',
          background: '#f8fafc',
          borderTop: '1px solid #e2e8f0',
          fontSize: '12px',
          color: '#64748b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <span>12 Major Indian Languages supported</span>
          <span style={{ fontWeight: 600, color: '#1d4ed8' }}>WordSetu Platform</span>
        </div>
      </div>
    </div>
  );
};
