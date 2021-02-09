import { OkPacket } from 'mysql2/promise';
import { getDb, getTimestamp } from '../../utils/db';
import { DbUser, sql, UserType } from '../sql/user';
import { TimestampTable } from '../';

export type UserRole = 'admin' | 'user';
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

export async function createUser(
  type: UserType,
  username: string,
  role: UserRole
): Promise<User> {
  const db = await getDb();

  const [rows] = await db.execute(sql.createUser, {
    type,
    username,
    role,
    createdOn: getTimestamp(),
  });

  return (await selectUser((rows as OkPacket).insertId))!;
}

export async function selectUser(id: User['id']): Promise<User | undefined> {
  const db = await getDb();
  const rawUser = await db.queryOne<DbUser>(sql.selectUser, { id });
  if (!rawUser) return;

  return {
    ...rawUser,
  };
}
