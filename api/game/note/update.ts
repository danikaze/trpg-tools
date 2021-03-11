import { HttpStatus } from '@api';
import { userRequiredApiHandler } from '@utils/auth';
import { DbGame } from '@model/game/sql';
import { DbNote } from '@model/note/sql';
import { updateNote } from '@model/note';
import {
  UpdateNoteResponse,
  UpdateNoteQuery,
  UpdateNoteBody,
} from './interface';

export const updateNoteApiHandler = userRequiredApiHandler<
  UpdateNoteResponse,
  UpdateNoteQuery,
  UpdateNoteBody,
  {
    noteId: DbNote['noteId'];
    gameId: DbGame['gameId'];
  }
>(async (req, res) => {
  const { lastUpdate, note } = getData(req);

  const data = await updateNote(req.user, lastUpdate, note);

  res.status(HttpStatus.OK).json({ data });
});

function getData(req: Parameters<typeof updateNoteApiHandler>[0]) {
  const { noteId } = req.query;
  const { gameId, lastUpdate, note } = req.body;

  if (noteId !== note.noteId) {
    throw new Error('Wrong data');
  }

  return {
    gameId,
    lastUpdate,
    note,
  };
}
