import { getUniqueElems } from '@utils/get-unique-elems';
import { beholderNames } from './beholder';
import { dragonbornNames } from './dragonborn';
import { dwarfNames } from './dwarf';
import { elfNames } from './elf';
import { gnollNames } from './gnoll';
import { gnomeNames } from './gnome';
import { goliathNames } from './goliath';
import { hagNames } from './hag';
import { halfOrcNames } from './half-orc';
import { halflingNames } from './halfling';
import { humanNames } from './human';
import { koboldNames } from './kobold';
import { lizardfolkNames } from './lizardfolk';
import { mindFlayerNames } from './mind-flayer';
import { orcNames } from './orc';
import { tabaxiNames } from './tabaxi';
import { tieflingNames } from './tiefling';
import { tritonNames } from './triton';
import { yuantiNames } from './yuan-ti';

export type NameDefinitions<T extends string, P extends string> = {
  race: string;
  description: string;
  types: {
    [type in T]: {
      /** Description to show about the name */
      description: string;
      /** List of parts to use */
      parts: P[];
    };
  };
  parts: {
    [part in P]: {
      /** List of strings to use for this part */
      /** If this list of strings allows applying Markov Chains to it */
      markov: boolean;
      list: string[];
    };
  };
};

export const namesByRace = {
  beholder: beholderNames,
  dragonborn: dragonbornNames,
  dwarf: dwarfNames,
  elf: elfNames,
  gnoll: gnollNames,
  gnome: gnomeNames,
  goliath: goliathNames,
  hag: hagNames,
  halfOrc: halfOrcNames,
  halfling: halflingNames,
  human: humanNames,
  kobold: koboldNames,
  lizardfolk: lizardfolkNames,
  mindFlayer: mindFlayerNames,
  orc: orcNames,
  tabaxi: tabaxiNames,
  tiefling: tieflingNames,
  triton: tritonNames,
  yuanti: yuantiNames,
};

/*
 * because some values might be in more than one book
 * (i.e. PHB names are also in XGE, etc.)
 * when loaded (on server start), remove duplicated
 * ones to give the same probabilities to all of them
 */
Object.values(namesByRace).forEach((definition) => {
  Object.keys(definition.parts).forEach((part) => {
    const parts = definition.parts as Record<string, { list: string[] }>;
    parts[part].list = getUniqueElems(parts[part].list).map((str) =>
      str.trim()
    );
  });
});
