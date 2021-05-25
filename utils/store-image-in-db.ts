import { UserAuthData } from '@model/user';
import { readFileSync } from 'fs';
import { extname } from 'path';
import { StoredImage, storeImage } from '../model/image';
import { ImageType } from '../model/image/sql';
import { decodeBase64Image, DecodedImage } from './decode-base64-image';

export async function storeImageInDb(
  user: UserAuthData,
  path: string,
  types: ImageType[]
): Promise<StoredImage> {
  const ext2mime = {
    '.png': 'png',
    '.jpg': 'jpeg',
    '.jpeg': 'jpeg',
  };
  const str = Buffer.from(readFileSync(path)).toString('base64');
  const ext = extname(path) as keyof typeof ext2mime;
  const type = ext2mime[ext];

  if (!type) {
    throw new Error(`Unknown MIME type for ${type}`);
  }

  const base64 = `data:image/${type};base64,${str}`;
  const data = decodeBase64Image(base64) as DecodedImage;
  const image = await storeImage(user, data, types);

  return image;
}
