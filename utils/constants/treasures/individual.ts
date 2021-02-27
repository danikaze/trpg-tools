import { TreasureCr } from '.';
import { individual0 } from './individual-0-4';
import { individual5 } from './individual-5-10';
import { individual11 } from './individual-11-16';
import { individual17 } from './individual-17';
import { TableRoller } from '@utils/table-roller';

// DMG page 136
export const individualTreasure: {
  [cr in TreasureCr]: TableRoller<string>;
} = {
  '0-4': individual0,
  '5-10': individual5,
  '11-16': individual11,
  '17+': individual17,
};
