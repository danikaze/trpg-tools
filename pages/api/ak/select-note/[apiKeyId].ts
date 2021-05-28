import { restApiHandler } from '@api';
import { deleteSelectNoteApiKey } from '@api/ak/select-note/delete-api-key';

export default restApiHandler({
  DELETE: deleteSelectNoteApiKey,
});
