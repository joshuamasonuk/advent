import { readFile } from "fs/promises";
import path from "path";

const generate = (input: string, repeat: number): string => {
  let result = input;

  for (let i = 0; i < repeat; i++) {
    const parts = result.match(/([0-9])\1*/g);

    if (!parts) {
      throw new Error("Failed to deconstruct sequence.");
    }

    result = parts.reduce(
      (previous, current) => previous + current.length + current[0],
      "",
    );
  }

  return result;
};

(async () => {
  try {
    const input = await readFile(path.join(__dirname, "input.txt"), {
      encoding: "utf-8",
    });

    // What is the length of the result?
    console.log(generate(input, 40).length);

    // What is the length of the new result?
    console.log(generate(input, 50).length);
  } catch (error) {
    console.error(error);
  }
})();
