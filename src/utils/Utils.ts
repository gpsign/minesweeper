/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-wrapper-object-types */
import GridUtils from "./GridUtils";
import NumberUtils from "./NumberUtils";
import StringUtils from "./StringUtils";

type FabricateArgs<T, C extends Object, P extends Array<any>> =
  | [callback: () => T]
  | [callback: (...args: P) => T, args: P]
  | [context: C, callback: (this: C) => T]
  | [context: C, callback: (this: C, ...args: P) => T, args: P];

export default class Utils {
  static number = NumberUtils;
  static string = StringUtils;
  static grid = GridUtils;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static noop(..._args: unknown[]): void {}

  static nvv<T>(...values: Array<T | undefined | null>): T | null {
    for (const value of values) {
      if (value === undefined || value === null) continue;
      return value;
    }
    return null;
  }

  static fabricate<T>(callback: () => T): T;
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint, @typescript-eslint/no-unused-vars
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
}
