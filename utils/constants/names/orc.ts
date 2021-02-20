import { NameDefinitions } from '.';

type Type = 'male' | 'female';
type Part = 'male' | 'female' | 'epithet';

export const orcNames: NameDefinitions<Type, Part> = {
  race: 'Orc',
  description: `Ore names don't always have meaning in the Ore language,
  and most noteworthy ores are given epithets by their tribe mates.`,
  types: {
    male: {
      description: 'Male orc names',
      parts: ['epithet', 'male'],
    },
    female: {
      description: 'Female orc names',
      parts: ['epithet', 'female'],
    },
  },
  parts: {
    male: [
      // Volo 88
      'Grutok',
      'Lortar',
      'Abzug',
      'Shugog',
      'Urzul',
      'Ruhk',
      'Mobad',
      'Shamog',
      'Mugrub',
      'Bajok',
      'Rhorog',
      'Jahrukk',
    ],
    female: [
      // Volo 88
      'Kansif',
      'Ownka',
      'Emen',
      'Sutha',
      'Myev',
      'Neega',
      'Baggi',
      'Shautha',
      'Ovak',
      'Vola',
      'Engong',
      'Volen',
    ],
    epithet: [
      // Volo 88
      'The Filthy',
      'Skull Cleaver',
      'Eye Gouger',
      'Iron Tusk',
      'Skin Flayer',
      'Bone Crusher',
      'Flesh Ripper',
      'Doom Hammer',
      'Elf Butcher',
      'Spine Snapper',
      'Death Spear',
      'The Brutal',
    ],
  },
};
