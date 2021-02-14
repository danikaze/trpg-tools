import { apiError, ApiHandler } from '@api';
import { callApi } from '@utils/call-api';
import { generateName, NameType, Race } from '@utils/generate-name';
import { getUniqueElems } from '@utils/get-unique-elems';

type Return = string[];

interface Query {
  race: string;
  type: string;
}

const SHOW_NAMES = 10;

/*
 * API Handler
 */
export const getNamesApi: ApiHandler<Return, Query> = (req, res) => {
  try {
    const race = req.query.race as Race;
    const type = req.query.type as NameType<Race>;

    const names = getNameList(race, type);
    return res.json({ data: getUniqueElems(names) });
  } catch (error) {
    apiError(res, { error });
    return;
  }
};

/*
 * Function to call the API from the client
 */
export const callGenerateNames = <R extends Race>(race: R, type: string) => {
  return callApi<Return, Query>('names', 'GET', {
    params: { race, type },
  });
};

/*
 * Function to obtain the same result from the server (without calling the API)
 */
export function getNameList<R extends Race>(
  race: R,
  type: NameType<R>
): string[] {
  const names: string[] = [];

  for (let i = 0; i < SHOW_NAMES; i++) {
    names.push(generateName(race, type));
  }

  return getUniqueElems(names);
}
