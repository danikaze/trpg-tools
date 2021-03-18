import { generateUniqueId, getDb } from '../../utils/db';
import { UpdateNoteData } from '../note';
import { DbUser } from '../user/sql';
import { UserAuthData } from '../user';
import { DbApiKey, sql } from './sql';

export type ApiKeyUpdateNoteData = Pick<UpdateNoteData, 'noteId' | 'noteDefId'>;

export interface ApiKeyTypeData {
  updateNote: ApiKeyUpdateNoteData;
}

export type ApiKeyType = keyof ApiKeyTypeData;

export interface ApiKeyData<T extends ApiKeyType> {
  apiKeyId: DbApiKey['apiKeyId'];
  userId: DbUser['userId'];
  data: ApiKeyTypeData[T];
}

export async function createApiKey<T extends ApiKeyType>(
  user: UserAuthData,
  type: T,
  data: ApiKeyTypeData[T]
): Promise<DbApiKey['apiKeyId']> {
  const db = await getDb();
  const apiKeyId = generateUniqueId();
  const params = {
    apiKeyId,
    type,
    userId: user.userId,
    data: JSON.stringify(data),
  };
  await sql.insertApiKey(db, params);

  return params.apiKeyId;
}

export async function deleteApiKey(
  user: UserAuthData,
  apiKeyId: DbApiKey['apiKeyId']
): Promise<void> {
  const db = await getDb();
  const res = await sql.deleteApiKey(db, {
    apiKeyId,
    userId: user.userId,
  });

  if (!res.affectedRows) {
    throw new Error('No key found to delete or not enough permissions');
  }
}

export async function selectApiKey<T extends ApiKeyType>(
  type: DbApiKey['type'],
  apiKeyId: DbApiKey['apiKeyId']
): Promise<ApiKeyData<T>> {
  const db = await getDb();
  const res = await sql.selectApiKey(db, { type, apiKeyId });

  if (!res) {
    throw new Error('No key found with the provided ID');
  }

  const data = JSON.parse(res.data) as ApiKeyTypeData[T];
  return {
    apiKeyId,
    data,
    userId: res.userId,
  };
}

export async function selectUserKeys<T extends ApiKeyType>(
  user: UserAuthData,
  type: T
): Promise<ApiKeyData<T>[]> {
  const db = await getDb();
  const res = await sql.selectUserApiKeys(db, {
    type,
    userId: user.userId,
  });

  return res.map((row) => {
    const data = JSON.parse(row.data);

    return {
      data,
      apiKeyId: row.apiKeyId,
      userId: user.userId,
    };
  });
}
