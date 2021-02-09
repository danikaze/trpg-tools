import { DbInitFunction } from '../../../../utils/mysql';
import { createLocalUser } from '../../../user/local';
import { createUser } from '../../../user';

export const userDevData: DbInitFunction = async (db) => {
  // create test user (admin access)
  await db.transaction(
    async () => {
      const admin = await createUser('lc', 'admin', 'admin');
      await createLocalUser(admin.id, admin.username, 'pass');
    },
    { throw: true }
  );

  await db.transaction(
    async () => {
      const user1 = await createUser('lc', 'user1', 'user');
      await createLocalUser(user1.id, user1.username, 'pass');
    },
    { throw: true }
  );

  // create test user (admin access)
  await db.transaction(
    async () => {
      const user2 = await createUser('lc', 'user2', 'user');
      await createLocalUser(user2.id, user2.username, 'pass');
    },
    { throw: true }
  );
};
