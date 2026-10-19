import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, BookOpen } from 'lucide-react';

export interface CategoryCardItem {
  id: string;
  name: string;
  nativeTitle: string;
  description: string;
  image: string;
  color: string;
  bgGradient: string;
}

export const POPULAR_CATEGORIES: CategoryCardItem[] = [
  {
    id: 'panchatantra',
    name: 'Panchatantra',
    nativeTitle: 'पंचतंत्र की कहानियाँ',
    description: 'Ancient fables teaching ethics & worldly wisdom through clever animal tales.',
    image: '/assets/cat_panchatantra.jpg',
    color: '#d97706',
    bgGradient: 'linear-gradient(180deg, rgba(254, 243, 199, 0.4) 0%, #ffffff 100%)'
  },
  {
    id: 'akbar-birbal',
    name: 'Akbar & Birbal',
    nativeTitle: 'अकबर और बीरबल',
    description: 'Witty court tales showcasing the extraordinary wit and humor of Raja Birbal.',
    image: '/assets/cat_akbar_birbal.jpg',
    color: '#0284c7',
    bgGradient: 'linear-gradient(180deg, rgba(224, 242, 254, 0.4) 0%, #ffffff 100%)'
  },
  {
    id: 'tenali-raman',
    name: 'Tenali Raman',
    nativeTitle: 'तेनाली रामन',
    description: 'Intellectual brilliance and quick wit from the legendary Vijayanagara court.',
    image: '/assets/cat_tenali_raman.jpg',
    color: '#16a34a',
    bgGradient: 'linear-gradient(180deg, rgba(220, 252, 231, 0.4) 0%, #ffffff 100%)'
  },
  {
    id: 'vikram-betal',
    name: 'Vikram & Betal',
    nativeTitle: 'विक्रम और बेताल',
    description: 'Intriguing philosophical riddles and moral dilemmas posed to King Vikramaditya.',
    image: '/assets/cat_vikram_betal.jpg',
    color: '#7c3aed',
    bgGradient: 'linear-gradient(180deg, rgba(237, 233, 254, 0.4) 0%, #ffffff 100%)'
  },
  {
    id: 'real-life',
    name: 'Real-Life Stories',
    nativeTitle: 'प्रेरक जीवन गाथाएँ',
    description: 'Documented Indian achievements, student journeys, ISRO scientists, and heroes.',
    image: '/assets/cat_real_life.jpg',
    color: '#059669',
    bgGradient: 'linear-gradient(180deg, rgba(209, 250, 229, 0.4) 0%, #ffffff 100%)'
  },
  {
    id: 'indian-folk-tales',
    name: 'Indian Folk Tales',
    nativeTitle: 'भारतीय लोक कथाएँ',
    description: 'Timeless folk stories celebrating community kindness and everyday cleverness.',
    image: '/assets/wordsetu_hero.jpg',
    color: '#ea580c',
    bgGradient: 'linear-gradient(180deg, rgba(255, 237, 213, 0.4) 0%, #ffffff 100%)'
  },
  {
    id: 'adventure',
    name: 'Adventure & Mystery',
    nativeTitle: 'साहस और रोमांच',
    description: 'Thrilling quests, ancient fortress secrets, hidden treasures, and suspense.',
    image: '/assets/cat_vikram_betal.jpg',
    color: '#4f46e5',
    bgGradient: 'linear-gradient(180deg, rgba(238, 242, 255, 0.4) 0%, #ffffff 100%)'
  },
  {
    id: 'moral-stories',
    name: 'Moral Stories',
    nativeTitle: 'नैतिक शिक्षाप्रद कथाएँ',
    description: 'Heartwarming values of honesty, courage, gratitude, and empathy.',
    image: '/assets/cat_panchatantra.jpg',
    color: '#0d9488',
    bgGradient: 'linear-gradient(180deg, rgba(204, 251, 241, 0.4) 0%, #ffffff 100%)'
  },
  {
    id: 'village-stories',
    name: 'Regional Indian Stories',
    nativeTitle: 'गाँव व प्रांतीय कहानियाँ',
    description: 'Rich folklore from Punjab, Bengal, Tamil Nadu, Kerala, Gujarat, and Rajasthan.',
    image: '/assets/cat_akbar_birbal.jpg',
    color: '#b45309',
    bgGradient: 'linear-gradient(180deg, rgba(254, 243, 199, 0.4) 0%, #ffffff 100%)'
  }
];

interface StoryCategoriesProps {
  onSelectCategory: (categoryId: string) => void;
  onViewAllStories: () => void;
}

export const StoryCategories: React.FC<StoryCategoriesProps> = ({
  onSelectCategory,
  onViewAllStories
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 340;
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  return (
    <section className="categories-section" aria-label="Popular Story Categories">
      <div className="categories-header-row">
        <div>
          <div className="section-eyebrow">
            <Sparkles size={14} />
            <span>Discover Multilingual Heritage</span>
          </div>
          <h2 className="categories-title">Popular Story Categories</h2>
          <p className="categories-subtitle">
            Explore enchanting Indian folklore, royal courts, mysteries, and inspiring biographies.
          </p>
        </div>

        <div className="categories-controls">
          <button
            onClick={() => handleScroll('left')}
            className="carousel-arrow-btn"
            aria-label="Scroll Categories Left"
            title="Previous Categories"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => handleScroll('right')}
            className="carousel-arrow-btn"
            aria-label="Scroll Categories Right"
            title="Next Categories"
          >
            <ChevronRight size={20} />
          </button>
          <button
            onClick={onViewAllStories}
            className="view-all-stories-btn"
          >
            <BookOpen size={16} />
            <span>View All Stories</span>
          </button>
        </div>
      </div>

      {/* Horizontal Carousel Track */}
      <div className="categories-carousel-track" ref={scrollContainerRef}>
        {POPULAR_CATEGORIES.map(category => (
          <div
            key={category.id}
            className="category-card"
            onClick={() => onSelectCategory(category.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onSelectCategory(category.id);
              }
            }}
          >
            <div className="category-img-container">
              <img
                src={category.image}
                alt={category.name}
                className="category-img"
                loading="lazy"
              />
              <div className="category-img-overlay" />
              <span className="category-tag-chip" style={{ color: category.color }}>
                {category.name}
              </span>
            </div>

            <div className="category-card-body">
              <h3 className="category-card-title">{category.name}</h3>
              <p className="category-card-native">{category.nativeTitle}</p>
              <p className="category-card-desc">{category.description}</p>
              <div className="category-card-action">
                <span style={{ color: category.color, fontWeight: 700, fontSize: '13px' }}>
                  Read Stories →
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
