import { Edge } from '../../utils/graph';
import { TreeNode } from '../../utils/tree';

/**
 * Root a tree from an undirected tree/graph. O(V + E)
 * @param {Map<number, Edge[]>} graph graph an adjaciency list representation of an undirected tree
 * @param {number} rootId an Id of the chosen index to be the root node
 * @returns {TreeNode} the root Node of the rooted tree
 */
export const rootTree = (graph, rootId) => {
  const root = new TreeNode(rootId);

  const buildTree = node => {
    for (let edge of graph.get(node.id())) {
      if (node.parent() && edge.to === node.parent().id()) continue;
      const child = new TreeNode(edge.to, node);
      node.addChildren(child);
      buildTree(child);
    }
    return node;
  };

  return buildTree(root);
};
