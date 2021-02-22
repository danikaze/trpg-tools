import { GamePreviewData, GameUpdateData } from '@model/game';
import { DbGame } from '@model/sql/game';

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
