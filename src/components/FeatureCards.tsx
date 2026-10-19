import React from 'react';
import { Sparkles, BookOpen, FileText, CheckCircle2, ArrowRight } from 'lucide-react';
import { ActiveNavTab } from './Navbar';

interface FeatureCardsProps {
  onSelectTab: (tab: ActiveNavTab) => void;
  lessonDay: number;
  totalStoriesCount: number;
  completedDailyCount?: number;
  quizScoreInfo?: { score: number; total: number } | null;
}

export const FeatureCards: React.FC<FeatureCardsProps> = ({
  onSelectTab,
  lessonDay,
  totalStoriesCount,
  completedDailyCount = 0,
  quizScoreInfo
}) => {
  return (
    <section className="feature-cards-section" aria-label="Key Learning Features">
      <div className="feature-cards-grid">
        {/* CARD 1 — DAILY WORDS (Soft Blue) */}
        <div
          className="feature-card feature-card-blue"
          onClick={() => onSelectTab('learn')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelectTab('learn'); }}
        >
          <div className="feature-card-content">
            <div className="feature-card-header">
              <span className="feature-tag feature-tag-blue">Day {lessonDay}</span>
              <div className="feature-card-icon icon-blue">
                <Sparkles size={24} />
              </div>
            </div>
            <h3 className="feature-card-title">Daily Words</h3>
            <p className="feature-card-subtitle">20 New Words Today</p>
            <p className="feature-card-desc">
              Master curated English vocabulary with authentic pronunciations, contextual examples, and native translations.
            </p>
            {completedDailyCount > 0 && (
              <div className="feature-card-meta">
                <span className="feature-meta-badge meta-blue">
                  {completedDailyCount}/20 learned today
                </span>
              </div>
            )}
          </div>
          <div className="feature-card-footer">
            <span className="feature-card-link link-blue">
              <span>Start Day {lessonDay}</span>
              <ArrowRight size={16} />
            </span>
          </div>
        </div>

        {/* CARD 2 — STORIES (Soft Green) */}
        <div
          className="feature-card feature-card-green"
          onClick={() => onSelectTab('stories')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelectTab('stories'); }}
        >
          <div className="feature-card-content">
            <div className="feature-card-header">
              <span className="feature-tag feature-tag-green">
                {totalStoriesCount > 0 ? `${totalStoriesCount.toLocaleString()}+ Published` : 'Indian Stories'}
              </span>
              <div className="feature-card-icon icon-green">
                <BookOpen size={24} />
              </div>
            </div>
            <h3 className="feature-card-title">Stories</h3>
            <p className="feature-card-subtitle">Multilingual Indian Tales</p>
            <p className="feature-card-desc">
              Panchatantra, Akbar-Birbal &amp; real-life stories in English, Hindi, Tamil, and Malayalam with tap-to-translate.
            </p>
            <div className="feature-card-meta">
              <div className="lang-pill-row">
                <span className="lang-micro-pill">English</span>
                <span className="lang-micro-pill">हिन्दी</span>
                <span className="lang-micro-pill">தமிழ்</span>
                <span className="lang-micro-pill">മലയാളം</span>
              </div>
            </div>
          </div>
          <div className="feature-card-footer">
            <span className="feature-card-link link-green">
              <span>Explore Stories</span>
              <ArrowRight size={16} />
            </span>
          </div>
        </div>

        {/* CARD 3 — READING TEST (Soft Orange) */}
        <div
          className="feature-card feature-card-orange"
          onClick={() => onSelectTab('reading_test')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelectTab('reading_test'); }}
        >
          <div className="feature-card-content">
            <div className="feature-card-header">
              <span className="feature-tag feature-tag-orange">WPM &amp; Comprehension</span>
              <div className="feature-card-icon icon-orange">
                <FileText size={24} />
              </div>
            </div>
            <h3 className="feature-card-title">Reading Test</h3>
            <p className="feature-card-subtitle">Timed Practice &amp; Assessment</p>
            <p className="feature-card-desc">
              Improve reading speed, retention, and comprehension with graded Indian stories and interactive comprehension tests.
            </p>
            <div className="feature-card-meta">
              <span className="feature-meta-badge meta-orange">
                Beginner • Intermediate • Advanced
              </span>
            </div>
          </div>
          <div className="feature-card-footer">
            <span className="feature-card-link link-orange">
              <span>Take Test</span>
              <ArrowRight size={16} />
            </span>
          </div>
        </div>

        {/* CARD 4 — QUIZ (Soft Pink) */}
        <div
          className="feature-card feature-card-pink"
          onClick={() => onSelectTab('quiz')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelectTab('quiz'); }}
        >
          <div className="feature-card-content">
            <div className="feature-card-header">
              <span className="feature-tag feature-tag-pink">Interactive Retention</span>
              <div className="feature-card-icon icon-pink">
                <CheckCircle2 size={24} />
              </div>
            </div>
            <h3 className="feature-card-title">Quiz</h3>
            <p className="feature-card-subtitle">Vocabulary &amp; Story Quizzes</p>
            <p className="feature-card-desc">
              Test your recall of today's 20 words with 4-choice interactive challenges and instant native feedback.
            </p>
            <div className="feature-card-meta">
              {quizScoreInfo ? (
                <span className="feature-meta-badge meta-pink">
                  Last Score: {quizScoreInfo.score}/{quizScoreInfo.total} ({Math.round((quizScoreInfo.score / quizScoreInfo.total) * 100)}%)
                </span>
              ) : (
                <span className="feature-meta-badge meta-pink">
                  20 Dynamic Questions
                </span>
              )}
            </div>
          </div>
          <div className="feature-card-footer">
            <span className="feature-card-link link-pink">
              <span>Start Quiz</span>
              <ArrowRight size={16} />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
