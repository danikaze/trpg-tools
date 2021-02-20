import { NameDefinitions } from '.';

type Type = 'name';
type Part = 'name';

export const lizardfolkNames: NameDefinitions<Type, Part> = {
  race: 'Lizardfolk',
  description: `Lizardfolk take their names from the Draconic language.
  They use simple descriptives granted by the tribe
  based on an individual's notable deeds or actions. For
  example, Garurt translates as "axe," a name given to a
  lizardfolk warrior who defeated an ore and claimed his
  foe's weapon. A lizardfolk who likes to hide in a stand of
  reeds before ambushing an animal might be called Achuak, which means "green" to describe how she blends
  into the foliage.
  Lizardfolk make no distinction between male and female in their naming conventions. Each example name
  includes its translation in parenthesis.`,
  types: {
    name: {
      description: 'Lizardfolk names',
      parts: ['name'],
    },
  },
  parts: {
    name: [
      // Volo 113
      'Achuak (green)',
      'Aryte (war)',
      'Baeshra (animal)',
      'Darastrix (dragon)',
      'Garurt (axe)',
      'Irhtos (secret)',
      'Jhank (hammer)',
      'Kepesk (storm)',
      'Kethend (gem)',
      'Korth (danger)',
      'Kosj (small)',
      'Kothar (demon)',
      'Litrix (armor)',
      'Mirik (song)',
      'Othokent (smart)',
      'Sauriv (eye)',
      'Throden (many)',
      'Thurkear (night)',
      'Usk (iron)',
      'Valignat (burn)',
      'Vargach (battle)',
      'Verthica (mountain)',
      'Vutha (black)',
      'Vyth (steel)',
    ],
  },
};
