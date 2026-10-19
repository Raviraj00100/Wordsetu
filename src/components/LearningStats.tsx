import React from 'react';
import { Flame, CheckCircle, BookOpen, Award } from 'lucide-react';

interface LearningStatsProps {
  streakDays: number;
  totalWordsLearned: number;
  storiesReadCount: number;
  averageQuizScorePct: number | null;
}

export const LearningStats: React.FC<LearningStatsProps> = ({
  streakDays,
  totalWordsLearned,
  storiesReadCount,
  averageQuizScorePct
}) => {
  return (
    <section className="learning-stats-section" aria-label="Learning Statistics">
      <div className="learning-stats-container">
        {/* STAT 1: STREAK */}
        <div className="learning-stat-card">
          <div className="stat-icon-wrapper stat-icon-streak">
            <Flame size={22} />
          </div>
          <div className="stat-info">
            <div className="stat-value">
              {streakDays > 0 ? `${streakDays} Days` : '0 Days'}
            </div>
            <div className="stat-label">Learning Streak</div>
          </div>
        </div>

        <div className="stat-divider" aria-hidden="true" />

        {/* STAT 2: TOTAL WORDS LEARNED */}
        <div className="learning-stat-card">
          <div className="stat-icon-wrapper stat-icon-words">
            <CheckCircle size={22} />
          </div>
          <div className="stat-info">
            <div className="stat-value">
              {totalWordsLearned > 0 ? totalWordsLearned.toLocaleString() : '0'}
            </div>
            <div className="stat-label">Words Learned</div>
          </div>
        </div>

        <div className="stat-divider" aria-hidden="true" />

        {/* STAT 3: STORIES READ */}
        <div className="learning-stat-card">
          <div className="stat-icon-wrapper stat-icon-stories">
            <BookOpen size={22} />
          </div>
          <div className="stat-info">
            <div className="stat-value">
              {storiesReadCount > 0 ? storiesReadCount.toLocaleString() : '0'}
            </div>
            <div className="stat-label">Stories Read</div>
          </div>
        </div>

        <div className="stat-divider" aria-hidden="true" />

        {/* STAT 4: AVERAGE QUIZ SCORE */}
        <div className="learning-stat-card">
          <div className="stat-icon-wrapper stat-icon-quiz">
            <Award size={22} />
          </div>
          <div className="stat-info">
            <div className="stat-value">
              {averageQuizScorePct !== null ? `${averageQuizScorePct}%` : '—'}
            </div>
            <div className="stat-label">Avg. Quiz Score</div>
          </div>
        </div>
      </div>
    </section>
  );
};
