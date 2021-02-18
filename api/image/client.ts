import { ImageType } from '@model/sql/image';
import { callApi } from '@utils/call-api';
import { ThumbnailInfo } from '@utils/create-thumbnails';

export interface ApiResponse {
  id: number;
  thumbnails: ThumbnailInfo[];
}

export interface RequestBody {
  types: ImageType[];
  data: string; // as base64
}

export function uploadImage(
  types: ImageType[],
  image: File
): Promise<ApiResponse> {
  return new Promise<ApiResponse>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const data = ev.target!.result as string;
      callApi<ApiResponse, {}, RequestBody>('image', 'POST', {
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
