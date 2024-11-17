import { FileHandle, open } from "fs/promises";
import path from "path";

import { getPermutations } from "../../utilities/array";
import { Graph } from "../../utilities/graph";

(async () => {
  let handle: FileHandle | null = null;

  try {
    handle = await open(path.join(__dirname, "input.txt"));

    const graph = new Graph<string, number>();

    for await (const line of handle.readLines()) {
      const parts = line.split(" ");

      graph.addVertex(parts[0]);
      graph.addVertex(parts[2]);

      const distance = parseInt(parts[4]);

      graph.addEdge(parts[0], parts[2], distance);
      graph.addEdge(parts[2], parts[0], distance);
    }

    const permutations = getPermutations(Array.from(graph.vertices));

    let shortest = Infinity;
    let longest = -Infinity;

    for (const permutation of permutations) {
      let distance = 0;

      for (let i = 0; i < permutation.length - 1; i++) {
        distance += graph.getEdgeValue(permutation[i], permutation[i + 1]);
      }

      if (distance < shortest) {
        shortest = distance;
      }

      if (distance > longest) {
        longest = distance;
      }
    }

    // What is the distance of the shortest route?
    console.log(shortest);

    // What is the distance of the longest route?
    console.log(longest);
  } catch (error) {
    console.error(error);
  } finally {
    handle?.close();
  }
})();
