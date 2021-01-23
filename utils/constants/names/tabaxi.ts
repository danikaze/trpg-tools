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
      description: 'Lizardfolk names',
      parts: ['name'],
    },
    clan: {
      description: 'Lizardfolk clans',
      parts: ['clan'],
    },
  },
  parts: {
    name: [
      'CloudontheMountaintop(Cloud)',
      'FiveTimber(Timber)',
      'JadeShoeQade)',
      'Left-HandedHummingbird(Bird)',
      'SevenThundercloud(Thunder)',
      'SkirtofSnakes(Snake)',
      'SmokingMirror(Smoke)',
    ],
    clan: [
      'BrightCliffs',
      'DistantRain',
      'MountainTree',
      'RumblingRiver',
      'SnoringMountain',
    ],
  },
};
