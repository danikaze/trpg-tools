import { Profile } from 'passport';
import { getDb } from '@utils/db';
import { DbTwitterUser, DbUser, sql, UserType } from '@model/user/sql';
import { createUser } from '..';

/**
 * Get a UserId from a Twitter profile.
 * If the user doesn't exist in the db, it's created.
 */
export async function getUserIdFromTwitter(
  profile: Profile
): Promise<DbUser['userId']> {
  const profileId = profile.id;
  const username = profile.username!;
  const role = 'user';

  const db = await getDb();
  const user = await sql.selectTwitterUser(db, {
    profileId,
  });
  if (user) {
    return user.userId;
  }

  return (await db.transaction(async () => {
    const newUser = await createUser(UserType.TWITTER_USER, username, role);
    await createUserFromTwitter(newUser.userId, profileId);
    return newUser.userId;
  })) as DbUser['userId'];
}

/**
 * Create a new user to authenticate with a twitter profileId
 * linked to an existing user of the database (by its userId)
 */
async function createUserFromTwitter(
  userId: DbUser['userId'],
  profileId: DbTwitterUser['profileId']
): Promise<void> {
  const db = await getDb();
  await sql.insertTwitterUser(db, { userId, profileId });
}
