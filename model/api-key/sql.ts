import { ApiKeyType } from '.';
import { DbUser } from '@model/user/sql';
import { TimestampTable } from '@model/interfaces';
import { MySql } from '@utils/mysql';
import { getTimestamp } from '@utils/db';

export interface DbApiKey extends TimestampTable {
  apiKeyId: string;
  userId: DbUser['userId'];
  type: ApiKeyType;
  data: string;
}

type SelectKey = Pick<DbApiKey, 'userId' | 'data'>;
type SelectUserKeys = Pick<DbApiKey, 'apiKeyId' | 'type' | 'data'>;

export const sql = {
  insertApiKey: (
    db: MySql,
    params: Pick<DbApiKey, 'apiKeyId' | 'userId' | 'type' | 'data'>
  ) => {
    const time = getTimestamp();
    return db.insertOne(queries.insertApiKey, { ...params, time });
  },

  deleteApiKey: (
    db: MySql,
    params: Pick<DbApiKey, 'apiKeyId' | 'type' | 'userId'>
  ) => {
    return db.delete(queries.deleteApiKey, params);
  },

  selectApiKey: (db: MySql, params: Pick<DbApiKey, 'apiKeyId' | 'type'>) => {
    return db.queryOne<SelectKey>(queries.selectApiKey, params);
  },

  selectUserApiKeys: (
    db: MySql,
    params: { userId: DbApiKey['userId']; types: DbApiKey['type'][] }
  ) => {
    return db.query<SelectUserKeys>(queries.selectUserApiKeys, params);
  },
};

const queries = {
  insertApiKey: `
    INSERT INTO
    api_keys (apiKeyId, userId, type, data, createdOn, updatedOn)
      VALUES (:apiKeyId, :userId, :type, :data, :time, :time)
    `,

  deleteApiKey: `
    DELETE FROM api_keys
      WHERE apiKeyId = :apiKeyId
        AND type = :type
        AND userId = :userId
  `,

  selectApiKey: `
    SELECT userId, data
      FROM api_keys
      WHERE apiKeyId = :apiKeyId
        AND type = :type
  `,

  selectUserApiKeys: `
    SELECT apiKeyId, type, data
      FROM api_keys
      WHERE userId = :userId
        AND type IN (:types)
  `,
};
