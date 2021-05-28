/**
 * Convert the provided object into an array with its values and the order
 * defined by the iteration, ignoring the keys
 *
 * Note that the elements in the array are just references to the ones in the
 * provided object
 */
export function map2array<T extends {}>(obj: T): T[keyof T][];

/**
 * Convert the provided object into an array with the returned values by
 * the provided `transform` function.
 * Think it as a `map` for an object.
 *
 * Note that the elements in the array are just references to the ones in the
 * provided object
 */
export function map2array<R, T extends {}>(
  obj: T,
  transform: (key: keyof T, item: T[keyof T]) => R
): R[];

export function map2array<T extends {}, R>(
  obj: T,
  transform: (key: keyof T, item: T[keyof T]) => R = getItem as () => R
) {
  if (!obj) return [];
  return Object.entries(obj).reduce((arr, [key, item]) => {
    arr.push(transform(key as keyof T, item as T[keyof T]));
    return arr;
  }, [] as R[]);
}

function getItem<T extends {}>(key: keyof T, item: T[keyof T]) {
  return item;
}
