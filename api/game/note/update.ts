import { ApiHandler, HttpStatus } from '@api';
import { apiUserRequired } from '@utils/auth';
import { UserAuthData } from '@model/user';
import { DbGame } from '@model/sql/game';
import { DbNote } from '@model/sql/note';
import { updateNote } from '@model/note';
import {
  UpdateNoteResponse,
  UpdateNoteQuery,
  UpdateNoteBody,
} from './interface';

export const updateNoteApiHandler: ApiHandler<
  UpdateNoteResponse,
  UpdateNoteQuery,
  UpdateNoteBody,
  {
    noteId: DbNote['noteId'];
    gameId: DbGame['id'];
  }
> = async (req, res) => {
  if (apiUserRequired(req, res)) return;
  const { lastUpdate, note } = getData(req);
  const user = req.user as UserAuthData;

  const updated = await updateNote(user, lastUpdate, note);

  res.status(HttpStatus.OK).json({ data: updated });
};

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
