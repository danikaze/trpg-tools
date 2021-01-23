import { NameDefinitions } from '.';

type Type = 'male' | 'female' | 'virtue';
type Part = 'male' | 'female' | 'virtue';

export const tieflingNames: NameDefinitions<Type, Part> = {
  race: 'Tiefling',
  description: `Tiefling names fall into three broad categories. Tieflings
  born into another culture typically have names reflective
  of that culture. Some have names derived from the
  Infernal language, passed down through generations,
  that reflect their fiendish heritage. And some younger
  tieflings, striving to find a place in the world, adopt a
  name that signifies a virtue or other concept and then
  try to embody that concept. For some, the chosen name
  is a noble quest. For others, it's a grim destiny. `,
  types: {
    male: {
      description: 'Male infernal names',
      parts: ['male'],
    },
    female: {
      description: 'Female infernal names',
      parts: ['female'],
    },
    virtue: {
      description: 'Virtue tiefling names',
      parts: ['virtue'],
    },
  },
  parts: {
    male: [
      'Akmenos',
      'Amnon',
      'Barakas',
      'Damakos',
      'Ekemon',
      'Iados',
      'Kairon',
      'Leucis',
      'Melech',
      'Mordai',
      'Morthos',
      'Pelaios',
      'Skamos',
      'Therai',
    ],
    female: [
      'Akta',
      'Anakis',
      'Bryseis',
      'Criella',
      'Damaia',
      'Ea',
      'Kallista',
      'Lerissa',
      'Makaria',
      'Nemeia',
      'Orianna',
      'Phelaia',
      'Rieta',
    ],
    virtue: [
      'Art',
      'Carrion',
      'Chant',
      'Creed',
      'Despair',
      'Excellence',
      'Fear',
      'Glory',
      'Hope',
      'Ideal',
      'Music',
      'Nowhere',
      'Open',
      'Poetry',
      'Quest',
      'Random',
      'Reverence',
      'Sorrow',
      'Temerity',
      'Torment',
      'Weary',
    ],
  },
};
