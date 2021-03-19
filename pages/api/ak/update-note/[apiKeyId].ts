import { restApiHandler } from '@api';
import { deleteUpdateNoteApiKey } from '@api/ak/update-note/delete-api-key';

export default restApiHandler({
  DELETE: deleteUpdateNoteApiKey,
});
