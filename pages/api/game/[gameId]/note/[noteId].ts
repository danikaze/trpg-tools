import { restApiHandler } from '@api';
import { deleteNoteApiHandler } from '@api/game/note/delete';
import { updateNoteApiHandler } from '@api/game/note/update';

export default restApiHandler({
  DELETE: deleteNoteApiHandler,
  PUT: updateNoteApiHandler,
});
