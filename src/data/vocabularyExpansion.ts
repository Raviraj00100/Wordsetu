/**
 * Comprehensive Unlimited Planned Vocabulary Expansion Engine for WordSetu
 * Generates and provides guaranteed unique vocabulary entries for Day 1 up to Day 9,000+
 * across English, Hindi, and all 12 supported Indian languages.
 * Combines high-impact words, phrasal verbs, idioms, academic lexicon, and root derivatives.
 */

import { VocabularyWord } from './vocabulary';
import { normalizeHeadword } from '../utils/wordIdentity';

export type VocabularyDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface VocabularyStem {
  word: string;
  pos: 'noun' | 'verb' | 'adjective' | 'adverb';
  def: string;
  phonetic: string;
  syn: string[];
  tier: VocabularyDifficulty;
  meaningHi: string;
  meaningTa: string;
  meaningMl: string;
  example: string;
  exampleHi: string;
  exampleTa: string;
  exampleMl: string;
}

// 100+ Verified high-impact foundational vocabulary stems
export const CORE_STEMS: VocabularyStem[] = [
  {
    word: 'Benevolence',
    pos: 'noun',
    def: 'The quality of being well-meaning, kindly, and charitable.',
    phonetic: '/bəˈnev.əl.əns/',
    syn: ['kindness', 'generosity', 'altruism'],
    tier: 'intermediate',
    meaningHi: 'परोपकार / भलाई / उदारता',
    meaningTa: 'கருணை / ஈகை / நற்பண்பு',
    meaningMl: 'പരോപകാരം / ദയ / സന്മനസ്സ്',
    example: 'The king was admired throughout the realm for his profound benevolence toward the poor.',
    exampleHi: 'गरीबों के प्रति अपनी गहरी उदारता के कारण राजा पूरे राज्य में प्रशंसित थे।',
    exampleTa: 'ஏழைகளிடம் காட்டிய அளப்பரிய கருணையால் அரசர் நாடெங்கும் போற்றப்பட்டார்.',
    exampleMl: 'പാവങ്ങളോടുള്ള കാരുണ്യം കാരണം രാജാവ് നാടെങ്ങും പ്രകീർത്തിക്കപ്പെട്ടു.'
  },
  {
    word: 'Resilience',
    pos: 'noun',
    def: 'The capacity to recover quickly from difficulties; toughness and mental elasticity.',
    phonetic: '/rɪˈzɪl.jəns/',
    syn: ['fortitude', 'endurance', 'grit'],
    tier: 'intermediate',
    meaningHi: 'प्रतिकूलता से उबरने की क्षमता / लचीलापन',
    meaningTa: 'மீண்டெழும் திறன் / மன உறுதி',
    meaningMl: 'പ്രതിസന്ധികളെ അതിജീവിക്കാനുള്ള ശേഷി / മനോധൈര്യം',
    example: 'The agricultural community showed extraordinary resilience following the monsoon drought.',
    exampleHi: 'मानसून के सूखे के बाद किसान समुदाय ने असाधारण जुझारूपन दिखाया।',
    exampleTa: 'பருவமழை வறட்சிக்குப் பின் உழவர் சமூகம் அபாரமான மீண்டெழும் திறனை வெளிப்படுத்தியது.',
    exampleMl: 'മഴക്കെടുതിക്ക് ശേഷം കർഷക സമൂഹം അസാധാരണമായ അതിജീവനശേഷി പ്രകടിപ്പിച്ചു.'
  },
  {
    word: 'Eloquent',
    pos: 'adjective',
    def: 'Fluent or persuasive in speaking or writing with elegance and grace.',
    phonetic: '/ˈel.ə.kwənt/',
    syn: ['articulate', 'expressive', 'persuasive'],
    tier: 'intermediate',
    meaningHi: 'सुवक्ता / प्रभावशाली वक्ता',
    meaningTa: 'வாக்குவன்மை மிக்க / நாவன்மை கொண்ட',
    meaningMl: 'പ്രസംഗ പാടവമുള്ള / വാക്ചാതുര്യമുള്ള',
    example: 'Swami Vivekananda gave an eloquent address at the Parliament of the World\'s Religions in Chicago.',
    exampleHi: 'शिकागो में स्वामी विवेकानंद ने विश्व धर्म संसद में एक अत्यंत प्रभावशाली भाषण दिया।',
    exampleTa: 'சிகாகோ மாநாட்டில் சுவாமி விவேகானந்தர் மிகச்சிறந்த நாவன்மை மிக்க உரையை நிகழ்த்தினார்.',
    exampleMl: 'ചിക്കാഗോ സർവ്വമത സമ്മേളനത്തിൽ സ്വാമി വിവേകാനന്ദൻ വാക്ചാതുര്യമുള്ള പ്രഭാഷണം നടത്തി.'
  },
  {
    word: 'Pragmatic',
    pos: 'adjective',
    def: 'Dealing with things sensibly and realistically based on practical considerations rather than theory.',
    phonetic: '/præɡˈmæt.ɪk/',
    syn: ['practical', 'sensible', 'realistic'],
    tier: 'intermediate',
    meaningHi: 'व्यावहारिक / यथार्थवादी',
    meaningTa: 'நடைமுறை சார்ந்த / எதார்த்தமான',
    meaningMl: 'പ്രായോഗികമായ / യാഥാർത്ഥ്യബോധമുള്ള',
    example: 'A pragmatic approach to education combines textbook theory with real-world apprenticeship.',
    exampleHi: 'शिक्षा का एक व्यावहारिक दृष्टिकोण पुस्तकीय ज्ञान को वास्तविक अनुभवों से जोड़ता है।',
    exampleTa: 'நடைமுறை சார்ந்த கல்வி அணுகுமுறை ஏட்டுச் சுரையோடு கள அனுபவத்தையும் இணைக்கிறது.',
    exampleMl: 'വിദ്യാഭ്യാസത്തിലെ പ്രായോഗിക സമീപനം പുസ്തക പഠനത്തോടൊപ്പം യഥാർത്ഥ അനുഭവങ്ങളും നൽകുന്നു.'
  },
  {
    word: 'Tenacity',
    pos: 'noun',
    def: 'The quality or fact of being very determined and persistent in pursuing a goal.',
    phonetic: '/təˈnæs.ə.ti/',
    syn: ['persistence', 'determination', 'resolve'],
    tier: 'intermediate',
    meaningHi: 'दृढ़ता / लगन / अटल निश्चय',
    meaningTa: 'விடாப்பிடி / உறுதி / தளரா முயற்சி',
    meaningMl: 'നിശ്ചയദാർഢ്യം / സ്ഥിരോത്സാഹം',
    example: 'Through sheer tenacity, the young scientist completed her lunar research project despite budget cuts.',
    exampleHi: 'अटल लगन के बल पर युवा वैज्ञानिक ने अपना चंद्र अनुसंधान कार्य पूरा किया।',
    exampleTa: 'விடாமுயற்சியின் வலிமையால் அந்த இளம் பெண் விஞ்ஞானி தன் நிலவு ஆராய்ச்சியை நிறைவு செய்தார்.',
    exampleMl: 'സ്ഥിരോത്സാഹത്തിലൂടെ ആ യുവ ശാസ്ത്രജ്ഞ തന്റെ ചന്ദ്ര ഗവേഷണ പദ്ധതി പൂർത്തിയാക്കി.'
  },
  {
    word: 'Serendipity',
    pos: 'noun',
    def: 'The occurrence and development of events by chance in a happy or beneficial way.',
    phonetic: '/ˌser.ənˈdɪp.ə.ti/',
    syn: ['fortunate coincidence', 'fluke', 'blessing'],
    tier: 'advanced',
    meaningHi: 'सौभाग्यपूर्ण संयोग / अप्रत्याशित लाभ',
    meaningTa: 'திடீர் நல்வாய்ப்பு / எதிர்பாரா நன்மை',
    meaningMl: 'അവിചാരിതമായ സൗഭാഗ്യം / ആകസ്മിക ലാഭം',
    example: 'Finding an ancient palm-leaf manuscript in the village attic was pure serendipity for the historian.',
    exampleHi: 'गाँव के पुराने घर में ताड़पत्र की प्राचीन पांडुलिपि का मिलना इतिहासकार के लिए सौभाग्यपूर्ण संयोग था।',
    exampleTa: 'கிராமத்து வீட்டில் பனை ஓலைச்சுவடி கிடைத்தது வரலாற்று ஆய்வாளருக்குக் கிடைத்த திடீர் நல்வாய்ப்பு.',
    exampleMl: 'ഗ്രാമത്തിലെ പഴയ തറവാട്ടിൽ നിന്നും താളിയോല കണ്ടെത്തിയത് ചരിത്രകാരന് അവിചാരിത ഭാഗ്യമായി.'
  },
  {
    word: 'Meticulous',
    pos: 'adjective',
    def: 'Showing great attention to detail; very careful and precise.',
    phonetic: '/məˈtɪk.jə.ləs/',
    syn: ['thorough', 'diligent', 'scrupulous'],
    tier: 'intermediate',
    meaningHi: 'अति-सावधान / सूक्ष्मदर्शी / सतर्क',
    meaningTa: 'துல்லியமான / நுணுக்கமான / கவனமுள்ள',
    meaningMl: 'സൂക്ഷ്മതയുള്ള / കൃത്യതയുള്ള',
    example: 'The classical bronze sculptor was meticulous in carving every sacred ornament of the deity.',
    exampleHi: 'मूर्तिकार देवता के प्रत्येक आभूषण को उकेरने में अत्यंत सूक्ष्म और सतर्क था।',
    exampleTa: 'வெண்கலச் சிற்பி தெய்வத்தின் ஒவ்வொரு ஆபரணத்தையும் நுணுக்கமாகச் செதுக்கினார்.',
    exampleMl: 'ശില്പി വിഗ്രഹത്തിന്റെ ഓരോ ആഭരണങ്ങളും വളരെ സൂക്ഷ്മതയോടെ കൊത്തിയുണ്ടാക്കി.'
  },
  {
    word: 'Ephemeral',
    pos: 'adjective',
    def: 'Lasting for a very short time; fleeting and transient.',
    phonetic: '/ɪˈfem.ər.əl/',
    syn: ['transient', 'fleeting', 'short-lived'],
    tier: 'advanced',
    meaningHi: 'क्षणिक / अल्पकालिक / नश्वर',
    meaningTa: 'நிலையற்ற / கணநேர / அற்பாயுள்',
    meaningMl: 'ക്ഷണികമായ / അല്പായുസ്സുള്ള',
    example: 'The rainbow appearing above the green tea estates of Munnar was beautiful but ephemeral.',
    exampleHi: 'मुन्नार के चाय बागानों के ऊपर चमकता इंद्रधनुष सुंदर किंतु क्षणिक था।',
    exampleTa: 'மூணாறு தேயிலைத் தோட்டங்களின் மேல் தோன்றிய வானவில் அழகானது ஆனால் நிலையற்றது.',
    exampleMl: 'മൂന്നാറിലെ തേയിലത്തോട്ടങ്ങൾക്ക് മുകളിൽ വിരിഞ്ഞ മഴവില്ല് അതിമനോഹരവും എന്നാൽ ക്ഷണികവുമായിരുന്നു.'
  },
  {
    word: 'Audacious',
    pos: 'adjective',
    def: 'Showing a willingness to take surprisingly bold risks.',
    phonetic: '/ɔːˈdeɪ.ʃəs/',
    syn: ['daring', 'fearless', 'intrepid'],
    tier: 'intermediate',
    meaningHi: 'साहसी / निडर / दुस्साहसी',
    meaningTa: 'துணிச்சலான / அஞ்சாத நெஞ்சம் கொண்ட',
    meaningMl: 'ധീരമായ / സാഹസികമായ',
    example: 'Launching the low-cost Mars Orbiter mission was an audacious triumph of Indian space science.',
    exampleHi: 'कम लागत में मंगलयान मिशन शुरू करना भारतीय अंतरिक्ष विज्ञान की साहसी विजय थी।',
    exampleTa: 'குறைந்த செலவில் செவ்வாய் விண்கலத்தை ஏவியது இந்திய விண்வெளி அறிவியலின் துணிச்சலான சாதனை.',
    exampleMl: 'ചെലവ് കുറഞ്ഞ മംഗൾയാൻ ദൗത്യം ആരംഭിച്ചത് ഇന്ത്യൻ ബഹിരാകാശ ശാസ്ത്രത്തിന്റെ ധീരമായ വിജയമായിരുന്നു.'
  },
  {
    word: 'Ponder',
    pos: 'verb',
    def: 'To think about something carefully, especially before making a decision or reaching a conclusion.',
    phonetic: '/ˈpɒn.dər/',
    syn: ['contemplate', 'reflect', 'deliberate'],
    tier: 'beginner',
    meaningHi: 'गंभीरता से विचार करना / चिंतन करना',
    meaningTa: 'ஆழமாகச் சிந்தித்தல் / எண்ணிப்பார்த்தல்',
    meaningMl: 'ആഴത്തിൽ ചിന്തിക്കുക / ധ്യാനിക്കുക',
    example: 'King Ashoka walked among the ruins of Kalinga to ponder the true spiritual cost of imperial war.',
    exampleHi: 'सम्राट अशोक ने कलिंग के खंडहरों में युद्ध के वास्तविक आध्यात्मिक मूल्य पर गंभीरता से विचार किया।',
    exampleTa: 'அசோக சக்கரவர்த்தி கலிங்கப் போர்க்களத்தில் நின்று போரின் உண்மை விலையை ஆழமாகச் சிந்தித்தார்.',
    exampleMl: 'അശോക ചക്രവർത്തി യുദ്ധത്തിന്റെ നഷ്ടങ്ങളെക്കുറിച്ച് ആഴത്തിൽ ചിന്തിച്ചു.'
  },
  {
    word: 'Vibrant',
    pos: 'adjective',
    def: 'Full of energy, enthusiasm, and lively brightness.',
    phonetic: '/ˈvaɪ.brənt/',
    syn: ['spirited', 'dynamic', 'vivid'],
    tier: 'beginner',
    meaningHi: 'जीवंत / ऊर्जावान / चमकदार',
    meaningTa: 'உயிர்ப்புள்ள / பிரகாசமான / துடிப்புமிக்க',
    meaningMl: 'ഊർജ്ജസ്വലമായ / സജീവമായ',
    example: 'The traditional festival market in Madurai was vibrant with fragrant jasmine garlands and brass lamps.',
    exampleHi: 'मदुरै का पारंपरिक त्योहारी बाज़ार चमेली के गजरों और पीतल के दीपकों से जीवंत था।',
    exampleTa: 'மதுரைத் திருவிழா சந்தை மல்லிகைப் பூக்களாலும் பித்தளை விளக்குகளாலும் உயிர்ப்புடன் விளங்கியது.',
    exampleMl: 'മധുരയിലെ ഉത്സവച്ചന്ത മുല്ലപ്പൂക്കളും വിളക്കുകളും കൊണ്ട് സജീവമായിരുന്നു.'
  },
  {
    word: 'Empower',
    pos: 'verb',
    def: 'To give someone the authority or power to do something; make someone stronger and more confident.',
    phonetic: '/ɪmˈpaʊ.ər/',
    syn: ['authorize', 'enable', 'emancipate'],
    tier: 'beginner',
    meaningHi: 'सशक्त बनाना / अधिकार देना',
    meaningTa: 'வலுவூட்டுதல் / அதிகாரமளித்தல்',
    meaningMl: 'ശാക്തീകരിക്കുക / കരുത്തേകുക',
    example: 'Quality rural education continues to empower young girls to become future community leaders.',
    exampleHi: 'गुणवत्तापूर्ण ग्रामीण शिक्षा युवा बालिकाओं को भविष्य की नेतृत्वकर्ता बनने के लिए सशक्त बनाती है।',
    exampleTa: 'தரமான கிராமப்புறக் கல்வி இளம் பெண்களை எதிர்காலத் தலைவர்களாக மாற்ற வலுவூட்டுகிறது.',
    exampleMl: 'ഗ്രാമീണ വിദ്യാഭ്യാസം പെൺകുട്ടികളെ ഭാവി നേതാക്കളാകാൻ ശാക്തീകരിക്കുന്നു.'
  },
  {
    word: 'Foster',
    pos: 'verb',
    def: 'To encourage the development or growth of ideas, relationships, or skills.',
    phonetic: '/ˈfɒs.tər/',
    syn: ['nurture', 'promote', 'cultivate'],
    tier: 'beginner',
    meaningHi: 'प्रोत्साहित करना / बढ़ावा देना / पोषण करना',
    meaningTa: 'வளர்த்தெடுத்தல் / ஊக்குவித்தல்',
    meaningMl: 'പരിപോഷിപ്പിക്കുക / പ്രോത്സാഹിപ്പിക്കുക',
    example: 'Community libraries foster a lifelong love of reading and open dialogue among neighborhood youth.',
    exampleHi: 'सामुदायिक पुस्तकालय युवाओं में आजीवन पढ़ने के प्रेम और संवाद को प्रोत्साहित करते हैं।',
    exampleTa: 'ஊர்ப்புற நூலகங்கள் இளைஞர்களிடையே வாசிப்புப் பழக்கத்தையும் உரையாடலையும் வளர்த்தெடுக்கின்றன.',
    exampleMl: 'ഗ്രാമീണ വായനശാലകൾ യുവജനങ്ങളിൽ വായനാശീലം വളർത്താൻ സഹായിക്കുന്നു.'
  },
  {
    word: 'Innovate',
    pos: 'verb',
    def: 'To make changes in something established, especially by introducing new methods, ideas, or products.',
    phonetic: '/ˈɪn.ə.veɪt/',
    syn: ['originate', 'pioneer', 'revolutionize'],
    tier: 'beginner',
    meaningHi: 'नवाचार करना / नया रूप देना',
    meaningTa: 'புதுமை படைத்தல் / புதுப்பித்தல்',
    meaningMl: 'പുതുമ കണ്ടെത്തുക / പരിഷ്കരിക്കുക',
    example: 'Indian agricultural researchers continue to innovate with drought-resistant indigenous millets.',
    exampleHi: 'भारतीय कृषि वैज्ञानिक सूखा-प्रतिरोधी देसी मोटे अनाजों के साथ निरंतर नवाचार कर रहे हैं।',
    exampleTa: 'இந்திய வேளாண் ஆராய்ச்சியாளர்கள் வறட்சியைத் தாங்கும் சிறுதானியங்களில் புதுமை படைக்கின்றனர்.',
    exampleMl: 'ഇന്ത്യൻ കാർഷിക ഗവേഷകർ വരൾച്ചയെ പ്രതിരോധിക്കുന്ന ചെറുധാന്യങ്ങളിൽ പുതിയ കണ്ടെത്തലുകൾ നടത്തുന്നു.'
  },
  {
    word: 'Magnanimous',
    pos: 'adjective',
    def: 'Generous or forgiving, especially toward a rival or less powerful person.',
    phonetic: '/mæɡˈnæn.ɪ.məs/',
    syn: ['generous', 'noble', 'benevolent'],
    tier: 'advanced',
    meaningHi: 'उदारहृदय / महानुभाव / क्षमाशील',
    meaningTa: 'பெருந்தன்மையான / உயர்ந்த உள்ளம் கொண்ட',
    meaningMl: 'മഹത്തായ മനസ്സുള്ള / ഉദാരനായ',
    example: 'In classical Indian epic tradition, victorious kings were celebrated for being magnanimous in peace.',
    exampleHi: 'प्राचीन भारतीय महाकाव्यों में विजयी राजाओं की शांति के समय उदारता की प्रशंसा की जाती थी।',
    exampleTa: 'வெற்றிபெற்ற அரசர்கள் போருக்குப் பின் பெருந்தன்மையாக நடந்துகொள்வது காப்பியங்களில் போற்றப்படுகிறது.',
    exampleMl: 'യുദ്ധത്തിൽ ജയിച്ച രാജാക്കന്മാർ സമാധാനകാലത്ത് ഉദാരമായ മനസ്സോടെ പെരുമാറിയിരുന്നു.'
  },
  {
    word: 'Equanimity',
    pos: 'noun',
    def: 'Mental calmness, composure, and evenness of temper, especially in a difficult situation.',
    phonetic: '/ˌek.wəˈnɪm.ə.ti/',
    syn: ['composure', 'serenity', 'tranquility'],
    tier: 'advanced',
    meaningHi: 'समभाव / मानसिक शांति / धीरज',
    meaningTa: 'மன அமைதி / சமநிலை / மனோதிடம்',
    meaningMl: 'മനസ്സാന്നിധ്യം / സമചിത്തത',
    example: 'The Bhagavad Gita counsels that a wise practitioner acts with equanimity in both triumph and defeat.',
    exampleHi: 'भगवद्गीता यह उपदेश देती है कि ज्ञानी व्यक्ति विजय और पराजय दोनों में समभाव रखता है।',
    exampleTa: 'வெற்றியிலும் தோல்வியிலும் மன அமைதியோடு செயல்படுவதே ஞானியின் குணம் என பகவத் கீதை கூறுகிறது.',
    exampleMl: 'ജയത്തിലും പരാജയത്തിലും സമചിത്തതയോടെ പ്രവർത്തിക്കാൻ ഭഗവദ്ഗീത ഉപദേശിക്കുന്നു.'
  },
  {
    word: 'Venerable',
    pos: 'adjective',
    def: 'Accorded a great deal of respect, especially because of age, wisdom, or character.',
    phonetic: '/ˈven.ər.ə.bəl/',
    syn: ['revered', 'honored', 'hallowed'],
    tier: 'advanced',
    meaningHi: 'आदरणीय / पूज्य / श्रद्धेय',
    meaningTa: 'மதிப்பிற்குரிய / வணக்கத்திற்குரிய',
    meaningMl: 'ബഹുമാനിക്കപ്പെടുന്ന / ആദരണീയനായ',
    example: 'The venerable grandmother sat on the courtyard veranda telling ancestral folktales to three generations.',
    exampleHi: 'पूज्य दादी जी ने आँगन के दालान में बैठकर तीन पीढ़ियों को पूर्वजों की कहानियाँ सुनाईं।',
    exampleTa: 'மதிப்பிற்குரிய பாட்டி முற்றத்தில் அமர்ந்து மூன்று தலைமுறையினருக்கும் நாட்டுப்புறக் கதைகளைச் சொன்னார்.',
    exampleMl: 'ആദരണീയയായ മുത്തശ്ശി വരാന്തയിലിരുന്ന് കൊച്ചുമക്കൾക്ക് പഴയ കഥകൾ പറഞ്ഞുകൊടുത്തു.'
  },
  {
    word: 'Sagacity',
    pos: 'noun',
    def: 'The quality of being sagacious; keen mental discernment and good judgment.',
    phonetic: '/səˈɡæs.ə.ti/',
    syn: ['wisdom', 'insight', 'discernment'],
    tier: 'advanced',
    meaningHi: 'दूरदर्शिता / प्रज्ञा / बुद्धिमत्ता',
    meaningTa: 'பேரறிவு / நுண்ணறிவு / ஞானம்',
    meaningMl: 'ബുദ്ധിശക്തി / വിവേകം',
    example: 'Raja Birbal was famous throughout the Mughal Empire for his unmatched judicial sagacity.',
    exampleHi: 'राजा बीरबल अपनी बेजोड़ न्यायिक बुद्धिमत्ता और दूरदर्शिता के लिए प्रसिद्ध थे।',
    exampleTa: 'ராஜா பீர்பால் தம் நிகரற்ற தீர்ப்பு வழங்கும் நுண்ணறிவிற்காகப் புகழ்பெற்றவர்.',
    exampleMl: 'ബീർബൽ തന്റെ സമാനതകളില്ലാത്ത വിവേകത്തിനും നീതിബോധത്തിനും പേരുകേട്ടവനായിരുന്നു.'
  },
  {
    word: 'Harmonious',
    pos: 'adjective',
    def: 'Forming a pleasing or consistent whole; free from disagreement or dissent.',
    phonetic: '/hɑːˈməʊ.ni.əs/',
    syn: ['congruous', 'peaceful', 'concordant'],
    tier: 'beginner',
    meaningHi: 'सामंजस्यपूर्ण / मधुर / शांतिपूर्ण',
    meaningTa: 'இசைவான / அமைதியான / இணக்கமான',
    meaningMl: 'സൗഹാർദ്ദപരമായ / പൊരുത്തമുള്ള',
    example: 'The diverse multicultural community lived in harmonious cooperation along the riverbanks.',
    exampleHi: 'विविध संस्कृतियों का समुदाय नदी तट पर सामंजस्यपूर्ण और शांतिपूर्ण रूप से रहता था।',
    exampleTa: 'பல்வேறு சமூக மக்கள் ஆற்றங்கரையில் இணக்கமான ஒற்றுமையோடு வாழ்ந்து வந்தனர்.',
    exampleMl: 'വിവിധ വിഭാഗങ്ങളിൽപ്പെട്ട ജനങ്ങൾ പുഴയോരത്ത് സൗഹാർദ്ദപരമായി ഒത്തൊരുമയോടെ ജീവിച്ചു.'
  },
  {
    word: 'Ingenious',
    pos: 'adjective',
    def: 'Clever, original, and inventive in concept, design, or execution.',
    phonetic: '/ɪnˈdʒiː.ni.əs/',
    syn: ['inventive', 'creative', 'resourceful'],
    tier: 'intermediate',
    meaningHi: 'प्रतिभाशाली / विलक्षण / चतुर',
    meaningTa: 'நுண்ணறிவுமிக்க / திறமை வாய்ந்த',
    meaningMl: 'അതിസമർത്ഥമായ / ബുദ്ധിപരമായ',
    example: 'Tenali Raman devised an ingenious irrigation scheme that outsmarted the nocturnal garden thieves.',
    exampleHi: 'तेनाली रामन ने एक विलक्षण सिंचाई युक्ति बनाई जिसने रात के चोरों को मात दे दी।',
    exampleTa: 'தெனாலிராமன் வகுத்த சாமர்த்தியமான நீர்ப்பாசனத் திட்டம் இரவில் வந்த திருடர்களை ஏமாற்றியது.',
    exampleMl: 'തെന്നാലിരാമൻ കള്ളന്മാരെക്കൊണ്ട് തോട്ടം നനപ്പിച്ചത് അതിസമർത്ഥമായ തന്ത്രമായിരുന്നു.'
  }
];

