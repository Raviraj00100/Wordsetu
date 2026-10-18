import React from 'react';
import { BookOpen, Sparkles, Globe, BookmarkCheck, CheckCircle2 } from 'lucide-react';
import { Language } from '../data/languages';

interface NavbarProps {
  activeTab: 'home' | 'learn' | 'quiz' | 'saved';
  setActiveTab: (tab: 'home' | 'learn' | 'quiz' | 'saved') => void;
  selectedLanguage: Language;
  onOpenLanguageModal: () => void;
  savedWordsCount: number;
  learnedWordsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  selectedLanguage,
  onOpenLanguageModal,
  savedWordsCount,
  learnedWordsCount
}) => {
  return (
    <>
      <header className="navbar-wrapper">
        <div className="container navbar">
          {/* Brand Logo & Tagline */}
          <div className="brand-link" onClick={() => setActiveTab('home')} role="button" tabIndex={0}>
            <div className="brand-icon">
              <img src="/favicon.svg" alt="WordSetu Logo" width="40" height="40" style={{ borderRadius: '10px' }} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="brand-title">WordSetu</span>
                <span className="brand-tag">Daily English</span>
              </div>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="nav-links" aria-label="Main Navigation">
            <button
              className={`nav-item-btn ${activeTab === 'home' ? 'active' : ''}`}
              onClick={() => setActiveTab('home')}
            >
              <BookOpen size={17} />
              <span>Home</span>
            </button>

            <button
              className={`nav-item-btn ${activeTab === 'learn' ? 'active' : ''}`}
              onClick={() => setActiveTab('learn')}
            >
              <Sparkles size={17} />
              <span>Learn (10 Words)</span>
              {learnedWordsCount > 0 && (
                <span className="nav-badge" title={`${learnedWordsCount} of 10 completed`}>
                  {learnedWordsCount}/10
                </span>
              )}
            </button>

            <button
              className={`nav-item-btn ${activeTab === 'quiz' ? 'active' : ''}`}
              onClick={() => setActiveTab('quiz')}
            >
              <CheckCircle2 size={17} />
              <span>Practice Quiz</span>
            </button>

            <button
              className={`nav-item-btn ${activeTab === 'saved' ? 'active' : ''}`}
              onClick={() => setActiveTab('saved')}
            >
              <BookmarkCheck size={17} />
              <span>Saved Words</span>
              {savedWordsCount > 0 && (
                <span className="nav-badge" style={{ background: '#db2777' }}>
                  {savedWordsCount}
                </span>
              )}
            </button>
          </nav>

          {/* Language Selector Trigger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              className="lang-selector-btn"
              onClick={onOpenLanguageModal}
              title="Change Meaning Language"
              aria-label={`Current translation language: ${selectedLanguage.name}. Click to change.`}
            >
              <Globe size={18} color="#2563eb" />
              <span style={{ fontWeight: 600 }}>{selectedLanguage.name}</span>
              <span className="lang-native-pill">{selectedLanguage.nativeName}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-nav" aria-label="Mobile Navigation">
        <div className="mobile-nav-grid">
          <button
            className={`mobile-nav-btn ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => setActiveTab('home')}
          >
            <BookOpen size={20} />
            <span>Home</span>
          </button>
          <button
            className={`mobile-nav-btn ${activeTab === 'learn' ? 'active' : ''}`}
            onClick={() => setActiveTab('learn')}
          >
            <Sparkles size={20} />
            <span>Learn</span>
          </button>
          <button
            className={`mobile-nav-btn ${activeTab === 'quiz' ? 'active' : ''}`}
            onClick={() => setActiveTab('quiz')}
          >
            <CheckCircle2 size={20} />
            <span>Quiz</span>
          </button>
          <button
            className={`mobile-nav-btn ${activeTab === 'saved' ? 'active' : ''}`}
            onClick={() => setActiveTab('saved')}
          >
            <BookmarkCheck size={20} />
            <span>Saved ({savedWordsCount})</span>
          </button>
        </div>
      </nav>
    </>
  );
};
