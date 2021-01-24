import { UserRole } from '@model/user';

export type UserType =
  | 'lc' // local (user + pass)
  | 'tw'; // twitter

export interface DbUser {
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
      users(type, username, role)
      VALUES(:type, :username, :role)`,
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
