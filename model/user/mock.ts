import { DbInitFunction, MySql } from '../../utils/mysql';
import { createLocalUser } from './strats/local';
import { createUser, UserAuthData, UserRole } from '.';
import { UserType } from './sql';

interface DevUserDefinition {
  type: UserType;
  role: UserRole;
  username: string;
  password: string;
}

export const devUsers: Record<string, UserAuthData> = {};

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

async function createDevUser(db: MySql, def: DevUserDefinition): Promise<void> {
  return db.transaction(async () => {
    devUsers[def.username] = await createUser(def.type, def.username, def.role);
    await createLocalUser(
      devUsers[def.username].id,
      def.username,
      def.password
    );
  });
}
