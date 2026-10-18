import React from 'react';
import { Target, Award, ArrowUpRight } from 'lucide-react';

interface ProgressCardProps {
  completedCount: number;
  totalWords: number;
  onGoToLearn: () => void;
}

export const ProgressCard: React.FC<ProgressCardProps> = ({
  completedCount,
  totalWords,
  onGoToLearn
}) => {
  const percentage = totalWords > 0 ? Math.round((completedCount / totalWords) * 100) : 0;

  const getEncouragement = (pct: number) => {
    if (pct === 100) return '🎉 Outstanding! You completed all 10 words today!';
    if (pct >= 70) return '🔥 Great momentum! Almost finished today’s goal.';
    if (pct >= 40) return '💪 Solid progress! Keep building your vocabulary.';
    if (pct > 0) return '✨ Good start! Continue learning the remaining words.';
    return 'Ready to begin? Master today’s first word now!';
  };

  return (
    <div className="card-glass" style={{ borderLeft: '4px solid #2563eb' }}>
      <div className="progress-header">
        <div className="progress-header-left">
          <div className="icon-box-blue">
            <Target size={24} />
          </div>
          <div>
            <h3 className="card-title">Today's Daily Progress</h3>
            <p className="card-subtitle">Real-time completion based on your study session</p>
          </div>
        </div>
        <div className="progress-percentage-badge">{percentage}%</div>
      </div>

      <div className="progress-bar-track">
        <div
          className="progress-bar-fill"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>

      <div className="progress-stats-row">
        <span>
          Words Mastered: <strong className="progress-highlight">{completedCount}</strong> of <strong>{totalWords}</strong>
        </span>
        <button
          onClick={onGoToLearn}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            color: '#2563eb',
            fontWeight: 700,
            fontSize: '13px'
          }}
        >
          {completedCount === totalWords ? 'Review Words' : 'Continue Learning'}
          <ArrowUpRight size={15} />
        </button>
      </div>

      <div style={{
        marginTop: '12px',
        fontSize: '12.5px',
        color: completedCount === totalWords ? '#047857' : '#475569',
        fontWeight: completedCount === totalWords ? 700 : 500,
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }}>
        <Award size={15} color={completedCount === totalWords ? '#059669' : '#2563eb'} />
        <span>{getEncouragement(percentage)}</span>
      </div>
    </div>
  );
};
