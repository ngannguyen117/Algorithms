/**
 * Print out a tree with a tree-like shape. (based on William Fiset's TreePrinter written in Java)
 *
 * @author Ngan Nguyen
 *
 * Date: 10/7/2020
 *
 * @param root a tree's root
 */
export const printTree = root => {
  let treeStr = ''; // hold the string presentation of the tree
  const lines = []; //  [[string]]
  let level = []; // Node[]
  let next = []; // Node[]

  level.push(root);
  let nn = 1;
  let widest = 0;

  // Prepare an array to hold elements (null or not) of each tree level
  while (nn !== 0) {
    nn = 0;
    const line = []; // string[]
    for (let i = 0; i < level.length; i++) {
      if (!level[i]) {
        line.push(null);
        next.push(null);
        next.push(null);
      } else {
        const aa = `${level[i].data}`;
        line.push(aa);
        if (aa.length > widest) widest = aa.length;
        next.push(level[i].left);
        next.push(level[i].right);
        if (level[i].left) nn++;
        if (level[i].right) nn++;
      }
    }
    if (widest % 2 === 1) widest++;
    lines.push(line);

    const temp = level;
    level = next;
    next = temp;
    next = [];
  }

  // Print the tree
  let elemLength = lines[lines.length - 1].length * (widest + 4);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const mid = Math.floor(elemLength / 2) - 1;

    // Add the graph lines to connect between parent node to children node
    if (i > 0) {
      let space = '';
      let dash = '';
      for (let k = 0; k < mid; k++) {
        space = space.concat(' ');
        dash = dash.concat('_');
      }

      for (let j = 0; j < line.length; j++) {
        // if the elem is second, or fourth, etc, and either itself or its previous
        // sibling is not null, then we want to add a vertical line from parent to
        // the horizontal line. Otherwise we add an empty space to make the presentation even
        let c = ' ';
        if (j % 2 && (line[j - 1] || line[j])) c = '|'; // split line from parent
        treeStr = treeStr.concat(c);

        // if the current element is null, give it the full empty space width of an element
        if (!line[j]) treeStr = treeStr.concat(space + ' ' + space);
        // if the current element has a value, add extending horizontal line from itself to parent or vice versa
        else
          treeStr = treeStr.concat(
            j % 2 ? dash + '_' + space : space + '_' + dash
          );
      }

      treeStr = treeStr.concat('\n');

      // adding lines expanding from parent to child
      for (let j = 0; j < line.length; j++)
        if (!line[j])
          for (let k = 0; k < elemLength; k++) treeStr = treeStr.concat(' ');
        else treeStr = treeStr.concat(' ' + space + '|' + space); // line that child receive from parent

      treeStr = treeStr.concat('\n');
    }

    // Add space before and after each element based on the length each element can have
    for (let j = 0; j < line.length; j++) {
      const elem = line[j] ? line[j] : '';
      const leftGap = Math.ceil(elemLength / 2 - elem.length / 2);
      const rightGap = Math.floor(elemLength / 2 - elem.length / 2);

      let space = '';
      for (let k = 0; k < rightGap; k++) space = space.concat(' ');

      treeStr = treeStr.concat(leftGap > rightGap ? ' ' + space : space);
      treeStr = treeStr.concat(elem + space);
    }

    treeStr = treeStr.concat('\n');
    elemLength /= 2;
  }

  return treeStr;
};
