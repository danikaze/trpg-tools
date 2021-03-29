import { HttpStatus } from '@api';
import { userRequiredApiHandler } from '@utils/auth';
import { DbApiKey } from '@model/api-key/sql';
import { deleteApiKey } from '@model/api-key';
import {
  DeleteSelectNoteApiKeyResponse,
  DeleteSelectNoteApiKeyQuery,
  DeleteSelectNoteApiKeyBody,
} from './interface';

export const deleteSelectNoteApiKey = userRequiredApiHandler<
  DeleteSelectNoteApiKeyResponse,
  DeleteSelectNoteApiKeyQuery,
  DeleteSelectNoteApiKeyBody,
  { apiKeyId: DbApiKey['apiKeyId'] }
>(async (req, res) => {
  const { apiKeyId } = req.query;

  await deleteApiKey(req.user, 'selectNote', apiKeyId);

  res.status(HttpStatus.OK).json({ data: {} });
});
