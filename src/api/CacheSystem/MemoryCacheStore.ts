export type CacheKey = string | number | symbol;

export interface Cache<K, V> {
  setKey(key: K, value: V): V;
  getKey(key: K): V;
  hasKey(key: K): boolean;
  deleteKey(key: K): void;
  clearAll(): void;
}

class CacheStore<V> implements Cache<CacheKey, V> {
  _cache: Map<CacheKey, V> = new Map();
  usage: CacheKey[] = [];
  limit: number = 0;

  constructor(limit: number) {
    this.limit = limit;
  }

  getSize() {
    return this._cache.size;
  }

  setKey(key: CacheKey, value: V): V {
    this._cache.set(key, value);
    this._promote(key);

    if (this.limit > 0 && this._cache.size > this.limit) {
      const old = this.usage[this.usage.length - 1];
      this.deleteKey(old, true);
    }

    return value
  }

  getKey(key: CacheKey): V {
    const item = this._cache.get(key);
    if (!item) {
      return undefined!;
    }

    this._promote(key);
    return item;
  }

  hasKey(key: CacheKey): boolean {
    const item = this._cache.get(key);
    return item !== undefined
  }

  deleteKey(key: CacheKey, isLast: boolean = false) {
    this._cache.delete(key);

    if (isLast) {
      this.usage.pop();
    } else {
      const idx = this.usage.indexOf(key);
      this.usage.splice(idx, 1);
    }
  }

  clearAll() {
    this._cache.clear();
    this.usage = [];
  }

  _promote(key: CacheKey): void {
    const idx = this.usage.indexOf(key);

    if (idx === -1) {
      this.usage.unshift(key);
    } else if (idx === 0) {
      return;
    } else {
      this.usage.splice(idx, 1);
      this.usage.unshift(key);
    }
  }
}

export const MemoryCacheStore = new CacheStore<Promise<any>>(10)
