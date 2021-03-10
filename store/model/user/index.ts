import { UserAuthData } from '@model/user';

export type UserState = null | {
  userId: UserAuthData['userId'];
  username: UserAuthData['username'];
  role: UserAuthData['role'];
};
