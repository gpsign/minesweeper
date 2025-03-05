import { UpdateFunction } from "../hooks/useUpdate";
import Utils from "./Utils";

interface UpdaterRecord {
  [key: string]: UpdateFunction;
}

export class Store {
  private static _data = new Map<string, unknown>();
  private static _updaters = new Map<string, UpdaterRecord>();
  updater: UpdateFunction;

  constructor(updater: UpdateFunction) {
    this.updater = updater;
  }

  private static getUpdaters(key: string) {
    return Store._updaters.get(key) ?? {};
  }

  private static setUpdaters(key: string, value: UpdaterRecord) {
    return Store._updaters.set(key, value);
  }

  private static applyUpdater(key: string, updater: UpdateFunction) {
    const updaters = Store.getUpdaters(key);
    updaters[updater.id] = updater;
    Store.setUpdaters(key, updaters);
  }

  private static update(key: string) {
    const updaters = Store.getUpdaters(key);

    for (const update of Object.values(updaters)) {
      update();
    }
  }

  private boundUpdater(key: string) {
    Store.applyUpdater(key, this.updater);
  }

  static get<T = any>(key: string, def: T) {
    const value = Store._data.get(key) as T;
    return Utils.nvv(value, def);
  }

  static set(key: string, value: unknown) {
    Store._data.set(key, value);
    Store.update(key);
  }

  get<T = any>(key: string, def: T) {
    this.boundUpdater(key);
    return Store.get(key, def);
  }

  set(key: string, value: unknown) {
    Store.set(key, value);
  }
}
