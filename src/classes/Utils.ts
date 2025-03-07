import { Position } from "./Field";

type FabricateArgs<T, C extends Object, P extends Array<any>> =
  | [callback: () => T]
  | [callback: (...args: P) => T, args: P]
  | [context: C, callback: (this: C) => T]
  | [context: C, callback: (this: C, ...args: P) => T, args: P];

export default class Utils {
  static nvv<T>(...values: Array<T | undefined | null>): T | null {
    for (const value of values) {
      if (value === undefined || value === null) continue;
      return value;
    }
    return null;
  }

  static fabricate<T>(callback: () => T): T;
  static fabricate<T, C extends any, P extends Array<any>>(
    callback: (...params: P) => T,
    params: P
  ): T;
  static fabricate<T, C extends Object>(
    context: C,
    callback: (this: C) => T
  ): T;
  static fabricate<T, C extends Object, P extends Array<any>>(
    context: C,
    callback: (this: C, ...params: P) => T,
    params: P
  ): T;
  static fabricate<T, C extends Object>(
    context: C,
    callback: (this: C) => T
  ): T;
  static fabricate<T, C extends Object, P extends Array<any>>(
    ...args: FabricateArgs<T, C, P>
  ): T {
    type ContextType = C | null;
    type CallbackType = ((...args: P) => T) | (() => T);
    type ParamsType = P | undefined;
    const [context, callback, params]: [ContextType, CallbackType, ParamsType] =
      typeof args[0] === "object"
        ? [
            args[0] as ContextType,
            args[1] as CallbackType,
            args[2] as ParamsType,
          ]
        : [null as ContextType, args[0] as CallbackType, args[1] as ParamsType];

    if (context && params) {
      return callback.call(context, ...params);
    }

    if (context) {
      return callback.call(context);
    }

    if (params) {
      return callback(...params);
    }

    return callback();
  }

  static around(
    x: number,
    y: number,
    horizontal?: "left" | "right",
    vertical?: "top" | "bottom"
  ): Position[] {
    const [vMin, vMax] = Utils.fabricate(() => {
      if (!vertical) return [-1, 1];
      if (vertical === "top") return [-1, 0];
      return [0, 1];
    });

    const [hMin, hMax] = Utils.fabricate(() => {
      if (!horizontal) return [-1, 1];
      if (horizontal === "left") return [-1, 0];
      return [0, 1];
    });

    const coordinates: Position[] = [];
    for (let i = vMin; i <= vMax; i++) {
      for (let j = hMin; j <= hMax; j++) {
        if (i === 0 && j === 0) continue;
        coordinates.push([x + j, y + i]);
      }
    }
    return coordinates;
  }

  static topLeft(x: number, y: number): Position[] {
    return Utils.around(x, y, "left", "top");
  }

  static topRight(x: number, y: number): Position[] {
    return Utils.around(x, y, "right", "top");
  }

  static bottomLeft(x: number, y: number): Position[] {
    return Utils.around(x, y, "left", "bottom");
  }

  static bottomRight(x: number, y: number): Position[] {
    return Utils.around(x, y, "right", "bottom");
  }
}
