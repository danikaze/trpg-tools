import { restApiHandler } from '@api';
import { newGame } from '@api/game/create';

export default restApiHandler({
  GET: newGame,
  POST: newGame,
});
