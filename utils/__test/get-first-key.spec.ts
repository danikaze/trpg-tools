import 'jest';
import { getFirstKey } from '@utils/get-first-key';

// tslint:disable: no-magic-numbers
describe('getFirstKey', () => {
  it('should return undefined for an empty array', () => {
    expect(getFirstKey({})).toBeUndefined();
  });

  it('should return the first key of an object', () => {
    const nObj1 = { 0: 'a', 1: 'b', 2: 'c' };
    const nObj2 = { 2: 'c', 0: 'a', 1: 'b' };
    const sObj1 = { a: 1, b: 2 };
    const sObj2 = { b: 2, a: 1 };

    expect(getFirstKey(nObj1)).toEqual('0');
    expect(getFirstKey(nObj2)).toEqual('0');
    expect(getFirstKey(sObj1)).toEqual('a');
    expect(getFirstKey(sObj2)).toEqual('b');
  });
});
