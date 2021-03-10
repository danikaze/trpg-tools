import { UpdateNoteData } from '@model/note';
import { DbGame } from '@model/game/sql';

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
