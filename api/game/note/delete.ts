import { HttpStatus } from '@api';
import { userRequiredApiHandler } from '@utils/auth';
import { deleteNote } from '@model/note';
import {
  DeleteNoteResponse,
  DeleteNoteBody,
  DeleteNoteQuery,
} from './interface';
import { DbNote } from '@model/note/sql';

export const deleteNoteApiHandler = userRequiredApiHandler<
  DeleteNoteResponse,
  DeleteNoteQuery,
  DeleteNoteBody,
  { noteId: DbNote['noteId'] }
>(async (req, res) => {
  const { noteId } = req.query;

  await deleteNote(req.user, noteId);

  res.status(HttpStatus.OK).json({ data: {} });
});
