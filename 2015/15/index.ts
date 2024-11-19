import { FileHandle, open } from "fs/promises";
import path from "path";

import { getCompositions } from "../../utilities/number";

class Ingredient {
  readonly calories: number;
  readonly capacity: number;
  readonly durability: number;
  readonly flavour: number;
  readonly texture: number;

  constructor(
    calories: number,
    capacity: number,
    durability: number,
    flavour: number,
    texture: number,
  ) {
    this.calories = calories;
    this.capacity = capacity;
    this.durability = durability;
    this.flavour = flavour;
    this.texture = texture;
  }
}

const calculateHighScore = (
  ingredients: Ingredient[],
  exactCalories: number,
): number[] => {
  let caloriesHighScore = -Infinity;
  let highScore = -Infinity;

  for (const amounts of getCompositions(100, ingredients.length)) {
    let calories = 0;
    let capacity = 0;
    let durability = 0;
    let flavour = 0;
    let texture = 0;

    for (let i = 0; i < ingredients.length; i++) {
      const amount = amounts[i];

      calories += amount * ingredients[i].calories;
      capacity += amount * ingredients[i].capacity;
      durability += amount * ingredients[i].durability;
      flavour += amount * ingredients[i].flavour;
      texture += amount * ingredients[i].texture;
    }

    const score =
      (capacity < 0 ? 0 : capacity) *
      (durability < 0 ? 0 : durability) *
      (flavour < 0 ? 0 : flavour) *
      (texture < 0 ? 0 : texture);

    if (score > highScore) {
      highScore = score;
    }

    if (score > caloriesHighScore && calories === exactCalories) {
      caloriesHighScore = score;
    }
  }

  return [highScore, caloriesHighScore];
};

(async () => {
  let handle: FileHandle | null = null;

  try {
    handle = await open(path.join(__dirname, "input.txt"));

    const ingredients: Ingredient[] = [];

    for await (const line of handle.readLines()) {
      let parts = line.split(":");

      const properties = parts[1].trim().split(",");

      let calories = 0;
      let capacity = 0;
      let durability = 0;
      let flavour = 0;
      let texture = 0;

      for (const property of properties) {
        parts = property.trim().split(" ");

        const value = parseInt(parts[1]);

        switch (parts[0]) {
          case "calories":
            calories = value;
            break;
          case "capacity":
            capacity = value;
            break;
          case "durability":
            durability = value;
            break;
          case "flavor":
            flavour = value;
            break;
          case "texture":
            texture = value;
            break;
        }
      }

      ingredients.push(
        new Ingredient(calories, capacity, durability, flavour, texture),
      );
    }

    const [highScore, caloriesHighScore] = calculateHighScore(ingredients, 500);

    // What is the highest-scoring cookie you can make?
    console.log(highScore);
    // What is the highest-scoring cookie you can make with a calorie total of 500?
    console.log(caloriesHighScore);
  } catch (error) {
    console.error(error);
  } finally {
    handle?.close();
  }
})();
