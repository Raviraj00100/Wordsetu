import React, { useState } from 'react';
import { Sparkles, BookOpen, Save, Send, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Story, StoryLanguage, StoryDifficulty } from '../../types/story';
import { STORY_CATEGORIES } from '../../data/storyCategories';
import { kathaSetuDb } from '../../services/db';

interface CreateStoryViewProps {
  onStorySaved?: (story: Story) => void;
  onBrowseLibrary?: () => void;
}

export const CreateStoryView: React.FC<CreateStoryViewProps> = ({
  onStorySaved,
  onBrowseLibrary
}) => {
  const [language, setLanguage] = useState<StoryLanguage>('en');
  const [category, setCategory] = useState<string>('panchatantra');
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<StoryDifficulty>('intermediate');
  const [storyLength, setStoryLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [characters, setCharacters] = useState('');
  const [setting, setSetting] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedStory, setGeneratedStory] = useState<Story | null>(null);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  const handleGenerateStory = async () => {
    if (!topic.trim()) {
      alert('Please enter a story topic or moral theme.');
      return;
    }

    setIsGenerating(true);
    setSaveSuccessMessage(null);

    // Simulate authentic Indian cultural narrative generation
    setTimeout(() => {
      const catObj = STORY_CATEGORIES.find(c => c.id === category) || STORY_CATEGORIES[0];
      const charList = characters.trim() ? characters.split(',').map(c => c.trim()) : ['Anand', 'Grandmother Savitri'];
      const location = setting.trim() || 'A peaceful riverside village in Southern India';

      let title = '';
      let content = '';
      let moral = topic;

      if (language === 'en') {
        title = `The Legend of ${charList[0]} and the ${topic}`;
        content = `In ${location}, there lived ${charList.join(' and ')}. It was a time when the rhythms of nature guided every household, and the wisdom of the elders was held in deep reverence.

One day, a peculiar circumstance arose surrounding ${topic.toLowerCase()}. Many villagers debated how best to resolve the matter, but their hasty opinions caused confusion and unease.

${charList[0]} paused to reflect on the teachings passed down through generations. Instead of acting out of anger or haste, ${charList[0]} observed the situation with quiet discernment.

Through selfless dedication and practical intelligence, the obstacle was resolved harmoniously. The entire community came to realize that ${topic.toLowerCase()} holds the key to lasting peace and happiness.

Ever since that day, travelers passing through ${location} hear the elders share this story, reminding every listener that true strength lies in virtue and thoughtful action.`;
      } else if (language === 'hi') {
        title = `${charList[0]} और ${topic} की प्रेरणादायी कथा`;
        content = `${location} में ${charList.join(' और ')} निवास करते थे। वह समय ऐसा था जब गाँव के लोग आपसी सद्भाव और नैतिक मूल्यों को सर्वोपरि मानते थे।

एक दिन ${topic} को लेकर एक गंभीर समस्या उत्पन्न हो गई। सभी लोग चिंतित थे और कोई उपाय नहीं सूझ रहा था।

तब ${charList[0]} ने धैर्य और सूझबूझ का परिचय दिया। बिना किसी स्वार्थ के, उन्होंने पूरे गाँव के हित में ऐसा निर्णय लिया जिससे सभी चकित रह गए।

इस प्रकार समस्या का सुखद समाधान हुआ और सबने यह स्वीकार किया कि ${topic} ही जीवन की वास्तविक सफलता का मार्ग है।`;
      } else if (language === 'ta') {
        title = `${charList[0]} மற்றும் ${topic} பற்றிய கதை`;
        content = `${location} என்ற எழில்மிகு பகுதியில் ${charList.join(' மற்றும் ')} வாழ்ந்து வந்தனர். அறநெறியும் அன்பும் நிறைந்த வாழ்வை அவர்கள் போற்றி வந்தனர்.

ஒருமுறை ${topic} குறித்து ஒரு சவால் எழுந்தது. ஊர் மக்கள் பலரும் என்ன செய்வதென்று அறியாமல் தவித்தனர்.

அப்போது ${charList[0]} தன் நுண்ணறிவாலும் அமைதியான மனநிலோயாலும் நல்வழியைத் தேர்ந்தெடுத்தார். தன்னலமற்ற அவரது செயல் ஊருக்கே பெருமை சேர்த்தது.

அறிவும் நற்பண்பும் சேர்ந்தால் எந்தச் சிக்கலையும் தீர்க்கலாம் என்பதை அனைவரும் உணர்ந்தனர்.`;
      } else {
        title = `${charList[0]} - ${topic} എന്ന ഗുണപാഠകഥ`;
        content = `${location} എന്ന മനോഹരമായ നാട്ടിൽ ${charList.join(' എന്നിവർ ')} താമസിച്ചിരുന്നു. ഗ്രാമത്തിലെ എല്ലാവരും സ്നേഹത്തോടും പരസ്പര ബഹുമാനത്തോടും കൂടിയാണ് കഴിഞ്ഞിരുന്നത്.

ഒരിക്കൽ ${topic} സംബന്ധിച്ച് വലിയൊരു പ്രതിസന്ധി ഉണ്ടായി. നാട്ടുകാർ പരിഭ്രാന്തരായി.

എന്നാൽ ${charList[0]} ക്ഷമയോടെ കാര്യങ്ങൾ ചിന്തിക്കുകയും ബുദ്ധിപൂർവ്വമായ തീരുമാനത്തിലൂടെ പ്രശ്നത്തിന് പരിഹാരം കാണുകയും ചെയ്തു.

സത്യസന്ധതയും ക്ഷമയും എപ്പോഴും നല്ല ഫലം ചെയ്യുമെന്ന് എല്ലാവർക്കും ബോധ്യമായി.`;
      }

      const newStory: Story = {
        id: `user-story-${Date.now()}`,
        title,
        normalizedTitle: title.toLowerCase().trim(),
        language,
        category,
        shortDescription: `An original ${catObj.name} exploring ${topic}`,
        content,
        author: 'Community Creator (AI Assisted)',
        source: 'WordSetu Original Creator Studio',
        difficulty,
        readingTimeMinutes: storyLength === 'short' ? 2 : storyLength === 'medium' ? 4 : 7,
        coverColor: catObj.color,
        status: 'draft',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        region: location,
        moral,
        characters: charList,
        isAiGenerated: true
      };

      setGeneratedStory(newStory);
      setIsGenerating(false);
    }, 700);
  };

  const handleSaveToShelf = async () => {
    if (!generatedStory) return;
    await kathaSetuDb.saveUserStory(generatedStory);
    setSaveSuccessMessage('Story saved to your private Story Shelf successfully!');
    onStorySaved?.(generatedStory);
  };

  const handleSubmitForReview = async () => {
    if (!generatedStory) return;
    const reviewCopy = { ...generatedStory, status: 'under_review' as const };
    await kathaSetuDb.saveUserStory(reviewCopy);
    await kathaSetuDb.upsertStory(reviewCopy);
    setSaveSuccessMessage('Story submitted for community publishing review!');
    onStorySaved?.(reviewCopy);
  };

  return (
    <div className="container" style={{ maxWidth: '820px', margin: '20px auto 60px' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <span style={{
          fontSize: '12px',
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.8px',
          color: '#7c3aed',
          background: '#ede9fe',
          padding: '4px 14px',
          borderRadius: '9999px'
        }}>
          Creative Writing Studio
        </span>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '30px',
          fontWeight: 800,
          color: '#0f172a',
          marginTop: '8px'
        }}>
          Create Your Own Story
        </h1>
        <p style={{ fontSize: '15px', color: '#64748b', maxWidth: '540px', margin: '4px auto 0' }}>
          Craft original stories inspired by rich Indian storytelling traditions in English, Hindi, Tamil, or Malayalam.
        </p>
      </div>

      <div style={{
        background: '#ffffff',
        borderRadius: '20px',
        border: '1px solid #e2e8f0',
        padding: '28px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
        marginBottom: '32px'
      }}>
        {/* Language Selection */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
            Story Language
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
            {[
              { code: 'en', label: 'English' },
              { code: 'hi', label: 'हिंदी (Hindi)' },
              { code: 'ta', label: 'தமிழ் (Tamil)' },
              { code: 'ml', label: 'മലയാളം (Malayalam)' }
            ].map(l => (
              <button
                key={l.code}
                type="button"
                onClick={() => setLanguage(l.code as StoryLanguage)}
                style={{
                  padding: '10px',
                  borderRadius: '10px',
                  border: `2px solid ${language === l.code ? '#2563eb' : '#e2e8f0'}`,
                  background: language === l.code ? '#eff6ff' : '#ffffff',
                  color: language === l.code ? '#1d4ed8' : '#475569',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category & Genre */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
            Category & Tradition
          </label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: '10px',
              border: '1px solid #cbd5e1',
              fontSize: '14px',
              background: '#ffffff',
              color: '#1e293b'
            }}
          >
            {STORY_CATEGORIES.map(c => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.region})
              </option>
            ))}
          </select>
        </div>

        {/* Topic & Moral Theme */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
            Story Topic or Moral Theme *
          </label>
          <input
            type="text"
            placeholder="e.g. Forgiveness, Courage during adversity, The magic well, Friendship between rivals..."
            value={topic}
            onChange={e => setTopic(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: '10px',
              border: '1px solid #cbd5e1',
              fontSize: '14px',
              background: '#ffffff'
            }}
          />
        </div>

        {/* Characters & Setting */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              Characters (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Aarav, Meera, King Vikram"
              value={characters}
              onChange={e => setCharacters(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '13px'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              Setting / Region (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Backwaters of Kerala, Ancient Magadha, Desert village"
              value={setting}
              onChange={e => setSetting(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '13px'
              }}
            />
          </div>
        </div>

        {/* Difficulty & Length */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              Reading Difficulty
            </label>
            <select
              value={difficulty}
              onChange={e => setDifficulty(e.target.value as StoryDifficulty)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '13px'
              }}
            >
              <option value="beginner">Beginner (Simple Vocabulary)</option>
              <option value="intermediate">Intermediate (Standard)</option>
              <option value="advanced">Advanced (Rich Literary)</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              Story Length
            </label>
            <select
              value={storyLength}
              onChange={e => setStoryLength(e.target.value as 'short' | 'medium' | 'long')}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '13px'
              }}
            >
              <option value="short">Short (2-3 min)</option>
              <option value="medium">Medium (4-5 min)</option>
              <option value="long">Long (6-8 min)</option>
            </select>
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerateStory}
          disabled={isGenerating}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
            color: '#ffffff',
            border: 'none',
            fontSize: '15px',
            fontWeight: 700,
            cursor: isGenerating ? 'wait' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 4px 14px rgba(124, 58, 237, 0.3)'
          }}
        >
          <Sparkles size={18} />
          <span>{isGenerating ? 'Synthesizing Original Story...' : 'Generate Original Story'}</span>
        </button>
      </div>

      {/* Generated Story Preview */}
      {generatedStory && (
        <div style={{
          background: '#ffffff',
          borderRadius: '20px',
          border: '1px solid #e2e8f0',
          padding: '28px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.06)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <span style={{
              fontSize: '11px',
              fontWeight: 800,
              textTransform: 'uppercase',
              background: '#fef3c7',
              color: '#d97706',
              padding: '3px 10px',
              borderRadius: '9999px'
            }}>
              Draft Preview ({generatedStory.language.toUpperCase()})
            </span>
            <span style={{ fontSize: '13px', color: '#64748b' }}>
              {generatedStory.readingTimeMinutes} min read
            </span>
          </div>

          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
            {generatedStory.title}
          </h2>

          <div style={{
            fontSize: '16px',
            lineHeight: 1.8,
            color: '#334155',
            whiteSpace: 'pre-line',
            background: '#f8fafc',
            padding: '20px',
            borderRadius: '14px',
            border: '1px solid #e2e8f0',
            marginBottom: '20px'
          }}>
            {generatedStory.content}
          </div>

          {saveSuccessMessage && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: '#ecfdf5',
              border: '1px solid #bbf7d0',
              padding: '12px 16px',
              borderRadius: '10px',
              color: '#065f46',
              fontSize: '14px',
              marginBottom: '16px'
            }}>
              <CheckCircle2 size={18} />
              <span>{saveSuccessMessage}</span>
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
            <button
              onClick={handleSaveToShelf}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 18px',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                color: '#334155',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <Save size={16} />
              <span>Save to My Shelf</span>
            </button>
            <button
              onClick={handleSubmitForReview}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 20px',
                borderRadius: '10px',
                background: '#2563eb',
                color: '#ffffff',
                border: 'none',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <Send size={16} />
              <span>Submit for Publishing Review</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
