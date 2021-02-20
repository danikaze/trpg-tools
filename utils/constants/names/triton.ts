import { NameDefinitions } from '.';

type Type = 'male' | 'female';
type Part = 'male' | 'female' | 'surname';

export const tritonNames: NameDefinitions<Type, Part> = {
  race: 'Triton',
  description: `Most triton names have two or three syllables. Male
  names typically end with a vowel and the letter s, and
  female names traditionally end with an n. Tritons use
  their home protectorate as a surname, with the name
  formed by adding a vowel followed by a "th" to the end of
  the protectorate's name.`,
  types: {
    male: {
      description: 'Male triton names',
      parts: ['male'],
    },
    female: {
      description: 'Female triton names',
      parts: ['female'],
    },
  },
  parts: {
    male: [
      // Volo 117
      'Aryn',
      'Belthyn',
      'Duthyn',
      'Feloren',
      'Otanyn',
      'Shalryn',
      'Vlaryn',
      'Wolyn',
    ],
    female: [
      // Volo 117
      'Corus',
      'Delnis',
      'Jhimas',
      'Keros',
      'Molos',
      'Nalos',
      'Vodos',
      'Zunis',
    ],
    surname: [
      // Volo 117
      'Ahlorsath',
      'Pumanath',
      'Vuuvaxath',
    ],
  },
};
