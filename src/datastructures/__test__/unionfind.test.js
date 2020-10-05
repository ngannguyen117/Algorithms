import { UnionFind } from '../unionfind';

describe('Test UnionFind', () => {
  let uf;

  describe('Test UnionFind creation', () => {
    test('Create UnionFind with size <= 0 should throw error', () => {
      expect(() => new UnionFind(0)).toThrow('Size is required, size > 0');
      expect(() => new UnionFind(-1)).toThrow('Size is required, size > 0');
      expect(() => new UnionFind(-32834)).toThrow('Size is required, size > 0');
    });

    test('Create UnionFind with size > 1 should not throw any errors', () => {
      expect(() => new UnionFind(1)).not.toThrow(
        'Size is required to be greater than 0'
      );

      expect(() => new UnionFind(100)).not.toThrow(
        'Size is required to be greater than 0'
      );
    });

    test('Successful UnifonFind creation should set the size to the provided size, and initialize componentSize and parents arrays', () => {
      uf = new UnionFind(5);
      expect(uf.size()).toBe(5);
      expect(uf.components()).toBe(5);
      for (let i = 0; i < 5; i++) expect(uf.sizeOfComponent(i)).toBe(1);
    });
  });

  describe('Test number of components, component size, connectivity', () => {
    beforeEach(() => {
      uf = new UnionFind(5);
    });

    test('Number of components decrements for each union call if the elements are not connected', () => {
      expect(uf.components()).toBe(5);

      uf.union(0, 1);
      expect(uf.components()).toBe(4);

      uf.union(1, 0);
      expect(uf.components()).toBe(4);

      uf.union(1, 2);
      expect(uf.components()).toBe(3);

      uf.union(0, 2);
      expect(uf.components()).toBe(3);

      uf.union(2, 1);
      expect(uf.components()).toBe(3);

      uf.union(3, 4);
      expect(uf.components()).toBe(2);

      uf.union(4, 3);
      expect(uf.components()).toBe(2);

      uf.union(1, 3);
      expect(uf.components()).toBe(1);

      uf.union(4, 0);
      expect(uf.components()).toBe(1);
    });

    test('Component size should change if there is a merge between components', () => {
      expect(uf.sizeOfComponent(0)).toBe(1);
      expect(uf.sizeOfComponent(1)).toBe(1);
      expect(uf.sizeOfComponent(2)).toBe(1);
      expect(uf.sizeOfComponent(3)).toBe(1);
      expect(uf.sizeOfComponent(4)).toBe(1);

      uf.union(0, 1);
      expect(uf.sizeOfComponent(0)).toBe(2);
      expect(uf.sizeOfComponent(1)).toBe(2);
      expect(uf.sizeOfComponent(2)).toBe(1);
      expect(uf.sizeOfComponent(3)).toBe(1);
      expect(uf.sizeOfComponent(4)).toBe(1);

      uf.union(1, 2);
      expect(uf.sizeOfComponent(0)).toBe(3);
      expect(uf.sizeOfComponent(1)).toBe(3);
      expect(uf.sizeOfComponent(2)).toBe(3);
      expect(uf.sizeOfComponent(3)).toBe(1);
      expect(uf.sizeOfComponent(4)).toBe(1);

      uf.union(0, 2);
      expect(uf.sizeOfComponent(0)).toBe(3);
      expect(uf.sizeOfComponent(1)).toBe(3);
      expect(uf.sizeOfComponent(2)).toBe(3);
      expect(uf.sizeOfComponent(3)).toBe(1);
      expect(uf.sizeOfComponent(4)).toBe(1);

      uf.union(3, 4);
      expect(uf.sizeOfComponent(0)).toBe(3);
      expect(uf.sizeOfComponent(1)).toBe(3);
      expect(uf.sizeOfComponent(2)).toBe(3);
      expect(uf.sizeOfComponent(3)).toBe(2);
      expect(uf.sizeOfComponent(4)).toBe(2);

      uf.union(1, 3);
      expect(uf.sizeOfComponent(0)).toBe(5);
      expect(uf.sizeOfComponent(1)).toBe(5);
      expect(uf.sizeOfComponent(2)).toBe(5);
      expect(uf.sizeOfComponent(3)).toBe(5);
      expect(uf.sizeOfComponent(4)).toBe(5);

      uf.union(4, 0);
      expect(uf.sizeOfComponent(0)).toBe(5);
      expect(uf.sizeOfComponent(1)).toBe(5);
      expect(uf.sizeOfComponent(2)).toBe(5);
      expect(uf.sizeOfComponent(3)).toBe(5);
      expect(uf.sizeOfComponent(4)).toBe(5);
    });

    test('After each union call, the appropriate elements should be connected to each other', () => {
      for (let i = 0; i < 5; i++) expect(uf.connected(i, i)).toBeTruthy();

      uf.union(0, 1);
      expect(uf.connected(0, 1)).toBeTruthy();
      expect(uf.connected(1, 0)).toBeTruthy();
      expect(uf.connected(1, 2)).toBeFalsy();
      expect(uf.connected(0, 2)).toBeFalsy();
      expect(uf.connected(3, 2)).toBeFalsy();
      expect(uf.connected(3, 4)).toBeFalsy();
      expect(uf.connected(1, 4)).toBeFalsy();
      expect(uf.connected(0, 4)).toBeFalsy();

      uf.union(1, 2);
      expect(uf.connected(0, 1)).toBeTruthy();
      expect(uf.connected(1, 0)).toBeTruthy();
      expect(uf.connected(1, 2)).toBeTruthy();
      expect(uf.connected(0, 2)).toBeTruthy();
      expect(uf.connected(3, 2)).toBeFalsy();
      expect(uf.connected(3, 4)).toBeFalsy();
      expect(uf.connected(1, 4)).toBeFalsy();
      expect(uf.connected(0, 4)).toBeFalsy();

      uf.union(4, 3);
      expect(uf.connected(0, 1)).toBeTruthy();
      expect(uf.connected(1, 0)).toBeTruthy();
      expect(uf.connected(1, 2)).toBeTruthy();
      expect(uf.connected(0, 2)).toBeTruthy();
      expect(uf.connected(3, 2)).toBeFalsy();
      expect(uf.connected(3, 4)).toBeTruthy();
      expect(uf.connected(1, 4)).toBeFalsy();
      expect(uf.connected(0, 4)).toBeFalsy();

      uf.union(3, 1);
      expect(uf.connected(0, 1)).toBeTruthy();
      expect(uf.connected(1, 0)).toBeTruthy();
      expect(uf.connected(1, 2)).toBeTruthy();
      expect(uf.connected(0, 2)).toBeTruthy();
      expect(uf.connected(3, 2)).toBeTruthy();
      expect(uf.connected(3, 4)).toBeTruthy();
      expect(uf.connected(1, 4)).toBeTruthy();
      expect(uf.connected(0, 4)).toBeTruthy();
    });
  });
});
