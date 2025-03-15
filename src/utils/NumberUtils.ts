export default class NumberUtils {
  static clamp(value: number, min: number, max: number) {
    if (max < min) [min, max] = [max, min];
    if (value < min) return min;
    if (value > max) return max;
    return value;
  }

  static map(
    val: number,
    minA: number,
    maxA: number,
    minB: number,
    maxB: number
  ) {
    return minB + ((val - minA) * (maxB - minB)) / (maxA - minA);
  }
}
