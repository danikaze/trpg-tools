import { HttpStatus } from '@api';
import { userRequiredApiHandler } from '@utils/auth';
import { updateGame } from '@model/game';
import {
  UpdateGameResponse,
  UpdateGameBody,
  UpdateGameQuery,
} from './interface';
import { DbGame } from '@model/game/sql';

export const updateGameApiHandler = userRequiredApiHandler<
  UpdateGameResponse,
  UpdateGameQuery,
  UpdateGameBody,
  { gameId: DbGame['gameId'] }
>(async (req, res) => {
  const { gameId, lastUpdate } = req.query;
  const { game } = req.body;

  const data = await updateGame(req.user, gameId, Number(lastUpdate), {
    name: game.name,
    description: game.description,
    imageId: game.imageId || null,
  });

  res.status(HttpStatus.OK).json({ data });
});
