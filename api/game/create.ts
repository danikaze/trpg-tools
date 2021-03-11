import { HttpStatus } from '@api';
import { userRequiredApiHandler } from '@utils/auth';
import { createGame } from '@model/game';
import {
  CreateGameResponse,
  CreateGameQuery,
  CreateGameBody,
} from './interface';

export const newGameApiHandler = userRequiredApiHandler<
  CreateGameResponse,
  CreateGameQuery,
  CreateGameBody
>(async (req, res) => {
  const data = await createGame(req.user, {
    name: req.body.name,
    description: req.body.description,
    imageId: req.body.imageId || null,
  });

  res.status(HttpStatus.OK).json({ data });
});
