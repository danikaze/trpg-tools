import Cors from 'cors';
import { restApiHandler } from '@api';
import { apiKeyGetNote } from '@api/v1/note/get-note';
import { apiKeyUpdateNote } from '@api/v1/note/update-note';

const cors = Cors();

export default restApiHandler(
  {
    GET: apiKeyGetNote,
    PUT: apiKeyUpdateNote,
  },
  cors
);
