import { NameDefinitions } from '.';

type Type = 'male' | 'female';
type Part = 'male' | 'female' | 'family';

export const halflingNames: NameDefinitions<Type, Part> = {
  race: 'Halfling',
  description: `A halfling has a given name, a family name, and possibly
  a nickname. Family names are often nicknames that
  stuck so tenaciously they have been passed down
  through the generations`,
  types: {
    male: {
      description: 'Male halfling names',
      parts: ['male', 'family'],
    },
    female: {
      description: 'Female halfling names',
      parts: ['female', 'family'],
    },
  },
  parts: {
    male: [
      'Alton',
      'Ander',
      'Cade',
      'Corrin',
      'Eldon',
      'Errich',
      'Finnan',
      'Garret',
      'Linda!',
      'Lyle',
      'Merrie',
      'Milo',
      'Osborn',
      'Perrin',
      'Reed',
      'Roscoe',
      'Wellby',
    ],
    female: [
      'Andry',
      'Bree',
      'Callie',
      'Cora',
      'Euphemia',
      'Jillian',
      'Kithri',
      'Lavinia',
      'Lidda',
      'Merla',
      'Nedda',
      'Paela',
      'Portia',
      'Seraphina',
      'Shaena',
      'Trym',
      'Vani',
      'Verna',
    ],
    family: [
      'Brushgather',
      'Goodbarrel',
      'Greenbottle',
      'High-hill',
      'Hilltopple',
      'Leagallow',
      'Tealeaf',
      'Thorngage',
      'Tosscobble',
      'Underbough',
    ],
  },
};
