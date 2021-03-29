import { DbApiKey } from '@model/api-key/sql';
import { DbNote } from '@model/note/sql';

export type CreateSelectNoteApiKeyResponse = DbApiKey['apiKeyId'];
export type CreateSelectNoteApiKeyQuery = {};
export type CreateSelectNoteApiKeyBody = {
  noteId: DbNote['noteId'];
};

export type DeleteSelectNoteApiKeyResponse = {};
export type DeleteSelectNoteApiKeyQuery = {};
export type DeleteSelectNoteApiKeyBody = {};
