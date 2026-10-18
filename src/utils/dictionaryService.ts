import { CURATED_DICTIONARY, DictionaryEntry, ALL_SUGGESTION_WORDS } from '../data/dictionaryDatabase';
import { VOCABULARY_DATA } from '../data/vocabulary';

export interface SearchResult {
  status: 'success' | 'not_found' | 'error';
  entry?: DictionaryEntry;
  message?: string;
  isExternal?: boolean;
}

const SEARCH_HISTORY_KEY = 'wordsetu_search_history';
const DICT_CACHE_KEY = 'wordsetu_dict_cache';

// Mapping Indian language codes for translation APIs
const LANG_CODE_MAP: Record<string, string> = {
  hi: 'hi',
  ta: 'ta',
  ml: 'ml',
  te: 'te',
  kn: 'kn',
  bn: 'bn',
  mr: 'mr',
  gu: 'gu',
  pa: 'pa',
  or: 'or',
  as: 'as',
  ur: 'ur'
};

export const DictionaryService = {
  /**
   * Get search history from localStorage
   */
  getSearchHistory(): string[] {
    try {
      const data = localStorage.getItem(SEARCH_HISTORY_KEY);
      return data ? JSON.parse(data) : ['beautiful', 'courage', 'wisdom'];
    } catch {
      return ['beautiful', 'courage', 'wisdom'];
    }
  },

  /**
   * Save a word to search history
   */
  addToSearchHistory(word: string): void {
    try {
      const cleanWord = word.trim().toLowerCase();
      if (!cleanWord) return;
      const history = this.getSearchHistory().filter(w => w.toLowerCase() !== cleanWord);
      history.unshift(cleanWord);
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history.slice(0, 8)));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  },

  /**
   * Clear search history
   */
  clearSearchHistory(): void {
    try {
      localStorage.removeItem(SEARCH_HISTORY_KEY);
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  },

  /**
   * Get search suggestions as user types
   */
  getSuggestions(query: string): string[] {
    const q = query.trim().toLowerCase();
    if (!q || q.length < 1) return [];

    const allWordSet = new Set<string>();
    CURATED_DICTIONARY.forEach(item => allWordSet.add(item.word.toLowerCase()));
    VOCABULARY_DATA.forEach(item => allWordSet.add(item.word.toLowerCase()));
    ALL_SUGGESTION_WORDS.forEach(w => allWordSet.add(w.toLowerCase()));

    const list = Array.from(allWordSet);
    return list
      .filter(w => w.startsWith(q) || (q.length >= 3 && w.includes(q)))
      .slice(0, 6);
  },

  /**
   * Fetch translation from MyMemory free API with timeout
   */
  async fetchTranslation(text: string, targetLang: string): Promise<string> {
    try {
      const langPair = `en|${targetLang}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langPair}`;
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const json = await res.json();
        if (json?.responseData?.translatedText) {
          const trans = json.responseData.translatedText.trim();
          // Filter out error strings from MyMemory
          if (!trans.toUpperCase().includes('MYMEMORY') && !trans.toUpperCase().includes('QUERY LENGTH')) {
            return trans;
          }
        }
      }
    } catch {
      // Graceful fallback on network failure or rate limit
    }
    return '';
  },

  /**
   * Search for any word
   */
  async searchWord(query: string, currentLangCode: string = 'hi'): Promise<SearchResult> {
    const q = query.trim().toLowerCase();
    if (!q) {
      return { status: 'not_found', message: 'Please enter an English word to search.' };
    }

    // 1. Check local curated dictionary first
    const curatedMatch = CURATED_DICTIONARY.find(item => item.word.toLowerCase() === q);
    if (curatedMatch) {
      this.addToSearchHistory(curatedMatch.word);
      return { status: 'success', entry: curatedMatch, isExternal: false };
    }

    // 2. Check daily vocabulary dataset
    const dailyMatch = VOCABULARY_DATA.find(item => item.word.toLowerCase() === q);
    if (dailyMatch) {
      this.addToSearchHistory(dailyMatch.word);
      const adaptedEntry: DictionaryEntry = {
        id: `dict-${dailyMatch.id}`,
        word: dailyMatch.word,
        phonetic: dailyMatch.phonetic,
        partOfSpeech: dailyMatch.partOfSpeech,
        englishDefinition: dailyMatch.englishDefinition,
        translations: dailyMatch.translations,
        examples: dailyMatch.examples,
        synonyms: dailyMatch.synonyms,
        antonyms: [],
        source: 'curated'
      };
      return { status: 'success', entry: adaptedEntry, isExternal: false };
    }

    // 3. Check cached API results from localStorage
    try {
      const cachedData = localStorage.getItem(DICT_CACHE_KEY);
      if (cachedData) {
        const cacheMap: Record<string, DictionaryEntry> = JSON.parse(cachedData);
        if (cacheMap[q]) {
          this.addToSearchHistory(cacheMap[q].word);
          return { status: 'success', entry: cacheMap[q], isExternal: true };
        }
      }
    } catch (e) {
      console.warn('Cache read error:', e);
    }

    // 4. Fetch from real external Free Dictionary API
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const dictUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(q)}`;
      const res = await fetch(dictUrl, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.status === 404) {
        return {
          status: 'not_found',
          message: `Word "${query}" was not found in the dictionary. Please check the spelling or try another word like "beautiful", "courage", or "patience".`
        };
      }

      if (!res.ok) {
        return {
          status: 'error',
          message: `Unable to look up "${query}" due to a server response (${res.status}). You can still browse our verified word bank.`
        };
      }

      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) {
        return {
          status: 'not_found',
          message: `No dictionary definition found for "${query}".`
        };
      }

      const primary = data[0];
      const wordTitle = primary.word.charAt(0).toUpperCase() + primary.word.slice(1);

      // Extract pronunciation phonetic
      let phonetic = primary.phonetic || '';
      if (!phonetic && primary.phonetics?.length) {
        const phonWithText = primary.phonetics.find((p: { text?: string }) => p.text);
        if (phonWithText?.text) phonetic = phonWithText.text;
      }
      if (!phonetic) phonetic = `/${q}/`;

      // Extract part of speech & definition
      const firstMeaning = primary.meanings?.[0];
      const partOfSpeech = firstMeaning?.partOfSpeech || 'noun';
      const firstDef = firstMeaning?.definitions?.[0];
      const englishDefinition = firstDef?.definition || 'No definition available.';

      // Extract examples
      let ex1 = firstDef?.example || '';
      let ex2 = firstMeaning?.definitions?.[1]?.example || '';

      if (!ex1) ex1 = `The word "${wordTitle.toLowerCase()}" is commonly used in English conversation.`;
      if (!ex2) ex2 = `Learning how to use "${wordTitle.toLowerCase()}" helps improve your fluency.`;

      // Extract synonyms & antonyms
      const synonyms: string[] = [];
      const antonyms: string[] = [];
      if (firstMeaning?.synonyms) synonyms.push(...firstMeaning.synonyms.slice(0, 4));
      if (firstDef?.synonyms) synonyms.push(...firstDef.synonyms.slice(0, 4));
      if (firstMeaning?.antonyms) antonyms.push(...firstMeaning.antonyms.slice(0, 3));
      if (firstDef?.antonyms) antonyms.push(...firstDef.antonyms.slice(0, 3));

      // Fetch translation into the active selected language
      const targetLang = LANG_CODE_MAP[currentLangCode] || 'hi';
      const wordTranslation = await this.fetchTranslation(wordTitle, targetLang);
      const ex1Translation = await this.fetchTranslation(ex1, targetLang);
      const ex2Translation = await this.fetchTranslation(ex2, targetLang);

      const translations: Record<string, string> = {
        [currentLangCode]: wordTranslation || wordTitle
      };

      const newEntry: DictionaryEntry = {
        id: `api-${q}`,
        word: wordTitle,
        phonetic,
        partOfSpeech,
        englishDefinition,
        translations,
        examples: [
          {
            english: ex1,
            translations: { [currentLangCode]: ex1Translation || '' }
          },
          {
            english: ex2,
            translations: { [currentLangCode]: ex2Translation || '' }
          }
        ],
        synonyms: Array.from(new Set(synonyms)),
        antonyms: Array.from(new Set(antonyms)),
        source: 'api'
      };

      // Save into cache
      try {
        const cachedRaw = localStorage.getItem(DICT_CACHE_KEY);
        const cacheMap = cachedRaw ? JSON.parse(cachedRaw) : {};
        cacheMap[q] = newEntry;
        localStorage.setItem(DICT_CACHE_KEY, JSON.stringify(cacheMap));
      } catch (e) {
        console.warn('Cache write error:', e);
      }

      this.addToSearchHistory(newEntry.word);
      return { status: 'success', entry: newEntry, isExternal: true };

    } catch (err: unknown) {
      console.warn('External Dictionary API error:', err);
      return {
        status: 'error',
        message: `Network connection error while searching "${query}". If offline, you can still search any of our verified entries like "beautiful", "courage", "wisdom", or "patience".`
      };
    }
  }
};
