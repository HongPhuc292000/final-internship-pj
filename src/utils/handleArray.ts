export const getMinArrayNumber = (arrayPrice: number[]): number => {
  const sortedArray = arrayPrice.sort((a, b) => a - b);
  return sortedArray[0];
};
export const getMaxArrayNumber = (arrayPrice: number[]): number => {
  const sortedArray = arrayPrice.sort((a, b) => b - a);
  return sortedArray[0];
};

export const getArrayPrice = <
  T extends { [index: string]: number },
  K extends keyof T,
>(
  arrayObject: T[],
  defaultKey: K,
  optionalKey: K,
): number[] => {
  const arrayResult = arrayObject.map((objectItem: T) => {
    if (objectItem[optionalKey]) {
      return objectItem[optionalKey];
    }
    return objectItem[defaultKey];
  });
  return arrayResult;
};
