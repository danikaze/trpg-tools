import { statSync } from 'fs';

/**
 * Return the size of the specified file in bytes
 */
export function getFileSize(path: string): number {
  const stats = statSync(path);
  return stats.size;
}
