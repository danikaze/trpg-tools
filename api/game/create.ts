import { ApiHandler, HttpStatus } from '@api';
import { apiUserRequired } from '@utils/auth';
import { createGame } from '@model/game';
import { UserAuthData } from '@model/user';
import {
  CreateGameResponse,
  CreateGameQuery,
  CreateGameBody,
} from './interface';

export const newGame: ApiHandler<
  CreateGameResponse,
  CreateGameQuery,
  CreateGameBody
> = async (req, res) => {
  if (apiUserRequired(req, res)) return;

  const data = await createGame(req.user as UserAuthData, {
    name: req.body.name,
    description: req.body.description,
    imageId: req.body.imageId || null,
  });

  res.status(HttpStatus.OK).json({ data });
};
