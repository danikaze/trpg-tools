import { DbInitFunction } from '../../../utils/mysql';
import { EDIT_TIME_COLS, INTERNAL_ID } from './constants';

export const initImage: DbInitFunction = async (db) =>
  [
    // original uploaded images
    `
    CREATE TABLE IF NOT EXISTS images (
      id ${INTERNAL_ID} AUTO_INCREMENT PRIMARY KEY,
      userId ${INTERNAL_ID},
      path VARCHAR(255) NOT NULL,
      width SMALLINT UNSIGNED NOT NULL,
      height SMALLINT UNSIGNED NOT NULL,
      bytes INT UNSIGNED NOT NULL,
      ${EDIT_TIME_COLS},

      FOREIGN KEY (userId)
        REFERENCES users(id)
        ON UPDATE CASCADE
        ON DELETE SET NULL
    );
    `,
    // thumbnails for each image
    `
    CREATE TABLE IF NOT EXISTS images_thumbnails (
      imageId ${INTERNAL_ID},
      type VARCHAR(64) NOT NULL,
      path VARCHAR(255) NOT NULL,
      width SMALLINT UNSIGNED NOT NULL,
      height SMALLINT UNSIGNED NOT NULL,
      bytes INT UNSIGNED NOT NULL,

      INDEX imageId_type_idx (imageId, type),

      FOREIGN KEY (imageId)
        REFERENCES images(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
    );
    `,
  ].forEach(async (sql, i) => {
    db.logger!.debug('Executing initImages:', i);
    try {
      await db.execute(sql);
    } catch (e) {
      db.logger!.error(
        `Error while executing initImage[${i}]`,
        sql,
        (e as Error).message
      );
    }
  });
