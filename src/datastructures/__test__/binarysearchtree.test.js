import { BinarySearchTree } from '../binarysearchtree';
import { TreeTraversalOrder } from '../../utils/tree-traversal-order';

const compare = (a, b) => {
  if (a.age < b.age) return -1;
  if (a.age > b.age) return 1;
  if (a.name === b.name) return 0;
  return a.name < b.name ? -1 : 1;
};

const toString = function (order = TreeTraversalOrder.IN_ORDER) {
  const values = [];
  for (let obj of this[Symbol.iterator](order))
    values.push(`${obj.name}${obj.age}`);
  return values.join(' ');
};

describe('Test Binary Search Tree', () => {
  let bst;

  describe('Test empty BST', () => {
    beforeEach(() => {
      bst = new BinarySearchTree();
    });

    test('Tree should be empty with size = 0', () => {
      expect(bst.size()).toBe(0);
      expect(bst.isEmpty()).toBeTruthy();
    });

    test('Tree height should be -1', () => {
      expect(bst.height()).toBe(-1);
    });

    test('Should satisfy BST invariant', () => {
      expect(bst.validateBSTInvariant()).toBe(true);
    });

    test('Contains(elem) and remove(elem) should return false', () => {
      expect(bst.contains(324)).toBeFalsy();
      expect(bst.contains('hello')).toBeFalsy();
      expect(bst.contains({ data: 'one' })).toBeFalsy();

      expect(bst.remove(324)).toBeFalsy();
      expect(bst.remove('hello')).toBeFalsy();
      expect(bst.remove({ data: 'one' })).toBeFalsy();
    });

    test('Clear() should run as if it is non-empty', () => {
      bst.clear();
    });

    test('Add(elem) should be able to add new number to the tree', () => {
      bst.add(5);
      expect(bst.size()).toBe(1);
      expect(bst.isEmpty()).toBeFalsy();
      expect(bst.contains(5)).toBeTruthy();
      expect(bst.contains(4)).toBeFalsy();
    });

    test('Add(elem) should be able to add new string to the tree', () => {
      bst.add('hello');
      expect(bst.size()).toBe(1);
      expect(bst.isEmpty()).toBeFalsy();
      expect(bst.contains('hello')).toBeTruthy();
      expect(bst.contains('hi')).toBeFalsy();
    });

    test('Add(elem) should be able to add new object to the tree', () => {
      const objElem = { name: 'John', age: 20 };
      bst.add(objElem);
      expect(bst.size()).toBe(1);
      expect(bst.isEmpty()).toBeFalsy();

      // cannot call contains for object as of now because bst needs a different comparator to work with different object
    });

    test('traverse call without input or incorrect input should return null', () => {
      expect(bst.traverse()).toBeNull();
      expect(bst.traverse('random order')).toBeNull();
    });

    test('traverse call with a value from TreeTraversalOrder will return an iterator that its next().done is true', () => {
      let iter = bst.traverse(TreeTraversalOrder.PRE_ORDER);
      expect(Symbol.iterator in iter).toBeTruthy();
      expect(iter.next().done).toBeTruthy();

      iter = bst.traverse(TreeTraversalOrder.IN_ORDER);
      expect(Symbol.iterator in iter).toBeTruthy();
      expect(iter.next().done).toBeTruthy();

      iter = bst.traverse(TreeTraversalOrder.POST_ORDER);
      expect(Symbol.iterator in iter).toBeTruthy();
      expect(iter.next().done).toBeTruthy();

      iter = bst.traverse(TreeTraversalOrder.LEVEL_ORDER);
      expect(Symbol.iterator in iter).toBeTruthy();
      expect(iter.next().done).toBeTruthy();
    });

    test('bst[Symbol.iterator] should behave the same way bst.traverse does', () => {
      expect(bst[Symbol.iterator]()).toBeNull();
      expect(bst[Symbol.iterator]('random order')).toBeNull();

      const iter = bst[Symbol.iterator](TreeTraversalOrder.PRE_ORDER);
      expect(Symbol.iterator in iter).toBeTruthy();
      expect(iter.next().done).toBeTruthy();
    });
  });

  describe('Test non-empty tree', () => {
    afterEach(() => {
      bst.clear();
      expect(bst.isEmpty()).toBeTruthy();
      expect(bst.toString()).toBe('');
    });

    test('Test adding new elements (as numbers) to the tree, in-order and level-order tree traversal', () => {
      bst = new BinarySearchTree();
      bst.add(28);
      expect(bst.size()).toBe(1);
      expect(bst.isEmpty()).toBeFalsy();
      expect(bst.contains(28)).toBeTruthy();
      expect(bst.contains(2)).toBeFalsy();
      expect(bst.height()).toBe(0);
      expect(bst.toString()).toBe('28');
      expect(bst.toString(TreeTraversalOrder.LEVEL_ORDER)).toBe('28');

      bst.add(30);
      expect(bst.size()).toBe(2);
      expect(bst.height()).toBe(1);
      expect(bst.toString()).toBe('28 30');
      expect(bst.toString(TreeTraversalOrder.LEVEL_ORDER)).toBe('28 30');

      bst.add(9);
      expect(bst.size()).toBe(3);
      expect(bst.height()).toBe(1);
      expect(bst.toString()).toBe('9 28 30');
      expect(bst.toString(TreeTraversalOrder.LEVEL_ORDER)).toBe('28 9 30');

      bst.add(12);
      expect(bst.size()).toBe(4);
      expect(bst.height()).toBe(2);
      expect(bst.toString()).toBe('9 12 28 30');
      expect(bst.toString(TreeTraversalOrder.LEVEL_ORDER)).toBe('28 9 30 12');

      bst.add(15);
      expect(bst.size()).toBe(5);
      expect(bst.height()).toBe(3);
      expect(bst.toString()).toBe('9 12 15 28 30');
      expect(bst.toString(TreeTraversalOrder.LEVEL_ORDER)).toBe(
        '28 9 30 12 15'
      );

      bst.add(29);
      expect(bst.size()).toBe(6);
      expect(bst.height()).toBe(3);
      expect(bst.toString()).toBe('9 12 15 28 29 30');
      expect(bst.toString(TreeTraversalOrder.LEVEL_ORDER)).toBe(
        '28 9 30 12 29 15'
      );

      // add duplicate doesn't do anything
      bst.add(15);
      expect(bst.size()).toBe(6);
      expect(bst.height()).toBe(3);
      expect(bst.toString()).toBe('9 12 15 28 29 30');
      expect(bst.toString(TreeTraversalOrder.LEVEL_ORDER)).toBe(
        '28 9 30 12 29 15'
      );

      expect(bst.validateBSTInvariant()).toBe(true);
    });

    test('Test adding new elements (as object) to the tree, in-order and level-order tree traversal', () => {
      bst = new BinarySearchTree(compare);
      bst.toString = toString;

      let obj = { name: 'A', age: 28 };
      bst.add(obj);
      expect(bst.size()).toBe(1);
      expect(bst.isEmpty()).toBeFalsy();
      expect(bst.contains(obj)).toBeTruthy();
      expect(bst.height()).toBe(0);
      expect(bst.toString()).toBe('A28');
      expect(bst.toString(TreeTraversalOrder.LEVEL_ORDER)).toBe('A28');

      obj = { name: 'B', age: 30 };
      bst.add(obj);
      expect(bst.size()).toBe(2);
      expect(bst.height()).toBe(1);
      expect(bst.toString()).toBe('A28 B30');
      expect(bst.toString(TreeTraversalOrder.LEVEL_ORDER)).toBe('A28 B30');

      obj = { name: 'C', age: 9 };
      bst.add(obj);
      expect(bst.size()).toBe(3);
      expect(bst.height()).toBe(1);
      expect(bst.toString()).toBe('C9 A28 B30');
      expect(bst.toString(TreeTraversalOrder.LEVEL_ORDER)).toBe('A28 C9 B30');

      obj = { name: 'C', age: 12 };
      bst.add(obj);
      expect(bst.size()).toBe(4);
      expect(bst.height()).toBe(2);
      expect(bst.toString()).toBe('C9 C12 A28 B30');
      expect(bst.toString(TreeTraversalOrder.LEVEL_ORDER)).toBe(
        'A28 C9 B30 C12'
      );

      obj = { name: 'D', age: 15 };
      bst.add(obj);
      expect(bst.size()).toBe(5);
      expect(bst.height()).toBe(3);
      expect(bst.toString()).toBe('C9 C12 D15 A28 B30');
      expect(bst.toString(TreeTraversalOrder.LEVEL_ORDER)).toBe(
        'A28 C9 B30 C12 D15'
      );

      obj = { name: 'E', age: 29 };
      bst.add(obj);
      expect(bst.size()).toBe(6);
      expect(bst.height()).toBe(3);
      expect(bst.toString()).toBe('C9 C12 D15 A28 E29 B30');
      expect(bst.toString(TreeTraversalOrder.LEVEL_ORDER)).toBe(
        'A28 C9 B30 C12 E29 D15'
      );

      // add duplicate value
      obj = { name: 'D', age: 15 };
      bst.add(obj);
      expect(bst.size()).toBe(6);
      expect(bst.height()).toBe(3);
      expect(bst.toString()).toBe('C9 C12 D15 A28 E29 B30');
      expect(bst.toString(TreeTraversalOrder.LEVEL_ORDER)).toBe(
        'A28 C9 B30 C12 E29 D15'
      );

      // Add same age but different name
      obj = { name: 'S', age: 15 };
      bst.add(obj);
      expect(bst.size()).toBe(7);
      expect(bst.height()).toBe(4);
      expect(bst.toString()).toBe('C9 C12 D15 S15 A28 E29 B30');
      expect(bst.toString(TreeTraversalOrder.LEVEL_ORDER)).toBe(
        'A28 C9 B30 C12 E29 D15 S15'
      );

      expect(bst.validateBSTInvariant()).toBe(true);
    });

    describe('Tree contains data as either string or number', () => {
      beforeEach(() => {
        bst = new BinarySearchTree();
        bst.add(28);
        bst.add(30);
        bst.add(9);
        bst.add(12);
        bst.add(15);

        bst.add(29);
        expect(bst.size()).toBe(6);
        expect(bst.height()).toBe(3);
        expect(bst.toString()).toBe('9 12 15 28 29 30');
        expect(bst.toString(TreeTraversalOrder.LEVEL_ORDER)).toBe(
          '28 9 30 12 29 15'
        );

        expect(bst.validateBSTInvariant()).toBe(true);
      });

      test('Contains() should return true if the element exists in the tree', () => {
        expect(bst.contains(12)).toBeTruthy();
        expect(bst.contains(29)).toBeTruthy();
        expect(bst.contains(100)).toBeFalsy();
        expect(bst.contains(0)).toBeFalsy();
      });

      test('Remove(elem) should return true if the element existed and was removed', () => {
        bst.add(7);
        bst.add(13);
        expect(bst.size()).toBe(8);
        expect(bst.height()).toBe(4);
        expect(bst.toString()).toBe('7 9 12 13 15 28 29 30');
        expect(bst.toString(TreeTraversalOrder.LEVEL_ORDER)).toBe(
          '28 9 30 7 12 29 15 13'
        );

        expect(bst.remove()).toBeFalsy();
        expect(bst.remove(0)).toBeFalsy();

        expect(bst.remove(9, true)).toBeTruthy();
        expect(bst.size()).toBe(7);
        expect(bst.height()).toBe(3);
        expect(bst.toString()).toBe('7 12 13 15 28 29 30');
        expect(bst.toString(TreeTraversalOrder.LEVEL_ORDER)).toBe(
          '28 12 30 7 15 29 13'
        );

        expect(bst.remove(28, false)).toBeTruthy();
        expect(bst.size()).toBe(6);
        expect(bst.height()).toBe(2);
        expect(bst.toString()).toBe('7 12 13 15 29 30');
        expect(bst.toString(TreeTraversalOrder.LEVEL_ORDER)).toBe(
          '15 12 30 7 13 29'
        );
      });

      test('Pre-order & Post-order traversal should return the right order', () => {
        // we can test with toSring because toString call the bst iterator which call bst.traverse
        expect(bst.toString(TreeTraversalOrder.PRE_ORDER)).toBe(
          '28 9 12 15 30 29'
        );
        expect(bst.toString(TreeTraversalOrder.POST_ORDER)).toBe(
          '15 12 9 29 30 28'
        );
      });

      test('traversal should throw error if there are any changes to the tree size', () => {
        const traverse = order => {
          expect(() => {
            for (let value of bst.traverse(order)) bst.remove(value);
          }).toThrow('Concurrent Modification');
        };

        traverse(TreeTraversalOrder.PRE_ORDER);
        traverse(TreeTraversalOrder.IN_ORDER);
        traverse(TreeTraversalOrder.POST_ORDER);
        traverse(TreeTraversalOrder.LEVEL_ORDER);
      });

      test('print tree', () => {
        bst.printTree();
      });
    });
  });
});
