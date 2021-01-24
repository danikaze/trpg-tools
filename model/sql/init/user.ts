import { DbInitFunction } from '../../../utils/mysql';

export const LOCAL_SALT_SIZE = 16;
const USERID_ROWTYPE = 'INT(10) UNSIGNED NOT NULL';
const USERNAME_ROWTYPE = 'VARCHAR(32)';

export const initUser: DbInitFunction = async (db) => {
  [
    `
    CREATE TABLE IF NOT EXISTS users (
      id ${USERID_ROWTYPE} AUTO_INCREMENT PRIMARY KEY,
      type CHAR(2) NOT NULL,
      username ${USERNAME_ROWTYPE} NOT NULL UNIQUE,
      role VARCHAR(36) DEFAULT 'user'
    );
    `,
    `
    CREATE TABLE IF NOT EXISTS users_local (
      userId ${USERID_ROWTYPE},
      username ${USERNAME_ROWTYPE} NOT NULL UNIQUE,
      password VARCHAR(256) NOT NULL COLLATE utf8_bin,
      salt CHAR(${LOCAL_SALT_SIZE}),

      FOREIGN KEY (userId) REFERENCES users(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

      FOREIGN KEY (username) REFERENCES users(username)
        ON UPDATE CASCADE
        ON DELETE CASCADE
      );
    `,
    `
    CREATE TABLE IF NOT EXISTS users_twitter (
      userId ${USERID_ROWTYPE},
      profileId VARCHAR(36) NOT NULL PRIMARY KEY,

      FOREIGN KEY (userId) REFERENCES users(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
    );
    `,
  ].forEach(async (sql) => await db.execute(sql));
};
