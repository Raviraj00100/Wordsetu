import { Story } from '../types/story';

export const SEED_STORIES: Story[] = [
  // ================= ENGLISH STORIES =================
  {
    id: 'katha-en-001',
    storyFamilyId: 'fam-panchatantra-crows',
    title: 'The Clever Crow and the Pitcher of Water',
    normalizedTitle: 'the clever crow and the pitcher of water',
    language: 'en',
    category: 'panchatantra',
    region: 'Ancient India',
    difficulty: 'beginner',
    readingTimeMinutes: 3,
    author: 'Pandit Vishnu Sharma',
    source: 'Panchatantra (Book of Mitrabhedha)',
    shortDescription: 'During a scorching summer, a thirsty crow discovers a deep earthen pot with water at the bottom and solves the problem using practical wit.',
    moral: 'Where there is a will, patience, and intelligent thought, every obstacle can be conquered.',
    characters: ['Kaga the Crow', 'Village Elders'],
    coverColor: '#d97706',
    status: 'published',
    createdAt: Date.now() - 86400000 * 10,
    updatedAt: Date.now(),
    content: `Once upon a scorching summer in the Deccan plains, the sun blazed like a furnace across the dusty landscape. Rivers had dried into cracked mud beds, and trees bowed low under the stifling heat. A clever crow named Kaga flew over fields and villages, his throat parched with desperation. Every pond he checked was dry, and the dry leaves whispered of drought.

Just as exhaustion threatened to overwhelm him, Kaga spotted an ancient courtyard surrounded by neem trees. Sitting on the stone ledge of a well was a tall earthen pitcher. Hope surged in his heart! He swooped down swiftly and perched upon its rim, peering excitedly into the opening.

Alas, though there was sweet water inside, it sat deep at the very bottom. Kaga bent his neck, stretching his beak as far down as possible, but the water was just beyond his reach. He attempted to push the heavy terracotta pot to tilt it, but it was sturdy and unyielding. If he broke it violently, the water would spill into the thirsty soil and vanish forever.

Kaga did not despair or panic. He rested on a nearby branch and observed his surroundings with calm deliberation. He noticed heaps of smooth, round pebbles scattered beside the courtyard garden. An ingenious plan formed in his mind.

One by one, Kaga flew down, gripped a pebble in his beak, flew back up to the rim of the pitcher, and dropped it inside. *Plop!* The water rose by an infinitesimal fraction. Without hesitation, he picked up another pebble. *Plop!* And another. *Plop!*

Dozens of times he flew back and forth under the midday sun. His wings grew heavy, but his resolve never wavered. Gradually, the water column began to ascend inside the pitcher. At last, after placing fifty pebbles, the crystal-clear water rose right to the brim!

Kaga dipped his beak and drank deeply, quenching his thirst with pure triumph. Having refreshed himself, he cawed a joyous song into the summer breeze and took to the skies, knowing that perseverance and reasoned thought will overcome any obstacle where raw strength fails.`,
    quiz: [
      {
        id: 'q1',
        question: 'What difficulty did Kaga the crow face when he found the pitcher?',
        options: ['The water was dirty and muddy', 'The water was too deep for his beak to reach', 'Another bird was guarding the pitcher', 'The pitcher was completely empty'],
        correctIndex: 1,
        explanation: 'The pitcher had water at the very bottom, but Kaga could not reach it with his beak.'
      },
      {
        id: 'q2',
        question: 'Why did Kaga decide against tipping over the pitcher?',
        options: ['The water would spill into the dry soil and vanish', 'He was afraid of breaking his beak', 'The villagers were watching him', 'The pitcher was made of iron'],
        correctIndex: 0,
        explanation: 'Tipping the pitcher would cause the precious water to be absorbed immediately by the parched ground.'
      },
      {
        id: 'q3',
        question: 'What ingenious method did Kaga use to raise the water level?',
        options: ['He waited for rain', 'He dropped pebbles into the pitcher one by one', 'He called a flock of geese', 'He cracked the pitcher in half'],
        correctIndex: 1,
        explanation: 'By repeatedly dropping pebbles into the pitcher, the water level gradually rose to the rim.'
      },
      {
        id: 'q4',
        question: 'What primary virtue does this classic Panchatantra fable illustrate?',
        options: ['Physical strength over intellect', 'Patience, perseverance, and practical reasoning', 'Relying on luck and miracles', 'Jealousy and deception'],
        correctIndex: 1,
        explanation: 'The moral highlights that where there is patience, determination, and intelligent thought, any obstacle can be solved.'
      },
      {
        id: 'q5',
        question: 'In the story, the word "parched" most nearly means:',
        options: ['Extremely thirsty and dry', 'Very cold', 'Fast and energetic', 'Full of food'],
        correctIndex: 0,
        explanation: '"Parched" signifies suffering from extreme heat and thirst.'
      }
    ]
  },
  {
    id: 'katha-en-002',
    storyFamilyId: 'fam-birbal-pot-of-wisdom',
    title: 'Birbal and the Pot of Wisdom',
    normalizedTitle: 'birbal and the pot of wisdom',
    language: 'en',
    category: 'akbar-birbal',
    region: 'Mughal Court, Agra',
    difficulty: 'intermediate',
    readingTimeMinutes: 4,
    author: 'Traditional Indian Folklore',
    source: 'Court Chronicles of Emperor Akbar',
    shortDescription: 'When a neighboring king demands a pot full of pure wisdom, Emperor Akbar turns to Raja Birbal, who fulfills the impossible royal request with unmatched wit.',
    moral: 'True wisdom is recognized through creative thinking, tact, and diplomatic grace.',
    characters: ['Emperor Akbar', 'Raja Birbal', 'King of Persia Messenger'],
    coverColor: '#0284c7',
    status: 'published',
    createdAt: Date.now() - 86400000 * 9,
    updatedAt: Date.now(),
    content: `One morning in the grand Diwan-e-Khas of Agra, Emperor Akbar was presented with an extraordinary message from the ruler of a neighboring empire. The emissary stepped forward, bowed low, and read the royal letter aloud before the assembly of courtiers:

"To the illustrious Badshah Akbar of Hindustan. We have heard that your court possesses the greatest scholars and wisest thinkers in the world. As a gesture of friendly honor, we ask that you send back our emissary with a pot filled to the brim with pure wisdom. If you cannot provide a vessel of wisdom, we shall conclude your fame is unearned."

The ministers and nawabs gasped in bewilderment. How could anyone bottle wisdom? Wisdom was neither liquid nor spice; it possessed neither shape nor weight! Murmurs of anxiety rippled through the hall as courtiers feared international embarrassment.

Emperor Akbar smiled and looked toward his trusted advisor, Raja Birbal. "Birbal," said the Emperor, "our royal prestige rests in your hands. Can you prepare a pot of wisdom for our royal neighbor?"

Birbal bowed gracefully. "Jahanpanah, wisdom is indeed a rare crop, but it can certainly be harvested with time. Grant me six weeks, and I shall deliver a pot filled with the purest wisdom."

The Emperor agreed. Birbal immediately summoned royal gardeners to an expansive greenhouse on the palace grounds. He instructed them to select several healthy, flourishing pumpkin vines. Taking a collection of narrow-mouthed clay pots, Birbal carefully placed a tiny, newborn pumpkin bud inside each pot while keeping the vine intact and rooted in fertile soil.

Over the next month, the gardeners watered and tended the vines with great care. Inside the narrow pots, sheltered from harsh sunlight, the pumpkins swelled rapidly until they completely filled the interior contours of each clay vessel.

When the six weeks elapsed, Birbal returned to court holding a handsome clay pot whose mouth was far smaller than the enormous pumpkin inside. He presented it to the foreign emissary in front of Emperor Akbar and the astonished ministers.

"Noble emissary," Birbal announced with a polite bow, "here is the pot of wisdom requested by your sovereign. You may take it with our deepest compliments. However, there is one condition: you must remove the wisdom from the pot without breaking the clay vessel and without cutting or bruising the fruit inside. If you damage either, your king will have failed to understand our gift!"

The emissary peered inside the tiny neck of the pot and saw the giant pumpkin filling the entire cavity. It was utterly impossible to pull it out without smashing the vessel! 

Recognizing the brilliance and wit of Birbal, the emissary bowed deeply in admiration. "Indeed, Badshah Akbar," confessed the emissary, "your court possesses wisdom beyond compare!" Emperor Akbar rewarded Birbal with a necklace of emeralds, delighted by his advisor's boundless ingenuity.`,
    quiz: [
      {
        id: 'q1',
        question: 'What unusual gift did the foreign monarch demand from Emperor Akbar?',
        options: ['A chest of diamonds', 'A pot filled with pure wisdom', 'A herd of white elephants', 'A map of the kingdom'],
        correctIndex: 1,
        explanation: 'The neighboring king requested a pot full of wisdom to test the court.'
      },
      {
        id: 'q2',
        question: 'How did Birbal manage to grow a pumpkin inside a narrow-mouthed pot?',
        options: ['He placed a tiny pumpkin bud inside the pot while still on the vine', 'He carved the pumpkin with a knife', 'He assembled the pot around a grown pumpkin', 'He used magical spells'],
        correctIndex: 0,
        explanation: 'Birbal placed a small growing bud inside the pot and let it expand naturally inside the vessel.'
      },
      {
        id: 'q3',
        question: 'What clever condition did Birbal attach to taking the wisdom?',
        options: ['They must pay gold coins', 'They must remove the fruit without breaking the pot or cutting the fruit', 'They must return it before sunset', 'They must answer three riddles'],
        correctIndex: 1,
        explanation: 'Birbal stipulated that the wisdom must be extracted without damaging the clay pot or the fruit.'
      },
      {
        id: 'q4',
        question: 'What was the emissary’s reaction upon inspecting the pot?',
        options: ['He was angry and declared war', 'He was deeply impressed by Birbal’s brilliance', 'He broke the pot immediately', 'He laughed and threw it away'],
        correctIndex: 1,
        explanation: 'The emissary acknowledged the unmatched wit of Akbar’s court.'
      },
      {
        id: 'q5',
        question: 'The word "emissary" refers to:',
        options: ['A soldier who guards the gate', 'A messenger or diplomatic representative', 'A royal chef', 'A court musician'],
        correctIndex: 1,
        explanation: 'An emissary is a diplomatic envoy sent on an official mission.'
      }
    ]
  },
  {
    id: 'katha-en-003',
    storyFamilyId: 'fam-tenali-shadow-thieves',
    title: 'Tenali Raman and the Well Water Thieves',
    normalizedTitle: 'tenali raman and the well water thieves',
    language: 'en',
    category: 'tenali-raman',
    region: 'Vijayanagara Empire, Hampi',
    difficulty: 'intermediate',
    readingTimeMinutes: 4,
    author: 'Traditional Folklore of South India',
    source: 'Tales of Tenali Ramakrishna',
    shortDescription: 'When burglars target Tenali Raman’s home at midnight, the quick-witted poet turns their criminal intentions into an all-night free irrigation service for his vegetable garden.',
    moral: 'Presence of mind can transform a threatening danger into a profitable solution.',
    characters: ['Tenali Raman', 'Sharda (his wife)', 'Two Thieves'],
    coverColor: '#16a34a',
    status: 'published',
    createdAt: Date.now() - 86400000 * 8,
    updatedAt: Date.now(),
    content: `In the golden city of Vijayanagara, King Krishnadevaraya’s court jester and counselor, Tenali Raman, was celebrated as much for his shrewd mind as his wit. One balmy evening, as Raman strolled in his sprawling backyard garden, he heard a suspicious rustling in the thick jasmine bushes. 

Peering discreetly through the twilight, Raman noticed two shadowy figures crouching behind the hedge. They were armed with crowbars and burlap sacks. Raman instantly understood: thieves had crept into his estate, waiting for midnight to break into his house.

Raman showed no fear. Instead, he walked casually inside his house and called out loudly to his wife, Sharda: "Sharda! Have you heard the latest news in the bazaar? A ruthless gang of burglars has arrived in the city! They are breaking into the homes of court ministers and stealing all gold and jewels."

Outside in the bushes, the two thieves nudged each other excitedly and listened with ears wide open.

Sharda, puzzled, began to ask a question, but Raman winked vigorously and signaled her to play along. Raising his voice so it echoed clearly across the veranda, Raman announced: "We cannot leave our precious royal jewelry and silver ornaments inside the house tonight. We must hide them where no thief would ever think to look! Help me pack our heavy iron chest with all our gold necklaces, silver vessels, and gold mohurs. We will dump it into the deep well in our garden until the robbers leave town!"

Raman and Sharda then dragged a large, heavy wooden chest filled with large building stones and broken bricks onto the veranda. It rattled with a heavy, metallic clanking that made the thieves’ eyes gleam with greed. 

With much theatrical grunting and groaning, Raman and his wife hauled the trunk across the garden to the stone well. *SPLASH!* The heavy chest sank straight to the bottom of the deep water with an immense echo.

"Ah, our wealth is safe now!" Raman sighed in relief. He returned inside, closed all the shutters, and pretended to sleep, while quietly watching from an upstairs window.

As soon as midnight arrived, the thieves scrambled to the well. "The water is too deep," whispered the first thief. "We must bail the water out bucket by bucket until we can reach the chest!"

Armed with the garden bucket and rope, the thieves began hauling water from the well. They poured bucket after bucket onto the garden ground. Inside the house, Raman chuckled softly. He had previously dug neat irrigation trenches leading from the well to his mango trees, brinjal plants, and sugarcane rows!

The thieves toiled relentlessly throughout the humid night. Their backs ached, their palms blistered, and sweat poured like rain, but greed kept them working. Bucket after bucket, they emptied the well, faithfully watering every single plant in Raman’s garden.

Just as the first rosy rays of dawn crept over the horizon, the thieves peered exhausted into the mud at the bottom of the well. They hooked the chest and hauled it up with trembling arms. Prying the lid open with their crowbar, they found nothing inside except large grey stones!

At that moment, Tenali Raman strolled out in his morning shawl, holding two glasses of hot buttermilk. "Thank you, noble friends!" Raman laughed heartily. "My vegetable garden has never been so thoroughly irrigated! Please, have some buttermilk before the palace guards arrive to thank you officially!"

Terrified, the exhausted thieves dropped their tools and sprinted away as fast as their trembling legs could carry them, never daring to return to Raman’s estate again.`,
    quiz: [
      {
        id: 'q1',
        question: 'How did Tenali Raman discover there were thieves in his garden?',
        options: ['The palace guards warned him', 'He heard rustling in the jasmine bushes and saw two figures', 'His dog barked loudly', 'The thieves knocked on the door'],
        correctIndex: 1,
        explanation: 'Raman noticed rustling and saw two figures hiding in the bushes.'
      },
      {
        id: 'q2',
        question: 'What did Tenali Raman put inside the heavy trunk?',
        options: ['Gold coins and silver vessels', 'Bricks and heavy stones', 'His old clothes and books', 'Garden tools'],
        correctIndex: 1,
        explanation: 'He filled the chest with stones and bricks so it sounded metallic and heavy.'
      },
      {
        id: 'q3',
        question: 'What did the thieves do all night long to retrieve the trunk?',
        options: ['They broke down Raman’s door', 'They bailed out bucket after bucket of water, irrigating his garden', 'They dug a tunnel under the estate', 'They hired a diver'],
        correctIndex: 1,
        explanation: 'They emptied the well bucket by bucket, inadvertently watering Raman’s entire vegetable patch.'
      },
      {
        id: 'q4',
        question: 'What did Tenali Raman offer the thieves in the morning?',
        options: ['Gold coins', 'Hot buttermilk', 'A cup of tea', 'A basket of vegetables'],
        correctIndex: 1,
        explanation: 'He offered them glasses of buttermilk while thanking them for irrigating his garden.'
      },
      {
        id: 'q5',
        question: 'What is the key life lesson from this story?',
        options: ['Never plant vegetables in summer', 'Greed leads to easy manipulation, and wit overcomes danger', 'Always store jewels in wells', 'Thieves are generous workers'],
        correctIndex: 1,
        explanation: 'Raman’s presence of mind defeated the thieves without violence.'
      }
    ]
  },

  // ================= HINDI STORIES (हिंदी) =================
  {
    id: 'katha-hi-001',
    storyFamilyId: 'fam-panchatantra-crows',
    title: 'चतुर कौआ और घड़े का पानी',
    normalizedTitle: 'chatur kauva aur ghade ka pani',
    language: 'hi',
    category: 'panchatantra',
    region: 'प्राचीन भारत',
    difficulty: 'beginner',
    readingTimeMinutes: 3,
    author: 'पंडित विष्णु शर्मा',
    source: 'पंचतंत्र (मित्रभेद कथामाला)',
    shortDescription: 'भीषण ग्रीष्म ऋतु में एक प्यासे कौवे ने अपनी बुद्धि, धैर्य और निरंतर प्रयास से घड़े के गहरे पानी को ऊपर लाकर अपनी प्यास बुझाई।',
    moral: 'जहाँ बुद्धि और धैर्य का संगम होता है, वहाँ कठिन से कठिन विपत्ति भी दूर हो जाती है।',
    characters: ['कागा (कौआ)', 'ग्रामीण'],
    coverColor: '#d97706',
    status: 'published',
    createdAt: Date.now() - 86400000 * 10,
    updatedAt: Date.now(),
    content: `एक बार जेठ के तपते महीने में सूर्य देव आग बरसा रहे थे। धरती सूखी पड़ी थी, नदियाँ और तालाब सूखकर धूल उड़ा रहे थे। एक चतुर कौआ प्यास से बेहाल होकर पानी की खोज में दूर-दूर तक भटक रहा था। उसका कंठ सूखकर काँटा हो चुका था और पंखों में उड़ने की शक्ति समाप्त हो रही थी।

उड़ते-उड़ते वह एक पुराने बगीचे में पहुँचा। वहाँ एक छायादार नीम के पेड़ के नीचे उसे मिट्टी का एक बड़ा घड़ा दिखाई दिया। कौवे की आँखों में आशा की चमक आ गई। वह तुरंत उड़कर घड़े की मुँडेर पर जा बैठा और उचककर भीतर झाँका।

हाय रे दुर्भाग्य! घड़े में शीतल जल तो था, किंतु वह घड़े के बिल्कुल तलहटी में था। कौवे ने अपनी चोंच नीचे बढ़ाई, पर जल तक नहीं पहुँच सका। उसने घड़े को धक्का देकर गिराने का प्रयास किया, ताकि पानी बह निकले, किंतु घड़ा भारी था और कौवे के बल से टस से मस न हुआ। कौवे ने सोचा, "यदि घड़ा फूट भी गया, तो सारा पानी सूखी मिट्टी में समा जाएगा और मुझे एक बूँद भी न मिलेगी।"

कौआ निराश नहीं हुआ। उसने अपनी आँखें घुमाईं और शांत मन से विचार किया। बगीचे की पगडंडी पर छोटे-छोटे गोल कंकड़-पत्थर बिखरे पड़े थे। कौवे के मस्तिष्क में एक अनोखी युक्ति कौंधी।

उसने तुरंत नीचे उड़कर अपनी चोंच में एक कंकड़ उठाया और घड़े में लाकर डाल दिया। छपाक! पानी का स्तर तनिक सा ऊपर उठा। कौवे का उत्साह बढ़ गया। उसने दूसरा कंकड़ डाला, फिर तीसरा, फिर चौथा।

धूप में पसीना बहाते हुए वह बार-बार उड़ता, कंकड़ लाता और घड़े में डालता रहा। उसकी थकान मिट गई और मन में केवल एक ही लक्ष्य था। धीरे-धीरे कंकड़ों के भार से घड़े का पानी ऊपर चढ़ने लगा। अंततः दर्जनों कंकड़ डालने के बाद जल घड़े के मुँह तक आ पहुँचा।

कौवे ने जी भरकर शीतल और तृप्तिदायक जल पिया। उसने अपनी प्यास बुझाई, पंख फड़फड़ाए और आनंद से काँव-काँव करता हुआ नीले आकाश में उड़ गया। धैर्य और विवेक ने असंभव को संभव बना दिया था।`,
    quiz: [
      {
        id: 'q1',
        question: 'कौवे को घड़े से पानी पीने में क्या कठिनाई आ रही थी?',
        options: ['पानी बहुत गंदा था', 'पानी घड़े की तलहटी में था और चोंच नहीं पहुँच पा रही थी', 'घड़े पर ढक्कन लगा था', 'घड़े के पास शिकारी बैठा था'],
        correctIndex: 1,
        explanation: 'घड़े में पानी बहुत नीचे था, इसलिए कौवे की चोंच उस तक नहीं पहुँच पा रही थी।'
      },
      {
        id: 'q2',
        question: 'कौवे ने घड़े को पलटने का विचार क्यों त्याग दिया?',
        options: ['उसे डर था कि पानी मिट्टी में बहकर व्यर्थ हो जाएगा', 'घड़े में साँप था', 'घड़ा सोने का था', 'उसे प्यास नहीं थी'],
        correctIndex: 0,
        explanation: 'यदि घड़ा पलट जाता तो सूखी मिट्टी सारा पानी सोख लेती।'
      },
      {
        id: 'q3',
        question: 'कौवे ने पानी ऊपर लाने के लिए क्या उपाय किया?',
        options: ['उसने बारिश का इंतज़ार किया', 'उसने एक-एक कर कंकड़ घड़े में डाले', 'उसने दूसरे पक्षियों को बुलाया', 'उसने घड़े में छेद किया'],
        correctIndex: 1,
        explanation: 'कंकड़ डालने से घड़े का पानी धीरे-धीरे ऊपर आ गया।'
      },
      {
        id: 'q4',
        question: 'इस कहानी से हमें मुख्य रूप से क्या शिक्षा मिलती है?',
        options: ['शारीरिक शक्ति ही सब कुछ है', 'धैर्य और बुद्धिमानी से हर समस्या का समाधान संभव है', 'भाग्य के भरोसे बैठना चाहिए', 'कौवे आलसी होते हैं'],
        correctIndex: 1,
        explanation: 'धैर्य और विवेक से कठिन परिस्थिति पर भी विजय पाई जा सकती है।'
      },
      {
        id: 'q5',
        question: 'कहानी में "कंठ" शब्द का क्या अर्थ है?',
        options: ['गला', 'पैर', 'आँख', 'पंख'],
        correctIndex: 0,
        explanation: 'कंठ का अर्थ गला होता है।'
      }
    ]
  },
  {
    id: 'katha-hi-002',
    storyFamilyId: 'fam-birbal-pot-of-wisdom',
    title: 'बीरबल और बुद्धि का घड़ा',
    normalizedTitle: 'birbal aur buddhi ka ghada',
    language: 'hi',
    category: 'akbar-birbal',
    region: 'मुग़ल दरबार, आगरा',
    difficulty: 'intermediate',
    readingTimeMinutes: 4,
    author: 'पारंपरिक भारतीय लोककथा',
    source: 'अकबर-बीरबल विनोद कथाएँ',
    shortDescription: 'पड़ोसी राज्य के राजा ने जब बादशाह अकबर से बुद्धि से भरा घड़ा माँगा, तब बीरबल ने अपनी चतुराई से ऐसा घड़ा तैयार कर सबको अचंभित कर दिया।',
    moral: 'सच्ची बुद्धि किसी वस्तु में नहीं, बल्कि सूझबूझ और युक्तिसंगत आचरण में प्रकट होती है।',
    characters: ['बादशाह अकबर', 'राजा बीरबल', 'पड़ोसी देश का दूत'],
    coverColor: '#0284c7',
    status: 'published',
    createdAt: Date.now() - 86400000 * 9,
    updatedAt: Date.now(),
    content: `आगरा के भव्य दीवान-ए-खास में एक दिन एक विदेशी दूत ने प्रवेश किया। उसने झुककर बादशाह अकबर का अभिवादन किया और अपने सम्राट का पत्र प्रस्तुत किया। पत्र में लिखा था:

"शहंशाह अकबर! हमने सुना है कि आपके दरबार में विश्व के सबसे प्रखर बुद्धिमान रत्न उपस्थित हैं। हमारे राजा की इच्छा है कि आप हमें एक ऐसा घड़ा भेंट करें जो ऊपर तक 'बुद्धि' से लबालब भरा हो। यदि आप ऐसा न कर सके, तो हम मानेंगे कि आपकी ख्याति निराधार है।"

दरबार में सन्नाटा छा गया। मंत्री और दरबारी एक-दूसरे का मुँह ताकने लगे। बुद्धि कोई अन्न, दूध या स्वर्ण तो नहीं जिसे घड़े में भरकर तोल दिया जाए! मानहानि की आशंका से दरबारियों के चेहरे पीले पड़ गए।

बादशाह अकबर ने मुस्कुराकर अपने प्रिय वज़ीर बीरबल की ओर देखा। "बीरबल, हमारे मुल्क की प्रतिष्ठा अब तुम्हारे हाथ में है। क्या तुम बुद्धि से भरा घड़ा तैयार कर सकते हो?"

बीरबल ने हाथ जोड़कर कहा, "आलमपनाह! बुद्धि की फसल तैयार होने में थोड़ा समय लगता है। मुझे केवल एक माह की मोहलत दी जाए।" दूत को सम्मानपूर्वक अतिथिगृह में ठहराया गया।

बीरबल ने शाही बागवान को बुलाया और एक खेत में कद्दू (कुम्हड़े) की बेलें लगवाईं। जब बेलों पर छोटे-छोटे कद्दू के फल निकलने लगे, तो बीरबल ने कई छोटे मुँह वाले मिट्टी के घड़े मँगवाए। उन्होंने एक-एक कच्चे कद्दू के फल को बेल से अलग किए बिना घड़े के भीतर रखवा दिया।

नियमित खाद और पानी मिलने से कद्दू घड़े के भीतर ही तेजी से बढ़ने लगे। एक महीने के भीतर कद्दू इतने बड़े हो गए कि उन्होंने घड़े के पूरे भीतरी हिस्से को घेर लिया। अब कद्दू घड़े के छोटे मुँह से बाहर नहीं निकल सकता था! बीरबल ने बेल से काटकर घड़े अलग करवा लिए।

दरबार में नियत दिन पर बीरबल ने एक सुंदर मलमल से ढका घड़ा दूत के समक्ष प्रस्तुत किया। बीरबल ने विनम्रता से कहा, "मान्यवर! आपके महाराज के लिए बुद्धि से भरा घड़ा हाज़िर है। इसे ले जाइए, किंतु हमारे सम्राट की एक शर्त है।"

दूत ने उत्सुकता से पूछा, "कैसी शर्त, बीरबल जी?"

बीरबल मुस्कुराए, "शर्त यह है कि घड़े को बिना तोड़े और भीतर रखे फल को बिना काटे या नुकसान पहुँचाए ही बुद्धि को बाहर निकालना होगा! यदि घड़ा टूटा या फल छिला, तो आपके महाराज को क्षतिपूर्ति देनी होगी।"

दूत ने जब घड़े के सँकरे मुँह से अंदर झाँका, तो दंग रह गया। विशाल कद्दू पूरे घड़े में फँसा था। घड़े को तोड़े बिना उसे निकालना सर्वथा असंभव था! दूत बीरबल की तीक्ष्ण बुद्धि के आगे नतमस्तक हो गया। बादशाह अकबर ने बीरबल को अमूल्य मोतियों की माला पहनाकर सम्मानित किया।`,
    quiz: [
      {
        id: 'q1',
        question: 'पड़ोसी राजा ने बादशाह अकबर से क्या भेजने की माँग की थी?',
        options: ['सोने का कलश', 'बुद्धि से भरा हुआ घड़ा', 'अरबी घोड़े', 'हीरों की माला'],
        correctIndex: 1,
        explanation: 'पड़ोसी राजा ने दरबार की परीक्षा लेने हेतु बुद्धि से भरा घड़ा माँगा था।'
      },
      {
        id: 'q2',
        question: 'बीरबल ने घड़े के अंदर क्या उगाया था?',
        options: ['आम का पेड़', 'कद्दू (कुम्हड़ा)', 'गुलाब का फूल', 'तरबूज'],
        correctIndex: 1,
        explanation: 'बीरबल ने घड़े के संकीर्ण मुँह के अंदर कद्दू का छोटा फल रखकर उसे भीतर ही विकसित किया।'
      },
      {
        id: 'q3',
        question: 'बीरबल ने बुद्धि निकालने के लिए क्या शर्त रखी?',
        options: ['घड़ा टूटना नहीं चाहिए और फल कटना नहीं चाहिए', 'सोने के सिक्के देने होंगे', 'सूरज ढलने से पहले निकालना होगा', 'जल से धोना होगा'],
        correctIndex: 0,
        explanation: 'घड़े को तोड़े बिना और फल को नुकसान पहुँचाए बिना बुद्धि निकालनी थी।'
      },
      {
        id: 'q4',
        question: 'इस कहानी में बीरबल के किस गुण का परिचय मिलता है?',
        options: ['क्रोध और कठोरता', 'अतुलनीय हाज़िरजवाबी और व्यावहारिक बुद्धिमत्ता', 'उदासीनता', 'शारीरिक बल'],
        correctIndex: 1,
        explanation: 'बीरबल की अद्वितीय सूझबूझ और चातुर्य इस कहानी में झलकता है।'
      },
      {
        id: 'q5',
        question: '"आलमपनाह" का क्या अर्थ है?',
        options: ['संसार को शरण देने वाले (महाराज/शहंशाह)', 'प्रधान सेनापति', 'राजकीय द्वारपाल', 'प्रजा'],
        correctIndex: 0,
        explanation: 'आलमपनाह सम्राट या बादशाह के लिए सम्मानजनक संबोधन है।'
      }
    ]
  },

  // ================= TAMIL STORIES (தமிழ்) =================
  {
    id: 'katha-ta-001',
    storyFamilyId: 'fam-panchatantra-crows',
    title: 'புத்திசாலி காகமும் கூஜாவும்',
    normalizedTitle: 'puthisaali kaagamum koojaavum',
    language: 'ta',
    category: 'panchatantra',
    region: 'தமிழ்நாடு & பண்டைக்கால பாரதம்',
    difficulty: 'beginner',
    readingTimeMinutes: 3,
    author: 'பண்டித விஷ்ணு சர்மா',
    source: 'பஞ்சதந்திர கதைகள்',
    shortDescription: 'கடும் வெயில் காலத்தில் தாகத்தால் தவித்த ஒரு காகம், தன் விடாமுயற்சியாலும் அறிவாற்றலாலும் கூஜாவில் அடியில் இருந்த தண்ணீரை மேலே வரவழைத்துக் குடித்தது.',
    moral: 'விடாமுயற்சியும் கூரிய அறிவும் இருந்தால் எப்பேர்ப்பட்ட கடினமான செயலையும் சாதிக்கலாம்.',
    characters: ['காகம்', 'ஊர் மக்கள்'],
    coverColor: '#d97706',
    status: 'published',
    createdAt: Date.now() - 86400000 * 10,
    updatedAt: Date.now(),
    content: `சித்திரை மாதத்துக் கடும் வெயில் நிலமெங்கும் தகித்துக் கொண்டிருந்தது. குளங்களும் ஏரிகளும் வறண்டு போய்க் காய்ந்து கிடந்தன. பசுமையான மரங்கள்கூட இலைகளை உதிர்த்துத் தவித்தன. ஒரு காகம் தாகத்தால் நா வறண்டு போய்த் தண்ணீரைத் தேடி வெகுதூரம் அலைந்து திரிந்தது. அதன் தொண்டை வறண்டு, சிறகுகளில் பறக்கும் பலம் குறைந்து கொண்டே வந்தது.

அப்போது ஒரு பெரிய வீட்டின் கொல்லைப்புறத் தோட்டத்தில், வேப்பமர நிழலில் ஒரு மண்பானைக் கூஜா இருப்பதைக் காகம் கண்டது. மகிழ்ச்சியுடன் பறந்து சென்று அந்தக் கூஜாவின் விளிம்பில் அமர்ந்து உள்ளே எட்டிப் பார்த்தது.

அந்தோ பரிதாபம்! கூஜாவின் அடியில் சிறிதளவு தண்ணீர் இருந்தது. ஆனால் காகத்தின் அலகு எட்டாத அளவுக்கு அது மிகவும் ஆழத்தில் இருந்தது. கூஜாவைத் தன் பலத்தால் சாய்த்துத் தண்ணீரை வெளியேற்ற முயன்றது. ஆனால் கூஜா கனமாக இருந்ததால் அசைக்க முடியவில்லை. மேலும் கூஜா உடைந்தால் அரிய தண்ணீர் மணலில் சிந்திக் காணாமல் போய்விடும் என்று அது உணர்ந்தது.

காகம் சோர்வடையவில்லை. அமைதியாகச் சுற்றும் முற்றும் பார்த்தது. தோட்டத்தில் வழியோரங்களில் சிறு சிறு கூழாங்கற்கள் குவிந்து கிடப்பதைக் கண்டது. உடனே அதன் மனதில் ஒரு சிறந்த யோசனை உதித்தது.

காகம் கீழே பறந்து சென்று தன் அலகால் ஒரு கூழாங்கல்லைக் கவ்வி எடுத்து வந்து கூஜாவிற்குள் போட்டது. *டப்!* தண்ணீர் மிகச் சிறிதளவு மேலே உயர்ந்தது. காகத்தின் நம்பிக்கை பலமடங்கானது. மீண்டும் பறந்தது; மற்றொரு கல்லை எடுத்து வந்து போட்டது. 

களைப்பைப் பொருட்படுத்தாமல் அங்கும் இங்கும் பறந்து பலமுறை கற்களைப் போட்டுக் கொண்டே இருந்தது. காகத்தின் இடைவிடாத முயற்சியால் கூஜாவின் அடியிலிருந்த தண்ணீர் மெல்ல மெல்ல விளிம்பு வரை மேலே ஏறி வந்தது!

தாகம் தீர ஆனந்தமாகக் குளிர்ந்த நீரைக் குடித்த காகம், உற்சாகமாகக் கரைந்து கொண்டே தன் சிறகுகளை விரித்து வானில் பறந்தது. அறிவும் விடாமுயற்சியும் சேர்ந்தால் வெற்றி நிச்சயம் என்பதற்கு அதுவே சிறந்த சான்றானது.`,
    quiz: [
      {
        id: 'q1',
        question: 'கூஜாவில் இருந்த தண்ணீரை அருந்த காகத்திற்கு என்ன தடை இருந்தது?',
        options: ['தண்ணீர் அழுக்காக இருந்தது', 'தண்ணீர் கூஜாவின் அடியில் மிக ஆழத்தில் இருந்தது', 'கூஜா பூட்டப்பட்டிருந்தது', 'பூனை காவல் இருந்தது'],
        correctIndex: 1,
        explanation: 'கூஜாவின் அடியில் நீர் இருந்ததால் காகத்தின் அலகு எட்டவில்லை.'
      },
      {
        id: 'q2',
        question: 'காகம் கூஜாவை ஏன் உடைக்கவில்லை?',
        options: ['அலகு வலிக்கும் என்பதால்', 'தண்ணீர் மணலில் சிந்தி வீணாகிவிடும் என்பதால்', 'கூஜா தங்கத்தால் ஆனது என்பதால்', 'அதற்கு பலமில்லை என்பதால்'],
        correctIndex: 1,
        explanation: 'கூஜா உடைந்தால் நீர் தரையில் சிந்திக் காய்ந்துவிடும்.'
      },
      {
        id: 'q3',
        question: 'தண்ணீரை மேலே கொண்டுவர காகம் என்ன செய்தது?',
        options: ['மழையை எதிர்பார்த்தது', 'ஒவ்வொரு கூழாங்கல்லாகக் கூஜாவில் போட்டது', 'மற்ற பறவைகளை அழைத்தது', 'கூஜாவை உருட்டியது'],
        correctIndex: 1,
        explanation: 'கூழாங்கற்களைத் தொடர்ந்து இட்டதால் நீர் மேலே வந்தது.'
      },
      {
        id: 'q4',
        question: 'இக்கதையின் தலையாய நீதி என்ன?',
        options: ['ஆடம்பரம் அழிவைத் தரும்', 'விடாமுயற்சியும் நுண்ணறிவும் வெற்றியைத் தரும்', 'பகைவரை நம்பலாகாது', 'உணவே மருந்து'],
        correctIndex: 1,
        explanation: 'விடாமுயற்சியும் அறிவுக்கூர்மையும் எந்தச் சவாலையும் வெல்லும்.'
      },
      {
        id: 'q5',
        question: '"நா வறண்டு" என்பதன் பொருள் யாது?',
        options: ['தாகத்தால் நாக்கு உலர்ந்து போதல்', 'பசி எடுத்தல்', 'தூக்கம் வருதல்', 'கோபம் அடைதல்'],
        correctIndex: 0,
        explanation: 'கடும் தாகத்தால் நாக்கு வறட்சி அடைதலைக் குறிக்கும்.'
      }
    ]
  },
  {
    id: 'katha-ta-002',
    storyFamilyId: 'fam-tenali-shadow-thieves',
    title: 'தெனாலிராமனும் தோட்டத்துத் திருடர்களும்',
    normalizedTitle: 'thenaliramanum thottathu thirudargalum',
    language: 'ta',
    category: 'tenali-raman',
    region: 'விஜயநகரப் பேரரசு & தென்னகப் பாரம்பரியம்',
    difficulty: 'intermediate',
    readingTimeMinutes: 4,
    author: 'தென்னிந்திய நாட்டுப்புறக் கதைகள்',
    source: 'தெனாலிராமன் சாதுரியக் கதைகள்',
    shortDescription: 'தன் வீட்டில் திருட வந்த திருடர்களைக் கொண்டு, இரவு முழுவதும் தன் வீட்டுத் தோட்டம் முழுவதற்கும் தண்ணீர் பாய்ச்ச வைத்த தெனாலிராமனின் நகைச்சுவை சாதுரியக் கதை.',
    moral: 'ஆபத்தான தருணங்களிலும் சாதுரியமும் விவேகமும் இருந்தால் வினையை நன்மையாக மாற்றலாம்.',
    characters: ['தெனாலிராமன்', 'மனைவி சாரதா', 'இரு திருடர்கள்'],
    coverColor: '#16a34a',
    status: 'published',
    createdAt: Date.now() - 86400000 * 8,
    updatedAt: Date.now(),
    content: `விஜயநகர மன்னர் கிருஷ்ணதேவராயரின் அவையில் முதன்மைப் புலவராகவும் அரசவை விகடகவியாகவும் திகழ்ந்தவர் தெனாலிராமன். ஒரு மாலை வேளையில் ராமன் தன் வீட்டுத் தோட்டத்தில் உலாவிக்கொண்டிருந்த போது, மல்லிகைப் புதர்களுக்குப் பின்னால் சலசலப்பு சத்தம் கேட்டது.

கூர்ந்து கவனித்தபோது இரண்டு திருடர்கள் கையில் கடப்பாரையுடனும் சாக்குகளுடனும் ஒளிந்திருப்பது தெரிந்தது. நள்ளிரவில் தன் வீட்டிற்குள் புகுந்து கொள்ளையடிக்க அவர்கள் திட்டம் தீட்டியிருக்கிறார்கள் என்பதை ராமன் உடனே யூகித்தார்.

அஞ்சாத ராமன், இயல்பாக வீட்டிற்குள் சென்று தன் மனைவியை உரக்க அழைத்தார்: "சாரதா! நகரில் பெரிய கொள்ளைக் கூட்டம் புகுந்துவிட்டதாம்! அமைச்சர்களின் வீடுகளிலெல்லாம் புகுந்து தங்கம், வைரம், வெள்ளிப் பாத்திரங்களை அள்ளிச் செல்கிறார்களாம்!"

புதரில் பதுங்கியிருந்த திருடர்கள் காதுகளைத் தீட்டிக்கொண்டு இதைக் கேட்டனர்.

ராமனின் மனைவி ஆச்சரியத்துடன் ஏதோ கேட்க முயல, ராமன் அவளுக்குக் கண்ஜாடை காட்டி சைகை செய்தார். பின் உரத்த குரலில் சொன்னார்: "நமது விலைமதிப்பற்ற பொன்னகைகளையும் ரத்தினங்களையும் வீட்டில் வைப்பது ஆபத்து. அவற்றை ஒரு பெரிய இரும்புப் பெட்டியில் பூட்டி, நமது தோட்டத்துக் கிணற்றின் அடியில் போட்டுவிட்டால் எந்தத் திருடனுக்கும் சந்தேகம் வராது!"

ராமனும் மனைவியும் சேர்ந்து, உடைந்த செங்கற்களையும் கனத்த பாறாங்கற்களையும் ஒரு பழைய மரப்பெட்டியில் நிரப்பினர். அதைத் தரையில் இழுத்து வரும்போது 'டணால்... டணால்' என உலோக ஓசை எழுந்தது. திருடர்களின் கண்கள் ஆசையில் மின்னின!

இருவரும் அந்தப் பெட்டியைத் தூக்கி வந்து கிணற்றுக்குள் வீசினர். *தொப்!* என்று பெரும் சத்தத்துடன் பெட்டி ஆழத்தில் மூழ்கியது. "அப்பாடா! இனி நமது நகைகள் பத்திரம்!" என்று கூறிவிட்டு ராமன் வீட்டின் கதவைச் சாத்திவிட்டு, மாடி ஜன்னல் வழியே வேடிக்கை பார்த்தார்.

நள்ளிரவு வந்ததும் திருடர்கள் கிணற்றை நெருங்கினர். "தண்ணீர் ஆழமாக உள்ளது. கிணற்றிலிருக்கும் தண்ணீரை வாளி வாளியாக இறைத்து ஊற்றினால் பெட்டியை எளிதில் எடுத்துவிடலாம்" என்று எண்ணினர்.

கயிறும் வாளியும் கொண்டு திருடர்கள் தண்ணீரை இறைத்து ஊற்றத் தொடங்கினர். ராமன் ஏற்கனவே கிணற்றிலிருந்து கத்தரி, வெண்டை, வாழை, மாமரங்களுக்கு வாய்க்கால் வெட்டி வைத்திருந்தார்! திருடர்கள் இறைத்த தண்ணீர் தோட்டம் முழுவதும் பாய்ந்து செழிப்படையச் செய்தது.

விடியும் வரை கை வலிக்க, வியர்வை வழிய திருடர்கள் தண்ணீரை இறைத்துக் கொண்டே இருந்தனர். விடியற்காலையில் கிணற்றின் சேற்றில் கிடந்த பெட்டியைக் கயிற்றால் கட்டி மேலே இழுத்தனர். பூட்டை உடைத்துப் பார்த்த போது, உள்ளே வெறும் கருங்கற்கள் மட்டுமே இருந்தன!

அப்போது தெனாலிராமன் கையில் ஆவி பறக்கும் மோர் செம்புடன் சிரித்தபடி அங்கே வந்தார்: "அன்பான நண்பர்களே! எனது தோட்டம் முழுமைக்கும் இரவு முழுக்க நீர் பாய்ச்சி உதவியதற்கு மிக்க நன்றி! அரண்மனைக் காவலர்கள் வருவதற்குள் இந்த மோரைக் குடித்துவிட்டுச் செல்லுங்கள்!"

அதிர்ந்துபோன திருடர்கள், ராமனின் சாதுரியத்தைக் கண்டு அஞ்சி நடுங்கித் தலைதெறிக்க ஓடிப் போயினர்.`,
    quiz: [
      {
        id: 'q1',
        question: 'தோட்டத்தில் திருடர்கள் ஒளிந்திருப்பதை ராமன் எப்படிக் கண்டறிந்தார்?',
        options: ['காவலர்கள் சொன்னதால்', 'மல்லிகைப் புதரின் பின்னால் சலசலப்பு சத்தம் கேட்டதால்', 'நாய் குரைத்ததால்', 'திருடர்கள் சத்தமிட்டதால்'],
        correctIndex: 1,
        explanation: 'தோட்டத்தில் சலசலப்பு சத்தமும் திருடர்களின் அசைவும் தெரிந்தது.'
      },
      {
        id: 'q2',
        question: 'பெட்டியில் நகைகளுக்குப் பதிலாக ராமன் எதை நிரப்பினார்?',
        options: ['மணல்', 'கற்களும் உடைந்த செங்கற்களும்', 'தண்ணீர்', 'புல்'],
        correctIndex: 1,
        explanation: 'பாறாங்கற்களையும் செங்கற்களையும் நிரப்பினார்.'
      },
      {
        id: 'q3',
        question: 'திருடர்கள் விடிய விடிய என்ன வேலை செய்தனர்?',
        options: ['வீட்டை உடைத்தனர்', 'கிணற்றிலிருந்து தண்ணீர் இறைத்து ராமனின் தோட்டத்திற்குப் பாய்ச்சினர்', 'சுரங்கம் தோண்டினர்', 'தூங்கினர்'],
        correctIndex: 1,
        explanation: 'கிணற்றிலிருந்து நீரிறைத்து ராமனின் தோட்டம் முழுவதற்கும் பாய்ச்சினர்.'
      },
      {
        id: 'q4',
        question: 'காலையில் ராமன் திருடர்களுக்கு என்ன உபசரிப்பு வழங்க முன்வந்தார்?',
        options: ['சுவையான மோர்', 'பொற்காசுகள்', 'சூடான தேநீர்', 'பழங்கள்'],
        correctIndex: 0,
        explanation: 'களைப்பு நீங்க மோர் குடித்துவிட்டுப் போகும்படி கிண்டலாகக் கூறினார்.'
      },
      {
        id: 'q5',
        question: 'இக்கதையின் முக்கிய படிப்பினை யாது?',
        options: ['திருடுவது எளிது', 'சாதுரியமும் சமயோசித புத்தியும் ஆபத்தை நன்மையாக மாற்றும்', 'தோட்டம் வைக்கக்கூடாது', 'கிணறு வெட்டுவது தவறு'],
        correctIndex: 1,
        explanation: 'சமயத்திற்கேற்ற அறிவு ஆபத்தைத் தனக்குச் சாதகமாக மாற்றும்.'
      }
    ]
  },

  // ================= MALAYALAM STORIES (മലയാളം) =================
  {
    id: 'katha-ml-001',
    storyFamilyId: 'fam-panchatantra-crows',
    title: 'ബുദ്ധിമാനായ കാക്കയും കൂജയിലെ വെള്ളവും',
    normalizedTitle: 'buddhimanaya kakkayum koojayile vellavum',
    language: 'ml',
    category: 'panchatantra',
    region: 'കേരളവും പ്രാചീന ഭാരതവും',
    difficulty: 'beginner',
    readingTimeMinutes: 3,
    author: 'പണ്ഡിറ്റ് വിഷ്ണു ശർമ്മ',
    source: 'പഞ്ചതന്ത്ര കഥകൾ',
    shortDescription: 'കടുത്ത വേനലിൽ ദാഹിച്ചു വലഞ്ഞ ഒരു കാക്ക തന്റെ സാമർത്ഥ്യവും ക്ഷമയും കൊണ്ട് കൂജയുടെ അടിയിലുള്ള വെള്ളം മുകളിലെത്തിച്ചു ദാഹമകറ്റിയ കഥ.',
    moral: 'ക്ഷമയും ബുദ്ധിപൂർവ്വമായ പ്രയത്നവും ഉണ്ടെങ്കിൽ ഏതു പ്രതിസന്ധിയും തരണം ചെയ്യാം.',
    characters: ['കാക്ക', 'നാട്ടുകാർ'],
    coverColor: '#d97706',
    status: 'published',
    createdAt: Date.now() - 86400000 * 10,
    updatedAt: Date.now(),
    content: `കത്തുന്ന വേനൽക്കാലമായിരുന്നു അത്. സൂര്യന്റെ കഠിനമായ ചൂടിൽ പുഴകളും തോടുകളും വറ്റി വരണ്ടിരുന്നു. ചെടികളും മരങ്ങളും കരിഞ്ഞുണങ്ങി. ദാഹം കൊണ്ട് തൊണ്ട വറ്റിയ ഒരു കാക്ക വെള്ളം തേടി ദൂരങ്ങളോളം പറന്നുനടന്നു. എങ്ങും ഒരു തുള്ളി വെള്ളം പോലും കണ്ടെത്താനായില്ല. ക്ഷീണം കൊണ്ട് അതിന്റെ ചിറകുകൾ തളർന്നുതുടങ്ങി.

ഒടുവിൽ ഒരു വീട്ടുപറമ്പിൽ വലിയൊരു മാവിൻചുവട്ടിൽ ഒരു മൺകൂജ ഇരിക്കുന്നത് കാക്ക കണ്ടു. സന്തോഷത്തോടെ അത് പറന്നിറങ്ങി കൂജയുടെ വക്കിലിരുന്ന് ഉള്ളിലേക്ക് എത്തിനോക്കി.

കഷ്ടം! കൂജയുടെ ഏറ്റവും അടിയിൽ അല്പം വെള്ളമുണ്ടായിരുന്നു. പക്ഷേ കാക്കയ്ക്ക് എത്ര ശ്രമിച്ചിട്ടും കൊക്ക് അങ്ങോട്ടേക്ക് എത്തിക്കാൻ കഴിഞ്ഞില്ല. കൂജയെ തള്ളിമറിച്ചിടാൻ കാക്ക ശ്രമിച്ചെങ്കിലും കട്ടിയുള്ള മൺകൂജ അനങ്ങിയില്ല. കൂജ പൊട്ടിയാൽ അമൂല്യമായ വെള്ളം മണ്ണിലൊഴുകി നഷ്ടപ്പെടുമെന്നും അതിനറിയാമായിരുന്നു.

കാക്ക നിരാശനായില്ല. അത് ശാന്തമായി ചുറ്റും കണ്ണോടിച്ചു. പറമ്പിൽ നടപ്പാതയ്ക്കരികിലായി മിനുസമുള്ള ഒട്ടനവധി ചെറിയ ഉരുളൻ കല്ലുകൾ കിടക്കുന്നത് അതിന്റെ ശ്രദ്ധയിൽപ്പെട്ടു. കാക്കയുടെ മനസ്സിൽ ഒരു സൂത്രം തോന്നി.

അത് വേഗം താഴേക്ക് പറന്ന് കൊക്കിൽ ഒരു ചെറിയ കല്ലെടുത്ത് കൂജയ്ക്കുള്ളിലേക്ക് ഇട്ടു. *പ്ലോപ്പ്!* വെള്ളത്തിന്റെ നിരപ്പ് നേരിയ തോതിൽ ഉയർന്നു. കാക്കയുടെ പ്രതീക്ഷ ഇരട്ടിച്ചു. അത് വീണ്ടും വീണ്ടും പറന്ന് ഓരോ കല്ലുകളായി കൊത്തിക്കൊണ്ടുവന്ന് കൂജയിലിട്ടുകൊണ്ടേയിരുന്നു.

ചൂടും തളർച്ചയും വകവെക്കാതെ കാക്ക നിരന്തരമായി പ്രയത്നിച്ചു. ഒടുവിൽ അമ്പതോളം കല്ലുകൾ ഇട്ടുകഴിഞ്ഞപ്പോൾ കൂജയിലെ തണുത്ത തെളിഞ്ഞ വെള്ളം വക്കോളം ഉയർന്നുപൊങ്ങി!

കാക്ക ആവോളം വെള്ളം കുടിച്ച് ദാഹമകറ്റി. കൃതജ്ഞതയോടെ അത് ആകാശത്തേക്ക് ചിറകടിച്ചുയർന്നു. ബുദ്ധിയും അചഞ്ചലമായ പരിശ്രമവും ഉണ്ടെങ്കിൽ അസാധ്യമായതൊന്നും ഇല്ലെന്ന് കാക്ക തെളിയിച്ചു.`,
    quiz: [
      {
        id: 'q1',
        question: 'കൂജയിലെ വെള്ളം കുടിക്കാൻ കാക്കയ്ക്ക് എന്തായിരുന്നു തടസ്സം?',
        options: ['വെള്ളം വളരെ മലിനമായിരുന്നു', 'വെള്ളം കൂജയുടെ അടിത്തട്ടിലായിരുന്നു, കൊക്ക് എത്തുന്നില്ലായിരുന്നു', 'കൂജയിൽ അടപ്പുണ്ടായിരുന്നു', 'മറ്റു പക്ഷികൾ തടഞ്ഞു'],
        correctIndex: 1,
        explanation: 'കൂജയിൽ വെള്ളം വളരെ താഴെയായിരുന്നതിനാൽ കാക്കയുടെ കൊക്ക് എത്തിയില്ല.'
      },
      {
        id: 'q2',
        question: 'കൂജ തട്ടിമറിക്കാൻ കാക്ക എന്തുകൊണ്ട് തുനിഞ്ഞില്ല?',
        options: ['വെള്ളം മണ്ണിൽ വീണ് പാഴായിപ്പോകും എന്നതിനാൽ', 'കൂജ സ്വർണ്ണത്തിന്റേതായിരുന്നു', 'അതിനൊരു താല്പര്യവുമില്ലായിരുന്നു', 'പേടിയായിരുന്നു'],
        correctIndex: 0,
        explanation: 'മണ്ണിൽ വീണാൽ അമൂല്യമായ വെള്ളം കുടിക്കാൻ കഴിയില്ല.'
      },
      {
        id: 'q3',
        question: 'വെള്ളം മുകളിലേക്ക് എത്തിക്കാൻ കാക്ക എന്ത് ചെയ്തു?',
        options: ['മഴ കാത്തിരുന്നു', 'ചെറിയ ഉരുളൻ കല്ലുകൾ പെറുക്കി കൂജയിലിട്ടു', 'കൂജ അടിച്ചുപൊട്ടിച്ചു', 'മറ്റു പക്ഷികളെ കൂട്ടി'],
        correctIndex: 1,
        explanation: 'കല്ലുകൾ നിരന്തരമായി ഇട്ടതോടെ ജലനിരപ്പ് മുകളിലെത്തി.'
      },
      {
        id: 'q4',
        question: 'ഈ കഥ നൽകുന്ന പ്രധാന പാഠം എന്താണ്?',
        options: ['ശാരീരിക ശക്തിയാണ് വലുത്', 'ബുദ്ധിയും സ്ഥിരോത്സാഹവും കൊണ്ട് ഏതു പ്രതിസന്ധിയും മറികടക്കാം', 'വിധിക്ക് കീഴടങ്ങണം', 'ആരെയും സഹായിക്കരുത്'],
        correctIndex: 1,
        explanation: 'ബുദ്ധിയും ക്ഷമയോടെയുള്ള നിരന്തര പ്രയത്നവും വിജയം തരും.'
      },
      {
        id: 'q5',
        question: '"ദാഹം" എന്ന വാക്കിന്റെ അർത്ഥം എന്താണ്?',
        options: ['വെള്ളം കുടിക്കാനുള്ള ആഗ്രഹം', 'വിശപ്പ്', 'ഉറക്കം', 'സന്തോഷം'],
        correctIndex: 0,
        explanation: 'വെള്ളത്തിനായുള്ള ദാഹത്തെ സൂചിപ്പിക്കുന്നു.'
      }
    ]
  },
  {
    id: 'katha-ml-002',
    storyFamilyId: 'fam-tenali-shadow-thieves',
    title: 'തെന്നാലിരാമനും കിണറ്റിലെ നിധിയും കള്ളന്മാരും',
    normalizedTitle: 'thenaliramanum kinattile nidhiyum kallanmaarum',
    language: 'ml',
    category: 'tenali-raman',
    region: 'വിജയനഗര സാമ്രാജ്യം & തെക്കേ ഇന്ത്യ',
    difficulty: 'intermediate',
    readingTimeMinutes: 4,
    author: 'പരമ്പരാഗത ദക്ഷിണേന്ത്യൻ നാടോടിക്കഥ',
    source: 'തെന്നാലിരാമൻ കഥകൾ',
    shortDescription: 'രാത്രിയിൽ മോഷണത്തിനെത്തിയ കള്ളന്മാരെക്കൊണ്ട് നേരം വെളുക്കുവോളം തന്റെ പച്ചക്കറിത്തോട്ടം നനപ്പിച്ച തെന്നാലിരാമന്റെ രസകരമായ നർമ്മകഥ.',
    moral: 'ആപൽഘട്ടങ്ങളിൽ പതറാതെ മനസ്സാന്നിധ്യത്തോടെ ചിന്തിച്ചാൽ ആപത്തിനെ വലിയ നേട്ടമാക്കി മാറ്റാം.',
    characters: ['തെന്നാലിരാമൻ', 'ഭാര്യ ശാരദ', 'രണ്ടു കള്ളന്മാർ'],
    coverColor: '#16a34a',
    status: 'published',
    createdAt: Date.now() - 86400000 * 8,
    updatedAt: Date.now(),
    content: `വിജയനഗര രാജാവായ കൃഷ്ണദേവരായരുടെ കൊട്ടാരത്തിലെ വിദൂഷകനും അതിസമർത്ഥനുമായ മന്ത്രിയുമായിരുന്നു തെന്നാലിരാമൻ. ഒരു സായാഹ്നത്തിൽ രാമൻ തന്റെ വീട്ടുപറമ്പിൽ നടക്കുമ്പോൾ മുല്ലപ്പന്തലിന് പിന്നിൽ നിന്നൊരു നേരിയ അനക്കം കേട്ടു.

സൂക്ഷിച്ചു നോക്കിയപ്പോൾ കയ്യിൽ കമ്പിപ്പാരയുമായി പതുങ്ങിയിരിക്കുന്ന രണ്ടു കള്ളന്മാരെ രാമൻ കണ്ടു. അർദ്ധരാത്രിയിൽ വീട് കുത്തിത്തുറന്ന് കവർച്ച നടത്താനാണ് അവരുടെ പദ്ധതിയെന്ന് രാമന് ഞൊടിയിടയിൽ മനസ്സിലായി.

രാമൻ ഭയപ്പെട്ടില്ല. അയാൾ നിസ്സാരഭാവത്തിൽ അകത്തു കയറി ഭാര്യ ശാരദയോട് ഉറക്കെ വിളിച്ചുപറഞ്ഞു: "ശാരദേ! അങ്ങാടിയിലെ വാർത്ത നീ അറിഞ്ഞോ? കൊടും കള്ളന്മാർ നഗരത്തിൽ ഇറങ്ങിയിട്ടുണ്ട്! അവർ പ്രമുഖരുടെ വീടുകളിൽ കയറി സ്വർണ്ണാഭരണങ്ങളും വെള്ളിയും മോഷ്ടിക്കുകയാണ്!"

ഇതുകേട്ട് കള്ളന്മാർ ചെവി വട്ടംപിടിച്ചു.

ശാരദ എന്തോ ചോദിക്കാൻ തുടങ്ങിയപ്പോൾ രാമൻ കണ്ണിറുക്കിക്കാണിച്ചു. തുടർന്ന് രാമൻ ശബ്ദമുയർത്തി പറഞ്ഞു: "നമ്മുടെ സ്വർണ്ണമാലകളും വെള്ളിക്കിണ്ണങ്ങളും വീട്ടിൽ സൂക്ഷിക്കുന്നത് ഒട്ടും സുരക്ഷിതമല്ല. അതെല്ലാം ഒരു വലിയ പെട്ടിയിലാക്കി തോട്ടത്തിലെ കിണറ്റിലിട്ടു പൂട്ടിവെക്കാം. ഒരു കള്ളനും അവിടെ നോക്കില്ല!"

തുടർന്ന് രാമനും ഭാര്യയും ചേർന്ന് കല്ലുകളും ഇഷ്ടികക്കഷണങ്ങളും നിറച്ച ഒരു വലിയ മരപ്പെട്ടി വലിച്ചുകൊണ്ടുവന്നു. കല്ലുകൾ തട്ടി വലിയ ശബ്ദമുണ്ടായി. സ്വർണ്ണമാണെന്ന് കരുതി കള്ളന്മാരുടെ കണ്ണുകൾ തിളങ്ങി!

രാമനും ഭാര്യയും കൂടി പെട്ടി കിണറ്റിലേക്ക് എറിഞ്ഞു. *ധും!* എന്ന വലിയ ശബ്ദത്തോടെ പെട്ടി വെള്ളത്തിൽ താഴ്ന്നുപോയി. "ഹാവൂ, ഇനി നമ്മുടെ നിധി സുരക്ഷിതം!" എന്ന് പറഞ്ഞ് രാമൻ വാതിലടച്ച് ഉറങ്ങാൻ കിടന്നു.

അർദ്ധരാത്രിയായപ്പോൾ കള്ളന്മാർ കിണറ്റിൻകരയിലെത്തി. "കിണറ്റിൽ നിറയെ വെള്ളമാണ്. കോരിത്തീർത്താലേ പെട്ടി എടുക്കാൻ പറ്റൂ," കള്ളന്മാർ തീരുമാനിച്ചു.

കള്ളന്മാർ തൊട്ടിയും കയറുമെടുത്ത് കിണറ്റിലെ വെള്ളം കോരി തോട്ടത്തിലേക്ക് ഒഴിക്കാൻ തുടങ്ങി. രാമൻ നേരത്തെ തന്നെ കിണറ്റിൽനിന്ന് മാവിലേക്കും പച്ചക്കറികളിലേക്കും ചാലുകൾ കീറിവെച്ചിരുന്നു! കള്ളന്മാർ കോരിയൊഴിച്ച വെള്ളം തോട്ടത്തിലെ ഓരോ ചെടിയുടെയും ചുവട്ടിലെത്തി.

പുലരുവോളം കള്ളന്മാർ വിയർപ്പൊഴുക്കി കിണർ വറ്റിച്ചു. നേരം പുലർന്നപ്പോൾ കിണറ്റിലെ ചെളിയിൽ കിടന്ന പെട്ടി അവർ കയറുകൊണ്ട് വലിച്ച് കരയ്ക്കുകയറ്റി. പൂട്ടുപൊളിച്ച് നോക്കിയപ്പോൾ അകത്ത് കല്ലുകൾ മാത്രം!

ആ സമയം തെന്നാലിരാമൻ കയ്യിൽ ചൂടുള്ള മോരുമായി ചിരിച്ചുകൊണ്ട് അങ്ങോട്ടുവന്നു: "എന്റെ പ്രിയ സ്നേഹിതരേ! രാത്രി മുഴുവൻ കഷ്ടപ്പെട്ട് എന്റെ തോട്ടം മുഴുവൻ നനച്ചുതന്നതിന് ഒരായിരം നന്ദി! കൊട്ടാരത്തിലെ കാവൽക്കാർ വരുന്നതിനുമുമ്പ് ഈ മോര് കുടിച്ചിട്ട് പോകൂ!"

അമ്പരന്നുപോയ കള്ളന്മാർ ഭയന്നോടി രക്ഷപ്പെട്ടു. രാമന്റെ ബുദ്ധിസാമർത്ഥ്യം കണ്ട് നാട് മുഴുവൻ പുകഴ്ത്തി.`,
    quiz: [
      {
        id: 'q1',
        question: 'തോട്ടത്തിൽ കള്ളന്മാർ ഒളിച്ചിരിപ്പുണ്ടെന്ന് രാമൻ എങ്ങനെയാണ് മനസ്സിലാക്കിയത്?',
        options: ['കാവൽക്കാർ അറിയിച്ചു', 'മുല്ലപ്പന്തലിന് പിന്നിൽ സംശയകരമായ അനക്കം കേട്ട് കണ്ടപ്പോൾ', 'നായ കുരച്ചു', 'കള്ളന്മാർ കത്തെഴുതിവെച്ചു'],
        correctIndex: 1,
        explanation: 'മുല്ലപ്പന്തലിന് പിന്നിൽ അനക്കം കേട്ടാണ് രാമൻ കണ്ടത്.'
      },
      {
        id: 'q2',
        question: 'രാമൻ പെട്ടിയിൽ എന്താണ് നിറച്ചത്?',
        options: ['സ്വർണ്ണനാണയങ്ങൾ', 'കല്ലുകളും ഇഷ്ടികക്കഷണങ്ങളും', 'മണ്ണ്', 'പുല്ല്'],
        correctIndex: 1,
        explanation: 'കല്ലുകളും പൊട്ടിയ ഇഷ്ടികകളും നിറച്ചു.'
      },
      {
        id: 'q3',
        question: 'രാത്രി മുഴുവൻ കള്ളന്മാർ ചെയ്ത ജോലി എന്തായിരുന്നു?',
        options: ['കിണറ്റിലെ വെള്ളം കോരി രാമന്റെ തോട്ടം മുഴുവൻ നനച്ചു', 'വീട് കുത്തിത്തുറന്നു', 'സുരങ്കം ഉണ്ടാക്കി', 'ഉറങ്ങി'],
        correctIndex: 0,
        explanation: 'കിണറ്റിലെ വെള്ളം കോരി തോട്ടം മുഴുവൻ നനപ്പിച്ചു.'
      },
      {
        id: 'q4',
        question: 'രാവിലെ രാമൻ കള്ളന്മാർക്ക് നൽകിയത് എന്തായിരുന്നു?',
        options: ['സ്വർണ്ണം', 'രുചിയുള്ള മോര്', 'ചായ', 'പഴങ്ങൾ'],
        correctIndex: 1,
        explanation: 'നർമ്മത്തോടെ മോര് കുടിക്കാൻ കൊടുത്തു.'
      },
      {
        id: 'q5',
        question: 'ഈ കഥ നൽകുന്ന ഗുണപാഠം എന്താണ്?',
        options: ['മോഷ്ടിക്കുന്നത് നല്ലതാണ്', 'മനസ്സാന്നിധ്യവും ബുദ്ധിയും ഉണ്ടെങ്കിൽ ആപത്തിനെ നേട്ടമാക്കാം', 'തോട്ടം ഉണ്ടാക്കരുത്', 'കിണറ്റിൽ പെട്ടിയിടണം'],
        correctIndex: 1,
        explanation: 'ബുദ്ധിപൂർവ്വമായ മനസ്സാന്നിധ്യം വലിയ ആപത്തിൽ നിന്നും രക്ഷയും നേട്ടവും തരും.'
      }
    ]
  }
];
