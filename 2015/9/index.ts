import { FileHandle, open } from "fs/promises";
import path from "path";

class Graph {
  edges: Edge[] = [];
  vertices = new Set<string>();

  addEdge(a: string, b: string, distance: number): void {
    this.edges.push(new Edge(a, b, distance));
  }

  addVertex(name: string): void {
    this.vertices.add(name);
  }

  getEdgeValue(a: string, b: string): number {
    const edge = this.edges.find(
      (edge) => [a, b].includes(edge.a) && [a, b].includes(edge.b),
    );

    if (!edge) {
      throw new Error("Failed to retrieve edge.");
    }

    return edge.distance;
  }
}

class Edge {
  readonly a: string;
  readonly b: string;

  readonly distance: number;

  constructor(a: string, b: string, distance: number) {
    this.a = a;
    this.b = b;
    this.distance = distance;
  }
}

const getPermutations = <T>(array: T[]) => {
  const result: T[][] = [];

  const swap = (array: T[], a: number, b: number): void => {
    const temporary = array[a];

    array[a] = array[b];
    array[b] = temporary;
  };

  const permute = (length: number, array: T[]): void => {
    if (length === 1) {
      result.push(array.slice());

      return;
    }

    permute(length - 1, array);

    for (let i = 0; i < length - 1; i++) {
      if (length % 2 === 0) {
        swap(array, i, length - 1);
      } else {
        swap(array, 0, length - 1);
      }

      permute(length - 1, array);
    }
  };

  permute(array.length, array);

  return result;
};

(async () => {
  let handle: FileHandle | null = null;

  try {
    handle = await open(path.join(__dirname, "input.txt"));

    const graph = new Graph();

    for await (const line of handle.readLines()) {
      const parts = line.split(" ");

      graph.addVertex(parts[0]);
      graph.addVertex(parts[2]);

      graph.addEdge(parts[0], parts[2], parseInt(parts[4]));
    }

    const permutations = getPermutations(Array.from(graph.vertices));

    let shortest = Infinity;
    let longest = 0;

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
