import mkdirp from 'mkdirp';
import { join } from 'path';
import { writeFile } from 'fs';
import { apiError, ApiHandler } from '@api';
import { sql } from '@model/sql/image';
import { UserAuthData } from '@model/user';
import { decodeBase64Image } from '@utils/decode-base64-image';
import { getDb, getTimestamp } from '@utils/db';
import { PUBLIC_URL_FOLDER, UPLOADS_IMG_FOLDER } from '@utils/constants';
import { createThumbnails } from '@utils/create-thumbnails';
import { getFileHash } from '@utils/get-file-hash';
import { apiUserRequired } from '@utils/auth';
import { getLogger } from '@utils/logger';
import { getUrlFromPath } from '@utils/getUrlFromPath';
import { ApiResponse, RequestBody } from './client';

const logger = getLogger('Api:image');

export const uploadImage: ApiHandler<ApiResponse, {}, RequestBody> = async (
  req,
  res
) => {
  if (apiUserRequired(req, res)) return;

  const types = req.body.types;
  if (!Array.isArray(types)) {
    return apiError(res, { error: 'No types' });
  }

  const image = decodeBase64Image(req.body.data);
  if (!image) {
    return apiError(res, { error: 'No data image' });
  }

  // store the original image
  const hash = await getFileHash(image.data);
  const imgPath = join(UPLOADS_IMG_FOLDER, `${hash}.${image.ext}`);
  await mkdirp(UPLOADS_IMG_FOLDER);
  await (() =>
    // somehow `writeFile` from `fs/promises` can't be resolved
    new Promise<void>((resolve, reject) => {
      writeFile(imgPath, image.data, (err) => {
        if (err) return reject(err);
        resolve();
      });
    }))();

  // create the thumbnails
  const { original, thumbnails } = await createThumbnails(image, types);
  const db = await getDb();

  try {
    // store the original image in the database
    const originalInsertResult = await db.insertOne(sql.createImage, {
      userId: (req.user as UserAuthData).id,
      path: imgPath,
      width: original.width as number,
      height: original.height as number,
      bytes: original.size as number,
      createdOn: getTimestamp(),
    });

    // store the thumbnails in the database
    thumbnails.forEach((thumb) => {
      db.insertOne(sql.createThumbnail, {
        imageId: originalInsertResult!.insertId,
        type: thumb.type,
        path: getUrlFromPath(thumb.path, PUBLIC_URL_FOLDER, true),
        width: thumb.width,
        height: thumb.height,
        bytes: thumb.size,
      });
    });

    res.json({
      data: {
        thumbnails,
        id: originalInsertResult.insertId,
      },
    });
  } catch (error) {
    apiError(res, {
      logger,
      error,
      responseError: 'Error while uploading the image',
    });
  }
};
