import { FileHandle, open } from "fs/promises";
import path from "path";

abstract class Source {
  abstract get signal(): number;
}

abstract class DualSource<T> extends Source {
  protected readonly source1: Source;
  protected readonly source2: T;

  constructor(source1: Source, source2: T) {
    super();

    this.source1 = source1;
    this.source2 = source2;
  }
}

class BitwiseAND extends DualSource<Source> {
  get signal(): number {
    return this.source1.signal & this.source2.signal;
  }
}

class BitwiseNOT extends Source {
  private readonly source: Source;

  constructor(source: Source) {
    super();

    this.source = source;
  }

  get signal(): number {
    return ~this.source.signal;
  }
}

class BitwiseOR extends DualSource<Source> {
  get signal(): number {
    return this.source1.signal | this.source2.signal;
  }
}

class LeftShift extends DualSource<number> {
  get signal(): number {
    return this.source1.signal << this.source2;
  }
}

class RightShift extends DualSource<number> {
  get signal(): number {
    return this.source1.signal >> this.source2;
  }
}

class Value extends Source {
  private readonly source: number;

  constructor(source: number) {
    super();

    this.source = source;
  }

  get signal(): number {
    return this.source;
  }
}

class Wire extends Source {
  source: Source | null = null;

  constructor(source?: Source) {
    super();

    if (source) this.source = source;
  }

  get signal(): number {
    if (!this.source) {
      throw new Error("Unable to return signal where source is null.");
    }

    const result = this.source.signal;

    this.source = new Value(result);

    return result;
  }
}

const buildCircuit = (instructions: string[]): Map<string, Wire> => {
  const circuit = new Map<string, Wire>();

  for (const instruction of instructions) {
    const parts = instruction.split(" ");

    const identifier = parts.pop();

    if (!identifier) {
      continue;
    }

    const wire = getWire(identifier, circuit);

    let source: Source | null = null;

    switch (parts.length) {
      case 2:
        if (/^[0-9]+$/.test(parts[0])) {
          source = new Value(parseInt(parts[0]));
        } else {
          source = getWire(parts[0], circuit);
        }
        break;
      case 3:
        source = new BitwiseNOT(getWire(parts[1], circuit));
        break;
      case 4:
        switch (parts[1]) {
          case "AND":
            if (/^[0-9]+$/.test(parts[0])) {
              source = new BitwiseAND(
                new Value(parseInt(parts[0])),
                getWire(parts[2], circuit),
              );
            } else {
              source = new BitwiseAND(
                getWire(parts[0], circuit),
                getWire(parts[2], circuit),
              );
            }
            break;
          case "LSHIFT":
            source = new LeftShift(
              getWire(parts[0], circuit),
              parseInt(parts[2]),
            );
            break;
          case "OR":
            source = new BitwiseOR(
              getWire(parts[0], circuit),
              getWire(parts[2], circuit),
            );
            break;
          case "RSHIFT":
            source = new RightShift(
              getWire(parts[0], circuit),
              parseInt(parts[2]),
            );
            break;
        }
        break;
    }

    if (!source) {
      throw new Error("Failed to create source.");
    }

    wire.source = source;
  }

  return circuit;
};

const getWire = (identifier: string, circuit: Map<string, Wire>): Wire => {
  let wire: Wire | null = null;

  if (circuit.has(identifier)) {
    wire = circuit.get(identifier) ?? null;
  } else {
    wire = new Wire();

    circuit.set(identifier, wire);
  }

  if (!wire) {
    throw new Error("Failed to retrieve wire.");
  }

  return wire;
};

(async () => {
  let handle: FileHandle | null = null;

  try {
    handle = await open(path.join(__dirname, "input.txt"));

    const instructions: string[] = [];

    for await (const line of handle.readLines()) {
      instructions.push(line);
    }

    const circuit1 = buildCircuit(instructions);

    const a = circuit1.get("a")?.signal;

    // What signal is ultimately provided to wire "a"?
    console.log(a);

    const circuit2 = buildCircuit(instructions);

    getWire("b", circuit2).source = new Value(a ? a : 0);

    // What new signal is ultimately provided to wire "a"?
    console.log(circuit2.get("a")?.signal);
  } catch (error) {
    console.error(error);
  } finally {
    handle?.close();
  }
})();
