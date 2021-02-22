import { ApiHandler, HttpStatus } from '@api';
import { apiUserRequired } from '@utils/auth';
import { updateGame } from '@model/game';
import {
  UpdateGameResponse,
  UpdateGameBody,
  UpdateGameQuery,
} from './interface';
import { UserAuthData } from '@model/user';
import { DbGame } from '@model/sql/game';

export const updateGameApiHandler: ApiHandler<
  UpdateGameResponse,
  UpdateGameQuery,
  UpdateGameBody,
  'gameId',
  DbGame['id']
> = async (req, res) => {
  if (apiUserRequired(req, res)) return;
  const { gameId, lastUpdate } = req.query;
  const { game } = req.body;
  const user = req.user as UserAuthData;

  const data = await updateGame(user, gameId, Number(lastUpdate), {
    name: game.name,
    description: game.description,
    imageId: game.imageId || null,
  });

  res.status(HttpStatus.OK).json({ data });
};
