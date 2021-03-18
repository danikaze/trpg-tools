import Cors from 'cors';
import { restApiHandler } from '@api';
import { apiKeyUpdateNote } from '@api/v1/update-note';

const cors = Cors();

export default restApiHandler(
  {
    PUT: apiKeyUpdateNote,
  },
  cors
);
