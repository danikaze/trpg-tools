import { apiError, HttpStatus } from '@api';
import { storeImage } from '@model/image';
import { userRequiredApiHandler } from '@utils/auth';
import { decodeBase64Image } from '@utils/decode-base64-image';
import { getLogger } from '@utils/logger';
import {
  UploadImageResponse,
  UploadImageBody,
  UploadImageQuery,
} from './interface';

const logger = getLogger('Api:image');

export const uploadImage = userRequiredApiHandler<
  UploadImageResponse,
  UploadImageQuery,
  UploadImageBody
>(async (req, res) => {
  const types = req.body.types;
  if (!Array.isArray(types)) {
    return apiError(res, { error: 'No types' });
  }

  const image = decodeBase64Image(req.body.data);
  if (!image) {
    return apiError(res, { error: 'No data image' });
  }

  try {
    const data = await storeImage(req.user, image, types);
    res.status(HttpStatus.OK).json({ data });
  } catch (error) {
    apiError(res, {
      logger,
      error,
      responseError: 'Error while uploading the image',
    });
  }
});
