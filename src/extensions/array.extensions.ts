enum EOrderDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

type TCommonFn<T, R> = (item: T, index: number, array: T[]) => R;
type TItemFn<T, R> = (item: T) => R;
type TTakeFields<T extends object, V> = {
  [K in keyof T]-?: T[K] extends V ? K : never;
}[keyof T];

declare global {
  // eslint-disable-next-line
  interface Array<T> {
    groupBy: typeof groupBy;
    keyBy: typeof keyBy;
    uniqBy: typeof uniqBy;
    uniq: typeof uniq;
    nonNullable: typeof nonNullable;
    toSet: typeof toSet;
    chunk: typeof chunk;
    exclude: typeof exclude;
    sortBy: typeof sortBy;

    /**
     * @deprecated The method has been renamed to keyBy, you should use keyBy instead of indexBy
     */
    indexBy: typeof indexBy;
  }
}

function getKeyCommonFn<T, Key>(keyOrFn: keyof T | TCommonFn<T, Key>) {
  return typeof keyOrFn === 'function'
    ? keyOrFn
    : (i: T): Key => i[keyOrFn] as unknown as Key;
}

function getKeyItemFn<T, Key>(keyOrFn: keyof T | TItemFn<T, Key>) {
  return typeof keyOrFn === 'function'
    ? keyOrFn
    : (i: T): Key => i[keyOrFn] as unknown as Key;
}

function groupBy<T extends object>(
  this: Array<T>,
  key: TTakeFields<T, number>,
): Map<number, T[]>;
function groupBy<T extends object>(
  this: Array<T>,
  key: TTakeFields<T, string>,
): Map<string, T[]>;
function groupBy<T, Key>(this: Array<T>, fn: TCommonFn<T, Key>): Map<Key, T[]>;
function groupBy<T, Key>(
  this: Array<T>,
  keyOrFn: keyof T | TCommonFn<T, Key>,
): Map<Key, T[]> {
  const fn = getKeyCommonFn(keyOrFn);

  const result = new Map<Key, T[]>();

  for (let i = 0; i < this.length; i++) {
    const key = fn(this[i], i, this);

    const group = result.get(key) ?? [];

    group.push(this[i]);

    result.set(key, group);
  }

  return result;
}

Object.defineProperty(Array.prototype, 'groupBy', {
  value: groupBy,
  configurable: false,
  enumerable: false,
  writable: false,
});

function keyBy<T extends object>(
  this: Array<T>,
  key: TTakeFields<T, number>,
): Map<number, T>;
function keyBy<T extends object>(
  this: Array<T>,
  key: TTakeFields<T, string>,
): Map<string, T>;
function keyBy<T, Key>(this: Array<T>, fn: TCommonFn<T, Key>): Map<Key, T>;
function keyBy<T, Key>(
  this: Array<T>,
  keyOrFn: keyof T | TCommonFn<T, Key>,
): Map<Key, T> {
  const fn = getKeyCommonFn(keyOrFn);

  const result = new Map<Key, T>();

  for (let i = 0; i < this.length; i++) {
    const key = fn(this[i], i, this);

    result.set(key, this[i]);
  }

  return result;
}

Object.defineProperty(Array.prototype, 'keyBy', {
  value: keyBy,
  configurable: false,
  enumerable: false,
  writable: false,
});

function indexBy<T extends object>(
  this: Array<T>,
  key: TTakeFields<T, number>,
): Map<number, T>;
function indexBy<T extends object>(
  this: Array<T>,
  key: TTakeFields<T, string>,
): Map<string, T>;
function indexBy<T, Key>(this: Array<T>, fn: TCommonFn<T, Key>): Map<Key, T>;
function indexBy<T, Key>(
  this: Array<T>,
  keyOrFn: keyof T | TCommonFn<T, Key>,
): Map<Key, T> {
  const fn = getKeyCommonFn(keyOrFn);

  const result = new Map<Key, T>();

  for (let i = 0; i < this.length; i++) {
    const key = fn(this[i], i, this);

    result.set(key, this[i]);
  }

  return result;
}

