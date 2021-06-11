import { basename } from 'path';
import { DbInitFunction } from '@utils/mysql';
import {
  EDIT_TIME_COLS,
  MYSQL_TYPE_ENUM,
  MYSQL_TYPE_INTERNAL_ID,
  MYSQL_TYPE_PUBLIC_ID,
} from '@model/constants/sql';

export const initApiKeys: DbInitFunction = async (db) => {
  const sql = [
    `
    CREATE TABLE IF NOT EXISTS api_keys (
      apiKeyId ${MYSQL_TYPE_PUBLIC_ID} PRIMARY KEY,
      userId ${MYSQL_TYPE_INTERNAL_ID} NOT NULL,
      type ${MYSQL_TYPE_ENUM} NOT NULL,
      data VARCHAR(2000) NOT NULL,
      ${EDIT_TIME_COLS},

      INDEX type_idx (type),

      FOREIGN KEY (userId)
        REFERENCES users(userId)
        ON UPDATE CASCADE
        ON DELETE CASCADE
    )
    `,
  ];

  await db.executeSyncSql(
    sql,
    `${basename(__dirname)}/${basename(__filename)}`
  );
};
