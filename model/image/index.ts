import mkdirp from 'mkdirp';
import { writeFile } from 'fs';
import { join } from 'path';
import { getDb } from '@utils/db';
import { PUBLIC_URL_FOLDER, UPLOADS_IMG_FOLDER } from '@utils/constants';
import { DecodedImage } from '@utils/decode-base64-image';
import { getFileHash } from '@utils/get-file-hash';
import { createThumbnails, ThumbnailInfo } from '@utils/create-thumbnails';
import { getUrlFromPath } from '@utils/get-url-from-path';
import { UserAuthData } from '@model/user';
import {
  DbImage,
  DbImageThumbnail,
  ImageThumbnail,
  ImageType,
  sql,
} from './sql';

export interface StoredImage {
  imageId: DbImage['imageId'];
  thumbnails: ThumbnailInfo[];
}

export interface ImageThumbData<T extends ImageThumbnail> {
  [imageId: string]: Partial<
    {
      [type in T]: DbImageThumbnail['path'];
    }
  >;
}

export async function storeImage(
  user: UserAuthData,
  image: DecodedImage,
  types: ImageType[]
) {
  // store the original image
  const hash = await getFileHash(image.data);
  const imgPath = join(UPLOADS_IMG_FOLDER, `${hash}.${image.ext}`);
  await mkdirp(UPLOADS_IMG_FOLDER);
  await new Promise<void>((resolve, reject) => {
    writeFile(imgPath, image.data, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });

  // create the thumbnails
  const { original, thumbnails } = await createThumbnails(image, types);
  const db = await getDb();

  // store the original image in the database
  const originalInsertResult = await sql.insertImage(db, {
    userId: user.userId,
    path: imgPath,
    width: original.width as number,
    height: original.height as number,
    bytes: original.size as number,
  });

  thumbnails.forEach((thumb) => {
    // fix the thumbnails path
    thumb.path = getUrlFromPath(thumb.path, PUBLIC_URL_FOLDER, true);

    // store the thumbnails in the database
    sql.insertThumbnail(db, {
      imageId: originalInsertResult!.insertId,
      type: thumb.type,
      path: thumb.path,
      width: thumb.width,
      height: thumb.height,
      bytes: thumb.size,
    });
  });

  return {
    thumbnails,
    imageId: originalInsertResult.insertId,
  };
}

export async function getThumbnails<T extends ImageThumbnail>(
  types: T[],
  imageIds: DbImage['imageId'][]
): Promise<ImageThumbData<T>> {
  if (types.length === 0 || imageIds.length === 0) return {};

  const db = await getDb();
  const res = await sql.selectThumbnails(db, { types, imageIds });

  return res.reduce((data, row) => {
    let imgId = data[row.imageId];
    if (!imgId) {
      imgId = data[row.imageId] = {};
    }
    imgId[row.type as T] = row.path;

    return data;
  }, {} as ImageThumbData<T>);
}
