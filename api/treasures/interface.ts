import {
  QuantifiedCr,
  Treasure,
  TreasureGeneratorType,
} from '@utils/constants/treasures';

export type GenerateTreasureResponse = Treasure[][];
export type GenerateTreasureQuery = {};
export type GenerateTreasureBody = {
  type: TreasureGeneratorType;
  crs: QuantifiedCr[];
  group?: boolean;
};
