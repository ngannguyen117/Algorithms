/**
 * Union Find (Disjoint Set) implementation using Javascript (based on a William Fiset's Union Find Java implementation)
 *
 * @author Ngan Nguyen, ngan.tx.nguyen@gmail.com
 *
 * Date: 10/5/2020
 *
 * Union Find:
 *  - a data structure that keeps track of elements which are split into one or more disjoint sets.
 *  - has 2 primary operations (find, union)
 *    - find(element): find tells you which group element belongs to
 *    - union(elem1, elem2): union merges two groups together (elem1 belongs to group1, elem2 belongs to group2)
 *  - usage:
 *    - Kruskal's minimum spanning tree algorithm
 *    - Grid percolation (ex - if there a path from the bottom of a grid to the top of the grid)
 *    - Network connectivity (ex - if two nodes in a graph can connect to each other through a series of edges)
 *    - Least common ancestor in trees
 *    - Image processing
 *  - complexity: α is amortized constant time can be achieved by using path compression within find method
 *    - construction: O(n)
 *    - union: α(n)
 *    - find: α(n)
 *    - get component's size: α(n)
 *    - check if 2 nodes connected: α(n)
 *    - count number of components: O(1)
 */

/**
 * Union Find (Disjoin Set) implementation
 * @param {number} size the number of elements that we need to track
 */
export function UnionFind(size) {
  if (!size || size <= 0) throw new Error('Size is required, size > 0');

  let componentCount = size; // number of components in this UnionFind
  const componentSize = []; // the size of each component
  const parent = []; // parent[i] points to the parent of i, if parent[i] == i, then i is a root

  for (let i = 0; i < size; i++) {
    // initially each component has a size of 1 and a self root
    componentSize.push(1);
    parent.push(i);
  }

  /**
   * Find which component this element belong to. α(n).
   * Do path compression during this stage to achieve amortized constant time.
   * @param {number} elem
   * @returns {number} the component number that this element belong to (the root)
   */
  this.find = elem => {
    let root = elem;
    while (root !== parent[root]) root = parent[root];

    // path compression: for all elements from elem to root, change their parent to be equal to root
    while (elem !== root) {
      const next = parent[elem];
      parent[elem] = root;
      elem = next;
    }

    return root;
  };

  /**
   * Check whether elem1 and elem2 is in the same component
   * @param {number} elem1
   * @param {number} elem2
   * @returns {boolean} true if they're in the same component
   */
  this.connected = (elem1, elem2) => this.find(elem1) === this.find(elem2);

  /**
   * Get the size of the component that this element belongs to
   * @param {number} elem
   * @returns {number} the number of elements in the component elem belongs to
   */
  this.componentSize = elem => componentSize[this.find(elem)];

  /**
   * Get the number of elements that this UnionFind has
   * @returns {number} total number of elements
   */
  this.size = () => size;

  /**
   * Get the current number of components in this UnionFind
   * @returns {number} number of components
   */
  this.components = () => componentCount;

  /**
   * Unify the components contain elem1 and elem2
   * @param {number} elem1
   * @param {number} elem2
   */
  this.union = (elem1, elem2) => {
    if (this.connected(elem1, elem2)) return; // in same group already

    const root1 = this.find(elem1);
    const root2 = this.find(elem2);

    let newParent = root1;
    let child = root2;
    if (componentSize[root2] > componentSize[root1])
      [newParent, child] = [root2, root1];

    componentSize[newParent] += componentSize[child];
    parent[child] = newParent;

    componentCount--;
  };
}
