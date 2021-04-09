import { getIndexOfAlphabet } from './index';

describe('getIndexOfAlphabet', () => {
  test('A should be 1', () => {
    expect(getIndexOfAlphabet('A')).toEqual(1);
  });

  test('AI should be 1*26^1+9*26^0 = 35', () => {
    expect(getIndexOfAlphabet('AI')).toEqual(35);
  });

  test('CK should be 3*26^1+11*26^0 = 89', () => {
    expect(getIndexOfAlphabet('CK')).toEqual(89);
  });
});
