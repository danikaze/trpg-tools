import { NoteData, UpdateNoteData } from '@model/note';
import { DbGame } from '@model/game/sql';
import { DbNote } from '@model/note/sql';
import { callApi } from '@utils/call-api';
import {
  DeleteNoteQuery,
  DeleteNoteResponse,
  DeleteNoteBody,
  UpdateNoteResponse,
  UpdateNoteQuery,
  UpdateNoteBody,
} from './interface';

export async function callDeleteNoteApi(
  gameId: DbGame['id'],
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
  gameId: DbGame['id'],
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
