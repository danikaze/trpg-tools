import { SqlLimits } from '@utils/mysql';
import { DbUser } from './user';
import { DbTimestampTable } from '.';
import { DbImageThumbnail } from './image';

export type GamePermission = 'owner' | 'view' | 'edit' | 'none';

export interface DbGame extends DbTimestampTable {
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

export type DbSelectGame = Pick<
  DbGame,
  'id' | 'name' | 'description' | 'createdOn' | 'updatedOn'
> & {
  permission: DbGamePermissions['permission'];
  userId: DbUser['id'];
  username: DbUser['username'];
  imagePath: DbImageThumbnail['path'];
};

export type DbSelectGameImage = {
  imagePath: DbImageThumbnail['path'];
};

export const sql = {
  createGame: `
    INSERT INTO
      games (id, userId, name, description, imageId, createdOn, updatedOn)
      VALUES (:id, :userId, :name, :description, :imageId, :createdOn, :createdOn)
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
  createGameShareLink: `
    INSERT INTO
      games_share_links (id, gameId, permission)
      VALUES (:id, :gameId, :permission)
  `,
  deleteGameShareLink: `
    DELETE FROM games_share_links
      WHERE id = :id
      -- AND (SELECT userId FROM games) = :userId
  `,
  shareGame: `
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

export const limits: SqlLimits<typeof sql> = {
  selectUserGames: { default: 10, max: 25, min: 5 },
};
