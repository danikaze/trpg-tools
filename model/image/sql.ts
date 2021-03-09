import { TimestampTable } from '@model/interfaces';
import { DbUser } from '../user/sql';

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
  createImage: `
    INSERT INTO
      images (userId, path, width, height, bytes, createdOn, updatedOn)
      VALUES (:userId, :path, :width, :height, :bytes, :createdOn, :createdOn)
  `,
  deleteImage: `
    DELETE FROM images
      WHERE id = :id AND userId = :userId
  `,
  createThumbnail: `
    INSERT INTO
      images_thumbnails (imageId, type, path, width, height, bytes)
      VALUES (:imageId, :type, :path, :width, :height, :bytes)
  `,
  deleteThumbnail: `
    DELETE FROM images_thumbnails
      WHERE id = :id
        AND type = :type
        AND userId = :userId
  `,
};
