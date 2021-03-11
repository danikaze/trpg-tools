import { HttpStatus } from '@api';
import { userRequiredApiHandler } from '@utils/auth';
import { selectNotes } from '@model/note';
import { DbGame } from '@model/game/sql';
import { GetNotesResponse, GetNotesBody, GetNotesQuery } from '../interface';

export const getNotesApiHandler = userRequiredApiHandler<
  GetNotesResponse,
  GetNotesQuery,
  GetNotesBody,
  { gameId: DbGame['gameId'] }
>(async (req, res) => {
  const { noteDefId, gameId, page } = getQueryData(req);

  const pages = await selectNotes(req.user, noteDefId, gameId, page);

  res.status(HttpStatus.OK).json({ data: pages });
});

function getQueryData(req: Parameters<typeof getNotesApiHandler>[0]) {
  const { noteDefId, gameId, page } = req.query;

  return {
    noteDefId,
    gameId,
    page: Number(page) || 0,
  };
}
