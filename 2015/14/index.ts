import { FileHandle, open } from "fs/promises";
import path from "path";

enum Status {
  "flying",
  "resting",
}

class Reindeer {
  readonly energy: number;
  readonly rest: number;
  readonly speed: number;

  duration = 0;
  points = 0;
  status = Status.flying;
  travelled = 0;

  constructor(energy: number, rest: number, speed: number) {
    this.energy = energy;
    this.rest = rest;
    this.speed = speed;
  }
}

(async () => {
  let handle: FileHandle | null = null;

  try {
    handle = await open(path.join(__dirname, "input.txt"));

    const reindeer: Reindeer[] = [];

    for await (const line of handle.readLines()) {
      const parts = line.split(" ");

      reindeer.push(
        new Reindeer(
          parseInt(parts[6]),
          parseInt(parts[13]),
          parseInt(parts[3]),
        ),
      );
    }

    for (let i = 0; i < 2503; i++) {
      for (const deer of reindeer) {
        deer.duration += 1;

        if (deer.status === Status.flying) {
          deer.travelled += deer.speed;

          if (deer.duration === deer.energy) {
            deer.status = Status.resting;
            deer.duration = 0;
          }
        } else {
          if (deer.duration === deer.rest) {
            deer.status = Status.flying;
            deer.duration = 0;
          }
        }
      }

      reindeer.sort((a, b) => b.travelled - a.travelled)[0].points += 1;
    }

    // What distance has the winning reindeer travelled?
    console.log(reindeer[0].travelled);

    // How many points does the winning reindeer have?
    console.log(reindeer.sort((a, b) => b.points - a.points)[0].points);
  } catch (error) {
    console.error(error);
  } finally {
    handle?.close();
  }
})();
