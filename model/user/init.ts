import { basename } from 'path';
import { getTimestamp } from '../../utils/db';
import { DbInitFunction } from '../../utils/mysql';
import {
  LOCAL_SALT_SIZE,
  PASSWORD_MAX_CHARS,
  TWITTER_PROFILE_LENGTH,
  USERNAME_MAX_CHARS,
} from '../../utils/constants';
import { PUBLIC_USER_MIN_ID, SYSTEM_USER } from '.';
import {
  MYSQL_TYPE_INTERNAL_ID,
  EDIT_TIME_COLS,
  MYSQL_TYPE_ENUM,
} from '../constants/sql';
import { UserType } from './sql';

const USERNAME_ROWTYPE = `VARCHAR(${USERNAME_MAX_CHARS})`;

export const initUser: DbInitFunction = async (db) => {
  const now = getTimestamp();
  const sql = [
    // app users
    `
    CREATE TABLE IF NOT EXISTS users (
      userId ${MYSQL_TYPE_INTERNAL_ID} AUTO_INCREMENT PRIMARY KEY,
      type CHAR(2) NOT NULL,
      username ${USERNAME_ROWTYPE} NOT NULL UNIQUE,
      role ${MYSQL_TYPE_ENUM} DEFAULT 'user',
      ${EDIT_TIME_COLS}
    );
    `,
    // auth data for users based on username and password
    `
    CREATE TABLE IF NOT EXISTS users_local (
      userId ${MYSQL_TYPE_INTERNAL_ID} NOT NULL,
      username ${USERNAME_ROWTYPE} NOT NULL UNIQUE,
      password VARCHAR(${PASSWORD_MAX_CHARS}) NOT NULL COLLATE utf8_bin,
      salt CHAR(${LOCAL_SALT_SIZE}),

      FOREIGN KEY (userId)
        REFERENCES users(userId)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

      FOREIGN KEY (username)
        REFERENCES users(username)
        ON UPDATE CASCADE
        ON DELETE CASCADE
      );
    `,
    // auth data for users based on twitter accounts
    `
    CREATE TABLE IF NOT EXISTS users_twitter (
      userId ${MYSQL_TYPE_INTERNAL_ID} NOT NULL,
      profileId VARCHAR(${TWITTER_PROFILE_LENGTH}) NOT NULL PRIMARY KEY,

      FOREIGN KEY (userId)
        REFERENCES users(userId)
        ON UPDATE CASCADE
        ON DELETE CASCADE
    );
    `,
    // system user ID is hardcoded
    `ALTER TABLE users AUTO_INCREMENT=${SYSTEM_USER.userId};`,
    // Insert the system user
    // (special user without login options,
    // for user-referenced system resources)
    `
    INSERT INTO users(userId, type, username, role, createdOn, updatedOn)
      VALUES (
        ${SYSTEM_USER.userId},
        '${UserType.SYSTEM_USER}',
        '${SYSTEM_USER.username}',
        '${SYSTEM_USER.role}',
        ${now},
        ${now}
      )
    `,
    // Public users start on the specified ID
    `ALTER TABLE users AUTO_INCREMENT=${PUBLIC_USER_MIN_ID}`,
  ];

  await db.executeSyncSql(
    sql,
    `${basename(__dirname)}/${basename(__filename)}`
  );
};
