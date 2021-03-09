import { restApiHandler } from '@api';
import { getNotesApiHandler } from '@api/game/note/get-notes';

export default restApiHandler({
  GET: getNotesApiHandler,
});
