const STATIC_START_YEAR = 2012;

export function flattenNested<T>(nested: T[][]): T[] {
  return ([] as T[]).concat(...nested)
}

export function getYears(): number[] {
  const currentYear = new Date().getFullYear();
  return getNumbersFromRange(STATIC_START_YEAR, currentYear);
}

function getNumbersFromRange(start: number, end: number): number[] {
  return [...Array(end - start + 1)].map((_, i) => i + start);
}
