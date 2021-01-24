import { DbInitFunction, InitDbOptions } from '../../../utils/mysql';
import { createLocalUser } from '../../user/local';
import { createUser } from '../../user';
import { initUser } from './user';

const init: DbInitFunction = async (db) => {
  await initUser(db);

  if (IS_PRODUCTION) return;

  // create test user (basic user)
  await db.transaction(
    async () => {
      const user = await createUser('lc', 'user', 'user');
      await createLocalUser(user.id, user.username, 'pass');
    },
    { throw: true }
  );

  // create test user (admin access)
  await db.transaction(async () => {
    const admin = await createUser('lc', 'admin', 'admin');
    await createLocalUser(admin.id, admin.username, 'pass');
  });
};

/**
 * List of updates and migrations to do in the database between versions
 * `{N: callback}` meaning: callback to be called when updating TO version N
 */
export const dbUpdates: InitDbOptions['updates'] = {
  1: init,
};
