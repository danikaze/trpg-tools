import { getDb, getTimestamp } from '../../utils/db';
import { DbUser, sql, UserType } from './sql';
import { TimestampTable } from '../interfaces';

export type UserRole = 'system' | 'admin' | 'user';
export type UserAuthData = Pick<User, 'id' | 'username' | 'role'>;

export interface User extends TimestampTable {
  id: number;
  username: string;
  role: UserRole;
}

export interface LocalUser {
  userId: User['id'];
  username: string;
  salt: string;
  password: string;
}

export const SYSTEM_USER: UserAuthData = {
  id: 1,
  username: 'system',
  role: 'system',
};

export const PUBLIC_USER_MIN_ID = 101;

export async function createUser(
  type: UserType,
  username: string,
  role: UserRole
): Promise<User> {
  const db = await getDb();

  const insertResult = await db.insertOne(sql.createUser, {
    type,
    username,
    role,
    createdOn: getTimestamp(),
  });

  return (await selectUser(insertResult.insertId))!;
}

export async function selectUser(id: User['id']): Promise<User | undefined> {
  const db = await getDb();
  const rawUser = await db.queryOne<DbUser>(sql.selectUser, { id });
  if (!rawUser) return;

  return {
    ...rawUser,
  };
}
