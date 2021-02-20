import { NameDefinitions } from '.';
import { phbMale, phbFemale, phbFamily } from './human-parts/phb';
import { arabicMale, arabicFemale } from './human-parts/arabic';
import { celticMale, celticFemale } from './human-parts/celtic';
import { chineseMale, chineseFemale } from './human-parts/chinese';
import { egyptianMale, egyptianFemale } from './human-parts/egyptian';
import { englishMale, englishFemale } from './human-parts/english';
import { frenchMale, frenchFemale } from './human-parts/french';
import { germanMale, germanFemale } from './human-parts/german';
import { greekMale, greekFemale } from './human-parts/greek';
import { indianMale, indianFemale } from './human-parts/indian';
import { japaneseMale, japaneseFemale } from './human-parts/japanese';
import {
  mesoamericanMale,
  mesoamericanFemale,
} from './human-parts/mesoamerican';
import { nigerCongoMale, nigerCongoFemale } from './human-parts/niger-congo';
import { norseMale, norseFemale } from './human-parts/norse';
import { polynesianMale, polynesianFemale } from './human-parts/polynesian';
import { romanMale, romanFemale } from './human-parts/roman';
import { slavicMale, slavicFemale } from './human-parts/slavic';
import { spanishMale, spanishFemale } from './human-parts/spanish';

type Type =
  | 'phbMale'
  | 'phbFemale'
  | 'arabicMale'
  | 'arabicFemale'
  | 'celticMale'
  | 'celticFemale'
  | 'chineseMale'
  | 'chineseFemale'
  | 'egyptianMale'
  | 'egyptianFemale'
  | 'englishMale'
  | 'englishFemale'
  | 'frenchMale'
  | 'frenchFemale'
  | 'germanMale'
  | 'germanFemale'
  | 'greekMale'
  | 'greekFemale'
  | 'indianMale'
  | 'indianFemale'
  | 'japaneseMale'
  | 'japaneseFemale'
  | 'mesoamericanMale'
  | 'mesoamericanFemale'
  | 'nigerCongoMale'
  | 'nigerCongoFemale'
  | 'norseMale'
  | 'norseFemale'
  | 'polynesianMale'
  | 'polynesianFemale'
  | 'romanMale'
  | 'romanFemale'
  | 'slavicMale'
  | 'slavicFemale'
  | 'spanishMale'
  | 'spanishFemale';
type Part =
  | 'phbMale'
  | 'phbFemale'
  | 'phbFamily'
  | 'arabicMale'
  | 'arabicFemale'
  | 'celticMale'
  | 'celticFemale'
  | 'chineseMale'
  | 'chineseFemale'
  | 'egyptianMale'
  | 'egyptianFemale'
  | 'englishMale'
  | 'englishFemale'
  | 'frenchMale'
  | 'frenchFemale'
  | 'germanMale'
  | 'germanFemale'
  | 'greekMale'
  | 'greekFemale'
  | 'indianMale'
  | 'indianFemale'
  | 'japaneseMale'
  | 'japaneseFemale'
  | 'mesoamericanMale'
  | 'mesoamericanFemale'
  | 'nigerCongoMale'
  | 'nigerCongoFemale'
  | 'norseMale'
  | 'norseFemale'
  | 'polynesianMale'
  | 'polynesianFemale'
  | 'romanMale'
  | 'romanFemale'
  | 'slavicMale'
  | 'slavicFemale'
  | 'spanishMale'
  | 'spanishFemale';

