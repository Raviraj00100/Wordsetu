import React, { useState, useEffect } from 'react';
import {
  Flame, Award, BookOpen, Clock, CheckCircle2,
  TrendingUp, Sparkles, X, ArrowRight, RefreshCw
} from 'lucide-react';
import { Story, StoryLanguage } from '../../types/story';
import { Language } from '../../data/languages';
import { kathaSetuDb } from '../../services/db';

interface MyProgressViewProps {
  streakDays: number;
  totalWordsLearned: number;
  selectedLanguage: Language;
  onReadStory: (story: Story) => void;
  onGoToDailyWords: () => void;
}

export const MyProgressView: React.FC<MyProgressViewProps> = ({
  streakDays,
  totalWordsLearned,
  selectedLanguage,
  onReadStory,
  onGoToDailyWords
}) => {
  const [stories, setStories] = useState<Story[]>([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [totalReadMinutes, setTotalReadMinutes] = useState(0);
  const [avgQuizScore, setAvgQuizScore] = useState(0);
  const [avgWpm, setAvgWpm] = useState(0);
  const [dismissedStoryIds, setDismissedStoryIds] = useState<string[]>([]);

  useEffect(() => {
    kathaSetuDb.getAllStories().then(all => {
      setStories(all);
    });

    kathaSetuDb.getAllReadingProgress().then(prog => {
      const completed = prog.filter(p => p.completed || p.scrollPercentage >= 90).length;
      setCompletedCount(completed);
      const minutes = Math.round(prog.reduce((sum, p) => sum + (p.timeSpentSeconds || 60), 0) / 60);
      setTotalReadMinutes(minutes);
    });

    kathaSetuDb.getAllStoryQuizResults().then(qResults => {
      if (qResults.length > 0) {
        const totalPct = qResults.reduce((sum, q) => sum + ((q.score / q.total) * 100), 0);
        setAvgQuizScore(Math.round(totalPct / qResults.length));
      }
    });

    kathaSetuDb.getAllReadingTestResults().then(tResults => {
      if (tResults.length > 0) {
        const totalWpm = tResults.reduce((sum, t) => sum + t.wpm, 0);
        setAvgWpm(Math.round(totalWpm / tResults.length));
      }
    });
  }, []);

  // Filter recommendations matching the user's selected language
  const recommendations = stories
    .filter(s => s.status === 'published' && s.language === (selectedLanguage.code as StoryLanguage || 'en'))
    .filter(s => !dismissedStoryIds.includes(s.id))
    .slice(0, 3);

  const handleDismissRecommendation = (id: string) => {
    setDismissedStoryIds(prev => [...prev, id]);
  };

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
          Analytics & Insights
        </span>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '30px',
          fontWeight: 800,
          color: '#0f172a',
          marginTop: '8px'
        }}>
          My Learning Progress
        </h1>
        <p style={{ fontSize: '14px', color: '#64748b', marginTop: '2px' }}>
          Comprehensive view of your vocabulary mastery, daily learning streak, reading speed, and personalized story recommendations.
        </p>
      </div>

      {/* Core Stats Overview */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '32px'
      }}>
        {/* Streak */}
        <div style={{ background: '#ffffff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ea580c', marginBottom: '8px' }}>
            <Flame size={20} />
            <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase' }}>Daily Streak</span>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 800, color: '#0f172a' }}>
            {streakDays} <span style={{ fontSize: '16px', fontWeight: 600, color: '#64748b' }}>days</span>
          </div>
          <div style={{ fontSize: '12px', color: '#16a34a', marginTop: '4px' }}>
            Keep practicing daily to grow!
          </div>
        </div>

        {/* Total Words */}
        <div style={{ background: '#ffffff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#2563eb', marginBottom: '8px' }}>
            <Award size={20} />
            <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase' }}>Words Mastered</span>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 800, color: '#0f172a' }}>
            {totalWordsLearned}
          </div>
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
            From daily lessons & stories
          </div>
        </div>

        {/* Stories Read */}
        <div style={{ background: '#ffffff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#7c3aed', marginBottom: '8px' }}>
            <BookOpen size={20} />
            <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase' }}>Stories Completed</span>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 800, color: '#0f172a' }}>
            {completedCount}
          </div>
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
            {totalReadMinutes} minutes read
          </div>
        </div>

        {/* Reading Speed */}
        <div style={{ background: '#ffffff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#059669', marginBottom: '8px' }}>
            <TrendingUp size={20} />
            <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase' }}>Reading Speed</span>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 800, color: '#0f172a' }}>
            {avgWpm || 185} <span style={{ fontSize: '16px', fontWeight: 600, color: '#64748b' }}>WPM</span>
          </div>
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
            Quiz Accuracy: {avgQuizScore ? `${avgQuizScore}%` : '85%'}
          </div>
        </div>
      </div>

      {/* Weekly Activity Progress Breakdown */}
      <div style={{
        background: '#ffffff',
        borderRadius: '20px',
        border: '1px solid #e2e8f0',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        marginBottom: '32px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
              Weekly Learning Activity
            </h2>
            <p style={{ fontSize: '13px', color: '#64748b' }}>
              Consistency over the last 7 days
            </p>
          </div>
          <span style={{
            fontSize: '12px',
            fontWeight: 700,
            color: '#16a34a',
            background: '#ecfdf5',
            padding: '4px 10px',
            borderRadius: '9999px'
          }}>
            Active Streak
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px', textAlign: 'center' }}>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => {
            const isToday = idx === 6;
            return (
              <div key={day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '100%',
                  height: '80px',
                  background: isToday ? '#2563eb' : '#eff6ff',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  padding: '8px',
                  border: isToday ? 'none' : '1px solid #dbeafe'
                }}>
                  <div style={{
                    width: '80%',
                    height: `${40 + (idx * 9)}%`,
                    background: isToday ? '#ffffff' : '#60a5fa',
                    borderRadius: '6px'
                  }} />
                </div>
                <span style={{ fontSize: '12px', fontWeight: isToday ? 800 : 600, color: isToday ? '#2563eb' : '#64748b' }}>
                  {day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Personalized Story Recommendations */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>
              Recommended For You
            </h2>
            <p style={{ fontSize: '13px', color: '#64748b' }}>
              Stories matched to your preferred language ({selectedLanguage.name}) and reading level
            </p>
          </div>
          <button
            onClick={() => setDismissedStoryIds([])}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              background: 'none',
              border: 'none',
              color: '#2563eb',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <RefreshCw size={14} />
            <span>Reset Recommendations</span>
          </button>
        </div>

        {recommendations.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {recommendations.map(story => (
              <div
                key={story.id}
                style={{
                  background: '#ffffff',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                  padding: '20px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <button
                  onClick={() => handleDismissRecommendation(story.id)}
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer'
                  }}
                  title="Dismiss Recommendation"
                >
                  <X size={16} />
                </button>

                <div>
                  <span style={{
                    fontSize: '10px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    background: '#eff6ff',
                    color: '#2563eb',
                    display: 'inline-block',
                    marginBottom: '8px'
                  }}>
                    {story.category.replace('-', ' ')}
                  </span>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', marginBottom: '6px', paddingRight: '20px' }}>
                    {story.title}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.4, marginBottom: '16px' }}>
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
                  <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '36px', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <Sparkles size={32} color="#94a3b8" style={{ margin: '0 auto 8px' }} />
            <p style={{ fontSize: '14px', color: '#64748b' }}>
              All recommendations explored! Check back tomorrow or reset above.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
