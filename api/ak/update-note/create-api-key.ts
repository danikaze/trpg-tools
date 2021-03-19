import { HttpStatus } from '@api';
import { userRequiredApiHandler } from '@utils/auth';
import { createApiKey } from '@model/api-key';
import {
  CreateUpdateNoteApiKeyResponse,
  CreateUpdateNoteApiKeyQuery,
  CreateUpdateNoteApiKeyBody,
} from './interface';

export const createUpdateNoteApiKey = userRequiredApiHandler<
  CreateUpdateNoteApiKeyResponse,
  CreateUpdateNoteApiKeyQuery,
  CreateUpdateNoteApiKeyBody
>(async (req, res) => {
  const { noteId, noteDefId } = req.body;

  const data = await createApiKey(req.user, 'updateNote', {
    noteId,
    noteDefId,
  });

  res.status(HttpStatus.OK).json({ data });
});
