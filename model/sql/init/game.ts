import { DbInitFunction } from '../../../utils/mysql';
import {
  EDIT_TIME_COLS,
  IMAGE_URL_ROWTYPE,
  INTERNAL_ID,
  PUBLIC_ID,
} from './constants';

export const initGame: DbInitFunction = async (db) => {
  [
    // game, campaign... that contains all the elements (chars, maps, notes, etc.)
    `
    CREATE TABLE IF NOT EXISTS games (
      id ${PUBLIC_ID} PRIMARY KEY,
      userId ${INTERNAL_ID},
      name VARCHAR(255) NOT NULL DEFAULT '',
      description TEXT NOT NULL,
      imageUrl ${IMAGE_URL_ROWTYPE},
      thumbUrl ${IMAGE_URL_ROWTYPE},
      ${EDIT_TIME_COLS}
    );
  `,
    // rel-table to allow sharing games with multiple users
    `
    CREATE TABLE IF NOT EXISTS games_permissions (
      gameId ${PUBLIC_ID},
      userId ${INTERNAL_ID} KEY,
      permission VARCHAR(32) NOT NULL,

      CONSTRAINT UNIQUE (gameId, userId),

      FOREIGN KEY (gameId)
        REFERENCES games(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

      FOREIGN KEY (userId)
        REFERENCES users(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
    );
  `,
    // links to share games with users
    `
    CREATE TABLE IF NOT EXISTS games_share_links (
      id CHAR(16) PRIMARY KEY,
      gameId ${PUBLIC_ID},
      permission VARCHAR(32) NOT NULL
    );
  `,
  ].forEach(async (sql, i) => {
    db.logger!.debug('Init game:', i);
    await db.execute(sql);
  });
};
