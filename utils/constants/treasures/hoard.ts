import { TreasureCr } from '.';
import { hoard0 } from './hoard-0-4';
import { hoard5 } from './hoard-5-10';
import { hoard11 } from './hoard-11-16';
import { hoard17 } from './hoard-17';
import { TableRoller } from '@utils/table-roller';

// DMG page 137-139
export const hoardTreasure: {
  [cr in TreasureCr]: TableRoller<string>;
} = {
  '0-4': hoard0,
  '5-10': hoard5,
  '11-16': hoard11,
  '17+': hoard17,
};
