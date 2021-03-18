import { basename } from 'path';
import { GAME_NAME_MAX_CHARS } from '../../utils/constants';
import { DbInitFunction } from '../../utils/mysql';
import {
  EDIT_TIME_COLS,
  MYSQL_TYPE_ENUM,
  GAME_SHARE_LINK_LENGTH,
  MYSQL_TYPE_INTERNAL_ID,
  MYSQL_TYPE_PUBLIC_ID,
} from '../constants/sql';

export const initGame: DbInitFunction = async (db) => {
  const sql = [
    // game, campaign... that contains all the elements (chars, maps, notes, etc.)
    `
    CREATE TABLE IF NOT EXISTS games (
      gameId ${MYSQL_TYPE_PUBLIC_ID} PRIMARY KEY,
      userId ${MYSQL_TYPE_INTERNAL_ID} NOT NULL,
      name VARCHAR(${GAME_NAME_MAX_CHARS}) NOT NULL DEFAULT '',
      description VARCHAR(${GAME_NAME_MAX_CHARS}) NOT NULL DEFAULT '',
      imageId ${MYSQL_TYPE_INTERNAL_ID},
      ${EDIT_TIME_COLS},

      FOREIGN KEY (userId)
        REFERENCES users(userId)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

      FOREIGN KEY (imageId)
        REFERENCES images(imageId)
        ON UPDATE CASCADE
        ON DELETE SET NULL
    );
    `,
    // rel-table to allow sharing games with multiple users
    `
    CREATE TABLE IF NOT EXISTS games_permissions (
      gameId ${MYSQL_TYPE_PUBLIC_ID} NOT NULL,
      userId ${MYSQL_TYPE_INTERNAL_ID} KEY,
      permission ${MYSQL_TYPE_ENUM} NOT NULL,

      CONSTRAINT UNIQUE (gameId, userId),

      FOREIGN KEY (gameId)
        REFERENCES games(gameId)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

      FOREIGN KEY (userId)
        REFERENCES users(userId)
        ON UPDATE CASCADE
        ON DELETE CASCADE
    );
    `,
    // links to share games with users
    `
    CREATE TABLE IF NOT EXISTS games_share_links (
      linkId CHAR(${GAME_SHARE_LINK_LENGTH}) PRIMARY KEY,
      gameId ${MYSQL_TYPE_PUBLIC_ID} NOT NULL,
      permission ${MYSQL_TYPE_ENUM} NOT NULL
    );
    `,
  ];

  await db.executeSyncSql(
    sql,
    `${basename(__dirname)}/${basename(__filename)}`
  );
};
