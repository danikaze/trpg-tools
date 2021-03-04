import { DbInitFunction, MySql } from '../../../../utils/mysql';
import { createLocalUser } from '../../../user/local';
import { createUser, User, UserRole } from '../../../user';
import { UserType } from '../../../sql/user';

interface DevUserDefinition {
  type: UserType;
  role: UserRole;
  username: string;
  password: string;
}

export const devUsers: Record<string, User> = {};

export const userDevData: DbInitFunction = async (db) => {
  const devUserDefinitions: Record<string, DevUserDefinition> = {
    admin: {
      type: UserType.LOCAL_USER,
      role: 'admin',
      username: 'admin',
      password: 'pass',
    },
    user1: {
      type: UserType.LOCAL_USER,
      role: 'user',
      username: 'user1',
      password: 'pass',
    },
    user2: {
      type: UserType.LOCAL_USER,
      role: 'user',
      username: 'user2',
      password: 'pass',
    },
  };

  await Promise.all(
    Object.values(devUserDefinitions).map(
      async (user) => await createDevUser(db, user)
    )
  );
};

async function createDevUser(db: MySql, def: DevUserDefinition): Promise<User> {
  return db.transaction(async () => {
    devUsers[def.username] = await createUser(def.type, def.username, def.role);
    await createLocalUser(
      devUsers[def.username].id,
      def.username,
      def.password
    );
    return devUsers[def.username];
  }) as Promise<User>;
}
