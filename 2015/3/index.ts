import { readFile } from "fs/promises";
import path from "path";

const deliver = (grid: Map<string, number>, input: string): void => {
  let x = 0;
  let y = 0;

  for (const char of input) {
    switch (char) {
      case "^":
        y++;
        break;

      case "v":
        y--;
        break;

      case ">":
        x++;
        break;

      case "<":
        x--;
        break;
    }

    const key = x + "," + y;

    if (grid.has(key)) {
      grid.set(key, (grid.get(key) ?? 0) + 1);
    } else {
      grid.set(key, 1);
    }
  }
};

(async () => {
  try {
    const input = await readFile(path.join(__dirname, "input.txt"), {
      encoding: "utf-8",
    });

    let grid = new Map<string, number>();

    grid.set("0,0", 1);

    deliver(grid, input);

    // How many houses receive at least one present?
    console.log(grid.size);

    grid = new Map<string, number>();

    grid.set("0,0", 2);

    const { even, odd } = [...input].reduce(
      ({ even, odd }, current, index) =>
        index % 2 === 0
          ? { even: [...even, current], odd }
          : { odd: [...odd, current], even },
      { even: new Array<string>(), odd: new Array<string>() },
    );

    deliver(grid, even.join(""));
    deliver(grid, odd.join(""));

    // This year, how many houses receive at least one present?
    console.log(grid.size);
  } catch (error) {
    console.error(error);
  }
})();
