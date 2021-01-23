import { NameDefinitions } from '.';

type Type = 'male' | 'female';
type Part = 'male' | 'female';

export const halfOrcNames: NameDefinitions<Type, Part> = {
  race: 'Half Orc',
  description: `Half-ores usually have names appropriate to the culture
  in which they were raised. A half-ore who wants to fit in
  among humans might trade an ore name for a human
  name. Some half-ores with human names decide to
  adopt a guttural ore name because they think it makes
  them more intimidating.`,
  types: {
    male: {
      description: 'Male half-orc names',
      parts: ['male'],
    },
    female: {
      description: 'Female half-orc names',
      parts: ['female'],
    },
  },
  parts: {
    male: [
      'Dench',
      'Feng',
      'Gell',
      'Henk',
      'Holg',
      'Imsh',
      'Keth',
      'Krusk',
      'Mhurren',
      'Ront',
      'Shump',
      'Thokk',
    ],
    female: [
      'Baggi',
      'Emen',
      'Engong',
      'Kansif',
      'Myev',
      'Neega',
      'Ovak',
      'Ownka',
      'Shautha',
      'Sutha',
      'Vola',
      'Volen',
      'Yevelda',
    ],
  },
};
