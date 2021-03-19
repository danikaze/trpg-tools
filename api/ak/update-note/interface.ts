import { UpdateNoteData } from '@model/note';
import { DbApiKey } from '@model/api-key/sql';
import { DbNote } from '@model/note/sql';

export type CreateUpdateNoteApiKeyResponse = DbApiKey['apiKeyId'];
export type CreateUpdateNoteApiKeyQuery = {};
export type CreateUpdateNoteApiKeyBody = {
  noteDefId: UpdateNoteData['noteDefId'];
  noteId: DbNote['noteId'];
};

export type DeleteUpdateNoteApiKeyResponse = {};
export type DeleteUpdateNoteApiKeyQuery = {};
export type DeleteUpdateNoteApiKeyBody = {};
