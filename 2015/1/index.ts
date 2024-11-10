import { readFile } from "fs/promises";
import path from "path";

(async () => {
  try {
    const input = await readFile(path.join(__dirname, "input.txt"), {
      encoding: "utf-8",
    });

    let basementReached = false;

    let floor = 0;

    for (let i = 0; i < input.length; i++) {
      const char = input.charAt(i);

      floor += char === "(" ? 1 : char === ")" ? -1 : 0;

      if (!basementReached && floor === -1) {
        basementReached = true;

        // What is the position of the character that causes Santa to first enter the basement?
        console.log(i + 1);
      }
    }

    // To what floor do the instructions take Santa?
    console.log(floor);
  } catch (error) {
    console.error(error);
  }
})();
