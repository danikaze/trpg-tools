import { getDb } from '../../utils/db';
import { sql, UserType } from './sql';
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
): Promise<UserAuthData> {
  const db = await getDb();

  const insertResult = await sql.insertUser(db, { type, username, role });

  return (await selectUser(insertResult.insertId))!;
}

export async function selectUser(
  id: User['id']
): Promise<UserAuthData | undefined> {
  const db = await getDb();
  const rawUser = await sql.selectUser(db, id);
  if (!rawUser) return;

  return {
    ...rawUser,
  };
}
