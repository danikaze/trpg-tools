import { TableRollerResult } from '@utils/table-roller';

export type TreasureCr = '0-4' | '5-10' | '11-16' | '17+';

export type TreasureGeneratorType = 'individual' | 'hoard';

export type Treasure = TableRollerResult<string>;

export interface QuantifiedCr {
  quantity: number;
  cr: TreasureCr;
}
