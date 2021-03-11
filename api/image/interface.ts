import { ImageType } from '@model/image/sql';
import { ThumbnailInfo } from '@utils/create-thumbnails';

export interface UploadImageResponse {
  imageId: number;
  thumbnails: ThumbnailInfo[];
}

export type UploadImageQuery = {};

export interface UploadImageBody {
  types: ImageType[];
  data: string; // as base64
}
