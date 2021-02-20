import { NameDefinitions } from '.';

type Type = 'name';
type Part = 'name';

export const mindFlayerNames: NameDefinitions<Type, Part> = {
  race: 'Mind Flayer',
  description: `Among mind flayers, thoughts aren't communicated in
  language per se, but are instead transmitted telepathically as concepts
  and associations, which other humanoids interpret in their own language.
  Telepathic communication with a mind flayer is frequently accompanied
  by a mental static that "sounds" to the receiver like an underlying
  sussuration peppered with guttural clicks. The intensity of this static
  increases when a mind flayer refers to itself, because with the saying
  of its name, the illithid is communicating far more information about
  itself than other humanoids can comprehend. The syllables that make up
  mind flayer names as expressed in other languages are thus weak
  approximations of the sound that others hear in their minds when illithids
  refer to themselves.
  An illithid might adopt a name that is easier for minions and allies to
  speak or that makes it seem more fearsome to enemies, but each begins its
  life with a thoughtname such as the examples in the Mind Flayer Names
  table, which are suitable for any campaign. `,
  types: {
    name: {
      description: 'Mind Flayer names',
      parts: ['name'],
    },
  },
  parts: {
    name: [
      // Volo 75
      `Aurangaul`,
      `Cephalossk`,
      `Drukt`,
      `Drusiss`,
      `Lugribossk`,
      `Quoor`,
      `Ralayan`,
      `Sardsult`,
      `S'venchen`,
      `Tharcereli`,
      `Tobulux`,
      `Zellix`,
    ],
  },
};
