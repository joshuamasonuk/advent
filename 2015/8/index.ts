import { FileHandle, open } from "fs/promises";
import path from "path";

(async () => {
  let handle: FileHandle | null = null;

  try {
    handle = await open(path.join(__dirname, "input.txt"));

    // What is the number of characters of code for string literals?
    let code = 0;
    // What is the number of characters in memory?
    let memory = 0;
    // What is the number of characters to represent the newly encoded strings?
    let encoded = 0;

    const simpleEscapeRegex = /\\\\|\\"/g;
    const hexadecimalRegex = /\\x(?:[0-9]|[a-f]){2}/g;

    for await (const line of handle.readLines()) {
      code += line.length;

      const simpleEscapeCount = (line.match(simpleEscapeRegex) || []).length;
      const hexadecimalCount = (line.match(hexadecimalRegex) || []).length;

      memory += line.length - 2 - simpleEscapeCount - hexadecimalCount * 3;

      encoded += line.length + 4 + simpleEscapeCount * 2 + hexadecimalCount;
    }

    console.log(code - memory);
    console.log(encoded - code);
  } catch (error) {
    console.error(error);
  } finally {
    handle?.close();
  }
})();
