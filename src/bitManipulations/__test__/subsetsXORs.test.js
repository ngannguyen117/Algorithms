import { computeXorOfSubsetsXors, computeSumOfSubsetsXors } from '../subsetsXORs';

describe('Test operations on subsets XORs', () => {
  test('Test computing XOR of all subsets XORs', () => {
    expect(computeXorOfSubsetsXors([1, 2, 3])).toBe(0);
    expect(computeXorOfSubsetsXors([3])).toBe(3);
    expect(computeXorOfSubsetsXors([])).toBe(0);
    expect(computeXorOfSubsetsXors([5, 7])).toBe(0);
    expect(computeXorOfSubsetsXors([10])).toBe(10);
  });

  test('Test computing Sum of all subsets XORs', () => {
    expect(computeSumOfSubsetsXors([1, 5, 6])).toBe(28);
    expect(computeSumOfSubsetsXors([1, 3])).toBe(6);
  });
});
