import { FileHandle, open } from "fs/promises";
import path from "path";

const getSubsets = (array: number[], sum: number): number[][] => {
  const result: number[][] = [];

  const search = (index = 0, total = 0, set: number[] = []) => {
    if (total === sum) {
      result.push(set);

      return;
    }

    if (index === array.length) {
      return;
    }

    const newSum = total + array[index];

    if (newSum <= sum) {
      search(index + 1, newSum, set.concat(array[index]));
    }

    search(index + 1, total, set);
  };

  search();

  return result;
};

(async () => {
  let handle: FileHandle | null = null;

  try {
    handle = await open(path.join(__dirname, "input.txt"));

    const containers: number[] = [];

    for await (const line of handle.readLines()) {
      containers.push(parseInt(line));
    }

    const subsets = getSubsets(containers, 150);

    // How many combinations can exactly fit all 150 litres of eggnog?
    console.log(subsets.length);

    const lengths = Array.from(
      new Set(subsets.map((subset) => subset.length)),
    ).sort((a, b) => a - b);

    // How many combinations use the minimum number of containers?
    console.log(
      subsets.filter((subset) => subset.length === lengths[0]).length,
    );
  } catch (error) {
    console.error(error);
  } finally {
    handle?.close();
  }
})();
