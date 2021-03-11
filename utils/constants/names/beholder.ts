import { NameDefinitions } from '.';

type Type = 'name';
type Part = 'name';

export const beholderNames: NameDefinitions<Type, Part> = {
  race: 'Beholder',
  description: `A beholder picks its own name, piecing
  together sounds and syllabes that have significance
  and meaning to it.`,
  types: {
    name: {
      description: 'Beholder names',
      parts: ['name'],
    },
  },
  parts: {
    name: {
      markov: true,
      list: [
        // Volo 9
        'Barixis',
        'Chelm',
        'Derukoskai',
        'Edda Ix',
        'Famax',
        'Irv',
        'Jantroph',
        'Khoa',
        'Lanuhsh',
        'Nagish',
        'Orox',
        'Qualnus',
        'Ralakor',
        'Selthdrych',
        'Sokhalsh',
        'Thimnoll',
        'Velxer',
        'Xeo',
        'Zalshox',
        'Zirlarq',
      ],
    },
  },
};
