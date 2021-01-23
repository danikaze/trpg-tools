import 'jest';
import { getUniqueElems } from '@utils/get-unique-elems';

// tslint:disable: no-magic-numbers
describe('getUniqueElems', () => {
  it('should return empty array if the given array was empty', () => {
    const orig: number[] = [];
    const expected: number[] = [];
    const res = getUniqueElems(orig);

    expect(res).toEqual(expected);
    expect(res).not.toBe(expected);
  });

  it('should return a copy of the array if there are no repeated elements', () => {
    const orig = [1, 2, 3, 4, 5];
    const expected = [...orig];
    const res = getUniqueElems(orig);

    expect(res).toEqual(expected);
    expect(res).not.toBe(expected);
  });

  it('should return only unique elements, if repeated', () => {
    const orig = [1, 1, 2, 3, 3, 1, 2];
    const expected = [1, 2, 3];
    const res = getUniqueElems(orig);

    expect(res).toEqual(expected);
    expect(res).not.toBe(expected);
  });

  it('it should use identity to compare', () => {
    const one1 = { n: 1 };
    const one2 = { n: 1 };
    const two1 = { n: 2 };
    const orig = [two1, one1, one2, two1];
    const expected = [two1, one1, one2];
    const res = getUniqueElems(orig);

    expect(res).toEqual(expected);
    expect(res).not.toBe(expected);
  });
});
