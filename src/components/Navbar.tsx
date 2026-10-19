import React, { useState } from 'react';
import {
  BookOpen, Sparkles, Library, FileText, CheckCircle2, BookmarkCheck,
  Heart, Search, Flame, Globe, Settings, Award,
  Bell, X, Menu
} from 'lucide-react';
import { Language } from '../data/languages';

export type ActiveNavTab =
  | 'home'
  | 'learn'
  | 'stories'
  | 'reading_test'
  | 'quiz'
  | 'vocabulary'
  | 'wishlist'
  | 'search'
  | 'shelf'
  | 'progress'
  | 'settings'
  | 'admin';

interface NavbarProps {
  activeTab: ActiveNavTab;
  setActiveTab: (tab: ActiveNavTab) => void;
  selectedLanguage: Language;
  onOpenLanguageModal: () => void;
  savedWordsCount: number;
  learnedWordsCount: number;
  streakDays?: number;
  wishlistCount?: number;
  onOpenSearch?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  selectedLanguage,
  onOpenLanguageModal,
  savedWordsCount,
  learnedWordsCount,
  streakDays = 1,
  wishlistCount = 0,
  onOpenSearch
}) => {
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [showNotificationToast, setShowNotificationToast] = useState(false);

  const handleNavClick = (tab: ActiveNavTab) => {
    setActiveTab(tab);
    setIsMobileDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchClick = () => {
    if (onOpenSearch) {
      onOpenSearch();
    } else {
      handleNavClick('search');
    }
  };

  return (
    <>
      <header className="navbar-wrapper">
        <div className="container navbar-container">
          {/* Brand Logo & Name: Exactly "WordSetu" */}
          <div
            className="navbar-brand"
            onClick={() => handleNavClick('home')}
            role="button"
            tabIndex={0}
            aria-label="WordSetu Home"
          >
            <div className="brand-logo-frame">
              <img
                src="/favicon.svg"
                alt="WordSetu"
                className="brand-logo-img"
              />
            </div>
            <div className="brand-text-col">
              <span className="brand-name">WordSetu</span>
              <span className="brand-tagline">Learn English</span>
            </div>
          </div>

          {/* Desktop Navigation Links — All 7 Requested Items */}
          <nav className="navbar-desktop-nav" aria-label="Desktop Navigation">
            <button
              className={`nav-tab-btn ${activeTab === 'home' ? 'active' : ''}`}
              onClick={() => handleNavClick('home')}
            >
              <BookOpen size={16} />
              <span>Home</span>
            </button>

            <button
              className={`nav-tab-btn ${activeTab === 'learn' ? 'active' : ''}`}
              onClick={() => handleNavClick('learn')}
            >
              <Sparkles size={16} />
              <span>Daily Words</span>
              {learnedWordsCount > 0 && (
                <span className="nav-badge-pill" title={`${learnedWordsCount} completed`}>
                  {learnedWordsCount}/20
                </span>
              )}
            </button>

            <button
              className={`nav-tab-btn ${activeTab === 'stories' ? 'active' : ''}`}
              onClick={() => handleNavClick('stories')}
            >
              <Library size={16} />
              <span>Stories</span>
            </button>

            <button
              className={`nav-tab-btn ${activeTab === 'reading_test' ? 'active' : ''}`}
              onClick={() => handleNavClick('reading_test')}
            >
              <FileText size={16} />
              <span>Reading Test</span>
            </button>

            <button
              className={`nav-tab-btn ${activeTab === 'quiz' ? 'active' : ''}`}
              onClick={() => handleNavClick('quiz')}
            >
              <CheckCircle2 size={16} />
              <span>Quiz</span>
            </button>

            <button
              className={`nav-tab-btn ${activeTab === 'vocabulary' ? 'active' : ''}`}
              onClick={() => handleNavClick('vocabulary')}
            >
              <BookmarkCheck size={16} />
              <span>My Vocabulary</span>
              {savedWordsCount > 0 && (
                <span className="nav-badge-pill">{savedWordsCount}</span>
              )}
            </button>

            <button
              className={`nav-tab-btn ${activeTab === 'wishlist' ? 'active' : ''}`}
              onClick={() => handleNavClick('wishlist')}
            >
              <Heart
                size={16}
                fill={activeTab === 'wishlist' ? '#e11d48' : 'none'}
                color={activeTab === 'wishlist' ? '#e11d48' : 'currentColor'}
              />
              <span>Wishlist</span>
              {wishlistCount > 0 && (
                <span className="nav-wishlist-badge">
                  {wishlistCount}
                </span>
              )}
            </button>
          </nav>

          {/* Right Toolbar: Streamlined controls (Search, Streak, Lang, Hamburger) */}
          <div className="navbar-right-toolbar">
            {/* Search Icon / Button (Desktop) */}
            <button
              className="toolbar-icon-btn search-trigger hide-on-mobile"
              onClick={handleSearchClick}
              title="Search English Vocabulary"
              aria-label="Search Dictionary"
            >
              <Search size={18} />
              <span className="search-key-hint">Search</span>
            </button>

            {/* Notifications Trigger (Desktop) */}
            <div className="hide-on-mobile" style={{ position: 'relative' }}>
              <button
                className="toolbar-icon-btn notification-trigger"
                onClick={() => setShowNotificationToast(prev => !prev)}
                title="Notifications"
                aria-label="Notifications"
              >
                <Bell size={18} />
                <span className="notification-dot" />
              </button>

              {showNotificationToast && (
                <div className="notification-popover">
                  <div className="notif-popover-header">
                    <span style={{ fontWeight: 700, fontSize: '13px' }}>Notifications</span>
                    <button
                      onClick={() => setShowNotificationToast(false)}
                      style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#94a3b8' }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <div className="notif-popover-body">
                    <div className="notif-item">
                      <Flame size={16} color="#f97316" />
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>
                          {streakDays} Day Streak Active!
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>
                          Complete today's 20 words to keep your streak burning.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Daily Streak Indicator */}
            <div className="nav-streak-pill" title="Current Daily Streak">
              <Flame size={15} className="streak-flame" />
              <span>{streakDays}d</span>
            </div>

            {/* Language Selector Button */}
            <button
              className="nav-lang-btn hide-on-mobile"
              onClick={onOpenLanguageModal}
              title="Change Translation Language"
              aria-label={`Selected language: ${selectedLanguage.name}`}
            >
              <Globe size={15} color="#2563eb" />
              <span>{selectedLanguage.name}</span>
              <span className="nav-lang-badge">{selectedLanguage.nativeName}</span>
            </button>

            {/* Settings & Preferences Button */}
            <button
              className={`toolbar-icon-btn hide-on-mobile ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => handleNavClick('settings')}
              title="Platform Settings & Preferences"
              aria-label="Settings"
            >
              <Settings size={18} />
            </button>

            {/* Mobile Drawer Toggle */}
            <button
              className="mobile-hamburger-btn hide-on-desktop"
              onClick={() => setIsMobileDrawerOpen(prev => !prev)}
              aria-label="Toggle navigation drawer"
            >
              {isMobileDrawerOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu for extra links & language modal */}
      {isMobileDrawerOpen && (
        <div
          className="mobile-drawer-overlay"
          onClick={() => setIsMobileDrawerOpen(false)}
        >
          <div
            className="mobile-drawer-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="drawer-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img src="/favicon.svg" alt="WordSetu" width="28" height="28" />
                <span style={{ fontWeight: 800, fontSize: '18px', color: '#0f172a' }}>WordSetu</span>
              </div>
              <button
                onClick={() => setIsMobileDrawerOpen(false)}
                className="drawer-close-btn"
              >
                <X size={18} />
              </button>
            </div>

            <div className="drawer-links-list">
              {/* Daily Streak Banner in Drawer */}
              <div style={{
                margin: '4px 10px 10px',
                padding: '10px 12px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
                border: '1px solid #fed7aa',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <Flame size={20} color="#ea580c" />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#9a3412' }}>
                    {streakDays} Day Learning Streak
                  </div>
                  <div style={{ fontSize: '11px', color: '#c2410c' }}>
                    Study today's 20 words to keep your streak burning!
                  </div>
                </div>
              </div>

              {[
                { id: 'home', label: 'Home', icon: BookOpen },
                { id: 'search', label: 'Search Dictionary', icon: Search },
                { id: 'learn', label: 'Daily Words (20 Words)', icon: Sparkles },
                { id: 'stories', label: 'Stories Library', icon: Library },
                { id: 'reading_test', label: 'Reading Test & WPM', icon: FileText },
                { id: 'quiz', label: 'Practice Quiz', icon: CheckCircle2 },
                { id: 'vocabulary', label: 'My Vocabulary', icon: BookmarkCheck },
                { id: 'wishlist', label: 'My Story Wishlist', icon: Heart },
                { id: 'shelf', label: 'My Story Shelf', icon: Library },
                { id: 'progress', label: 'Learning Progress', icon: Award },
                { id: 'settings', label: 'Settings', icon: Settings }
              ].map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id as ActiveNavTab)}
                    className={`drawer-link-btn ${isActive ? 'active' : ''}`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </button>
                );
              })}

              <div style={{ padding: '8px 12px', marginTop: '8px' }}>
                <button
                  className="drawer-lang-selector-btn"
                  onClick={() => {
                    setIsMobileDrawerOpen(false);
                    onOpenLanguageModal();
                  }}
                >
                  <Globe size={18} color="#2563eb" />
                  <div style={{ textAlign: 'left', flex: 1 }}>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>Meaning Language:</div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>
                      {selectedLanguage.name} ({selectedLanguage.nativeName})
                    </div>
                  </div>
                  <span style={{ fontSize: '12px', color: '#2563eb', fontWeight: 700 }}>Change</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar (Home, Daily 20, Stories, Quiz, Wishlist) */}
      <nav className="mobile-bottom-nav" aria-label="Mobile Bottom Navigation">
        <div className="mobile-bottom-grid">
          <button
            className={`mobile-tab-btn ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => handleNavClick('home')}
            aria-label="Home"
          >
            <BookOpen size={18} />
            <span>Home</span>
          </button>

          <button
            className={`mobile-tab-btn ${activeTab === 'learn' ? 'active' : ''}`}
            onClick={() => handleNavClick('learn')}
            aria-label="Daily 20"
          >
            <Sparkles size={18} />
            <span>Daily 20</span>
          </button>

          <button
            className={`mobile-tab-btn ${activeTab === 'stories' ? 'active' : ''}`}
            onClick={() => handleNavClick('stories')}
            aria-label="Stories"
          >
            <Library size={18} />
            <span>Stories</span>
          </button>

          <button
            className={`mobile-tab-btn ${activeTab === 'quiz' ? 'active' : ''}`}
            onClick={() => handleNavClick('quiz')}
            aria-label="Quiz"
          >
            <CheckCircle2 size={18} />
            <span>Quiz</span>
          </button>

          <button
            className={`mobile-tab-btn ${activeTab === 'wishlist' ? 'active' : ''}`}
            onClick={() => handleNavClick('wishlist')}
            aria-label="Wishlist"
          >
            <Heart
              size={18}
              fill={activeTab === 'wishlist' ? '#e11d48' : 'none'}
              color={activeTab === 'wishlist' ? '#e11d48' : 'currentColor'}
            />
            <span>Wishlist</span>
            {wishlistCount > 0 && (
              <span className="mobile-wishlist-count" title={`${wishlistCount} saved in wishlist`}>
                {wishlistCount}
              </span>
            )}
          </button>
        </div>
      </nav>
    </>
  );
};
