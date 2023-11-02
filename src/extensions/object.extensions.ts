declare global {
  interface ObjectConstructor {
    typedKeys<T extends object>(o: T): Array<keyof T>;
    typedFromEntries<T>(entries: Iterable<readonly [keyof T, T[keyof T]]>): T;
    typedEntries<T extends object>(o: T): [keyof T, NonNullable<T[keyof T]>][];
  }
}

// type-coverage:ignore-next-line
Object.defineProperty(Object.prototype, 'typedKeys', {
  value: function <T extends object>(o: T) {
    return Object.keys(o);
  },
  configurable: false,
  enumerable: false,
  writable: false,
});

// type-coverage:ignore-next-line
Object.defineProperty(Object.prototype, 'typedFromEntries', {
  value: function <T>(entries: Iterable<readonly [keyof T, T[keyof T]]>) {
    return Object.fromEntries(entries);
  },
  configurable: false,
  enumerable: false,
  writable: false,
});

// type-coverage:ignore-next-line
Object.defineProperty(Object.prototype, 'typedEntries', {
  value: function <T extends object>(o: T) {
    return Object.entries(o);
  },
  configurable: false,
  enumerable: false,
  writable: false,
});

export {};
