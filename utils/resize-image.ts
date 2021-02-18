import sharp, { ResizeOptions, Sharp } from 'sharp';
import { getFileHash } from './get-file-hash';

export interface ResizeImageInfo {
  /** Path as the filesystem */
  path: string;
  /** Width of the resulting image */
  width: number;
  /** Height of the resulting image */
  height: number;
}

export async function resizeImage(
  original: Buffer | Sharp,
  options: ResizeOptions,
  output: string
) {
  const process =
    original instanceof Buffer ? sharp(original) : original.clone();
  const path = await getName(output, process.resize(options));
  const info = await process.resize(options).toFile(path);

  return {
    path,
    width: info.width,
    height: info.height,
  };
}

async function getName(output: string, process: Sharp): Promise<string> {
  if (!output.includes('{hash}')) return output;

  const buffer = await process.toBuffer();
  const hash = await getFileHash(buffer);
  return output.replace(/\{hash\}/g, hash);
}
