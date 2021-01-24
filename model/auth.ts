import { Profile } from 'passport';
import { selectUser, User, UserAuthData } from './user';
import { getUserIdFromLocal } from './user/local';
import { getUserIdFromTwitter } from './user/twitter';

export async function getUserAuthData(
  id: User['id'] | undefined
): Promise<UserAuthData | undefined> {
  if (!id) return;
  const user = await selectUser(id);
  if (!user) return;

  return {
    id: user.id,
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
