import { NameDefinitions } from '.';

type Type = 'male' | 'female' | 'child';
type Part = 'male' | 'female' | 'family' | 'child';

export const elfNames: NameDefinitions<Type, Part> = {
  race: 'Elf',
  description: `Elves are considered children until they declare
  themselves adults, some time after the hundredth
  birthday, and before this period they are called
  by child names.
  On declaring adulthood, an elf selects an adult name,
  although those who knew him or her as a youngster
  might continue to use the child name. Each elf's adult
  name is a unique creation, though it might reflect
  the names of respected individuals or other family
  members. Little distinction exists between male
  names and female names; the groupings here reflect
  only general tendencies. In addition, every elf bears a
  family name, typically a combination of other Elvish
  words. Some elves traveling among humans translate
  their family names into Common, but others retain the
  Elvish version`,
  types: {
    male: {
      description: 'Male elf names',
      parts: ['male', 'family'],
    },
    female: {
      description: 'Female elf names',
      parts: ['female', 'family'],
    },
    child: {
      description: 'Child elf names',
      parts: ['child'],
    },
  },
  parts: {
    male: [
      'Adran',
      'Aelar',
      'Aramil',
      'Arannis',
      'Aust',
      'Beiro',
      'Berrian',
      'Carrie',
      'Enialis',
      'Erdan',
      'Erevan',
      'Galinndan',
      'Hadarai',
      'Heian',
      'Himo',
      'Immeral',
      'Ivellios',
      'Laucian',
      'Mindartis',
      'Paelias',
      'Peren',
      'Quarion',
      'Riardon',
      'Rolen',
      'Soveliss',
      'Thamior',
      'Tharivol',
      'Theren',
      'Varis',
    ],
    female: [
      'Adrie',
      'Althaea',
      'Anastrianna',
      'Andraste',
      'Antinua',
      'Bethrynna',
      'Birel',
      'Caelynn',
      'Drusilia',
      'Enna',
      'Felosial',
      'Ielenia',
      'Jelenneth',
      'Keyleth',
      'Leshanna',
      'Lia',
      'Meriele',
      'Mialee',
      'Naivara',
      'Quelenna',
      'Quillathe',
      'Sariel',
      'Shanairra',
      'Shava',
      'Silaqui',
      'Theirastra',
      'Thia',
      'Vadania',
      'Valanthe',
      'Xanaphia',
    ],
    family: [
      'Amakiir',
      'Amastacia',
      'Galanodel',
      'Holimion',
      'Ilphelkiir',
      'Liadon',
      'Meliamne',
      'Nallo',
      'Siannodel',
      'Xiloscient',
    ],
    child: [
      'Ara',
      'Bryn',
      'Del',
      'Eryn',
      'Faen',
      'Innil',
      'Lael',
      'Mella',
      'Naill',
      'Naeris',
      'Phann',
      'Rael',
      'Rinn',
      'Sai',
      'Syllin',
      'Thia',
      'Vall',
    ],
  },
};
