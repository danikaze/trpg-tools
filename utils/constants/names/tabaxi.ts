import { NameDefinitions } from '.';

type Type = 'name' | 'clan';
type Part = 'name' | 'clan';

export const tabaxiNames: NameDefinitions<Type, Part> = {
  race: 'Tabaxi',
  description: `Each tabaxi has a single name, determined by clan and
  based on a complex formula that involves astrology,
  prophecy, clan history, and other esoteric factors. Tabaxi
  names can apply to both males and females, and
  most use nicknames derived from or inspired by their
  full names. Clan names are usually based on a geographical
  feature located in or near the clan's territory.
  The following list of sample tabaxi names includes
  nicknames in parenthesis. `,
  types: {
    name: {
      description: 'Tabaxi names',
      parts: ['name'],
    },
    clan: {
      description: 'Tabaxi clans',
      parts: ['clan'],
    },
  },
  parts: {
    name: {
      markov: false,
      list: [
        // Volo 114
        'Cloud on the Mountain top (Cloud)',
        'Five Timber (Timber)',
        'Jade Shoe (Jade)',
        'Left-Handed Hummingbird (Bird)',
        'Seven Thundercloud (Thunder)',
        'Skirt of Snakes (Snake)',
        'Smoking Mirror (Smoke)',
      ],
    },
    clan: {
      markov: false,
      list: [
        // Volo 114
        'Bright Cliffs',
        'Distant Rain',
        'Mountain Tree',
        'Rumbling River',
        'Snoring Mountain',
      ],
    },
  },
};
