import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Volume2,
  Sparkles,
  Award
} from 'lucide-react';
import { VocabularyWord } from '../data/vocabulary';
import { Language } from '../data/languages';
import { audioService } from '../utils/audio';
import { StorageService } from '../utils/storage';

interface QuizViewProps {
  words: VocabularyWord[];
  selectedLanguage: Language;
  onReviewWords: () => void;
  onBackToHome: () => void;
}

interface Question {
  targetWord: VocabularyWord;
  options: {
    text: string;
    isCorrect: boolean;
  }[];
}

export const QuizView: React.FC<QuizViewProps> = ({
  words,
  selectedLanguage,
  onReviewWords,
  onBackToHome
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  // Generate dynamic 4-choice questions using today's words and current selected language
  useEffect(() => {
    const generated: Question[] = words.map(targetWord => {
      const correctMeaning = targetWord.translations[selectedLanguage.code] || targetWord.translations['hi'];

      // Pick 3 distractors from other words
      const otherWords = words.filter(w => w.id !== targetWord.id);
      const shuffledOthers = [...otherWords].sort(() => 0.5 - Math.random());
      const distractorWords = shuffledOthers.slice(0, 3);

      const distractors = distractorWords.map(w => ({
        text: w.translations[selectedLanguage.code] || w.translations['hi'],
        isCorrect: false
      }));

      const allOptions = [
        { text: correctMeaning, isCorrect: true },
        ...distractors
      ].sort(() => 0.5 - Math.random());

      return {
        targetWord,
        options: allOptions
      };
    });

    setQuestions(generated);
    setCurrentQIndex(0);
    setSelectedOptionIndex(null);
    setIsAnswered(false);
    setScore(0);
    setIsCompleted(false);
  }, [words, selectedLanguage]);

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedOptionIndex(index);
    setIsAnswered(true);

    const currentQ = questions[currentQIndex];
    if (currentQ.options[index].isCorrect) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setSelectedOptionIndex(null);
      setIsAnswered(false);
    } else {
      // Quiz finished
      setIsCompleted(true);
      StorageService.saveQuizScore(score + (questions[currentQIndex].options[selectedOptionIndex!].isCorrect ? 0 : 0), questions.length);

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQIndex(0);
    setSelectedOptionIndex(null);
    setIsAnswered(false);
    setScore(0);
    setIsCompleted(false);
  };

  if (questions.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
        <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
          No Quiz Questions Available
        </h2>
        <p style={{ fontSize: '15px', color: '#64748b', maxWidth: '500px', margin: '0 auto 24px' }}>
          All daily words have been learned or the vocabulary pool is exhausted. You can search any word in the dictionary or review your saved vocabulary!
        </p>
        <button className="btn-primary" onClick={onBackToHome}>
          Back to Home
        </button>
      </div>
    );
  }

  if (isCompleted) {
    const finalScore = score;
    const totalQuestions = questions.length;
    const percentage = Math.round((finalScore / totalQuestions) * 100);

    return (
      <div className="quiz-complete-card">
        <img
          src="/assets/quiz-trophy.jpg"
          alt="Celebratory Quiz Trophy"
          className="quiz-trophy-img"
        />

        <h2 className="complete-title">
          {percentage >= 80 ? 'Exceptional Work! 🌟' : percentage >= 50 ? 'Well Done! 👏' : 'Keep Practicing! 💪'}
        </h2>

        <div className="complete-score-big">
          {finalScore} / {totalQuestions}
        </div>

        <p className="complete-desc">
          You achieved a score of <strong>{percentage}%</strong> in today's English vocabulary mastery quiz with meanings in <strong>{selectedLanguage.name} ({selectedLanguage.nativeName})</strong>.
        </p>

        <div className="complete-actions">
          <button className="btn-primary" onClick={handleRestartQuiz}>
            <RotateCcw size={16} />
            <span>Practice Again</span>
          </button>

          <button className="btn-secondary" onClick={onReviewWords}>
            <BookOpen size={16} />
            <span>Review Words</span>
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQIndex];
  const targetWord = currentQuestion.targetWord;

  return (
    <div className="quiz-wrapper">
      <div className="quiz-card">
        {/* Top Info Bar */}
        <div className="quiz-top-info">
          <span className="quiz-question-badge">
            Question {currentQIndex + 1} of {questions.length}
          </span>
          <span className="quiz-score-indicator">
            Score: <strong style={{ color: '#2563eb' }}>{score}</strong>
          </span>
        </div>

        {/* Target Word Card */}
        <div className="quiz-word-box">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className={`word-pos-tag ${targetWord.partOfSpeech}`}>{targetWord.partOfSpeech}</span>
            <button
              onClick={() => audioService.speak(targetWord.word)}
              style={{
                background: '#ffffff',
                border: '1px solid #bfdbfe',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#2563eb'
              }}
              title={`Hear ${targetWord.word}`}
            >
              <Volume2 size={14} />
            </button>
          </div>
          <h2 className="quiz-target-word">{targetWord.word}</h2>
          <p className="quiz-prompt-text">
            What is the correct meaning in <strong>{selectedLanguage.name} ({selectedLanguage.nativeName})</strong>?
          </p>
        </div>

        {/* Options List */}
        <div className="quiz-options-list">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedOptionIndex === idx;
            let statusClass = '';

            if (isAnswered) {
              if (option.isCorrect) {
                statusClass = 'correct';
              } else if (isSelected && !option.isCorrect) {
                statusClass = 'wrong';
              }
            }

            return (
              <button
                key={idx}
                className={`quiz-option-btn ${statusClass}`}
                onClick={() => handleSelectOption(idx)}
                disabled={isAnswered}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '8px',
                    background: '#f1f5f9',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="quiz-option-text quiz-option-native">
                    {option.text}
                  </span>
                </div>

                {isAnswered && option.isCorrect && (
                  <CheckCircle2 size={20} color="#059669" />
                )}
                {isAnswered && isSelected && !option.isCorrect && (
                  <XCircle size={20} color="#e11d48" />
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback Alert & Next Button */}
        {isAnswered && (
          <div className={`quiz-feedback-box ${currentQuestion.options[selectedOptionIndex!].isCorrect ? 'correct' : 'wrong'}`}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '14px' }}>
              {currentQuestion.options[selectedOptionIndex!].isCorrect ? (
                <>
                  <Sparkles size={18} color="#059669" />
                  <span>Correct! Great understanding of "{targetWord.word}".</span>
                </>
              ) : (
                <>
                  <XCircle size={18} color="#e11d48" />
                  <span>Incorrect. The correct meaning is "{targetWord.translations[selectedLanguage.code] || targetWord.translations['hi']}".</span>
                </>
              )}
            </div>

            <button
              className="btn-primary"
              style={{ padding: '8px 18px', fontSize: '13px' }}
              onClick={handleNextQuestion}
            >
              <span>{currentQIndex === questions.length - 1 ? 'See Results' : 'Next Question'}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
