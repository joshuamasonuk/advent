import { readFile } from "fs/promises";
import path from "path";

const sum = (structure: unknown, ignoreRed: boolean = false): number => {
  let result = 0;

  const iterate = (value: unknown): void => {
    if (Array.isArray(value)) {
      for (const element of value) {
        iterate(element);
      }
    } else {
      switch (typeof value) {
        case "number":
          result += value;
          break;
        case "object":
          if (ignoreRed && Object.values(value as object).includes("red")) {
            break;
          }

          for (const key in value) {
            if (Object.hasOwn(value, key)) {
              iterate(value[key as keyof typeof value]);
            }
          }
          break;
      }
    }
  };

  iterate(structure);

  return result;
};

(async () => {
  try {
    const input = await readFile(path.join(__dirname, "input.txt"), {
      encoding: "utf-8",
    });

    const json = JSON.parse(input);

    // What is the sum of all numbers in the document?
    console.log(sum(json));

    console.log(sum(json, true));
  } catch (error) {
    console.error(error);
  }
})();
