import {
  HashTableSeparateChaining,
  HashTableLinearProbing,
  HashTableQuadraticProbing,
} from '../hashtable';

const testHashTable = (HashTable, subtitle) => {
  describe(`Test Hash Table with ${subtitle}`, () => {
    let ht;

    afterEach(() => {
      if (ht) ht.clear();
    });

    describe('Test Hash table creation', () => {
      test('Legal hash table creation', () => {
        expect(new HashTable()).not.toBeNull();
        expect(new HashTable(10)).not.toBeNull();
        expect(new HashTable(15, 0.9)).not.toBeNull();
      });

      test('Illegal hash table creation', () => {
        expect(() => new HashTable(-4)).toThrow('Illegal capacity');
        expect(() => new HashTable(3, Infinity)).toThrow('Illegal load factor');
        expect(() => new HashTable(3, 0)).toThrow('Illegal load factor');
        expect(() => new HashTable(3, -10)).toThrow('Illegal load factor');
      });
    });

    describe('Test empty Hash table', () => {
      beforeEach(() => {
        ht = new HashTable();
      });

      test('Size should be 0, isEmpty should be true, toString should be an empty obj', () => {
        expect(ht.size()).toBe(0);
        expect(ht.isEmpty()).toBeTruthy();
        expect(ht.toString()).toBe('{}');
      });

      test('[Symbol.iterator]().next().done should be true', () => {
        expect(ht[Symbol.iterator]().next().done).toBeTruthy();
      });

      test('keys, values should be empty array', () => {
        expect(ht.keys()).toStrictEqual([]);
        expect(ht.values()).toStrictEqual([]);
      });

      test('remove, get any keys should be null', () => {
        expect(ht.remove()).toBeNull();
        expect(ht.remove(3)).toBeNull();
        expect(ht.get()).toBeNull();
        expect(ht.get('4')).toBeNull();
      });

      test('hasKey, contains any keys should be false', () => {
        expect(ht.hasKey()).toBeFalsy();
        expect(ht.hasKey('hello')).toBeFalsy();
        expect(ht.contains()).toBeFalsy();
        expect(ht.contains('hi')).toBeFalsy();
      });
    });

    describe('Test adding/inserting/putting new element to the hash table', () => {
      beforeEach(() => {
        ht = new HashTable();
      });

      test('Add/Insert/Put null key should throw an error', () => {
        expect(() => ht.add(null, 5)).toThrow('Invalid Key');
        expect(() => ht.add('', 5)).toThrow('Invalid Key');
      });

      test('Add/Insert/Put new element to the table', () => {
        expect(ht.add(1, 5)).toBeNull();
        expect(ht.size()).toBe(1);

        expect(ht.insert(4, 15)).toBeNull();
        expect(ht.size()).toBe(2);

        expect(ht.put(0, 15)).toBeNull();
        expect(ht.size()).toBe(3);
      });

      test('Update existing key with new value', () => {
        expect(ht.put(1, 5)).toBeNull();
        expect(ht.size()).toBe(1);
        expect(ht.get(1)).toBe(5);

        expect(ht.insert(1, 10)).toBe(5);
        expect(ht.size()).toBe(1);
        expect(ht.get(1)).toBe(10);

        expect(ht.add(1, 20)).toBe(10);
        expect(ht.size()).toBe(1);
        expect(ht.get(1)).toBe(20);
        expect(ht.toString()).toBe('{1: 20}');
      });
    });

    describe('Test non-empty hash table', () => {
      const remove = () => {
        ht.remove('A');
        ht.remove('E');
        ht.remove('F');
        ht.remove('katy');
        ht.remove('kitten');
        ht.remove('thomas');
      };

      beforeEach(() => {
        ht = new HashTable();
        ht.add('john', 30);
        ht.add('kitten', 2);
        ht.add('katy', 3);
        ht.add('josh', 0);
        ht.add('thomas', 10);
        ht.add('A', 3);
        ht.add('D', 5);
        ht.add('F', 35);
        ht.add('E', 60);
        ht.add('X', 23);

        expect(ht.size()).toBe(10);
      });

      test('Hash table iterator should iterate through all the keys/values of the table', () => {
        for (let key of ht) expect(ht.contains(key));

        expect(() => {
          for (let key of ht) ht.insert('elena', 5);
        }).toThrow('Concurrent Modification');
      });

      test('keys() and values() should return an array of keys and values respectively', () => {
        for (let key of ht.keys()) expect(ht.hasKey(key));

        const keys = ht.keys();
        let i = 0;
        for (let value of ht.values()) expect(ht.get(keys[i++])).toBe(value);
      });

      test('remove() should remove entries from the table', () => {
        expect(ht.remove(3)).toBeNull();
        expect(ht.size()).toBe(10);

        expect(ht.remove('X')).toBe(23);
        expect(ht.size()).toBe(9);
        expect(ht.hasKey('X')).toBeFalsy();
      });

      test('test remove and hasKey together', () => {
        remove();
        expect(ht.hasKey('X')).toBe(true);
      });

      test('test remove and insert together', () => {
        remove();
        expect(ht.add('X', 4)).toBe(23);
        expect(ht.insert('thomas', 40)).toBeNull();
      });

      test('test remove and get together', () => {
        remove();
        expect(ht.get('X')).toBe(23);
      });
    });
  });
};

testHashTable(HashTableSeparateChaining, 'Separate Chaining');
testHashTable(HashTableLinearProbing, 'Open Addressing - Linear Probing');
testHashTable(HashTableQuadraticProbing, 'Open Addressing - Quadratic Probing');
