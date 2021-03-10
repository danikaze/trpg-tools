import { Profile } from 'passport';
import { selectUser, UserAuthData } from './user';
import { getUserIdFromLocal } from './user/strats/local';
import { getUserIdFromTwitter } from './user/strats/twitter';

export async function getUserAuthData(
  userId: UserAuthData['userId'] | undefined
): Promise<UserAuthData | undefined> {
  if (!userId) return;
  const user = await selectUser(userId);
  if (!user) return;

  return {
    userId: user.userId,
    username: user.username,
    role: user.role,
  };
}

export async function authLocalUser(
  username: string,
  password: string
): Promise<UserAuthData | undefined> {
  const userId = await getUserIdFromLocal(username, password);
  return await getUserAuthData(userId);
}

export async function authTwitterUser(
  profile: Profile
): Promise<UserAuthData | undefined> {
  // get the user from the database
  // if it doesn't exist, it will be created
  const userId = await getUserIdFromTwitter(profile);
  return await getUserAuthData(userId);
}
