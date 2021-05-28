import { DbNote } from '@model/note/sql';
import { callApi } from '@utils/call-api';
import {
  CreateSelectNoteApiKeyResponse,
  CreateSelectNoteApiKeyQuery,
  CreateSelectNoteApiKeyBody,
  DeleteSelectNoteApiKeyBody,
  DeleteSelectNoteApiKeyQuery,
  DeleteSelectNoteApiKeyResponse,
} from './interface';
import { DbApiKey } from '@model/api-key/sql';

export async function callCreateSelectNoteApiKey(
  noteId: DbNote['noteId']
): Promise<CreateSelectNoteApiKeyResponse> {
  const res = await callApi<
    CreateSelectNoteApiKeyResponse,
    CreateSelectNoteApiKeyQuery,
    CreateSelectNoteApiKeyBody
  >(`ak/select-note`, 'POST', {
    data: {
      noteId,
    },
  });

  return res.data;
}

export async function callDeleteSelectNoteApiKey(
  apiKeyId: DbApiKey['apiKeyId']
): Promise<DeleteSelectNoteApiKeyResponse> {
  const res = await callApi<
    DeleteSelectNoteApiKeyResponse,
    DeleteSelectNoteApiKeyQuery,
    DeleteSelectNoteApiKeyBody
  >(`ak/select-note/${apiKeyId}`, 'DELETE');

  return res.data;
}
