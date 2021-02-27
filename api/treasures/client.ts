import { callApi } from '@utils/call-api';
import {
  QuantifiedCr,
  TreasureGeneratorType,
} from '@utils/constants/treasures';
import {
  GenerateTreasureResponse,
  GenerateTreasureQuery,
  GenerateTreasureBody,
} from './interface';

export async function callGenerateTreasures(
  type: TreasureGeneratorType,
  crs: QuantifiedCr[]
): Promise<GenerateTreasureResponse> {
  const res = await callApi<
    GenerateTreasureResponse,
    GenerateTreasureQuery,
    GenerateTreasureBody
  >('treasures', 'POST', {
    data: {
      type,
      crs,
    },
  });

  return res.data;
}
