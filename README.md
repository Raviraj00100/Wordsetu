# WordSetu 360 — Unlimited English Learning & KathaSetu Multilingual Indian Story Library

> **Empowering learners across India to master English vocabulary and immerse themselves in India's rich storytelling heritage across English, Hindi (हिन्दी), Tamil (தமிழ்), and Malayalam (മലയാളം).**

WordSetu 360 combines a deterministic daily 20-word vocabulary mastery system with **KathaSetu**, an expandable multilingual Indian story discovery and reading platform with authentic folklore, tap-to-translate vocabulary learning, speech synthesis audio, timed reading tests, and administrative batch-import pipelines.

---

## 🌟 10 Core Platform Sections

1. **Home**: Daily learning overview, English dictionary search, daily progress card, 24-hour countdown timer, quick learning hub, and today's 20 words interactive preview.
2. **Daily Words**: Upgraded daily 20-word system with verified definitions, phonetic guides, native translations across 12 Indian languages, two contextual example sentences, and audio pronunciations.
3. **Stories**: Multilingual Indian story discovery engine supporting at least 500 complete stories each in English, Hindi, Tamil, and Malayalam (Total 2,000+ complete stories), covering famous Panchatantra fables, Akbar-Birbal wit, Tenali Raman, Vikram & Betal, and Real-Life Stories.
4. **My Story Wishlist**: Personal saved story collection with one-tap heart buttons on cards and reader, persistent offline storage in IndexedDB, filters, and fast sorting.
5. **Word Search**: Instant English dictionary search with auto-suggestions, phonetic guides, definitions, and native language translations.
6. **Reading Test**: Assessment with short and long passages across Beginner, Intermediate, and Advanced tiers, timed reading with Words-Per-Minute (WPM) calculation, and comprehensive reading quizzes.
7. **Quiz**: Interactive practice quizzes dynamically generated for daily lessons with confetti celebrations and real score tracking.
8. **My Vocabulary**: Unified personal word bank featuring saved daily words, words saved from stories, words mastered, and flashcard-based spaced repetition daily revision.
9. **My Story Shelf**: Personal reading library tracking bookmarked stories, continue reading with exact scroll restoration, completed stories, created drafts, and saved story words.
10. **My Progress**: Comprehensive dashboard displaying learning streaks, vocabulary mastered, stories completed, reading speed (WPM), and personalized story recommendations.
11. **Settings & Admin**: Reader typography defaults, audio speech speed, full database backup/restore (JSON), and passcode-protected administrator controls with batch pipeline runner.

---

## 📚 KathaSetu — 25 Indian Story Categories

- Panchatantra Stories (Pandit Vishnu Sharma fables)
- Jataka Tales (Moral Buddhist folklore)
- Akbar and Birbal (Mughal court wit and wisdom)
- Tenali Raman (Vijayanagara intellectual humor)
- Vikram and Betal (King Vikramaditya riddles)
- Indian Folk Tales (Pan-Indian oral traditions)
- Indian Fairy Tales (Enchanted Indian legends)
- Mythology and Epics (Ramayana, Mahabharata, Puranas)
- Village Stories (Rural simplicity and community life)
- Moral Stories (Values of truth, gratitude, and ethics)
- Children's Stories (Curiosity and imagination)
- Animal Stories (Wildlife fables)
- Funny Stories (Humorous anecdotes and witty retorts)
- Mystery and Detective Stories (Riddles and historical enigmas)
- Horror Stories (Palace spirits and spooky folklore)
- Adventure Stories (Himalayas, ocean voyages, and jungle quests)
- Friendship Stories (Companionship and loyalty)
- Family Stories (Grandparents, joint families, and bonds)
- Inspirational Stories (Overcoming adversity through resilience)
- Historical Stories (Raja Raja Chola, Velu Nachiyar, Ashoka, etc.)
- Regional Indian Stories (Tamil Nadu, Kerala, Bengal, Rajasthan, Punjab, etc.)
- Famous Classic Literature (Premchand, Tagore, Subramania Bharati, etc.)
- Modern Original Indian Stories (Contemporary Indian tales)
- Short Stories (2-3 minute quick reads)
- Long Stories and Chapter Books (In-depth multi-chapter reading)

---

## 🛠 Tech Stack & Architecture

- **Frontend**: React 19 + TypeScript + Vite
- **Storage & Database**: Native IndexedDB (`WordSetu360_DB`) for high-capacity, persistent offline storage of thousands of complete stories, reading progress, quizzes, and vocabulary cards.
- **Audio**: Web Speech API Text-to-Speech (TTS) with language voice matching (`en-IN`, `hi-IN`, `ta-IN`, `ml-IN`) and Web Audio API tone synthesis fallback.
- **Typography**: Plus Jakarta Sans, Outfit, and Google Noto Fonts for Devanagari, Tamil, and Malayalam scripts.
- **Styling**: Vanilla CSS Design System with glassmorphism, responsive grids, and zero horizontal overflow on mobile screens.

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/Raviraj00100/Wordsetu.git

# Navigate to project directory
cd Wordsetu

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```
