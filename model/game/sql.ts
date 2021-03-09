import { MySql, SqlLimits } from '../../utils/mysql';
import { getTimestamp } from '../../utils/db';
import { DbUser } from '../user/sql';
import { DbImageThumbnail } from '../image/sql';
import { Nullable, TimestampTable } from '../interfaces';

export type GamePermission = 'owner' | 'view' | 'edit' | 'none';

export interface DbGame extends TimestampTable {
  id: string;
  userId: DbUser['id'];
  name: string;
  description: string;
  imageId: number | null;
}

export interface DbGamePermissions {
  gameId: DbGame['id'];
  userId: DbUser['id'];
  permission: GamePermission;
}

export interface DbGameShareLinks {
  id: string;
  gameId: DbGame['id'];
  permission: GamePermission;
}

type SelectGame = Pick<
  DbGame,
  'id' | 'name' | 'description' | 'createdOn' | 'updatedOn'
> & {
  permission: DbGamePermissions['permission'];
  userId: DbUser['id'];
  username: DbUser['username'];
  imagePath: DbImageThumbnail['path'];
};

type SelectGameImage = {
  imagePath: DbImageThumbnail['path'];
};

export const sql = {
  insertGame: (
    db: MySql,
    params: Pick<DbGame, 'id' | 'userId' | 'name' | 'description' | 'imageId'>
  ) => {
    const time = getTimestamp();
    return db.insertOne(queries.insertGame, {
      ...params,
      time,
    });
  },

  deleteGame: (db: MySql, params: Pick<DbGame, 'id' | 'userId'>) => {
    return db.delete(queries.deleteGame, params);
  },

  updateGame: (
    db: MySql,
    params: Pick<DbGame, 'updatedOn' | 'id' | 'userId'> &
      Nullable<Pick<DbGame, 'name' | 'description' | 'imageId'>> & {
        lastUpdate: DbGame['updatedOn'];
      }
  ) => {
    return db.update(queries.updateGame, params);
  },

  updateGameImage: (
    db: MySql,
    params: Pick<DbGame, 'imageId' | 'id' | 'userId'>
  ) => {
    const updatedOn = getTimestamp();
    return db.update(queries.updateGameImage, {
      ...params,
      updatedOn,
    });
  },

  selectGame: (db: MySql, params: Pick<DbGame, 'id' | 'userId'>) => {
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

  insertGameShareLink: (
    db: MySql,
    params: Pick<DbGameShareLinks, 'id' | 'gameId' | 'permission'>
  ) => {
    return db.insertOne(queries.insertGameShareLink, params);
  },

  deleteGameShareLink: (
    db: MySql,
    params: Pick<DbGameShareLinks, 'id'> & Pick<DbGame, 'userId'>
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
      games (id, userId, name, description, imageId, createdOn, updatedOn)
      VALUES (:id, :userId, :name, :description, :imageId, :time, :time)
  `,
  deleteGame: `
    DELETE FROM games
      WHERE id = :id AND userId = :userId
  `,
  updateGame: `
    UPDATE games AS g
      JOIN users u ON g.userId = u.id
      LEFT JOIN games_permissions p ON g.id = p.gameId
    SET
      g.name = COALESCE(:name, name),
      g.description = COALESCE(:description, description),
      g.imageId = COALESCE(:imageId, imageId),
      g.updatedOn = :updatedOn
    WHERE g.id = :id
      AND g.userId = :userId
      AND g.updatedOn = :lastUpdate
      AND COALESCE(p.permission, 'owner') != 'none'
  `,
  updateGameImage: `
    UPDATE games
      SET
        imageId = :imageId,
        updatedOn = :updatedOn
      WHERE id = :id
        AND userId = :userId
  `,
  selectGame: `
    SELECT
      g.id,
      g.name,
      g.description,
      g.createdOn,
      g.updatedOn,
      COALESCE(p.permission, 'owner') AS permission,
      u.id AS userId,
      u.username,
      i.path AS imagePath
    FROM games g
      LEFT JOIN images_thumbnails i ON g.imageId = i.imageId
      JOIN users u ON g.userId = u.id
      LEFT JOIN games_permissions p ON g.id = p.gameId
	  WHERE g.id = :id
      AND g.userId = :userId
		  AND COALESCE(p.permission, 'owner') != 'none'
      AND (
        ISNULL(g.imageId) OR
        i.type = 'gameBanner'
		  )
  `,
  selectUserGames: `
    SELECT
      g.id,
      g.name,
      g.description,
      g.createdOn,
      g.updatedOn,
      p.permission,
      u.id AS userId,
      u.username,
      i.path AS imagePath
    FROM games g
      LEFT JOIN images_thumbnails i ON g.imageId = i.imageId
      JOIN users u ON g.userId = u.id
      LEFT JOIN games_permissions p ON g.id = p.gameId
    WHERE
      g.userId = :userId
      AND (
        ISNULL(g.imageId)
        OR i.type = 'gameThumb'
      )
      AND u.id = :userId
      AND (
        ISNULL(p.permission)
        OR p.permission != 'none'
      )
    ORDER BY g.updatedOn DESC
    LIMIT :rpp
    OFFSET :offset
  `,
  countUserGames: `
    SELECT COUNT(*) AS total
      FROM games
      WHERE games.userId = :userId
  `,
  insertGameShareLink: `
    INSERT INTO
      games_share_links (id, gameId, permission)
      VALUES (:id, :gameId, :permission)
  `,
  deleteGameShareLink: `
    DELETE l
      FROM games_share_links l
      JOIN games g ON l.gameId = g.id
      WHERE l.id = :id:
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
