/**
 * Given an array of items, map them into an object for direct access by
 * using the specified field as a key or the result from the given selector
 * returning the value to use as a key for each item
 *
 * Each item is the original item from the array, so any change will affect
 * both, array and map
 */
export function array2map<
  T extends { [key in K]: string | number },
  K extends keyof T
>(array: T[], keyField: K): Record<T[K], T>;

export function array2map<T, K extends string | number = string | number>(
  array: T[],
  getKey: (item: T) => K
): Record<K, T>;

export function array2map<
  T extends {},
  K extends string | number = string | number
>(array: T[], field: (item: T) => K) {
  return typeof field === 'string'
    ? array2mapField(array, field)
    : array2mapSelector(array, field);
}

function array2mapField<
  T extends { [key in K]: string | number },
  K extends keyof T
>(array: T[], keyField: K): Record<T[K], T> {
  return array.reduce((res, item) => {
    res[item[keyField]] = item;
    return res;
  }, {} as Record<T[K], T>);
}

function array2mapSelector<T, K extends string | number = string | number>(
  array: T[],
  getKey: (item: T) => K
): Record<K, T> {
  return array.reduce((res, item) => {
    res[getKey(item)] = item;
    return res;
  }, {} as Record<K, T>);
}
