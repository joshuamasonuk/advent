import { FileHandle, open } from "fs/promises";
import path from "path";

(async () => {
  let handle: FileHandle | null = null;

  try {
    handle = await open(path.join(__dirname, "input.txt"));

    let count = 0;

    const regex =
      /(?=(?:.*[aeiou].*){3,})(?=(?:.*([a-z])\1.*))^(?:(?!ab|cd|pq|xy).)*$/g;

    let betterCount = 0;

    const betterRegex = /(?=(?:.*([a-z][a-z]).*\1.*))(?:.*([a-z]).\2.*)/g;

    for await (const line of handle.readLines()) {
      if ((line.match(regex) || []).length > 0) {
        count++;
      }

      if ((line.match(betterRegex) || []).length > 0) {
        betterCount++;
      }
    }

    // How many strings are nice?
    console.log(count);

    // How many strings are nice under these new rules?
    console.log(betterCount);
  } catch (error) {
    console.error(error);
  } finally {
    handle?.close();
  }
})();
