import { ResultSetHeader } from 'mysql2/promise';
import { UpdateGameResponse } from '../../api/game/interface';
import { Paginated } from '../../utils/mysql';
import { generateUniqueId, getDb, getTimestamp } from '../../utils/db';
import {
  DbGame,
  DbSelectGame,
  DbSelectGameImage,
  GamePermission,
  sql,
  limits,
} from './sql';
import { DbUser } from '../user/sql';
import { UserAuthData } from '../user';
import { TimestampTable } from '../interfaces';

export interface GamePreviewData extends TimestampTable {
  id: DbGame['id'];
  userId: DbUser['id'];
  username: DbUser['username'];
  name: string;
  description: string;
  imageUrl: string | null;
  permission: GamePermission;
}

export interface GameDetailsData extends TimestampTable {
  id: DbGame['id'];
  userId: DbUser['id'];
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

export type CreateGameData = Omit<
  DbGame,
  'userId' | 'id' | 'permission' | 'createdOn' | 'updatedOn'
>;

export async function createGame(
  user: UserAuthData,
  data: CreateGameData
): Promise<GamePreviewData> {
  const db = await getDb();
  const dbGame: Omit<DbGame, 'updatedOn'> = {
    id: generateUniqueId(),
    userId: user.id,
    name: data.name || '',
    description: data.description || '',
    imageId: data.imageId || null,
    createdOn: getTimestamp(),
  };
  const promises: Promise<ResultSetHeader | DbSelectGameImage | undefined>[] = [
    db.insertOne(sql.createGame, dbGame),
  ];

  if (dbGame.imageId) {
    promises.push(
      db.queryOne<DbSelectGameImage>(sql.selectGamePreviewImage, {
        imageId: dbGame.imageId,
      })
    );
  }

  const [, image] = (await Promise.all(promises)) as [
    ResultSetHeader,
    DbSelectGameImage | undefined
  ];

  return {
    id: dbGame.id,
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
  id: DbGame['id']
): Promise<void> {
  const db = await getDb();
  const res = await db.delete(sql.deleteGame, { id, userId: user.id });

  if (!res.affectedRows) {
    throw new Error('No game found to delete or not enough permissions');
  }
}

export async function updateGame(
  user: UserAuthData,
  gameId: DbGame['id'],
  lastUpdate: number,
  data: GameUpdateData
): Promise<UpdateGameResponse> {
  const db = await getDb();
  const now = getTimestamp();
  const res = await db.update(sql.updateGame, {
    lastUpdate,
    id: gameId,
    userId: user.id,
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
  id: DbGame['id'],
  imageId: DbGame['imageId']
): Promise<void> {
  const db = await getDb();
  await db.execute(sql.createGame, {
    id,
    imageId,
    user: user.id,
    updatedOn: getTimestamp(),
  });
}

export async function selectGameDetails(
  user: UserAuthData,
  id: DbGame['id']
): Promise<GameDetailsData | undefined> {
  const db = await getDb();
  const game = await db.queryOne<DbSelectGame>(sql.selectGame, {
    id,
    userId: user.id,
  });
  if (!game) return;

  return {
    id: game.id,
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
  const pages = await db.paginate<DbSelectGame>({
    page,
    rpp: limits.selectUserGames!.default,
    limit: limits.selectUserGames!,
    dataSql: sql.selectUserGames,
    dataParams: { userId: user.id },
    countSql: sql.countUserGames,
    countParams: { userId: user.id },
  });

  return {
    ...pages,
    data: pages.data.map((game) => ({
      id: game.id,
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

export async function shareGame(
  user: UserAuthData,
  gameId: DbGame['id'],
  permission: GamePermission
): Promise<void> {
  const db = await getDb();
  await db.execute(sql.shareGame, {
    gameId,
    permission,
    user: user.id,
  });
}
