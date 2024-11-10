import { FileHandle, open } from "fs/promises";
import path from "path";

(async () => {
  let handle: FileHandle | null = null;

  try {
    handle = await open(path.join(__dirname, "input.txt"));

    let paper = 0;
    let ribbon = 0;

    for await (const line of handle.readLines()) {
      const dimensions = line.split("x");

      const sides = [
        parseInt(dimensions[0]),
        parseInt(dimensions[1]),
        parseInt(dimensions[2]),
      ];

      const area =
        2 * sides[0] * sides[1] +
        2 * sides[1] * sides[2] +
        2 * sides[0] * sides[2];

      const sortedSides = sides.sort((a, b) => a - b);

      const extra = sortedSides[0] * sortedSides[1];

      paper += area + extra;

      const perimeter = sortedSides[0] * 2 + sortedSides[1] * 2;

      ribbon += perimeter + sides[0] * sides[1] * sides[2];
    }

    // How many total feet of ribbon should they order?
    console.log(ribbon);

    // How many total square feet of wrapping paper should they order?
    console.log(paper);
  } catch (error) {
    console.error(error);
  } finally {
    handle?.close();
  }
})();