Object.defineProperty(Array.prototype, 'indexBy', {
  value: indexBy,
  configurable: false,
  enumerable: false,
  writable: false,
});

function uniqBy<T extends object>(
  this: Array<T>,
  key: TTakeFields<T, number>,
): Array<T>;
function uniqBy<T extends object>(
  this: Array<T>,
  key: TTakeFields<T, string>,
): Array<T>;
function uniqBy<T, Key>(this: Array<T>, fn: TCommonFn<T, Key>): Array<T>;
function uniqBy<T, Key>(
  this: Array<T>,
  keyOrFn: keyof T | TCommonFn<T, Key>,
): Array<T> {
  return [...this.indexBy(getKeyCommonFn(keyOrFn)).values()];
}

Object.defineProperty(Array.prototype, 'uniqBy', {
  value: uniqBy,
  configurable: false,
  enumerable: false,
  writable: false,
});

function uniq<T>(this: Array<T>) {
  return this.toSet().toArray();
}

Object.defineProperty(Array.prototype, 'uniq', {
  value: uniq,
  configurable: false,
  enumerable: false,
  writable: false,
});

function nonNullable<T>(this: Array<T>) {
  return this.filter((i): i is NonNullable<T> => i !== null && i !== undefined);
}

Object.defineProperty(Array.prototype, 'nonNullable', {
  value: nonNullable,
  configurable: false,
  enumerable: false,
  writable: false,
});

function toSet<T>(this: Array<T>): Set<T>;
function toSet<T, Key>(this: Array<T>, fn: TCommonFn<T, Key>): Set<Key>;
function toSet<T, Key>(this: Array<T>, fn?: TCommonFn<T, Key>) {
  return fn ? new Set(this.map(fn)) : new Set(this);
}

Object.defineProperty(Array.prototype, 'toSet', {
  value: toSet,
  configurable: false,
  enumerable: false,
  writable: false,
});

function chunk<T>(this: Array<T>, chunkSize: number) {
  const result: T[][] = [];

  for (let i = 0; i < this.length; i += chunkSize) {
    result.push(this.slice(i, i + chunkSize));
  }

  return result;
}

Object.defineProperty(Array.prototype, 'chunk', {
  value: chunk,
  configurable: false,
  enumerable: false,
  writable: false,
});

function exclude<T, U>(this: Array<T>, exclude: Array<T | U>) {
  return (
    exclude.length ? this.filter((i) => !exclude.includes(i)) : [...this]
  ) as T extends U ? T[] : Exclude<T, U>[];
}

Object.defineProperty(Array.prototype, 'exclude', {
  value: exclude,
  configurable: false,
  enumerable: false,
  writable: false,
});

function sortBy<T extends object>(
  this: Array<T>,
  key: TTakeFields<T, number>,
  direction?: EOrderDirection,
): Array<T>;
function sortBy<T extends object>(
  this: Array<T>,
  key: TTakeFields<T, string>,
  direction?: EOrderDirection,
): Array<T>;
function sortBy<T, Key>(
  this: Array<T>,
  fn: TItemFn<T, Key>,
  direction?: EOrderDirection,
): Array<T>;
function sortBy<T extends object, Key>(
  this: Array<T>,
  keyOrFn: keyof T | TItemFn<T, Key>,
  direction: EOrderDirection = EOrderDirection.ASC,
): T[] {
  const directionRatio = direction === EOrderDirection.ASC ? 1 : -1;

  const fn = getKeyItemFn(keyOrFn);

  return this.sort((a, b) => {
    const propertyA = fn(a);
    const propertyB = fn(b);

    if (propertyA > propertyB) {
      return directionRatio;
    }

    if (propertyA < propertyB) {
      return -directionRatio;
    }

    return 0;
  });
}

Object.defineProperty(Array.prototype, 'sortBy', {
  value: sortBy,
  configurable: false,
  enumerable: false,
  writable: false,
});

export {};
