import { DbInitFunction } from '../../../utils/mysql';
import { EDIT_TIME_COLS, INTERNAL_ID, PUBLIC_ID } from './constants';

export const initGame: DbInitFunction = async (db) => {
  await Promise.all(
    [
      // game, campaign... that contains all the elements (chars, maps, notes, etc.)
      `
      CREATE TABLE IF NOT EXISTS games (
        id ${PUBLIC_ID} PRIMARY KEY,
        userId ${INTERNAL_ID} NOT NULL,
        name VARCHAR(255) NOT NULL DEFAULT '',
        description TEXT NOT NULL,
        imageId ${INTERNAL_ID},
        ${EDIT_TIME_COLS},

        FOREIGN KEY (imageId)
          REFERENCES images(id)
          ON UPDATE CASCADE
          ON DELETE SET NULL
      );
      `,
      // rel-table to allow sharing games with multiple users
      `
      CREATE TABLE IF NOT EXISTS games_permissions (
        gameId ${PUBLIC_ID} NOT NULL,
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
        gameId ${PUBLIC_ID} NOT NULL,
        permission VARCHAR(32) NOT NULL
      );
      `,
    ].map(async (sql, i) => {
      db.logger!.debug('Executing initGame:', i);
      try {
        await db.execute(sql);
      } catch (e) {
        db.logger!.error(
          `Error while executing initGame[${i}]`,
          sql,
          (e as Error).message
        );
      }
    })
  );
};
