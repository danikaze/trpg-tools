import { restApiHandler } from '@api';
import { createSelectNoteApiKey } from '@api/ak/select-note/create-api-key';

export default restApiHandler({
  POST: createSelectNoteApiKey,
});
