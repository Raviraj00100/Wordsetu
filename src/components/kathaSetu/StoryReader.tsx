import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft, Bookmark, Share2, Maximize2, Minimize2,
  Volume2, VolumeX, Play, Pause, RotateCcw,
  Type, Sun, Moon, Coffee, Award, Sparkles, Check, Heart, CheckCircle2
} from 'lucide-react';
import { Story, StoryLanguage } from '../../types/story';
import { kathaSetuDb } from '../../services/db';
import { WordInspectorModal } from './WordInspectorModal';
import { StoryQuizModal } from './StoryQuizModal';

interface StoryReaderProps {
  story: Story;
  onBack: () => void;
  onPrevStory?: () => void;
  onNextStory?: () => void;
}

type ReaderTheme = 'light' | 'dark' | 'sepia';
type FontSize = 'small' | 'medium' | 'large' | 'xlarge';
type LineHeight = 'compact' | 'normal' | 'relaxed';

export const StoryReader: React.FC<StoryReaderProps> = ({
  story,
  onBack,
  onPrevStory,
  onNextStory
}) => {
  // Appearance preferences
  const [theme, setTheme] = useState<ReaderTheme>(() => {
    try {
      return (localStorage.getItem('kathasetu_reader_theme') as ReaderTheme) || 'light';
    } catch {
      return 'light';
    }
  });

  const [fontSize, setFontSize] = useState<FontSize>(() => {
    try {
      return (localStorage.getItem('kathasetu_reader_fontsize') as FontSize) || 'medium';
    } catch {
      return 'medium';
    }
  });

  const [lineHeight, setLineHeight] = useState<LineHeight>('normal');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);

  // Audio Read Aloud state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isAudioPaused, setIsAudioPaused] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [activeParagraphIndex, setActiveParagraphIndex] = useState<number | null>(null);

  // Tap-to-Translate inspection modal state
  const [inspectedWord, setInspectedWord] = useState<string | null>(null);
  const [inspectedSentence, setInspectedSentence] = useState<string>('');

  // Story Quiz modal state
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);

  // Story Wishlist state & feedback
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Share tooltip feedback
  const [shareFeedback, setShareFeedback] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);
  const paragraphs = story.content.split('\n\n').filter(p => p.trim().length > 0);

  // Load bookmark & restore reading position
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });

    kathaSetuDb.isBookmarked(story.id).then(setIsBookmarked);
    kathaSetuDb.isWishlisted(story.id).then(setIsWishlisted);

    kathaSetuDb.getReadingProgress(story.id).then(prog => {
      if (prog && prog.scrollPercentage > 5 && contentRef.current) {
        setReadingProgress(prog.scrollPercentage);
      }
    });

    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const pct = Math.min(100, Math.round((window.scrollY / totalHeight) * 100));
        setReadingProgress(pct);

        // Auto-save progress
        kathaSetuDb.saveReadingProgress({
          storyId: story.id,
          scrollPercentage: pct,
          completed: pct >= 90,
          lastReadAt: Date.now(),
          timeSpentSeconds: 60
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      stopAudio();
    };
  }, [story.id]);

  const handleToggleWishlist = async () => {
    const next = await kathaSetuDb.toggleWishlist(story.id);
    setIsWishlisted(next);
    setToastMsg(next ? 'Added to your Story Wishlist!' : 'Removed from your Story Wishlist');
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleToggleBookmark = async () => {
    const updated = await kathaSetuDb.toggleBookmark(story.id);
    setIsBookmarked(updated);
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const handleShareStory = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${story.title} — KathaSetu`,
          text: `${story.title}: ${story.shortDescription}`,
          url: window.location.href
        });
      } catch {
        // User cancelled share
      }
    } else {
      // Clipboard fallback
      navigator.clipboard.writeText(`${story.title} — Read on WordSetu KathaSetu: ${window.location.href}`);
      setShareFeedback(true);
      setTimeout(() => setShareFeedback(false), 2000);
    }
  };

  const handleChangeTheme = (newTheme: ReaderTheme) => {
    setTheme(newTheme);
    localStorage.setItem('kathasetu_reader_theme', newTheme);
  };

  const handleChangeFontSize = (newSize: FontSize) => {
    setFontSize(newSize);
    localStorage.setItem('kathasetu_reader_fontsize', newSize);
  };

  // --- Audio Read Aloud Implementation ---
  const stopAudio = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
    setIsAudioPaused(false);
    setActiveParagraphIndex(null);
  };

  const startReadAloud = (startIndex: number = 0) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported by your browser.');
      return;
    }

    window.speechSynthesis.cancel();

    if (startIndex >= paragraphs.length) {
      stopAudio();
      return;
    }

    setActiveParagraphIndex(startIndex);
    setIsPlayingAudio(true);
    setIsAudioPaused(false);

    const paraText = paragraphs[startIndex];
    const utterance = new SpeechSynthesisUtterance(paraText);

    // Voice selection based on story language
    const langCodeMap: Record<StoryLanguage, string> = {
      en: 'en-IN',
      hi: 'hi-IN',
      ta: 'ta-IN',
      ml: 'ml-IN'
    };
    utterance.lang = langCodeMap[story.language] || 'en-IN';
    utterance.rate = playbackSpeed;

    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find(v => v.lang.startsWith(utterance.lang.slice(0, 2)));
    if (matchingVoice) utterance.voice = matchingVoice;

    utterance.onend = () => {
      if (startIndex + 1 < paragraphs.length) {
        startReadAloud(startIndex + 1);
      } else {
        stopAudio();
      }
    };

    utterance.onerror = () => {
      stopAudio();
    };

    window.speechSynthesis.speak(utterance);
  };

  const togglePlayPauseAudio = () => {
    if (!isPlayingAudio) {
      startReadAloud(activeParagraphIndex || 0);
    } else if (isAudioPaused) {
      window.speechSynthesis.resume();
      setIsAudioPaused(false);
    } else {
      window.speechSynthesis.pause();
      setIsAudioPaused(true);
    }
  };

  // Tap-to-Translate Word Click Handler
  const handleWordClick = (word: string, sentence: string) => {
    const clean = word.trim().replace(/[.,!?;:"'()\[\]{}—]/g, '');
    if (!clean || clean.length < 2) return;
    setInspectedWord(clean);
    setInspectedSentence(sentence);
  };

  // Script Font Mapping
  const getScriptFont = () => {
    switch (story.language) {
      case 'hi':
        return "'Noto Sans Devanagari', var(--font-sans)";
      case 'ta':
        return "'Noto Sans Tamil', var(--font-sans)";
      case 'ml':
        return "'Noto Sans Malayalam', var(--font-sans)";
      default:
        return "var(--font-sans)";
    }
  };

  // Font size style value
  const getFontSizePx = () => {
    switch (fontSize) {
      case 'small': return '16px';
      case 'medium': return '19px';
      case 'large': return '22px';
      case 'xlarge': return '26px';
    }
  };

  const getLineHeightVal = () => {
    switch (lineHeight) {
      case 'compact': return 1.5;
      case 'normal': return 1.8;
      case 'relaxed': return 2.1;
    }
  };

  // Theme Colors
  const themeStyles = {
    light: {
      bg: '#ffffff',
      text: '#1e293b',
      navBg: 'rgba(255, 255, 255, 0.95)',
      border: '#e2e8f0',
      paragraphBg: 'transparent',
      activeHighlight: '#eff6ff'
    },
    sepia: {
      bg: '#fbf0d9',
      text: '#3b2f1e',
      navBg: 'rgba(251, 240, 217, 0.95)',
      border: '#e5d3b3',
      paragraphBg: 'transparent',
      activeHighlight: '#fae3b8'
    },
    dark: {
      bg: '#0f172a',
      text: '#e2e8f0',
      navBg: 'rgba(15, 23, 42, 0.95)',
      border: '#1e293b',
      paragraphBg: 'transparent',
      activeHighlight: '#1e3a8a'
    }
  }[theme];

  return (
    <div
      className="katha-reader-page"
      style={{
        background: themeStyles.bg,
        color: themeStyles.text,
        minHeight: '100vh',
        transition: 'background 0.25s, color 0.25s'
      }}
    >
      {/* Sticky Reading Progress Top Bar */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: 'rgba(0,0,0,0.06)',
        zIndex: 100
      }}>
        <div style={{
          width: `${readingProgress}%`,
          height: '100%',
          background: '#2563eb',
          transition: 'width 0.15s ease-out'
        }} />
      </div>

      {/* Reader Sticky Header */}
      <header
        className="story-reader-header"
        style={{
          position: 'sticky',
          top: 0,
          background: themeStyles.navBg,
          backdropFilter: 'blur(10px)',
          borderBottom: `1px solid ${themeStyles.border}`,
          zIndex: 90,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={onBack}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '8px',
              border: `1px solid ${themeStyles.border}`,
              background: 'transparent',
              color: themeStyles.text,
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <ArrowLeft size={16} />
            <span className="hide-on-mobile">Back to Stories</span>
          </button>

          <span style={{
            fontSize: '11px',
            fontWeight: 800,
            textTransform: 'uppercase',
            padding: '3px 8px',
            borderRadius: '9999px',
            background: story.coverColor || '#2563eb',
            color: '#ffffff'
          }}>
            {story.language.toUpperCase()}
          </span>
        </div>

        {/* Reader Controls Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Read Aloud Audio Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: isPlayingAudio ? '#2563eb' : 'transparent',
            color: isPlayingAudio ? '#ffffff' : themeStyles.text,
            padding: '4px 10px',
            borderRadius: '9999px',
            border: `1px solid ${isPlayingAudio ? '#2563eb' : themeStyles.border}`
          }}>
            <button
              onClick={togglePlayPauseAudio}
              style={{
                background: 'none',
                border: 'none',
                color: 'inherit',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '12px',
                fontWeight: 600
              }}
              title={isPlayingAudio ? (isAudioPaused ? 'Resume Audio' : 'Pause Audio') : 'Read Aloud'}
            >
              {isPlayingAudio ? (
                isAudioPaused ? <Play size={15} /> : <Pause size={15} />
              ) : (
                <Volume2 size={15} />
              )}
              <span className="hide-on-mobile">
                {isPlayingAudio ? (isAudioPaused ? 'Paused' : 'Playing') : 'Listen'}
              </span>
            </button>

            {isPlayingAudio && (
              <button
                onClick={stopAudio}
                style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: '0 2px' }}
                title="Stop Audio"
              >
                <VolumeX size={15} />
              </button>
            )}
          </div>

          {/* Theme Selector */}
          <div style={{ display: 'flex', alignItems: 'center', borderRadius: '8px', border: `1px solid ${themeStyles.border}`, overflow: 'hidden' }}>
            <button
              onClick={() => handleChangeTheme('light')}
              style={{
                background: theme === 'light' ? '#e2e8f0' : 'transparent',
                border: 'none',
                padding: '6px 8px',
                color: themeStyles.text,
                cursor: 'pointer'
              }}
              title="Light Theme"
            >
              <Sun size={15} />
            </button>
            <button
              onClick={() => handleChangeTheme('sepia')}
              style={{
                background: theme === 'sepia' ? '#fae3b8' : 'transparent',
                border: 'none',
                padding: '6px 8px',
                color: '#3b2f1e',
                cursor: 'pointer'
              }}
              title="Sepia Theme"
            >
              <Coffee size={15} />
            </button>
            <button
              onClick={() => handleChangeTheme('dark')}
              style={{
                background: theme === 'dark' ? '#334155' : 'transparent',
                border: 'none',
                padding: '6px 8px',
                color: '#ffffff',
                cursor: 'pointer'
              }}
              title="Dark Theme"
            >
              <Moon size={15} />
            </button>
          </div>

          {/* Font Size Adjuster */}
          <button
            onClick={() => {
              const sizes: FontSize[] = ['small', 'medium', 'large', 'xlarge'];
              const next = sizes[(sizes.indexOf(fontSize) + 1) % sizes.length];
              handleChangeFontSize(next);
            }}
            style={{
              padding: '6px 10px',
              borderRadius: '8px',
              border: `1px solid ${themeStyles.border}`,
              background: 'transparent',
              color: themeStyles.text,
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
            title="Adjust Font Size"
          >
            A {fontSize === 'xlarge' ? '++' : fontSize === 'large' ? '+' : ''}
          </button>

          {/* Wishlist Heart Button */}
          <button
            onClick={handleToggleWishlist}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 10px',
              borderRadius: '8px',
              border: `1px solid ${isWishlisted ? '#f43f5e' : themeStyles.border}`,
              background: isWishlisted ? '#fff1f2' : 'transparent',
              color: isWishlisted ? '#e11d48' : themeStyles.text,
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 700,
              transition: 'all 0.15s ease'
            }}
            title={isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}
          >
            <Heart size={15} fill={isWishlisted ? '#e11d48' : 'none'} color={isWishlisted ? '#e11d48' : 'currentColor'} />
            <span className="hide-on-mobile">{isWishlisted ? 'In Wishlist' : 'Wishlist'}</span>
          </button>

          {/* Bookmark Button */}
          <button
            onClick={handleToggleBookmark}
            style={{
              padding: '6px',
              borderRadius: '8px',
              border: `1px solid ${themeStyles.border}`,
              background: isBookmarked ? '#fef3c7' : 'transparent',
              color: isBookmarked ? '#d97706' : themeStyles.text,
              cursor: 'pointer'
            }}
            title={isBookmarked ? 'Bookmarked' : 'Add Bookmark'}
          >
            <Bookmark size={16} fill={isBookmarked ? '#d97706' : 'none'} />
          </button>

          {/* Share Button */}
          <button
            onClick={handleShareStory}
            style={{
              padding: '6px',
              borderRadius: '8px',
              border: `1px solid ${themeStyles.border}`,
              background: 'transparent',
              color: shareFeedback ? '#10b981' : themeStyles.text,
              cursor: 'pointer',
              position: 'relative'
            }}
            title="Share Story"
          >
            {shareFeedback ? <Check size={16} /> : <Share2 size={16} />}
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={handleToggleFullscreen}
            style={{
              padding: '6px',
              borderRadius: '8px',
              border: `1px solid ${themeStyles.border}`,
              background: 'transparent',
              color: themeStyles.text,
              cursor: 'pointer'
            }}
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </header>

      {/* Toast Feedback */}
      {toastMsg && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: '#0f172a',
          color: '#ffffff',
          padding: '12px 18px',
          borderRadius: '10px',
          fontSize: '13.5px',
          fontWeight: 600,
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <CheckCircle2 size={16} color="#10b981" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Main Reading Container */}
      <main
        ref={contentRef}
        className="story-reader-main"
        style={{
          maxWidth: '720px',
          margin: '0 auto'
        }}
      >
        {/* Story Metadata Header */}
        <div style={{ marginBottom: '32px', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
            <span style={{
              fontSize: '12px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.6px',
              color: '#2563eb'
            }}>
              {story.category.replace('-', ' ')}
            </span>
            <span>•</span>
            <span style={{ fontSize: '13px', opacity: 0.75 }}>
              {story.readingTimeMinutes} min read
            </span>
            <span>•</span>
            <span style={{ fontSize: '13px', opacity: 0.75 }}>
              {story.difficulty.toUpperCase()}
            </span>
            {story.contentType && story.contentType !== 'traditional_folklore' && (
              <>
                <span>•</span>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  background: story.contentType === 'verified_true' ? '#dcfce7' : story.contentType === 'biography' ? '#e0f2fe' : '#fef3c7',
                  color: story.contentType === 'verified_true' ? '#166534' : story.contentType === 'biography' ? '#0369a1' : '#92400e'
                }}>
                  {story.contentType === 'verified_true' ? 'Verified True' :
                   story.contentType === 'biography' ? 'Biography' :
                   story.contentType === 'historical_account' ? 'Historical Account' : 'Inspired by Real Life'}
                </span>
              </>
            )}
          </div>

          <h1 style={{
            fontFamily: getScriptFont(),
            fontSize: '32px',
            fontWeight: 800,
            lineHeight: 1.25,
            marginBottom: '14px'
          }}>
            {story.title}
          </h1>

          {/* Prominent Wishlist Action Button */}
          <div style={{ marginBottom: '14px' }}>
            <button
              onClick={handleToggleWishlist}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 16px',
                borderRadius: '9999px',
                border: `1px solid ${isWishlisted ? '#f43f5e' : '#cbd5e1'}`,
                background: isWishlisted ? '#ffe4e6' : 'transparent',
                color: isWishlisted ? '#e11d48' : themeStyles.text,
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Heart size={16} fill={isWishlisted ? '#e11d48' : 'none'} color={isWishlisted ? '#e11d48' : 'currentColor'} />
              <span>{isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}</span>
            </button>
          </div>

          <div style={{ fontSize: '14px', opacity: 0.8, fontStyle: 'italic', marginBottom: '6px' }}>
            Author / Attribution: {story.author}
          </div>
          {story.region && (
            <div style={{ fontSize: '13px', opacity: 0.65, marginBottom: '6px' }}>
              Region: {story.region} | Source: {story.source}
            </div>
          )}
          {story.verifiedSource && (
            <div style={{
              fontSize: '12px',
              color: '#059669',
              background: '#ecfdf5',
              padding: '3px 10px',
              borderRadius: '6px',
              display: 'inline-block',
              fontWeight: 600
            }}>
              Verified Citation: {story.verifiedSource}
            </div>
          )}
        </div>

        {/* Tip for Interactive Tap-to-Translate */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 14px',
          borderRadius: '10px',
          background: theme === 'dark' ? '#1e293b' : '#eff6ff',
          color: theme === 'dark' ? '#93c5fd' : '#1d4ed8',
          fontSize: '12px',
          marginBottom: '28px'
        }}>
          <Sparkles size={16} />
          <span>
            <strong>Tap-to-Translate:</strong> Tap or click any word in the text below to view meanings, audio pronunciation, and save it to your vocabulary!
          </span>
        </div>

        {/* Story Paragraphs with Interactive Word Tokens */}
        <article style={{
          fontFamily: getScriptFont(),
          fontSize: getFontSizePx(),
          lineHeight: getLineHeightVal(),
          letterSpacing: '0.1px'
        }}>
          {paragraphs.map((para, pIdx) => {
            const isActive = activeParagraphIndex === pIdx;
            const words = para.split(/\s+/);

            return (
              <p
                key={pIdx}
                style={{
                  marginBottom: '1.6em',
                  padding: '6px 12px',
                  borderRadius: '10px',
                  background: isActive ? themeStyles.activeHighlight : themeStyles.paragraphBg,
                  transition: 'background 0.2s ease',
                  borderLeft: isActive ? '3px solid #2563eb' : '3px solid transparent'
                }}
              >
                {words.map((w, wIdx) => (
                  <span
                    key={wIdx}
                    onClick={() => handleWordClick(w, para)}
                    style={{
                      cursor: 'pointer',
                      borderRadius: '3px',
                      padding: '1px 2px',
                      transition: 'background 0.1s'
                    }}
                    className="tap-word-token"
                  >
                    {w}{' '}
                  </span>
                ))}
              </p>
            );
          })}
        </article>

        {/* Moral of the Story Card */}
        {story.moral && (
          <div style={{
            margin: '40px 0 32px',
            padding: '20px',
            borderRadius: '16px',
            background: theme === 'dark' ? '#1e293b' : '#fef9c3',
            border: `1px solid ${theme === 'dark' ? '#334155' : '#fde047'}`,
            color: theme === 'dark' ? '#fde047' : '#713f12'
          }}>
            <div style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '4px' }}>
              Moral of the Story
            </div>
            <div style={{ fontSize: '16px', fontWeight: 600, fontStyle: 'italic', fontFamily: getScriptFont() }}>
              "{story.moral}"
            </div>
          </div>
        )}

        {/* Comprehension Quiz Action Card */}
        <div style={{
          margin: '32px 0',
          padding: '24px',
          borderRadius: '18px',
          background: 'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)',
          color: '#ffffff',
          textAlign: 'center',
          boxShadow: '0 10px 25px rgba(37, 99, 235, 0.25)'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px'
          }}>
            <Award size={26} />
          </div>
          <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '6px' }}>
            Test Your Comprehension
          </h3>
          <p style={{ fontSize: '14px', opacity: 0.9, maxWidth: '440px', margin: '0 auto 16px' }}>
            Reinforce your understanding with 5 questions based directly on this story and earn comprehension points.
          </p>
          <button
            onClick={() => setIsQuizModalOpen(true)}
            style={{
              padding: '10px 24px',
              borderRadius: '9999px',
              background: '#ffffff',
              color: '#1d4ed8',
              fontWeight: 700,
              fontSize: '14px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
          >
            Start Story Quiz
          </button>
        </div>

        {/* Prev / Next Story Navigation */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '40px',
          paddingTop: '24px',
          borderTop: `1px solid ${themeStyles.border}`
        }}>
          {onPrevStory ? (
            <button
              onClick={onPrevStory}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                borderRadius: '10px',
                border: `1px solid ${themeStyles.border}`,
                background: 'transparent',
                color: themeStyles.text,
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              ← Previous Story
            </button>
          ) : <div />}

          {onNextStory ? (
            <button
              onClick={onNextStory}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '10px',
                background: '#2563eb',
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              Next Story →
            </button>
          ) : <div />}
        </div>
      </main>

      {/* Tap-to-Translate Meaning Modal */}
      {inspectedWord && (
        <WordInspectorModal
          word={inspectedWord}
          contextSentence={inspectedSentence}
          storyId={story.id}
          storyTitle={story.title}
          onClose={() => setInspectedWord(null)}
        />
      )}

      {/* Story Quiz Modal */}
      {isQuizModalOpen && (
        <StoryQuizModal
          story={story}
          onClose={() => setIsQuizModalOpen(false)}
        />
      )}
    </div>
  );
};
