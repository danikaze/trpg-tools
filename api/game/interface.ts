import { GamePreviewData, GameUpdateData } from '@model/game';
import { NoteData } from '@model/note';
import { NoteDefinition } from '@model/note-definition';
import { DbGame } from '@model/game/sql';
import { Paginated } from '@utils/mysql';

export type CreateGameResponse = GamePreviewData;
export type CreateGameQuery = {};
export type CreateGameBody = {
  name: DbGame['name'];
  description: DbGame['description'];
  imageId?: DbGame['imageId'];
};

export type UpdateGameResponse = {
  updatedOn: number;
};
export type UpdateGameQuery = {
  lastUpdate: number;
};
export type UpdateGameBody = {
  game: GameUpdateData;
};

export type DeleteGameResponse = {};
export type DeleteGameQuery = {};
export type DeleteGameBody = {};

export type GetNotesResponse = Paginated<NoteData>;
export type GetNotesQuery = {
  noteDefId: NoteDefinition['noteDefId'];
  page: number;
};
export type GetNotesBody = {};
