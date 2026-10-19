export interface StoryCategory {
  id: string;
  name: string;
  nameHi: string;
  nameTa: string;
  nameMl: string;
  description: string;
  iconName: string;
  color: string;
  badgeBg: string;
  region?: string;
}

export const STORY_CATEGORIES: StoryCategory[] = [
  {
    id: 'real-life',
    name: 'Real-Life Stories',
    nameHi: 'वास्तविक जीवन की कहानियाँ',
    nameTa: 'உண்மைச் சம்பவக் கதைகள்',
    nameMl: 'യഥാർത്ഥ ജീവിത കഥകൾ',
    description: 'Documented Indian achievements, inspiring biographies, student board exams, college life, and fiction inspired by real Indian experiences.',
    iconName: 'HeartHandshake',
    color: '#059669',
    badgeBg: '#d1fae5',
    region: 'Pan-India'
  },
  {
    id: 'panchatantra',
    name: 'Panchatantra Stories',
    nameHi: 'पंचतंत्र की कहानियाँ',
    nameTa: 'பஞ்சதந்திரக் கதைகள்',
    nameMl: 'പഞ്ചതന്ത്ര കഥകൾ',
    description: 'Ancient Indian fables by Pandit Vishnu Sharma teaching worldly wisdom and ethics through animal characters.',
    iconName: 'BookMarked',
    color: '#d97706',
    badgeBg: '#fef3c7',
    region: 'Ancient India'
  },
  {
    id: 'jataka-tales',
    name: 'Jataka Tales',
    nameHi: 'जातक कथाएँ',
    nameTa: 'ஜாதகக் கதைகள்',
    nameMl: 'ജാതക കഥകൾ',
    description: 'Sacred folklore preserving moral virtues and previous lives of the Buddha emphasizing selflessness and truth.',
    iconName: 'Sparkles',
    color: '#b45309',
    badgeBg: '#fef9c3',
    region: 'Ancient Magadha & North India'
  },
  {
    id: 'akbar-birbal',
    name: 'Akbar and Birbal',
    nameHi: 'अकबर और बीरबल',
    nameTa: 'அக்பர் பீர்பால் கதைகள்',
    nameMl: 'അക്ബർ ബീർബൽ കഥകൾ',
    description: 'Legendary witty court tales demonstrating the extraordinary intelligence and quick humor of Raja Birbal.',
    iconName: 'Crown',
    color: '#0284c7',
    badgeBg: '#e0f2fe',
    region: 'Mughal Delhi & Agra'
  },
  {
    id: 'tenali-raman',
    name: 'Tenali Raman',
    nameHi: 'तेनाली रामन',
    nameTa: 'தெனாலிராமன் கதைகள்',
    nameMl: 'തെന്നാലിരാമൻ കഥകൾ',
    description: 'Brilliant intellectual humor and wisdom from the court of Vijayanagara King Krishnadevaraya.',
    iconName: 'Laugh',
    color: '#16a34a',
    badgeBg: '#dcfce7',
    region: 'Vijayanagara & Andhra-Tamil Nadu'
  },
  {
    id: 'vikram-betal',
    name: 'Vikram and Betal',
    nameHi: 'विक्रम और बेताल',
    nameTa: 'விக்ரமாதித்தன் வேதாளம்',
    nameMl: 'വിക്രമാദിത്യനും വേതാളവും',
    description: 'Philosophical riddle stories presented to King Vikramaditya by the celestial vampire spirit Betal.',
    iconName: 'Moon',
    color: '#7c3aed',
    badgeBg: '#ede9fe',
    region: 'Ujjain & Central India'
  },
  {
    id: 'indian-folk-tales',
    name: 'Indian Folk Tales',
    nameHi: 'भारतीय लोक कथाएँ',
    nameTa: 'இந்திய நாட்டுப்புறக் கதைகள்',
    nameMl: 'നാടോടിക്കഥകൾ',
    description: 'Timeless folk stories passed down orally through Indian generations celebrating cleverness and community.',
    iconName: 'Compass',
    color: '#ea580c',
    badgeBg: '#ffedd5',
    region: 'Pan-Indian Traditions'
  },
  {
    id: 'indian-fairy-tales',
    name: 'Indian Fairy Tales',
    nameHi: 'भारतीय परियों की कहानियाँ',
    nameTa: 'இந்திய மாயக்கதைகள்',
    nameMl: 'മാന്ത്രിക കഥകൾ',
    description: 'Enchanting magical tales filled with flying horses, magical gems, enchanted princesses, and brave princes.',
    iconName: 'Wand2',
    color: '#ec4899',
    badgeBg: '#fce7f3',
    region: 'Traditional Folklore'
  },
  {
    id: 'mythology-epics',
    name: 'Mythology and Epics',
    nameHi: 'पौराणिक कथाएँ व महाकाव्य',
    nameTa: 'புராணங்கள் மற்றும் இதிகாசங்கள்',
    nameMl: 'പുരാണ കഥകളും ഇതിഹാസങ്ങളും',
    description: 'Inspirational chapters and moral allegories from the Ramayana, Mahabharata, and classical Puranas.',
    iconName: 'Flame',
    color: '#dc2626',
    badgeBg: '#fee2e2',
    region: 'Pan-Indian Heritage'
  },
  {
    id: 'village-stories',
    name: 'Village Stories',
    nameHi: 'गाँव की कहानियाँ',
    nameTa: 'கிராமப்புறக் கதைகள்',
    nameMl: 'ഗ്രാമീണ കഥകൾ',
    description: 'Heartwarming narratives illustrating the simplicity, honesty, and daily humor of Indian rural life.',
    iconName: 'Home',
    color: '#65a30d',
    badgeBg: '#ecfccb',
    region: 'Rural Heartlands'
  },
  {
    id: 'moral-stories',
    name: 'Moral Stories',
    nameHi: 'नैतिक शिक्षाप्रद कहानियाँ',
    nameTa: 'நீதிக் கதைகள்',
    nameMl: 'ഗുണപാഠ കഥകൾ',
    description: 'Stories imparting foundational human values like honesty, gratitude, loyalty, kindness, and perseverance.',
    iconName: 'HeartHandshake',
    color: '#0d9488',
    badgeBg: '#ccfbf1',
    region: 'Universal Indian Wisdom'
  },
  {
    id: 'childrens-stories',
    name: "Children's Stories",
    nameHi: 'बच्चों की कहानियाँ',
    nameTa: 'சிறுவர் கதைகள்',
    nameMl: 'കുട്ടിക്കഥകൾ',
    description: 'Delightful, simple, and colorful stories designed to develop reading curiosity and imagination for young minds.',
    iconName: 'Baby',
    color: '#f59e0b',
    badgeBg: '#fef3c7',
    region: 'Children Collection'
  },
  {
    id: 'animal-stories',
    name: 'Animal Stories',
    nameHi: 'पशु-पक्षियों की कहानियाँ',
    nameTa: 'விலங்கு மற்றும் பறவை கதைகள்',
    nameMl: 'മൃഗ കഥകൾ',
    description: 'Charming stories where cunning jackals, wise elephants, brave monkeys, and clever crows teach life lessons.',
    iconName: 'Dog',
    color: '#84cc16',
    badgeBg: '#f7fee7',
    region: 'Indian Wildlife Fables'
  },
  {
    id: 'funny-stories',
    name: 'Funny Stories',
    nameHi: 'हास्य व मनोरंजक कहानियाँ',
    nameTa: 'நகைச்சுவைக் கதைகள்',
    nameMl: 'ഹാസ്യ കഥകൾ',
    description: 'Lighthearted comedy, village blunders, and witty retorts to bring a smile to every reader.',
    iconName: 'Smile',
    color: '#f97316',
    badgeBg: '#ffedd5',
    region: 'Humor Traditions'
  },
  {
    id: 'mystery-detective',
    name: 'Mystery and Detective Stories',
    nameHi: 'रहस्य और जासूसी कहानियाँ',
    nameTa: 'துப்பறியும் கதைகள்',
    nameMl: 'രഹസ്യ ഡിറ്റക്ടീവ് കഥകൾ',
    description: 'Puzzling riddles, missing treasures, and sharp Indian investigators resolving intriguing enigmas.',
    iconName: 'Search',
    color: '#475569',
    badgeBg: '#f1f5f9',
    region: 'Literary Mysteries'
  },
  {
    id: 'horror-stories',
    name: 'Horror Stories',
    nameHi: 'डरावनी व रहस्यमयी कहानियाँ',
    nameTa: 'பயமுறுத்தும் கதைகள்',
    nameMl: 'ഭയപ്പെടുത്തുന്ന കഥകൾ',
    description: 'Spooky folklore tales of ancestral banyan trees, mysterious palace spirits, and eerie midnight encounters.',
    iconName: 'Ghost',
    color: '#334155',
    badgeBg: '#e2e8f0',
    region: 'Indian Ghost Lore'
  },
  {
    id: 'adventure-stories',
    name: 'Adventure Stories',
    nameHi: 'रोमांचक साहसिक कहानियाँ',
    nameTa: 'சாகசக் கதைகள்',
    nameMl: 'സാഹസിക കഥകൾ',
    description: 'Thrilling expeditions across the Himalayas, Arabian Sea voyages, dense jungle quests, and royal discoveries.',
    iconName: 'Mountain',
    color: '#2563eb',
    badgeBg: '#eff6ff',
    region: 'Indian Landscapes'
  },
  {
    id: 'friendship-stories',
    name: 'Friendship Stories',
    nameHi: 'सच्ची मित्रता की कहानियाँ',
    nameTa: 'நட்புக் கதைகள்',
    nameMl: 'സൗഹൃദ കഥകൾ',
    description: 'Inspiring chronicles of sacrifice, companionship, and lifelong solidarity across caste, kingdom, and status.',
    iconName: 'Users',
    color: '#06b6d4',
    badgeBg: '#cffafe',
    region: 'Cultural Narratives'
  },
  {
    id: 'family-stories',
    name: 'Family Stories',
    nameHi: 'पारिवारिक कहानियाँ',
    nameTa: 'குடும்பக் கதைகள்',
    nameMl: 'കുടുംബ കഥകൾ',
    description: 'Affectionate stories portraying Indian joint families, bonds between grandparents and grandchildren, and mutual care.',
    iconName: 'Heart',
    color: '#f43f5e',
    badgeBg: '#ffe4e6',
    region: 'Domestic Life'
  },
  {
    id: 'inspirational-stories',
    name: 'Inspirational Stories',
    nameHi: 'प्रेरणादायी कहानियाँ',
    nameTa: 'ஊக்கமளிக்கும் கதைகள்',
    nameMl: 'പ്രചോദനാത്മക കഥകൾ',
    description: 'True and allegorical accounts of overcoming adversity through hard work, education, and resilience.',
    iconName: 'Trophy',
    color: '#eab308',
    badgeBg: '#fef9c3',
    region: 'Inspirational Legacies'
  },
  {
    id: 'historical-stories',
    name: 'Historical Stories',
    nameHi: 'ऐतिहासिक कहानियाँ',
    nameTa: 'வரலாற்றுக் கதைகள்',
    nameMl: 'ചരിത്ര കഥകൾ',
    description: 'Epic narratives of Raja Raja Chola, Ashoka the Great, Rani Lakshmibai, Chhatrapati Shivaji, and Marthanda Varma.',
    iconName: 'Shield',
    color: '#9333ea',
    badgeBg: '#f3e8ff',
    region: 'Historical India'
  },
  {
    id: 'regional-indian',
    name: 'Regional Indian Stories',
    nameHi: 'क्षेत्रीय भारतीय कहानियाँ',
    nameTa: 'வட்டாரக் கதைகள்',
    nameMl: 'പ്രാദേശിക കഥകൾ',
    description: 'Distinct local folklore from Tamil Nadu, Kerala, Bengal, Rajasthan, Punjab, Bihar, Maharashtra, and the Northeast.',
    iconName: 'MapPin',
    color: '#14b8a6',
    badgeBg: '#ccfbf1',
    region: 'Tamil Nadu, Kerala, Bengal, etc.'
  },
  {
    id: 'classic-literature',
    name: 'Famous Classic Literature',
    nameHi: 'प्रसिद्ध शास्त्रीय साहित्य',
    nameTa: 'செவ்வியல் இலக்கியக் கதைகள்',
    nameMl: 'പ്രസിദ്ധ ക്ലാസിക് കൃതികൾ',
    description: 'Adapted masterpieces from Munshi Premchand, Rabindranath Tagore, Subramania Bharati, Vallathol, and classical bards.',
    iconName: 'Library',
    color: '#4f46e5',
    badgeBg: '#e0e7ff',
    region: 'Indian Literature'
  },
  {
    id: 'modern-original',
    name: 'Modern Original Indian Stories',
    nameHi: 'आधुनिक मौलिक भारतीय कहानियाँ',
    nameTa: 'நவீன படைப்புக் கதைகள்',
    nameMl: 'ആധുനിക മൗലിക കഥകൾ',
    description: 'Contemporary tales set in modern Indian cities and tech towns exploring identity, innovation, and change.',
    iconName: 'Zap',
    color: '#6366f1',
    badgeBg: '#eef2ff',
    region: 'Modern India'
  },
  {
    id: 'short-stories',
    name: 'Short Stories',
    nameHi: 'लघुकथाएँ (त्वरित पठन)',
    nameTa: 'குறுகிய கதைகள்',
    nameMl: 'ചെറുകഥകൾ',
    description: 'Quick, punchy 2-to-3-minute stories ideal for busy learners seeking a daily language boost.',
    iconName: 'Clock',
    color: '#10b981',
    badgeBg: '#d1fae5',
    region: 'Short Formats'
  },
  {
    id: 'chapter-books',
    name: 'Long Stories and Chapter Books',
    nameHi: 'दीर्घ कहानियाँ व अध्याय पुस्तकें',
    nameTa: 'நீண்ட அத்தியாயக் கதைகள்',
    nameMl: 'ദൈർഘ്യമേറിയ അധ്യായ പുസ്തകങ്ങൾ',
    description: 'Immersive multi-chapter adventures and epics for in-depth reading practice and vocabulary development.',
    iconName: 'Layers',
    color: '#8b5cf6',
    badgeBg: '#ede9fe',
    region: 'Long Formats'
  }
];

export const CATEGORY_MAP = new Map<string, StoryCategory>(
  STORY_CATEGORIES.map(c => [c.id, c])
);
