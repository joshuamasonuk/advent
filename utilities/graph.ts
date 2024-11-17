class Edge<T, U> {
  readonly x: T;
  readonly y: T;

  readonly value: U;

  constructor(x: T, y: T, value: U) {
    this.x = x;
    this.y = y;

    this.value = value;
  }
}

export class Graph<T, U> {
  edges: Edge<T, U>[] = [];
  vertices = new Set<T>();

  addEdge(x: T, y: T, value: U): void {
    this.edges.push(new Edge(x, y, value));
  }

  addVertex(name: T): void {
    this.vertices.add(name);
  }

  adjacent(x: T, y: T): boolean {
    return this.edges.filter((edge) => edge.x === x && edge.y === y).length > 0;
  }

  getEdgeValue(x: T, y: T): U {
    const edge = this.edges.find((edge) => edge.x === x && edge.y === y);

    if (!edge) {
      throw new Error("Vertices are not adjacent.");
    }

    return edge.value;
  }
}
