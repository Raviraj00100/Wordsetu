import React, { useEffect, useState } from 'react';
import { Clock, Sparkles, FastForward, CheckCircle2 } from 'lucide-react';

interface CountdownTimerProps {
  initialRemainingMs: number;
  lessonNumber: number;
  onAdvanceLesson?: () => void;
  isPoolExhausted?: boolean;
  remainingEligibleCount?: number;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  initialRemainingMs,
  lessonNumber,
  onAdvanceLesson,
  isPoolExhausted = false,
  remainingEligibleCount = 0
}) => {
  const [msLeft, setMsLeft] = useState(initialRemainingMs);

  useEffect(() => {
    setMsLeft(initialRemainingMs);
  }, [initialRemainingMs]);

  useEffect(() => {
    if (isPoolExhausted) return;
    const interval = setInterval(() => {
      setMsLeft(prev => Math.max(0, prev - 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [isPoolExhausted]);

  const totalSeconds = Math.floor(msLeft / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const formatUnit = (n: number) => n.toString().padStart(2, '0');

  if (isPoolExhausted) {
    return (
      <div className="card-glass" style={{ borderLeft: '4px solid #10b981' }}>
        <div className="countdown-header">
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #059669, #10b981)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 6px 14px rgba(16, 185, 129, 0.25)',
            flexShrink: 0
          }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <h3 className="card-title">All Vocabulary Mastered</h3>
            <p className="card-subtitle">You have completed all available daily lessons</p>
          </div>
        </div>

        <div style={{
          padding: '16px',
          background: '#ecfdf5',
          borderRadius: '12px',
          border: '1px solid #a7f3d0',
          fontSize: '13.5px',
          color: '#065f46',
          lineHeight: 1.5,
          marginBottom: '12px'
        }}>
          🎉 <strong>Vocabulary Pool Completed:</strong> Every word in the curriculum has been assigned. You can revise previous words, practice quizzes, or search any English word anytime!
        </div>
      </div>
    );
  }

  return (
    <div className="card-glass" style={{ borderLeft: '4px solid #6366f1' }}>
      <div className="countdown-header">
        <div className="icon-box-indigo">
          <Clock size={24} />
        </div>
        <div>
          <h3 className="card-title">Next Lesson In (Day {lessonNumber + 1})</h3>
          <p className="card-subtitle">
            10 new unrepeated words unlock every 24 hours
          </p>
        </div>
      </div>

      <div className="countdown-digits-grid">
        <div className="countdown-box">
          <div className="countdown-value">{formatUnit(hours)}</div>
          <div className="countdown-label">Hours</div>
        </div>
        <div className="countdown-box">
          <div className="countdown-value">{formatUnit(minutes)}</div>
          <div className="countdown-label">Minutes</div>
        </div>
        <div className="countdown-box">
          <div className="countdown-value">{formatUnit(seconds)}</div>
          <div className="countdown-label">Seconds</div>
        </div>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '8px',
        marginTop: '6px'
      }}>
        <div className="countdown-note" style={{ margin: 0 }}>
          <Sparkles size={14} color="#6366f1" />
          <span>{remainingEligibleCount} unassigned words waiting in pool</span>
        </div>

        {onAdvanceLesson && (
          <button
            type="button"
            onClick={onAdvanceLesson}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '11.5px',
              fontWeight: 700,
              color: '#4f46e5',
              background: '#eef2ff',
              padding: '3px 8px',
              borderRadius: '6px',
              border: '1px solid #c7d2fe',
              cursor: 'pointer'
            }}
            title="Advance 24-hr cycle immediately to test that previously learned words are never repeated"
          >
            <FastForward size={12} />
            <span>Test Next Day</span>
          </button>
        )}
      </div>
    </div>
  );
};
