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
    male: {
      markov: true,
      list: [
        // PHB
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
        // XGE 178
        'Alston',
        'Alvyn',
        'Anverth',
        'Arumawann',
        'Bilbron',
        'Boddynock',
        'Broce',
        'Burgell',
        'Cockaby',
        'Crampernap',
        'Dabbledob',
        'Delebean',
        'Dimble',
        'Eberdeb',
        'Eldon',
        'Erky',
        'Fabien',
        'Fibblestib',
        'Fonkin',
        'Frouse',
        'Frug',
        'Gerbo',
        'Gimble',
        'Glim',
        'lgden',
        'Jabbie',
        'jebeddo',
        'Kellen',
        'Kipper',
        'Namfoodle',
        'Oppleby',
        'Orryn',
        'Paggen',
        'Pallabar',
        'Pog',
        'Qualen',
        'Ribbles',
        'Rimple',
        'Roondar',
        'Sapply',
        'Seebo',
        'Senteq',
        'Sindri',
        'Umpen',
        'Wa rryn',
        'Wiggens',
        'Wobbles',
        'Wrenn',
        'Zaffrab',
        'Zook',
      ],
    },
    female: {
      markov: true,
      list: [
        // PHB
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
        'Shamil',
        'Tana',
        'Waywocket',
        'Zanna',
        // XGE 178
        'Abalaba',
        'Bimpnottin',
        'Breena',
        'Buvvie',
        'Callybon',
        'Caramip',
        'Carlin',
        'Cumpen',
        'Dalaba',
        'Donella',
        'Duvamil',
        'Ella',
        'Ellyjoybell',
        'Ellywick',
        'Enidda',
        'Lilli',
        'Loopmottin',
        'Lorilla',
        'Luthra',
        'Mardnab',
        'Meena',
        'Menny',
        'Mumpena',
        'Nissa',
        'Numba',
        'Nyx',
        'Oda',
        'Oppah',
        'Orla',
        'Panana',
        'Pyntle',
        'Quilla',
        'Ranala',
        'Reddlepop',
        'Roywyn',
        'Salanop',
        'Shamil',
        'Siffress',
        'Symma',
        'Tana',
        'Tenena',
        'Tervaround',
        'Tippletoe',
        'Ulla',
        'Unvera',
        'Veloptima',
        'Virra',
        'Waywocket',
        'Yebe',
        'Zanna',
      ],
    },
    clan: {
      markov: true,
      list: [
        // PHB
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
        // XNE 178
        'Albaratie',
        'Bafflestone',
        'Beren',
        'Boondiggles',
        'Cobblelob',
        'Daergel',
        'Dunben',
        'Fabblestabble',
        'Fapplestamp',
        'Fiddlefen',
        'Folkor',
        'Garrick',
        'Gimlen',
        'Glittergem',
        'Gobblefirn',
        'Gummen',
        'Horcusporcus',
        'Humplebumple',
        'lronhide',
        'Leffery',
        'Lingenhall',
        'Loofollue',
        'Maekkelferce',
        'Miggledy',
        'Munggen',
        'Murnig',
        'Musgraben',
        'Nackle',
        'Ningel',
        'Nopenstallen',
        'Nucklestamp',
        'Offund',
        'Oomtrowl',
        'Pilwicken',
        'Pingun',
        'Quillsharpener',
        'Raulnor',
        'Reese',
        'Rofferton',
        'Scheppen',
        'Shadowcloak',
        'Silverthread',
        'Sympony',
        'Tarkelby',
        'Timbers',
        'Turen',
        'Umbodoben',
        'Waggletop',
        'Welber',
        'Wildwander',
      ],
    },
    nickname: {
      markov: false,
      list: [
        // PHB
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
  },
};
