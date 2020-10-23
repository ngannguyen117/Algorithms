import { rootTree } from '../rootTree';
import { treeCenter } from '../treeCenter';
import { treeHeight } from '../treeHeight';
import { addUndirectedEdge } from '../../../utils/graph';

test('Test rooting an undirected graph', () => {
  // 0 -- 1 --  2
  //          /   \
  //         3     6
  //       /  \   /  \
  //      4   5  7   8 
  let graph = new Map();
  addUndirectedEdge(graph, 0, 1);
  addUndirectedEdge(graph, 1, 2);
  addUndirectedEdge(graph, 2, 3);
  addUndirectedEdge(graph, 2, 6);
  addUndirectedEdge(graph, 3, 4);
  addUndirectedEdge(graph, 3, 5);
  addUndirectedEdge(graph, 6, 7);
  addUndirectedEdge(graph, 6, 8);

  // root the graph at the center node
  const centers = treeCenter(graph); // node #2
  let root = rootTree(graph, centers[0]);
  expect(root.id()).toBe(2);
  expect(root.getChildren().length).toBe(3);
  expect(treeHeight(root)).toBe(2);

  let expectedChildren = [1, 3, 6];
  for (let node of root.getChildren()) {
    expect(expectedChildren.includes(node.id())).toBeTruthy();
    if (node.id() === 1) expect(node.getChildren().length).toBe(1);
    if (node.id() === 3) expect(node.getChildren().length).toBe(2);
    if (node.id() === 6) expect(node.getChildren().length).toBe(2);
  }
    
  // root the graph at node #6
  root = rootTree(graph, 6);
  expect(root.id()).toBe(6);
  expect(root.getChildren().length).toBe(3);
  expect(treeHeight(root)).toBe(3);

  expectedChildren = [2, 7, 8];
  for (let node of root.getChildren()) {
    expect(expectedChildren.includes(node.id())).toBeTruthy();
    if (node.id() === 2) expect(node.getChildren().length).toBe(2);
    if (node.id() === 7) expect(node.getChildren().length).toBe(0);
    if (node.id() === 8) expect(node.getChildren().length).toBe(0);
  }
});
