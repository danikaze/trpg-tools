import { NameDefinitions } from '.';

type Type = 'male' | 'female' | 'nickname';
type Part = 'male' | 'female' | 'clan' | 'nickname';

export const gnomeNames: NameDefinitions<Type, Part> = {
  race: 'Gnome',
  description: `Gnomes love names, and most have half a dozen or so.
  A gnome's mother, father, clan elder, aunts, and uncles
  each give the gnome a name, and various nicknames
  from just about everyone else might or might not stick
  over time. Gnome names are typically variants on the
  names of ancestors or distant relatives, though some
  are purely new inventions. When dealing with humans
  and others who are "stuffy" about names, a gnome
  learns to use no more than three names: a personal
  name, a clan name, and a nickname, choosing the one in
  each category that's the most fun to say. `,
  types: {
    male: {
      description: 'Male gnome names',
      parts: ['male', 'clan'],
    },
    female: {
      description: 'Female gnome names',
      parts: ['female', 'clan'],
    },
    nickname: {
      description: 'Nicknames for gnomes',
      parts: ['nickname'],
    },
  },
  parts: {
    male: [
      'Alston',
      'Alvyn',
      'Boddynock',
      'Broce',
      'Burgell',
      'Dimble',
      'Eldon',
      'Erky',
      'Fonkin',
      'Frug',
      'Gerbo',
      'Gimble',
      'Glim',
      'Jebeddo',
      'Kellen',
      'Namfoodle',
      'Orryn',
      'Roondar',
      'Seebo',
      'Sindri',
      'Warryn',
      'Wrenn',
      'Zook',
    ],
    female: [
      'Bimpnottin',
      'Breena',
      'Caramip',
      'Carlin',
      'Donella',
      'Duvamil',
      'Ella',
      'Ellyjobell',
      'Ellywick',
      'Lilli',
      'Loopmottin',
      'Lorilla',
      'Mardnab',
      'Nissa',
      'Nyx',
      'Oda',
      'Orla',
      'Roywyn',
      'Shami!',
      'Tana',
      'Waywocket',
      'Zanna',
    ],
    clan: [
      'Beren',
      'Daergel',
      'Folkor',
      'Garrick',
      'Nackle',
      'Murnig',
      'Ningel',
      'Raulnor',
      'Scheppen',
      'Timbers',
      'Turen',
    ],
    nickname: [
      'Aleslosh',
      'Ashhearth',
      'Badger',
      'Cloak',
      'Doublelock',
      'Filchbatter',
      'Fnipper',
      'Ku',
      'Nim',
      'Oneshoe',
      'Pock',
      'Sparklegem',
      'Stumbleduck',
    ],
  },
};
