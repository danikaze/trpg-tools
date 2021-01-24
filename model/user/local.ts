import { encryptPassword } from '../../utils/crypt';
import { Rng } from '../../utils/rng';
import { LOCAL_SALT_SIZE } from '../../model/sql/init/user';
import { getDb } from '../../utils/db';
import { DbLocalUser, sql } from '../sql/user';
import { User } from '../user';

const SALT_CHARSET =
  '1234567890!@#$%^&*()+=-_?~' +
  'abcdefghijklmnopqrstuvwxyz' +
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/**
 * Get a UserId from username and password.
 * If there's no matching user it will return undefined
 */
export async function getUserIdFromLocal(
  username: DbLocalUser['username'],
  password: DbLocalUser['password']
): Promise<User['id'] | undefined> {
  // 1. Find the user in the database
  const db = await getDb();
  const user = await db.queryOne<DbLocalUser>(sql.selectLocalUser, {
    username,
  });
  if (!user) return;

  // 2. Encode the provided password with its salt
  const pwd = await encryptPassword(password, user.salt);
  // 3. Check if the encoded(provided password) matches
  if (pwd !== user.password) return;

  // 4. if ok, return the UserAuthData
  return user.userId;
}

/**
 * Create a new user to authenticate by its user and password
 * linked to an existing user of the database (by its userId)
 */
export async function createLocalUser(
  userId: DbLocalUser['userId'],
  username: DbLocalUser['username'],
  password: DbLocalUser['password']
): Promise<void> {
  const db = await getDb();
  const rng = new Rng();
  const salt = rng.randomString(SALT_CHARSET, LOCAL_SALT_SIZE);
  const pwd = await encryptPassword(password, salt);
  await db.execute(sql.createLocalUser, {
    userId,
    username,
    salt,
    password: pwd,
  });
}
