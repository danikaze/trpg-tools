import { readFileSync } from 'fs';
import { join } from 'path';
import { DbInitFunction } from '../../../utils/mysql';
import {
  decodeBase64Image,
  DecodedImage,
} from '../../../utils/decode-base64-image';
import { devUsers } from '../../user/mock';
import { StoredImage, storeImage } from '..';
import { ImageType } from '../sql';

export const devImages: Record<string, StoredImage> = {};

export const imageDevData: DbInitFunction = async (db) => {
  await store('game1', join(__dirname, 'game1.jpg'), ['game']);
  await store('rungret', join(__dirname, 'rungret-face.png'), ['note']);
};

async function store(key: string, path: string, types: ImageType[]) {
  const ext2mime = {
    png: 'png',
    jpg: 'jpeg',
    jpeg: 'jpeg',
  };
  const str = Buffer.from(readFileSync(path)).toString('base64');
  const type = ext2mime[path.split('.')[1] as keyof typeof ext2mime];
  const base64 = `data:image/${type};base64,${str}`;

  const data = decodeBase64Image(base64) as DecodedImage;
  const image = await storeImage(devUsers['user1'], data, types);
  devImages[key] = image!;
}
