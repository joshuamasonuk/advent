import { FileHandle, open } from "fs/promises";
import path from "path";

enum Method {
  "E",
  "GT",
  "LT",
}

class Aunt {
  akitas?: number;
  cars?: number;
  cats?: number;
  children?: number;
  goldfish?: number;
  perfumes?: number;
  pomeranians?: number;
  samoyeds?: number;
  trees?: number;
  vizslas?: number;

  constructor(
    akitas?: number,
    cars?: number,
    cats?: number,
    children?: number,
    goldfish?: number,
    perfumes?: number,
    pomeranians?: number,
    samoyeds?: number,
    trees?: number,
    vizslas?: number,
  ) {
    this.akitas = akitas;
    this.cars = cars;
    this.cats = cats;
    this.children = children;
    this.goldfish = goldfish;
    this.perfumes = perfumes;
    this.pomeranians = pomeranians;
    this.samoyeds = samoyeds;
    this.trees = trees;
    this.vizslas = vizslas;
  }
}

const compare = (
  a: number | undefined,
  b: number | undefined,
  method = Method.E,
): boolean => {
  let match = true;

  if (a !== undefined && b !== undefined) {
    switch (method) {
      case Method.E:
        if (a !== b) {
          match = false;
        }
        break;
      case Method.GT:
        if (a <= b) {
          match = false;
        }
        break;
      case Method.LT:
        if (a >= b) {
          match = false;
        }
        break;
    }
  }

  return match;
};

const isMatch = (a: Aunt, b: Aunt, accurate = false): boolean => {
  return (
    compare(a.akitas, b.akitas) &&
    compare(a.cars, b.cars) &&
    compare(a.cats, b.cats, accurate ? Method.GT : Method.E) &&
    compare(a.children, b.children) &&
    compare(a.goldfish, b.goldfish, accurate ? Method.LT : Method.E) &&
    compare(a.perfumes, b.perfumes) &&
    compare(a.pomeranians, b.pomeranians, accurate ? Method.LT : Method.E) &&
    compare(a.samoyeds, b.samoyeds) &&
    compare(a.trees, b.trees, accurate ? Method.GT : Method.E) &&
    compare(a.vizslas, b.vizslas)
  );
};

(async () => {
  let handle: FileHandle | null = null;

  try {
    handle = await open(path.join(__dirname, "input.txt"));

    const actual = new Aunt(0, 2, 7, 3, 5, 1, 3, 2, 3, 0);

    const aunts: Aunt[] = [];

    for await (const line of handle.readLines()) {
      let properties = line.match(/[a-z]+: \d+/g);

      if (!properties?.length) {
        continue;
      }

      const aunt = new Aunt();

      for (const property of properties) {
        const parts = property.split(": ");

        const value = parseInt(parts[1]);

        if (Object.hasOwn(aunt, parts[0])) {
          aunt[parts[0] as keyof Aunt] = value;
        }
      }

      aunts.push(aunt);
    }

    for (let i = 0; i < aunts.length; i++) {
      const aunt = aunts[i];

      if (isMatch(aunt, actual)) {
        // What is the number of the Sue that got you the gift?
        console.log(i + 1);
      }

      if (isMatch(aunt, actual, true)) {
        // What is the number of the real Aunt Sue?
        console.log(i + 1);
      }
    }
  } catch (error) {
    console.error(error);
  } finally {
    handle?.close();
  }
})();
