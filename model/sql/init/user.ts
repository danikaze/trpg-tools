import { DbInitFunction } from '../../../utils/mysql';
import { LOCAL_SALT_SIZE, INTERNAL_ID, EDIT_TIME_COLS } from './constants';

const USERNAME_ROWTYPE = 'VARCHAR(32)';

export const initUser: DbInitFunction = async (db) => {
  [
    // app users
    `
    CREATE TABLE IF NOT EXISTS users (
      id ${INTERNAL_ID} AUTO_INCREMENT PRIMARY KEY,
      type CHAR(2) NOT NULL,
      username ${USERNAME_ROWTYPE} NOT NULL UNIQUE,
      role VARCHAR(36) DEFAULT 'user',
      ${EDIT_TIME_COLS}
    );
    `,
    // auth data for users based on username and password
    `
    CREATE TABLE IF NOT EXISTS users_local (
      userId ${INTERNAL_ID},
      username ${USERNAME_ROWTYPE} NOT NULL UNIQUE,
      password VARCHAR(256) NOT NULL COLLATE utf8_bin,
      salt CHAR(${LOCAL_SALT_SIZE}),

      FOREIGN KEY (userId)
        REFERENCES users(id)
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
      userId ${INTERNAL_ID},
      profileId VARCHAR(36) NOT NULL PRIMARY KEY,

      FOREIGN KEY (userId)
        REFERENCES users(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
    );
    `,
  ].forEach(async (sql, i) => {
    db.logger!.debug('Init user:', i);
    await db.execute(sql);
  });
};
