import { AVLTree } from '../avltree';
import { TreeTraversalOrder } from '../../utils/tree-traversal-order';
import { printTree } from '../../utils/printer';

describe('Test AVL Tree', () => {
  let avlTree;

  describe('Test on empty AVL tree', () => {
    beforeEach(() => {
      avlTree = new AVLTree();
    });

    test('Tree should be empty with size = 0', () => {
      expect(avlTree.size()).toBe(0);
      expect(avlTree.isEmpty()).toBeTruthy();
    });

    test('Tree height should be -1', () => {
      expect(avlTree.height()).toBe(-1);
    });

    test('Should satisfy BST invariant', () => {
      expect(avlTree.validateBSTInvariant()).toBe(true);
    });

    test('Contains(elem) and remove(elem) should return false', () => {
      expect(avlTree.contains(324)).toBeFalsy();
      expect(avlTree.contains('hello')).toBeFalsy();
      expect(avlTree.contains({ data: 'one' })).toBeFalsy();

      expect(avlTree.remove(324)).toBeFalsy();
      expect(avlTree.remove('hello')).toBeFalsy();
      expect(avlTree.remove({ data: 'one' })).toBeFalsy();
    });

    test('Clear() should run as if it is non-empty', () => {
      avlTree.clear();
    });

    test('Add(elem) should be able to add new number to the tree', () => {
      avlTree.add(5);
      expect(avlTree.size()).toBe(1);
      expect(avlTree.isEmpty()).toBeFalsy();
      expect(avlTree.contains(5)).toBeTruthy();
      expect(avlTree.contains(4)).toBeFalsy();
    });

    test('Add(elem) should be able to add new string to the tree', () => {
      avlTree.add('hello');
      expect(avlTree.size()).toBe(1);
      expect(avlTree.isEmpty()).toBeFalsy();
      expect(avlTree.contains('hello')).toBeTruthy();
      expect(avlTree.contains('hi')).toBeFalsy();
    });

    test('Add(elem) should be able to add new object to the tree', () => {
      const objElem = { name: 'John', age: 20 };
      avlTree.add(objElem);
      expect(avlTree.size()).toBe(1);
      expect(avlTree.isEmpty()).toBeFalsy();

      // cannot call contains for object as of now because avlTree needs a different comparator to work with different object
    });

    test('traverse call without input or incorrect input should return null', () => {
      expect(avlTree.traverse()).toBeNull();
      expect(avlTree.traverse('random order')).toBeNull();
    });

    test('traverse call with a value from TreeTraversalOrder will return an iterator that its next().done is true', () => {
      let iter = avlTree.traverse(TreeTraversalOrder.PRE_ORDER);
      expect(Symbol.iterator in iter).toBeTruthy();
      expect(iter.next().done).toBeTruthy();

      iter = avlTree.traverse(TreeTraversalOrder.IN_ORDER);
      expect(Symbol.iterator in iter).toBeTruthy();
      expect(iter.next().done).toBeTruthy();

      iter = avlTree.traverse(TreeTraversalOrder.POST_ORDER);
      expect(Symbol.iterator in iter).toBeTruthy();
      expect(iter.next().done).toBeTruthy();

      iter = avlTree.traverse(TreeTraversalOrder.LEVEL_ORDER);
      expect(Symbol.iterator in iter).toBeTruthy();
      expect(iter.next().done).toBeTruthy();
    });

    test('avlTree[Symbol.iterator] should behave the same way avlTree.traverse does', () => {
      expect(avlTree[Symbol.iterator]()).toBeNull();
      expect(avlTree[Symbol.iterator]('random order')).toBeNull();

      const iter = avlTree[Symbol.iterator](TreeTraversalOrder.PRE_ORDER);
      expect(Symbol.iterator in iter).toBeTruthy();
      expect(iter.next().done).toBeTruthy();
    });
  });

  test('Test adding new elements to the tree. Test 4 rotation cases', () => {
    avlTree = new AVLTree();
    avlTree.add(28);
    expect(avlTree.size()).toBe(1);
    expect(avlTree.isEmpty()).toBeFalsy();
    expect(avlTree.contains(28)).toBeTruthy();
    expect(avlTree.contains(2)).toBeFalsy();
    expect(avlTree.height()).toBe(0);
    expect(avlTree.toString()).toBe('28');

    // add duplicate
    avlTree.add(28);
    expect(avlTree.size()).toBe(1);

    avlTree.add(50);
    expect(avlTree.height()).toBe(1);
    expect(avlTree.toString()).toBe('28 50');

    avlTree.add(9);
    expect(avlTree.height()).toBe(1);
    expect(avlTree.toString()).toBe('28 9 50');

    avlTree.add(12);
    expect(avlTree.height()).toBe(2);
    expect(avlTree.toString()).toBe('28 9 50 12');

    avlTree.add(15); // right right case
    expect(avlTree.height()).toBe(2);
    expect(avlTree.toString()).toBe('28 12 50 9 15');

    avlTree.add(30);
    expect(avlTree.height()).toBe(2);
    expect(avlTree.toString()).toBe('28 12 50 9 15 30');

    avlTree.add(3); // left right case
    expect(avlTree.height()).toBe(3);
    expect(avlTree.toString()).toBe('28 12 50 9 15 30 3');

    avlTree.add(6);
    expect(avlTree.height()).toBe(3);
    expect(avlTree.toString()).toBe('28 12 50 6 15 30 3 9');

    avlTree.add(1); // left left case
    expect(avlTree.height()).toBe(3);
    expect(avlTree.toString()).toBe('28 6 50 3 12 30 1 9 15');

    avlTree.add(70);
    avlTree.add(90);
    expect(avlTree.height()).toBe(3);
    expect(avlTree.toString()).toBe('28 6 50 3 12 30 70 1 9 15 90');

    avlTree.add(80); // right left case
    expect(avlTree.height()).toBe(3);
    expect(avlTree.toString()).toBe('28 6 50 3 12 30 80 1 9 15 70 90');

    expect(avlTree.validateBSTInvariant()).toBe(true);

    avlTree.clear();
  });

  describe('Test on non-empty tree with data type string or number', () => {
    afterEach(() => {
      avlTree.clear();
      expect(avlTree.size()).toBe(0);
      expect(avlTree.isEmpty()).toBeTruthy();
      expect(avlTree.toString()).toBe('');
    });

    beforeEach(() => {
      avlTree = new AVLTree();
      avlTree.add(28);
      avlTree.add(50);
      avlTree.add(9);
      avlTree.add(12);
      avlTree.add(15);
      avlTree.add(30);
      avlTree.add(3);
      avlTree.add(6);
      avlTree.add(1);
      avlTree.add(70);
      avlTree.add(90);
      avlTree.add(80);
      expect(avlTree.size()).toBe(12);
    });

    test('Should hold the BST invariant', () => {
      expect(avlTree.validateBSTInvariant()).toBe(true);
    });

    test('Contains() should return true if the element exists in the tree', () => {
      expect(avlTree.contains(12)).toBeTruthy();
      expect(avlTree.contains(70)).toBeTruthy();
      expect(avlTree.contains(100)).toBeFalsy();
      expect(avlTree.contains(0)).toBeFalsy();
    });

    test('Remove(elem) should return true if the element existed and was removed', () => {
      expect(avlTree.remove(50)).toBeTruthy();
      expect(avlTree.size()).toBe(11);
      expect(avlTree.toString()).toBe('28 6 70 3 12 30 80 1 9 15 90');

      expect(avlTree.remove(50)).toBeFalsy();
      expect(avlTree.remove(90)).toBeTruthy();

      expect(avlTree.remove(28)).toBeTruthy();
      expect(avlTree.size()).toBe(9);
      expect(avlTree.toString()).toBe('15 6 70 3 12 30 80 1 9');

      expect(avlTree.remove(12)).toBeTruthy();
      expect(avlTree.size()).toBe(8);
      expect(avlTree.toString()).toBe('15 6 70 3 9 30 80 1');
    });

    test('4 tree Traversals should display the element right', () => {
      expect(avlTree.toString(TreeTraversalOrder.LEVEL_ORDER)).toBe(
        '28 6 50 3 12 30 80 1 9 15 70 90'
      ); // default is LEVEL order
      expect(avlTree.toString(TreeTraversalOrder.IN_ORDER)).toBe(
        '1 3 6 9 12 15 28 30 50 70 80 90'
      );
      expect(avlTree.toString(TreeTraversalOrder.PRE_ORDER)).toBe(
        '28 6 3 1 12 9 15 50 30 80 70 90'
      );
      expect(avlTree.toString(TreeTraversalOrder.POST_ORDER)).toBe(
        '1 3 9 15 12 6 30 70 90 80 50 28'
      );
    });

    test('traversal should throw error if there are any changes to the tree size', () => {
      const traverse = order => {
        expect(() => {
          for (let value of avlTree.traverse(order)) avlTree.remove(value);
        }).toThrow('Concurrent Modification');
      };

      traverse(TreeTraversalOrder.PRE_ORDER);
      traverse(TreeTraversalOrder.IN_ORDER);
      traverse(TreeTraversalOrder.POST_ORDER);
      traverse(TreeTraversalOrder.LEVEL_ORDER);
    });
  });
});
