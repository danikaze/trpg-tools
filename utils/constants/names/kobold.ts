import { NameDefinitions } from '.';

type Type = 'name';
type Part = 'name';

export const koboldNames: NameDefinitions<Type, Part> = {
  race: 'Kobold',
  description: `Kobold names are derived from the Draconic tongue
  and usually relate to a characteristic of the owner, such
  as scale color, distinctive body parts, or typical behavior.
  For example, "Red Foot," "White Claw," and "Scurry"
  are Common translations of often-used names. A kobold
  might change its name when it becomes an adult, or add
  additional word-syllables after important events such as
  completing its first hunt, laying its first egg, or surviving
  its first battle. The Kobold Names table presents kobold
  names suitable for any campaign.`,
  types: {
    name: {
      description: 'Kobold names',
      parts: ['name'],
    },
  },
  parts: {
    name: [
      // Volo 66
      'Arix',
      'Eks',
      'Ett',
      'Galax',
      'Garu',
      'Hagnar',
      'Hox',
      'lrtos',
      'Kashak',
      'Meepo',
      'Molo',
      'Ohsoss',
      'Rotom',
      'Sagin',
      'Sik',
      'Sniv',
      'Taklak',
      'Tes',
      'Urak',
      'Varn',
    ],
  },
};
