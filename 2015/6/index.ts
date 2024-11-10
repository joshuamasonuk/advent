import { FileHandle, open } from "fs/promises";
import path from "path";

const evaluate = <T>(
  grid: T[][],
  method: (previous: number, current: T) => number,
): void => {
  const result = grid.reduce(
    (previous, current) => previous + current.reduce(method, 0),
    0,
  );

  console.log(result);
};

const initialise = <T>(defaultValue: T): T[][] => {
  const grid = new Array<T[]>(1000);

  for (let i = 0; i < grid.length; i++) {
    grid[i] = new Array<T>(1000);

    for (let j = 0; j < grid[i].length; j++) {
      grid[i][j] = defaultValue;
    }
  }

  return grid;
};

const parseCoordinate = (coordinate: string): number[] => {
  return coordinate.split(",").map((value) => parseInt(value));
};

(async () => {
  let handle: FileHandle | null = null;

  try {
    handle = await open(path.join(__dirname, "input.txt"));

    const booleanGrid = initialise<boolean>(false);
    const numberGrid = initialise<number>(0);

    for await (const line of handle.readLines()) {
      const parts = line.split(" ");

      if (parts[0] === "turn") {
        parts.shift();
      }

      const [startX, startY] = parseCoordinate(parts[1]);
      const [endX, endY] = parseCoordinate(parts[3]);

      let booleanAction: (value: boolean) => boolean = () => false;
      let numberAction: (value: number) => number = (value) =>
        value > 0 ? value - 1 : 0;

      switch (parts[0]) {
        case "on":
          booleanAction = () => true;
          numberAction = (value) => value + 1;
          break;
        case "toggle":
          booleanAction = (value) => (value ? false : true);
          numberAction = (value) => value + 2;
          break;
      }

      for (let x = startX; x <= endX; x++) {
        for (let y = startY; y <= endY; y++) {
          booleanGrid[x][y] = booleanAction(booleanGrid[x][y]);
          numberGrid[x][y] = numberAction(numberGrid[x][y]);
        }
      }
    }

    // After following the instructions, how many lights are lit?
    evaluate(booleanGrid, (previous, current) => previous + (current ? 1 : 0));

    // What is the total brightness of all lights combined after following Santa's instructions?
    evaluate(numberGrid, (previous, current) => previous + current);
  } catch (error) {
    console.error(error);
  } finally {
    handle?.close();
  }
})();
