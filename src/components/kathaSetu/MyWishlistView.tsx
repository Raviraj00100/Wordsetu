import React, { useState, useEffect } from 'react';
import {
  Heart,
  Search,
  BookOpen,
  Trash2,
  Sparkles,
  ArrowRight,
  Filter,
  CheckCircle2,
  Clock,
  ExternalLink
} from 'lucide-react';
import { Story, StoryLanguage } from '../../types/story';
import { kathaSetuDb } from '../../services/db';
import { STORY_CATEGORIES } from '../../data/storyCategories';

interface MyWishlistViewProps {
  onReadStory: (story: Story) => void;
  onBrowseStories: () => void;
}

export const MyWishlistView: React.FC<MyWishlistViewProps> = ({
  onReadStory,
  onBrowseStories
}) => {
  const [wishlistStories, setWishlistStories] = useState<Story[]>([]);
  const [readingProgressMap, setReadingProgressMap] = useState<Record<string, number>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recently_added' | 'title' | 'reading_time'>('recently_added');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadWishlist = async () => {
    setIsLoading(true);
    try {
      const stories = await kathaSetuDb.getUserWishlistStories();
      setWishlistStories(stories);

      const progressRecords = await kathaSetuDb.getAllReadingProgress();
      const pMap: Record<string, number> = {};
      progressRecords.forEach(r => {
        pMap[r.storyId] = r.scrollPercentage || 0;
      });
      setReadingProgressMap(pMap);
    } catch (e) {
      console.warn('Error loading wishlist:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist();

    const handleWishlistUpdated = () => {
      loadWishlist();
    };

    window.addEventListener('wordsetu_wishlist_updated', handleWishlistUpdated);
    return () => {
      window.removeEventListener('wordsetu_wishlist_updated', handleWishlistUpdated);
    };
  }, []);

  const handleRemoveFromWishlist = async (e: React.MouseEvent, story: Story) => {
    e.stopPropagation();
    try {
      await kathaSetuDb.removeFromWishlist(story.id);
      setWishlistStories(prev => prev.filter(s => s.id !== story.id));
      showToast(`Removed "${story.title}" from your Wishlist`);
    } catch (err) {
      console.error(err);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredStories = wishlistStories.filter(story => {
    if (selectedLanguage !== 'all' && story.language !== selectedLanguage) return false;
    if (selectedCategory !== 'all' && story.category !== selectedCategory) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = story.title.toLowerCase().includes(q);
      const matchDesc = story.shortDescription.toLowerCase().includes(q);
      const matchMoral = story.moral?.toLowerCase().includes(q);
      const matchRegion = story.region?.toLowerCase().includes(q);
      return matchTitle || matchDesc || matchMoral || matchRegion;
    }
    return true;
  });

  filteredStories.sort((a, b) => {
    if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    }
    if (sortBy === 'reading_time') {
      return a.readingTimeMinutes - b.readingTimeMinutes;
    }
    return b.createdAt - a.createdAt;
  });

  const getLanguageLabel = (code: string) => {
    switch (code) {
      case 'en': return 'English';
      case 'hi': return 'हिन्दी';
      case 'ta': return 'தமிழ்';
      case 'ml': return 'മലയാളം';
      default: return code;
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '16px 20px 80px' }}>
      {/* Toast Notification */}
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

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #fff1f2, #ffe4e6)',
        borderRadius: '20px',
        border: '1px solid #fecdd3',
        padding: '28px 32px',
        marginBottom: '28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: '#ffe4e6',
            color: '#e11d48',
            fontSize: '12px',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.6px',
            padding: '4px 12px',
            borderRadius: '9999px',
            marginBottom: '8px'
          }}>
            <Heart size={14} fill="#e11d48" />
            <span>Personal Collection</span>
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '28px',
            fontWeight: 800,
            color: '#881337',
            margin: '0 0 6px'
          }}>
            My Story Wishlist
          </h1>
          <p style={{ fontSize: '14px', color: '#9f1239', margin: 0 }}>
            {wishlistStories.length} {wishlistStories.length === 1 ? 'story' : 'stories'} saved for later reading across English, Hindi, Tamil, and Malayalam.
          </p>
        </div>

        <button
          onClick={onBrowseStories}
          className="btn-primary"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            background: '#e11d48',
            borderColor: '#be123c'
          }}
        >
          <BookOpen size={16} />
          <span>Browse Story Library</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        padding: '16px 20px',
        marginBottom: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
      }}>
        {/* Search input */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: '#f8fafc',
          border: '1px solid #cbd5e1',
          borderRadius: '10px',
          padding: '8px 14px'
        }}>
          <Search size={18} color="#64748b" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search wishlist by title, character, moral, or region..."
            style={{
              border: 'none',
              background: 'transparent',
              outline: 'none',
              width: '100%',
              fontSize: '14px',
              color: '#0f172a'
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                color: '#94a3b8',
                fontSize: '12px',
                fontWeight: 700
              }}
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter controls row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          {/* Language filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b' }}>Language:</span>
            {['all', 'en', 'hi', 'ta', 'ml'].map(code => (
              <button
                key={code}
                onClick={() => setSelectedLanguage(code)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  border: '1px solid',
                  borderColor: selectedLanguage === code ? '#e11d48' : '#e2e8f0',
                  background: selectedLanguage === code ? '#fff1f2' : '#ffffff',
                  color: selectedLanguage === code ? '#e11d48' : '#475569',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {code === 'all' ? 'All Languages' : getLanguageLabel(code)}
              </button>
            ))}
          </div>

          {/* Sort By selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b' }}>Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              style={{
                padding: '6px 10px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                fontSize: '12px',
                fontWeight: 600,
                color: '#334155',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="recently_added">Recently Added</option>
              <option value="title">Title (A-Z)</option>
              <option value="reading_time">Shortest Read First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Story Grid */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>❤️</div>
          <p style={{ fontSize: '15px' }}>Loading your Story Wishlist...</p>
        </div>
      ) : filteredStories.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '64px 20px',
          background: '#ffffff',
          borderRadius: '20px',
          border: '1px dashed #cbd5e1'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: '#ffe4e6',
            color: '#e11d48',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <Heart size={32} />
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
            {wishlistStories.length === 0 ? 'Your Wishlist is Empty' : 'No Stories Match Your Filters'}
          </h2>
          <p style={{ fontSize: '14px', color: '#64748b', maxWidth: '440px', margin: '0 auto 24px' }}>
            {wishlistStories.length === 0
              ? 'Tap the heart icon on any story card or while reading to save it here for later.'
              : 'Try clearing your search query or switching language filters.'}
          </p>
          <button
            onClick={onBrowseStories}
            className="btn-primary"
            style={{ background: '#e11d48', borderColor: '#be123c' }}
          >
            Explore Indian Stories
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
          gap: '16px'
        }}>
          {filteredStories.map(story => {
            const progress = readingProgressMap[story.id] || 0;
            const categoryObj = STORY_CATEGORIES.find(c => c.id === story.category);

            return (
              <div
                key={story.id}
                onClick={() => onReadStory(story)}
                style={{
                  background: '#ffffff',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#f43f5e';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(244, 63, 94, 0.12)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.03)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div>
                  {/* Category and Heart button row */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '12px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        background: categoryObj?.badgeBg || '#f1f5f9',
                        color: categoryObj?.color || '#334155'
                      }}>
                        {categoryObj?.name || story.category}
                      </span>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '3px 7px',
                        borderRadius: '6px',
                        background: '#eff6ff',
                        color: '#2563eb'
                      }}>
                        {getLanguageLabel(story.language)}
                      </span>
                    </div>

                    <button
                      onClick={(e) => handleRemoveFromWishlist(e, story)}
                      title="Remove from Wishlist"
                      style={{
                        border: 'none',
                        background: '#ffe4e6',
                        color: '#e11d48',
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      <Heart size={16} fill="#e11d48" />
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
                        {story.contentType === 'verified_true' ? 'Verified True Story' :
                         story.contentType === 'biography' ? 'Documented Biography' :
                         story.contentType === 'historical_account' ? 'Historical Account' : 'Fiction Inspired by Real Life'}
                      </span>
                    </div>
                  )}

                  {/* Title */}
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: 700,
                    color: '#0f172a',
                    lineHeight: 1.4,
                    marginBottom: '8px'
                  }}>
                    {story.title}
                  </h3>

                  {/* Short Description */}
                  <p style={{
                    fontSize: '13px',
                    color: '#64748b',
                    lineHeight: 1.5,
                    marginBottom: '14px',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {story.shortDescription}
                  </p>
                </div>

                {/* Footer and Reading Action */}
                <div>
                  {/* Reading progress bar if started */}
                  {progress > 0 && (
                    <div style={{ marginBottom: '10px' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '11px',
                        color: '#64748b',
                        marginBottom: '4px'
                      }}>
                        <span>Reading Progress</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <div style={{
                        width: '100%',
                        height: '4px',
                        background: '#e2e8f0',
                        borderRadius: '2px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${progress}%`,
                          height: '100%',
                          background: '#f43f5e'
                        }} />
                      </div>
                    </div>
                  )}

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '12px',
                    borderTop: '1px solid #f1f5f9'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '12px',
                      color: '#64748b'
                    }}>
                      <Clock size={13} />
                      <span>{story.readingTimeMinutes} min read</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onReadStory(story)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        background: 'transparent',
                        border: 'none',
                        color: '#e11d48',
                        fontSize: '13px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      <span>{progress > 0 ? 'Continue' : 'Read Now'}</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
