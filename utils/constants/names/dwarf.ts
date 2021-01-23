import { NameDefinitions } from '.';

type Type = 'male' | 'female';
type Part = 'male' | 'female' | 'clan';

export const dwarfNames: NameDefinitions<Type, Part> = {
  race: 'Dwarf',
  description: `A dwarf's name is granted by a clan elder, in accordance
    with tradition. Every proper dwarven name has been
    used and reused down through the generations. A
    dwarf's name belongs to the clan, not to the individual.
    A dwarf who misuses or brings shame to a clan name
    is stripped of the name and forbidden by law to use any
    dwarven name in its place.`,
  types: {
    male: {
      description: 'Male dwarf names',
      parts: ['male', 'clan'],
    },
    female: {
      description: 'Female dwarf names',
      parts: ['female', 'clan'],
    },
  },
  parts: {
    male: [
      'Adrik',
      'Alberich',
      'Baern',
      'Barendd',
      'Brottor',
      'Bruenor',
      'Dain',
      'Darrak',
      'Delg',
      'Eberk',
      'Einkil',
      'Fargrim',
      'Flint',
      'Gardain',
      'Harbek',
      'Kildrak',
      'Morgran',
      'Orsik',
      'Oskar',
      'Rangrim',
      'Rurik',
      'Taklinn',
      'Thoradin',
      'Thorin',
      'Tordek',
      'Traubon',
      'Travok',
      'Ulfgar',
      'Veit',
      'Vondal',
    ],
    female: [
      'Amber',
      'Artin',
      'Audhild',
      'Bardryn',
      'Dagnal',
      'Diesa',
      'Eldeth',
      'Falkrunn',
      'Finellen',
      'Gunnloda',
      'Gurdis',
      'Helja',
      'Hlin',
      'Kathra',
      'Kristryd',
      'Ilde',
      'Liftrasa',
      'Mardred',
      'Riswynn',
      'Sann!',
      'Torbera',
      'Torgga',
      'Vistra',
    ],
    clan: [
      'Balderk',
      'Battlehammer',
      'Brawnanvil',
      'Dankil',
      'Fireforge',
      'Frostbeard',
      'Gorunn',
      'Holderhek',
      'Ironfist',
      'Loderr',
      'Lutgehr',
      'Rumnaheim',
      'Strakeln',
      'Torunn',
      'Ungart',
    ],
  },
};
