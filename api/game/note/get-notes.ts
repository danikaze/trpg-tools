import { ApiHandler, HttpStatus } from '@api';
import { apiUserRequired } from '@utils/auth';
import { UserAuthData } from '@model/user';
import { selectNotes } from '@model/note';
import { DbGame } from '@model/game/sql';
import { GetNotesResponse, GetNotesBody, GetNotesQuery } from '../interface';

export const getNotesApiHandler: ApiHandler<
  GetNotesResponse,
  GetNotesQuery,
  GetNotesBody,
  { gameId: DbGame['gameId'] }
> = async (req, res) => {
  if (apiUserRequired(req, res)) return;
  const { noteDefId, gameId, page, user } = getQueryData(req);

  const pages = await selectNotes(user, noteDefId, gameId, page);

  res.status(HttpStatus.OK).json({ data: pages });
};

function getQueryData(req: Parameters<typeof getNotesApiHandler>[0]) {
  const { noteDefId, gameId, page } = req.query;

  return {
    noteDefId,
    gameId,
    page: Number(page) || 0,
    user: req.user as UserAuthData,
  };
}
