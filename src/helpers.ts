export function setDifference<T>(set1: Set<T>, set2: Set<T>): Set<T> {
  const output: Set<T> = new Set();

  for (const element of set1) {
    if (!set2.has(element)) {
      output.add(element);
    }
  }

  return output;
}

export function ceilDate(date: Date): Date {
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setDate(date.getDate() + 1);

  return date;
}

export function mock<T>(): T {
  return {} as unknown as T;
}
