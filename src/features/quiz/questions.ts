export type QuizCategory = 'bible' | 'jesus' | 'old' | 'new' | 'mixed';
export type Difficulty = 'easy' | 'medium' | 'hard';

/** Bump when the question bank changes so saved sessions invalidate cleanly */
export const QUESTIONS_BANK_VERSION = 2;

/** Gradient preset for the question hero area (no external assets required) */
export type QuizVisualPreset = 'sunset' | 'desert' | 'night' | 'garden' | 'dawn';

export interface QuizQuestion {
  id: string;
  category: Exclude<QuizCategory, 'mixed'>;
  difficulty: Difficulty;
  question: string;
  options: string[];
  correctIndex: number;
  reference: string;
  explanation: string;
  /** Optional illustration tone — defaults by category when omitted */
  visualPreset?: QuizVisualPreset;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    category: 'bible',
    difficulty: 'easy',
    visualPreset: 'dawn',
    question: 'In which book is John 3:16 found?',
    options: ['John', 'Luke', 'Romans', 'Acts'],
    correctIndex: 0,
    reference: 'John 3:16',
    explanation: 'John 3:16 is one of the central verses about God love and salvation.',
  },
  {
    id: 'q2',
    category: 'old',
    difficulty: 'easy',
    question: 'Who built the ark before the flood?',
    options: ['Abraham', 'Moses', 'Noah', 'David'],
    correctIndex: 2,
    reference: 'Genesis 6:14',
    explanation: 'God instructed Noah to build the ark to preserve life.',
  },
  {
    id: 'q3',
    category: 'new',
    difficulty: 'medium',
    question: 'Who baptized Jesus in the Jordan River?',
    options: ['Peter', 'John the Baptist', 'James', 'Andrew'],
    correctIndex: 1,
    reference: 'Matthew 3:13-17',
    explanation: 'John the Baptist baptized Jesus as part of His earthly ministry beginning.',
  },
  {
    id: 'q4',
    category: 'jesus',
    difficulty: 'medium',
    question: 'How many days did Jesus fast in the wilderness?',
    options: ['7', '14', '30', '40'],
    correctIndex: 3,
    reference: 'Matthew 4:2',
    explanation: 'Jesus fasted forty days and forty nights before being tempted.',
  },
  {
    id: 'q5',
    category: 'bible',
    difficulty: 'hard',
    question: 'Which king asked God for wisdom instead of riches?',
    options: ['Saul', 'Solomon', 'Hezekiah', 'Josiah'],
    correctIndex: 1,
    reference: '1 Kings 3:9-12',
    explanation: 'Solomon asked for a discerning heart to govern God people well.',
  },
  {
    id: 'q6',
    category: 'new',
    difficulty: 'easy',
    question: 'Which disciple walked on water with Jesus briefly?',
    options: ['Peter', 'Thomas', 'Philip', 'Matthew'],
    correctIndex: 0,
    reference: 'Matthew 14:29',
    explanation: 'Peter stepped out in faith and walked toward Jesus on the water.',
  },
  {
    id: 'q7',
    category: 'old',
    difficulty: 'medium',
    visualPreset: 'desert',
    question: 'Who interpreted Pharaoh dreams in Egypt?',
    options: ['Daniel', 'Joseph', 'Aaron', 'Joshua'],
    correctIndex: 1,
    reference: 'Genesis 41:25',
    explanation: 'Joseph interpreted Pharaoh dreams and later became a ruler in Egypt.',
  },
  {
    id: 'q8',
    category: 'jesus',
    difficulty: 'hard',
    question: 'At Cana, what did Jesus turn into wine?',
    options: ['Milk', 'Water', 'Oil', 'Honey'],
    correctIndex: 1,
    reference: 'John 2:7-9',
    explanation: 'Jesus first public miracle transformed water into wine at a wedding.',
  },
  {
    id: 'q9',
    category: 'old',
    difficulty: 'easy',
    visualPreset: 'garden',
    question: 'Who was the first man created according to Genesis?',
    options: ['Noah', 'Adam', 'Abraham', 'Moses'],
    correctIndex: 1,
    reference: 'Genesis 2:7',
    explanation: 'God formed Adam from the dust and breathed life into him.',
  },
  {
    id: 'q10',
    category: 'new',
    difficulty: 'easy',
    visualPreset: 'night',
    question: 'On which day did Jesus rise from the dead?',
    options: ['Friday', 'Saturday', 'Sunday', 'Monday'],
    correctIndex: 2,
    reference: 'Matthew 28:1',
    explanation: 'The resurrection is celebrated on the first day of the week.',
  },
  {
    id: 'q11',
    category: 'jesus',
    difficulty: 'easy',
    visualPreset: 'sunset',
    question: 'Where was Jesus born?',
    options: ['Nazareth', 'Jerusalem', 'Bethlehem', 'Capernaum'],
    correctIndex: 2,
    reference: 'Matthew 2:1',
    explanation: 'Jesus was born in Bethlehem during the time of Herod.',
  },
  {
    id: 'q12',
    category: 'bible',
    difficulty: 'medium',
    visualPreset: 'dawn',
    question: 'Which apostle is known for doubting until he saw Jesus wounds?',
    options: ['Peter', 'Thomas', 'John', 'James'],
    correctIndex: 1,
    reference: 'John 20:27',
    explanation: 'Thomas wanted to see and touch Jesus wounds before believing.',
  },
  {
    id: 'q13',
    category: 'old',
    difficulty: 'hard',
    visualPreset: 'night',
    question: 'Which prophet was taken up to heaven in a whirlwind?',
    options: ['Elijah', 'Elisha', 'Isaiah', 'Jeremiah'],
    correctIndex: 0,
    reference: '2 Kings 2:11',
    explanation: 'Elijah was taken up by a whirlwind into heaven.',
  },
  {
    id: 'q14',
    category: 'new',
    difficulty: 'medium',
    visualPreset: 'garden',
    question: 'Who wrote most of the letters in the New Testament?',
    options: ['Peter', 'John', 'Paul', 'James'],
    correctIndex: 2,
    reference: 'Romans 1:1',
    explanation: 'Paul wrote many epistles to churches and individuals.',
  },
  {
    id: 'q15',
    category: 'jesus',
    difficulty: 'medium',
    visualPreset: 'desert',
    question: 'In the parable, who was the neighbor to the man beaten by robbers?',
    options: ['A priest', 'A Levite', 'A Samaritan', 'A Pharisee'],
    correctIndex: 2,
    reference: 'Luke 10:33',
    explanation: 'The Samaritan showed mercy and cared for the wounded traveler.',
  },
  {
    id: 'q16',
    category: 'bible',
    difficulty: 'hard',
    visualPreset: 'sunset',
    question: 'Which Roman governor sentenced Jesus to crucifixion?',
    options: ['Herod', 'Caesar', 'Pilate', 'Felix'],
    correctIndex: 2,
    reference: 'Matthew 27:26',
    explanation: 'Pilate delivered Jesus to be crucified though he found no fault.',
  },
];
