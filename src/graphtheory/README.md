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

## Common Graph Theory Problems

- **Shortest path problem**
  - Given a weighted graph, find the shortest path of edges from node A to node B.
  - Algorithms: BFS (unweighted graph), Dijkstra's, Bellman-Ford, Floyd-Warshall, A\*
- **Connectivity**
  - Does there exist a path between node A and node B?
  - Find connected components
  - Typical solutions: use UnionFind or search algorithm like DFS.
- **Negative Cycles**
  - Does my weighted digraph have any negative cycles? If so, where?
  - There's some context that negative cycles are beneficial. For example: trading currency accross multiple exchanges like USD -> Euro -> Yen -> USD. Cycle through multiple currencies, exchange one to another and come back to the orignal currency with more money than you originally started.
  - Algorithms: Bellman-Ford, Floyd-Warshall
- **Strongly Connected Components**
  - SCCs can be thought of as self-contained cycles within a directed graph where every vertex in a given cycle can reach every other vertex in the same cycle.
  - An alias to finding connected components of an undirected graph.
  - Very useful in many algorithms as an intermediate step.
  - Algorithms: Tarjan's, Kosaraju's
- **Minimum Spanning Tree**
  - A MST is a subset of edges of a connected, edge-weighted graph that connects all vertices together, without any cycles and with the minimum possible total edge weight.
  - All MSTs of a graph have the same minimal cost but they're not identical.
  - MSTs are seen in many applications such as designing a least cost network, circuit design, transportation network etc.
  - Algorithms: Kruskal's, Prim's, Boruvka's
- **Network flow (max flow)**
  - Question: with an infinite input source, how much flow can we push through the network?
  - Suppose edges are the roads with cars, pipes with water, hallway packed with people. Flow represents the volume of water allowed to go through the pipes, the number of cars on the roads can sustain in traffic and the maximum number of people that can navigate through the hallway.
  - This is important because at some points, there will be a bottleneck that limits the amount of stuff we can allow to travel on the network. With this, we can identify the bottlenecks that slow down the whole network and fix the edges that have lower capacities.
  - Algorithms: Ford-Fulkerson, Edmonds-Karp, Dinic's
- **Traveling Salesman Problem**
  - Given a list of cities and the distance between each pair of cities, what is the shortest possible route that visits each city exactly once and returns to the original city.
  - Algorithms: Held-Karp, branch and bounce, approximattion algorithms
- **Bridges & Articulation Points**
  - A bridge (a cut edge) is any edge in a graph whose removal increase the number of connected components.
  - An articulation point (a cut vertex) is any node in a graph whose removal increase the number of connected components.
  - They hint at weak points, bottlenecks, or vulnerabilities of a graph.
