import { restApiHandler } from '@api';
import { deleteGameApiHandler } from '@api/game/delete';
import { updateGameApiHandler } from '@api/game/update';

export default restApiHandler({
  PUT: updateGameApiHandler,
  DELETE: deleteGameApiHandler,
});
