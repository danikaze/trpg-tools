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
      description: string;
      parts: P[];
    };
  };
  parts: {
    [part in P]: string[];
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
    const parts = definition.parts as { [key: string]: string[] };
    parts[part] = getUniqueElems(parts[part]);
  });
});
