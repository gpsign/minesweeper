export default class StringUtils {
  static normalize(str: string) {
    return str.replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase();
  }

  static capitalize(str: string) {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  }
}
