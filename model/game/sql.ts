import { MySql, SqlLimits } from '@utils/mysql';
import { getTimestamp } from '@utils/db';
import { DbUser } from '../user/sql';
import { DbImageThumbnail } from '../image/sql';
import { Nullable, TimestampTable } from '../interfaces';

export type GamePermission = 'owner' | 'view' | 'edit' | 'none';

export interface DbGame extends TimestampTable {
  gameId: string;
  userId: DbUser['userId'];
  name: string;
  description: string;
  imageId: number | null;
}

export interface DbGamePermissions {
  gameId: DbGame['gameId'];
  userId: DbUser['userId'];
  permission: GamePermission;
}

export interface DbGameShareLinks {
  linkId: string;
  gameId: DbGame['gameId'];
  permission: GamePermission;
}

export type DbGameName = Pick<DbGame, 'gameId' | 'name'>;

type SelectGame = Pick<
  DbGame,
  'gameId' | 'name' | 'description' | 'createdOn' | 'updatedOn'
> & {
  permission: DbGamePermissions['permission'];
  userId: DbUser['userId'];
  username: DbUser['username'];
  imagePath: DbImageThumbnail['path'];
};

type SelectGameImage = {
  imagePath: DbImageThumbnail['path'];
};

export const sql = {
  insertGame: (
    db: MySql,
    params: Pick<
      DbGame,
      'gameId' | 'userId' | 'name' | 'description' | 'imageId'
    >
  ) => {
    const time = getTimestamp();
    return db.insertOne(queries.insertGame, {
      ...params,
      time,
    });
  },

  deleteGame: (db: MySql, params: Pick<DbGame, 'gameId' | 'userId'>) => {
    return db.delete(queries.deleteGame, params);
  },

  updateGame: (
    db: MySql,
    params: Pick<DbGame, 'updatedOn' | 'gameId' | 'userId'> &
      Nullable<Pick<DbGame, 'name' | 'description' | 'imageId'>> & {
        lastUpdate: DbGame['updatedOn'];
      }
  ) => {
    return db.update(queries.updateGame, params);
  },

  updateGameImage: (
    db: MySql,
    params: Pick<DbGame, 'imageId' | 'gameId' | 'userId'>
  ) => {
    const updatedOn = getTimestamp();
    return db.update(queries.updateGameImage, {
      ...params,
      updatedOn,
    });
  },

  selectGame: (db: MySql, params: Pick<DbGame, 'gameId' | 'userId'>) => {
    return db.queryOne<SelectGame>(queries.selectGame, params);
  },

  paginateUserGames: (
    db: MySql,
    page: number,
    params: Pick<DbGame, 'userId'>
  ) => {
    return db.paginate<SelectGame>({
      page,
      rpp: limits.selectUserGames!.default,
      limit: limits.selectUserGames!,
      dataSql: queries.selectUserGames,
      dataParams: params,
      countSql: queries.countUserGames,
      countParams: params,
    });
  },

  selectGameNames: (
    db: MySql,
    params: { userId: DbGame['userId']; gameIds: DbGame['gameId'][] }
  ) => {
    return db.query<DbGameName>(queries.selectGameNames, params);
  },

  insertGameShareLink: (
    db: MySql,
    params: Pick<DbGameShareLinks, 'linkId' | 'gameId' | 'permission'>
  ) => {
    return db.insertOne(queries.insertGameShareLink, params);
  },

  deleteGameShareLink: (
    db: MySql,
    params: Pick<DbGameShareLinks, 'linkId'> & Pick<DbGame, 'userId'>
  ) => {
    return db.delete(queries.deleteGameShareLink, params);
  },

  insertGamePermission: (
    db: MySql,
    params: Pick<DbGamePermissions, 'gameId' | 'userId' | 'permission'>
  ) => {
    return db.insertOne(queries.insertGamePermission, params);
  },

  selectGamePreviewImage: (
    db: MySql,
    params: Pick<DbImageThumbnail, 'imageId'>
  ) => {
    return db.queryOne<SelectGameImage>(queries.selectGamePreviewImage, params);
  },
};

