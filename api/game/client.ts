import { GameUpdateData } from '@model/game';
import { NoteDefinition } from '@model/note-definition';
import { DbGame } from '@model/game/sql';
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
  GetNotesBody,
  GetNotesQuery,
  GetNotesResponse,
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
  gameId: DbGame['gameId'],
  lastUpdate: number,
  game: GameUpdateData
): Promise<UpdateGameResponse> {
  const res = await callApi<
    UpdateGameResponse,
    UpdateGameQuery,
    UpdateGameBody
  >(`game/${gameId}`, 'PUT', {
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
  gameId: DbGame['gameId']
): Promise<DeleteGameResponse> {
  const res = await callApi<
    DeleteGameResponse,
    DeleteGameQuery,
    DeleteGameBody
  >(`game/${gameId}`, 'DELETE');
  return res.data;
}

export async function getNotes(
  gameId: DbGame['gameId'],
  noteDefId: NoteDefinition['noteDefId'],
  page: number
): Promise<GetNotesResponse> {
  const res = await callApi<GetNotesResponse, GetNotesQuery, GetNotesBody>(
    `game/${gameId}/notes`,
    'GET',
    {
      params: {
        noteDefId,
        page,
      },
    }
  );

  return res.data;
}
