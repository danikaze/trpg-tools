import { Profile } from 'passport';
import { getDb } from '../../../utils/db';
import { DbUser, sql, UserType } from '../../user/sql';
import { User } from '../../user';
import { createUser } from '../';

/**
 * Get a UserId from a Twitter profile.
 * If the user doesn't exist in the db, it's created.
 */
export async function getUserIdFromTwitter(
  profile: Profile
): Promise<User['id']> {
  const profileId = profile.id;
  const username = profile.username!;
  const role = 'user';

  const db = await getDb();
  const user = await db.queryOne<DbUser>(sql.selectUserFromTwitter, {
    profileId,
  });
  if (user) {
    return user.id;
  }

  return (await db.transaction(async () => {
    const newUser = await createUser(UserType.TWITTER_USER, username, role);
    await createUserFromTwitter(newUser.id, profileId);
    return newUser.id;
  })) as User['id'];
}

/**
 * Create a new user to authenticate with a twitter profileId
 * linked to an existing user of the database (by its userId)
 */
async function createUserFromTwitter(
  userId: User['id'],
  profileId: string
): Promise<void> {
  const db = await getDb();
  await db.execute(sql.createTwitterUser, { userId, profileId });
}
