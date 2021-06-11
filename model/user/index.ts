import { getDb } from '@utils/db';
import { DbUser, sql, UserType } from './sql';

export type UserRole = 'system' | 'admin' | 'user';
export type UserAuthData = Pick<DbUser, 'userId' | 'username' | 'role'>;

export interface LocalUser {
  userId: DbUser['userId'];
  username: DbUser['username'];
  salt: string;
  password: string;
}

export const SYSTEM_USER: UserAuthData = {
  userId: 1,
  username: 'system',
  role: 'system',
};

export const PUBLIC_USER_MIN_ID = 101;

export async function createUser(
  type: UserType,
  username: string,
  role: UserRole
): Promise<UserAuthData> {
  const db = await getDb();

  const insertResult = await sql.insertUser(db, { type, username, role });

  return (await selectUser(insertResult.insertId))!;
}

export async function selectUser(
  userId: DbUser['userId']
): Promise<UserAuthData | undefined> {
  const db = await getDb();
  const rawUser = await sql.selectUser(db, { userId });
  if (!rawUser) return;

  return {
    ...rawUser,
  };
}
