declare global {
  // eslint-disable-next-line
  interface Set<T> {
    toArray: <T>(this: Set<T>) => Array<T>;
  }
}

Object.defineProperty(Set.prototype, 'toArray', {
  value: function <T>(this: Set<T>) {
    return [...this];
  },
  configurable: false,
  enumerable: false,
  writable: false,
});

export {};
