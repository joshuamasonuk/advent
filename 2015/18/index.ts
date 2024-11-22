import { FileHandle, open } from "fs/promises";
import path from "path";

const getValue = (grid: boolean[][], x: number, y: number): boolean => {
  if (x < 0 || y < 0 || x >= grid.length || y >= grid[x].length) {
    return false;
  }

  return grid[x][y];
};

const process = (
  grid: boolean[][],
  count: number,
  modifier = (_: boolean[][]) => {},
): number => {
  for (let i = 0; i < count; i++) {
    grid = tick(grid);

    modifier(grid);
  }

  return grid.reduce(
    (previous, current) => previous + current.filter((light) => light).length,
    0,
  );
};

const tick = (grid: boolean[][]): boolean[][] => {
  const newGrid: boolean[][] = [];

  for (let i = 0; i < grid.length; i++) {
    const row = grid[i];

    const newRow: boolean[] = [];

    for (let j = 0; j < row.length; j++) {
      const light = row[j];

      const neighbours: boolean[] = [
        getValue(grid, i - 1, j - 1),
        getValue(grid, i - 1, j),
        getValue(grid, i - 1, j + 1),
        getValue(grid, i, j - 1),
        getValue(grid, i, j + 1),
        getValue(grid, i + 1, j - 1),
        getValue(grid, i + 1, j),
        getValue(grid, i + 1, j + 1),
      ];

      const on = neighbours.filter((neighbour) => neighbour).length;

      newRow.push(light ? [2, 3].includes(on) : on === 3);
    }

    newGrid.push(newRow);
  }

  return newGrid;
};

const switchCornersOn = (grid: boolean[][]): void => {
  const firstRow = grid[0];

  firstRow[0] = true;
  firstRow[firstRow.length - 1] = true;

  const lastRow = grid[grid.length - 1];

  lastRow[0] = true;
  lastRow[lastRow.length - 1] = true;
};

(async () => {
  let handle: FileHandle | null = null;

  try {
    handle = await open(path.join(__dirname, "input.txt"));

    let grid: boolean[][] = [];

    for await (const line of handle.readLines()) {
      const row: boolean[] = [];

      for (const char of line) {
        row.push(char === "#");
      }

      grid.push(row);
    }

    let faultyGrid = grid.map((row) => row.slice());

    switchCornersOn(faultyGrid);

    // How many lights are on after 100 steps?
    console.log(process(grid, 100));

    // With the four corners always on, how many lights are on after 100 steps?
    console.log(process(faultyGrid, 100, switchCornersOn));
  } catch (error) {
    console.error(error);
  } finally {
    handle?.close();
  }
})();
