# General notes on Graph theory

## Types of graphs

- **Undirected Graph**: is a graph in which edges have no orientation. The edge (u, v) is identical to edge (v, u).
- **Directed Graph**: (Digraph) is a graph in which edges have orientations. Edge (u, v) is an edge from u to v.
- **Weighted Graph**: many graphs can have edges that contain a certain weight to represent an arbitrary value such as cost, distance, quantity, etc. Edge (u, v, w) is an edge from u to v with a weight of w.
- **Tree**: is an undirected graph with no cycle. (A connected graph with N nodes and N-1 edges).
- **Rooted Tree**: is a tree with a designated root node where every edge either points away or towards the root node. When edges point away from the root node, it's called out-tree, otherwise it's an in-tree.
- **Directed Acylic Graphs**: (DAGs) are directed graphs with no cycles.
  - These graphs play an important role in representing structures with dependencies.
  - Several efficient algorithms exist to operate on DAGs.
  - All out-trees are DAGs (but not the other way around).
- **Bipartile Graph**: is a graph whose vertices can be split into two independent group U and V such that every edge connect between U and V. (The graph is 2 colorable. There is no odd cycle length).
- **Complete Graph**: is a graph where there is a unique edge between every pair of nodes.

## Represent graphs

- **Adjacency MATRIX**: is a very simple way to represent a graph using 2D array.

  ```
        A   B   C   D
    ------------------
    A | 0   4   1   9
    B | 3   0   6   11
    C | 4   1   0   2
    D | 4   5  -4   0

    [
      [0   4   1   9],
      [3   0   6   11],
      [4   1   0   2],
      [4   5  -4   0]
    ]
  ```

  - The idea is the cell m[i][j] represents the edge weight of going from node i to node j.
  - m[i][i] is usually 0.
  - Pros: Space efficiency for dense graph, edge weight look up is O(1)
  - Cons: Requires O(V^2) space and iterate over all edges take O(V^2)

- **Adjacency LIST**: is a way to represent a graph as a map from nodes to list of edges

  ```
    A -> [(B, 4), (C, 1)]
    B -> [(C, 6)]
    C -> [(A, 4), (B, 1), (D, 2)]
    D -> []

    {
      A: [(B, 4), (C, 1)]
      B: [(C, 6)]
      C: [(A, 4), (B, 1), (D, 2)]
      D: []
    }
  ```

  - Pros: Space efficiency for sparse graph, iterating over all edges is efficient
  - Cons: Less space efficient for dense graph, Edge weight look up is O(E)
