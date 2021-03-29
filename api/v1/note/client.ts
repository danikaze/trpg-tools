import { DbApiKey } from '@model/api-key/sql';
import { callApi } from '@utils/call-api';
import { AkGetNoteBody, AkGetNoteQuery, AkGetNoteResponse } from './interface';

export async function callGetNoteOpenApi(
  apiKeyId: DbApiKey['apiKeyId']
): Promise<AkGetNoteResponse> {
  const res = await callApi<AkGetNoteResponse, AkGetNoteQuery, AkGetNoteBody>(
    `v1/${apiKeyId}/note`,
    'GET'
  );

  return res.data;
}
