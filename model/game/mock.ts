import { DbInitFunction } from '../../utils/mysql';
import { devImages } from '../image/mock';
import { devUsers } from '../user/mock';
import { UserAuthData } from '../user';
import { createGame, CreateGameData, GamePreviewData } from '.';

export const devGames: Record<GamePreviewData['gameId'], GamePreviewData> = {};

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
        imageId: devImages['game1'].imageId,
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
      devGames[game.gameId] = game;
    })
  );
};
