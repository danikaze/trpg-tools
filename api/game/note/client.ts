import { CreateNoteData, NoteData, UpdateNoteData } from '@model/note';
import { DbGame } from '@model/game/sql';
import { DbNote } from '@model/note/sql';
import { callApi } from '@utils/call-api';
import {
  CreateNoteBody,
  DeleteNoteQuery,
  CreateNoteResponse,
  DeleteNoteResponse,
  DeleteNoteBody,
  UpdateNoteResponse,
  UpdateNoteQuery,
  UpdateNoteBody,
  CreateNoteQuery,
} from './interface';

export async function callCreateNoteApi(
  gameId: CreateNoteData['gameId'],
  note: Omit<CreateNoteData, 'gameId'>
): Promise<CreateNoteResponse> {
  const res = await callApi<
    CreateNoteResponse,
    CreateNoteQuery,
    CreateNoteBody
  >(`game/${gameId}/note`, 'POST', {
    data: note,
  });

  return res.data;
}

export async function callDeleteNoteApi(
  gameId: DbGame['gameId'],
  noteId: DbNote['noteId']
): Promise<DeleteNoteResponse> {
  const res = await callApi<
    DeleteNoteResponse,
    DeleteNoteQuery,
    DeleteNoteBody
  >(`game/${gameId}/note/${noteId}`, 'DELETE');

  return res.data;
}

export async function callUpdateNoteApi(
  gameId: DbGame['gameId'],
  noteId: NoteData['noteId'],
  lastUpdate: NoteData['updatedOn'],
  note: UpdateNoteData
): Promise<UpdateNoteResponse> {
  const res = await callApi<
    UpdateNoteResponse,
    UpdateNoteQuery,
    UpdateNoteBody
  >(`game/${gameId}/note/${noteId}`, 'PUT', {
    data: {
      gameId,
      note,
      lastUpdate,
    },
  });

  return res.data;
}
