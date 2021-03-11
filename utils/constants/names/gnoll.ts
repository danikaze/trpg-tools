import { NameDefinitions } from '.';

type Type = 'name' | 'band';
type Part = 'name' | 'band1' | 'band2';

export const gnollNames: NameDefinitions<Type, Part> = {
  race: 'Gnoll',
  description: `As befits creatures with a language that is little more than
  whines, growls, and shrieks, most gnolls lack a name and would have little
  use for one. Powerful gnolls, usually fangs, pack lords, and flinds, receive
  names directly from Yeenoghu. The same applies to Yeenoghu's blessed
  followers among humans, ores, and other races.`,
  types: {
    name: {
      description: 'Gnoll names',
      parts: ['name'],
    },
    band: {
      description: 'Gnoll War Band names',
      parts: ['band1', 'band2'],
    },
  },
  parts: {
    name: {
      markov: true,
      list: [
        // Volo 36
        'Aargab',
        'Alark',
        'Andak',
        'Ethak ',
        'Eyeth ',
        'Ignar ',
        'Immor',
        'Oduk',
        'Orrom',
        'Otal',
        'Ulthak',
        'Ustar',
      ],
    },
    band1: {
      markov: false,
      list: [
        // Volo 36
        'Abyssal',
        'Dire',
        'Howling',
        'Rabid',
        'Rotted',
        'Screaming',
      ],
    },
    band2: {
      markov: false,
      list: [
        // Volo 36
        'Harbingers',
        'Hunters',
        'Mongrels',
        'Mutilators',
        'Ravagers',
        'Slayers',
      ],
    },
  },
};
