import React, { useState, useRef, useEffect } from 'react';
import { Search, X, History, Sparkles, ArrowRight } from 'lucide-react';
import { DictionaryService } from '../utils/dictionaryService';

interface SearchBarProps {
  onSearch: (word: string) => void;
  isLoading?: boolean;
  initialQuery?: string;
  autoFocus?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  isLoading = false,
  initialQuery = '',
  autoFocus = false
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHistory(DictionaryService.getSearchHistory());
  }, []);

  useEffect(() => {
    if (query.trim().length >= 1) {
      const matched = DictionaryService.getSuggestions(query);
      setSuggestions(matched);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = query.trim();
    if (!clean) return;
    setShowDropdown(false);
    onSearch(clean);
  };

  const handleSelectSuggestion = (word: string) => {
    setQuery(word);
    setShowDropdown(false);
    onSearch(word);
  };

  const handleClearHistory = () => {
    DictionaryService.clearSearchHistory();
    setHistory([]);
  };

  return (
    <div className="search-bar-container" ref={wrapperRef}>
      <form className="search-bar-form" onSubmit={handleSubmit}>
        <div className="search-input-box">
          <Search size={20} className="search-bar-icon" />

          <input
            type="text"
            className="search-bar-field"
            placeholder="Search any English word..."
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            autoFocus={autoFocus}
            disabled={isLoading}
          />

          {query && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => {
                setQuery('');
                setSuggestions([]);
              }}
              title="Clear search input"
              aria-label="Clear input"
            >
              <X size={18} />
            </button>
          )}

          <button
            type="submit"
            className="search-submit-btn"
            disabled={isLoading || !query.trim()}
          >
            {isLoading ? (
              <span className="search-loading-spinner" />
            ) : (
              <>
                <span>Search</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Auto-suggestions & History Dropdown */}
      {showDropdown && (suggestions.length > 0 || history.length > 0) && (
        <div className="search-dropdown-menu">
          {suggestions.length > 0 && (
            <div className="search-dropdown-section">
              <div className="search-dropdown-label">
                <Sparkles size={13} color="#2563eb" />
                <span>Suggestions</span>
              </div>
              <div className="search-dropdown-list">
                {suggestions.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="search-dropdown-item"
                    onClick={() => handleSelectSuggestion(item)}
                  >
                    <Search size={14} color="#94a3b8" />
                    <span>{item}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {history.length > 0 && (
            <div className="search-dropdown-section" style={{ borderTop: suggestions.length > 0 ? '1px solid #f1f5f9' : 'none' }}>
              <div className="search-dropdown-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <History size={13} color="#64748b" />
                  <span>Recent Searches</span>
                </div>
                <button
                  type="button"
                  onClick={handleClearHistory}
                  style={{
                    fontSize: '11px',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    background: 'none',
                    border: 'none'
                  }}
                >
                  Clear History
                </button>
              </div>
              <div className="search-history-pills">
                {history.map((histWord, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="search-history-chip"
                    onClick={() => handleSelectSuggestion(histWord)}
                  >
                    {histWord}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quick Search Ideas Strip */}
      <div className="search-hints-strip">
        <span className="search-hints-label">Try searching:</span>
        <button
          type="button"
          className="search-hint-link"
          onClick={() => handleSelectSuggestion('Beautiful')}
        >
          Beautiful
        </button>
        <span className="search-hint-sep">•</span>
        <button
          type="button"
          className="search-hint-link"
          onClick={() => handleSelectSuggestion('Courage')}
        >
          Courage
        </button>
        <span className="search-hint-sep">•</span>
        <button
          type="button"
          className="search-hint-link"
          onClick={() => handleSelectSuggestion('Wisdom')}
        >
          Wisdom
        </button>
        <span className="search-hint-sep">•</span>
        <button
          type="button"
          className="search-hint-link"
          onClick={() => handleSelectSuggestion('Serendipity')}
        >
          Serendipity
        </button>
        <span className="search-hint-sep">•</span>
        <button
          type="button"
          className="search-hint-link"
          onClick={() => handleSelectSuggestion('Gratitude')}
        >
          Gratitude
        </button>
      </div>
    </div>
  );
};
