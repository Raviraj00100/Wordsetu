import React from 'react';
import { BookOpen, Heart, Sparkles, Globe, Library } from 'lucide-react';
import { SUPPORTED_LANGUAGES, Language } from '../data/languages';
import { ActiveNavTab } from './Navbar';

interface FooterProps {
  onSelectLanguage: (lang: Language) => void;
  onNavigate: (tab: ActiveNavTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectLanguage, onNavigate }) => {
  return (
    <footer className="footer-wrapper">
      <div className="container">
        <div className="footer-grid">
          {/* Col 1: Brand & Mission */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img src="/favicon.svg" alt="WordSetu" width="32" height="32" style={{ borderRadius: '8px' }} />
              <span className="brand-title" style={{ fontSize: '20px' }}>WordSetu</span>
            </div>
            <p className="footer-brand-desc">
              WordSetu is a comprehensive English learning platform with the KathaSetu multilingual Indian story library. We empower learners with 20 essential words daily, thousands of Indian folk tales across English, Hindi, Tamil, and Malayalam, and comprehensive reading assessments.
            </p>
          </div>

          {/* Col 2: Fast Navigation */}
          <div>
            <h4 className="footer-col-title">Platform Sections</h4>
            <ul className="footer-links">
              <li>
                <button className="footer-link" onClick={() => onNavigate('home')}>
                  Home
                </button>
              </li>
              <li>
                <button className="footer-link" onClick={() => onNavigate('learn')}>
                  Daily Words (20 Words)
                </button>
              </li>
              <li>
                <button className="footer-link" onClick={() => onNavigate('stories')}>
                  Stories — KathaSetu
                </button>
              </li>
              <li>
                <button className="footer-link" onClick={() => onNavigate('search')}>
                  Word Search
                </button>
              </li>
              <li>
                <button className="footer-link" onClick={() => onNavigate('reading_test')}>
                  Reading Test (WPM Assessment)
                </button>
              </li>
              <li>
                <button className="footer-link" onClick={() => onNavigate('quiz')}>
                  Daily Quiz
                </button>
              </li>
              <li>
                <button className="footer-link" onClick={() => onNavigate('shelf')}>
                  My Story Shelf
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Languages Covered */}
          <div>
            <h4 className="footer-col-title">12 Supported Languages</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {SUPPORTED_LANGUAGES.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => onSelectLanguage(lang)}
                  style={{
                    fontSize: '11.5px',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    background: '#f1f5f9',
                    color: '#334155',
                    border: '1px solid #e2e8f0',
                    cursor: 'pointer'
                  }}
                  title={`Switch meaning language to ${lang.name}`}
                >
                  {lang.name} ({lang.nativeName})
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="footer-bottom-row">
          <div>
            © {new Date().getFullYear()} <strong>WordSetu</strong> &amp; <strong>KathaSetu</strong>. Learn English in Your Language. All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>Built with</span>
            <Heart size={14} color="#e11d48" fill="#e11d48" />
            <span>for learners across India</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
