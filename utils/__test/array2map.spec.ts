import 'jest';
import { array2map } from '@utils/array2map';

describe('array2map', () => {
  // tslint:disable: no-magic-numbers

  const item0 = { n: 1, s: 'a', o: { f: 'x' } };
  const item1 = { n: 2, s: 'b', o: { f: 'y' } };
  const item2 = { n: 3, s: 'c', o: { f: 'z' } };
  const item0b = { n: 1, s: 'x' };

  it('should return an empty map from an empty array', () => {
    const res = array2map([], 'key');
    expect(res).toEqual({});
  });

  it('should return the data mapped by the selected field', () => {
    const array = [item0, item1, item2];
    const numericMap = array2map(array, 'n');
    const stringMap = array2map(array, 's');
    const selectorMap = array2map(array, (item) => item.o.f);

    expect(numericMap).toEqual({
      1: item0,
      2: item1,
      3: item2,
    });

    expect(stringMap).toEqual({
      a: item0,
      b: item1,
      c: item2,
    });
    expect(stringMap[1]).toBeUndefined();
    expect(stringMap[2]).toBeUndefined();
    expect(stringMap[3]).toBeUndefined();

    expect(selectorMap).toEqual({
      x: item0,
      y: item1,
      z: item2,
    });
  });

  it('should override elements if the key is not unique', () => {
    const array = [item0, item0b, item2];
    const map = array2map(array, 'n');
    expect(map).toEqual({
      1: item0b,
      3: item2,
    });
    expect(map[2]).toBeUndefined();
    expect(Object.keys(map)).toEqual(['1', '3']);
  });
});
