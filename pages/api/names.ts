import { restApiHandler } from '@api';
import { getNamesApi } from '@api/names/get';

export default restApiHandler({ GET: getNamesApi });
