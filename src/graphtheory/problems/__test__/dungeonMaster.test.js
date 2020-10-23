import { dungeonMaster } from '../dungeonMaster';

test('DungonMaster function should correctly solve if it is possible to exit the dungeon', () => {
  let grid = [
    ['.','.','.','#','.','.','.'],
    ['.','#','.','.','.','#','.'],
    ['.','#','.','.','.','.','.'],
    ['.','.','#','#','.','.','.'],
    ['#','.','#','E','.','#','.']
  ];

  expect(dungeonMaster(grid, 0, 0)).toBe(9);

  grid = [
    ['.','.','.','#','.','.','.'],
    ['.','#','.','.','.','#','.'],
    ['.','#','.','.','.','.','.'],
    ['.','.','#','#','#','.','.'],
    ['#','.','#','E','#','#','.']
  ];
  expect(dungeonMaster(grid, 3, 1)).toBe(-1);
});
