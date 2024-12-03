import { readFile } from "fs/promises";
import path from "path";

const deliver = (
  minimumPresents: number,
  calculatePresents: (house: number) => number,
): number => {
  let house = 1;
  let presents = 0;

  while (presents < minimumPresents) {
    presents = calculatePresents(house);

    house++;
  }

  return house - 1;
};

const getFactors = (a: number): number[] => {
  const factors = new Set<number>();

  factors.add(1);
  factors.add(a);

  const even = a % 2 === 0;
  const root = Math.sqrt(a);

  const increment = even ? 1 : 2;

  for (let factor = even ? 2 : 3; factor <= root; factor += increment) {
    if (a % factor !== 0) {
      continue;
    }

    factors.add(factor);

    const multiplier = a / factor;

    if (multiplier !== factor) {
      factors.add(multiplier);
    }
  }

  return Array.from(factors).sort((a, b) => a - b);
};

(async () => {
  try {
    const input = await readFile(path.join(__dirname, "input.txt"), {
      encoding: "utf-8",
    });

    const minimumPresents = parseInt(input);

    // What is the lowest house number?
    console.log(
      deliver(minimumPresents, (house) => {
        const factors = getFactors(house);

        return factors.reduce(
          (previous, current) => previous + current * 10,
          0,
        );
      }),
    );

    const record = new Map<number, number>();

    // With these changes, what is the new lowest house number?
    console.log(
      deliver(minimumPresents, (house) => {
        const factors = getFactors(house);

        return factors.reduce((previous, current) => {
          const count = record.get(current);

          if (count === 50) {
            return 0;
          }

          record.set(current, (count ?? 0) + 1);

          return previous + current * 11;
        }, 0);
      }),
    );
  } catch (error) {
    console.error(error);
  }
})();
