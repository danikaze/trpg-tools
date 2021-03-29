import { HttpStatus } from '@api';
import { userRequiredApiHandler } from '@utils/auth';
import { createApiKey } from '@model/api-key';
import {
  CreateSelectNoteApiKeyResponse,
  CreateSelectNoteApiKeyQuery,
  CreateSelectNoteApiKeyBody,
} from './interface';

export const createSelectNoteApiKey = userRequiredApiHandler<
  CreateSelectNoteApiKeyResponse,
  CreateSelectNoteApiKeyQuery,
  CreateSelectNoteApiKeyBody
>(async (req, res) => {
  const { noteId } = req.body;

  const data = await createApiKey(req.user, 'selectNote', {
    noteId,
  });

  res.status(HttpStatus.OK).json({ data });
});
