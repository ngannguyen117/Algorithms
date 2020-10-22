import { UnionFind } from '../../datastructures/unionfind';
import { Edge } from '../../utils/graph';

/**
 * Find connected components of an undirected graph using Depth First Search algorithm
 * @param {Map<number, Edge[]} graph an adjaciency list representation of a graph
 * @returns {{components: number[], count: number}} components list and number of components
 */
export const findCCsDFS = (graph, size) => {
  let count = 0;
  const components = [];
  for (let i = 0; i < size; i++) components.push(-1);

  const dfs = index => {
    components[index] = count;
    const edges = graph.get(index);
    if (edges) for (let edge of edges)
      if (components[edge.to] === -1) dfs(edge.to);
  };

  for (let i = 0; i < size; i++)
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
export const findCCsUnionFind = (graph, size) => {
  const uf = new UnionFind(size);

  for (let i = 0; i < size; i++) {
    const edges = graph.get(i);
    if (edges) for (let edge of edges)
      uf.union(edge.from, edge.to);
  }

  return { components: uf.getComponents(), count: uf.getNumberOfComponents() };
};
