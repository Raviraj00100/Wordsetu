import React, { useState, useEffect, useMemo } from 'react';
import {
  Search, Filter, BookOpen, Clock, Globe, Sparkles,
  ArrowRight, BookMarked, Layers, PenTool, RefreshCw,
  Heart, CheckCircle2, BookmarkCheck, Compass, Flame, History
} from 'lucide-react';
import { Story, StoryLanguage, StoryDifficulty, LanguageStoryStats } from '../../types/story';
import { STORY_CATEGORIES, StoryCategory } from '../../data/storyCategories';
import { kathaSetuDb } from '../../services/db';
import { KathaSetuEngine } from '../../services/kathaSetuEngine';

interface KathaSetuViewProps {
  onReadStory: (story: Story) => void;
  onCreateStory: () => void;
  onOpenWishlist?: () => void;
  initialCategory?: string;
}

const STORIES_PER_PAGE = 24;

export const KathaSetuView: React.FC<KathaSetuViewProps> = ({
  onReadStory,
  onCreateStory,
  onOpenWishlist,
  initialCategory = 'all'
}) => {
  const [stories, setAllStories] = useState<Story[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<StoryLanguage>('en');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedLength, setSelectedLength] = useState<string>('all');
  const [quickFilter, setQuickFilter] = useState<'all' | 'famous' | 'real_life' | 'popular' | 'recent'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<LanguageStoryStats | null>(null);

  // Wishlist state tracking
  const [wishlistSet, setWishlistSet] = useState<Set<string>>(() => kathaSetuDb.getLocalWishlistSet());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    await KathaSetuEngine.initializeLibrary();
    const all = await kathaSetuDb.getAllStories();
    setAllStories(all);
    const s = await KathaSetuEngine.getLibraryStats();
    setStats(s);
    setWishlistSet(kathaSetuDb.getLocalWishlistSet());
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();

    const handleWishlistUpdated = () => {
      setWishlistSet(kathaSetuDb.getLocalWishlistSet());
    };

    const handleLibraryUpdated = () => {
      loadData();
    };

    window.addEventListener('wordsetu_wishlist_updated', handleWishlistUpdated);
    window.addEventListener('story_library_updated', handleLibraryUpdated);

    return () => {
      window.removeEventListener('wordsetu_wishlist_updated', handleWishlistUpdated);
      window.removeEventListener('story_library_updated', handleLibraryUpdated);
    };
  }, []);

  useEffect(() => {
    if (initialCategory && initialCategory !== 'all') {
      setSelectedCategory(initialCategory);
      setCurrentPage(1);
    }
  }, [initialCategory]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleWishlist = async (e: React.MouseEvent, story: Story) => {
    e.stopPropagation();
    try {
      const added = await kathaSetuDb.toggleWishlist(story.id);
      setWishlistSet(kathaSetuDb.getLocalWishlistSet());
      showToast(added ? `Added "${story.title}" to your Wishlist!` : `Removed "${story.title}" from Wishlist`);
    } catch (err) {
      console.error(err);
    }
  };

  // Filtered stories
  const filteredStories = useMemo(() => {
    return stories.filter(story => {
      if (story.status !== 'published') return false;
      if (story.language !== selectedLanguage) return false;

      // Quick Filters
      if (quickFilter === 'famous') {
        const famousCats = ['panchatantra', 'akbar-birbal', 'tenali-raman', 'vikram-betal', 'jataka-tales'];
        if (!famousCats.includes(story.category)) return false;
      } else if (quickFilter === 'real_life') {
        if (story.category !== 'real-life' && (!story.contentType || story.contentType === 'traditional_folklore')) {
          return false;
        }
      }

      if (selectedCategory !== 'all' && story.category !== selectedCategory) return false;
      if (selectedDifficulty !== 'all' && story.difficulty !== selectedDifficulty) return false;

      if (selectedLength !== 'all') {
        if (selectedLength === 'short' && story.readingTimeMinutes > 3) return false;
        if (selectedLength === 'medium' && (story.readingTimeMinutes < 4 || story.readingTimeMinutes > 6)) return false;
        if (selectedLength === 'long' && story.readingTimeMinutes < 7) return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = story.title.toLowerCase().includes(q);
        const matchesDesc = story.shortDescription.toLowerCase().includes(q);
        const matchesAuthor = story.author?.toLowerCase().includes(q);
        const matchesRegion = story.region?.toLowerCase().includes(q);
        const matchesMoral = story.moral?.toLowerCase().includes(q);
        const matchesChar = story.characters?.some(c => c.toLowerCase().includes(q));
        if (!matchesTitle && !matchesDesc && !matchesAuthor && !matchesRegion && !matchesMoral && !matchesChar) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (quickFilter === 'popular') {
        return (b.viewsCount || 0) - (a.viewsCount || 0);
      }
      if (quickFilter === 'recent') {
        return b.createdAt - a.createdAt;
      }
      return 0;
    });
  }, [stories, selectedLanguage, selectedCategory, selectedDifficulty, selectedLength, quickFilter, searchQuery]);

  // Paginated stories
  const totalPages = Math.ceil(filteredStories.length / STORIES_PER_PAGE);
  const paginatedStories = useMemo(() => {
    const start = (currentPage - 1) * STORIES_PER_PAGE;
    return filteredStories.slice(start, start + STORIES_PER_PAGE);
  }, [filteredStories, currentPage]);

  const handleLanguageChange = (lang: StoryLanguage) => {
    setSelectedLanguage(lang);
    setCurrentPage(1);
  };

  const currentLangCount = stats ? stats[selectedLanguage] : 0;

  return (
    <div className="container" style={{ maxWidth: '1160px', margin: '20px auto 60px' }}>
      {/* Toast Feedback */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: '#0f172a',
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: '12px',
          fontSize: '14px',
          fontWeight: 600,
          boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <CheckCircle2 size={18} color="#10b981" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hero KathaSetu Discovery Banner */}
      <section
        className="katha-discovery-banner"
        style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #4338ca 100%)',
          borderRadius: '24px',
          color: '#ffffff',
          boxShadow: '0 12px 36px rgba(29, 78, 216, 0.25)',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: '28px'
        }}
      >
        <div style={{ maxWidth: '780px', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
            <span style={{
              fontSize: '11px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '4px 12px',
              borderRadius: '9999px',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}>
              WordSetu Stories Library
            </span>

            {onOpenWishlist && (
              <button
                onClick={onOpenWishlist}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(244, 63, 94, 0.25)',
                  border: '1px solid rgba(244, 63, 94, 0.5)',
                  color: '#ffffff',
                  padding: '4px 12px',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <Heart size={13} fill="#ffffff" />
                <span>My Wishlist ({wishlistSet.size})</span>
              </button>
            )}
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '34px',
            fontWeight: 800,
            lineHeight: 1.2,
            marginBottom: '10px'
          }}>
            Discover Amazing Indian Stories
          </h1>

          <p style={{ fontSize: '15px', opacity: 0.9, lineHeight: 1.5, marginBottom: '20px' }}>
            Explore folk tales, adventures, mysteries, and inspiring real-life stories in English, Hindi, Tamil, and Malayalam.
          </p>

          {/* Published Counts per Language Counter Pill */}
          {stats && (
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              alignItems: 'center',
              background: 'rgba(15, 23, 42, 0.45)',
              backdropFilter: 'blur(8px)',
              padding: '10px 18px',
              borderRadius: '14px',
              fontSize: '13px',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <span style={{ fontWeight: 700, color: '#93c5fd' }}>Published Library:</span>
              <span>English: <strong>{stats.en}</strong></span>
              <span>•</span>
              <span>हिंदी: <strong>{stats.hi}</strong></span>
              <span>•</span>
              <span>தமிழ்: <strong>{stats.ta}</strong></span>
              <span>•</span>
              <span>മലയാളം: <strong>{stats.ml}</strong></span>
              <span style={{ color: '#86efac' }}>• Total: <strong>{stats.totalPublished}</strong> Stories</span>
            </div>
          )}
        </div>
      </section>

      {/* Language Switcher Tabs */}
      <div
        className="katha-lang-tabs-wrapper"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '20px'
        }}
      >
        <div className="katha-lang-tabs-row" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { code: 'en', label: 'English', native: 'English', count: stats?.en || 0 },
            { code: 'hi', label: 'Hindi', native: 'हिंदी', count: stats?.hi || 0 },
            { code: 'ta', label: 'Tamil', native: 'தமிழ்', count: stats?.ta || 0 },
            { code: 'ml', label: 'Malayalam', native: 'മലയാളം', count: stats?.ml || 0 }
          ].map(lang => {
            const isSelected = selectedLanguage === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code as StoryLanguage)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  borderRadius: '12px',
                  border: isSelected ? '2px solid #2563eb' : '1px solid #cbd5e1',
                  background: isSelected ? '#eff6ff' : '#ffffff',
                  color: isSelected ? '#1d4ed8' : '#334155',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>{lang.label}</span>
                <span style={{
                  fontSize: '12px',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  background: isSelected ? '#dbeafe' : '#f1f5f9',
                  color: isSelected ? '#1e40af' : '#64748b',
                  fontWeight: 800
                }}>
                  {lang.count}
                </span>
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {onOpenWishlist && (
            <button
              onClick={onOpenWishlist}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 16px',
                borderRadius: '12px',
                background: '#fff1f2',
                color: '#e11d48',
                border: '1px solid #fecdd3',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <Heart size={16} fill="#e11d48" />
              <span>Wishlist ({wishlistSet.size})</span>
            </button>
          )}

          <button
            onClick={onCreateStory}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 18px',
              borderRadius: '12px',
              background: '#7c3aed',
              color: '#ffffff',
              border: 'none',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(124, 58, 237, 0.25)'
            }}
          >
            <PenTool size={16} />
            <span>Create Story</span>
          </button>
        </div>
      </div>

      {/* Quick Curated Discovery Chips */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        overflowX: 'auto',
        paddingBottom: '8px',
        marginBottom: '20px'
      }}>
        {[
          { id: 'all', label: 'All Stories', icon: Layers },
          { id: 'famous', label: 'Famous Indian Stories', icon: Sparkles },
          { id: 'real_life', label: 'Real-Life Stories & Biographies', icon: Compass },
          { id: 'popular', label: 'Most Popular', icon: Flame },
          { id: 'recent', label: 'Recently Added', icon: History }
        ].map(chip => {
          const isSelected = quickFilter === chip.id;
          const Icon = chip.icon;
          return (
            <button
              key={chip.id}
              onClick={() => {
                setQuickFilter(chip.id as any);
                setCurrentPage(1);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '9999px',
                border: isSelected ? '1px solid #2563eb' : '1px solid #e2e8f0',
                background: isSelected ? '#2563eb' : '#ffffff',
                color: isSelected ? '#ffffff' : '#475569',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              <Icon size={14} />
              <span>{chip.label}</span>
            </button>
          );
        })}
      </div>

      {/* "Search Any Story" Search Bar & Advanced Filters */}
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        padding: '20px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        marginBottom: '24px'
      }}>
        {/* Search Input */}
        <div style={{ position: 'relative', marginBottom: '16px' }}>
          <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            className="search-input"
            placeholder={`Search Any Story in ${selectedLanguage.toUpperCase()} (by title, moral, author, region, or character)...`}
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            style={{
              paddingLeft: '44px',
              height: '46px',
              fontSize: '14.5px',
              width: '100%',
              borderRadius: '10px'
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: '#64748b',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 700
              }}
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Dropdowns Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px'
        }}>
          {/* Category Filter */}
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#64748b', marginBottom: '4px' }}>
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={e => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                fontSize: '13px',
                color: '#334155',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="all">All Categories</option>
              {STORY_CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#64748b', marginBottom: '4px' }}>
              Difficulty
            </label>
            <select
              value={selectedDifficulty}
              onChange={e => {
                setSelectedDifficulty(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                fontSize: '13px',
                color: '#334155',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="all">All Difficulties</option>
              <option value="beginner">Beginner (Easy vocabulary)</option>
              <option value="intermediate">Intermediate (Standard)</option>
              <option value="advanced">Advanced (Rich vocabulary)</option>
            </select>
          </div>

          {/* Length Filter */}
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#64748b', marginBottom: '4px' }}>
              Story Length
            </label>
            <select
              value={selectedLength}
              onChange={e => {
                setSelectedLength(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                fontSize: '13px',
                color: '#334155',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="all">Any Length</option>
              <option value="short">Short (1-3 min)</option>
              <option value="medium">Medium (4-6 min)</option>
              <option value="long">Long (7+ min)</option>
            </select>
          </div>

          {/* Reset Action */}
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedDifficulty('all');
                setSelectedLength('all');
                setQuickFilter('all');
                setSearchQuery('');
                setCurrentPage(1);
              }}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: '#f8fafc',
                color: '#475569',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Story Results Counter */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <span style={{ fontSize: '14px', color: '#64748b' }}>
          Showing <strong>{filteredStories.length}</strong> published stories in <strong>{selectedLanguage.toUpperCase()}</strong>
        </span>
        {totalPages > 1 && (
          <span style={{ fontSize: '13px', color: '#64748b' }}>
            Page {currentPage} of {totalPages}
          </span>
        )}
      </div>

      {/* Story Grid */}
      {paginatedStories.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
          gap: '16px',
          marginBottom: '32px'
        }}>
          {paginatedStories.map(story => {
            const isWishlisted = wishlistSet.has(story.id);
            const categoryObj = STORY_CATEGORIES.find(c => c.id === story.category);

            return (
              <div
                key={story.id}
                className="katha-story-card"
                onClick={() => onReadStory(story)}
                style={{
                  background: '#ffffff',
                  borderRadius: '18px',
                  border: '1px solid #e2e8f0',
                  padding: '22px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Card Color Top Accent */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: story.coverColor || '#2563eb'
                }} />

                <div>
                  {/* Meta Badges and Wishlist Button Header */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        letterSpacing: '0.6px',
                        padding: '3px 9px',
                        borderRadius: '9999px',
                        background: categoryObj?.badgeBg || '#eff6ff',
                        color: categoryObj?.color || '#2563eb'
                      }}>
                        {categoryObj?.name || story.category}
                      </span>
                    </div>

                    {/* Interactive Wishlist Heart Button */}
                    <button
                      type="button"
                      onClick={(e) => handleToggleWishlist(e, story)}
                      title={isWishlisted ? 'Saved in Wishlist' : 'Add to Wishlist'}
                      style={{
                        border: 'none',
                        background: isWishlisted ? '#ffe4e6' : '#f8fafc',
                        color: isWishlisted ? '#e11d48' : '#64748b',
                        padding: '5px 10px',
                        borderRadius: '9999px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '11.5px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      <Heart size={14} fill={isWishlisted ? '#e11d48' : 'none'} color={isWishlisted ? '#e11d48' : 'currentColor'} />
                      <span>{isWishlisted ? 'Wishlisted' : 'Wishlist'}</span>
                    </button>
                  </div>

                  {/* Content Type tag if Real-Life / Biography */}
                  {story.contentType && story.contentType !== 'traditional_folklore' && (
                    <div style={{ marginBottom: '8px' }}>
                      <span style={{
                        fontSize: '10.5px',
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
                         story.contentType === 'historical_account' ? 'Historical Account' : 'Real-Life Inspired'}
                      </span>
                    </div>
                  )}

                  <h3 style={{
                    fontSize: '17px',
                    fontWeight: 800,
                    color: '#0f172a',
                    lineHeight: 1.35,
                    marginBottom: '8px'
                  }}>
                    {story.title}
                  </h3>

                  <p style={{
                    fontSize: '13px',
                    color: '#475569',
                    lineHeight: 1.5,
                    marginBottom: '16px',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {story.shortDescription}
                  </p>
                </div>

                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderTop: '1px solid #f1f5f9',
                    paddingTop: '12px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#64748b' }}>
                      <Clock size={13} />
                      <span>{story.readingTimeMinutes} min read</span>
                    </div>

                    <span style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '13px',
                      fontWeight: 700,
                      color: '#2563eb'
                    }}>
                      <span>Read Story</span>
                      <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty Search / Filter State with Offer to Create Story */
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          background: '#ffffff',
          borderRadius: '20px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
          marginBottom: '32px'
        }}>
          <BookOpen size={44} color="#94a3b8" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
            No stories matched your search
          </h3>
          <p style={{ fontSize: '14px', color: '#64748b', maxWidth: '480px', margin: '0 auto 20px' }}>
            {searchQuery
              ? `We couldn't find an existing story matching "${searchQuery}" in ${selectedLanguage.toUpperCase()}. Would you like to create an original story on this topic?`
              : 'Try clearing your filters or changing the language selection.'}
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            {searchQuery && (
              <button
                className="btn-primary"
                onClick={onCreateStory}
                style={{ background: '#7c3aed', borderColor: '#6d28d9' }}
              >
                Write This Story
              </button>
            )}
            <button
              style={{
                padding: '10px 20px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                fontWeight: 600,
                cursor: 'pointer'
              }}
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedDifficulty('all');
                setSelectedLength('all');
                setQuickFilter('all');
              }}
            >
              Clear All Filters
            </button>
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8px',
          marginTop: '20px'
        }}>
          <button
            onClick={() => {
              setCurrentPage(p => Math.max(1, p - 1));
              window.scrollTo({ top: 350, behavior: 'smooth' });
            }}
            disabled={currentPage === 1}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: currentPage === 1 ? '#f8fafc' : '#ffffff',
              color: currentPage === 1 ? '#94a3b8' : '#334155',
              fontWeight: 600,
              fontSize: '13px',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
            }}
          >
            Previous
          </button>

          <div style={{ display: 'flex', gap: '4px' }}>
            {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 7) {
                pageNum = i + 1;
              } else if (currentPage <= 4) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 3) {
                pageNum = totalPages - 6 + i;
              } else {
                pageNum = currentPage - 3 + i;
              }

              const isCurrent = pageNum === currentPage;
              return (
                <button
                  key={pageNum}
                  onClick={() => {
                    setCurrentPage(pageNum);
                    window.scrollTo({ top: 350, behavior: 'smooth' });
                  }}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    border: isCurrent ? '2px solid #2563eb' : '1px solid #cbd5e1',
                    background: isCurrent ? '#eff6ff' : '#ffffff',
                    color: isCurrent ? '#1d4ed8' : '#334155',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => {
              setCurrentPage(p => Math.min(totalPages, p + 1));
              window.scrollTo({ top: 350, behavior: 'smooth' });
            }}
            disabled={currentPage === totalPages}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: currentPage === totalPages ? '#f8fafc' : '#ffffff',
              color: currentPage === totalPages ? '#94a3b8' : '#334155',
              fontWeight: 600,
              fontSize: '13px',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
            }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};
