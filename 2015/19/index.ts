import { FileHandle, open } from "fs/promises";
import path from "path";

class Replacement {
  readonly a: string;
  readonly b: string;

  constructor(a: string, b: string) {
    this.a = a;
    this.b = b;
  }
}

const calibrate = (molecule: string, replacements: Replacement[]): number => {
  const molecules = new Set<string>();

  for (const replacement of replacements) {
    const matches = molecule.match(new RegExp(replacement.a, "g"));

    if (!matches) {
      continue;
    }

    const regex = new RegExp(replacement.a, "y");

    for (let i = 0; i < matches.length; i++) {
      regex.lastIndex = molecule.indexOf(replacement.a, regex.lastIndex);

      molecules.add(molecule.replace(regex, replacement.b));
    }
  }

  return molecules.size;
};

const reduce = (molecule: string, replacements: Replacement[]): number => {
  let count = 0;

  let reducedMolecule = molecule;

  while (reducedMolecule !== "e") {
    for (const replacement of replacements) {
      const regex = new RegExp(replacement.b, "y");

      regex.lastIndex = reducedMolecule.indexOf(replacement.b, regex.lastIndex);

      if (regex.lastIndex === -1) {
        continue;
      }

      reducedMolecule = reducedMolecule.replace(regex, replacement.a);

      count++;
    }
  }

  return count;
};

(async () => {
  let handle: FileHandle | null = null;

  try {
    handle = await open(path.join(__dirname, "input.txt"));

    const replacements: Replacement[] = [];

    let molecule = "";

    for await (const line of handle.readLines()) {
      const separator = "=>";

      if (line.includes(separator)) {
        const parts = line.split(separator);

        replacements.push(new Replacement(parts[0].trim(), parts[1].trim()));
      } else if (line.trim().length > 0) {
        molecule = line;
      }
    }

    // How many distinct molecules can be created?
    console.log(calibrate(molecule, replacements));

    // What is the fewest number of steps to go from an electron to the medicine molecule?
    console.log(reduce(molecule, replacements));
  } catch (error) {
    console.error(error);
  } finally {
    handle?.close();
  }
})();
