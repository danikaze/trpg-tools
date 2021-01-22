import { NameDefinitions } from '.';

type Type = 'male' | 'female';
type Part = 'male' | 'female' | 'family';

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
    male: {
      description: 'Male human names',
      parts: ['male', 'family'],
    },
    female: {
      description: 'Female human names',
      parts: ['female', 'family'],
    },
  },
  parts: {
    male: [
      // Calishite
      'Aseir',
      'Bardeid',
      'Haseid',
      'Khemed',
      'Mehmen',
      'Sudeiman',
      'Zasheir',
      // Chondathan
      'Darvin',
      'Dorn',
      'Evendur',
      'Gorstag',
      'Grim',
      'Helm',
      'Malark',
      'Morn',
      'Randal',
      'Stedd',
      // Damaran
      'Bor',
      'Fode!',
      'Glar',
      'Grigor',
      'Igan',
      'Ivor',
      'Kosef',
      'Mival',
      'Orel',
      'Pavel',
      'Sergor',
      // Illuskan
      'Ander',
      'Blath',
      'Bran',
      'Frath',
      'Geth',
      'Lander',
      'Luth',
      'Malcer',
      'Star',
      'Taman',
      'Urth',
      // Mulan
      'Aoth',
      'Bareris',
      'Ehput-Ki',
      'Kethoth',
      'Mumed',
      'Ramas',
      'So-Kehur',
      'Thazar-De',
      'Urhur',
      // Rashemi
      'Borivik',
      'Faurgar',
      'Jandar',
      'Kanithar',
      'Madislak',
      'Ralmevik',
      'Shaumar',
      'Vladislak',
      // Shou
      'An',
      'Chen',
      'Chi',
      'Fai',
      'Jiang',
      'Jun',
      'Lian',
      'Long',
      'Meng',
      'On',
      'Shan',
      'Shui',
      'Wen',
      // Turami
      'Anton',
      'Diero',
      'Marcon',
      'Pieron',
      'Rimardo',
      'Romero',
      'Salazar',
      'Umbero',
    ],
    female: [
      // Calishite
      'Atala',
      'Ceidil',
      'Hama',
      'jasmal',
      'Meilil',
      'Seipora',
      'Yasheira',
      'Zasheida',
      // Chondathan
      'Arveene',
      'Esvele',
      'Jhessail',
      'Kerri',
      'Lureene',
      'Miri',
      'Rowan',
      'Shandri',
      'Tessele',
      // Damaran
      'Alethra',
      'Kara',
      'Katernin',
      'Mara',
      'Natali',
      'Olma',
      'Tana',
      'Zora',
      // Illuskan
      'Amafrey',
      'Betha',
      'Cefrey',
      'Kethra',
      'Mara',
      'Olga',
      'Silifrey',
      'Westra',
      // Mulan
      'Arizima',
      'Chathi',
      'Nephis',
      'Nulara',
      'Murithi',
      'Sefris',
      'Thola',
      'Umara',
      'Zolis',
      // Rashemi
      'Fyevarra',
      'Hulmarra',
      'Immith',
      'Imzel',
      'Navarra',
      'Shevarra',
      'Tammith',
      'Yuldra',
      // Shou
      'Bai',
      'Chao',
      'Jia',
      'Lei',
      'Mei',
      'Qiao',
      'Shui',
      'Tai',
      // Turami
      'Balama',
      'Dona',
      'Faila',
      'Jalana',
      'Luisa',
      'Marta',
      'Quara',
      'Selise',
      'Vonda',
    ],
    family: [
      // Calishite
      'Basha',
      'Dumein',
      'Jassan',
      'Khalid',
      'Mostana',
      'Pashar',
      'Rein',
      // Chondathan
      'Amblecrown',
      'Buckman',
      'Dundragon',
      'Evenwood',
      'Greycastle',
      'Tallstag',
      // Damaran
      'Bersk',
      'Chernin',
      'Dotsk',
      'Kulenov',
      'Marsk',
      'Nemetsk',
      'Shemov',
      'Starag',
      // Illuskan
      'Brightwood',
      'Helder',
      'Hornraven',
      'Lackman',
      'Stormwind',
      'Windrivver',
      // Mulan
      'Ankhalab',
      'Anskuld',
      'Fezim',
      'Hahpet',
      'Nathandem',
      'Sepret',
      'Uuthrakt',
      // Rashemi
      'Chergoba',
      'Dyernina',
      'Iltazyara',
      'Murnyethara',
      'Stayanoga',
      'Ulmokina',
      // Shou
      'Chien',
      'Huang',
      'Kao',
      'Kung',
      'Lao',
      'Ling',
      'Mei',
      'Pin',
      'Shin',
      'Sum',
      'Tan',
      'Wan',
      // Turami
      'Agosto',
      'Astoria',
      'Calabra',
      'Domine',
      'Palone',
      'Marivaldi',
      'Pisacar',
      'Ramonda',
    ],
  },
};
