import React from 'react';
import { Sparkles, ArrowRight, BookOpen, CheckCircle, Volume2 } from 'lucide-react';
import { Language } from '../data/languages';

interface HeroSectionProps {
  onStartLearning: () => void;
  onStartQuiz: () => void;
  selectedLanguage: Language;
  lessonNumber?: number;
  wordsCount?: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartLearning,
  onStartQuiz,
  selectedLanguage,
  lessonNumber = 1,
  wordsCount = 10
}) => {
  return (
    <section className="hero-wrapper" aria-label="Hero Section">
      <div className="hero-grid">
        {/* Left Column: Headline, Tagline, CTAs */}
        <div className="hero-content">
          <div className="hero-pill">
            <span className="hero-pill-indicator"></span>
            <span>Day {lessonNumber} • {wordsCount} New Words (Never Repeated)</span>
          </div>

          <h1 className="hero-title">
            Master English Daily,{' '}
            <span className="hero-title-gradient">In Your Language.</span>
          </h1>

          <p className="hero-subtitle">
            WordSetu bridges the gap between English and India's native languages. Build lasting fluency with 10 high-impact words every 24 hours, complete with accurate native meanings in{' '}
            <strong style={{ color: '#1d4ed8' }}>{selectedLanguage.name} ({selectedLanguage.nativeName})</strong>, authentic pronunciations, and real contextual examples.
          </p>

          <div className="hero-actions">
            <button className="btn-primary" onClick={onStartLearning}>
              <span>Start Learning Today</span>
              <ArrowRight size={18} />
            </button>

            <button className="btn-secondary" onClick={onStartQuiz}>
              <CheckCircle size={18} color="#2563eb" />
              <span>Practice Today's Quiz</span>
            </button>
          </div>

          {/* Social Proof & Language coverage */}
          <div className="hero-social-proof">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '13px' }}>
              <Sparkles size={16} color="#2563eb" />
              <span style={{ fontWeight: 600 }}>Supports 12 Languages:</span>
            </div>
            <div className="lang-dots-strip">
              <span className="lang-mini-badge">हिन्दी</span>
              <span className="lang-mini-badge">தமிழ்</span>
              <span className="lang-mini-badge">മലയാളം</span>
              <span className="lang-mini-badge">తెలుగు</span>
              <span className="lang-mini-badge">বাংলা</span>
              <span className="lang-mini-badge">मराठी</span>
              <span className="lang-mini-badge">+6 more</span>
            </div>
          </div>
        </div>

        {/* Right Column: 3D Educational Hero Illustration */}
        <div className="hero-visual-col">
          <div className="hero-card-frame">
            <img
              src="/assets/hero-education.jpg"
              alt="WordSetu Educational Illustration with Open Book and Vocabulary Elements"
              className="hero-card-img"
              loading="eager"
            />
            <div style={{
              position: 'absolute',
              bottom: '16px',
              left: '16px',
              right: '16px',
              background: 'rgba(255, 255, 255, 0.94)',
              backdropFilter: 'blur(10px)',
              padding: '12px 18px',
              borderRadius: '14px',
              border: '1px solid rgba(226, 232, 240, 0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 8px 20px rgba(15, 23, 42, 0.08)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  background: '#eff6ff',
                  color: '#2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Volume2 size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#1e3a8a' }}>Authentic Audio Included</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>Every word & example has clear audio</div>
                </div>
              </div>
              <span style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#059669',
                background: '#ecfdf5',
                padding: '3px 8px',
                borderRadius: '6px'
              }}>
                100% Free
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
