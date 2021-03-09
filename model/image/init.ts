import { UPLOAD_PATH_MAX_CHARS } from '../../utils/constants';
import { DbInitFunction } from '../../utils/mysql';
import {
  EDIT_TIME_COLS,
  MYSQL_TYPE_ENUM,
  MYSQL_TYPE_IMAGE_WH,
  MYSQL_TYPE_INTERNAL_ID,
} from '../constants/sql';

export const initImage: DbInitFunction = async (db) => {
  await Promise.all(
    [
      // original uploaded images
      `
      CREATE TABLE IF NOT EXISTS images (
        id ${MYSQL_TYPE_INTERNAL_ID} AUTO_INCREMENT PRIMARY KEY,
        userId ${MYSQL_TYPE_INTERNAL_ID},
        path VARCHAR(${UPLOAD_PATH_MAX_CHARS}) NOT NULL,
        width ${MYSQL_TYPE_IMAGE_WH} UNSIGNED NOT NULL,
        height ${MYSQL_TYPE_IMAGE_WH} UNSIGNED NOT NULL,
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
        imageId ${MYSQL_TYPE_INTERNAL_ID},
        type ${MYSQL_TYPE_ENUM} NOT NULL,
        path VARCHAR(${UPLOAD_PATH_MAX_CHARS}) NOT NULL,
        width ${MYSQL_TYPE_IMAGE_WH} UNSIGNED NOT NULL,
        height ${MYSQL_TYPE_IMAGE_WH} UNSIGNED NOT NULL,
        bytes INT UNSIGNED NOT NULL,

        INDEX imageId_type_idx (imageId, type),

        FOREIGN KEY (imageId)
          REFERENCES images(id)
          ON UPDATE CASCADE
          ON DELETE CASCADE
      );
      `,
    ].map(async (sql, i) => {
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
    })
  );
};
