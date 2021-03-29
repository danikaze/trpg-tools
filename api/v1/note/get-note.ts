import { apiError, ApiHandler, HttpStatus } from '@api';
import { selectApiKey } from '@model/api-key';
import { selectNote } from '@model/note';
import { DbNote } from '@model/note/sql';
import { UserAuthData } from '@model/user';
import { AkGetNoteBody, AkGetNoteQuery, AkGetNoteResponse } from './interface';

export const apiKeyGetNote: ApiHandler<
  AkGetNoteResponse,
  AkGetNoteQuery,
  AkGetNoteBody,
  { apiKeyId: string }
> = async (req, res) => {
  const { user, noteId } = await getData(req);
  const note = await selectNote(user, noteId);

  if (!note) {
    return apiError(res, {
      error: 'Note not found',
      httpCode: HttpStatus.NOT_FOUND,
    });
  }
  res.status(HttpStatus.OK).json({ data: { note } });
};

async function getData(
  req: Parameters<typeof apiKeyGetNote>[0]
): Promise<{ user: UserAuthData; noteId: DbNote['noteId'] }> {
  const apiKey = await selectApiKey('selectNote', req.query.apiKeyId);

  const user = { userId: apiKey.userId } as UserAuthData;

  return { user, noteId: apiKey.data.noteId };
}
