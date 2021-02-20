import { NameDefinitions } from '.';

type Type = 'name' | 'nickname';
type Part = 'birth' | 'nickname' | 'clan';

export const goliathNames: NameDefinitions<Type, Part> = {
  race: 'Goliath',
  description: `Every goliath has three names: a birth name assigned
  by the newborn's mother and father, a nickname assigned by the
  tribal chief, and a family or clan name. A
  birth name is up to three syllables long. Clan names are
  five syllables or more and end in a vowel.
  Birth names are rarely linked to gender. Goliaths see
  females and males as equal in all things, and they find
  societies with roles divided by gender to be puzzling or
  worthy of mockery. To a goliath, the person who is best
  at a job should be the one tasked with doing it.
  A goliath's nickname is a description that can change
  on the whim of a chieftain or tribal elder. It refers to a
  notable deed, either a success or failure, committed by
  the goliath. Goliaths assign and use nicknames with
  their friends of other races, and change them to refer to
  an individual's notable deeds.
  Goliaths present all three names when identifying
  themselves, in the order of birth name, nickname,
  and clan name. In casual conversation, they use
  their nickname. `,
  types: {
    name: {
      description: 'Male/Female goliath names',
      parts: ['birth', 'clan'],
    },
    nickname: {
      description: 'Nicknames for goliath',
      parts: ['nickname'],
    },
  },
  parts: {
    birth: [
      // Volo 109
      'Aukan',
      'Eglath',
      'Gae-Al',
      'Gauthak',
      'Ilikan',
      'Keothi',
      'Kuori',
      'Lo-Kag',
      'Manneo',
      'Maveith',
      'Nalla',
      'Orilo',
      'Paavu',
      'Pethani',
      'Thalai',
      'Thotham',
      'Uthal',
      'Vaunea',
      'Vimak',
    ],
    nickname: [
      // Volo 109
      'Bearkiller',
      'Dawncaller',
      'Fearless',
      'Flintfinder',
      'Horncarver',
      'Keeneye',
      'Lonehunter',
      'Longleaper',
      'Rootsmasher',
      'Skywatcher',
      'Steadyhand',
      'Threadtwister',
      'Twice-Orphaned',
      'Twistedlimb',
      'Wordpainter',
    ],
    clan: [
      // Volo 109
      'Anakalathai',
      'Elanithino',
      'Gathakanathi',
      'Kalagiano',
      'Katho-Olavi',
      'Kolae-Gileana',
      'Ogolakanu',
      'Thuliaga',
      'Thunukalathi',
      'Vaimei-Laga',
    ],
  },
};
