import { NameDefinitions } from '.';

type Type = 'name';
type Part = 'title' | 'first' | 'last';

export const hagNames: NameDefinitions<Type, Part> = {
  race: 'Hag',
  description: `Hags have whimsical names, often with a dark twist.
  A hag gives her newborn daughter a name that the girl
  keeps during her childhood, but upon gaining her full
  hag powers the daughter chooses her own name, which
  might or might not relate to her birth name. Some hags
  use different names in different guises, but still prefer
  their original name as their favorite.
  The Hag Names table allows you to generate a hag's
  name. You can also select from the table or use it as
  inspiration.
  Hags always have a title followed by a first name, or
  a first name followed by a last name. You can randomly
  determine (equal chance of either) whether a hag has a
  title or a last name. `,
  types: {
    name: {
      description: 'Hag names',
      parts: ['title', 'first', 'last'],
    },
  },
  parts: {
    title: [
      // Volo 55
      'Auntie',
      'Black',
      'Cackling',
      'Dismal',
      'Dread',
      'Driftwood',
      'Granny',
      'Old',
      'Rickety',
      'Rotten',
      'Turtleback',
      'Wicked',
    ],
    first: [
      // Volo 55
      'Agatha',
      'Agnes',
      'Ethel',
      'May',
      'Mathilda',
      'Morgan',
      'Olga',
      'Peggy',
      'Polly',
      'Sally',
      'Ursula',
      'Zilla',
    ],
    last: [
      // Volo 55
      'Bonechewer',
      'Frogwart',
      'Greenteeth',
      'Gristlegums',
      'Knucklebones',
      'Middenheap',
      'Mudwallow',
      'Pigtooth',
      'Titchwillow',
      'Toestealer',
      'Twigmouth',
      'Wormwiggle',
    ],
  },
};
