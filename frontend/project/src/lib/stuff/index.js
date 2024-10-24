export function toCamelCase(str) {
  if (!str?.includes("_")) {
    return str;
  }
  return str?.replace(/_([a-z])/g, function (match, letter) {
    return letter.toUpperCase();
  });
}

export function ArrayAtPolyfil(arr, index) {
  const normalizedIndex = index < 0 ? arr?.length + index : index;
  return Array.isArray(arr) &&
    normalizedIndex >= 0 &&
    normalizedIndex < arr?.length
    ? arr[normalizedIndex]
    : undefined;
}
