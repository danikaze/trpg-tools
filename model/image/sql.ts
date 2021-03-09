import { getTimestamp } from '../../utils/db';
import { MySql } from '../../utils/mysql';
import { DbUser } from '../user/sql';
import { TimestampTable } from '../interfaces';

export type ImageType = 'game';
export type ImageThumbnail = 'gameBanner' | 'gameThumb';

export interface DbImage extends TimestampTable {
  id: number;
  userId: DbUser['id'];
  path: string;
  width: number;
  height: number;
  bytes: number;
}

export interface DbImageThumbnail {
  imageId: number;
  type: ImageThumbnail;
  path: string;
  width: number;
  height: number;
  bytes: number;
}

export const sql = {
  insertImage: (
    db: MySql,
    params: Pick<DbImage, 'userId' | 'path' | 'width' | 'height' | 'bytes'>
  ) => {
    const time = getTimestamp();
    return db.insertOne(queries.insertImage, {
      ...params,
      time,
    });
  },

  deleteImage: (db: MySql, params: Pick<DbImage, 'id' | 'userId'>) => {
    return db.delete(queries.deleteImage, params);
  },

  insertThumbnail: (
    db: MySql,
    params: Pick<
      DbImageThumbnail,
      'imageId' | 'type' | 'path' | 'width' | 'height' | 'bytes'
    >
  ) => {
    return db.insertOne(queries.insertThumbnail, params);
  },
};

const queries = {
  insertImage: `
    INSERT INTO
      images (userId, path, width, height, bytes, createdOn, updatedOn)
      VALUES (:userId, :path, :width, :height, :bytes, :time, :time)
  `,
  deleteImage: `
    DELETE FROM images
      WHERE id = :id AND userId = :userId
  `,
  insertThumbnail: `
    INSERT INTO
      images_thumbnails (imageId, type, path, width, height, bytes)
      VALUES (:imageId, :type, :path, :width, :height, :bytes)
  `,
};
