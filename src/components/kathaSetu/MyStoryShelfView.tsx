import React, { useState, useEffect } from 'react';
import {
  Bookmark, Clock, CheckCircle2, PenTool, BookOpen,
  Award, Trash2, ArrowRight, Volume2, Sparkles
} from 'lucide-react';
import { Story, ReadingProgressRecord, SavedStoryWord } from '../../types/story';
import { kathaSetuDb } from '../../services/db';
import { audioService } from '../../utils/audio';

interface MyStoryShelfViewProps {
  onReadStory: (story: Story) => void;
  onBrowseLibrary: () => void;
  onCreateStory: () => void;
}

export const MyStoryShelfView: React.FC<MyStoryShelfViewProps> = ({
  onReadStory,
  onBrowseLibrary,
  onCreateStory
}) => {
  const [activeTab, setActiveTab] = useState<'continue' | 'bookmarks' | 'completed' | 'created' | 'saved_words' | 'test_results'>('continue');
  const [allStories, setAllStories] = useState<Story[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [progressRecords, setProgressRecords] = useState<ReadingProgressRecord[]>([]);
  const [userStories, setUserStories] = useState<Story[]>([]);
  const [savedStoryWords, setSavedStoryWords] = useState<SavedStoryWord[]>([]);
  const [quizResults, setQuizResults] = useState<Array<{ storyId: string; score: number; total: number; completedAt: number }>>([]);
  const [testResults, setTestResults] = useState<Array<{ passageTitle: string; difficulty: string; wpm: number; score: number; total: number; completedAt: number }>>([]);

  const loadShelfData = async () => {
    const stories = await kathaSetuDb.getAllStories();
    setAllStories(stories);

    const bm = await kathaSetuDb.getAllBookmarks();
    setBookmarks(bm.map(b => b.storyId));

    const prog = await kathaSetuDb.getAllReadingProgress();
    setProgressRecords(prog);

    const uStories = await kathaSetuDb.getUserStories();
    setUserStories(uStories);

    const sWords = await kathaSetuDb.getAllSavedStoryWords();
    setSavedStoryWords(sWords);

    const qResults = await kathaSetuDb.getAllStoryQuizResults();
    setQuizResults(qResults);

    const tResults = await kathaSetuDb.getAllReadingTestResults();
    setTestResults(tResults);
  };

  useEffect(() => {
    loadShelfData();
  }, []);

  const handleRemoveBookmark = async (storyId: string) => {
    await kathaSetuDb.toggleBookmark(storyId);
    setBookmarks(prev => prev.filter(id => id !== storyId));
  };

  const handleRemoveStoryWord = async (id: string) => {
    await kathaSetuDb.removeSavedStoryWord(id);
    setSavedStoryWords(prev => prev.filter(w => w.id !== id));
  };

  // Continue Reading: stories with progress < 90 and > 0
  const inProgressStories = progressRecords
    .filter(p => !p.completed && p.scrollPercentage > 0 && p.scrollPercentage < 90)
    .map(p => ({
      story: allStories.find(s => s.id === p.storyId),
      progress: p
    }))
    .filter((item): item is { story: Story; progress: ReadingProgressRecord } => Boolean(item.story));

  // Bookmarked Stories
  const bookmarkedStories = allStories.filter(s => bookmarks.includes(s.id));

  // Completed Stories
  const completedStories = progressRecords
    .filter(p => p.completed || p.scrollPercentage >= 90)
    .map(p => allStories.find(s => s.id === p.storyId))
    .filter((s): s is Story => Boolean(s));

  return (
    <div className="container" style={{ maxWidth: '980px', margin: '20px auto 60px' }}>
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
          Personal Library
        </span>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '28px',
          fontWeight: 800,
          color: '#0f172a',
          marginTop: '8px'
        }}>
          My Story Shelf
        </h1>
        <p style={{ fontSize: '14px', color: '#64748b', marginTop: '2px' }}>
          Resume your reading journey, manage bookmarks, review saved vocabulary, and track story quiz results.
        </p>
      </div>

      {/* Navigation Pills */}
      <div style={{
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        paddingBottom: '12px',
        marginBottom: '24px',
        borderBottom: '1px solid #e2e8f0'
      }}>
        {[
          { id: 'continue', label: `Continue Reading (${inProgressStories.length})`, icon: Clock },
          { id: 'bookmarks', label: `Bookmarks (${bookmarkedStories.length})`, icon: Bookmark },
          { id: 'completed', label: `Completed (${completedStories.length})`, icon: CheckCircle2 },
          { id: 'created', label: `My Stories (${userStories.length})`, icon: PenTool },
          { id: 'saved_words', label: `Story Words (${savedStoryWords.length})`, icon: Sparkles },
          { id: 'test_results', label: `Test Scores (${testResults.length + quizResults.length})`, icon: Award }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                borderRadius: '12px',
                border: 'none',
                background: isActive ? '#2563eb' : '#f1f5f9',
                color: isActive ? '#ffffff' : '#475569',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Continue Reading */}
      {activeTab === 'continue' && (
        <div>
          {inProgressStories.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {inProgressStories.map(({ story, progress }) => (
                <div
                  key={story.id}
                  style={{
                    background: '#ffffff',
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0',
                    padding: '20px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{
                        fontSize: '10px',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        background: '#eff6ff',
                        color: '#2563eb'
                      }}>
                        {story.language.toUpperCase()} • {story.category}
                      </span>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>
                        {progress.scrollPercentage}% read
                      </span>
                    </div>

                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '8px', lineHeight: 1.3 }}>
                      {story.title}
                    </h3>
                    <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px', lineHeight: 1.4 }}>
                      {story.shortDescription}
                    </p>

                    {/* Progress Bar */}
                    <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden', marginBottom: '16px' }}>
                      <div style={{ width: `${progress.scrollPercentage}%`, height: '100%', background: '#2563eb' }} />
                    </div>
                  </div>

                  <button
                    onClick={() => onReadStory(story)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '10px',
                      borderRadius: '10px',
                      background: '#2563eb',
                      color: '#ffffff',
                      border: 'none',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    <span>Continue Reading</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '48px 20px', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <Clock size={36} color="#94a3b8" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                No Stories in Progress
              </h3>
              <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '18px' }}>
                Start reading any story in English, Hindi, Tamil, or Malayalam to automatically track your position.
              </p>
              <button
                onClick={onBrowseLibrary}
                style={{
                  padding: '10px 20px',
                  borderRadius: '10px',
                  background: '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Browse KathaSetu Stories
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Bookmarks */}
      {activeTab === 'bookmarks' && (
        <div>
          {bookmarkedStories.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {bookmarkedStories.map(story => (
                <div
                  key={story.id}
                  style={{
                    background: '#ffffff',
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0',
                    padding: '20px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{
                        fontSize: '10px',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        background: '#fef3c7',
                        color: '#d97706'
                      }}>
                        {story.language.toUpperCase()} • {story.difficulty}
                      </span>
                      <button
                        onClick={() => handleRemoveBookmark(story.id)}
                        style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                        title="Remove Bookmark"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '8px', lineHeight: 1.3 }}>
                      {story.title}
                    </h3>
                    <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px', lineHeight: 1.4 }}>
                      {story.shortDescription}
                    </p>
                  </div>

                  <button
                    onClick={() => onReadStory(story)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '10px',
                      borderRadius: '10px',
                      background: '#2563eb',
                      color: '#ffffff',
                      border: 'none',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    <span>Read Story</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '48px 20px', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <Bookmark size={36} color="#94a3b8" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                No Bookmarked Stories
              </h3>
              <p style={{ fontSize: '14px', color: '#64748b' }}>
                Tap the bookmark ribbon while reading any story to save it here for easy reference.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Completed Stories */}
      {activeTab === 'completed' && (
        <div>
          {completedStories.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {completedStories.map(story => (
                <div
                  key={story.id}
                  style={{
                    background: '#ffffff',
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0',
                    padding: '20px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#16a34a', fontSize: '12px', fontWeight: 700, marginBottom: '8px' }}>
                    <CheckCircle2 size={16} />
                    <span>Completed</span>
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                    {story.title}
                  </h3>
                  <button
                    onClick={() => onReadStory(story)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      background: '#f8fafc',
                      color: '#334155',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      marginTop: '10px'
                    }}
                  >
                    Read Again
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '48px 20px', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <CheckCircle2 size={36} color="#94a3b8" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                No Completed Stories Yet
              </h3>
              <p style={{ fontSize: '14px', color: '#64748b' }}>
                Scroll through stories to the very end to mark them completed and build your reading streak.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Created Stories */}
      {activeTab === 'created' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
            <button
              onClick={onCreateStory}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 18px',
                borderRadius: '10px',
                background: '#7c3aed',
                color: '#ffffff',
                border: 'none',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              <PenTool size={16} />
              <span>Create New Story</span>
            </button>
          </div>

          {userStories.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {userStories.map(story => (
                <div
                  key={story.id}
                  style={{
                    background: '#ffffff',
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0',
                    padding: '20px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                  }}
                >
                  <span style={{
                    fontSize: '10px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    background: story.status === 'published' ? '#dcfce7' : '#ede9fe',
                    color: story.status === 'published' ? '#16a34a' : '#7c3aed',
                    display: 'inline-block',
                    marginBottom: '8px'
                  }}>
                    {story.status === 'published' ? 'Published' : story.status === 'under_review' ? 'Under Review' : 'Draft'}
                  </span>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                    {story.title}
                  </h3>
                  <button
                    onClick={() => onReadStory(story)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '8px',
                      background: '#2563eb',
                      color: '#ffffff',
                      border: 'none',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      marginTop: '8px'
                    }}
                  >
                    View Draft
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '48px 20px', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <PenTool size={36} color="#94a3b8" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                No Stories Created Yet
              </h3>
              <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '16px' }}>
                Use the "Create Your Own Story" studio to write and publish original Indian folklore tales.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Saved Story Words */}
      {activeTab === 'saved_words' && (
        <div>
          {savedStoryWords.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
              {savedStoryWords.map(sw => (
                <div
                  key={sw.id}
                  style={{
                    background: '#ffffff',
                    borderRadius: '14px',
                    border: '1px solid #e2e8f0',
                    padding: '16px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '17px', fontWeight: 700, color: '#0f172a' }}>
                        {sw.word}
                      </span>
                      <button
                        onClick={() => audioService.speak(sw.word)}
                        style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer' }}
                        title="Pronounce"
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
                    <div style={{
                      fontSize: '12px',
                      color: '#475569',
                      fontStyle: 'italic',
                      background: '#f8fafc',
                      padding: '6px 10px',
                      borderRadius: '6px',
                      marginBottom: '6px'
                    }}>
                      "{sw.contextSentence}"
                    </div>
                  )}

                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                    From: {sw.storyTitle}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '48px 20px', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <Sparkles size={36} color="#94a3b8" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                No Words Saved from Stories
              </h3>
              <p style={{ fontSize: '14px', color: '#64748b' }}>
                While reading any KathaSetu story, tap on unfamiliar words and click "Save to Vocabulary".
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab 6: Test Results */}
      {activeTab === 'test_results' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {testResults.length > 0 && (
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>
                Reading Test Performance
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
                {testResults.map((t, idx) => (
                  <div key={idx} style={{ background: '#ffffff', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '11px', color: '#2563eb', fontWeight: 700, textTransform: 'uppercase' }}>
                      {t.difficulty} Passage
                    </div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', margin: '4px 0' }}>
                      {t.passageTitle}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#475569', marginTop: '8px' }}>
                      <span>Speed: <strong>{t.wpm} WPM</strong></span>
                      <span>Score: <strong>{t.score}/{t.total}</strong> ({Math.round((t.score / t.total) * 100)}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {quizResults.length > 0 && (
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: '16px 0 12px' }}>
                Story Quiz Results
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px' }}>
                {quizResults.map((q, idx) => (
                  <div key={idx} style={{ background: '#ffffff', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '13px', color: '#64748b' }}>
                      Quiz Attempt #{idx + 1}
                    </div>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: '#10b981', margin: '4px 0' }}>
                      {q.score} / {q.total} Correct
                    </div>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                      {new Date(q.completedAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {testResults.length === 0 && quizResults.length === 0 && (
            <div style={{ textAlign: 'center', padding: '48px 20px', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <Award size={36} color="#94a3b8" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>
                No Test Scores Yet
              </h3>
              <p style={{ fontSize: '14px', color: '#64748b' }}>
                Take reading tests and story comprehension quizzes to see your speed, accuracy, and comprehension stats here!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
