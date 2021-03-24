import { restApiHandler } from '@api';
import { createNoteApiHandler } from '@api/game/note/create';

export default restApiHandler({
  POST: createNoteApiHandler,
});
