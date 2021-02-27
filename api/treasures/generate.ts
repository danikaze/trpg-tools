import { apiError, ApiHandler } from '@api';
import {
  TREASURE_CR_QUANTITY_MIN,
  TREASURE_CR_QUANTITY_MAX,
} from '@utils/constants';
import {
  QuantifiedCr,
  Treasure,
  TreasureCr,
  TreasureGeneratorType,
} from '@utils/constants/treasures';
import { generateTreasure } from '@utils/generate-treasure';
import {
  GenerateTreasureResponse,
  GenerateTreasureQuery,
  GenerateTreasureBody,
} from './interface';

interface Data {
  type: TreasureGeneratorType;
  crs: QuantifiedCr[];
}

const TYPES_ALLOWED: TreasureGeneratorType[] = ['individual', 'hoard'];
const CRS_ALLOWED: TreasureCr[] = ['0-4', '11-16', '17+', '5-10'];

export const generateTreasuresApiHandler: ApiHandler<
  GenerateTreasureResponse,
  GenerateTreasureQuery,
  GenerateTreasureBody
> = (req, res) => {
  try {
    const { type, crs } = validateData(req.body);

    const data = generateTreasureList(type, crs);
    return res.json({ data });
  } catch (error) {
    apiError(res, { error });
    return;
  }
};

function validateData(body: GenerateTreasureBody): Data {
  const type = body.type as TreasureGeneratorType;
  const crs = body.crs as QuantifiedCr[];

  if (TYPES_ALLOWED.indexOf(type) === -1) {
    throw new Error(`Wrong type ${type}`);
  }
  if (crs.some((def) => CRS_ALLOWED.indexOf(def.cr) === -1)) {
    throw new Error(`Wrong crs`);
  }
  if (
    crs.some(
      (def) =>
        def.quantity < TREASURE_CR_QUANTITY_MIN ||
        def.quantity > TREASURE_CR_QUANTITY_MAX
    )
  ) {
    throw new Error('Wrong quantities');
  }

  return {
    type,
    crs,
  };
}

function generateTreasureList(
  type: TreasureGeneratorType,
  crs: QuantifiedCr[]
): Treasure[][] {
  return type === 'individual'
    ? crs.map((crDef) => generateTreasure(type, crDef.cr, crDef.quantity))
    : [generateTreasure(type, crs[0].cr)];
}
