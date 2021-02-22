import { GameUpdateData } from '@model/game';
import { DbGame } from '@model/sql/game';
import { callApi } from '@utils/call-api';
import {
  CreateGameBody,
  CreateGameQuery,
  CreateGameResponse,
  DeleteGameBody,
  DeleteGameResponse,
  DeleteGameQuery,
  UpdateGameBody,
  UpdateGameQuery,
  UpdateGameResponse,
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

export async function updateGame(
  gameId: DbGame['id'],
  lastUpdate: number,
  game: GameUpdateData
): Promise<UpdateGameResponse> {
  const res = await callApi<
    UpdateGameResponse,
    UpdateGameQuery,
    UpdateGameBody
  >('game', 'PUT', {
    resourceId: gameId,
    params: {
      lastUpdate,
    },
    data: {
      game,
    },
  });
  return res.data;
}

export async function deleteGame(
  gameId: DbGame['id']
): Promise<DeleteGameResponse> {
  const res = await callApi<
    DeleteGameResponse,
    DeleteGameQuery,
    DeleteGameBody
  >('game', 'DELETE', { resourceId: gameId });
  return res.data;
}
