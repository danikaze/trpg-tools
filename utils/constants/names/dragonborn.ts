import { NameDefinitions } from '.';

type Type = 'child' | 'male' | 'female';
type Part = 'male' | 'female' | 'clan' | 'child';

export const dragonbornNames: NameDefinitions<Type, Part> = {
  race: 'Dragonborn',
  description: `Dragonborn have personal names given at birth,
  but they put their clan names first as a mark of
  honor. A childhood name or nickname is often used
  among clutchmates as a descriptive term or a term
  of endearment. The name might recall an event or
  center on a habit.`,
  types: {
    male: {
      description: 'Male dragonborn names',
      parts: ['male', 'clan'],
    },
    female: {
      description: 'Female dragonborn names',
      parts: ['female', 'clan'],
    },
    child: {
      description: 'Child dragonborn names',
      parts: ['child'],
    },
  },
  parts: {
    male: [
      'Arjhan',
      'Balasar',
      'Bharash',
      'Donaar',
      'Ghesh',
      'Heskan',
      'Kriv',
      'Medrash',
      'Mehen',
      'Nadarr',
      'Pandjed',
      'Patrin',
      'Rhogar',
      'Shamash',
      'Shedinn',
      'Tarhun',
      'Torinn',
    ],
    female: [
      'Akra',
      'Biri',
      'Daar',
      'Farideh',
      'Harann',
      'Havilar',
      'Jheri',
      'Kava',
      'Korinn',
      'Mishann',
      'Nala',
      'Perra',
      'Raiann',
      'Sora',
      'Surina',
      'Thava',
      'Uadjit',
    ],
    clan: [
      'Clethtinthiallor',
      'Daardendrian',
      'Delmirev',
      'Drachedandion',
      'Fenkenkabradon',
      'Kepeshkmolik',
      'Kerrhylon',
      'Kimbatuul',
      'Linxakasendalor',
      'Myastan',
      'Nemmonis',
      'Norixius',
      'Ophinshtalajiir',
      'Prexijandilin',
      'Shestendeliath',
      'Turnuroth',
      'Verthisathurgiesh',
      'Yarjerit',
    ],
    child: [
      'Climber',
      'Earbender',
      'Leaper',
      'Pious',
      'Shieldbiter',
      'Zealous',
    ],
  },
};
