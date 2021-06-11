import { getTimestamp } from '@utils/db';
import { MySql } from '@utils/mysql';
import { DbUser } from '@model/user/sql';
import { TimestampTable } from '@model/interfaces';

export type ImageType = 'game' | 'note' | 'widgetDef';
export type ImageThumbnail =
  | 'gameBanner'
  | 'gameThumb'
  | 'noteThumb'
  | 'widgetRaw';

export interface DbImage extends TimestampTable {
  imageId: number;
  userId: DbUser['userId'];
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

type DbImageThumb = Pick<DbImageThumbnail, 'imageId' | 'type' | 'path'>;

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

  deleteImage: (db: MySql, params: Pick<DbImage, 'imageId' | 'userId'>) => {
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

  selectThumbnails: (
    db: MySql,
    params: { types: ImageThumbnail[]; imageIds: DbImage['imageId'][] }
  ) => {
    return db.query<DbImageThumb>(queries.selectThumbnails, params);
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
      WHERE imageId = :imageId AND userId = :userId
  `,
  insertThumbnail: `
    INSERT INTO
      images_thumbnails (imageId, type, path, width, height, bytes)
      VALUES (:imageId, :type, :path, :width, :height, :bytes)
  `,
  selectThumbnails: `
    SELECT imageId, type, path
      FROM images_thumbnails
      WHERE type IN (:types)
        AND imageId IN (:imageIds)
  `,
};
