import { DbInitFunction } from '../../utils/mysql';
import { createGame, CreateGameData, GamePreviewData } from '.';
import { devUsers } from '../user/mock';
import { UserAuthData } from '@model/user';

export const devGames: Record<GamePreviewData['id'], GamePreviewData> = {};

interface DevGameDef {
  user: UserAuthData;
  game: CreateGameData;
}

export const gameDevData: DbInitFunction = async (db) => {
  const gameDefinitions: DevGameDef[] = [
    {
      user: devUsers['user1'],
      game: {
        name: 'Game 1',
        description: `User1's game 1.`,
        imageId: null,
      },
    },
    {
      user: devUsers['user1'],
      game: {
        name: 'Game 2',
        description: `User1's game 2.`,
        imageId: null,
      },
    },
    {
      user: devUsers['user2'],
      game: {
        name: 'Game 3',
        description: `User2's game.`,
        imageId: null,
      },
    },
  ];

  await Promise.all(
    gameDefinitions.map(async (def) => {
      const game = await createGame(def.user, def.game);
      devGames[game.id] = game;
    })
  );
};
