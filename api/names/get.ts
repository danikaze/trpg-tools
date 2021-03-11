import { apiError, ApiHandler } from '@api';
import { getUniqueElems } from '@utils/get-unique-elems';
import { generateName, NameType, Race } from '@utils/generate-name';
import {
  GenerateNameReturn,
  GenerateNameQuery,
  GenerateNameBody,
  NameGeneratorMode,
} from './interface';

const SHOW_NAMES = 10;
const MIXED_MARKOV_PROB = 0.5;

/*
 * API Handler
 */
export const getNamesApi: ApiHandler<
  GenerateNameReturn,
  GenerateNameQuery,
  GenerateNameBody
> = (req, res) => {
  try {
    const race = req.query.race as Race;
    const type = req.query.type as NameType<Race>;
    const mode = req.query.mode as NameGeneratorMode;

    const names = getNameList(race, type, mode);
    return res.json({ data: getUniqueElems(names) });
  } catch (error) {
    apiError(res, { error });
    return;
  }
};

/*
 * Function to obtain the same result from the server (without calling the API)
 */
export function getNameList<R extends Race>(
  race: R,
  type: NameType<R>,
  mode: NameGeneratorMode
): string[] {
  const names: string[] = [];

  for (let i = 0; i < SHOW_NAMES; i++) {
    const markov =
      mode === 'markov' ||
      (mode === 'mix' && Math.random() < MIXED_MARKOV_PROB);
    names.push(generateName(race, type, markov));
  }

  return getUniqueElems(names);
}
