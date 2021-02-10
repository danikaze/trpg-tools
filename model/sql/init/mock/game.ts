import { DbInitFunction } from '../../../../utils/mysql';
import { createGame, shareGame } from '../../../../model/game';

export const gameDevData: DbInitFunction = async (db) => {
  // tslint:disable:no-magic-numbers
  // await createGame({
  //   userId: 2,
  //   name: 'Game 1',
  //   description: `User1's game 1.`,
  // });
  // await db.transaction(
  //   async () => {
  //     const game = await createGame({
  //       userId: 2,
  //       name: 'Game 2',
  //       description: `User1's game 2.`,
  //       imageUrl: '',
  //       thumbUrl: '',
  //     });
  //     await shareGame(game.id, 3, 'view');
  //   },
  //   { throw: true }
  // );
  // await createGame({
  //   userId: 3,
  //   name: 'Game 3',
  //   description: `User2's game.`,
  //   imageUrl: '',
  //   thumbUrl: '',
  // });
};
