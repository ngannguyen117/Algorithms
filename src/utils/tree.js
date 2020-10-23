export function TreeNode (id, parent = null) {
  const children = [];
  this.id = () => id;
  this.parent = () => parent;
  this.getChildren = () => children;
  this.addChildren = (...nodes) => children.push(...nodes);
}

export const isLeafNode = node => node.getChildren().length === 0;