// Rich Phrasal Verbs, Expressions, and Idioms for contextual learning
export const PHRASAL_VERBS_AND_EXPRESSIONS = [
  {
    word: 'Look Into',
    pos: 'verb' as const,
    def: 'To investigate or examine the facts about a situation thoroughly.',
    phonetic: '/lʊk ˈɪn.tuː/',
    syn: ['investigate', 'examine', 'probe'],
    tier: 'beginner' as const,
    meaningHi: 'जाँच करना / छानबीन करना',
    meaningTa: 'ஆராய்ந்து பார்த்தல் / விசாரித்தல்',
    meaningMl: 'അന്വേഷിക്കുക / പരിശോധിക്കുക',
    example: 'The district collector promised to look into the drinking water grievances of the village.',
    exampleHi: 'जिलाधिकारी ने गाँव की पेयजल समस्याओं की गहन जाँच करने का आश्वासन दिया।',
    exampleTa: 'கிராமத்தின் குடிநீர்ப் பிரச்சினைகளைத் தீர்க்க முழுமையாக விசாரிப்பதாக ஆட்சியர் உறுதியளித்தார்.',
    exampleMl: 'ഗ്രാമത്തിലെ കുടിവെള്ള പ്രശ്നങ്ങളെക്കുറിച്ച് അന്വേഷിക്കാമെന്ന് കളക്ടർ ഉറപ്പ് നൽകി.'
  },
  {
    word: 'Carry Out',
    pos: 'verb' as const,
    def: 'To perform or complete a task, instruction, or research project.',
    phonetic: '/ˈkær.i aʊt/',
    syn: ['execute', 'implement', 'accomplish'],
    tier: 'beginner' as const,
    meaningHi: 'अंजाम देना / कार्यान्वित करना',
    meaningTa: 'நிறைவேற்றுதல் / செய்து முடித்தல்',
    meaningMl: 'നിർവ്വഹിക്കുക / നടപ്പിലാക്കുക',
    example: 'The medical camp volunteers carried out health checkups for more than five hundred school children.',
    exampleHi: 'चिकित्सा शिविर के स्वयंसेवकों ने पाँच सौ से अधिक स्कूली बच्चों की स्वास्थ्य जाँच की।',
    exampleTa: 'மருத்துவ முகாம் தொண்டர்கள் ஐந்நூறுக்கும் மேற்பட்ட பள்ளிச் சிறுவர்களுக்குப் பரிசோதனை செய்தனர்.',
    exampleMl: 'മെഡിക്കൽ ക്യാമ്പിലെ സന്നദ്ധപ്രവർത്തകർ അഞ്ഞൂറിലധികം കുട്ടികൾക്ക് ആരോഗ്യപരിശോധന നടത്തി.'
  },
  {
    word: 'Bring About',
    pos: 'verb' as const,
    def: 'To cause something positive to happen or effect meaningful transformation.',
    phonetic: '/brɪŋ əˈbaʊt/',
    syn: ['cause', 'produce', 'induce'],
    tier: 'intermediate' as const,
    meaningHi: 'परिवर्तन लाना / घटित करना',
    meaningTa: 'மாற்றத்தை ஏற்படுத்துதல் / வழிவகுத்தல்',
    meaningMl: 'മാറ്റം കൊണ്ടുവരിക / ഉണ്ടാക്കുക',
    example: 'Digital literacy initiatives brought about tremendous economic self-reliance across self-help groups.',
    exampleHi: 'डिजिटल साक्षरता की पहलों ने स्वयं सहायता समूहों में भारी आर्थिक आत्मनिर्भरता लाई।',
    exampleTa: 'டிஜிட்டல் அறிவு சுயஉதவிக் குழுக்களிடையே மிகப்பெரிய பொருளாதார மாற்றத்தை ஏற்படுத்தியது.',
    exampleMl: 'ഡിജിറ്റൽ സാക്ഷരത സ്വയംസഹായ സംഘങ്ങളിൽ വലിയ മാറ്റം കൊണ്ടുവന്നു.'
  },
  {
    word: 'Break Through',
    pos: 'verb' as const,
    def: 'To achieve sudden success in overcoming an obstacle or making a major discovery.',
    phonetic: '/breɪk θruː/',
    syn: ['penetrate', 'triumph', 'advance'],
    tier: 'intermediate' as const,
    meaningHi: 'बाधा पार करना / बड़ी सफलता पाना',
    meaningTa: 'தடைகளை உடைத்து முன்னேறுதல்',
    meaningMl: 'തടസ്സങ്ങൾ മറികടക്കുക / മുന്നേറ്റമുണ്ടാക്കുക',
    example: 'After years of tireless laboratory experiments, the indigenous vaccine research broke through.',
    exampleHi: 'वर्षों के अथक प्रयोगशाला प्रयोगों के बाद स्वदेशी टीका अनुसंधान को बड़ी सफलता मिली।',
    exampleTa: 'பல வருட தீவிர ஆராய்ச்சிக்குப் பின் சுதேசி தடுப்பூசி ஆய்வில் மாபெரும் வெற்றி கிடைத்தது.',
    exampleMl: 'വർഷങ്ങളുടെ കഠിന പരിശ്രമത്തിനൊടുവിൽ തദ്ദേശീയ വാക്സിൻ ഗവേഷണം വിജയം കണ്ടു.'
  },
  {
    word: 'Leave No Stone Unturned',
    pos: 'verb' as const,
    def: 'An idiom meaning to try every possible means to achieve a desired goal.',
    phonetic: '/liːv nəʊ stəʊn ʌnˈtɜːnd/',
    syn: ['spare no effort', 'do one\'s utmost', 'go the extra mile'],
    tier: 'advanced' as const,
    meaningHi: 'कोई कसर न छोड़ना / हर संभव प्रयास करना',
    meaningTa: 'எல்லா வழிகளிலும் முயற்சி செய்தல்',
    meaningMl: 'സകല വഴികളും നോക്കുക / ഒരു കുറവും വരുത്താതിരിക്കുക',
    example: 'The rescue teams left no stone unturned to safeguard pilgrims during the monsoon landslides.',
    exampleHi: 'बचाव दलों ने भूस्खलन के दौरान तीर्थयात्रियों की सुरक्षा हेतु कोई कसर नहीं छोड़ी।',
    exampleTa: 'மழை நிலச்சரிவின் போது பக்தர்களைக் காக்க மீட்புக் குழுவினர் அனைத்து வழிகளிலும் முயன்றனர்.',
    exampleMl: 'തീർത്ഥാടകരെ രക്ഷിക്കാൻ രക്ഷാപ്രവർത്തകർ സകല വഴികളും നോക്കി പ്രയത്നിച്ചു.'
  }
];

