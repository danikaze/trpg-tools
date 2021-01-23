import { dragonbornNames } from './dragonborn';
import { dwarfNames } from './dwarf';
import { elfNames } from './elf';
import { gnomeNames } from './gnome';
import { goliathNames } from './goliath';
import { halfOrcNames } from './half-orc';
import { halflingNames } from './halfling';
import { humanNames } from './human';
import { lizardfolkNames } from './lizardfolk';
import { tabaxiNames } from './tabaxi';
import { tieflingNames } from './tiefling';
import { tritonNames } from './triton';

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
  dragonborn: dragonbornNames,
  dwarf: dwarfNames,
  elf: elfNames,
  gnome: gnomeNames,
  goliath: goliathNames,
  halfOrc: halfOrcNames,
  halfling: halflingNames,
  human: humanNames,
  lizardfolk: lizardfolkNames,
  tabaxi: tabaxiNames,
  tiefling: tieflingNames,
  triton: tritonNames,
};
