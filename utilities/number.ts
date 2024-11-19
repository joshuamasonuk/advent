export const getCompositions = (
  value: number,
  parts = Infinity,
): number[][] => {
  const compositions: number[][] = [];

  for (let i = 1; i <= value; i++) {
    if (!(value - i) || !(parts - 1)) {
      compositions.push([value]);

      break;
    }

    const subCompositions = getCompositions(value - i, parts - 1);

    for (const subComposition of subCompositions) {
      compositions.push([i, ...subComposition]);
    }
  }

  return compositions;
};
