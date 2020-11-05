import { UnionFind } from '../../datastructures/unionfind';
import { ArrayStack } from '../../datastructures/stack';
import { Edge } from '../../utils/graph';

/**
 * Find connected components of an undirected graph using Depth First Search algorithm
 * @param {Map<number, Edge[]} graph an adjaciency list representation of a graph
 * @param {number} numVertices number of vertices in the graph
 * @returns {{components: number[], count: number}} components list and number of components
 */
export const findCCsDFS = (graph, numVertices) => {
  let count = 0;
  const components = Array(numVertices).fill(-1);

  const dfs = index => {
    components[index] = count;
    const edges = graph.get(index);
    if (edges) for (let edge of edges)
      if (components[edge.to] === -1) dfs(edge.to);
  };

  for (let i = 0; i < numVertices; i++)
    if (components[i] === -1) {
      count++;
      dfs(i);
    }

  return { components, count };
};

/**
 * Find connected components of an undirected graph using UnionFind data structure
 * @param {Map<number, Edge[]} graph an adjaciency list representation of a graph
 * @returns {{components: number[], count: number}} components list and number of components
 */
export const findCCsUnionFind = (graph, numVertices) => {
  const uf = new UnionFind(numVertices);

  for (let i = 0; i < numVertices; i++) {
    const edges = graph.get(i);
    if (edges) for (let edge of edges)
      uf.union(edge.from, edge.to);
  }

  return { components: uf.getComponents(), count: uf.getNumberOfComponents() };
};

/**
 * Strongly Connected Components are self-contained cycles within a directed graph
 * where every vertex in a given cycle can reach every other vertex in the same cycle.
 * For each component, there is no way to find a path that leaves the component and comes back.
 * SCCs of a directed graph are unique.
 * SCCs is a version of connected components but for directed graph
 * 
 * Low-link values: the low-link value of a node is the smallest node Id reachable from that node when doing a DFS (including itself)
 * 
 * @param {Map<number, Edge[]} graph an adjaciency list representation of a graph
 * @param {number} numVertices number of vertices in the graph
 * @returns {{components: number[], count: number}} components list and number of components
 */
export const findSCCsTarjans = (graph, numVertices) => {
  const dfs = at => {
    ids[at] = lowLink[at] = id++;
    stack.push(at);
    onStack[at] = true;

    const edges = graph.get(at);
    if (edges) for (let edge of edges) {
      if (ids[edge.to] == null) dfs(edge.to);
      if (onStack[edge.to])
        lowLink[at] = Math.min(lowLink[at], lowLink[edge.to]);
    }

    // On recursive callback, if we're at the root node (start of SCC)
    // empty the seen stack until back to root.
    if (ids[at] === lowLink[at]) {
      for (let nodeId = stack.pop(); ; nodeId = stack.pop()) {
        onStack[nodeId] = false;
        if (nodeId === at) break;
      }
      count++;
    }
  };

  let id = 0;
  let count = 0;
  const ids = [];
  const lowLink = [];
  const stack = new ArrayStack();
  const onStack = Array(numVertices).fill(false);

  for (let i = 0; i < numVertices; i++)
    if (ids[i] == null) dfs(i);

  return { components: lowLink, count };
};
