import { DbInitFunction, InitDbOptions } from '../../../utils/mysql';

import { initUser } from './user';
import { initImage } from './image';
import { userDevData } from './mock/user';

const init: DbInitFunction = async (db) => {
  await initUser(db);
  await initImage(db);

  if (IS_PRODUCTION) return;

  db.logger!.debug('Inserting Dev Data into the database...');
  await userDevData(db);
  db.logger!.debug('Dev Data done!');
};

/**
 * List of updates and migrations to do in the database between versions
 * `{N: callback}` meaning: callback to be called when updating TO version N
 */
export const dbUpdates: InitDbOptions['updates'] = {
  1: init,
};
