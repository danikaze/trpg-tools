import { restApiHandler } from '@api';
import { newGameApiHandler } from '@api/game/create';

export default restApiHandler({
  POST: newGameApiHandler,
});
