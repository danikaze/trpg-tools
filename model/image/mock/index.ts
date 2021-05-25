import { join } from 'path';
import { DbInitFunction } from '../../../utils/mysql';
import { storeImageInDb } from '../../../utils/store-image-in-db';
import { devUsers } from '../../user/mock';
import { StoredImage } from '..';

export const devImages: Record<string, StoredImage> = {};

export const imageDevData: DbInitFunction = async (db) => {
  devImages['game1'] = await storeImageInDb(
    devUsers['user1'],
    join(__dirname, 'game1.jpg'),
    ['game']
  );
  devImages['rungret'] = await storeImageInDb(
    devUsers['user1'],
    join(__dirname, 'rungret-face.png'),
    ['note']
  );
};
