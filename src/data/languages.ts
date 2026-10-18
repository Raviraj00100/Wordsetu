export interface Language {
  code: string;
  name: string;
  nativeName: string;
  scriptFont?: string;
  region: string;
  speechLang: string;
  accentBadge: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    region: 'North & Central India',
    speechLang: 'hi-IN',
    accentBadge: '🇮🇳 Northern'
  },
  {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    region: 'Tamil Nadu & Puducherry',
    speechLang: 'ta-IN',
    accentBadge: '🇮🇳 Southern'
  },
  {
    code: 'ml',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    region: 'Kerala & Lakshadweep',
    speechLang: 'ml-IN',
    accentBadge: '🇮🇳 Southwestern'
  },
  {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    region: 'Andhra Pradesh & Telangana',
    speechLang: 'te-IN',
    accentBadge: '🇮🇳 South-Central'
  },
  {
    code: 'kn',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    region: 'Karnataka',
    speechLang: 'kn-IN',
    accentBadge: '🇮🇳 Southwestern'
  },
  {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    region: 'West Bengal & Tripura',
    speechLang: 'bn-IN',
    accentBadge: '🇮🇳 Eastern'
  },
  {
    code: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    region: 'Maharashtra & Goa',
    speechLang: 'mr-IN',
    accentBadge: '🇮🇳 Western'
  },
  {
    code: 'gu',
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    region: 'Gujarat & Dadra Nagar Haveli',
    speechLang: 'gu-IN',
    accentBadge: '🇮🇳 Western'
  },
  {
    code: 'pa',
    name: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    region: 'Punjab & Delhi',
    speechLang: 'pa-IN',
    accentBadge: '🇮🇳 Northwestern'
  },
  {
    code: 'or',
    name: 'Odia',
    nativeName: 'ଓଡ଼ିଆ',
    region: 'Odisha',
    speechLang: 'or-IN',
    accentBadge: '🇮🇳 Eastern'
  },
  {
    code: 'as',
    name: 'Assamese',
    nativeName: 'অসমীয়া',
    region: 'Assam & Northeast',
    speechLang: 'as-IN',
    accentBadge: '🇮🇳 Northeastern'
  },
  {
    code: 'ur',
    name: 'Urdu',
    nativeName: 'اردو',
    region: 'Pan-Indian / Telangana / J&K / UP',
    speechLang: 'ur-IN',
    accentBadge: '🇮🇳 Pan-Indian'
  }
];

export const DEFAULT_LANGUAGE = SUPPORTED_LANGUAGES[0]; // Hindi
