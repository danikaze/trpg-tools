import { join } from 'path';
import { DbInitFunction } from '@utils/mysql';
import { storeImageInDb } from '@utils/store-image-in-db';
import { filenameWithoutExtension } from '@utils/filename-without-extension';
import { devUsers } from '../../user/mock';
import { StoredImage } from '..';
import { ImageType } from '../sql';

export const devImages: Record<string, StoredImage> = {};

export const imageDevData: DbInitFunction = async (db) => {
  const images: Partial<{ [type in ImageType]: string[] }> = {
    game: ['game1.jpg'],
    note: [
      'cornelius.png',
      'ghorax.png',
      'indar.png',
      'rungret.png',
      'sylna.png',
    ],
  };

  const keys: string[] = [];
  const promises: Promise<StoredImage>[] = [];

  Object.entries(images).forEach(([type, filenames]) => {
    Object.values(filenames!).forEach((filename) => {
      keys.push(filenameWithoutExtension(filename));
      promises.push(
        storeImageInDb(devUsers['user1'], join(__dirname, filename), [
          type as ImageType,
        ])
      );
    });
  });

  (await Promise.all(promises)).forEach((img, i) => {
    devImages[keys[i]] = img;
  });
};
