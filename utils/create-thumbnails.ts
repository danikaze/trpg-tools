import { ImageThumbnail, ImageType } from '@model/image/sql';
import { sync as mkdirpSync } from 'mkdirp';
import { join } from 'path';
import sharp, { Metadata, ResizeOptions } from 'sharp';
import { THUMBNAILS_FOLDER } from './constants';
import { DecodedImage } from './decode-base64-image';
import { getFileSize } from './get-filesize';
import { resizeImage, ResizeImageInfo } from './resize-image';

export interface ThumbnailsInfo {
  original: {
    format?: string;
    size?: number;
    width?: number;
    height?: number;
  };
  thumbnails: ThumbnailInfo[];
}

export interface ThumbnailInfo {
  /** Type of the thumbnail */
  type: ImageThumbnail;
  /** Path (not url) to the thumbnail image */
  path: string;
  /** Width of the resulting image */
  width: number;
  /** Height of the resulting image */
  height: number;
  /** Size of the resulting image in bytes */
  size: number;
}

interface ResizeDef extends ResizeOptions {
  type: ImageThumbnail;
  width: number;
  height: number;
}

const sizes: { [imageType in ImageType]: ResizeDef[] } = {
  game: [
    { type: 'gameBanner', width: 600, height: 400, withoutEnlargement: true },
    { type: 'gameThumb', width: 150, height: 150, withoutEnlargement: true },
  ],
  note: [
    { type: 'noteThumb', width: 200, height: 200, withoutEnlargement: true },
  ],
  widgetDef: [
    { type: 'widgetRaw', width: 4000, height: 4000, withoutEnlargement: true },
  ],
};

export async function createThumbnails(
  original: DecodedImage,
  types: ImageType[]
): Promise<ThumbnailsInfo> {
  const promises: Promise<Metadata | ResizeImageInfo>[] = [];
  const thumbTypes: ImageThumbnail[] = [];

  // obtain info about the original
  const process = sharp(original.data);
  promises.push(process.metadata());

  // create thumbnails
  for (const imageType of types) {
    if (!sizes[imageType]) continue;
    for (const { type, ...resizeOptions } of sizes[imageType]) {
      const folder = THUMBNAILS_FOLDER.replace('{type}', type);
      const output = join(folder, `{hash}.${original.ext}`);
      mkdirpSync(folder);
      thumbTypes.push(type);
      promises.push(resizeImage(process, resizeOptions, output));
    }
  }

  return await Promise.all(promises).then(([first, ...thumbs]) => {
    const metadata = first as Metadata;
    return {
      original: {
        format: metadata.format,
        size: metadata.size,
        width: metadata.width,
        height: metadata.height,
      },
      thumbnails: (thumbs as ResizeImageInfo[]).map((thumb, i) => ({
        type: thumbTypes[i],
        path: thumb.path,
        width: thumb.width,
        height: thumb.height,
        size: getFileSize(thumb.path),
      })),
    };
  });
}
