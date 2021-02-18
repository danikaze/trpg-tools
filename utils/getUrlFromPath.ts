import { relative } from 'path';

/**
 * Get the public url of a filesystem path
 */
export function getUrlFromPath(
  path: string,
  relativeTo: string,
  absolute?: true
): string {
  const url = relative(relativeTo, path).replace(/\\/g, '/');
  return absolute ? `/${url}` : url;
}
