import { restApiHandler } from '@api';
import { generateTreasuresApiHandler } from '@api/treasures/generate';

export default restApiHandler({ POST: generateTreasuresApiHandler });
