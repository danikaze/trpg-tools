import { restApiHandler } from '@api';
import { uploadImage } from '@api/image/upload-image';

export default restApiHandler({ POST: uploadImage });
