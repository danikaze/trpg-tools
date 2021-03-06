import { generateUniqueId, getDb } from '@utils/db';
import { UpdateNoteData } from '@model/note';
import { DbUser } from '@model/user/sql';
import { UserAuthData } from '@model/user';
import { DbApiKey, sql } from './sql';

export type ApiKeySelectNoteData = Pick<UpdateNoteData, 'noteId'>;
export type ApiKeyUpdateNoteData = Pick<UpdateNoteData, 'noteId' | 'noteDefId'>;

export interface ApiKeyTypeData {
  selectNote: ApiKeySelectNoteData;
  updateNote: ApiKeyUpdateNoteData;
}

export type ApiKeyType = keyof ApiKeyTypeData;

export interface ApiKeyData<T extends ApiKeyType> {
  apiKeyId: DbApiKey['apiKeyId'];
  type: ApiKeyType;
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
  type: ApiKeyType,
  apiKeyId: DbApiKey['apiKeyId']
): Promise<void> {
  const db = await getDb();
  const res = await sql.deleteApiKey(db, {
    apiKeyId,
    type,
    userId: user.userId,
  });

  if (!res.affectedRows) {
    throw new Error('No key found to delete or not enough permissions');
  }
}

export async function selectApiKey<T extends ApiKeyType>(
  type: T,
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
    type,
    data,
    userId: res.userId,
  };
}

export async function selectUserKeys<T extends ApiKeyType>(
  user: UserAuthData,
  types: T[]
): Promise<ApiKeyData<T>[]> {
  const db = await getDb();
  const res = await sql.selectUserApiKeys(db, {
    types,
    userId: user.userId,
  });

  return res.map((row) => {
    const data = JSON.parse(row.data);

    return {
      data,
      type: row.type,
      apiKeyId: row.apiKeyId,
      userId: user.userId,
    };
  });
}