export const humanNames: NameDefinitions<Type, Part> = {
  race: 'Human',
  description: `Having so much more variety than other cultures,
  humans as a whole have no typical names. Some human
  parents give their children names from other languages,
  such as Dwarvish or Elvish (pronounced more or less
  correctly), but most parents give names that are linked
  to their region's culture or to the naming traditions of
  their ancestors.
  The material culture and physical characteristics
  of humans can change wildly from region to region.
  In the Forgotten Realms, for example, the clothing,
  architecture, cuisine, music, and literature are different
  in the northwestern lands of the Silver Marches than
  in distant Turmish or Impiltur to the east-and even
  more distinctive in far-off Kara-Tur. Human physical
  characteristics, though, vary according to the ancient
  migrations of the earliest humans, so that the humans
  of the Silver Marches have every possible variation of
  coloration and features.
  In the Forgotten Realms, nine human ethnic groups
  are widely recognized, though over a dozen others are
  found in more localized areas of Faerfin. These groups,
  and the typical names of their members, can be used as
  inspiration no matter which world your human is in`,
  types: {
    phbMale: {
      description: 'Forgotten Realms male human names',
      parts: ['phbMale', 'phbFamily'],
    },
    phbFemale: {
      description: 'Forgotten Realms female human names',
      parts: ['phbFemale', 'phbFamily'],
    },
    arabicMale: {
      description: 'Arabic male human names',
      parts: ['arabicMale'],
    },
    arabicFemale: {
      description: 'Arabic female human names',
      parts: ['arabicFemale'],
    },
    celticMale: {
      description: 'Celtic male human names',
      parts: ['celticMale'],
    },
    celticFemale: {
      description: 'Celtic female human names',
      parts: ['celticFemale'],
    },
    chineseMale: {
      description: 'Chinese male human names',
      parts: ['chineseMale'],
    },
    chineseFemale: {
      description: 'Chinese female human names',
      parts: ['chineseFemale'],
    },
    egyptianMale: {
      description: 'Egyptian male human names',
      parts: ['egyptianMale'],
    },
    egyptianFemale: {
      description: 'Egyptian female human names',
      parts: ['egyptianFemale'],
    },
    englishMale: {
      description: 'English male human names',
      parts: ['englishMale'],
    },
    englishFemale: {
      description: 'English female human names',
      parts: ['englishFemale'],
    },
    frenchMale: {
      description: 'French male human names',
      parts: ['frenchMale'],
    },
    frenchFemale: {
      description: 'French female human names',
      parts: ['frenchFemale'],
    },
    germanMale: {
      description: 'German male human names',
      parts: ['germanMale'],
    },
    germanFemale: {
      description: 'German female human names',
      parts: ['germanFemale'],
    },
    greekMale: {
      description: 'Greek male human names',
      parts: ['greekMale'],
    },
    greekFemale: {
      description: 'Greek female human names',
      parts: ['greekFemale'],
    },
    indianMale: {
      description: 'Indian male human names',
      parts: ['indianMale'],
    },
    indianFemale: {
      description: 'Indian female human names',
      parts: ['indianFemale'],
    },
    japaneseMale: {
      description: 'Japanese male human names',
      parts: ['japaneseMale'],
    },
    japaneseFemale: {
      description: 'Japanese female human names',
      parts: ['japaneseFemale'],
    },
    mesoamericanMale: {
      description: 'Mesoamerican male human names',
      parts: ['mesoamericanMale'],
    },
    mesoamericanFemale: {
      description: 'Mesoamerican female human names',
      parts: ['mesoamericanFemale'],
    },
    nigerCongoMale: {
      description: 'Niger-Congo male human names',
      parts: ['nigerCongoMale'],
    },
    nigerCongoFemale: {
      description: 'Niger-Congo female human names',
      parts: ['nigerCongoFemale'],
    },
    norseMale: {
      description: 'Norse male human names',
      parts: ['norseMale'],
    },
    norseFemale: {
      description: 'Norse female human names',
      parts: ['norseFemale'],
    },
    polynesianMale: {
      description: 'Polynesian male human names',
      parts: ['polynesianMale'],
    },
    polynesianFemale: {
      description: 'Polynesian female human names',
      parts: ['polynesianFemale'],
    },
    romanMale: {
      description: 'Roman male human names',
      parts: ['romanMale'],
    },
    romanFemale: {
      description: 'Roman female human names',
      parts: ['romanFemale'],
    },
    slavicMale: {
      description: 'Slavic male human names',
      parts: ['slavicMale'],
    },
    slavicFemale: {
      description: 'Slavic female human names',
      parts: ['slavicFemale'],
    },
    spanishMale: {
      description: 'Spanish male human names',
      parts: ['spanishMale'],
    },
    spanishFemale: {
      description: 'Spanish female human names',
      parts: ['spanishFemale'],
    },
  },
  parts: {
    phbMale,
    phbFemale,
    phbFamily,
    arabicFemale,
    arabicMale,
    celticMale,
    celticFemale,
    chineseMale,
    chineseFemale,
    egyptianMale,
    egyptianFemale,
    englishMale,
    englishFemale,
    frenchMale,
    frenchFemale,
    germanMale,
    germanFemale,
    greekMale,
    greekFemale,
    indianMale,
    indianFemale,
    japaneseMale,
    japaneseFemale,
    mesoamericanMale,
    mesoamericanFemale,
    nigerCongoMale,
    nigerCongoFemale,
    norseMale,
    norseFemale,
    polynesianMale,
    polynesianFemale,
    romanMale,
    romanFemale,
    slavicMale,
    slavicFemale,
    spanishMale,
    spanishFemale,
  },
};