const queries = {
  insertGame: `
    INSERT INTO
      games (gameId, userId, name, description, imageId, createdOn, updatedOn)
      VALUES (:gameId, :userId, :name, :description, :imageId, :time, :time)
  `,
  deleteGame: `
    DELETE FROM games
      WHERE gameId = :gameId AND userId = :userId
  `,
  updateGame: `
    UPDATE games AS g
      JOIN users u ON g.userId = u.userId
      LEFT JOIN games_permissions p ON g.gameId = p.gameId
    SET
      g.name = COALESCE(:name, name),
      g.description = COALESCE(:description, description),
      g.imageId = COALESCE(:imageId, imageId),
      g.updatedOn = :updatedOn
    WHERE g.gameId = :gameId
      AND g.userId = :userId
      AND g.updatedOn = :lastUpdate
      AND COALESCE(p.permission, 'owner') != 'none'
  `,
  updateGameImage: `
    UPDATE games
      SET
        imageId = :imageId,
        updatedOn = :updatedOn
      WHERE gameId = :gameId
        AND userId = :userId
  `,
  selectGame: `
    SELECT
      g.gameId,
      g.name,
      g.description,
      g.createdOn,
      g.updatedOn,
      COALESCE(p.permission, 'owner') AS permission,
      u.userId,
      u.username,
      i.path AS imagePath
    FROM games g
      LEFT JOIN images_thumbnails i ON g.imageId = i.imageId
      JOIN users u ON g.userId = u.userId
      LEFT JOIN games_permissions p ON g.gameId = p.gameId
	  WHERE g.gameId = :gameId
      AND g.userId = :userId
		  AND COALESCE(p.permission, 'owner') != 'none'
      AND (
        ISNULL(g.imageId) OR
        i.type = 'gameBanner'
		  )
  `,
  selectUserGames: `
    SELECT
      g.gameId,
      g.name,
      g.description,
      g.createdOn,
      g.updatedOn,
      p.permission,
      u.userId,
      u.username,
      i.path AS imagePath
    FROM games g
      LEFT JOIN images_thumbnails i ON g.imageId = i.imageId
      JOIN users u ON g.userId = u.userId
      LEFT JOIN games_permissions p ON g.gameId = p.gameId
    WHERE
      g.userId = :userId
      AND (
        ISNULL(g.imageId)
        OR i.type = 'gameThumb'
      )
      AND u.userId = :userId
      AND (
        ISNULL(p.permission)
        OR p.permission != 'none'
      )
    ORDER BY g.updatedOn DESC
    LIMIT :rpp
    OFFSET :offset
  `,
  selectGameNames: `
    SELECT gameId, name
      FROM games
      WHERE userId = :userId
        AND gameId IN (:gameIds)
  `,
  countUserGames: `
    SELECT COUNT(*) AS total
      FROM games
      WHERE games.userId = :userId
  `,
  insertGameShareLink: `
    INSERT INTO
      games_share_links (linkId, gameId, permission)
      VALUES (:linkId, :gameId, :permission)
  `,
  deleteGameShareLink: `
    DELETE l
      FROM games_share_links l
      JOIN games g ON l.gameId = g.gameId
      WHERE l.linkId = :linkId:
        AND g.userId = :userId
  `,
  insertGamePermission: `
    INSERT INTO
      games_permissions (gameId, userId, permission)
      VALUES (:gameId, :userId, :permission)
  `,
  selectGamePreviewImage: `
    SELECT path AS imagePath
      FROM images_thumbnails
      WHERE imageId = :imageId
        AND type = 'gameThumb'
  `,
};

export const limits: SqlLimits<typeof queries> = {
  selectUserGames: { default: 10, max: 25, min: 5 },
};
