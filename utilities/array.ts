export const getPermutations = <T>(array: T[]) => {
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
