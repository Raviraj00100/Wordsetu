# WordSetu — Learn English In Your Language

> **Empowering learners across India to master English vocabulary daily through authentic native language translations, reliable 24-hour cycles, and a never-repeat vocabulary engine.**

WordSetu bridges the linguistic gap by providing 10 curated English words every day with accurate native meanings, IPA phonetic guides, natural speech pronunciations, and contextual example sentences translated into **12 Indian languages**.

---

## 🌟 Key Features

### 1. Daily 10 New Words (Never Repeated)
- **Deterministic 24-Hour Cycle**: Exactly 10 words unlocked every 24 hours.
- **Never-Repeat Guarantee**: Persistent lifetime tracking ensures previously assigned words are never recycled into future new daily lessons.
- **Word Identity Normalization**: Case insensitivity and punctuation stripping prevent duplicate headwords (`Learn`, `learn`, and `LEARN` map to the same entry).
- **Graceful Pool Depletion**: Alerts the user when the unassigned pool runs low, and presents an all-mastered celebration screen when the pool is completed.

### 2. Search Any English Word
- Comprehensive English dictionary search bar on both Home and Learn screens.
- Instant search with auto-suggestions, phonetic guides, definitions, and native language meanings.
- Two contextual example sentences with speech audio and translations.
- **Search Isolation**: Searching any word does *not* inflate daily lesson completion metrics or alter the 24-hour countdown.

### 3. Support for 12 Indian Languages
- The platform interface remains in clear, professional English.
- Word definitions, native meanings, contextual sentence translations, and quizzes update across:
  - **Hindi (हिन्दी)**
  - **Tamil (தமிழ்)**
  - **Malayalam (മലയാളം)**
  - **Telugu (తెలుగు)**
  - **Kannada (ಕನ್ನಡ)**
  - **Bengali (বাংলা)**
  - **Marathi (मराठी)**
  - **Gujarati (ગુજરાતી)**
  - **Punjabi (ਪੰਜਾਬੀ)**
  - **Odia (ଓଡ଼ିଆ)**
  - **Assamese (অসমীয়া)**
  - **Urdu (اردو)**

### 4. Interactive Practice & Library
- **Interactive Quizzes**: Multiple-choice quizzes dynamically generated for each lesson with confetti celebrations and real score tracking.
- **Saved Words Library**: Bookmark any daily or searched word to revise anytime with audio pronunciation and filtering.
- **Speech Audio**: Speech synthesis audio for headwords and example sentences.

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm` or `yarn`

### Installation

```bash
# Clone the repository
git clone https://github.com/Raviraj00100/Wordsetu.git

# Navigate to project directory
cd Wordsetu

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173/`.

### Production Build

```bash
npm run build
npm run preview
```

---

## 🛠 Tech Stack

- **Framework**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: TypeScript
- **Icons**: [Lucide React](https://lucide.dev/)
- **Visuals & Confetti**: Canvas Confetti
- **Typography**: Plus Jakarta Sans, Outfit, and Google Noto Fonts for Indian scripts
- **Styling**: Vanilla CSS design system with glassmorphism, responsive grids, and micro-interactions

---

## 📄 License

MIT License. Designed and built for learners across India.
