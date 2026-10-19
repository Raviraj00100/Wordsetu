import React, { useState, useEffect } from 'react';
import {
  Clock, Award, BookOpen, CheckCircle2, AlertCircle,
  RotateCcw, ArrowRight, Play, Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { READING_PASSAGES, ReadingPassage } from '../../data/readingTestData';
import { kathaSetuDb } from '../../services/db';

export const ReadingTestView: React.FC = () => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');
  const [activePassage, setActivePassage] = useState<ReadingPassage | null>(null);

  // Test state
  const [isReadingMode, setIsReadingMode] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string | number>>({});
  const [isTestComplete, setIsTestComplete] = useState(false);
  const [calculatedWpm, setCalculatedWpm] = useState(0);
  const [finalScore, setFinalScore] = useState(0);

  // Timer while reading
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isReadingMode && startTime) {
      interval = setInterval(() => {
        setElapsedSeconds(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isReadingMode, startTime]);

  const filteredPassages = READING_PASSAGES.filter(p => {
    if (selectedDifficulty !== 'all' && p.difficulty !== selectedDifficulty) return false;
    return true;
  });

  const handleStartPassage = (passage: ReadingPassage) => {
    setActivePassage(passage);
    setIsReadingMode(true);
    setStartTime(Date.now());
    setElapsedSeconds(0);
    setIsQuizMode(false);
    setCurrentQIndex(0);
    setUserAnswers({});
    setIsTestComplete(false);
  };

  const handleFinishReading = () => {
    if (!activePassage || !startTime) return;
    const totalTimeSec = Math.max(10, Math.floor((Date.now() - startTime) / 1000));
    const wpm = Math.round((activePassage.wordCount / totalTimeSec) * 60);
    setCalculatedWpm(wpm);
    setIsReadingMode(false);
    setIsQuizMode(true);
  };

  const handleSelectAnswer = (qId: string, answer: string | number) => {
    setUserAnswers(prev => ({ ...prev, [qId]: answer }));
  };

  const handleSubmitQuiz = async () => {
    if (!activePassage) return;
    let score = 0;
    activePassage.questions.forEach(q => {
      if (userAnswers[q.id] === q.correctAnswer) {
        score++;
      }
    });

    setFinalScore(score);
    setIsTestComplete(true);

    try {
      confetti({ particleCount: 70, spread: 60 });
    } catch {}

    await kathaSetuDb.saveReadingTestResult({
      passageId: activePassage.id,
      passageTitle: activePassage.title,
      difficulty: activePassage.difficulty,
      wpm: calculatedWpm,
      score,
      total: activePassage.questions.length,
      completedAt: Date.now()
    });
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="container" style={{ maxWidth: '880px', margin: '20px auto 60px' }}>
      {/* View Header */}
      {!activePassage && (
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span style={{
            fontSize: '12px',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.8px',
            color: '#2563eb',
            background: '#eff6ff',
            padding: '4px 14px',
            borderRadius: '9999px',
            border: '1px solid #bfdbfe'
          }}>
            Skill Evaluation
          </span>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '32px',
            fontWeight: 800,
            color: '#0f172a',
            marginTop: '8px'
          }}>
            English Reading Speed & Comprehension Test
          </h1>
          <p style={{ fontSize: '15px', color: '#64748b', maxWidth: '580px', margin: '4px auto 0' }}>
            Measure your Words Per Minute (WPM) reading speed and test comprehension across multiple-choice, true/false, and vocabulary questions.
          </p>

          {/* Difficulty Filter */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '24px', flexWrap: 'wrap' }}>
            {['all', 'beginner', 'intermediate', 'advanced'].map(d => (
              <button
                key={d}
                onClick={() => setSelectedDifficulty(d as typeof selectedDifficulty)}
                style={{
                  padding: '8px 18px',
                  borderRadius: '10px',
                  border: selectedDifficulty === d ? '2px solid #2563eb' : '1px solid #cbd5e1',
                  background: selectedDifficulty === d ? '#eff6ff' : '#ffffff',
                  color: selectedDifficulty === d ? '#1d4ed8' : '#475569',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer',
                  textTransform: 'capitalize'
                }}
              >
                {d === 'all' ? 'All Passages' : d}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* State 1: Passage Selector */}
      {!activePassage && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '20px' }}>
          {filteredPassages.map(passage => (
            <div
              key={passage.id}
              style={{
                background: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                padding: '24px',
                boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    padding: '3px 10px',
                    borderRadius: '9999px',
                    background: passage.difficulty === 'beginner' ? '#ecfdf5' : passage.difficulty === 'intermediate' ? '#eff6ff' : '#faf5ff',
                    color: passage.difficulty === 'beginner' ? '#059669' : passage.difficulty === 'intermediate' ? '#2563eb' : '#9333ea'
                  }}>
                    {passage.difficulty}
                  </span>
                  <span style={{ fontSize: '13px', color: '#64748b' }}>
                    {passage.wordCount} words
                  </span>
                </div>

                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginBottom: '8px', lineHeight: 1.3 }}>
                  {passage.title}
                </h3>
                <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
                  Category: {passage.category} • {passage.questions.length} Comprehension Questions
                </p>
              </div>

              <button
                onClick={() => handleStartPassage(passage)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '12px',
                  borderRadius: '10px',
                  background: '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <Play size={16} />
                <span>Start Reading Test</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* State 2: Active Reading Mode (Timed) */}
      {activePassage && isReadingMode && (
        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          border: '1px solid #e2e8f0',
          padding: '32px',
          boxShadow: '0 6px 24px rgba(0,0,0,0.04)'
        }}>
          {/* Header Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #f1f5f9',
            paddingBottom: '16px',
            marginBottom: '24px'
          }}>
            <div>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase' }}>
                {activePassage.difficulty} Reading Test
              </span>
              <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                {activePassage.title}
              </h2>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: '#eff6ff',
              color: '#1d4ed8',
              padding: '8px 14px',
              borderRadius: '9999px',
              fontWeight: 700,
              fontSize: '15px'
            }}>
              <Clock size={16} />
              <span>{formatTimer(elapsedSeconds)}</span>
            </div>
          </div>

          {/* Passage Text */}
          <div style={{
            fontSize: '18px',
            lineHeight: 1.85,
            color: '#334155',
            whiteSpace: 'pre-line',
            marginBottom: '32px',
            padding: '16px 8px'
          }}>
            {activePassage.passageText}
          </div>

          {/* Finish Reading Button */}
          <div style={{ textAlign: 'center' }}>
            <button
              onClick={handleFinishReading}
              style={{
                padding: '14px 32px',
                borderRadius: '12px',
                background: '#2563eb',
                color: '#ffffff',
                border: 'none',
                fontSize: '16px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)'
              }}
            >
              I Finished Reading — Take Comprehension Quiz
            </button>
            <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '10px' }}>
              Your timer will stop and calculate your Reading Speed (WPM).
            </div>
          </div>
        </div>
      )}

      {/* State 3: Comprehension Quiz Mode */}
      {activePassage && isQuizMode && !isTestComplete && (
        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          border: '1px solid #e2e8f0',
          padding: '32px',
          boxShadow: '0 6px 24px rgba(0,0,0,0.04)'
        }}>
          {/* Speed Score Banner */}
          <div style={{
            background: '#ecfdf5',
            border: '1px solid #bbf7d0',
            borderRadius: '14px',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '28px'
          }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#047857', textTransform: 'uppercase' }}>
                Reading Speed Verified
              </div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#065f46' }}>
                {calculatedWpm} Words Per Minute (WPM)
              </div>
            </div>
            <div style={{ fontSize: '13px', color: '#047857', textAlign: 'right' }}>
              Time: {formatTimer(elapsedSeconds)}<br />
              {activePassage.wordCount} words read
            </div>
          </div>

          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginBottom: '20px' }}>
            Comprehension Questions
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {activePassage.questions.map((q, idx) => (
              <div key={q.id} style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '20px' }}>
                <div style={{ fontSize: '15px', fontWeight: 600, color: '#1e293b', marginBottom: '12px' }}>
                  {idx + 1}. {q.question}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {q.options.map((opt, optIdx) => {
                    const isSelected = userAnswers[q.id] === optIdx;
                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectAnswer(q.id, optIdx)}
                        style={{
                          textAlign: 'left',
                          padding: '10px 14px',
                          borderRadius: '8px',
                          border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
                          background: isSelected ? '#eff6ff' : '#ffffff',
                          color: isSelected ? '#1d4ed8' : '#334155',
                          fontSize: '14px',
                          cursor: 'pointer'
                        }}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '28px', textAlign: 'right' }}>
            <button
              onClick={handleSubmitQuiz}
              style={{
                padding: '12px 28px',
                borderRadius: '10px',
                background: '#2563eb',
                color: '#ffffff',
                border: 'none',
                fontWeight: 700,
                fontSize: '15px',
                cursor: 'pointer'
              }}
            >
              Submit Test & View Results
            </button>
          </div>
        </div>
      )}

      {/* State 4: Test Results & Detailed Review */}
      {activePassage && isTestComplete && (
        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          border: '1px solid #e2e8f0',
          padding: '32px',
          boxShadow: '0 6px 24px rgba(0,0,0,0.04)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
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

            <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
              Reading Assessment Completed!
            </h2>
            <p style={{ fontSize: '15px', color: '#64748b' }}>
              Passage: <strong>{activePassage.title}</strong>
            </p>

            {/* Score Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
              maxWidth: '440px',
              margin: '24px auto',
              textAlign: 'left'
            }}>
              <div style={{ background: '#eff6ff', padding: '16px', borderRadius: '12px', border: '1px solid #bfdbfe' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase' }}>
                  Reading Speed
                </div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#1e3a8a', marginTop: '2px' }}>
                  {calculatedWpm} WPM
                </div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                  Time: {formatTimer(elapsedSeconds)}
                </div>
              </div>

              <div style={{ background: '#ecfdf5', padding: '16px', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#059669', textTransform: 'uppercase' }}>
                  Comprehension Score
                </div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#064e3b', marginTop: '2px' }}>
                  {finalScore} / {activePassage.questions.length}
                </div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                  Accuracy: {Math.round((finalScore / activePassage.questions.length) * 100)}%
                </div>
              </div>
            </div>
          </div>

          {/* Answer Explanations Review */}
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>
            Answer Explanations & Review
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
            {activePassage.questions.map((q, idx) => {
              const isCorrect = userAnswers[q.id] === q.correctAnswer;
              return (
                <div
                  key={q.id}
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    background: isCorrect ? '#f0fdf4' : '#fef2f2',
                    border: `1px solid ${isCorrect ? '#bbf7d0' : '#fecdd3'}`
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    {isCorrect ? <CheckCircle2 size={16} color="#16a34a" /> : <AlertCircle size={16} color="#ef4444" />}
                    <span style={{ fontSize: '14px', fontWeight: 700, color: isCorrect ? '#166534' : '#991b1b' }}>
                      Question {idx + 1}: {q.question}
                    </span>
                  </div>
                  <div style={{ fontSize: '13px', color: '#334155', marginTop: '4px' }}>
                    <strong>Explanation:</strong> {q.explanation}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ textAlign: 'center' }}>
            <button
              onClick={() => setActivePassage(null)}
              style={{
                padding: '12px 28px',
                borderRadius: '10px',
                background: '#2563eb',
                color: '#ffffff',
                border: 'none',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Choose Another Passage
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
