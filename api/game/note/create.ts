import { HttpStatus } from '@api';
import { userRequiredApiHandler } from '@utils/auth';
import { DbGame } from '@model/game/sql';
import { createNote } from '@model/note';
import {
  CreateNoteResponse,
  CreateNoteQuery,
  CreateNoteBody,
} from './interface';

export const createNoteApiHandler = userRequiredApiHandler<
  CreateNoteResponse,
  CreateNoteQuery,
  CreateNoteBody,
  {
    gameId: DbGame['gameId'];
  }
>(async (req, res) => {
  const { gameId, note } = getData(req);

  const createdNote = await createNote(req.user, { ...note, gameId });

  res.status(HttpStatus.OK).json({ data: createdNote });
});

function getData(req: Parameters<typeof createNoteApiHandler>[0]) {
  const { gameId } = req.query;
  const { note } = req.body;

  return {
    gameId,
    note,
  };
}
