import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, Award, RotateCcw, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Story, StoryQuizQuestion } from '../../types/story';
import { kathaSetuDb } from '../../services/db';

interface StoryQuizModalProps {
  story: Story;
  onClose: () => void;
  onQuizCompleted?: (score: number, total: number) => void;
}

export const StoryQuizModal: React.FC<StoryQuizModalProps> = ({
  story,
  onClose,
  onQuizCompleted
}) => {
  const questions: StoryQuizQuestion[] = story.quiz || [
    {
      id: 'default-q1',
      question: `What is the primary moral lesson of "${story.title}"?`,
      options: [
        story.moral || 'Patience and wisdom conquer difficulties',
        'Physical might is greater than intellect',
        'Never trust any friend',
        'Fortune favors only the wealthy'
      ],
      correctIndex: 0,
      explanation: story.moral || 'The moral highlights wisdom, ethics, and patience.'
    },
    {
      id: 'default-q2',
      question: `In what cultural or regional tradition is this story rooted?`,
      options: [
        story.region || 'Traditional Indian Folklore',
        'Ancient Scandinavia',
        'North American Prairies',
        'Arctic Tundra'
      ],
      correctIndex: 0,
      explanation: `This tale is part of the Indian storytelling tradition in ${story.region || 'India'}.`
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQ = questions[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    if (idx === currentQ.correctIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = async () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      // Quiz completed!
      setIsCompleted(true);
      const finalScore = selectedOption === currentQ.correctIndex ? score : score;

      // Confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        console.warn(e);
      }

      await kathaSetuDb.saveStoryQuizResult({
        storyId: story.id,
        score: finalScore,
        total: questions.length,
        completedAt: Date.now()
      });

      onQuizCompleted?.(finalScore, questions.length);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsCompleted(false);
  };

  return (
    <div
      className="modal-overlay"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="story-quiz-modal"
        style={{
          background: '#ffffff',
          width: '92%',
          maxWidth: '560px',
          borderRadius: '20px',
          padding: '24px',
          boxShadow: '0 20px 50px rgba(15, 23, 42, 0.25)',
          border: '1px solid #e2e8f0',
          position: 'relative'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <span style={{
              fontSize: '11px',
              fontWeight: 800,
              textTransform: 'uppercase',
              color: '#d97706',
              background: '#fef3c7',
              padding: '3px 10px',
              borderRadius: '9999px'
            }}>
              Story Comprehension Quiz
            </span>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 700,
              color: '#0f172a',
              marginTop: '4px'
            }}>
              {story.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#f1f5f9',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748b'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {!isCompleted ? (
          <div>
            {/* Progress indicator */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>
                Question {currentIndex + 1} of {questions.length}
              </span>
              <span style={{ fontSize: '13px', color: '#2563eb', fontWeight: 700 }}>
                Score: {score}
              </span>
            </div>
            <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '9999px', overflow: 'hidden', marginBottom: '20px' }}>
              <div style={{
                width: `${((currentIndex + 1) / questions.length) * 100}%`,
                height: '100%',
                background: '#2563eb',
                transition: 'width 0.3s ease'
              }} />
            </div>

            {/* Question Card */}
            <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', lineHeight: 1.4, marginBottom: '16px' }}>
              {currentQ.question}
            </h4>

            {/* Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px' }}>
              {currentQ.options.map((opt, idx) => {
                let borderCol = '#e2e8f0';
                let bgCol = '#ffffff';
                let textCol = '#334155';

                if (isAnswered) {
                  if (idx === currentQ.correctIndex) {
                    borderCol = '#10b981';
                    bgCol = '#ecfdf5';
                    textCol = '#047857';
                  } else if (idx === selectedOption) {
                    borderCol = '#ef4444';
                    bgCol = '#fef2f2';
                    textCol = '#b91c1c';
                  }
                } else if (selectedOption === idx) {
                  borderCol = '#2563eb';
                  bgCol = '#eff6ff';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    disabled={isAnswered}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      border: `2px solid ${borderCol}`,
                      background: bgCol,
                      color: textCol,
                      fontSize: '14px',
                      fontWeight: 500,
                      textAlign: 'left',
                      cursor: isAnswered ? 'default' : 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span>{opt}</span>
                    {isAnswered && idx === currentQ.correctIndex && (
                      <CheckCircle2 size={18} color="#10b981" />
                    )}
                    {isAnswered && idx === selectedOption && idx !== currentQ.correctIndex && (
                      <AlertCircle size={18} color="#ef4444" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation when answered */}
            {isAnswered && (
              <div style={{
                background: selectedOption === currentQ.correctIndex ? '#f0fdf4' : '#fff1f2',
                border: `1px solid ${selectedOption === currentQ.correctIndex ? '#bbf7d0' : '#fecdd3'}`,
                padding: '12px 14px',
                borderRadius: '10px',
                fontSize: '13px',
                color: selectedOption === currentQ.correctIndex ? '#166534' : '#991b1b',
                marginBottom: '16px'
              }}>
                <strong>{selectedOption === currentQ.correctIndex ? '✓ Correct! ' : '✗ Incorrect. '}</strong>
                {currentQ.explanation}
              </div>
            )}

            {/* Next Button */}
            {isAnswered && (
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={handleNextQuestion}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '10px 20px',
                    borderRadius: '10px',
                    background: '#2563eb',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <span>{currentIndex + 1 < questions.length ? 'Next Question' : 'View Results'}</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Quiz Results View */
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#fef3c7',
              color: '#d97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <Award size={36} />
            </div>

            <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
              Quiz Completed!
            </h3>
            <p style={{ fontSize: '15px', color: '#64748b', marginBottom: '16px' }}>
              You scored <strong>{score}</strong> out of <strong>{questions.length}</strong> ({Math.round((score / questions.length) * 100)}%)
            </p>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={handleRestart}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 18px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                  background: '#f8fafc',
                  color: '#475569',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <RotateCcw size={16} />
                <span>Retry Quiz</span>
              </button>
              <button
                onClick={onClose}
                style={{
                  padding: '10px 22px',
                  borderRadius: '10px',
                  background: '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
