import { UserRole } from '@model/user';
import { TimestampTable } from '../interfaces';

export enum UserType {
  SYSTEM_USER = 'sy', // system (no login)
  LOCAL_USER = 'lc', // local (user + pass)
  TWITTER_USER = 'tw',
} // twitter

export interface DbUser extends TimestampTable {
  id: number;
  type: UserType;
  username: string;
  role: UserRole;
}

export interface DbLocalUser {
  userId: DbUser['id'];
  /** salt used to encode the original password */
  salt: string;
  /** encoded password */
  password: string;
  /** username in lowercase to compare */
  username: DbUser['username'];
}

export interface DbTwitterUser {
  userId: DbUser['id'];
  profileId: string;
}

export const sql = {
  createUser: `
    INSERT INTO
      users(type, username, role, createdOn, updatedOn)
      VALUES(:type, :username, :role, :createdOn, :createdOn)`,
  selectUser: `
    SELECT id, username, role
      FROM users
      WHERE id = :id`,
  createLocalUser: `INSERT INTO
      users_local(userId, username, password, salt)
      VALUES(:userId, :username, :password, :salt)`,
  selectLocalUser: `
    SELECT userId, salt, password
      FROM users_local
      WHERE username = :username`,
  createTwitterUser: `
    INSERT INTO
      users_twitter(userId, profileId)
      VALUES(:userId, :profileId)`,
  selectUserFromTwitter: `
    SELECT id, username, role
      FROM users u, users_twitter t
      WHERE u.id = t.userId
        AND t.profileId = :profileId`,
};
