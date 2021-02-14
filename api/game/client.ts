import { callApi } from '@utils/call-api';
import {
  CreateGameBody,
  CreateGameQuery,
  CreateGameResponse,
} from './interface';

export async function createNewGame(
  data: CreateGameBody
): Promise<CreateGameResponse> {
  const res = await callApi<
    CreateGameResponse,
    CreateGameQuery,
    CreateGameBody
  >('game', 'POST', {
    data,
  });
  return res.data;
}
