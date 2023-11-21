export const omitObject = <T, K extends [...(keyof T)[]]>(
  obj: T,
  keys: K,
): {
  [K2 in Exclude<keyof T, K[number]>]: T[K2];
} => {
  const newObject = {} as {
    [K in keyof typeof obj]: (typeof obj)[K];
  };
  let key: keyof typeof obj;
  for (key in obj) {
    if (!keys.includes(key)) {
      newObject[key] = obj[key];
    }
  }
  return newObject;
};
