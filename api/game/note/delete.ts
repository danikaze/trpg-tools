import { ApiHandler, HttpStatus } from '@api';
import { apiUserRequired } from '@utils/auth';
import { UserAuthData } from '@model/user';
import { deleteNote } from '@model/note';
import {
  DeleteNoteResponse,
  DeleteNoteBody,
  DeleteNoteQuery,
} from './interface';
import { DbNote } from '@model/sql/note';

export const deleteNoteApiHandler: ApiHandler<
  DeleteNoteResponse,
  DeleteNoteQuery,
  DeleteNoteBody,
  { noteId: DbNote['noteId'] }
> = async (req, res) => {
  if (apiUserRequired(req, res)) return;
  const { noteId } = req.query;
  const user = req.user as UserAuthData;

  await deleteNote(user, noteId);

  res.status(HttpStatus.OK).json({ data: {} });
};
