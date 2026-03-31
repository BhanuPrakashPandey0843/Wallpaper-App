export interface BibleChapter {
  chapter: number;
  verses: string[];
}

export interface BibleBook {
  id: string;
  name: string;
  chapters: BibleChapter[];
}

export const BIBLE_BOOKS: BibleBook[] = [
  {
    id: 'genesis',
    name: 'Genesis',
    chapters: [
      {
        chapter: 1,
        verses: [
          'In the beginning God created the heaven and the earth.',
          'And the earth was without form, and void; and darkness was upon the face of the deep.',
          'And God said, Let there be light: and there was light.',
        ],
      },
      {
        chapter: 2,
        verses: [
          'Thus the heavens and the earth were finished, and all the host of them.',
          'And on the seventh day God ended his work which he had made.',
          'And God blessed the seventh day, and sanctified it.',
        ],
      },
    ],
  },
  {
    id: 'psalms',
    name: 'Psalms',
    chapters: [
      {
        chapter: 23,
        verses: [
          'The Lord is my shepherd; I shall not want.',
          'He maketh me to lie down in green pastures: he leadeth me beside the still waters.',
          'He restoreth my soul: he leadeth me in the paths of righteousness for his name sake.',
        ],
      },
      {
        chapter: 46,
        verses: [
          'God is our refuge and strength, a very present help in trouble.',
          'Therefore will not we fear, though the earth be removed.',
          'Be still, and know that I am God.',
        ],
      },
    ],
  },
  {
    id: 'john',
    name: 'John',
    chapters: [
      {
        chapter: 3,
        verses: [
          'For God so loved the world, that he gave his only begotten Son.',
          'For God sent not his Son into the world to condemn the world; but that the world through him might be saved.',
          'He that believeth on him is not condemned.',
        ],
      },
      {
        chapter: 14,
        verses: [
          'Let not your heart be troubled: ye believe in God, believe also in me.',
          'In my Fathers house are many mansions.',
          'I am the way, the truth, and the life: no man cometh unto the Father, but by me.',
        ],
      },
    ],
  },
];
