/**
 * Get the first key of an object.
 * Order is not assured as by Object specs.
 * Works for string and number keys, but it's always returned as a string
 * Doesn't work for Symbol keys
 */
export function getFirstKey<T extends {}>(obj: T): keyof T | void {
  // tslint:disable-next-line:no-for-in
  for (const key in obj) {
    return key;
  }
}
