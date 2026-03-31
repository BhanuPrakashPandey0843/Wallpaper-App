export type QuizCategory = 'bible' | 'jesus' | 'old' | 'new' | 'mixed';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface QuizQuestion {
  id: string;
  category: Exclude<QuizCategory, 'mixed'>;
  difficulty: Difficulty;
  question: string;
  options: string[];
  correctIndex: number;
  reference: string;
  explanation: string;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    category: 'bible',
    difficulty: 'easy',
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
];
