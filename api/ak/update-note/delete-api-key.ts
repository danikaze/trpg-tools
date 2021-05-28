import { HttpStatus } from '@api';
import { userRequiredApiHandler } from '@utils/auth';
import { DbApiKey } from '@model/api-key/sql';
import { deleteApiKey } from '@model/api-key';
import {
  DeleteUpdateNoteApiKeyResponse,
  DeleteUpdateNoteApiKeyQuery,
  DeleteUpdateNoteApiKeyBody,
} from './interface';

export const deleteUpdateNoteApiKey = userRequiredApiHandler<
  DeleteUpdateNoteApiKeyResponse,
  DeleteUpdateNoteApiKeyQuery,
  DeleteUpdateNoteApiKeyBody,
  { apiKeyId: DbApiKey['apiKeyId'] }
>(async (req, res) => {
  const { apiKeyId } = req.query;

  await deleteApiKey(req.user, 'updateNote', apiKeyId);

  res.status(HttpStatus.OK).json({ data: {} });
});
