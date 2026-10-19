import React from 'react';
import { ArrowRight, BookOpen, Sparkles, Quote, Globe } from 'lucide-react';
import { Language } from '../data/languages';

interface HeroSectionProps {
  onStartLearning: () => void;
  onExploreStories?: () => void;
  selectedLanguage: Language;
  lessonNumber?: number;
  wordsCount?: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartLearning,
  onExploreStories,
  selectedLanguage,
  lessonNumber = 1,
  wordsCount = 20
}) => {
  return (
    <section className="hero-redesign-banner" aria-label="Welcome to WordSetu Hero">
      <div className="hero-banner-inner">
        {/* Left Column: Rich Typography, Headlines & CTAs */}
        <div className="hero-text-column">
          <div className="hero-badge-pill">
            <span className="hero-badge-pulse" />
            <Sparkles size={14} color="#f59e0b" />
            <span>Day {lessonNumber} • {wordsCount} Words Today</span>
          </div>

          <h1 className="hero-headline">
            Welcome to <span className="hero-brand-highlight">WordSetu!</span>
          </h1>

          <p className="hero-tagline">
            Learn new words, read amazing Indian stories, and grow every day.
          </p>

          <p className="hero-description">
            Experience an enriching journey through English vocabulary paired with India’s greatest folk tales in{' '}
            <strong className="hero-lang-accent">
              {selectedLanguage.name} ({selectedLanguage.nativeName})
            </strong>
            , Hindi, Tamil, and Malayalam.
          </p>

          {/* Inspirational Quote Card */}
          <div className="hero-quote-card">
            <Quote size={18} className="quote-icon" />
            <blockquote className="quote-text">
              “A reader lives a thousand lives before he dies. Knowledge is the bridge that turns ambition into achievement.”
            </blockquote>
          </div>

          {/* Actions */}
          <div className="hero-cta-group">
            <button
              className="hero-btn-primary"
              onClick={onStartLearning}
              aria-label="Start Learning English Vocabulary"
            >
              <span>Start Learning</span>
              <ArrowRight size={18} />
            </button>

            {onExploreStories && (
              <button
                className="hero-btn-secondary"
                onClick={onExploreStories}
                aria-label="Explore Indian Stories"
              >
                <BookOpen size={18} color="#059669" />
                <span>Explore Indian Stories</span>
              </button>
            )}
          </div>

          {/* Language Dots / Social Proof */}
          <div className="hero-language-strip">
            <div className="hero-strip-label">
              <Globe size={15} color="#2563eb" />
              <span>Multilingual Translations:</span>
            </div>
            <div className="hero-lang-pills">
              <span className="lang-pill">English</span>
              <span className="lang-pill">हिन्दी</span>
              <span className="lang-pill">தமிழ்</span>
              <span className="lang-pill">മലയാളം</span>
              <span className="lang-pill">తెలుగు</span>
              <span className="lang-pill">বাংলা</span>
              <span className="lang-pill-more">+6 Indian Languages</span>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Scenic Illustration Card */}
        <div className="hero-illustration-column">
          <div className="hero-illustration-frame">
            <img
              src="/assets/wordsetu_hero.jpg"
              alt="Indian palace on river bank at sunrise with student reading an open book"
              className="hero-scenic-image"
              loading="eager"
            />
            <div className="hero-illustration-glass-badge">
              <div className="glass-badge-avatar">📖</div>
              <div className="glass-badge-text">
                <span className="glass-badge-title">WordSetu Indian Storytelling</span>
                <span className="glass-badge-subtitle">Panchatantra • Birbal • Real-Life • Epics</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
