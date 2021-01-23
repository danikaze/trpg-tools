/**
 * Get a new array with only unique elements.
 * Elements are compared via identity and only the first one of them is kept if
 * they appear multiple times.
 */
export function getUniqueElems<T>(elems: T[]): T[] {
  const res: T[] = [];

  for (const e of elems) {
    if (res.indexOf(e) === -1) {
      res.push(e);
    }
  }

  return res;
}
