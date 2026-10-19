export interface ReadingQuestion {
  id: string;
  type: 'mcq' | 'true_false' | 'fill_blank' | 'vocabulary';
  question: string;
  options: string[];
  correctAnswer: string | number; // index or exact text
  explanation: string;
}

export interface ReadingPassage {
  id: string;
  title: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  lengthCategory: 'short' | 'long';
  wordCount: number;
  estimatedMinutes: number;
  category: string;
  passageText: string;
  questions: ReadingQuestion[];
}

export const READING_PASSAGES: ReadingPassage[] = [
  {
    id: 'passage-01',
    title: 'The Great Banyan Tree of Kolkata',
    difficulty: 'beginner',
    lengthCategory: 'short',
    wordCount: 185,
    estimatedMinutes: 2,
    category: 'Nature & Heritage',
    passageText: `In the Acharya Jagadish Chandra Bose Indian Botanic Garden near Kolkata, there stands a living wonder of the natural world: The Great Banyan Tree. Over two hundred and fifty years old, this colossal tree looks less like a single plant and more like an entire forest.

What makes the Great Banyan extraordinary is its aerial roots. These roots grow downwards from the branches into the ground, taking root and forming thick, sturdy wooden pillars that resemble independent tree trunks. Over the centuries, the original main trunk decayed after being struck by two severe cyclones in the nineteenth century, but the tree did not perish. Instead, its crown continues to spread across more than three and a half acres through thousands of aerial prop roots.

Today, visitors walking beneath its vast green canopy feel as though they are strolling through a magnificent vaulted green cathedral. The tree provides shelter to countless species of birds, monkeys, squirrels, and insects, standing as a timeless symbol of Indian ecological resilience and natural splendor.`,
    questions: [
      {
        id: 'p1-q1',
        type: 'mcq',
        question: 'Where is the Great Banyan Tree located?',
        options: [
          'In the Indian Botanic Garden near Kolkata',
          'In the Sundarbans Mangrove Forest',
          'At the foot of the Himalayas',
          'In the Western Ghats'
        ],
        correctAnswer: 0,
        explanation: 'The passage explicitly mentions it is in the Acharya Jagadish Chandra Bose Indian Botanic Garden near Kolkata.'
      },
      {
        id: 'p1-q2',
        type: 'true_false',
        question: 'True or False: The tree died completely when its original main trunk decayed in the 19th century.',
        options: ['True', 'False'],
        correctAnswer: 1,
        explanation: 'False. The passage states: "the tree did not perish. Instead, its crown continues to spread... through thousands of aerial prop roots."'
      },
      {
        id: 'p1-q3',
        type: 'fill_blank',
        question: 'The aerial roots grow downwards from the branches and take root to form sturdy wooden ________.',
        options: ['branches', 'pillars', 'flowers', 'vines'],
        correctAnswer: 1,
        explanation: 'The text describes them forming "thick, sturdy wooden pillars that resemble independent tree trunks."'
      },
      {
        id: 'p1-q4',
        type: 'vocabulary',
        question: 'In the passage, the word "colossal" most nearly means:',
        options: ['Extremely ancient and fragile', 'Gigantic and immense in size', 'Colorful and attractive', 'Dangerous'],
        correctAnswer: 1,
        explanation: '"Colossal" means extraordinarily large, vast, or gigantic.'
      }
    ]
  },
  {
    id: 'passage-02',
    title: 'The Architectural Genius of Thanjavur Brihadisvara Temple',
    difficulty: 'intermediate',
    lengthCategory: 'long',
    wordCount: 340,
    estimatedMinutes: 3,
    category: 'History & Architecture',
    passageText: `Built more than a millennium ago by the visionary Chola Emperor Raja Raja Chola I, the Brihadisvara Temple in Thanjavur stands as one of the most astonishing architectural achievements in human civilization. Completed in 1010 CE, this temple, affectionately known as the "Big Temple" or Rajarajeswaram, represents the zenith of Dravidian temple architecture.

The temple\'s central tower, or Vimana, soars over 216 feet into the sky. For centuries, it remained among the tallest structures in South Asia. What baffles modern engineers is that the entire temple was constructed exclusively from interlocking blocks of hard granite, a stone so durable that it resists weathering for millennia. Intriguingly, there are no granite quarries within fifty miles of Thanjavur! Historians suggest that thousands of elephants and river rafts were utilized to transport millions of tons of heavy stone blocks across rivers and rugged terrain.

Perched atop the soaring Vimana is the majestic Kumbam—a monolithic octagonal stone dome weighing approximately eighty tons. The engineering ingenuity required to lift an eighty-ton granite monolith to a height of sixty-six meters without modern cranes or hydraulic engines is breathtaking. Chola master masons constructed an inclined earthen ramp extending over four miles from a neighboring village. Elephant teams and wooden rollers gradually hauled the colossal capstone up the gentle gradient to its final resting place.

Moreover, the temple was designed to be seismically resilient without using mortar. Its interlocking stone blocks allow minor tectonic energy to dissipate without structural collapse. Recognized as a UNESCO World Heritage site, the Brihadisvara Temple remains not only an active house of spiritual worship but also an enduring monument to classical Indian science, mathematics, astronomy, and architectural brilliance.`,
    questions: [
      {
        id: 'p2-q1',
        type: 'mcq',
        question: 'Who commissioned the construction of the Brihadisvara Temple?',
        options: ['Emperor Ashoka', 'Raja Raja Chola I', 'Krishnadevaraya', 'Chandragupta Maurya'],
        correctAnswer: 1,
        explanation: 'The passage states it was built by Chola Emperor Raja Raja Chola I, completed in 1010 CE.'
      },
      {
        id: 'p2-q2',
        type: 'mcq',
        question: 'What geographical puzzle intrigued historians regarding the temple’s construction material?',
        options: [
          'Granite does not exist anywhere in India',
          'There were no granite quarries within fifty miles of Thanjavur',
          'The stones were imported from Rome',
          'The temple was carved from a single mountain'
        ],
        correctAnswer: 1,
        explanation: 'There were no granite quarries nearby; heavy stone blocks had to be transported over 50 miles.'
      },
      {
        id: 'p2-q3',
        type: 'fill_blank',
        question: 'To raise the 80-ton Kumbam, Chola engineers built an inclined earthen ________ extending over four miles.',
        options: ['bridge', 'ramp', 'tunnel', 'staircase'],
        correctAnswer: 1,
        explanation: 'An inclined earthen ramp extending over four miles was built to haul the stone up with elephants.'
      },
      {
        id: 'p2-q4',
        type: 'true_false',
        question: 'True or False: Modern cement and mortar were heavily used to cement the granite blocks together.',
        options: ['True', 'False'],
        correctAnswer: 1,
        explanation: 'False. The temple was built with interlocking stone blocks without mortar, making it seismically resilient.'
      },
      {
        id: 'p2-q5',
        type: 'vocabulary',
        question: 'In the passage, the word "zenith" most nearly means:',
        options: ['The lowest point of decline', 'The highest or crowning point of success and perfection', 'The beginning phase', 'An accidental discovery'],
        correctAnswer: 1,
        explanation: '"Zenith" refers to the peak or pinnacle of achievement.'
      }
    ]
  },
  {
    id: 'passage-03',
    title: 'The Linguistic Wonder of Multilingual Cognitive Flexibility',
    difficulty: 'advanced',
    lengthCategory: 'long',
    wordCount: 410,
    estimatedMinutes: 4,
    category: 'Cognitive Science & Linguistics',
    passageText: `In an era defined by global communication, neuroscience has revealed extraordinary insights into the cognitive architecture of multilingual individuals. For decades in the early twentieth century, flawed pedagogical theories posited that learning multiple languages simultaneously might overburden a child\'s linguistic faculty or impede academic performance. Modern neuroimaging, however, has dismantled this misconception, illuminating profound neural benefits accrued from bilingual and multilingual acquisition.

When an individual regularly operates in two or more languages—such as switching effortlessly between English, Hindi, Tamil, or Malayalam in an Indian household—their brain constantly engages in a sophisticated process known as cognitive control. Specifically, the prefrontal cortex, which governs executive function, must inhibit words from the inactive language while simultaneously retrieving relevant phonemes, syntax, and semantics from the target tongue. 

This continuous mental workout strengthens what cognitive psychologists term the "bilingual advantage." Multilingual individuals consistently exhibit superior performance in tasks demanding task-switching, selective attention, and abstract problem-solving. Because their neural pathways are conditioned to filter distracting stimuli and pivot between disparate linguistic frameworks, their executive control networks demonstrate heightened plasticity and efficiency.

Furthermore, long-term epidemiological studies conducted by neuroscientists demonstrate that habitual multilingualism confers substantial cognitive reserve. When neurodegenerative pathologies such as Alzheimer\'s disease arise, the enriched neural connectivity in multilingual brains often compensates for structural damage, delaying the symptomatic onset of dementia by an estimated four to five years compared to monolinguals.

Far from being a mere cultural convenience, fluency in multiple languages fundamentally reorganizes neuroplasticity. Each new lexicon acquired constructs novel conceptual bridges, fostering empathy, cognitive resilience, and intellectual longevity across a lifetime.`,
    questions: [
      {
        id: 'p3-q1',
        type: 'mcq',
        question: 'Which region of the brain is primarily responsible for executive control and language switching?',
        options: ['The cerebellum', 'The prefrontal cortex', 'The occipital lobe', 'The brainstem'],
        correctAnswer: 1,
        explanation: 'The passage notes that the prefrontal cortex governs executive function and linguistic cognitive control.'
      },
      {
        id: 'p3-q2',
        type: 'true_false',
        question: 'True or False: Early 20th-century theories wrongly suggested that learning multiple languages harmed a child\'s intellect.',
        options: ['True', 'False'],
        correctAnswer: 0,
        explanation: 'True. Early theories posited that multilingualism might overburden linguistic faculty, which modern neuroscience has debunked.'
      },
      {
        id: 'p3-q3',
        type: 'mcq',
        question: 'What health benefit does multilingual cognitive reserve provide regarding neurodegenerative conditions like Alzheimer’s?',
        options: [
          'It permanently eliminates any chance of memory loss',
          'It delays the symptomatic onset of dementia by four to five years',
          'It reduces the need for physical exercise',
          'It allows people to sleep less'
        ],
        correctAnswer: 1,
        explanation: 'The text highlights that enriched neural connectivity delays the symptomatic onset of dementia by an estimated 4 to 5 years.'
      },
      {
        id: 'p3-q4',
        type: 'vocabulary',
        question: 'The word "plasticity" in the context of neuroscience refers to:',
        options: [
          'Synthetic materials used in brain surgery',
          'The brain\'s ability to adapt, reorganize, and form new neural pathways',
          'Rigid and unchangeable mental habits',
          'The speed of blood flow'
        ],
        correctAnswer: 1,
        explanation: 'Neural plasticity is the capacity of the nervous system to modify its connections and behavior in response to learning and experience.'
      },
      {
        id: 'p3-q5',
        type: 'fill_blank',
        question: 'When speaking one language, the brain must ________ words from the inactive language.',
        options: ['shout', 'inhibit', 'translate', 'destroy'],
        correctAnswer: 1,
        explanation: 'The prefrontal cortex must "inhibit words from the inactive language while simultaneously retrieving relevant phonemes."'
      }
    ]
  }
];
