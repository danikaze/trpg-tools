import { MySql } from '@utils/mysql';
import { getTimestamp } from '@utils/db';
import { TimestampTable } from '../interfaces';
import { UserRole } from '.';

export enum UserType {
  SYSTEM_USER = 'sy', // system (no login)
  LOCAL_USER = 'lc', // local (user + pass)
  TWITTER_USER = 'tw', // twitter
}

export interface DbUser extends TimestampTable {
  userId: number;
  type: UserType;
  username: string;
  role: UserRole;
}

export interface DbLocalUser {
  userId: DbUser['userId'];
  /** salt used to encode the original password */
  salt: string;
  /** encoded password */
  password: string;
  /** username in lowercase to compare */
  username: DbUser['username'];
}

export interface DbTwitterUser {
  userId: DbUser['userId'];
  profileId: string;
}

type SelectUser = Pick<DbUser, 'userId' | 'username' | 'role'>;
type SelectLocalUser = Pick<DbLocalUser, 'userId' | 'salt' | 'password'>;

export const sql = {
  insertUser: (
    db: MySql,
    params: Pick<DbUser, 'type' | 'username' | 'role'>
  ) => {
    const time = getTimestamp();

    return db.insertOne(queries.insertUser, {
      ...params,
      time,
    });
  },

  insertLocalUser: (
    db: MySql,
    params: Pick<DbLocalUser, 'userId' | 'username' | 'password' | 'salt'>
  ) => {
    return db.insertOne(queries.insertLocalUser, params);
  },

  insertTwitterUser: (
    db: MySql,
    params: Pick<DbTwitterUser, 'userId' | 'profileId'>
  ) => {
    return db.insertOne(queries.insertTwitterUser, params);
  },

  selectUser: (db: MySql, params: Pick<DbUser, 'userId'>) => {
    return db.queryOne<SelectUser>(queries.selectUser, params);
  },

  selectLocalUser: (db: MySql, params: Pick<DbLocalUser, 'username'>) => {
    return db.queryOne<SelectLocalUser>(queries.selectLocalUser, params);
  },

  selectTwitterUser: (db: MySql, params: Pick<DbTwitterUser, 'profileId'>) => {
    return db.queryOne<SelectUser>(queries.selectTwitterUser, params);
  },
};

const queries = {
  insertUser: `
    INSERT INTO
      users(type, username, role, createdOn, updatedOn)
      VALUES(:type, :username, :role, :time, :time)`,

  insertLocalUser: `INSERT INTO
      users_local(userId, username, password, salt)
      VALUES(:userId, :username, :password, :salt)`,

  insertTwitterUser: `
      INSERT INTO
      users_twitter(userId, profileId)
      VALUES(:userId, :profileId)`,

  selectUser: `
        SELECT userId, username, role
          FROM users
          WHERE userId = :userId`,

  selectLocalUser: `
    SELECT userId, salt, password
      FROM users_local
      WHERE username = :username`,

  selectTwitterUser: `
    SELECT u.userId, u.username, u.role
      FROM users u
      JOIN users_twitter t ON u.userId = t.userId
      WHERE t.profileId = :profileId`,
};
