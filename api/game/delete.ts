import { ApiHandler, HttpStatus } from '@api';
import { apiUserRequired } from '@utils/auth';
import { deleteGame } from '@model/game';
import {
  DeleteGameResponse,
  DeleteGameBody,
  DeleteGameQuery,
} from './interface';
import { UserAuthData } from '@model/user';
import { DbGame } from '@model/game/sql';

export const deleteGameApiHandler: ApiHandler<
  DeleteGameResponse,
  DeleteGameQuery,
  DeleteGameBody,
  { gameId: DbGame['id'] }
> = async (req, res) => {
  if (apiUserRequired(req, res)) return;
  const { gameId } = req.query;
  const user = req.user as UserAuthData;

  await deleteGame(user, gameId);

  res.status(HttpStatus.OK).json({ data: {} });
};
