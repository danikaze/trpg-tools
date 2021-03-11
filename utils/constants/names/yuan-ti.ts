import { NameDefinitions } from '.';

type Type = 'name';
type Part = 'name';

export const yuantiNames: NameDefinitions<Type, Part> = {
  race: 'Yuan-ti',
  description: `Yuan-ti names have meanings that have been passed down through
  the generations, although spellings and inflections have changed over time.
  Some yuan-ti add more sibilants to their birth names to create an exaggerated
  hissing sound, based on one's personal preference and whether an individual's
  anatomy can more easily pronounce the name in this altered form. An adopted
  name of this sort is recognized as a variant of the birth name, rather than a
  unique name onto itself. A yuan-ti might refer to itself by its birth name,
  by its adopted name, or (especially among pure-bloods) by a name it borrows
  from the local populace.`,
  types: {
    name: {
      description: 'Yuan-ti names',
      parts: ['name'],
    },
  },
  parts: {
    name: {
      markov: true,
      list: [
        // Volo 99
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
