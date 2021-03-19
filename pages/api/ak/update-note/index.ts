import { restApiHandler } from '@api';
import { createUpdateNoteApiKey } from '@api/ak/update-note/create-api-key';

export default restApiHandler({
  POST: createUpdateNoteApiKey,
});
