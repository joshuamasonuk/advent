import { readFile } from "fs/promises";
import path from "path";

const getNext = (password: string): string => {
  let result = increment(password);

  while (!isNext(result)) {
    result = increment(result);
  }

  return result;
};

const increment = (input: string): string => {
  let result = "";
  let value = toBase26(input) + 1;

  while (value >= 0) {
    result = ((value % 26) + 10).toString(36) + result;

    value = Math.floor(value / 26) - 1;
  }

  return result;
};

const isNext = (password: string): boolean => {
  const regex1 = /(?:[iol])/g;

  if ((password.match(regex1) || []).length > 0) {
    return false;
  }

  const regex2 = /([a-z])\1/g;

  const matches = password.match(regex2) || [];

  if (matches.length < 2 || matches.every((value) => value === matches[0])) {
    return false;
  }

  let hasStraight = false;

  for (let i = 1; i < password.length - 1; i++) {
    hasStraight = [
      parseInt(password[i - 1], 36),
      parseInt(password[i], 36) - 1,
      parseInt(password[i + 1], 36) - 2,
    ].every((value, _, array) => value === array[0]);

    if (hasStraight) {
      break;
    }
  }

  return hasStraight;
};

const toBase26 = (input: string): number => {
  let base26 = 0;

  for (const char of input) {
    base26 = base26 * 26 + parseInt(char, 36) - 9;
  }

  base26 -= 1;

  return base26;
};

(async () => {
  try {
    const input = await readFile(path.join(__dirname, "input.txt"), {
      encoding: "utf-8",
    });

    const result1 = getNext(input);

    // What should his next password be?
    console.log(result1);

    const result2 = getNext(result1);

    // What's the next one?
    console.log(result2);
  } catch (error) {
    console.error(error);
  }
})();
