export default class Utils {
  static nvv<T>(...values: Array<T | undefined | null>): T | null {
    for (const value of values) {
      if (value === undefined || value === null) continue;
      return value;
    }
    return null;
  }
}