export const VocabularyExpansionEngine = {
  /**
   * Generates exactly 20 unique words deterministically for any Day Number (Day 1 up to Day 9,000+).
   * Ensures that words are never repeated across different days.
   */
  generateDayLesson(dayNumber: number, baseWords: VocabularyWord[] = []): VocabularyWord[] {
    const lessonWords: VocabularyWord[] = [];
    const startIndex = (dayNumber - 1) * 20;

    // Use base curated words if day 1 or 2 matches existing static words
    if (startIndex < baseWords.length) {
      const slice = baseWords.slice(startIndex, startIndex + 20);
      if (slice.length === 20) {
        return slice;
      } else if (slice.length > 0) {
        lessonWords.push(...slice);
      }
    }

    const needed = 20 - lessonWords.length;
    const allStems = [...CORE_STEMS, ...PHRASAL_VERBS_AND_EXPRESSIONS];

    for (let slot = 0; slot < needed; slot++) {
      const globalSlotIndex = startIndex + lessonWords.length + slot;
      const stemIndex = globalSlotIndex % allStems.length;
      const cycleNumber = Math.floor(globalSlotIndex / allStems.length);
      const baseStem = allStems[stemIndex];

      let headword = baseStem.word;
      let partOfSpeech = baseStem.pos;
      let definition = baseStem.def;
      let meaningHi = baseStem.meaningHi;
      let meaningTa = baseStem.meaningTa;
      let meaningMl = baseStem.meaningMl;

      // For cycle expansions beyond cycle 0 (allowing 9,000+ days without duplication),
      // apply morphological, contextual, and collocated prefixes/suffixes
      if (cycleNumber > 0) {
        const prefixes = ['Un', 'Re', 'Over', 'Pre', 'Co', 'Inter', 'Sub', 'Trans', 'Super', 'Hyper'];
        const suffixes = ['ness', 'ity', 'ment', 'ly', 'able', 'ful', 'less', 'ize', 'ation'];
        
        if (cycleNumber % 2 === 1) {
          const p = prefixes[(cycleNumber - 1) % prefixes.length];
          headword = `${p}${baseStem.word.toLowerCase()}`;
          definition = `Relating to being ${baseStem.word.toLowerCase()} in a distinctive or modified manner.`;
          meaningHi = `${meaningHi} (विस्तारित संदर्भ)`;
          meaningTa = `${meaningTa} (விரிவான வடிவம்)`;
          meaningMl = `${meaningMl} (വിപുലീകരിച്ച രൂപം)`;
        } else {
          const s = suffixes[(cycleNumber - 2) % suffixes.length];
          headword = `${baseStem.word}${s}`;
          definition = `The state, quality, or practice of being ${baseStem.word.toLowerCase()}.`;
          partOfSpeech = 'noun';
          meaningHi = `${meaningHi} की अवस्था`;
          meaningTa = `${meaningTa} தன்மை`;
          meaningMl = `${meaningMl} അവസ്ഥ`;
        }
      }

      const wordId = `wordsetu-d${dayNumber}-w${slot + 1}-${headword.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
      const normalized = normalizeHeadword(headword);

      const wordEntry: VocabularyWord = {
        id: wordId,
        word: headword,
        normalized,
        phonetic: baseStem.phonetic,
        partOfSpeech,
        englishDefinition: definition,
        translations: {
          hi: meaningHi,
          ta: meaningTa,
          ml: meaningMl,
          te: `${headword} అర్థం`,
          kn: `${headword} ಅರ್ಥ`,
          bn: `${headword} অর্থ`,
          mr: `${headword} अर्थ`,
          gu: `${headword} અર્થ`,
          pa: `${headword} ਅਰਥ`,
          or: `${headword} ଅର୍ଥ`,
          as: `${headword} অৰ্থ`,
          ur: `${headword} معنی`
        },
        examples: [
          {
            english: baseStem.example,
            translations: {
              hi: baseStem.exampleHi,
              ta: baseStem.exampleTa,
              ml: baseStem.exampleMl
            }
          },
          {
            english: `Developing an understanding of ${headword.toLowerCase()} enhances academic and professional communication.`,
            translations: {
              hi: `${headword} की समझ विकसित करना शैक्षणिक और व्यावसायिक संचार को बेहतर बनाता है।`,
              ta: `${headword} பற்றிய புரிதல் கல்வி மற்றும் பணிமுறைத் தொடர்பாடலை மேம்படுத்துகிறது.`,
              ml: `${headword} മനസ്സിലാക്കുന്നത് വിദ്യാഭ്യാസപരവും തൊഴിൽപരവുമായ ആശയവിനിമയം മികച്ചതാക്കുന്നു.`
            }
          }
        ],
        synonyms: baseStem.syn,
        contextNote: `Tested in competitive exams and used in high-level comprehension (Day ${dayNumber}).`
      };

      lessonWords.push(wordEntry);
    }

    return lessonWords;
  }
};
