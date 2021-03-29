import { ApiHandler, HttpStatus } from '@api';
import { selectApiKey } from '@model/api-key';
import { updateNote, UpdateNoteData } from '@model/note';
import { UserAuthData } from '@model/user';
import {
  AkUpdateNoteBody,
  AkUpdateNoteQuery,
  AkUpdateNoteResponse,
} from './interface';

export const apiKeyUpdateNote: ApiHandler<
  AkUpdateNoteResponse,
  AkUpdateNoteQuery,
  AkUpdateNoteBody,
  { apiKeyId: string }
> = async (req, res) => {
  const { user, note } = await getData(req);
  const data = await updateNote(user, 0, true, note);

  res.status(HttpStatus.OK).json({ data });
};

async function getData(
  req: Parameters<typeof apiKeyUpdateNote>[0]
): Promise<{ user: UserAuthData; note: UpdateNoteData }> {
  const apiKey = await selectApiKey('updateNote', req.query.apiKeyId);
  const note = {
    ...req.body.note,
    noteId: apiKey.data.noteId,
    noteDefId: apiKey.data.noteDefId,
  };

  const user = { userId: apiKey.userId } as UserAuthData;

  return { user, note };
}
