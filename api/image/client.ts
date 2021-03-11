import { ImageType } from '@model/image/sql';
import { callApi } from '@utils/call-api';
import { UploadImageResponse, UploadImageBody } from './interface';

export function uploadImage(
  types: ImageType[],
  image: File
): Promise<UploadImageResponse> {
  return new Promise<UploadImageResponse>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const data = ev.target!.result as string;
      callApi<UploadImageResponse, {}, UploadImageBody>('image', 'POST', {
        data: {
          types,
          data,
        },
      })
        .then((response) => resolve(response.data))
        .catch(reject);
    };
    reader.readAsDataURL(image);
  });
}
