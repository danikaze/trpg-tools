import {
  TreasureGeneratorType,
  TreasureCr,
  Treasure,
} from '@utils/constants/treasures';
import { individualTreasure } from '@utils/constants/treasures/individual';
import { hoardTreasure } from './constants/treasures/hoard';

export function generateTreasure(
  type: 'individual',
  cr: TreasureCr,
  qty: number
): Treasure[];
export function generateTreasure(type: 'hoard', cr: TreasureCr): Treasure[];
export function generateTreasure(
  type: TreasureGeneratorType,
  cr: TreasureCr,
  qty?: number
): Treasure[] {
  return type === 'individual'
    ? generateIndividualTreasure(cr, qty!)
    : generateHoardTreasure(cr);
}

function generateIndividualTreasure(cr: TreasureCr, qty: number): Treasure[] {
  const res: Treasure[] = [];
  const table = individualTreasure[cr];

  for (let i = 0; i < qty; i++) {
    table.roll(res);
  }

  return res;
}

function generateHoardTreasure(cr: TreasureCr): Treasure[] {
  return hoardTreasure[cr].roll();
}
