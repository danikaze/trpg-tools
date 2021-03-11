import { HttpStatus } from '@api';
import { userRequiredApiHandler } from '@utils/auth';
import { deleteGame } from '@model/game';
import {
  DeleteGameResponse,
  DeleteGameBody,
  DeleteGameQuery,
} from './interface';
import { DbGame } from '@model/game/sql';

export const deleteGameApiHandler = userRequiredApiHandler<
  DeleteGameResponse,
  DeleteGameQuery,
  DeleteGameBody,
  { gameId: DbGame['gameId'] }
>(async (req, res) => {
  const { gameId } = req.query;

  await deleteGame(req.user, gameId);

  res.status(HttpStatus.OK).json({ data: {} });
});
