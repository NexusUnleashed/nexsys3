export const arraysIntersect = (arr1, arr2) => {
  if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
    return false;
  }
  if (arr1.length === 0 || arr2.length === 0) {
    return false;
  }
  const set = new Set(arr2);
  return arr1.some((item) => set.has(item));
};
