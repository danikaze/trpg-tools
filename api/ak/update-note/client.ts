import { UpdateNoteData } from '@model/note';
import { DbNote } from '@model/note/sql';
import { callApi } from '@utils/call-api';
import {
  CreateUpdateNoteApiKeyResponse,
  CreateUpdateNoteApiKeyQuery,
  CreateUpdateNoteApiKeyBody,
  DeleteUpdateNoteApiKeyBody,
  DeleteUpdateNoteApiKeyQuery,
  DeleteUpdateNoteApiKeyResponse,
} from './interface';
import { DbApiKey } from '@model/api-key/sql';

export async function callCreateUpdateNoteApiKey(
  noteId: DbNote['noteId'],
  noteDefId: UpdateNoteData['noteDefId']
): Promise<CreateUpdateNoteApiKeyResponse> {
  const res = await callApi<
    CreateUpdateNoteApiKeyResponse,
    CreateUpdateNoteApiKeyQuery,
    CreateUpdateNoteApiKeyBody
  >(`ak/update-note`, 'POST', {
    data: {
      noteId,
      noteDefId,
    },
  });

  return res.data;
}

export async function callDeleteUpdateNoteApiKey(
  apiKeyId: DbApiKey['apiKeyId']
): Promise<DeleteUpdateNoteApiKeyResponse> {
  const res = await callApi<
    DeleteUpdateNoteApiKeyResponse,
    DeleteUpdateNoteApiKeyQuery,
    DeleteUpdateNoteApiKeyBody
  >(`ak/update-note/${apiKeyId}`, 'DELETE');

  return res.data;
}
