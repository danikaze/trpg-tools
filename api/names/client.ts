import { callApi } from '@utils/call-api';
import { Race } from '@utils/generate-name';
import {
  NameGeneratorMode,
  GenerateNameReturn,
  GenerateNameQuery,
} from './interface';

/*
 * Function to call the API from the client
 */
export const callGenerateNamesApi = <R extends Race>(
  race: R,
  type: string,
  mode: NameGeneratorMode
) => {
  return callApi<GenerateNameReturn, GenerateNameQuery>('names', 'GET', {
    params: { race, type, mode },
  });
};
