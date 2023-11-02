declare global {
  interface Map<K, V> {
    getOrFail(this: Map<K, V>, key: K, failMessage?: string): V;
    arrayValues(this: Map<K, V>): V[];
    arrayKeys(this: Map<K, V>): K[];
    arrayEntries(this: Map<K, V>): [K, V][];
  }
}

// type-coverage:ignore-next-line
Object.defineProperty(Map.prototype, 'getOrFail', {
  value: function <K, V>(
    this: Map<K, V>,
    key: K,
    failMessage = `Not found item by key (${key})`,
  ) {
    if (!this.has(key)) {
      throw new Error(failMessage);
    }

    return this.get(key)!;
  },
  configurable: false,
  enumerable: false,
  writable: false,
});

// type-coverage:ignore-next-line
Object.defineProperty(Map.prototype, 'arrayValues', {
  value: function <K, V>(this: Map<K, V>) {
    return [...this.values()];
  },
  configurable: false,
  enumerable: false,
  writable: false,
});

// type-coverage:ignore-next-line
Object.defineProperty(Map.prototype, 'arrayKeys', {
  value: function <K, V>(this: Map<K, V>) {
    return [...this.keys()];
  },
  configurable: false,
  enumerable: false,
  writable: false,
});

// type-coverage:ignore-next-line
Object.defineProperty(Map.prototype, 'arrayEntries', {
  value: function <K, V>(this: Map<K, V>) {
    return [...this.entries()];
  },
  configurable: false,
  enumerable: false,
  writable: false,
});

export {};
