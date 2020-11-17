import { BloomFilter } from '../bloomfilter';

describe('Test BloomFilter DS', () => {
  const bitArraySizes2 = [10009, 100003];
  const bitArraySizes3 = [10009, 100003, 1000003];
  const arr = ['John', 'Alexandra', 'Trump', 'Biden', 'William'];
  const arr2 = ['Rose', 'Daisy', 'Lavender']

  test('Illegal creations should throw errors', () => {
    expect(() => new BloomFilter()).toThrow('Invalid bitArraySizes');
    expect(() => new BloomFilter('hello')).toThrow('Invalid bitArraySizes');

    expect(() => new BloomFilter(bitArraySizes2, true, 'hi')).toThrow('Invalid hashFns input. Expected an array.');
    expect(() => new BloomFilter(bitArraySizes3, true)).toThrow('Inconsistent arrays length');
  });

  test('BloomFilter uses default hash functions', () => {
    const bf = new BloomFilter(bitArraySizes2);
    for (let elem of arr) bf.add(elem);

    for (let elem of arr) expect(bf.contains(elem)).toBeTruthy();
    for (let elem of arr2) expect(bf.contains(elem)).toBeFalsy();
  });
});
