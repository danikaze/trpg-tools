import { ResultSetHeader } from 'mysql2/promise';
import { generateUniqueId, getDb, getTimestamp } from '@utils/db';
import { Rng } from '@utils/rng';
import { Paginated } from '@utils/mysql';
import { UpdateGameResponse } from '@api/game/interface';
import {
  GAME_SHARE_LINK_CHARSET,
  GAME_SHARE_LINK_LENGTH,
} from '@model/constants/sql';
import { DbUser } from '@model/user/sql';
import { UserAuthData } from '@model/user';
import { TimestampTable } from '@model/interfaces';
import { DbGame, GamePermission, sql, DbGameShareLinks } from './sql';

export interface GamePreviewData extends TimestampTable {
  gameId: DbGame['gameId'];
  userId: DbUser['userId'];
  username: DbUser['username'];
  name: string;
  description: string;
  imageUrl: string | null;
  permission: GamePermission;
}

export type GameNamesMapping = Record<string, DbGame['name']>;
export interface GameDetailsData extends TimestampTable {
  gameId: DbGame['gameId'];
  userId: DbUser['userId'];
  username: DbUser['username'];
  name: string;
  description: string;
  imageUrl: string | null;
  permission: GamePermission;
}

export interface GameUpdateData {
  name: DbGame['name'];
  description: DbGame['description'];
  imageId?: DbGame['imageId'];
}

export type CreateGameData = Pick<DbGame, 'name' | 'description' | 'imageId'>;

const rng = new Rng();

export async function createGame(
  user: UserAuthData,
  data: CreateGameData
): Promise<GamePreviewData> {
  const db = await getDb();
  const dbGame: Omit<DbGame, 'updatedOn'> = {
    gameId: generateUniqueId(),
    userId: user.userId,
    name: data.name || '',
    description: data.description || '',
    imageId: data.imageId || null,
    createdOn: getTimestamp(),
  };
  const promises: Promise<unknown>[] = [sql.insertGame(db, dbGame)];

  if (dbGame.imageId) {
    promises.push(
      sql.selectGamePreviewImage(db, {
        imageId: dbGame.imageId,
      })
    );
  }

  const [, image] = await Promise.all(
    promises as [
      ReturnType<typeof sql.insertGame>,
      ReturnType<typeof sql.selectGamePreviewImage> | undefined
    ]
  );

  return {
    gameId: dbGame.gameId,
    userId: dbGame.userId,
    name: dbGame.name,
    description: dbGame.description,
    username: user.username,
    permission: 'owner',
    createdOn: dbGame.createdOn,
    updatedOn: dbGame.createdOn,
    imageUrl: (image && image.imagePath) || null,
  };
}

export async function deleteGame(
  user: UserAuthData,
  gameId: DbGame['gameId']
): Promise<void> {
  const db = await getDb();
  const res = await sql.deleteGame(db, { gameId, userId: user.userId });

  if (!res.affectedRows) {
    throw new Error('No game found to delete or not enough permissions');
  }
}

export async function updateGame(
  user: UserAuthData,
  gameId: DbGame['gameId'],
  lastUpdate: DbGame['updatedOn'],
  data: GameUpdateData
): Promise<UpdateGameResponse> {
  const db = await getDb();
  const now = getTimestamp();
  const res = await sql.updateGame(db, {
    lastUpdate,
    gameId,
    userId: user.userId,
    name: data.name || null,
    description: data.description || null,
    imageId: data.imageId || null,
    updatedOn: now,
  });

  if (!res.affectedRows) {
    throw new Error(
      'No game found to update, not enough permissions or the game was updated somewhere else'
    );
  }

  return { updatedOn: now };
}

export async function updateGameImage(
  user: UserAuthData,
  gameId: DbGame['gameId'],
  imageId: DbGame['imageId']
): Promise<void> {
  const db = await getDb();
  await sql.updateGameImage(db, {
    gameId,
    imageId,
    userId: user.userId,
  });
}

export async function selectGameDetails(
  user: UserAuthData,
  gameId: DbGame['gameId']
): Promise<GameDetailsData | undefined> {
  const db = await getDb();
  const game = await sql.selectGame(db, {
    gameId,
    userId: user.userId,
  });
  if (!game) return;

  return {
    gameId: game.gameId,
    userId: game.userId,
    username: game.username,
    name: game.name,
    description: game.description,
    imageUrl: game.imagePath,
    permission: game.permission,
    createdOn: game.createdOn,
    updatedOn: game.updatedOn,
  };
}

export async function selectUserGames(
  user: UserAuthData,
  page: number = 0
): Promise<Paginated<GamePreviewData>> {
  const db = await getDb();
  const pages = await sql.paginateUserGames(db, page, { userId: user.userId });

  return {
    ...pages,
    data: pages.data.map((game) => ({
      gameId: game.gameId,
      userId: game.userId,
      username: game.username,
      name: game.name,
      description: game.description,
      imageUrl: game.imagePath,
      permission: game.permission,
      createdOn: game.createdOn,
      updatedOn: game.updatedOn,
    })),
  };
}

export async function selectGameNames(
  user: UserAuthData,
  gameIds: DbGame['gameId'][]
): Promise<GameNamesMapping> {
  const db = await getDb();
  const res = await sql.selectGameNames(db, {
    gameIds,
    userId: user.userId,
  });

  return res.reduce((res, row) => {
    res[row.gameId] = row.name;
    return res;
  }, {} as GameNamesMapping);
}

export async function shareGame(
  user: UserAuthData,
  gameId: DbGame['gameId'],
  permission: GamePermission
): Promise<DbGameShareLinks['linkId']> {
  const db = await getDb();
  const linkId = rng.randomString(
    GAME_SHARE_LINK_CHARSET,
    GAME_SHARE_LINK_LENGTH
  );
  let n = 3;
  let res: ResultSetHeader;

  // TODO: Check that the gameId is really from the userId
  while (!(res!.affectedRows > 0) && n > 0) {
    n--;
    res = await sql.insertGameShareLink(db, {
      linkId,
      gameId,
      permission,
    });
  }

  if (n <= 0) {
    throw new Error(`Game share link couldn't be created`);
  }

  return linkId;
}
