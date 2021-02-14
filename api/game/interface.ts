import { GamePreviewData } from '@model/game';
import { DbGame } from '@model/sql/game';

export type CreateGameResponse = GamePreviewData;
export type CreateGameQuery = {};
export type CreateGameBody = {
  name: DbGame['name'];
  description: DbGame['description'];
  imageId?: DbGame['imageId'];
};
