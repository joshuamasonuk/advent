import { createHash } from "crypto";
import { readFile } from "fs/promises";
import path from "path";

const search = (input: string, start: string): void => {
  let found = false;

  let index = 0;

  while (!found) {
    const hash = createHash("md5");

    hash.update(input + index);

    const result = hash.digest("hex");

    if (result.startsWith(start)) {
      found = true;

      console.log(index);
    }

    index++;
  }
};

(async () => {
  try {
    const input = await readFile(path.join(__dirname, "input.txt"), {
      encoding: "utf-8",
    });

    search(input, "00000");
    search(input, "000000");
  } catch (error) {
    console.error(error);
  }
})();
