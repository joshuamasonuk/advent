import { FileHandle, open } from "fs/promises";
import path from "path";

import { getPermutations } from "../../utilities/array";
import { Graph } from "../../utilities/graph";

const findGreatestChange = (
  graph: Graph<string, number>,
  permutations: string[][],
): number => {
  let greatest = -Infinity;

  for (const permutation of permutations) {
    let happiness = 0;

    for (let i = 0; i < permutation.length; i++) {
      const next = (i + 1) % permutation.length;

      happiness +=
        graph.getEdgeValue(permutation[i], permutation[next]) +
        graph.getEdgeValue(permutation[next], permutation[i]);
    }

    if (happiness > greatest) {
      greatest = happiness;
    }
  }

  return greatest;
};

(async () => {
  let handle: FileHandle | null = null;

  try {
    handle = await open(path.join(__dirname, "input.txt"));

    const graph = new Graph<string, number>();

    for await (const line of handle.readLines()) {
      const parts = line.replace(".", "").split(" ");

      graph.addVertex(parts[0]);
      graph.addVertex(parts[10]);

      const happiness = parseInt(parts[3]) * (parts[2] === "gain" ? 1 : -1);

      graph.addEdge(parts[0], parts[10], happiness);
    }

    const attendees = Array.from(graph.vertices);

    let permutations = getPermutations(attendees);

    // What is the total change in happiness for the optimal seating arrangement?
    console.log(findGreatestChange(graph, permutations));

    graph.addVertex("Joshua");

    for (const attendee of attendees) {
      graph.addEdge(attendee, "Joshua", 0);
      graph.addEdge("Joshua", attendee, 0);
    }

    permutations = getPermutations(Array.from(graph.vertices));

    // What is the total change in happiness when including yourself?
    console.log(findGreatestChange(graph, permutations));
  } catch (error) {
    console.error(error);
  } finally {
    handle?.close();
  }
})();
