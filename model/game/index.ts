import { ResultSetHeader } from 'mysql2/promise';
import { Paginated } from '@utils/mysql';
import { generateUniqueId, getDb, getTimestamp } from '@utils/db';
import {
  DbGame,
  DbSelectGame,
  DbSelectGameImage,
  GamePermission,
  sql,
  limits,
} from '../sql/game';
import { DbUser } from '../sql/user';
import { User, UserAuthData } from '../user';
import { TimestampTable } from '..';

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

export async function createGame(
  user: UserAuthData,
  data: Omit<DbGame, 'userId' | 'id' | 'permission' | 'createdOn' | 'updatedOn'>
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
  id: DbGame['id'],
  userId: User['id']
): Promise<void> {
  const db = await getDb();
  await db.execute(sql.deleteGame, { id, userId });
}

export async function updateGame(
  id: DbGame['id'],
  userId: User['id'],
  data: GameUpdateData
): Promise<void> {
  const db = await getDb();
  await db.execute(sql.createGame, {
    id,
    userId,
    name: data.name || null,
    description: data.description || null,
    updatedOn: getTimestamp(),
  });
}

export async function updateGameImage(
  id: DbGame['id'],
  userId: DbUser['id'],
  imageId: DbGame['imageId']
): Promise<void> {
  const db = await getDb();
  await db.execute(sql.createGame, {
    id,
    userId,
    imageId,
    updatedOn: getTimestamp(),
  });
}

export async function selectGameDetails(
  id: DbGame['id'],
  userId: User['id']
): Promise<GameDetailsData | undefined> {
  const db = await getDb();
  const game = await db.queryOne<DbSelectGame>(sql.selectGame, {
    id,
    userId,
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
  userId: User['id'],
  page: number = 0
): Promise<Paginated<GamePreviewData>> {
  const db = await getDb();
  const pages = await db.paginate<DbSelectGame>({
    page,
    rpp: limits.selectUserGames!.default,
    limit: limits.selectUserGames!,
    dataSql: sql.selectUserGames,
    dataParams: { userId },
    countSql: sql.countUserGames,
    countParams: { userId },
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
  gameId: DbGame['id'],
  userId: DbUser['id'],
  permission: GamePermission
): Promise<void> {
  const db = await getDb();
  await db.execute(sql.shareGame, {
    gameId,
    userId,
    permission,
  });
}
