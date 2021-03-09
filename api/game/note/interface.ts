import { UpdateNoteData } from '@model/note';
import { DbGame } from '@model/sql/game';

export type DeleteNoteResponse = {};
export type DeleteNoteQuery = {};
export type DeleteNoteBody = {};

export type UpdateNoteResponse = {
  updatedOn: number;
};
export type UpdateNoteQuery = {};
export type UpdateNoteBody = {
  lastUpdate: number;
  gameId: DbGame['id'];
  note: UpdateNoteData;
};
