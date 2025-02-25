const CYRB_CACHE: { [key: string]: [number, number, number, number] } = {};
const SFC_CACHE: { [key: string]: number } = {};
const letters = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
];

const uppercase = letters.map((l) => l.toUpperCase());
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const chars = [...letters, ...uppercase, ...numbers];

function cyrb128(str: string) {
  if (CYRB_CACHE[str]) return CYRB_CACHE[str];
  let h1 = 1779033703,
    h2 = 3144134277,
    h3 = 1013904242,
    h4 = 2773480762;
  for (let i = 0, k; i < str.length; i++) {
    k = str.charCodeAt(i);
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }
  h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
  h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
  h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
  h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
  (h1 ^= h2 ^ h3 ^ h4), (h2 ^= h1), (h3 ^= h1), (h4 ^= h1);
  CYRB_CACHE[str] = [h1 >>> 0, h2 >>> 0, h3 >>> 0, h4 >>> 0];
  return CYRB_CACHE[str];
}

function sfc32(a: number, b: number, c: number, d: number) {
  const key = `${a},${b},${c},${d}`;

  return function () {
    if (SFC_CACHE[key]) return SFC_CACHE[key];
    a |= 0;
    b |= 0;
    c |= 0;
    d |= 0;
    let t = (((a + b) | 0) + d) | 0;
    d = (d + 1) | 0;
    a = b ^ (b >>> 9);
    b = (c + (c << 3)) | 0;
    c = (c << 21) | (c >>> 11);
    c = (c + t) | 0;

    SFC_CACHE[key] = (t >>> 0) / 4294967296;
    return SFC_CACHE[key];
  };
}

export class Random {
  seed: string = (Date.now() * Math.random()).toString();
  private generator: () => number;
  private count: number = 0;
  private UUID_CACHE = new Set();
  private DICTIONARY = new Map();

  constructor(seed?: string) {
    if (seed != undefined) this.seed = String(seed);
    const hash = cyrb128(this.seed);
    this.generator = sfc32(hash[0], hash[1], hash[2], hash[3]);
  }

  static number(min = 0, max = 100, digits = 0) {
    return new Random().number(min, max, digits);
  }

  static from(value: unknown) {
    return new Random().from(value);
  }

  static shuffle<T>(array: Array<T>) {
    return new Random().shuffle(array);
  }

  static boolean(percent = 50) {
    return new Random().boolean(percent);
  }

  static uuid(length = 50) {
    return new Random().uuid(length);
  }

  static pop<T>(arr: T[]) {
    return new Random().pop(arr);
  }

  number(min = 0, max = 100, digits = 0) {
    const originalMin = min;
    const originalMax = max;
    min = Math.min(originalMin, originalMax);
    max = Math.max(originalMin, originalMax);

    const result = this.generator() * (max - min) + min;
    this.count++;
    const hash = cyrb128(this.seed + this.count);
    this.generator = sfc32(hash[0], hash[1], hash[2], hash[3]);

    if (digits < 1) return Math.round(result);

    return Number(result.toFixed(digits));
  }

  from(value: unknown) {
    if (typeof value === "string" || Array.isArray(value)) {
      const random = this.number(0, value.length - 1) as keyof typeof value;
      return value[random];
    }

    if (typeof value === "object" && value != null) {
      const keys = Object.keys(value as any);
      const random = this.number(0, keys.length - 1);
      const key = keys[random] as keyof typeof value;
      return value[key];
    }
  }

  shuffle<T>(array: Array<T>): Array<T> {
    const copy = [...array];
    let currentIndex = copy.length;

    while (currentIndex != 0) {
      let randomIndex = Math.floor(this.number(0, 1, 100) * currentIndex);
      currentIndex--;
      [copy[currentIndex], copy[randomIndex]] = [
        copy[randomIndex],
        copy[currentIndex],
      ];
    }
    return copy;
  }

  boolean(percent = 50) {
    const random = this.number(0, 100);
    return Boolean(random <= percent);
  }

  pop<T>(arr: T[]) {
    const popped: T = this.from(arr);
    const index = arr.indexOf(popped);
    arr.splice(index, 1);
    return popped;
  }

  uuid(length = 10) {
    const generate = () => {
      let uuid = "";
      const dictionary = this.shuffle(chars);
      for (let i = 0; i < length; i++) uuid += this.from(dictionary);
      return uuid;
    };

    const tries = 10;
    let uuid = "";

    for (let i = 0; i < tries; i++) {
      uuid = generate();
      if (this.UUID_CACHE.has(uuid)) continue;

      this.UUID_CACHE.add(uuid);
      return uuid;
    }

    console.error("Combinações esgotadas! Utilizando UUID duplicado...");
    return uuid;
  }

  encode(value: any, level = 5) {
    const key = this.uuid(level);
    this.DICTIONARY.set(key, value);
    return key;
  }

  decode(key: string) {
    return this.DICTIONARY.get(key);
  }

  [Symbol.toPrimitive]() {
    return this.number();
  }
}
