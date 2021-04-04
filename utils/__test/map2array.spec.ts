import 'jest';
import { map2array } from '@utils/map2array';

describe('map2array', () => {
  const item0 = { value: 'foobar-0' };
  const item1 = { value: 'foobar-1' };
  const item2 = { value: 'foobar-2' };

  it('should return an empty array from invalid data', () => {
    const res = map2array((null as unknown) as []);
    expect(res).toStrictEqual([]);
  });

  it('should return an empty array from an empty object', () => {
    const res = map2array({});
    expect(res).toStrictEqual([]);
  });

  it('should return the object data as it is, as an array', () => {
    const obj = {
      i0: item0,
      i1: item1,
      i2: item2,
    };

    const res = map2array(obj);
    expect(res).toStrictEqual([item0, item1, item2]);
  });

  it('should return the object data transformed as specified, as an array', () => {
    const obj = {
      i0: item0,
      i1: item1,
      i2: item2,
    };
    const res = map2array(obj, (key, item) => ({ key, item }));
    expect(res).toStrictEqual([
      { key: 'i0', item: item0 },
      { key: 'i1', item: item1 },
      { key: 'i2', item: item2 },
    ]);
  });
});
