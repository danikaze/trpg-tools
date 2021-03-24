import { CreatedNoteData, CreateNoteData, UpdateNoteData } from '@model/note';
import { DbGame } from '@model/game/sql';

export type CreateNoteResponse = CreatedNoteData;
export type CreateNoteQuery = {};
export type CreateNoteBody = { note: Omit<CreateNoteData, 'gameId'> };

export type DeleteNoteResponse = {};
export type DeleteNoteQuery = {};
export type DeleteNoteBody = {};

export type UpdateNoteResponse = {
  updatedOn: number;
};
export type UpdateNoteQuery = {};
export type UpdateNoteBody = {
  lastUpdate: DbGame['updatedOn'];
  gameId: DbGame['gameId'];
  note: UpdateNoteData;
};
